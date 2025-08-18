import React from 'react';
import { 
  CreditCard, 
  Smartphone, 
  Ticket, 
  TrendingUp, 
  ArrowLeftRight, 
  User,
  Crown,
  Eye,
  EyeOff,
  DollarSign,
  PiggyBank,
  Wallet,
  TrendingDown
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAlgorand } from '../context/AlgorandContext';
import { Navigation } from './Navigation';

interface DashboardProps {
  onNavigate: (page: string) => void;
}

export function Dashboard({ onNavigate }: DashboardProps) {
  const { user, balance } = useApp();
  const { isConnected, activeAccount, balance: algoBalance, accountInfo } = useAlgorand();
  const [showBalance, setShowBalance] = React.useState(true);

  const totalNetWorth = balance.bank + (isConnected ? algoBalance : balance.algo) + balance.usdc + balance.stocks;

  const features = [
    { icon: CreditCard, label: 'Payments', page: 'payments', color: 'from-blue-500 to-blue-600' },
    { icon: Smartphone, label: 'Recharges', page: 'recharge', color: 'from-green-500 to-green-600' },
    { icon: Ticket, label: 'Tickets', page: 'tickets', color: 'from-purple-500 to-purple-600' },
    { icon: TrendingUp, label: 'Trade', page: 'trade', color: 'from-orange-500 to-orange-600' },
    { icon: ArrowLeftRight, label: 'Convert', page: 'convert', color: 'from-teal-500 to-teal-600' },
    { icon: User, label: 'Profile', page: 'wallet', color: 'from-gray-500 to-gray-600' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
      <Navigation onNavigate={onNavigate} currentPage="dashboard" />
      
      <div className="container mx-auto px-6 py-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Welcome back{user.email ? `, ${user.email.split('@')[0]}` : 
                        isConnected && activeAccount ? `, ${activeAccount.address.slice(0, 8)}...` : ''}!
          </h1>
          <p className="text-gray-400">
            {isConnected ? 'Manage your finances on Algorand blockchain' : 'Manage your finances across all platforms'}
          </p>
        </div>

        {/* Net Worth Card */}
        <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-lg p-8 rounded-2xl border border-white/10 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-white">Total Net Worth</h2>
            <div className="flex items-center space-x-2">
              {!user.premium && (
                <button
                  onClick={() => onNavigate('premium')}
                  className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-3 py-1 rounded-lg text-sm flex items-center space-x-1 hover:scale-105 transition-transform"
                >
                  <Crown className="w-4 h-4" />
                  <span>Upgrade</span>
                </button>
              )}
              <button
                onClick={() => setShowBalance(!showBalance)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                {showBalance ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>
          <div className="text-4xl font-bold text-white mb-2">
            {showBalance ? `$${totalNetWorth.toLocaleString()}` : '••••••'}
          </div>
          <div className="flex items-center text-green-400">
            <TrendingUp className="w-4 h-4 mr-1" />
            <span className="text-sm">+12.5% this month</span>
          </div>
        </div>

        {/* Balance Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/5 backdrop-blur-lg p-6 rounded-xl border border-white/10">
            <div className="flex items-center justify-between mb-3">
              <PiggyBank className="w-6 h-6 text-blue-400" />
              <span className="text-xs text-gray-400 uppercase tracking-wide">Bank</span>
            </div>
            <div className="text-2xl font-bold text-white">
              {showBalance ? `$${balance.bank.toLocaleString()}` : '••••••'}
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-lg p-6 rounded-xl border border-white/10">
            <div className="flex items-center justify-between mb-3">
              <Wallet className="w-6 h-6 text-green-400" />
              <span className="text-green-400 font-medium">
                ALGO {isConnected && <span className="text-xs">(Live)</span>}
              </span>
            </div>
            <div className="text-2xl font-bold text-white">
              {showBalance ? `${isConnected ? algoBalance.toFixed(4) : balance.algo.toLocaleString()} ALGO` : '••••••'}
            </div>
            {isConnected && accountInfo && (
              <div className="text-green-400 text-sm">
                Min Balance: {accountInfo.minBalance.toFixed(4)} ALGO
              </div>
            )}
          </div>

          <div className="bg-white/5 backdrop-blur-lg p-6 rounded-xl border border-white/10">
            <div className="flex items-center justify-between mb-3">
              <DollarSign className="w-6 h-6 text-teal-400" />
              <span className="text-xs text-gray-400 uppercase tracking-wide">USDC</span>
            </div>
            <div className="text-2xl font-bold text-white">
              {showBalance ? `$${balance.usdc.toLocaleString()}` : '••••••'}
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-lg p-6 rounded-xl border border-white/10">
            <div className="flex items-center justify-between mb-3">
              <TrendingUp className="w-6 h-6 text-purple-400" />
              <span className="text-xs text-gray-400 uppercase tracking-wide">Stocks</span>
            </div>
            <div className="text-2xl font-bold text-white">
              {showBalance ? `$${balance.stocks.toLocaleString()}` : '••••••'}
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <button
              key={index}
              onClick={() => onNavigate(feature.page)}
              className="bg-white/5 backdrop-blur-lg p-8 rounded-2xl border border-white/10 hover:bg-white/10 transition-all duration-300 group"
            >
              <div className={`bg-gradient-to-r ${feature.color} p-4 rounded-xl mb-4 inline-block group-hover:scale-110 transition-transform`}>
                <feature.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">{feature.label}</h3>
              <p className="text-gray-400 text-sm">
                {feature.label === 'Payments' && 'Send money instantly'}
                {feature.label === 'Recharges' && 'Mobile & DTH recharge'}
                {feature.label === 'Tickets' && 'Book travel & events'}
                {feature.label === 'Trade' && 'Stocks & crypto trading'}
                {feature.label === 'Convert' && 'Currency exchange'}
                {feature.label === 'Profile' && 'Manage your account'}
              </p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}