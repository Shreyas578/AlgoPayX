import React, { useState } from 'react';
import { 
  ArrowLeftRight, 
  TrendingUp, 
  TrendingDown,
  RefreshCw,
  Clock,
  CheckCircle,
  Crown
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Navigation } from './Navigation';
import { PinModal } from './PinModal';

interface ConvertProps {
  onNavigate: (page: string) => void;
}

export function Convert({ onNavigate }: ConvertProps) {
  const { balance, showToast, user, addTransaction, updateBalance } = useApp();
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('ALGO');
  const [amount, setAmount] = useState('');
  const [convertedAmount, setConvertedAmount] = useState('0');
  const [showPinModal, setShowPinModal] = useState(false);
  const [pendingConversion, setPendingConversion] = useState<any>(null);

  const currencies = [
    { code: 'USD', name: 'US Dollar', rate: 1.00, change: 0.0, icon: '💵' },
    { code: 'EUR', name: 'Euro', rate: 0.92, change: 0.12, icon: '💶' },
    { code: 'GBP', name: 'British Pound', rate: 0.79, change: -0.08, icon: '💷' },
    { code: 'JPY', name: 'Japanese Yen', rate: 149.25, change: 0.45, icon: '💴' },
    { code: 'CAD', name: 'Canadian Dollar', rate: 1.36, change: 0.18, icon: '🍁' },
    { code: 'AUD', name: 'Australian Dollar', rate: 1.52, change: -0.22, icon: '🇦🇺' },
    { code: 'CHF', name: 'Swiss Franc', rate: 0.88, change: 0.05, icon: '🇨🇭' },
    { code: 'CNY', name: 'Chinese Yuan', rate: 7.24, change: 0.15, icon: '🇨🇳' },
    { code: 'INR', name: 'Indian Rupee', rate: 83.12, change: -0.15, icon: '₹' },
    { code: 'KRW', name: 'South Korean Won', rate: 1312.50, change: 1.2, icon: '🇰🇷' },
    { code: 'SGD', name: 'Singapore Dollar', rate: 1.34, change: 0.08, icon: '🇸🇬' },
    { code: 'HKD', name: 'Hong Kong Dollar', rate: 7.82, change: 0.02, icon: '🇭🇰' },
    { code: 'MXN', name: 'Mexican Peso', rate: 17.89, change: 0.34, icon: '🇲🇽' },
    { code: 'BRL', name: 'Brazilian Real', rate: 4.98, change: -0.12, icon: '🇧🇷' },
    { code: 'RUB', name: 'Russian Ruble', rate: 92.45, change: 2.1, icon: '🇷🇺' },
    { code: 'ZAR', name: 'South African Rand', rate: 18.76, change: 0.67, icon: '🇿🇦' },
    { code: 'TRY', name: 'Turkish Lira', rate: 28.95, change: -1.2, icon: '🇹🇷' },
    { code: 'THB', name: 'Thai Baht', rate: 35.67, change: 0.23, icon: '🇹🇭' },
    { code: 'MYR', name: 'Malaysian Ringgit', rate: 4.67, change: 0.15, icon: '🇲🇾' },
    { code: 'IDR', name: 'Indonesian Rupiah', rate: 15678.90, change: 0.89, icon: '🇮🇩' },
    { code: 'PHP', name: 'Philippine Peso', rate: 55.89, change: 0.34, icon: '🇵🇭' },
    { code: 'VND', name: 'Vietnamese Dong', rate: 24567.80, change: 0.12, icon: '🇻🇳' },
    { code: 'ALGO', name: 'Algorand', rate: 0.1845, change: 2.5, icon: '🔷' },
    { code: 'USDC', name: 'USD Coin', rate: 1.0001, change: 0.01, icon: '💰' },
    { code: 'BTC', name: 'Bitcoin', rate: 0.000023, change: 1.8, icon: '₿' },
    { code: 'ETH', name: 'Ethereum', rate: 0.00041, change: -0.9, icon: 'Ξ' },
    { code: 'ADA', name: 'Cardano', rate: 2.15, change: 3.2, icon: '🔺' },
    { code: 'DOT', name: 'Polkadot', rate: 0.14, change: -1.5, icon: '⚫' },
    { code: 'MATIC', name: 'Polygon', rate: 1.25, change: 4.8, icon: '🟣' },
    { code: 'SOL', name: 'Solana', rate: 0.01, change: 6.2, icon: '🌞' },
    { code: 'AVAX', name: 'Avalanche', rate: 0.04, change: 3.8, icon: '🔺' },
    { code: 'LINK', name: 'Chainlink', rate: 0.067, change: -2.1, icon: '🔗' },
    { code: 'UNI', name: 'Uniswap', rate: 0.167, change: 5.4, icon: '🦄' },
    { code: 'LTC', name: 'Litecoin', rate: 0.014, change: 1.9, icon: '🥈' },
    { code: 'XRP', name: 'Ripple', rate: 1.67, change: -0.8, icon: '💧' },
    { code: 'DOGE', name: 'Dogecoin', rate: 12.5, change: 8.9, icon: '🐕' },
  ];

  const calculateFee = (amount: number): number => {
    // Premium users get no fees
    if (user.premium) return 0;
    
    const baseAmount = parseFloat(amount.toString());
    if (isNaN(baseAmount)) return 0;
    
    return 2.00; // Fixed $2 fee for conversions
  };

  const handleSwapCurrencies = () => {
    const temp = fromCurrency;
    setFromCurrency(toCurrency);
    setToCurrency(temp);
    calculateConversion(amount, toCurrency, temp);
  };

  const calculateConversion = (inputAmount: string, from: string, to: string) => {
    if (!inputAmount) {
      setConvertedAmount('0');
      return;
    }

    const fromRate = currencies.find(c => c.code === from)?.rate || 1;
    const toRate = currencies.find(c => c.code === to)?.rate || 1;
    
    // Convert to USD first, then to target currency
    const usdAmount = parseFloat(inputAmount) / fromRate;
    const result = usdAmount * toRate;
    
    setConvertedAmount(result.toFixed(6));
  };

  const handleAmountChange = (value: string) => {
    setAmount(value);
    calculateConversion(value, fromCurrency, toCurrency);
  };

  const handleConvert = () => {
    if (!amount || parseFloat(amount) <= 0) {
      showToast('Please enter a valid amount', 'error');
      return;
    }

    const fee = calculateFee(parseFloat(amount));

    setPendingConversion({
      from: fromCurrency,
      to: toCurrency,
      amount: parseFloat(amount),
      converted: parseFloat(convertedAmount),
      fee: fee
    });
    setShowPinModal(true);
  };

  const handlePinSuccess = () => {
    if (pendingConversion) {
      // Update balance - deduct from bank balance
      const totalAmount = pendingConversion.amount + pendingConversion.fee;
      updateBalance('debit', totalAmount, 'bank');

      // Add transaction to history
      addTransaction({
        type: 'convert',
        status: 'completed',
        amount: pendingConversion.amount,
        currency: pendingConversion.from,
        description: `${pendingConversion.from} to ${pendingConversion.to} Conversion`,
        fee: pendingConversion.fee,
        details: {
          fromCurrency: pendingConversion.from,
          toCurrency: pendingConversion.to,
          convertedAmount: pendingConversion.converted
        }
      });

      showToast(
        `Successfully converted ${pendingConversion.amount} ${pendingConversion.from} to ${pendingConversion.converted} ${pendingConversion.to}`, 
        'success'
      );
      
      // Send transaction confirmation message
      setTimeout(() => {
        const feeMessage = pendingConversion.fee > 0 ? ` Fee: $${pendingConversion.fee.toFixed(2)}.` : ' No fees applied (Premium member).';
        showToast(
          `Transaction completed! You received ${pendingConversion.converted} ${pendingConversion.to}.${feeMessage}`,
          'success'
        );
      }, 2000);
      
      setAmount('');
      setConvertedAmount('0');
      setPendingConversion(null);
    }
  };

  // Get recent conversion transactions from context
  const recentConversions = user.connected ? 
    useApp().transactions.filter(t => t.type === 'convert').slice(0, 5) : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
      <Navigation onNavigate={onNavigate} currentPage="convert" />
      
      <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Currency Converter</h1>
              <p className="text-gray-400">Convert between fiat and cryptocurrencies instantly with PIN security</p>
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
          {/* Converter */}
          <div className="lg:col-span-2">
            <div className="bg-white/5 backdrop-blur-lg p-8 rounded-2xl border border-white/10 mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-white">Convert Currency</h2>
                <button className="text-gray-400 hover:text-white transition-colors">
                  <RefreshCw className="w-5 h-5" />
                </button>
              </div>

              {/* From Currency */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300 mb-2">From</label>
                <div className="flex space-x-4">
                  <select
                    value={fromCurrency}
                    onChange={(e) => {
                      setFromCurrency(e.target.value);
                      calculateConversion(amount, e.target.value, toCurrency);
                    }}
                    className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500"
                  >
                    {currencies.map((currency) => (
                      <option key={currency.code} value={currency.code} className="bg-gray-800">
                        {currency.icon} {currency.code} - {currency.name}
                      </option>
                    ))}
                  </select>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => handleAmountChange(e.target.value)}
                    placeholder="0.00"
                    className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Swap Button */}
              <div className="flex justify-center mb-4">
                <button
                  onClick={handleSwapCurrencies}
                  className="bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 p-3 rounded-full transition-all duration-200 transform hover:scale-110"
                >
                  <ArrowLeftRight className="w-5 h-5 text-white" />
                </button>
              </div>

              {/* To Currency */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-2">To</label>
                <div className="flex space-x-4">
                  <select
                    value={toCurrency}
                    onChange={(e) => {
                      setToCurrency(e.target.value);
                      calculateConversion(amount, fromCurrency, e.target.value);
                    }}
                    className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500"
                  >
                    {currencies.map((currency) => (
                      <option key={currency.code} value={currency.code} className="bg-gray-800">
                        {currency.icon} {currency.code} - {currency.name}
                      </option>
                    ))}
                  </select>
                  <input
                    type="text"
                    value={convertedAmount}
                    readOnly
                    className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white bg-gray-800/50"
                  />
                </div>
              </div>

              {/* Fee Display */}
              {amount && !user.premium && (
                <div className="mb-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                  <div className="text-yellow-400 text-sm">
                    Platform fee: ${calculateFee(parseFloat(amount)).toFixed(2)}
                  </div>
                </div>
              )}

              {amount && user.premium && (
                <div className="mb-4 p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                  <div className="text-green-400 text-sm flex items-center space-x-2">
                    <Crown className="w-4 h-4" />
                    <span>Premium member - No fees applied!</span>
                  </div>
                </div>
              )}

              <button
                onClick={handleConvert}
                className="w-full bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white py-4 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105"
              >
                Convert Now
              </button>
            </div>

            {/* Exchange Rates */}
            <div className="bg-white/5 backdrop-blur-lg p-8 rounded-2xl border border-white/10">
              <h3 className="text-lg font-semibold text-white mb-6">Live Exchange Rates</h3>
              <div className="grid md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
                {currencies.map((currency) => (
                  <div key={currency.code} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{currency.icon}</span>
                      <div>
                        <div className="text-white font-medium">{currency.code}</div>
                        <div className="text-gray-400 text-sm">{currency.name}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-white font-semibold">
                        {currency.code === 'USD' ? '$1.00' : 
                         currency.rate < 1 ? `$${currency.rate.toFixed(6)}` : 
                         `${currency.rate.toLocaleString()} per USD`}
                      </div>
                      <div className={`text-sm flex items-center space-x-1 ${
                        currency.change >= 0 ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {currency.change >= 0 ? 
                          <TrendingUp className="w-3 h-3" /> : 
                          <TrendingDown className="w-3 h-3" />
                        }
                        <span>{Math.abs(currency.change)}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Conversions */}
          <div>
            <div className="bg-white/5 backdrop-blur-lg p-6 rounded-2xl border border-white/10">
              <h3 className="text-lg font-semibold text-white mb-4">Recent Conversions</h3>
              <div className="space-y-4">
                {recentConversions.length > 0 ? (
                  recentConversions.map((conversion) => (
                    <div key={conversion.id} className="p-4 bg-white/5 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <span className="text-white font-medium">{conversion.details?.fromCurrency || conversion.currency}</span>
                          <ArrowLeftRight className="w-3 h-3 text-gray-400" />
                          <span className="text-white font-medium">{conversion.details?.toCurrency || 'USD'}</span>
                        </div>
                        <div className={`p-1 rounded ${
                          conversion.status === 'completed' ? 'bg-green-500/20' : 'bg-yellow-500/20'
                        }`}>
                          {conversion.status === 'completed' ? 
                            <CheckCircle className="w-3 h-3 text-green-400" /> :
                            <Clock className="w-3 h-3 text-yellow-400" />
                          }
                        </div>
                      </div>
                      <div className="text-sm text-gray-300 mb-1">
                        {conversion.amount} → {conversion.details?.convertedAmount || 'N/A'}
                      </div>
                      <div className="text-xs text-gray-400 flex items-center justify-between">
                        <span>Fee: ${conversion.fee?.toFixed(2) || '0.00'}</span>
                        <span>{conversion.time}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-400">
                    <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No recent conversions</p>
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
        title="Confirm Conversion"
        description="Enter your PIN to complete the currency conversion"
        amount={pendingConversion?.amount}
        fee={pendingConversion?.fee}
      />
    </div>
  );
}