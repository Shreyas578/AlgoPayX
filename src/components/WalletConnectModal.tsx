import React, { useState } from 'react';
import { X, Wallet, Smartphone, Shield, ExternalLink } from 'lucide-react';
import { WalletType } from '../services/algorand';
import { useAlgorand } from '../context/AlgorandContext';
import { useApp } from '../context/AppContext';

interface WalletConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function WalletConnectModal({ isOpen, onClose, onSuccess }: WalletConnectModalProps) {
  const { connect, isConnecting } = useAlgorand();
  const { showToast } = useApp();
  const [selectedWallet, setSelectedWallet] = useState<WalletType | null>(null);

  const wallets = [
    {
      type: WalletType.PERA,
      name: 'Pera Wallet',
      description: 'The official Algorand wallet',
      icon: Wallet,
      color: 'from-blue-500 to-blue-600',
      popular: true
    },
    {
      type: WalletType.MYALGO,
      name: 'MyAlgo Wallet',
      description: 'Web-based Algorand wallet',
      icon: Shield,
      color: 'from-green-500 to-green-600',
      popular: false
    },
    {
      type: WalletType.DEFLY,
      name: 'Defly Wallet',
      description: 'DeFi-focused Algorand wallet',
      icon: Smartphone,
      color: 'from-purple-500 to-purple-600',
      popular: false
    }
  ];

  const handleConnect = async (walletType: WalletType) => {
    setSelectedWallet(walletType);
    try {
      await connect(walletType);
      showToast(`Connected to ${wallets.find(w => w.type === walletType)?.name}!`, 'success');
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error('Connection error:', error);
      showToast(error.message || 'Failed to connect wallet', 'error');
    } finally {
      setSelectedWallet(null);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900/95 backdrop-blur-lg p-8 rounded-2xl border border-white/10 w-full max-w-md">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white">Connect Wallet</h2>
            <p className="text-gray-400 text-sm">Choose your preferred Algorand wallet</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-4">
          {wallets.map((wallet) => (
            <button
              key={wallet.type}
              onClick={() => handleConnect(wallet.type)}
              disabled={isConnecting}
              className={`w-full p-4 rounded-xl border border-white/10 hover:border-white/20 transition-all duration-200 group ${
                selectedWallet === wallet.type ? 'opacity-50' : ''
              } ${isConnecting ? 'cursor-not-allowed' : 'hover:scale-105'}`}
            >
              <div className="flex items-center space-x-4">
                <div className={`w-12 h-12 bg-gradient-to-r ${wallet.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <wallet.icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 text-left">
                  <div className="flex items-center space-x-2">
                    <h3 className="text-white font-semibold">{wallet.name}</h3>
                    {wallet.popular && (
                      <span className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded-lg text-xs">
                        Popular
                      </span>
                    )}
                  </div>
                  <p className="text-gray-400 text-sm">{wallet.description}</p>
                </div>
                <div className="text-gray-400 group-hover:text-white transition-colors">
                  {selectedWallet === wallet.type && isConnecting ? (
                    <div className="w-5 h-5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <ExternalLink className="w-5 h-5" />
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>

        <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
          <div className="flex items-start space-x-3">
            <Shield className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="text-blue-400 font-medium text-sm">Secure Connection</h4>
              <p className="text-blue-300 text-xs mt-1">
                Your wallet connection is secure and encrypted. We never store your private keys.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-4 text-center">
          <p className="text-gray-400 text-xs">
            Don't have an Algorand wallet?{' '}
            <a 
              href="https://perawallet.app/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 underline"
            >
              Download Pera Wallet
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}