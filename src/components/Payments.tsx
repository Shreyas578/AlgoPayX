import React, { useState } from 'react';
import { 
  CreditCard, 
  Smartphone, 
  QrCode, 
  ArrowRight, 
  Clock, 
  CheckCircle,
  Wallet,
  Building,
  Crown
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Navigation } from './Navigation';
import { PinModal } from './PinModal';

interface PaymentsProps {
  onNavigate: (page: string) => void;
}

export function Payments({ onNavigate }: PaymentsProps) {
  const { balance, showToast, user, addTransaction, updateBalance } = useApp();
  const [selectedMethod, setSelectedMethod] = useState('bank');
  const [amount, setAmount] = useState('');
  const [recipient, setRecipient] = useState('');
  const [paymentSource, setPaymentSource] = useState('bank');
  const [showPinModal, setShowPinModal] = useState(false);
  const [pendingPayment, setPendingPayment] = useState<any>(null);

  const paymentMethods = [
    { id: 'bank', label: 'Bank Account', icon: Building, description: 'NEFT/RTGS Transfer' },
    { id: 'mobile', label: 'Mobile Number', icon: Smartphone, description: 'UPI Payment' },
    { id: 'qr', label: 'QR Code', icon: QrCode, description: 'Scan & Pay' },
  ];

  const paymentSources = [
    { id: 'bank', label: 'Bank Balance', balance: balance.bank },
    { id: 'algo', label: 'ALGO', balance: balance.algo },
    { id: 'usdc', label: 'USDC', balance: balance.usdc },
  ];

  const calculateFee = (amount: number, method: string): number => {
    // Premium users get no fees
    if (user.premium) return 0;
    
    const baseAmount = parseFloat(amount.toString());
    if (isNaN(baseAmount)) return 0;
    
    switch (method) {
      case 'bank':
        return Math.max(baseAmount * 0.001, 1.00); // 0.1% with $1 minimum
      case 'mobile':
        return baseAmount * 0.005; // 0.5%
      case 'qr':
        return baseAmount * 0.002; // 0.2%
      default:
        return 0;
    }
  };

  const handleSendPayment = () => {
    if (!amount || !recipient) {
      showToast('Please fill in all required fields', 'error');
      return;
    }

    const amountNum = parseFloat(amount);
    const selectedSource = paymentSources.find(s => s.id === paymentSource);
    const fee = calculateFee(amountNum, selectedMethod);
    const total = amountNum + fee;
    
    if (selectedSource && total > selectedSource.balance) {
      showToast('Insufficient balance including fees', 'error');
      return;
    }

    setPendingPayment({
      amount: amountNum,
      fee: fee,
      recipient,
      method: selectedMethod,
      source: paymentSource
    });
    setShowPinModal(true);
  };

  const handlePinSuccess = () => {
    if (pendingPayment) {
      // Update balance
      const totalAmount = pendingPayment.amount + pendingPayment.fee;
      updateBalance('debit', totalAmount, pendingPayment.source as 'bank' | 'algo' | 'usdc' | 'stocks');

      // Add transaction to history
      addTransaction({
        type: 'payment',
        status: 'completed',
        amount: pendingPayment.amount,
        currency: 'USD',
        description: `Payment via ${pendingPayment.method.toUpperCase()}`,
        recipient: pendingPayment.recipient,
        fee: pendingPayment.fee,
        details: {
          method: pendingPayment.method,
          source: pendingPayment.source
        }
      });

      showToast(`Payment of $${pendingPayment.amount} sent successfully to ${pendingPayment.recipient}!`, 'success');
      
      // Send transaction confirmation message
      setTimeout(() => {
        const feeMessage = pendingPayment.fee > 0 ? ` Fee: $${pendingPayment.fee.toFixed(2)}.` : ' No fees applied (Premium member).';
        showToast(
          `Payment completed! $${pendingPayment.amount} sent to ${pendingPayment.recipient} via ${pendingPayment.method.toUpperCase()}.${feeMessage}`,
          'success'
        );
      }, 2000);
      
      setAmount('');
      setRecipient('');
      setPendingPayment(null);
    }
  };

  // Get recent transactions from context
  const recentTransactions = user.connected ? 
    useApp().transactions.filter(t => t.type === 'payment').slice(0, 3) : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
      <Navigation onNavigate={onNavigate} currentPage="payments" />
      
      <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Payments</h1>
              <p className="text-gray-400">Send money instantly across multiple channels with PIN security</p>
            </div>
            {user.premium && (
              <div className="flex items-center space-x-2 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-lg px-4 py-2">
                <Crown className="w-5 h-5 text-yellow-400" />
                <span className="text-yellow-400 font-medium">No Fees Applied</span>
              </div>
            )}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Payment Form */}
          <div className="lg:col-span-2">
            <div className="bg-white/5 backdrop-blur-lg p-8 rounded-2xl border border-white/10">
              <h2 className="text-xl font-semibold text-white mb-6">Send Payment</h2>
              
              {/* Payment Method Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-3">Payment Method</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {paymentMethods.map((method) => (
                    <button
                      key={method.id}
                      onClick={() => setSelectedMethod(method.id)}
                      className={`p-4 rounded-xl border transition-all duration-200 ${
                        selectedMethod === method.id
                          ? 'border-blue-500 bg-blue-500/10 text-blue-400'
                          : 'border-white/10 bg-white/5 text-gray-300 hover:border-white/20'
                      }`}
                    >
                      <method.icon className="w-6 h-6 mx-auto mb-2" />
                      <div className="text-sm font-medium">{method.label}</div>
                      <div className="text-xs text-gray-400 mt-1">{method.description}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Recipient Input */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  {selectedMethod === 'bank' ? 'Account Number' : 
                   selectedMethod === 'mobile' ? 'Mobile Number' : 'QR Code'}
                </label>
                <input
                  type="text"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  placeholder={
                    selectedMethod === 'bank' ? 'Enter account number' :
                    selectedMethod === 'mobile' ? 'Enter mobile number' : 'Upload QR code'
                  }
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Amount Input */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-2">Amount</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">$</span>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full bg-white/5 border border-white/10 rounded-lg pl-8 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                  />
                </div>
                {amount && !user.premium && (
                  <div className="mt-2 text-sm text-yellow-400">
                    Platform fee: ${calculateFee(parseFloat(amount), selectedMethod).toFixed(2)}
                  </div>
                )}
                {amount && user.premium && (
                  <div className="mt-2 text-sm text-green-400 flex items-center space-x-1">
                    <Crown className="w-4 h-4" />
                    <span>Premium member - No fees applied!</span>
                  </div>
                )}
              </div>

              {/* Payment Source */}
              <div className="mb-8">
                <label className="block text-sm font-medium text-gray-300 mb-3">Pay From</label>
                <div className="space-y-2">
                  {paymentSources.map((source) => (
                    <button
                      key={source.id}
                      onClick={() => setPaymentSource(source.id)}
                      className={`w-full flex items-center justify-between p-4 rounded-lg border transition-all duration-200 ${
                        paymentSource === source.id
                          ? 'border-blue-500 bg-blue-500/10'
                          : 'border-white/10 bg-white/5 hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <Wallet className="w-5 h-5 text-gray-400" />
                        <span className="text-white font-medium">{source.label}</span>
                      </div>
                      <span className="text-gray-300">${source.balance.toLocaleString()}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Send Button */}
              <button
                onClick={handleSendPayment}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-4 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center space-x-2 transform hover:scale-105"
              >
                <span>Send Payment</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Recent Transactions */}
          <div>
            <div className="bg-white/5 backdrop-blur-lg p-6 rounded-2xl border border-white/10">
              <h3 className="text-lg font-semibold text-white mb-4">Recent Transactions</h3>
              <div className="space-y-4">
                {recentTransactions.length > 0 ? (
                  recentTransactions.map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg ${
                          transaction.status === 'completed' ? 'bg-green-500/20' : 'bg-yellow-500/20'
                        }`}>
                          {transaction.status === 'completed' ? 
                            <CheckCircle className="w-4 h-4 text-green-400" /> :
                            <Clock className="w-4 h-4 text-yellow-400" />
                          }
                        </div>
                        <div>
                          <div className="text-white font-medium text-sm">{transaction.recipient || transaction.description}</div>
                          <div className="text-gray-400 text-xs">{transaction.time} • {transaction.details?.method || 'Payment'}</div>
                        </div>
                      </div>
                      <div className="text-white font-semibold">${transaction.amount}</div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-400">
                    <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No recent payments</p>
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
        title="Confirm Payment"
        description="Enter your PIN to complete the payment"
        amount={pendingPayment?.amount}
        fee={pendingPayment?.fee}
      />
    </div>
  );
}