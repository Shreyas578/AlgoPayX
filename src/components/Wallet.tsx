import React, { useState } from 'react';
import { 
  Wallet as WalletIcon, 
  User, 
  Shield, 
  Key, 
  Bell,
  Eye,
  EyeOff,
  Copy,
  ExternalLink,
  Settings,
  LogOut,
  CreditCard,
  Building,
  Smartphone
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAlgorand } from '../context/AlgorandContext';
import { Navigation } from './Navigation';

interface WalletProps {
  onNavigate: (page: string) => void;
}

export function Wallet({ onNavigate }: WalletProps) {
  const { user, balance, setUser, showToast } = useApp();
  const { isConnected, activeAccount, accountInfo, balance: algoBalance, assets, disconnect } = useAlgorand();
  const [showPrivateKey, setShowPrivateKey] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Overview', icon: WalletIcon },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const connectedAccounts = [
    { type: 'bank', name: 'Chase Bank', account: '****1234', status: 'verified', icon: Building },
    { type: 'card', name: 'Visa Card', account: '****5678', status: 'verified', icon: CreditCard },
    { type: 'mobile', name: 'Phone Pay', account: '+91 ****5432', status: 'pending', icon: Smartphone },
  ];

  const securityFeatures = [
    { name: '2FA Authentication', enabled: true, description: 'Two-factor authentication via SMS' },
    { name: 'Biometric Login', enabled: false, description: 'Fingerprint and Face ID' },
    { name: 'Transaction Alerts', enabled: true, description: 'Real-time notifications' },
    { name: 'Auto-lock', enabled: true, description: 'Lock after 5 minutes of inactivity' },
  ];

  const handleCopyAddress = () => {
    if (user.walletAddress) {
      navigator.clipboard.writeText(user.walletAddress);
      showToast('Wallet address copied!', 'success');
    }
  };

  const handleLogout = () => {
    if (isConnected) {
      disconnect();
    }
    setUser({ connected: false, premium: false, hasPassword: false });
    showToast('Logged out successfully', 'info');
    onNavigate('home');
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Wallet Address */}
      {(user.walletAddress || (isConnected && activeAccount)) && (
        <div className="bg-white/5 backdrop-blur-lg p-6 rounded-2xl border border-white/10">
          <h3 className="text-lg font-semibold text-white mb-4">Wallet Address</h3>
          <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-teal-500 rounded-full flex items-center justify-center">
                <WalletIcon className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-white font-medium">
                  Algorand Wallet {isConnected && <span className="text-green-400 text-xs">(Connected)</span>}
                </div>
                <div className="text-gray-400 text-sm font-mono">
                  {isConnected && activeAccount ? activeAccount.address : user.walletAddress}
                </div>
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={handleCopyAddress}
                className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
              >
                <Copy className="w-4 h-4 text-gray-400" />
              </button>
              <button className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors">
                <ExternalLink className="w-4 h-4 text-gray-400" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Account Balances */}
      <div className="bg-white/5 backdrop-blur-lg p-6 rounded-2xl border border-white/10">
        <h3 className="text-lg font-semibold text-white mb-4">Account Balances</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-4 bg-white/5 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-300">Bank Account</span>
              <Building className="w-5 h-5 text-blue-400" />
            </div>
            <div className="text-2xl font-bold text-white">${balance.bank.toLocaleString()}</div>
            <div className="text-gray-400 text-sm">Traditional Banking</div>
          </div>
          
          <div className="p-4 bg-white/5 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-300">ALGO Balance</span>
              <WalletIcon className="w-5 h-5 text-green-400" />
            </div>
            <div className="text-2xl font-bold text-white">
              {isConnected ? `${algoBalance.toFixed(4)} ALGO` : `$${balance.algo.toLocaleString()}`}
            </div>
            <div className="text-gray-400 text-sm">
              {isConnected ? 'Live Balance' : 'Algorand Blockchain'}
            </div>
          </div>
          
          <div className="p-4 bg-white/5 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-300">USDC Balance</span>
              <CreditCard className="w-5 h-5 text-teal-400" />
            </div>
            <div className="text-2xl font-bold text-white">${balance.usdc.toLocaleString()}</div>
            <div className="text-gray-400 text-sm">Stablecoin</div>
          </div>
          
          <div className="p-4 bg-white/5 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-300">Stock Portfolio</span>
              <CreditCard className="w-5 h-5 text-purple-400" />
            </div>
            <div className="text-2xl font-bold text-white">${balance.stocks.toLocaleString()}</div>
            <div className="text-gray-400 text-sm">Stock Investments</div>
          </div>
        </div>
      </div>

      {/* Algorand Assets */}
      {isConnected && assets && assets.length > 0 && (
        <div className="bg-white/5 backdrop-blur-lg p-6 rounded-2xl border border-white/10">
          <h3 className="text-lg font-semibold text-white mb-4">Algorand Standard Assets (ASAs)</h3>
          <div className="space-y-3">
            {assets.slice(0, 5).map((asset, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-teal-500 to-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-xs">A</span>
                  </div>
                  <div>
                    <div className="text-white font-medium">Asset #{asset['asset-id']}</div>
                    <div className="text-gray-400 text-sm">Amount: {asset.amount}</div>
                  </div>
                </div>
                <span className="text-green-400 text-sm">Opted In</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Connected Accounts */}
      <div className="bg-white/5 backdrop-blur-lg p-6 rounded-2xl border border-white/10">
        <h3 className="text-lg font-semibold text-white mb-4">Connected Accounts</h3>
        <div className="space-y-3">
          {connectedAccounts.map((account, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
              <div className="flex items-center space-x-3">
                <account.icon className="w-5 h-5 text-gray-400" />
                <div>
                  <div className="text-white font-medium">{account.name}</div>
                  <div className="text-gray-400 text-sm">{account.account}</div>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-lg text-xs font-medium ${
                account.status === 'verified' 
                  ? 'bg-green-500/20 text-green-400' 
                  : 'bg-yellow-500/20 text-yellow-400'
              }`}>
                {account.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderProfile = () => (
    <div className="bg-white/5 backdrop-blur-lg p-6 rounded-2xl border border-white/10">
      <h3 className="text-lg font-semibold text-white mb-6">Profile Information</h3>
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
          <input
            type="email"
            value={user.email || ''}
            readOnly
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Account Type</label>
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={user.premium ? 'Premium' : 'Free'}
              readOnly
              className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white"
            />
            {!user.premium && (
              <button
                onClick={() => onNavigate('premium')}
                className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-4 py-3 rounded-lg hover:scale-105 transition-transform"
              >
                Upgrade
              </button>
            )}
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Member Since</label>
          <input
            type="text"
            value="January 2024"
            readOnly
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white"
          />
        </div>
      </div>
    </div>
  );

  const renderSecurity = () => (
    <div className="space-y-6">
      <div className="bg-white/5 backdrop-blur-lg p-6 rounded-2xl border border-white/10">
        <h3 className="text-lg font-semibold text-white mb-6">Security Features</h3>
        <div className="space-y-4">
          {securityFeatures.map((feature, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
              <div>
                <div className="text-white font-medium">{feature.name}</div>
                <div className="text-gray-400 text-sm">{feature.description}</div>
              </div>
              <button
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  feature.enabled ? 'bg-blue-600' : 'bg-gray-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    feature.enabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>

      {(user.walletAddress || (isConnected && activeAccount)) && (
        <div className="bg-white/5 backdrop-blur-lg p-6 rounded-2xl border border-white/10">
          <h3 className="text-lg font-semibold text-white mb-4">Private Key</h3>
          <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg mb-4">
            <div className="flex items-center space-x-2 text-yellow-400 mb-2">
              <Shield className="w-5 h-5" />
              <span className="font-medium">Security Warning</span>
            </div>
            <p className="text-yellow-300 text-sm">
              Never share your private key with anyone. Store it securely offline.
            </p>
          </div>
          <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
            <div className="flex items-center space-x-3">
              <Key className="w-5 h-5 text-gray-400" />
              <span className="text-white font-mono">
                {showPrivateKey ? 
                  (isConnected ? 'Managed by wallet app' : 'ed25519:5KQw...R7X9') : 
                  '••••••••••••••••••••••••••••••••'
                }
              </span>
            </div>
            <button
              onClick={() => setShowPrivateKey(!showPrivateKey)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              {showPrivateKey ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>
      )}
    </div>
  );

  const renderSettings = () => (
    <div className="bg-white/5 backdrop-blur-lg p-6 rounded-2xl border border-white/10">
      <h3 className="text-lg font-semibold text-white mb-6">Settings</h3>
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
          <div className="flex items-center space-x-3">
            <Bell className="w-5 h-5 text-gray-400" />
            <div>
              <div className="text-white font-medium">Push Notifications</div>
              <div className="text-gray-400 text-sm">Receive alerts for transactions</div>
            </div>
          </div>
          <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-600">
            <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-6" />
          </button>
        </div>

        <button
          onClick={() => onNavigate('premium')}
          className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-lg hover:border-yellow-500/50 transition-colors"
        >
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">★</span>
            </div>
            <div>
              <div className="text-white font-medium">Upgrade to Premium</div>
              <div className="text-gray-400 text-sm">Unlock advanced features</div>
            </div>
          </div>
          <ExternalLink className="w-5 h-5 text-yellow-400" />
        </button>

        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center space-x-2 p-4 bg-red-600/20 border border-red-500/30 rounded-lg hover:bg-red-600/30 transition-colors"
        >
          <LogOut className="w-5 h-5 text-red-400" />
          <span className="text-red-400 font-medium">Sign Out</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
      <Navigation onNavigate={onNavigate} currentPage="wallet" />
      
      <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Wallet & Profile</h1>
          <p className="text-gray-400">Manage your account, security, and preferences</p>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 mb-8 bg-white/5 backdrop-blur-lg p-1 rounded-xl border border-white/10 w-fit">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-6 py-3 rounded-lg transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-gray-600 text-white'
                  : 'text-gray-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'profile' && renderProfile()}
          {activeTab === 'security' && renderSecurity()}
          {activeTab === 'settings' && renderSettings()}
        </div>
      </div>
    </div>
  );
}