import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  DollarSign,
  Star,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  Crown,
  Activity,
  Target,
  Calendar,
  Info,
  LineChart
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Navigation } from './Navigation';
import { PinModal } from './PinModal';

interface TradeProps {
  onNavigate: (page: string) => void;
}

export function Trade({ onNavigate }: TradeProps) {
  const { balance, showToast, user, addTransaction, updateBalance } = useApp();
  const [activeTab, setActiveTab] = useState('stocks');
  const [selectedAsset, setSelectedAsset] = useState<any>(null);
  const [tradeType, setTradeType] = useState('buy');
  const [amount, setAmount] = useState('');
  const [quantity, setQuantity] = useState('');
  const [showPinModal, setShowPinModal] = useState(false);
  const [pendingTrade, setPendingTrade] = useState<any>(null);
  const [selectedStrike, setSelectedStrike] = useState<number>(185);
  const [selectedExpiry, setSelectedExpiry] = useState('2024-02-16');
  const [optionType, setOptionType] = useState<'call' | 'put'>('call');

  // Mock real-time price updates and chart data
  const [priceUpdates, setPriceUpdates] = useState<{[key: string]: number}>({});
  const [chartData, setChartData] = useState<{[key: string]: number[]}>({});

  useEffect(() => {
    // Initialize chart data
    const initialChartData: {[key: string]: number[]} = {};
    ['AAPL', 'TSLA', 'GOOGL', 'MSFT', 'NVDA', 'BTC', 'ETH', 'ALGO'].forEach(symbol => {
      initialChartData[symbol] = Array.from({length: 20}, (_, i) => Math.random() * 10 + 90);
    });
    setChartData(initialChartData);

    const interval = setInterval(() => {
      setPriceUpdates(prev => {
        const updates: {[key: string]: number} = {};
        ['AAPL', 'TSLA', 'GOOGL', 'MSFT', 'NVDA', 'BTC', 'ETH', 'ALGO'].forEach(symbol => {
          const change = (Math.random() - 0.5) * 2; // Random change between -1 and 1
          updates[symbol] = change;
        });
        return updates;
      });

      // Update chart data
      setChartData(prev => {
        const newData = { ...prev };
        Object.keys(newData).forEach(symbol => {
          const lastValue = newData[symbol][newData[symbol].length - 1];
          const change = (Math.random() - 0.5) * 2;
          const newValue = Math.max(0, lastValue + change);
          newData[symbol] = [...newData[symbol].slice(1), newValue];
        });
        return newData;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const stocks = [
    { symbol: 'AAPL', name: 'Apple Inc.', price: 185.25, change: 2.34, changePercent: 1.28, volume: '52.3M', sector: 'Technology' },
    { symbol: 'TSLA', name: 'Tesla Inc.', price: 248.90, change: -5.67, changePercent: -2.23, volume: '89.1M', sector: 'Automotive' },
    { symbol: 'GOOGL', name: 'Alphabet Inc.', price: 138.45, change: 1.89, changePercent: 1.38, volume: '28.7M', sector: 'Technology' },
    { symbol: 'MSFT', name: 'Microsoft Corp.', price: 378.12, change: 4.23, changePercent: 1.13, volume: '31.2M', sector: 'Technology' },
    { symbol: 'AMZN', name: 'Amazon.com Inc.', price: 145.67, change: -2.11, changePercent: -1.43, volume: '42.8M', sector: 'E-commerce' },
    { symbol: 'NVDA', name: 'NVIDIA Corp.', price: 875.30, change: 15.67, changePercent: 1.82, volume: '67.2M', sector: 'Technology' },
    { symbol: 'META', name: 'Meta Platforms', price: 312.45, change: -8.23, changePercent: -2.57, volume: '45.1M', sector: 'Social Media' },
    { symbol: 'NFLX', name: 'Netflix Inc.', price: 425.80, change: 7.90, changePercent: 1.89, volume: '23.4M', sector: 'Entertainment' },
    { symbol: 'AMD', name: 'Advanced Micro Devices', price: 112.35, change: 3.45, changePercent: 3.17, volume: '78.9M', sector: 'Technology' },
    { symbol: 'CRM', name: 'Salesforce Inc.', price: 198.75, change: -4.12, changePercent: -2.03, volume: '19.8M', sector: 'Software' },
    { symbol: 'ORCL', name: 'Oracle Corp.', price: 89.45, change: 1.23, changePercent: 1.39, volume: '15.2M', sector: 'Software' },
    { symbol: 'IBM', name: 'IBM Corp.', price: 156.78, change: -0.89, changePercent: -0.56, volume: '8.9M', sector: 'Technology' },
  ];

  const cryptos = [
    { symbol: 'ALGO', name: 'Algorand', price: 0.1845, change: 0.0098, changePercent: 5.61, volume: '$124.5M', marketCap: '$1.2B' },
    { symbol: 'BTC', name: 'Bitcoin', price: 43250.00, change: 892.34, changePercent: 2.11, volume: '$18.2B', marketCap: '$850B' },
    { symbol: 'ETH', name: 'Ethereum', price: 2485.67, change: -45.23, changePercent: -1.79, volume: '$8.9B', marketCap: '$298B' },
    { symbol: 'USDC', name: 'USD Coin', price: 1.0001, change: 0.0001, changePercent: 0.01, volume: '$2.1B', marketCap: '$25B' },
    { symbol: 'SOL', name: 'Solana', price: 98.45, change: 6.78, changePercent: 7.39, volume: '$892.1M', marketCap: '$42B' },
    { symbol: 'ADA', name: 'Cardano', price: 0.465, change: 0.023, changePercent: 5.2, volume: '$345.2M', marketCap: '$16B' },
    { symbol: 'DOT', name: 'Polkadot', price: 7.12, change: -0.34, changePercent: -4.56, volume: '$198.7M', marketCap: '$8.9B' },
    { symbol: 'MATIC', name: 'Polygon', price: 0.798, change: 0.045, changePercent: 5.98, volume: '$267.3M', marketCap: '$7.4B' },
    { symbol: 'AVAX', name: 'Avalanche', price: 24.67, change: 1.23, changePercent: 5.25, volume: '$156.8M', marketCap: '$9.1B' },
    { symbol: 'LINK', name: 'Chainlink', price: 14.89, change: -0.67, changePercent: -4.31, volume: '$234.5M', marketCap: '$8.3B' },
  ];

  const indices = [
    { symbol: 'SPY', name: 'S&P 500 ETF', price: 445.67, change: 3.45, changePercent: 0.78, volume: '89.2M', type: 'ETF' },
    { symbol: 'QQQ', name: 'Nasdaq 100 ETF', price: 378.90, change: -2.34, changePercent: -0.61, volume: '67.8M', type: 'ETF' },
    { symbol: 'IWM', name: 'Russell 2000 ETF', price: 198.45, change: 1.67, changePercent: 0.85, volume: '45.3M', type: 'ETF' },
    { symbol: 'VTI', name: 'Total Stock Market ETF', price: 234.12, change: 2.89, changePercent: 1.25, volume: '34.7M', type: 'ETF' },
    { symbol: 'GLD', name: 'Gold ETF', price: 189.34, change: -1.23, changePercent: -0.65, volume: '12.8M', type: 'Commodity' },
    { symbol: 'TLT', name: '20+ Year Treasury ETF', price: 98.76, change: 0.45, changePercent: 0.46, volume: '23.4M', type: 'Bond' },
  ];

  // Options data for AAPL
  const optionsChain = [
    { strike: 175, callPrice: 12.50, putPrice: 2.30, callVolume: 1250, putVolume: 890, callOI: 5420, putOI: 3210 },
    { strike: 180, callPrice: 8.75, putPrice: 3.45, callVolume: 2340, putVolume: 1560, callOI: 8930, putOI: 4560 },
    { strike: 185, callPrice: 5.20, putPrice: 5.20, callVolume: 3450, putVolume: 2890, callOI: 12450, putOI: 8920 },
    { strike: 190, callPrice: 2.80, putPrice: 7.65, callVolume: 1890, putVolume: 3240, callOI: 6780, putOI: 11230 },
    { strike: 195, callPrice: 1.25, putPrice: 11.20, callVolume: 980, putVolume: 2140, callOI: 3450, putOI: 7890 },
  ];

  const expiryDates = [
    '2024-02-16', '2024-02-23', '2024-03-01', '2024-03-15', '2024-04-19', '2024-06-21'
  ];

  const calculateFee = (amount: number): number => {
    // Premium users get no fees
    if (user.premium) return 0;
    
    const baseAmount = parseFloat(amount.toString());
    if (isNaN(baseAmount)) return 0;
    
    // Trading fees: $5-7.50 based on trade size
    if (baseAmount < 1000) return 5.00;
    if (baseAmount < 5000) return 6.25;
    return 7.50;
  };

  const handleTrade = () => {
    if (!selectedAsset || !quantity) {
      showToast('Please fill in all fields', 'error');
      return;
    }

    const quantityNum = parseFloat(quantity);
    const totalValue = quantityNum * selectedAsset.price;
    const fee = calculateFee(totalValue);
    
    // Check if user has sufficient balance for buying
    if (tradeType === 'buy') {
      const totalCost = totalValue + fee;
      if (totalCost > balance.stocks) {
        showToast('Insufficient balance for this trade', 'error');
        return;
      }
    }
    
    setPendingTrade({
      asset: selectedAsset,
      type: tradeType,
      quantity: quantityNum,
      totalValue: totalValue,
      fee: fee
    });
    setShowPinModal(true);
  };

  const handleOptionsTrade = (option: any, type: 'call' | 'put') => {
    const premium = type === 'call' ? option.callPrice : option.putPrice;
    const contracts = 1; // Default to 1 contract
    const totalCost = premium * 100 * contracts; // Options are priced per share, 100 shares per contract
    const fee = calculateFee(totalCost);

    // Check if user has sufficient balance
    const totalAmount = totalCost + fee;
    if (totalAmount > balance.stocks) {
      showToast('Insufficient balance for this options trade', 'error');
      return;
    }

    setPendingTrade({
      asset: { symbol: 'AAPL', name: 'Apple Inc. Options', price: premium },
      type: 'buy',
      quantity: contracts,
      totalValue: totalCost,
      fee: fee,
      isOption: true,
      optionDetails: {
        strike: option.strike,
        type: type,
        expiry: selectedExpiry,
        premium: premium
      }
    });
    setShowPinModal(true);
  };

  const handlePinSuccess = () => {
    if (pendingTrade) {
      const { asset, type, quantity, totalValue, fee, isOption, optionDetails } = pendingTrade;
      const action = type === 'buy' ? 'bought' : 'sold';
      
      // Update balance based on trade type
      if (type === 'buy') {
        // Buying: deduct total cost from stocks balance
        const totalAmount = totalValue + fee;
        updateBalance('debit', totalAmount, 'stocks');
      } else {
        // Selling: add proceeds to stocks balance (minus fee)
        const netProceeds = totalValue - fee;
        updateBalance('credit', netProceeds, 'stocks');
      }

      // Add transaction to history
      const description = isOption 
        ? `${action.charAt(0).toUpperCase() + action.slice(1)} ${optionDetails.type.toUpperCase()} option ${asset.symbol} $${optionDetails.strike} ${optionDetails.expiry}`
        : `${action.charAt(0).toUpperCase() + action.slice(1)} ${asset.symbol}`;

      addTransaction({
        type: 'trade',
        status: 'completed',
        amount: totalValue,
        currency: 'USD',
        description: description,
        fee: fee,
        details: {
          symbol: asset.symbol,
          quantity: quantity,
          price: asset.price,
          tradeType: type,
          assetType: isOption ? 'options' : activeTab,
          isOption: isOption,
          optionDetails: optionDetails
        }
      });
      
      if (isOption) {
        showToast(`Successfully ${action} ${quantity} ${optionDetails.type.toUpperCase()} option contract for ${asset.symbol}!`, 'success');
      } else {
        showToast(`Successfully ${action} ${quantity} ${asset.symbol} for $${totalValue.toLocaleString()}`, 'success');
      }
      
      // Send transaction confirmation message
      setTimeout(() => {
        const feeMessage = fee > 0 ? ` Fee: $${fee.toFixed(2)}.` : ' No fees applied (Premium member).';
        if (isOption) {
          showToast(
            `Options trade executed! ${action.charAt(0).toUpperCase() + action.slice(1)} ${quantity} ${optionDetails.type} contract(s) for ${asset.symbol} strike $${optionDetails.strike}.${feeMessage}`,
            'success'
          );
        } else {
          showToast(
            `Trade executed! ${action.charAt(0).toUpperCase() + action.slice(1)} ${quantity} shares of ${asset.symbol} at $${asset.price}.${feeMessage}`,
            'success'
          );
        }
      }, 2000);
      
      setAmount('');
      setQuantity('');
      setSelectedAsset(null);
      setPendingTrade(null);
    }
  };

  const calculateTotal = () => {
    if (!selectedAsset || !quantity) return '0.00';
    const quantityNum = parseFloat(quantity);
    if (isNaN(quantityNum)) return '0.00';
    return (quantityNum * selectedAsset.price).toFixed(2);
  };

  // Update amount when quantity changes
  useEffect(() => {
    if (selectedAsset && quantity) {
      setAmount(calculateTotal());
    }
  }, [selectedAsset, quantity]);

  const renderRealTimeChart = (symbol: string) => {
    const data = chartData[symbol] || [];
    if (data.length === 0) return null;

    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min;
    
    return (
      <div className="bg-white/5 p-4 rounded-lg mb-4">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-white font-medium">{symbol} Live Chart</h4>
          <LineChart className="w-4 h-4 text-blue-400" />
        </div>
        <div className="flex items-end space-x-1 h-20">
          {data.map((value, index) => {
            const height = range === 0 ? 50 : ((value - min) / range) * 100;
            const isLast = index === data.length - 1;
            return (
              <div
                key={index}
                className={`w-2 rounded-t transition-all duration-500 ${
                  isLast ? 'bg-blue-400 animate-pulse' : 'bg-blue-500/60'
                }`}
                style={{ height: `${Math.max(height, 10)}%` }}
              />
            );
          })}
        </div>
        <div className="text-xs text-gray-400 mt-2">
          Current: ${data[data.length - 1]?.toFixed(2)} | Range: ${min.toFixed(2)} - ${max.toFixed(2)}
        </div>
      </div>
    );
  };

  const renderAssetList = () => {
    let assets = [];
    if (activeTab === 'stocks') assets = stocks;
    else if (activeTab === 'crypto') assets = cryptos;
    else if (activeTab === 'indices') assets = indices;
    
    return (
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {assets.map((asset) => {
          const priceUpdate = priceUpdates[asset.symbol] || 0;
          const currentPrice = asset.price + priceUpdate;
          const isPositive = priceUpdate >= 0;
          
          return (
            <button
              key={asset.symbol}
              onClick={() => setSelectedAsset({...asset, price: currentPrice})}
              className={`w-full p-4 rounded-lg border transition-all duration-200 ${
                selectedAsset?.symbol === asset.symbol
                  ? 'border-blue-500 bg-blue-500/10'
                  : 'border-white/10 bg-white/5 hover:border-white/20'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-teal-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">{asset.symbol.charAt(0)}</span>
                  </div>
                  <div className="text-left">
                    <div className="text-white font-semibold flex items-center space-x-2">
                      <span>{asset.symbol}</span>
                      {Math.abs(priceUpdate) > 0.5 && (
                        <div className={`w-2 h-2 rounded-full ${isPositive ? 'bg-green-400' : 'bg-red-400'} animate-pulse`} />
                      )}
                    </div>
                    <div className="text-gray-400 text-sm">{asset.name}</div>
                    {(asset as any).sector && (
                      <div className="text-xs text-gray-500">{(asset as any).sector}</div>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-white font-semibold transition-colors ${
                    Math.abs(priceUpdate) > 0.5 ? (isPositive ? 'text-green-400' : 'text-red-400') : ''
                  }`}>
                    ${currentPrice.toLocaleString()}
                  </div>
                  <div className={`text-sm flex items-center space-x-1 ${
                    asset.change >= 0 ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {asset.change >= 0 ? 
                      <ArrowUpRight className="w-3 h-3" /> : 
                      <ArrowDownRight className="w-3 h-3" />
                    }
                    <span>{Math.abs(asset.changePercent)}%</span>
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    );
  };

  const renderOptionsChain = () => (
    <div className="bg-white/5 backdrop-blur-lg p-6 rounded-2xl border border-white/10">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white">Options Chain - AAPL</h3>
        <div className="flex space-x-4">
          <select
            value={selectedExpiry}
            onChange={(e) => setSelectedExpiry(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm"
          >
            {expiryDates.map(date => (
              <option key={date} value={date} className="bg-gray-800">{date}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Real-time chart for AAPL */}
      {renderRealTimeChart('AAPL')}

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-left py-3 px-2 text-gray-300 text-sm">Calls</th>
              <th className="text-center py-3 px-2 text-gray-300 text-sm">Strike</th>
              <th className="text-right py-3 px-2 text-gray-300 text-sm">Puts</th>
            </tr>
          </thead>
          <tbody>
            {optionsChain.map((option) => (
              <tr key={option.strike} className="border-b border-white/5">
                <td className="py-3 px-2">
                  <button
                    onClick={() => handleOptionsTrade(option, 'call')}
                    className="w-full text-left p-2 rounded bg-green-500/10 hover:bg-green-500/20 transition-colors"
                  >
                    <div className="text-green-400 font-semibold">${option.callPrice}</div>
                    <div className="text-xs text-gray-400">Vol: {option.callVolume}</div>
                    <div className="text-xs text-gray-500">OI: {option.callOI}</div>
                  </button>
                </td>
                <td className="py-3 px-2 text-center">
                  <div className={`font-semibold ${option.strike === 185 ? 'text-yellow-400' : 'text-white'}`}>
                    ${option.strike}
                  </div>
                  {option.strike === 185 && (
                    <div className="text-xs text-yellow-400">ATM</div>
                  )}
                </td>
                <td className="py-3 px-2">
                  <button
                    onClick={() => handleOptionsTrade(option, 'put')}
                    className="w-full text-right p-2 rounded bg-red-500/10 hover:bg-red-500/20 transition-colors"
                  >
                    <div className="text-red-400 font-semibold">${option.putPrice}</div>
                    <div className="text-xs text-gray-400">Vol: {option.putVolume}</div>
                    <div className="text-xs text-gray-500">OI: {option.putOI}</div>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
        <div className="flex items-center space-x-2 mb-2">
          <Info className="w-4 h-4 text-blue-400" />
          <span className="text-blue-400 font-medium">Options Trading Info</span>
        </div>
        <div className="text-sm text-gray-300 space-y-1">
          <p>• ATM = At The Money (current stock price: $185.25)</p>
          <p>• Vol = Volume (contracts traded today)</p>
          <p>• OI = Open Interest (total open contracts)</p>
          <p>• Green = Call options, Red = Put options</p>
          <p>• Click any option to buy (1 contract = 100 shares)</p>
        </div>
      </div>
    </div>
  );

  // Get recent trade transactions from context
  const recentTrades = user.connected ? 
    useApp().transactions.filter(t => t.type === 'trade').slice(0, 4) : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
      <Navigation onNavigate={onNavigate} currentPage="trade" />
      
      <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Trading Platform</h1>
              <p className="text-gray-400">Trade stocks, cryptocurrencies, and options with real-time charts</p>
            </div>
            {user.premium && (
              <div className="flex items-center space-x-2 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-lg px-4 py-2">
                <Crown className="w-5 h-5 text-yellow-400" />
                <span className="text-yellow-400 font-medium">No Fees Applied</span>
              </div>
            )}
          </div>
        </div>

        {/* Portfolio Overview */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-r from-green-600/20 to-green-500/20 backdrop-blur-lg p-6 rounded-2xl border border-green-500/30">
            <div className="flex items-center space-x-3 mb-2">
              <TrendingUp className="w-6 h-6 text-green-400" />
              <span className="text-green-400 font-medium">Portfolio Value</span>
            </div>
            <div className="text-3xl font-bold text-white">$44,181.25</div>
            <div className="text-green-400 text-sm">+$1,234.56 (+2.88%)</div>
          </div>

          <div className="bg-gradient-to-r from-blue-600/20 to-blue-500/20 backdrop-blur-lg p-6 rounded-2xl border border-blue-500/30">
            <div className="flex items-center space-x-3 mb-2">
              <DollarSign className="w-6 h-6 text-blue-400" />
              <span className="text-blue-400 font-medium">Buying Power</span>
            </div>
            <div className="text-3xl font-bold text-white">${balance.stocks.toLocaleString()}</div>
            <div className="text-gray-400 text-sm">Available to trade</div>
          </div>

          <div className="bg-gradient-to-r from-purple-600/20 to-purple-500/20 backdrop-blur-lg p-6 rounded-2xl border border-purple-500/30">
            <div className="flex items-center space-x-3 mb-2">
              <BarChart3 className="w-6 h-6 text-purple-400" />
              <span className="text-purple-400 font-medium">Day's Change</span>
            </div>
            <div className="text-3xl font-bold text-white">+$892.45</div>
            <div className="text-green-400 text-sm">+2.06%</div>
          </div>

          <div className="bg-gradient-to-r from-orange-600/20 to-orange-500/20 backdrop-blur-lg p-6 rounded-2xl border border-orange-500/30">
            <div className="flex items-center space-x-3 mb-2">
              <Target className="w-6 h-6 text-orange-400" />
              <span className="text-orange-400 font-medium">Options P&L</span>
            </div>
            <div className="text-3xl font-bold text-white">+$456.78</div>
            <div className="text-green-400 text-sm">+12.34%</div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Asset List */}
          <div className="lg:col-span-2">
            {/* Tabs */}
            <div className="flex space-x-1 mb-6 bg-white/5 backdrop-blur-lg p-1 rounded-xl border border-white/10 w-fit">
              <button
                onClick={() => setActiveTab('stocks')}
                className={`px-6 py-3 rounded-lg transition-all duration-200 ${
                  activeTab === 'stocks'
                    ? 'bg-orange-600 text-white'
                    : 'text-gray-300 hover:text-white hover:bg-white/5'
                }`}
              >
                Stocks
              </button>
              <button
                onClick={() => setActiveTab('crypto')}
                className={`px-6 py-3 rounded-lg transition-all duration-200 ${
                  activeTab === 'crypto'
                    ? 'bg-orange-600 text-white'
                    : 'text-gray-300 hover:text-white hover:bg-white/5'
                }`}
              >
                Crypto
              </button>
              <button
                onClick={() => setActiveTab('indices')}
                className={`px-6 py-3 rounded-lg transition-all duration-200 ${
                  activeTab === 'indices'
                    ? 'bg-orange-600 text-white'
                    : 'text-gray-300 hover:text-white hover:bg-white/5'
                }`}
              >
                Indices & ETFs
              </button>
              <button
                onClick={() => setActiveTab('options')}
                className={`px-6 py-3 rounded-lg transition-all duration-200 ${
                  activeTab === 'options'
                    ? 'bg-orange-600 text-white'
                    : 'text-gray-300 hover:text-white hover:bg-white/5'
                }`}
              >
                Options
              </button>
            </div>

            {activeTab === 'options' ? (
              renderOptionsChain()
            ) : (
              <div className="bg-white/5 backdrop-blur-lg p-6 rounded-2xl border border-white/10">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
                    <Activity className="w-5 h-5" />
                    <span>
                      {activeTab === 'stocks' ? 'Live Stocks' : 
                       activeTab === 'crypto' ? 'Cryptocurrencies' : 'Indices & ETFs'}
                    </span>
                  </h3>
                  <button className="text-gray-400 hover:text-white transition-colors">
                    <RefreshCw className="w-5 h-5" />
                  </button>
                </div>
                {renderAssetList()}
              </div>
            )}
          </div>

          {/* Trading Panel */}
          <div className="space-y-6">
            {/* Trade Form */}
            <div className="bg-white/5 backdrop-blur-lg p-6 rounded-2xl border border-white/10">
              <h3 className="text-lg font-semibold text-white mb-4">
                {selectedAsset ? `Trade ${selectedAsset.symbol}` : 'Select Asset to Trade'}
              </h3>
              
              {selectedAsset ? (
                <>
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-300">Current Price</span>
                      <span className="text-white font-semibold">
                        ${selectedAsset.price.toLocaleString()}
                      </span>
                    </div>
                    {/* Real-time chart for selected asset */}
                    {renderRealTimeChart(selectedAsset.symbol)}
                  </div>

                  {/* Trade Type */}
                  <div className="flex space-x-2 mb-4">
                    <button
                      onClick={() => setTradeType('buy')}
                      className={`flex-1 py-3 rounded-lg transition-all duration-200 ${
                        tradeType === 'buy'
                          ? 'bg-green-600 text-white'
                          : 'bg-white/5 text-gray-300 hover:bg-white/10'
                      }`}
                    >
                      Buy
                    </button>
                    <button
                      onClick={() => setTradeType('sell')}
                      className={`flex-1 py-3 rounded-lg transition-all duration-200 ${
                        tradeType === 'sell'
                          ? 'bg-red-600 text-white'
                          : 'bg-white/5 text-gray-300 hover:bg-white/10'
                      }`}
                    >
                      Sell
                    </button>
                  </div>

                  {/* Quantity */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-300 mb-2">Quantity</label>
                    <input
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      placeholder="0"
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  {/* Total */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-300 mb-2">Total Value</label>
                    <input
                      type="text"
                      value={`$${calculateTotal()}`}
                      readOnly
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white bg-gray-800/50"
                    />
                  </div>

                  {/* Fee Display */}
                  {quantity && !user.premium && (
                    <div className="mb-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                      <div className="text-yellow-400 text-sm">
                        Trading fee: ${calculateFee(parseFloat(calculateTotal())).toFixed(2)}
                      </div>
                    </div>
                  )}

                  {quantity && user.premium && (
                    <div className="mb-4 p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                      <div className="text-green-400 text-sm flex items-center space-x-2">
                        <Crown className="w-4 h-4" />
                        <span>Premium member - No fees applied!</span>
                      </div>
                    </div>
                  )}

                  <button
                    onClick={handleTrade}
                    className={`w-full py-4 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 ${
                      tradeType === 'buy'
                        ? 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white'
                        : 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white'
                    }`}
                  >
                    {tradeType === 'buy' ? 'Buy' : 'Sell'} {selectedAsset.symbol}
                  </button>
                </>
              ) : (
                <div className="text-center py-12 text-gray-400">
                  Select an asset from the list to start trading
                </div>
              )}
            </div>

            {/* Recent Trades */}
            <div className="bg-white/5 backdrop-blur-lg p-6 rounded-2xl border border-white/10">
              <h3 className="text-lg font-semibold text-white mb-4">Recent Trades</h3>
              <div className="space-y-3">
                {recentTrades.length > 0 ? (
                  recentTrades.map((trade) => (
                    <div key={trade.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                      <div>
                        <div className="text-white font-medium">
                          {trade.details?.symbol || 'N/A'}
                          {trade.details?.isOption && (
                            <span className="ml-2 text-xs bg-purple-500/20 text-purple-400 px-2 py-1 rounded">
                              {trade.details.optionDetails?.type?.toUpperCase()} ${trade.details.optionDetails?.strike}
                            </span>
                          )}
                        </div>
                        <div className="text-gray-400 text-sm">
                          {trade.details?.tradeType} • {trade.details?.quantity} {trade.details?.isOption ? 'contracts' : 'shares'}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-white font-semibold">${trade.amount.toLocaleString()}</div>
                        <div className="text-gray-400 text-sm">{trade.time}</div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-400">
                    <BarChart3 className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No recent trades</p>
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
        title="Confirm Trade"
        description="Enter your PIN to execute the trade"
        amount={pendingTrade?.totalValue}
        fee={pendingTrade?.fee}
      />
    </div>
  );
}