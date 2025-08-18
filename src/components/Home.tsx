import React, { useState } from 'react';
import { Wallet, Mail, LayoutDashboard, Zap, Shield, TrendingUp } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { AuthModal } from './AuthModal';

interface HomeProps {
  onNavigate: (page: string) => void;
}

export function Home({ onNavigate }: HomeProps) {
  const { setUser, showToast } = useApp();
  const [authModal, setAuthModal] = useState<{
    isOpen: boolean;
    mode: 'signin' | 'signup';
  }>({
    isOpen: false,
    mode: 'signin'
  });

  const handleConnectWallet = () => {
    setUser({
      connected: true,
      walletAddress: 'ALGO7XY3...KJ8P2Q',
      premium: false,
      hasPassword: false
    });
    showToast('Wallet connected successfully!', 'success');
    setTimeout(() => onNavigate('dashboard'), 1500);
  };

  const openAuthModal = (mode: 'signin' | 'signup') => {
    setAuthModal({ isOpen: true, mode });
  };

  const closeAuthModal = () => {
    setAuthModal({ isOpen: false, mode: 'signin' });
  };

  const handleAuthSuccess = () => {
    setTimeout(() => onNavigate('dashboard'), 1500);
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-teal-900/20" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl" />
      
      <div className="relative z-10 container mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-gradient-to-r from-blue-500 to-teal-500 p-3 rounded-2xl">
              <Zap className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white ml-4">AlgoPayX</h1>
          </div>
          <h2 className="text-6xl font-bold text-white mb-6 leading-tight">
            One App.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-400">
              Every Payment.
            </span><br />
            All on Chain.
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            The future of finance is here. Pay, trade, invest, and manage all your assets 
            in one seamless platform powered by blockchain technology.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="max-w-md mx-auto space-y-4 mb-16">
          <button
            onClick={handleConnectWallet}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-4 px-6 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center space-x-3 transform hover:scale-105 shadow-lg hover:shadow-blue-500/25"
          >
            <Wallet className="w-5 h-5" />
            <span>Connect Wallet</span>
          </button>
          
          <button
            onClick={() => openAuthModal('signin')}
            className="w-full bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white py-4 px-6 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center space-x-3 transform hover:scale-105 shadow-lg hover:shadow-teal-500/25"
          >
            <Mail className="w-5 h-5" />
            <span>Sign In</span>
          </button>

          <button
            onClick={() => openAuthModal('signup')}
            className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white py-4 px-6 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center space-x-3 transform hover:scale-105 shadow-lg hover:shadow-purple-500/25"
          >
            <Shield className="w-5 h-5" />
            <span>Create Account</span>
          </button>
          
          <button
            onClick={() => onNavigate('dashboard')}
            className="w-full bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white py-4 px-6 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center space-x-3 transform hover:scale-105 shadow-lg hover:shadow-gray-500/25"
          >
            <LayoutDashboard className="w-5 h-5" />
            <span>Demo Dashboard</span>
          </button>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="bg-white/5 backdrop-blur-lg p-8 rounded-2xl border border-white/10 hover:bg-white/10 transition-all duration-300">
            <Shield className="w-12 h-12 text-blue-400 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-3">Secure & Decentralized</h3>
            <p className="text-gray-300">
              Your assets are protected by blockchain technology and military-grade encryption with PIN security.
            </p>
          </div>
          
          <div className="bg-white/5 backdrop-blur-lg p-8 rounded-2xl border border-white/10 hover:bg-white/10 transition-all duration-300">
            <TrendingUp className="w-12 h-12 text-teal-400 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-3">Multi-Asset Trading</h3>
            <p className="text-gray-300">
              Trade stocks, crypto, and traditional assets all from one unified platform with advanced security.
            </p>
          </div>
          
          <div className="bg-white/5 backdrop-blur-lg p-8 rounded-2xl border border-white/10 hover:bg-white/10 transition-all duration-300">
            <Zap className="w-12 h-12 text-purple-400 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-3">Instant Payments</h3>
            <p className="text-gray-300">
              Send money anywhere in the world instantly with minimal fees and PIN-protected transactions.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-16 pt-8 border-t border-white/10">
          <p className="text-gray-400">
            Built with <span className="text-blue-400">Bolt.new</span> – Powered by <span className="text-teal-400">Algorand</span>
          </p>
        </div>
      </div>

      <AuthModal
        isOpen={authModal.isOpen}
        onClose={closeAuthModal}
        mode={authModal.mode}
        onSuccess={handleAuthSuccess}
      />
    </div>
  );
}