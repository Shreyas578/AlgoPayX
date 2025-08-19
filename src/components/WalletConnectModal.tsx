import React, { useState } from 'react';
import { X, Wallet, Smartphone, Shield, ExternalLink, Globe, Zap, Star, Download } from 'lucide-react';
import { WalletType, detectWeb3Wallets } from '../services/algorand';
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
  const [activeTab, setActiveTab] = useState<'algorand' | 'web3'>('algorand');
  
  const web3Wallets = detectWeb3Wallets();

  const algorandWallets = [
    {
      type: WalletType.PERA,
      name: 'Pera Wallet',
      description: 'The official Algorand wallet',
      icon: Wallet,
      color: 'from-blue-500 to-blue-600',
      popular: true,
      installed: true
    },
    {
      type: WalletType.MYALGO,
      name: 'MyAlgo Wallet',
      description: 'Web-based Algorand wallet',
      icon: Shield,
      color: 'from-green-500 to-green-600',
      popular: false,
      installed: true
    },
    {
      type: WalletType.DEFLY,
      name: 'Defly Wallet',
      description: 'DeFi-focused Algorand wallet',
      icon: Smartphone,
      color: 'from-purple-500 to-purple-600',
      popular: false,
      installed: true
    },
    {
      type: WalletType.WALLETCONNECT,
      name: 'WalletConnect',
      description: 'Connect with QR code',
      icon: Globe,
      color: 'from-indigo-500 to-indigo-600',
      popular: true,
      installed: true
    }
  ];
  
  const web3WalletList = [
    {
      type: WalletType.METAMASK,
      name: 'MetaMask',
      description: 'The most popular Web3 wallet',
      icon: Zap,
      color: 'from-orange-500 to-orange-600',
      popular: true,
      installed: web3Wallets.metamask,
      downloadUrl: 'https://metamask.io/download/'
    },
    {
      type: WalletType.COINBASE,
      name: 'Coinbase Wallet',
      description: 'Self-custody wallet by Coinbase',
      icon: Shield,
      color: 'from-blue-600 to-blue-700',
      popular: true,
      installed: web3Wallets.coinbase,
      downloadUrl: 'https://www.coinbase.com/wallet'
    },
    {
      type: WalletType.RAINBOW,
      name: 'Rainbow',
      description: 'Colorful Ethereum wallet',
      icon: Star,
      color: 'from-pink-500 to-purple-600',
      popular: true,
      installed: web3Wallets.rainbow,
      downloadUrl: 'https://rainbow.me/'
    },
    {
      type: WalletType.TRUST,
      name: 'Trust Wallet',
      description: 'Multi-chain mobile wallet',
      icon: Shield,
      color: 'from-blue-500 to-teal-500',
      popular: false,
      installed: web3Wallets.trust,
      downloadUrl: 'https://trustwallet.com/'
    },
    {
      type: WalletType.PHANTOM,
      name: 'Phantom',
      description: 'Solana & multi-chain wallet',
      icon: Smartphone,
      color: 'from-purple-600 to-pink-600',
      popular: false,
      installed: web3Wallets.phantom,
      downloadUrl: 'https://phantom.app/'
    }
  ];

  const handleConnect = async (walletType: WalletType) => {
    setSelectedWallet(walletType);
    try {
      await connect(walletType);
      const allWallets = [...algorandWallets, ...web3WalletList];
      showToast(`Connected to ${allWallets.find(w => w.type === walletType)?.name}!`, 'success');
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error('Connection error:', error);
      showToast(error.message || 'Failed to connect wallet', 'error');
    } finally {
      setSelectedWallet(null);
    }
  };
  
  const handleInstallWallet = (downloadUrl: string) => {
    window.open(downloadUrl, '_blank');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900/95 backdrop-blur-lg p-8 rounded-2xl border border-white/10 w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white">Connect Wallet</h2>
            <p className="text-gray-400 text-sm">Choose your preferred wallet to connect</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 mb-6 bg-white/5 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('algorand')}
            className={`flex-1 py-2 px-4 rounded-md transition-all duration-200 text-sm font-medium ${
              activeTab === 'algorand'
                ? 'bg-blue-600 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Algorand Native
          </button>
          <button
            onClick={() => setActiveTab('web3')}
            className={`flex-1 py-2 px-4 rounded-md transition-all duration-200 text-sm font-medium ${
              activeTab === 'web3'
                ? 'bg-blue-600 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Web3 Wallets
          </button>
        </div>

        <div className="space-y-4">
          {(activeTab === 'algorand' ? algorandWallets : web3WalletList).map((wallet) => (
            <button
              key={wallet.type}
              onClick={() => wallet.installed ? handleConnect(wallet.type) : handleInstallWallet(wallet.downloadUrl || '')}
              disabled={isConnecting || (activeTab === 'web3' && !wallet.installed && !wallet.downloadUrl)}
              className={`w-full p-4 rounded-xl border border-white/10 hover:border-white/20 transition-all duration-200 group ${
                selectedWallet === wallet.type ? 'opacity-50' : ''
              } ${isConnecting || (activeTab === 'web3' && !wallet.installed) ? 'cursor-not-allowed' : 'hover:scale-105'}`}
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
                    {activeTab === 'web3' && !wallet.installed && (
                      <span className="bg-red-500/20 text-red-400 px-2 py-1 rounded-lg text-xs">
                        Not Installed
                      </span>
                    )}
                    {activeTab === 'web3' && wallet.installed && (
                      <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded-lg text-xs">
                        Detected
                      </span>
                    )}
                  </div>
                  <p className="text-gray-400 text-sm">{wallet.description}</p>
                </div>
                <div className="text-gray-400 group-hover:text-white transition-colors">
                  {selectedWallet === wallet.type && isConnecting ? (
                    <div className="w-5 h-5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
                  ) : activeTab === 'web3' && !wallet.installed ? (
                    <Download className="w-5 h-5" />
                  ) : (
                    <ExternalLink className="w-5 h-5" />
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>

        {activeTab === 'algorand' && (
          <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
            <div className="flex items-start space-x-3">
              <Shield className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="text-blue-400 font-medium text-sm">Native Algorand Support</h4>
                <p className="text-blue-300 text-xs mt-1">
                  These wallets provide native Algorand blockchain support with full transaction capabilities.
                </p>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'web3' && (
          <div className="mt-6 p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg">
            <div className="flex items-start space-x-3">
              <Globe className="w-5 h-5 text-purple-400 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="text-purple-400 font-medium text-sm">Web3 Bridge Integration</h4>
                <p className="text-purple-300 text-xs mt-1">
                  Web3 wallets connect through our bridge service to interact with Algorand blockchain.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="mt-6 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
          <div className="flex items-start space-x-3">
            <Shield className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="text-green-400 font-medium text-sm">Secure Connection</h4>
              <p className="text-green-300 text-xs mt-1">
                Your wallet connection is secure and encrypted. We never store your private keys.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-4 text-center">
          <p className="text-gray-400 text-xs">
            New to {activeTab === 'algorand' ? 'Algorand' : 'Web3'}?{' '}
            <a 
              href={activeTab === 'algorand' ? "https://perawallet.app/" : "https://ethereum.org/en/wallets/"} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 underline"
            >
              {activeTab === 'algorand' ? 'Download Pera Wallet' : 'Learn about Web3 Wallets'}
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}