import React, { useState } from 'react';
import { 
  Lock, 
  Eye, 
  EyeOff, 
  Shield,
  X,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { useApp } from '../context/AppContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'signin' | 'signup';
  onSuccess: () => void;
}

export function AuthModal({ isOpen, onClose, mode, onSuccess }: AuthModalProps) {
  const { setUser, showToast, saveUserCredentials, validateCredentials } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    if (mode === 'signup') {
      if (step === 1) {
        // Validate email and password
        if (password !== confirmPassword) {
          showToast('Passwords do not match', 'error');
          setLoading(false);
          return;
        }
        if (password.length < 8) {
          showToast('Password must be at least 8 characters', 'error');
          setLoading(false);
          return;
        }
        setStep(2);
        setLoading(false);
        return;
      } else {
        // Validate PIN
        if (pin !== confirmPin) {
          showToast('PINs do not match', 'error');
          setLoading(false);
          return;
        }
        if (pin.length !== 6) {
          showToast('PIN must be 6 digits', 'error');
          setLoading(false);
          return;
        }
        
        // Save credentials
        saveUserCredentials(email, password, pin);
        
        setUser({
          connected: true,
          email: email,
          premium: false,
          hasPassword: true,
          pin: pin,
          password: password
        });

        showToast('Account created successfully!', 'success');
      }
    } else if (mode === 'signin') {
      // Validate credentials
      if (!validateCredentials(email, password)) {
        showToast('Invalid email or password', 'error');
        setLoading(false);
        return;
      }

      setUser({
        connected: true,
        email: email,
        premium: false,
        hasPassword: true
      });

      showToast('Signed in successfully!', 'success');
    }

    setLoading(false);
    onSuccess();
    onClose();
    resetForm();
  };

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setPin('');
    setConfirmPin('');
    setStep(1);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900/95 backdrop-blur-lg p-8 rounded-2xl border border-white/10 w-full max-w-md">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">
            {mode === 'signin' ? 'Sign In' : 'Create Account'}
            {mode === 'signup' && ` - Step ${step}/2`}
          </h2>
          <button
            onClick={() => {
              onClose();
              resetForm();
            }}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {step === 1 && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={8}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 pr-12 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {mode === 'signup' && (
                  <p className="text-xs text-gray-400 mt-1">Must be at least 8 characters long</p>
                )}
              </div>

              {mode === 'signup' && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Confirm Password</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                    placeholder="Confirm your password"
                  />
                </div>
              )}
            </>
          )}

          {step === 2 && mode === 'signup' && (
            <>
              <div className="text-center mb-6">
                <Shield className="w-12 h-12 text-blue-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">Set Your Transaction PIN</h3>
                <p className="text-gray-400">This PIN will be required for all transactions</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">6-Digit PIN</label>
                <input
                  type="password"
                  value={pin}
                  onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  required
                  maxLength={6}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 text-center text-2xl tracking-widest"
                  placeholder="••••••"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Confirm PIN</label>
                <input
                  type="password"
                  value={confirmPin}
                  onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  required
                  maxLength={6}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 text-center text-2xl tracking-widest"
                  placeholder="••••••"
                />
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white py-4 rounded-xl font-semibold transition-all duration-200 disabled:opacity-50"
          >
            {loading ? 'Processing...' : 
             mode === 'signup' ? (step === 1 ? 'Continue' : 'Create Account') : 'Sign In'}
          </button>

          {step === 1 && (
            <div className="text-center">
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="text-blue-400 hover:text-blue-300 text-sm"
              >
                {mode === 'signup' ? 'Already have an account? Sign In' : 'Need an account? Sign Up'}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}