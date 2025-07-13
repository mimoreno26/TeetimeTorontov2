import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react';
import { authService } from '../services/authService';

interface SignUpProps {
  onSignUp: () => void;
}

export default function SignUp({ onSignUp }: SignUpProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [phone, setPhone] = useState('');
  const [notificationPrefs, setNotificationPrefs] = useState({
    sms: false,
    email: true
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      setError('Please fill in all fields');
      return;
    }

    if (!email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!notificationPrefs.sms && !notificationPrefs.email) {
      setError('Please enable at least one notification method');
      return;
    }

    if (notificationPrefs.sms && !phone.trim()) {
      setError('Please enter a phone number for SMS notifications');
      return;
    }

    setIsLoading(true);
    try {
      const success = await authService.signup(
        name, 
        email, 
        password, 
        notificationPrefs.sms ? phone : undefined,
        notificationPrefs
      );
      if (success) {
        alert('Account created successfully!');
        onSignUp();
      } else {
        setError('Failed to create account. Email may already be in use.');
      }
    } catch (error) {
      setError('Sign up failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6 py-8">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h1>
          <p className="text-gray-600">Join TeeTimeToronto and find your perfect tee time</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSignUp} className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
              {error}
            </div>
          )}

          <div className="relative">
            <User size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-colors"
            />
          </div>

          <div className="relative">
            <Mail size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-colors"
            />
          </div>

          <div className="relative">
            <Lock size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-12 pr-12 py-3 bg-white rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-colors"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <div className="relative">
            <Lock size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full pl-12 pr-12 py-3 bg-white rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-colors"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {/* Notification Preferences */}
          <div className="bg-gray-50 p-4 rounded-xl">
            <h3 className="font-medium text-gray-900 mb-3">Notification Preferences</h3>
            <p className="text-sm text-gray-600 mb-4">
              Choose how you'd like to be notified when tee times become available
            </p>
            
            {/* SMS Toggle */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center">
                <span className="font-medium text-gray-900">SMS Notifications</span>
              </div>
              <button
                type="button"
                onClick={() => setNotificationPrefs(prev => ({ ...prev, sms: !prev.sms }))}
                className={`w-12 h-6 rounded-full transition-colors ${
                  notificationPrefs.sms ? 'bg-primary-600' : 'bg-gray-300'
                }`}
              >
                <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                  notificationPrefs.sms ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
            </div>

            {/* Phone Number Input */}
            {notificationPrefs.sms && (
              <div className="relative mb-3">
                <input
                  type="tel"
                  placeholder="Phone number (e.g., +1234567890)"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-3 bg-white rounded-lg border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-colors"
                />
              </div>
            )}

            {/* Email Toggle */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <span className="font-medium text-gray-900">Email Notifications</span>
              </div>
              <button
                type="button"
                onClick={() => setNotificationPrefs(prev => ({ ...prev, email: !prev.email }))}
                className={`w-12 h-6 rounded-full transition-colors ${
                  notificationPrefs.email ? 'bg-primary-600' : 'bg-gray-300'
                }`}
              >
                <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                  notificationPrefs.email ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary-600 text-white py-3 rounded-xl font-semibold hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        {/* Sign In Link */}
        <div className="text-center mt-6">
          <span className="text-gray-600">Already have an account? </span>
          <Link to="/login" className="text-primary-600 font-medium hover:text-primary-700">
            Sign In
          </Link>
        </div>

        {/* Terms */}
        <div className="text-center mt-6">
          <p className="text-xs text-gray-500 leading-relaxed">
            By creating an account, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
}