import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Edit, X, Check } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

interface EditProfileModalProps {
  children?: React.ReactNode;
  profile: {
    username: string;
    bio?: string;
    location?: string;
    website?: string;
    twitter?: string;
    github?: string;
    roles?: string[];
    paymentMethod?: string;
    paymentDetail?: string;
  };
  onUpdate: (updatedProfile: any) => void;
  forceOpen?: boolean;
}

const roleOptions = [
  'UI/UX Designer',
  'Frontend Developer',
  'Backend Developer',
  'Fullstack Developer',
  'Webflow Expert',
  'WordPress Developer',
  'Landing Page Expert',
  'Shopify Developer',
  'No-code Builder',
  'API Integrator',
];

const paymentMethodOptions = [
  { value: 'UPI', label: 'UPI' },
  { value: 'PayPal', label: 'PayPal' },
  { value: 'Bank Transfer', label: 'Bank Transfer' },
  { value: 'Razorpay', label: 'Razorpay' },
  { value: 'Other', label: 'Other' },
];

const EditProfileModal = ({
  children,
  profile,
  onUpdate,
  forceOpen = false,
}: EditProfileModalProps) => {
  const { token } = useAuth();
  const [open, setOpen] = useState(forceOpen);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    username: '',
    bio: '',
    location: '',
    website: '',
    twitter: '',
    github: '',
    roles: [] as string[],
    paymentMethod: '',
    paymentDetail: '',
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        username: profile.username || '',
        bio: profile.bio || '',
        location: profile.location || '',
        website: profile.website || '',
        twitter: profile.twitter || '',
        github: profile.github || '',
        roles: profile.roles || [],
        paymentMethod: profile.paymentMethod || '',
        paymentDetail: profile.paymentDetail || '',
      });
    }
  }, [profile]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    // Basic validation
    if (!formData.username.trim()) {
      toast.error('Username is required');
      return;
    }

    try {
      setSaving(true);

      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/users/me`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        const message = errorData?.message || 'Unknown error';
        if (res.status === 400 && message === 'Username already taken') {
          toast.error('That username is already taken. Please choose another.');
        } else {
          toast.error(`Failed to update profile: ${message}`);
        }
        return;
      }

      const fullProfileRes = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/users/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const fullProfile = await fullProfileRes.json();
      onUpdate(fullProfile);
      toast.success('Profile updated successfully!');
      setOpen(false);
    } catch (err: any) {
      console.error('Profile update error:', err);
      toast.error(err?.message || 'Something went wrong.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {!forceOpen && children && (
        <DialogTrigger asChild>
          {React.Children.only(children)}
        </DialogTrigger>
      )}

      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto bg-[#0A0A0A] border border-white/10 text-white p-0 rounded-none [&>button]:hidden">
        {/* Header */}
        <DialogHeader className="p-6 border-b border-white/10">
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center space-x-3 text-xl font-black uppercase tracking-[0.15em]">
              <Edit className="w-5 h-5" />
              <span>Edit Profile</span>
            </DialogTitle>
            {!forceOpen && (
              <DialogClose asChild>
                <Button variant="ghost" className="w-9 h-9 p-0 text-white/50 hover:text-white hover:bg-white/5">
                  <X className="w-4 h-4" />
                </Button>
              </DialogClose>
            )}
          </div>
          <DialogDescription className="text-white/50 font-mono text-[10px] mt-2">
            Make changes to your profile. Click save when you're done.
          </DialogDescription>
        </DialogHeader>

        <div className="p-6 space-y-8">
          {/* Personal Info Section */}
          <Card className="border border-white/10 bg-transparent hover:border-white/20 transition-all duration-300">
            <CardContent className="p-6 space-y-5">
              <h3 className="text-[10px] uppercase tracking-[0.4em] text-white/50 font-mono">Personal Info</h3>

              <div className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="username" className="text-xs uppercase tracking-[0.3em] text-white/70 font-mono">Username *</Label>
                  <Input
                    id="username"
                    value={formData.username}
                    onChange={(e) => handleInputChange('username', e.target.value)}
                    className="bg-black/30 border-white/10 text-white placeholder:text-white/30 focus:border-white/40 focus:ring-0 h-10"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <Label htmlFor="location" className="text-xs uppercase tracking-[0.3em] text-white/70 font-mono">Location</Label>
                    <Input
                      id="location"
                      placeholder="City, Country"
                      value={formData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      className="bg-black/30 border-white/10 text-white placeholder:text-white/30 focus:border-white/40 focus:ring-0 h-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio" className="text-xs uppercase tracking-[0.3em] text-white/70 font-mono">Bio</Label>
                  <Textarea
                    id="bio"
                    rows={4}
                    value={formData.bio}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
                    placeholder="Tell us a little about yourself..."
                    className="bg-black/30 border-white/10 text-white placeholder:text-white/30 focus:border-white/40 focus:ring-0 resize-y"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Links Section */}
          <Card className="border border-white/10 bg-transparent hover:border-white/20 transition-all duration-300">
            <CardContent className="p-6 space-y-5">
              <h3 className="text-[10px] uppercase tracking-[0.4em] text-white/50 font-mono">Social & Portfolio Links</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label htmlFor="website" className="text-xs uppercase tracking-[0.3em] text-white/70 font-mono">Portfolio</Label>
                  <Input
                    id="website"
                    placeholder="https://yourwebsite.com"
                    value={formData.website}
                    onChange={(e) => handleInputChange('website', e.target.value)}
                    className="bg-black/30 border-white/10 text-white placeholder:text-white/30 focus:border-white/40 focus:ring-0 h-10"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="github" className="text-xs uppercase tracking-[0.3em] text-white/70 font-mono">GitHub</Label>
                  <Input
                    id="github"
                    placeholder="username"
                    value={formData.github}
                    onChange={(e) => handleInputChange('github', e.target.value)}
                    className="bg-black/30 border-white/10 text-white placeholder:text-white/30 focus:border-white/40 focus:ring-0 h-10"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="twitter" className="text-xs uppercase tracking-[0.3em] text-white/70 font-mono">X / Twitter</Label>
                  <Input
                    id="twitter"
                    placeholder="@yourhandle"
                    value={formData.twitter}
                    onChange={(e) => handleInputChange('twitter', e.target.value)}
                    className="bg-black/30 border-white/10 text-white placeholder:text-white/30 focus:border-white/40 focus:ring-0 h-10"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Work Roles Section */}
          <Card className="border border-white/10 bg-transparent hover:border-white/20 transition-all duration-300">
            <CardContent className="p-6 space-y-5">
              <div className="flex items-center justify-between">
                <h3 className="text-[10px] uppercase tracking-[0.4em] text-white/50 font-mono">Work Roles</h3>
                <span className="text-xs text-white/40 font-mono">
                  {formData.roles.length > 0 ? `${formData.roles.length} selected` : 'None selected'}
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {roleOptions.map((role) => (
                  <label
                    key={role}
                    className={`
                      flex items-center gap-2 px-4 py-3 border cursor-pointer transition-all duration-200 text-sm font-mono
                      ${formData.roles.includes(role)
                        ? 'border-white/30 bg-white/5 text-white'
                        : 'border-white/10 bg-black/20 text-white/50 hover:border-white/20 hover:text-white/70'
                      }
                    `}
                  >
                    <div className={`
                      w-4 h-4 rounded-full border flex items-center justify-center
                      ${formData.roles.includes(role)
                        ? 'border-emerald-400/70 bg-emerald-400/10'
                        : 'border-white/20'
                      }
                    `}>
                      {formData.roles.includes(role) && <Check className="w-2.5 h-2.5 text-emerald-400/80" />}
                    </div>
                    <span>{role}</span>
                    <input
                      type="checkbox"
                      className="sr-only"
                      checked={formData.roles.includes(role)}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        setFormData((prev) => ({
                          ...prev,
                          roles: checked
                            ? [...prev.roles, role]
                            : prev.roles.filter((r) => r !== role),
                        }));
                      }}
                    />
                  </label>
                ))}
              </div>
              <p className="text-xs text-white/40 font-mono leading-relaxed">
                These roles help us match you with freelance work opportunities.
              </p>
            </CardContent>
          </Card>

          {/* Payment Info Section */}
          <Card className="border border-white/10 bg-transparent hover:border-white/20 transition-all duration-300">
            <CardContent className="p-6 space-y-5">
              <h3 className="text-[10px] uppercase tracking-[0.4em] text-white/50 font-mono">Payment Information</h3>

              <div className="space-y-5">
                <div className="space-y-2">
                  <Label className="text-xs uppercase tracking-[0.3em] text-white/70 font-mono">Preferred Payment Method</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {paymentMethodOptions.map((method) => (
                      <label
                        key={method.value}
                        className={`
                          flex items-center justify-center gap-2 px-4 py-3 border cursor-pointer transition-all duration-200 text-sm font-mono
                          ${formData.paymentMethod === method.value
                            ? 'border-white/30 bg-white/5 text-white'
                            : 'border-white/10 bg-black/20 text-white/50 hover:border-white/20 hover:text-white/70'
                          }
                        `}
                      >
                        <div className={`
                          w-4 h-4 rounded-full border flex items-center justify-center
                          ${formData.paymentMethod === method.value
                            ? 'border-emerald-400/70 bg-emerald-400/10'
                            : 'border-white/20'
                          }
                        `}>
                          {formData.paymentMethod === method.value && <Check className="w-2.5 h-2.5 text-emerald-400/80" />}
                        </div>
                        {method.label}
                        <input
                          type="radio"
                          className="sr-only"
                          checked={formData.paymentMethod === method.value}
                          onChange={() =>
                            setFormData((prev) => ({ ...prev, paymentMethod: method.value }))
                          }
                        />
                      </label>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="paymentDetail" className="text-xs uppercase tracking-[0.3em] text-white/70 font-mono">
                    Payment Details
                  </Label>
                  <Input
                    id="paymentDetail"
                    placeholder="example@upi / paypal.me/yourlink / Bank Account Details"
                    value={formData.paymentDetail}
                    onChange={(e) => handleInputChange('paymentDetail', e.target.value)}
                    className="bg-black/30 border-white/10 text-white placeholder:text-white/30 focus:border-white/40 focus:ring-0 h-10"
                  />
                  <p className="text-[10px] text-white/40 font-mono">
                    We will use this information to send you payments for your work and template sales.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="flex justify-end space-x-3 p-6 border-t border-white/10">
          {!forceOpen && (
            <DialogClose asChild>
              <Button variant="ghost" className="h-10 px-5 border border-white/10 bg-transparent hover:bg-white/5 text-white text-xs uppercase tracking-[0.3em]">
                Cancel
              </Button>
            </DialogClose>
          )}
          <Button
            onClick={handleSave}
            disabled={saving}
            className="h-10 px-6 bg-white text-black hover:bg-white/90 disabled:opacity-50 text-xs uppercase tracking-[0.3em] font-bold transition-all duration-200"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditProfileModal;
