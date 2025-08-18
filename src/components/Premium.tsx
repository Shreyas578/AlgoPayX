import React, { useState } from 'react';
import { 
  Crown, 
  Check, 
  Star, 
  Zap, 
  Shield, 
  TrendingUp,
  Clock,
  Users,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Navigation } from './Navigation';
import { PinModal } from './PinModal';

interface PremiumProps {
  onNavigate: (page: string) => void;
}

export function Premium({ onNavigate }: PremiumProps) {
  const { user, setUser, showToast, addTransaction, updateBalance } = useApp();
  const [showPinModal, setShowPinModal] = useState(false);
  const [pendingUpgrade, setPendingUpgrade] = useState<any>(null);

  const plans = [
    {
      name: 'Free',
      price: 0,
      period: 'forever',
      current: !user.premium,
      features: [
        'Basic payments and transfers',
        'Standard recharge options',
        'Limited trading features',
        'Basic support',
        'Standard transaction limits'
      ],
      limitations: [
        'Max $1,000 daily transactions',
        'Standard processing time',
        'Limited customer support',
      ]
    },
    {
      name: 'Premium',
      price: 9.99,
      period: 'month',
      popular: true,
      current: user.premium,
      features: [
        'Unlimited payments and transfers',
        'Priority recharge processing',
        'Advanced trading tools',
        'Real-time market data',
        'Premium customer support',
        'Higher transaction limits',
        'Advanced analytics',
        'No fees on conversions',
        'Priority ticket booking',
        'Exclusive investment opportunities'
      ],
      limitations: []
    },
    {
      name: 'Enterprise',
      price: 49.99,
      period: 'month',
      features: [
        'Everything in Premium',
        'API access for businesses',
        'Bulk payment processing',
        'Custom trading strategies',
        'Dedicated account manager',
        'White-label solutions',
        'Advanced reporting',
        'Institutional-grade security'
      ],
      limitations: []
    }
  ];

  const premiumFeatures = [
    {
      icon: Zap,
      title: 'Lightning Fast Transactions',
      description: 'Process payments instantly with priority queue access'
    },
    {
      icon: Shield,
      title: 'Advanced Security',
      description: 'Enhanced security features and fraud protection'
    },
    {
      icon: TrendingUp,
      title: 'Professional Trading Tools',
      description: 'Access advanced charts, indicators, and analytics'
    },
    {
      icon: Clock,
      title: '24/7 Priority Support',
      description: 'Get help whenever you need it with priority support'
    },
    {
      icon: Users,
      title: 'Exclusive Access',
      description: 'Early access to new features and investment opportunities'
    },
    {
      icon: Star,
      title: 'Premium Benefits',
      description: 'Enjoy exclusive perks and rewards for premium members'
    }
  ];

  const handleUpgrade = (planName: string) => {
    if (planName === 'Premium' && !user.premium) {
      const plan = plans.find(p => p.name === 'Premium');
      if (plan) {
        setPendingUpgrade({
          planName: plan.name,
          amount: plan.price,
          period: plan.period
        });
        setShowPinModal(true);
      }
    } else if (planName === 'Enterprise') {
      showToast('Enterprise plan coming soon!', 'info');
    } else if (user.premium && planName === 'Premium') {
      showToast('You are already a Premium member!', 'info');
    } else {
      showToast('Plan selection updated', 'info');
    }
  };

  const handlePinSuccess = () => {
    if (pendingUpgrade) {
      // Update balance - deduct from bank balance
      updateBalance('debit', pendingUpgrade.amount, 'bank');

      // Add transaction to history
      addTransaction({
        type: 'payment',
        status: 'completed',
        amount: pendingUpgrade.amount,
        currency: 'USD',
        description: `Premium Subscription - ${pendingUpgrade.planName}`,
        recipient: 'AlgoPayX Premium Services',
        fee: 0, // No fees for premium upgrade
        details: {
          subscriptionType: pendingUpgrade.planName,
          billingPeriod: pendingUpgrade.period,
          upgradeDate: new Date().toISOString().split('T')[0]
        }
      });

      // Update user to premium
      setUser({ ...user, premium: true });
      
      showToast('Upgraded to Premium successfully!', 'success');
      
      // Send confirmation message
      setTimeout(() => {
        showToast(
          `Welcome to Premium! You now have access to all premium features including zero fees on all transactions. Your subscription will renew monthly for $${pendingUpgrade.amount}.`,
          'success'
        );
      }, 2000);

      // Navigate to dashboard after successful upgrade
      setTimeout(() => {
        onNavigate('dashboard');
      }, 4000);

      setPendingUpgrade(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
      <Navigation onNavigate={onNavigate} currentPage="premium" />
      
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-gradient-to-r from-yellow-500 to-orange-500 p-3 rounded-2xl">
              <Crown className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">
            {user.premium ? 'Premium Member' : 'Upgrade to Premium'}
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            {user.premium 
              ? 'You are enjoying all premium benefits including zero fees on all transactions!'
              : 'Unlock powerful features and take your financial management to the next level'
            }
          </p>
        </div>

        {user.premium && (
          <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 backdrop-blur-lg p-8 rounded-2xl border border-yellow-500/30 mb-8">
            <div className="flex items-center justify-center space-x-4 mb-4">
              <Crown className="w-8 h-8 text-yellow-400" />
              <h2 className="text-2xl font-bold text-white">Premium Active</h2>
            </div>
            <div className="text-center">
              <p className="text-gray-300 mb-4">
                You are currently enjoying all premium benefits including:
              </p>
              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div className="bg-white/10 p-3 rounded-lg">
                  <div className="text-green-400 font-semibold">Zero Fees</div>
                  <div className="text-gray-300">All transactions</div>
                </div>
                <div className="bg-white/10 p-3 rounded-lg">
                  <div className="text-blue-400 font-semibold">Priority Support</div>
                  <div className="text-gray-300">24/7 assistance</div>
                </div>
                <div className="bg-white/10 p-3 rounded-lg">
                  <div className="text-purple-400 font-semibold">Advanced Tools</div>
                  <div className="text-gray-300">Trading & analytics</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative bg-white/5 backdrop-blur-lg p-8 rounded-2xl border transition-all duration-300 hover:transform hover:scale-105 ${
                plan.popular 
                  ? 'border-yellow-500/50 bg-gradient-to-b from-yellow-500/10 to-orange-500/10' 
                  : 'border-white/10 hover:border-white/20'
              } ${
                plan.current ? 'ring-2 ring-blue-500' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </div>
                </div>
              )}
              
              {plan.current && (
                <div className="absolute -top-4 right-4">
                  <div className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                    Current Plan
                  </div>
                </div>
              )}

              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-white">${plan.price}</span>
                  <span className="text-gray-400">/{plan.period}</span>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex items-start space-x-3">
                    <Check className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-300">{feature}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => handleUpgrade(plan.name)}
                disabled={plan.current}
                className={`w-full py-4 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center space-x-2 ${
                  plan.current
                    ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    : plan.popular
                    ? 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white transform hover:scale-105'
                    : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white transform hover:scale-105'
                }`}
              >
                <span>{plan.current ? 'Current Plan' : `Choose ${plan.name}`}</span>
                {!plan.current && <ArrowRight className="w-4 h-4" />}
              </button>
            </div>
          ))}
        </div>

        {/* Premium Features */}
        <div className="bg-white/5 backdrop-blur-lg p-8 rounded-2xl border border-white/10 mb-8">
          <h2 className="text-2xl font-bold text-white text-center mb-8">Premium Features</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {premiumFeatures.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="bg-gradient-to-r from-blue-500 to-teal-500 p-4 rounded-xl inline-block mb-4">
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-white/5 backdrop-blur-lg p-8 rounded-2xl border border-white/10">
          <h2 className="text-2xl font-bold text-white text-center mb-8">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Can I cancel anytime?</h3>
              <p className="text-gray-400">Yes, you can cancel your premium subscription at any time. You'll continue to have access to premium features until the end of your billing period.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">What payment methods do you accept?</h3>
              <p className="text-gray-400">We accept all major credit cards, bank transfers, and cryptocurrency payments including ALGO and USDC.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Is there a free trial?</h3>
              <p className="text-gray-400">Yes, new users get a 7-day free trial of premium features. No credit card required to start.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">What's the difference between Premium and Enterprise?</h3>
              <p className="text-gray-400">Enterprise includes API access, bulk processing, dedicated support, and white-label solutions for businesses.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Do I get zero fees immediately?</h3>
              <p className="text-gray-400">Yes! As soon as you upgrade to Premium, all transaction fees are waived including payments, recharges, conversions, and trading fees.</p>
            </div>
          </div>
        </div>
      </div>

      <PinModal
        isOpen={showPinModal}
        onClose={() => setShowPinModal(false)}
        onSuccess={handlePinSuccess}
        title="Confirm Premium Upgrade"
        description="Enter your PIN to upgrade to Premium"
        amount={pendingUpgrade?.amount}
        fee={0}
      />
    </div>
  );
}