import React, { useState, useEffect } from 'react';
import { Lock, X, AlertTriangle } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface PinModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  title: string;
  description: string;
  amount?: number;
  fee?: number;
}

export function PinModal({ isOpen, onClose, onSuccess, title, description, amount, fee }: PinModalProps) {
  const { showToast, user, setUser, validatePin } = useApp();
  const [pin, setPin] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockTimeRemaining, setLockTimeRemaining] = useState(0);

  const maxAttempts = 5;
  const lockDuration = 300; // 5 minutes in seconds

  useEffect(() => {
    if (lockTimeRemaining > 0) {
      const timer = setTimeout(() => {
        setLockTimeRemaining(lockTimeRemaining - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (isLocked && lockTimeRemaining === 0) {
      setIsLocked(false);
      setAttempts(0);
      showToast('Account unlocked. You can try again.', 'info');
    }
  }, [lockTimeRemaining, isLocked, showToast]);

  const handlePinInput = (digit: string) => {
    if (isLocked) return;
    
    if (pin.length < 6) {
      setPin(pin + digit);
    }
  };

  const handleBackspace = () => {
    if (isLocked) return;
    setPin(pin.slice(0, -1));
  };

  const handleSubmit = () => {
    if (isLocked || pin.length !== 6) return;

    if (validatePin(pin)) {
      showToast('PIN verified successfully!', 'success');
      setPin('');
      setAttempts(0);
      onSuccess();
      onClose();
    } else {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      setPin('');

      if (newAttempts >= maxAttempts) {
        setIsLocked(true);
        setLockTimeRemaining(lockDuration);
        showToast(`Account locked for ${lockDuration / 60} minutes due to multiple failed attempts`, 'error');
        
        // Update user state to reflect locked account
        setUser({ ...user, accountLocked: true });
      } else {
        showToast(`Incorrect PIN. ${maxAttempts - newAttempts} attempts remaining.`, 'error');
      }
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900/95 backdrop-blur-lg p-8 rounded-2xl border border-white/10 w-full max-w-md">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-teal-500 rounded-full flex items-center justify-center">
              <Lock className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">{title}</h2>
              <p className="text-gray-400 text-sm">{description}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Transaction Details */}
        {amount && (
          <div className="bg-white/5 p-4 rounded-lg mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-300">Amount:</span>
              <span className="text-white font-semibold">${amount.toLocaleString()}</span>
            </div>
            {fee && fee > 0 && (
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-300">Platform Fee:</span>
                <span className="text-yellow-400 font-semibold">${fee.toFixed(2)}</span>
              </div>
            )}
            {fee && fee > 0 && (
              <div className="flex justify-between items-center pt-2 border-t border-white/10">
                <span className="text-gray-300 font-medium">Total:</span>
                <span className="text-white font-bold">${(amount + fee).toFixed(2)}</span>
              </div>
            )}
          </div>
        )}

        {isLocked ? (
          <div className="text-center py-8">
            <AlertTriangle className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-red-400 mb-2">Account Temporarily Locked</h3>
            <p className="text-gray-400 mb-4">
              Too many incorrect PIN attempts. Please wait before trying again.
            </p>
            <div className="text-2xl font-bold text-white mb-2">
              {formatTime(lockTimeRemaining)}
            </div>
            <p className="text-gray-400 text-sm">Time remaining</p>
            
            <div className="mt-6 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
              <p className="text-yellow-400 text-sm">
                If you continue to have issues, please contact support or verify your identity through email.
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* PIN Display */}
            <div className="flex justify-center space-x-3 mb-8">
              {[...Array(6)].map((_, index) => (
                <div
                  key={index}
                  className={`w-12 h-12 rounded-lg border-2 flex items-center justify-center ${
                    index < pin.length
                      ? 'border-blue-500 bg-blue-500/20'
                      : 'border-white/20 bg-white/5'
                  }`}
                >
                  {index < pin.length && (
                    <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                  )}
                </div>
              ))}
            </div>

            {/* Number Pad */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((digit) => (
                <button
                  key={digit}
                  onClick={() => handlePinInput(digit.toString())}
                  className="h-14 bg-white/5 border border-white/10 rounded-lg text-white text-xl font-semibold hover:bg-white/10 transition-colors"
                >
                  {digit}
                </button>
              ))}
              <button
                onClick={handleBackspace}
                className="h-14 bg-white/5 border border-white/10 rounded-lg text-white hover:bg-white/10 transition-colors flex items-center justify-center"
              >
                ←
              </button>
              <button
                onClick={() => handlePinInput('0')}
                className="h-14 bg-white/5 border border-white/10 rounded-lg text-white text-xl font-semibold hover:bg-white/10 transition-colors"
              >
                0
              </button>
              <button
                onClick={handleSubmit}
                disabled={pin.length !== 6}
                className="h-14 bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-white font-semibold transition-colors"
              >
                ✓
              </button>
            </div>

            {attempts > 0 && (
              <div className="text-center text-yellow-400 text-sm">
                {maxAttempts - attempts} attempts remaining
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}