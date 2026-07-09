import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import {
  Mail,
  MessageCircle,
  Phone,
  MapPin,
  Clock,
  Send,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { useScrollToTop, useScrollAnimation } from '@/hooks/useScrollAnimation';

const ContactUs = () => {
  useScrollToTop();
  const { ref: heroRef, isVisible: heroVisible } = useScrollAnimation();
  const { ref: sectionsRef, isVisible: sectionsVisible } = useScrollAnimation();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
  
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/contact`, { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
  
      if (res.ok) {
        setIsSubmitted(true);
        setFormData({ name: '', email: '', subject: '', message: '' });
  
        // Hide success after 5 sec
        setTimeout(() => setIsSubmitted(false), 5000);
      } else {
        const data = await res.json();
        setError(data?.error || 'Something went wrong.');
      }
    } catch (err) {
      setError('Failed to send message. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };
  

  return (
    <div className="min-h-screen animate-fade-in">
      <Header />

      <div className="content-overlay py-8">
        <div className="container mx-auto px-4">
          {/* Hero Section */}
          <div
            ref={heroRef}
            className={`text-center mb-8 px-4 scroll-fade-up ${heroVisible ? 'in-view' : ''}`}
          >
            <h1 className="text-4xl sm:text-5xl lg:text-4xl font-heading font-bold text-primary mb-3 tracking-tight leading-tight">
              Contact Us
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground max-w-md sm:max-w-2xl mx-auto leading-relaxed">
              We're here to help! Get in touch with our team for support, questions, or feedback.
            </p>
          </div>

          {/* Main Content */}
          <div ref={sectionsRef} className={`max-w-6xl mx-auto space-y-8 mb-8 scroll-fade-up ${sectionsVisible ? 'in-view' : ''}`}>
            
            {/* Contact Methods Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Email Support */}
              <div className="bg-white rounded-lg p-6 shadow-sm text-center">
                <Mail className="w-8 h-8 text-primary mx-auto mb-3" />
                <h3 className="font-semibold text-primary mb-2">Email Support</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Get detailed responses within 24 hours
                </p>
                <a 
                  href="mailto:wiecodes@gmail.com" 
                  className="text-primary hover:underline text-sm font-medium"
                >
                  wiecodes@gmail.com
                </a>
              </div>

              {/* WhatsApp Support */}
              <div className="bg-white rounded-lg p-6 shadow-sm text-center">
                <MessageCircle className="w-8 h-8 text-primary mx-auto mb-3" />
                <h3 className="font-semibold text-primary mb-2">WhatsApp Support</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Quick responses during business hours
                </p>
                <a 
                  href="https://wa.me/8273674125" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline text-sm font-medium"
                >
                  +91 8273674125
                </a>
              </div>

              {/* Phone Support */}
              <div className="bg-white rounded-lg p-6 shadow-sm text-center">
                <Phone className="w-8 h-8 text-primary mx-auto mb-3" />
                <h3 className="font-semibold text-primary mb-2">Phone Support</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Mon–Fri, 10AM–4PM IST
                </p>
                <a 
                  href="tel:+918273674125" 
                  className="text-primary hover:underline text-sm font-medium"
                >
                  +91 8273674125
                </a>
              </div>

              {/* Office Location */}
              <div className="bg-white rounded-lg p-6 shadow-sm text-center">
                <MapPin className="w-8 h-8 text-primary mx-auto mb-3" />
                <h3 className="font-semibold text-primary mb-2">Office Location</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Dehradun, Uttarakhand
                </p>
                <span className="text-primary text-sm font-medium">
                  India
                </span>
              </div>
            </div>

            {/* Contact Form and Info */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Contact Form */}
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h2 className="text-2xl font-heading font-bold text-primary mb-4">
                  Send us a Message
                </h2>
                
                {isSubmitted && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <p className="text-green-800 font-medium">Message sent successfully!</p>
                    </div>
                    <p className="text-green-700 text-sm mt-1">
                      We'll get back to you within 24 hours.
                    </p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-primary mb-1">
                        Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="Your full name"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-primary mb-1">
                        Email *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-primary mb-1">
                      Subject *
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      <option value="">Select a subject</option>
                      <option value="general">General Inquiry</option>
                      <option value="support">Technical Support</option>
                      <option value="billing">Billing & Payment</option>
                      <option value="refund">Refund Request</option>
                      <option value="partnership">Partnership</option>
                      <option value="feedback">Feedback</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-primary mb-1">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows={5}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="Tell us how we can help you..."
                    />
                  </div>
                  
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-primary text-white py-3 px-6 rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Send Message
                      </>
                    )}
                  </button>
                </form>
              </div>

              {/* Contact Information */}
              <div className="space-y-6">
                {/* Business Hours */}
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <Clock className="w-6 h-6 text-primary" />
                    <h3 className="text-xl font-heading font-bold text-primary">
                      Business Hours
                    </h3>
                  </div>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex justify-between">
                      <span>Monday - Friday</span>
                      <span>10:00 AM - 4:00 PM IST</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Saturday</span>
                      <span>10:00 AM - 2:00 PM IST</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Sunday</span>
                      <span>Closed</span>
                    </div>
                  </div>
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                    <p className="text-blue-800 text-sm">
                      <strong>Note:</strong> For urgent technical issues, WhatsApp support is available outside business hours.
                    </p>
                  </div>
                </div>

                {/* Response Times */}
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <h3 className="text-xl font-heading font-bold text-primary mb-4">
                    Response Times
                  </h3>
                  <div className="space-y-3 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span><strong>WhatsApp:</strong> Within 2 hours (business hours)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span><strong>Email:</strong> Within 24 hours</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      <span><strong>Phone:</strong> Immediate (business hours)</span>
                    </div>
                  </div>
                </div>

                {/* What We Can Help With */}
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <h3 className="text-xl font-heading font-bold text-primary mb-4">
                    How We Can Help
                  </h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      Template installation & setup
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      Customization guidance
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      Payment & billing issues
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      Refund requests
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      Technical troubleshooting
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      Partnership inquiries
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* FAQ Section */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h2 className="text-2xl font-heading font-bold text-primary mb-4">
                Frequently Asked Questions
              </h2>
              <div className="space-y-4">
                <div className="border-b border-gray-200 pb-4">
                  <h3 className="font-semibold text-primary mb-2">What's the best way to contact you?</h3>
                  <p className="text-sm text-muted-foreground">
                    For quick responses, use WhatsApp during business hours. For detailed technical questions, email is best.
                  </p>
                </div>
                <div className="border-b border-gray-200 pb-4">
                  <h3 className="font-semibold text-primary mb-2">Do you provide phone support?</h3>
                  <p className="text-sm text-muted-foreground">
                    Yes, phone support is available during business hours (Mon-Fri, 10AM-4PM IST) for urgent issues.
                  </p>
                </div>
                <div className="border-b border-gray-200 pb-4">
                  <h3 className="font-semibold text-primary mb-2">How quickly will I get a response?</h3>
                  <p className="text-sm text-muted-foreground">
                    WhatsApp: Within 2 hours (business hours), Email: Within 24 hours, Phone: Immediate (business hours).
                  </p>
                </div>
                <div className="border-b border-gray-200 pb-4">
                  <h3 className="font-semibold text-primary mb-2">Can you help with template customization?</h3>
                  <p className="text-sm text-muted-foreground">
                    Yes! We provide guidance on customizing templates, though we don't do custom development work.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-primary mb-2">What information should I include in my message?</h3>
                  <p className="text-sm text-muted-foreground">
                    Include your order number (if applicable), template name, browser/OS details, and specific steps to reproduce the issue.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ContactUs; 
