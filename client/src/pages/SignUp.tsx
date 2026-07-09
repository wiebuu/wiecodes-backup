import React, { useState } from 'react';
import { Mail, Lock, Users, Chrome } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { toast } from 'sonner';
import axios from 'axios';
import type { User } from 'firebase/auth';
import { auth } from '@/firebase';
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import EditProfileModal from '@/components/EditProfileModal';

const SignUp = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [loading, setLoading] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [initialProfile, setInitialProfile] = useState({
    username: '',
    bio: '',
    location: '',
    website: '',
    twitter: '',
    github: '',
  });

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFirebaseBackendLogin = async (firebaseUser: User, username?: string) => {
    try {
      const idToken = await firebaseUser.getIdToken();
  
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/firebase-login`,
        {
          username: username || firebaseUser.displayName || 'GoogleUser',
        },
        {
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        }
      );
  
      const { token, user } = res.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      return user; // return user object for further checks
    } catch (error: any) {
      const message =
        error?.response?.data?.message || error?.message || 'Something went wrong';
  
      if (message === 'Username already taken') {
        toast.error('That username is already taken. Please choose another.');
      } else if (message === 'Token expired' || message.includes('token')) {
        toast.error('Session expired. Please try again.');
      } else {
        toast.error(message);
      }
  
      throw new Error(message);
    }
  };
  
  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { username, email, password, confirmPassword } = formData;
  
    if (!username || !email || !password || !confirmPassword) {
      return toast.error('All fields are required');
    }
  
    if (password.length < 6) {
      return toast.error('Password must be at least 6 characters');
    }
  
    if (password !== confirmPassword) {
      return toast.error('Passwords do not match');
    }
  
    try {
      setLoading(true);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
  
      await sendEmailVerification(firebaseUser);
      await handleFirebaseBackendLogin(firebaseUser, username);
  
      toast.success('Account created! Please verify your email.');
      navigate('/signin');
    } catch (error: any) {
      const errorCode = error.code;
  
      if (errorCode === 'auth/email-already-in-use') {
        toast.error('An account with this email already exists. Redirecting to sign in...');
        setTimeout(() => {
          navigate('/signin');
        }, 2000); // Give time for user to read toast
      } else {
        console.error(error);
        toast.error(error?.message || 'Signup failed');
      }
    } finally {
      setLoading(false);
    }
  };
  

  const handleGoogleSignUp = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const firebaseUser = result.user;
  
      // Get ID token
      const idToken = await firebaseUser.getIdToken();
  
      // Call backend to check if user exists
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/firebase-login`,
        {
          username: firebaseUser.displayName || 'GoogleUser',
        },
        {
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        }
      );
  
      const { user } = res.data;
  
      if (user && user._id) {
        // ✅ User exists already
        toast.info('User already exists. Please sign in instead.');
        navigate('/signin');
      } else {
        // 🚫 This shouldn't normally happen if backend returns user object
        toast.error('User already exists. Please sign in instead.');
      }
    } catch (err: any) {
      const message =
        err?.response?.data?.message || err?.message || 'Something went wrong';
  
      if (message.includes('User not found') || message.includes('No user found')) {
        // ✅ User doesn't exist → proceed to signup
        const firebaseUser = auth.currentUser;
        const randomUsername = `user_${Math.random().toString(36).slice(2, 8)}`;
  
        const newUser = await handleFirebaseBackendLogin(firebaseUser!, randomUsername);
  
        setFirebaseUser(firebaseUser!);
        setInitialProfile({
          username: randomUsername,
          bio: '',
          location: '',
          website: '',
          twitter: '',
          github: '',
        });
  
        toast.success('Signed up with Google! Let’s complete your profile.');
        setShowProfileModal(true);
      } else {
        toast.error(message);
        console.error(err);
      }
    }
  };
  
  

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto">
            <Card className="elegant-card">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-heading font-bold text-primary">
                  Create your account
                </CardTitle>
                <p className="text-muted-foreground text-sm">
                  Join WIECODES to access premium templates
                </p>
              </CardHeader>

              <CardContent className="space-y-6">
                <form className="space-y-4" onSubmit={handleSubmit}>
                  {/* Full Name */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Full Name</label>
                    <div className="relative">
                      <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        placeholder="Enter your full name"
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter your email"
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Create a password"
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Confirm Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="Re-enter password"
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <Button className="w-full classy-button" type="submit" disabled={loading}>
                    {loading ? 'Creating Account...' : 'Create Account'}
                  </Button>
                </form>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-muted-foreground">Or continue with</span>
                  </div>
                </div>

                <Button variant="outline" className="w-full" onClick={handleGoogleSignUp}>
                  <Chrome className="w-4 h-4 mr-2" />
                  Sign up with Google
                </Button>

                <div className="text-center text-sm text-muted-foreground">
                  Already have an account?{' '}
                  <Link to="/signin" className="text-primary hover:underline font-medium">
                    Sign in
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />

      {/* ✅ No children passed to modal if forceOpen=true */}
      {showProfileModal && firebaseUser && (
        <EditProfileModal
          forceOpen
          profile={initialProfile}
          onUpdate={(updatedProfile) => {
            toast.success('Profile updated successfully!');
            setShowProfileModal(false);
            navigate('/');
          }}
        />
      )}
    </div>
  );
};

export default SignUp;
