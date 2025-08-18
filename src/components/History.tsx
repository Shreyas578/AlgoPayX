import React, { useState } from 'react';
import { 
  Clock, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Filter,
  Download,
  Search,
  Calendar,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Navigation } from './Navigation';

interface HistoryProps {
  onNavigate: (page: string) => void;
}

export function History({ onNavigate }: HistoryProps) {
  const { showToast, transactions, user } = useApp();
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState('all');

  const filterOptions = [
    { id: 'all', label: 'All Transactions' },
    { id: 'payment', label: 'Payments' },
    { id: 'recharge', label: 'Recharges' },
    { id: 'ticket', label: 'Tickets' },
    { id: 'trade', label: 'Trading' },
    { id: 'convert', label: 'Conversions' }
  ];

  const dateRangeOptions = [
    { id: 'all', label: 'All Time' },
    { id: 'today', label: 'Today' },
    { id: 'week', label: 'This Week' },
    { id: 'month', label: 'This Month' },
    { id: 'quarter', label: 'This Quarter' }
  ];

  const filteredTransactions = transactions.filter(transaction => {
    const matchesFilter = activeFilter === 'all' || transaction.type === activeFilter;
    const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (transaction.recipient && transaction.recipient.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'pending':
        return <AlertCircle className="w-5 h-5 text-yellow-400" />;
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-400" />;
      default:
        return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'payment':
        return <ArrowUpRight className="w-4 h-4 text-red-400" />;
      case 'recharge':
      case 'ticket':
      case 'trade':
      case 'convert':
        return <ArrowDownLeft className="w-4 h-4 text-green-400" />;
      default:
        return <ArrowUpRight className="w-4 h-4 text-gray-400" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'payment':
        return 'bg-red-500/20 text-red-400';
      case 'recharge':
        return 'bg-green-500/20 text-green-400';
      case 'ticket':
        return 'bg-purple-500/20 text-purple-400';
      case 'trade':
        return 'bg-orange-500/20 text-orange-400';
      case 'convert':
        return 'bg-teal-500/20 text-teal-400';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };

  const handleExport = () => {
    showToast('Transaction history exported successfully!', 'success');
  };

  const totalAmount = filteredTransactions
    .filter(t => t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalFees = filteredTransactions
    .filter(t => t.status === 'completed')
    .reduce((sum, t) => sum + (t.fee || 0), 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
      <Navigation onNavigate={onNavigate} currentPage="history" />
      
      <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Transaction History</h1>
          <p className="text-gray-400">View and manage all your transaction records</p>
        </div>

        {/* Summary Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-r from-blue-600/20 to-blue-500/20 backdrop-blur-lg p-6 rounded-2xl border border-blue-500/30">
            <h3 className="text-blue-400 font-medium mb-2">Total Transactions</h3>
            <div className="text-3xl font-bold text-white">{filteredTransactions.length}</div>
          </div>
          
          <div className="bg-gradient-to-r from-green-600/20 to-green-500/20 backdrop-blur-lg p-6 rounded-2xl border border-green-500/30">
            <h3 className="text-green-400 font-medium mb-2">Total Amount</h3>
            <div className="text-3xl font-bold text-white">${totalAmount.toLocaleString()}</div>
          </div>
          
          <div className="bg-gradient-to-r from-purple-600/20 to-purple-500/20 backdrop-blur-lg p-6 rounded-2xl border border-purple-500/30">
            <h3 className="text-purple-400 font-medium mb-2">Total Fees</h3>
            <div className="text-3xl font-bold text-white">${totalFees.toFixed(2)}</div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white/5 backdrop-blur-lg p-6 rounded-2xl border border-white/10 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search transactions..."
                className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="flex space-x-4">
              {/* Type Filter */}
              <select
                value={activeFilter}
                onChange={(e) => setActiveFilter(e.target.value)}
                className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500"
              >
                {filterOptions.map((option) => (
                  <option key={option.id} value={option.id} className="bg-gray-800">
                    {option.label}
                  </option>
                ))}
              </select>

              {/* Date Range Filter */}
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500"
              >
                {dateRangeOptions.map((option) => (
                  <option key={option.id} value={option.id} className="bg-gray-800">
                    {option.label}
                  </option>
                ))}
              </select>

              {/* Export Button */}
              <button
                onClick={handleExport}
                className="bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2"
              >
                <Download className="w-4 h-4" />
                <span>Export</span>
              </button>
            </div>
          </div>
        </div>

        {/* Transaction List */}
        <div className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 overflow-hidden">
          <div className="p-6 border-b border-white/10">
            <h3 className="text-lg font-semibold text-white">
              {user.connected ? 'Your Transaction History' : 'Sample Transaction History'}
            </h3>
          </div>
          
          <div className="divide-y divide-white/10">
            {filteredTransactions.map((transaction) => (
              <div key={transaction.id} className="p-6 hover:bg-white/5 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(transaction.status)}
                      {getTypeIcon(transaction.type)}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-1">
                        <h4 className="text-white font-medium">{transaction.description}</h4>
                        <span className={`px-2 py-1 rounded-lg text-xs font-medium ${getTypeColor(transaction.type)}`}>
                          {transaction.type.toUpperCase()}
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-400">
                        <span>{transaction.date} at {transaction.time}</span>
                        <span>Ref: {transaction.reference}</span>
                        {transaction.recipient && (
                          <span>To: {transaction.recipient}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className={`text-lg font-semibold ${
                      transaction.status === 'completed' ? 'text-white' : 
                      transaction.status === 'pending' ? 'text-yellow-400' : 'text-red-400'
                    }`}>
                      ${transaction.amount.toLocaleString()} {transaction.currency}
                    </div>
                    {transaction.fee && transaction.fee > 0 && (
                      <div className="text-sm text-gray-400">Fee: ${transaction.fee.toFixed(2)}</div>
                    )}
                    <div className={`text-xs font-medium mt-1 ${
                      transaction.status === 'completed' ? 'text-green-400' :
                      transaction.status === 'pending' ? 'text-yellow-400' : 'text-red-400'
                    }`}>
                      {transaction.status.toUpperCase()}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {filteredTransactions.length === 0 && (
            <div className="p-12 text-center">
              <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-400 mb-2">No transactions found</h3>
              <p className="text-gray-500">
                {user.connected 
                  ? 'Try adjusting your search or filter criteria' 
                  : 'Connect your account to see your transaction history'
                }
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}