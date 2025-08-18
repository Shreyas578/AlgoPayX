import React from 'react';
import { 
  Home, 
  LayoutDashboard, 
  CreditCard, 
  Smartphone, 
  Ticket, 
  ArrowLeftRight, 
  TrendingUp, 
  Wallet,
  Crown,
  LogOut,
  History
} from 'lucide-react';
import { useApp } from '../context/AppContext';

interface NavigationProps {
  onNavigate: (page: string) => void;
  currentPage: string;
}

export function Navigation({ onNavigate, currentPage }: NavigationProps) {
  const { user, setUser, showToast } = useApp();

  const handleLogout = () => {
    setUser({ connected: false, premium: false, hasPassword: false });
    showToast('Logged out successfully', 'info');
    onNavigate('home');
  };

  const navItems = [
    { icon: Home, label: 'Home', page: 'home' },
    { icon: LayoutDashboard, label: 'Dashboard', page: 'dashboard' },
    { icon: CreditCard, label: 'Payments', page: 'payments' },
    { icon: Smartphone, label: 'Recharge', page: 'recharge' },
    { icon: Ticket, label: 'Tickets', page: 'tickets' },
    { icon: ArrowLeftRight, label: 'Convert', page: 'convert' },
    { icon: TrendingUp, label: 'Trade', page: 'trade' },
    { icon: Wallet, label: 'Wallet', page: 'wallet' },
    { icon: History, label: 'History', page: 'history' },
  ];

  return (
    <nav className="bg-black/20 backdrop-blur-lg border-b border-white/10">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div 
            className="flex items-center space-x-2 cursor-pointer"
            onClick={() => onNavigate('home')}
          >
            <div className="bg-gradient-to-r from-blue-500 to-teal-500 p-2 rounded-lg">
              <div className="w-6 h-6 bg-white rounded-sm flex items-center justify-center">
                <span className="text-blue-600 font-bold text-sm">A</span>
              </div>
            </div>
            <span className="text-white font-bold text-xl">AlgoPayX</span>
          </div>

          {/* Navigation Items */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <button
                key={item.page}
                onClick={() => onNavigate(item.page)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                  currentPage === item.page
                    ? 'bg-blue-600/20 text-blue-400'
                    : 'text-gray-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <item.icon className="w-4 h-4" />
                <span className="text-sm">{item.label}</span>
              </button>
            ))}
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            {!user.premium && user.connected && (
              <button
                onClick={() => onNavigate('premium')}
                className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-4 py-2 rounded-lg text-sm flex items-center space-x-2 hover:scale-105 transition-transform"
              >
                <Crown className="w-4 h-4" />
                <span className="hidden sm:inline">Upgrade</span>
              </button>
            )}
            
            {user.connected && (
              <div className="flex items-center space-x-2">
                <div className="text-right hidden sm:block">
                  <div className="text-white text-sm flex items-center space-x-1">
                    {user.premium && <Crown className="w-4 h-4 text-yellow-400" />}
                    <span>{user.email ? user.email.split('@')[0] : 'Wallet User'}</span>
                  </div>
                  <div className="text-gray-400 text-xs">
                    {user.walletAddress ? `${user.walletAddress.slice(0, 8)}...` : user.email}
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="text-gray-400 hover:text-white transition-colors p-2"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden overflow-x-auto">
          <div className="flex space-x-1 py-2">
            {navItems.map((item) => (
              <button
                key={item.page}
                onClick={() => onNavigate(item.page)}
                className={`flex items-center space-x-1 px-3 py-2 rounded-lg whitespace-nowrap transition-all duration-200 ${
                  currentPage === item.page
                    ? 'bg-blue-600/20 text-blue-400'
                    : 'text-gray-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <item.icon className="w-4 h-4" />
                <span className="text-xs">{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}