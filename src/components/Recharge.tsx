import React, { useState } from 'react';
import { 
  Smartphone, 
  Tv, 
  Gamepad2, 
  ArrowRight,
  Clock,
  CheckCircle,
  Crown
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Navigation } from './Navigation';
import { PinModal } from './PinModal';

interface RechargeProps {
  onNavigate: (page: string) => void;
}

export function Recharge({ onNavigate }: RechargeProps) {
  const { showToast, user, addTransaction, updateBalance } = useApp();
  const [activeTab, setActiveTab] = useState('mobile');
  const [mobileNumber, setMobileNumber] = useState('');
  const [operator, setOperator] = useState('');
  const [amount, setAmount] = useState('');
  const [showPinModal, setShowPinModal] = useState(false);
  const [pendingRecharge, setPendingRecharge] = useState<any>(null);

  const tabs = [
    { id: 'mobile', label: 'Mobile', icon: Smartphone },
    { id: 'dth', label: 'DTH', icon: Tv },
    { id: 'gaming', label: 'Gaming', icon: Gamepad2 },
  ];

  const operators = {
    mobile: ['Airtel', 'Jio', 'Vi', 'BSNL'],
    dth: ['Tata Sky', 'Airtel Digital TV', 'Dish TV', 'Sun Direct'],
    gaming: ['Steam', 'Google Play', 'App Store', 'PlayStation Store']
  };

  const plans = [
    { amount: 199, validity: '28 days', data: '1.5GB/day', description: 'Unlimited calls' },
    { amount: 399, validity: '56 days', data: '2GB/day', description: 'Unlimited calls + SMS' },
    { amount: 599, validity: '84 days', data: '1.5GB/day', description: 'Unlimited calls + 100 SMS/day' },
    { amount: 999, validity: '365 days', data: '2GB/day', description: 'Unlimited calls + SMS' },
  ];

  const calculateFee = (amount: number): number => {
    // Premium users get no fees
    if (user.premium) return 0;
    
    const baseAmount = parseFloat(amount.toString());
    if (isNaN(baseAmount)) return 0;
    
    return Math.min(baseAmount * 0.02, 1.00); // 2% with $1 maximum
  };

  const handleRecharge = (planAmount?: number) => {
    const rechargeAmount = planAmount || parseFloat(amount);
    
    if (!mobileNumber || !operator || !rechargeAmount) {
      showToast('Please fill in all required fields', 'error');
      return;
    }

    const fee = calculateFee(rechargeAmount);
    
    setPendingRecharge({
      number: mobileNumber,
      operator,
      amount: rechargeAmount,
      type: activeTab,
      fee: fee
    });
    setShowPinModal(true);
  };

  const handlePinSuccess = () => {
    if (pendingRecharge) {
      // Update balance - deduct from bank balance
      const totalAmount = pendingRecharge.amount + pendingRecharge.fee;
      updateBalance('debit', totalAmount, 'bank');

      // Add transaction to history
      addTransaction({
        type: 'recharge',
        status: 'completed',
        amount: pendingRecharge.amount,
        currency: 'USD',
        description: `${pendingRecharge.type.charAt(0).toUpperCase() + pendingRecharge.type.slice(1)} Recharge - ${pendingRecharge.operator}`,
        recipient: pendingRecharge.number,
        fee: pendingRecharge.fee,
        details: {
          operator: pendingRecharge.operator,
          type: pendingRecharge.type
        }
      });

      showToast(`Recharge of $${pendingRecharge.amount} initiated successfully for ${pendingRecharge.number}!`, 'success');
      
      // Send transaction confirmation message
      setTimeout(() => {
        const feeMessage = pendingRecharge.fee > 0 ? ` Fee: $${pendingRecharge.fee.toFixed(2)}.` : ' No fees applied (Premium member).';
        showToast(
          `Recharge completed! $${pendingRecharge.amount} recharged for ${pendingRecharge.number} via ${pendingRecharge.operator}.${feeMessage}`,
          'success'
        );
      }, 2000);
      
      setAmount('');
      setPendingRecharge(null);
    }
  };

  // Get recent recharge transactions from context
  const recentRecharges = user.connected ? 
    useApp().transactions.filter(t => t.type === 'recharge').slice(0, 3) : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
      <Navigation onNavigate={onNavigate} currentPage="recharge" />
      
      <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Recharge & Bills</h1>
              <p className="text-gray-400">Quick recharge for mobile, DTH, and gaming wallets with PIN security</p>
            </div>
            {user.premium && (
              <div className="flex items-center space-x-2 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-lg px-4 py-2">
                <Crown className="w-5 h-5 text-yellow-400" />
                <span className="text-yellow-400 font-medium">No Fees Applied</span>
              </div>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 mb-8 bg-white/5 backdrop-blur-lg p-1 rounded-xl border border-white/10 w-fit">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-6 py-3 rounded-lg transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-green-600 text-white'
                  : 'text-gray-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Recharge Form */}
          <div className="lg:col-span-2">
            <div className="bg-white/5 backdrop-blur-lg p-8 rounded-2xl border border-white/10 mb-6">
              <h2 className="text-xl font-semibold text-white mb-6">
                {activeTab === 'mobile' ? 'Mobile Recharge' : 
                 activeTab === 'dth' ? 'DTH Recharge' : 'Gaming Wallet'}
              </h2>
              
              {/* Mobile Number / ID Input */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  {activeTab === 'mobile' ? 'Mobile Number' : 
                   activeTab === 'dth' ? 'Customer ID' : 'Gaming Account'}
                </label>
                <input
                  type="text"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  placeholder={activeTab === 'mobile' ? 'Enter mobile number' : 
                              activeTab === 'dth' ? 'Enter customer ID' : 'Enter gaming account ID'}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Operator Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  {activeTab === 'gaming' ? 'Platform' : 'Operator'}
                </label>
                <select
                  value={operator}
                  onChange={(e) => setOperator(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="">Select {activeTab === 'gaming' ? 'platform' : 'operator'}</option>
                  {operators[activeTab as keyof typeof operators].map((op) => (
                    <option key={op} value={op} className="bg-gray-800">{op}</option>
                  ))}
                </select>
              </div>

              {/* Custom Amount */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-2">Custom Amount</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">$</span>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0"
                    className="w-full bg-white/5 border border-white/10 rounded-lg pl-8 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                  />
                </div>
                {amount && !user.premium && (
                  <div className="mt-2 text-sm text-yellow-400">
                    Platform fee: ${calculateFee(parseFloat(amount)).toFixed(2)}
                  </div>
                )}
                {amount && user.premium && (
                  <div className="mt-2 text-sm text-green-400 flex items-center space-x-1">
                    <Crown className="w-4 h-4" />
                    <span>Premium member - No fees applied!</span>
                  </div>
                )}
              </div>

              <button
                onClick={() => handleRecharge()}
                className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-4 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center space-x-2 transform hover:scale-105"
              >
                <span>Recharge Now</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>

            {/* Popular Plans (Mobile Only) */}
            {activeTab === 'mobile' && (
              <div className="bg-white/5 backdrop-blur-lg p-8 rounded-2xl border border-white/10">
                <h3 className="text-lg font-semibold text-white mb-6">Popular Plans</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {plans.map((plan, index) => (
                    <div key={index} className="bg-white/5 p-6 rounded-xl border border-white/10 hover:border-blue-500/50 transition-all duration-200">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-2xl font-bold text-white">${plan.amount}</span>
                        <span className="text-sm text-gray-400">{plan.validity}</span>
                      </div>
                      <div className="space-y-2 mb-4">
                        <div className="text-sm text-gray-300">{plan.data}</div>
                        <div className="text-sm text-gray-400">{plan.description}</div>
                      </div>
                      <button
                        onClick={() => handleRecharge(plan.amount)}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition-colors"
                      >
                        Select Plan
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Recent Recharges */}
          <div>
            <div className="bg-white/5 backdrop-blur-lg p-6 rounded-2xl border border-white/10">
              <h3 className="text-lg font-semibold text-white mb-4">Recent Recharges</h3>
              <div className="space-y-4">
                {recentRecharges.length > 0 ? (
                  recentRecharges.map((recharge) => (
                    <div key={recharge.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg ${
                          recharge.status === 'completed' ? 'bg-green-500/20' : 'bg-yellow-500/20'
                        }`}>
                          {recharge.status === 'completed' ? 
                            <CheckCircle className="w-4 h-4 text-green-400" /> :
                            <Clock className="w-4 h-4 text-yellow-400" />
                          }
                        </div>
                        <div>
                          <div className="text-white font-medium text-sm">{recharge.recipient}</div>
                          <div className="text-gray-400 text-xs">{recharge.details?.operator} • {recharge.time}</div>
                        </div>
                      </div>
                      <div className="text-white font-semibold">${recharge.amount}</div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-400">
                    <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No recent recharges</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <PinModal
        isOpen={showPinModal}
        onClose={() => setShowPinModal(false)}
        onSuccess={handlePinSuccess}
        title="Confirm Recharge"
        description="Enter your PIN to complete the recharge"
        amount={pendingRecharge?.amount}
        fee={pendingRecharge?.fee}
      />
    </div>
  );
}