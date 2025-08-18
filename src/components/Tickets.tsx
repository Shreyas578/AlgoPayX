import React, { useState } from 'react';
import { 
  Plane, 
  Train, 
  Bus, 
  Calendar,
  MapPin,
  Users,
  Clock,
  Star,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Navigation } from './Navigation';
import { PinModal } from './PinModal';

interface TicketsProps {
  onNavigate: (page: string) => void;
}

export function Tickets({ onNavigate }: TicketsProps) {
  const { showToast, user, addTransaction, updateBalance } = useApp();
  const [activeTab, setActiveTab] = useState('flight');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [date, setDate] = useState('');
  const [passengers, setPassengers] = useState(1);
  const [showPinModal, setShowPinModal] = useState(false);
  const [pendingBooking, setPendingBooking] = useState<any>(null);

  const tabs = [
    { id: 'flight', label: 'Flights', icon: Plane },
    { id: 'train', label: 'Trains', icon: Train },
    { id: 'bus', label: 'Buses', icon: Bus },
    { id: 'events', label: 'Events', icon: Calendar },
  ];

  const flightResults = [
    { 
      id: 1, 
      airline: 'IndiGo', 
      departure: '06:30', 
      arrival: '08:45', 
      duration: '2h 15m', 
      price: 459, 
      stops: 'Non-stop',
      rating: 4.2 
    },
    { 
      id: 2, 
      airline: 'Air India', 
      departure: '09:15', 
      arrival: '11:35', 
      duration: '2h 20m', 
      price: 520, 
      stops: 'Non-stop',
      rating: 4.0 
    },
    { 
      id: 3, 
      airline: 'SpiceJet', 
      departure: '14:20', 
      arrival: '16:50', 
      duration: '2h 30m', 
      price: 420, 
      stops: 'Non-stop',
      rating: 3.8 
    },
  ];

  const eventResults = [
    {
      id: 1,
      title: 'Coldplay World Tour',
      venue: 'Wembley Stadium, London',
      date: '2024-07-15',
      time: '20:00',
      price: 125,
      category: 'Concert'
    },
    {
      id: 2,
      title: 'Tech Conference 2024',
      venue: 'Moscone Center, San Francisco',
      date: '2024-08-20',
      time: '09:00',
      price: 599,
      category: 'Conference'
    },
    {
      id: 3,
      title: 'Football Championship',
      venue: 'Madison Square Garden',
      date: '2024-09-10',
      time: '19:30',
      price: 89,
      category: 'Sports'
    },
  ];

  const calculateFee = (amount: number): number => {
    // Premium users get no fees
    if (user.premium) return 0;
    
    const baseAmount = parseFloat(amount.toString());
    if (isNaN(baseAmount)) return 0;
    
    // Ticket booking fees: $15 for flights, $5 for events
    if (activeTab === 'flight' || activeTab === 'train' || activeTab === 'bus') {
      return 15.00;
    } else {
      return 5.00;
    }
  };

  const handleBooking = (item: any) => {
    const fee = calculateFee(item.price);
    
    setPendingBooking({
      item: item,
      type: activeTab,
      amount: item.price,
      fee: fee
    });
    setShowPinModal(true);
  };

  const handlePinSuccess = () => {
    if (pendingBooking) {
      // Update balance - deduct from bank balance
      const totalAmount = pendingBooking.amount + pendingBooking.fee;
      updateBalance('debit', totalAmount, 'bank');

      // Add transaction to history
      const description = pendingBooking.type === 'events' 
        ? `Event Ticket - ${pendingBooking.item.title}`
        : `${pendingBooking.type.charAt(0).toUpperCase() + pendingBooking.type.slice(1)} Booking - ${pendingBooking.item.airline || pendingBooking.item.title}`;

      addTransaction({
        type: 'ticket',
        status: 'completed',
        amount: pendingBooking.amount,
        currency: 'USD',
        description: description,
        fee: pendingBooking.fee,
        details: {
          type: pendingBooking.type,
          item: pendingBooking.item,
          bookingDate: new Date().toISOString().split('T')[0]
        }
      });

      showToast(`Booking confirmed for ${pendingBooking.item.airline || pendingBooking.item.title}!`, 'success');
      
      // Send confirmation message
      setTimeout(() => {
        const feeMessage = pendingBooking.fee > 0 ? ` Fee: $${pendingBooking.fee.toFixed(2)}.` : ' No fees applied (Premium member).';
        showToast(
          `Booking completed! ${description} for $${pendingBooking.amount}.${feeMessage}`,
          'success'
        );
      }, 2000);

      setPendingBooking(null);
    }
  };

  const renderSearchForm = () => (
    <div className="bg-white/5 backdrop-blur-lg p-8 rounded-2xl border border-white/10 mb-8">
      <h2 className="text-xl font-semibold text-white mb-6">
        Search {activeTab === 'events' ? 'Events' : activeTab === 'flight' ? 'Flights' : 
                activeTab === 'train' ? 'Trains' : 'Buses'}
      </h2>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            {activeTab === 'events' ? 'Location' : 'From'}
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              placeholder={activeTab === 'events' ? 'Enter city' : 'Departure city'}
              className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {activeTab !== 'events' && (
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">To</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                placeholder="Destination city"
                className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Date</label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {activeTab !== 'events' && (
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Passengers</label>
            <div className="relative">
              <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <select
                value={passengers}
                onChange={(e) => setPassengers(parseInt(e.target.value))}
                className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:border-blue-500"
              >
                {[1,2,3,4,5].map(num => (
                  <option key={num} value={num} className="bg-gray-800">{num} Passenger{num > 1 ? 's' : ''}</option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>

      <button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3 px-8 rounded-xl font-semibold transition-all duration-200 flex items-center space-x-2">
        <span>Search</span>
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );

  const renderResults = () => {
    if (activeTab === 'events') {
      return (
        <div className="space-y-4">
          {eventResults.map((event) => (
            <div key={event.id} className="bg-white/5 backdrop-blur-lg p-6 rounded-2xl border border-white/10 hover:border-blue-500/50 transition-all duration-200">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-white">{event.title}</h3>
                    <span className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded-lg text-xs">
                      {event.category}
                    </span>
                  </div>
                  <div className="flex items-center space-x-4 text-gray-300 text-sm mb-4">
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-4 h-4" />
                      <span>{event.venue}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>{event.date}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{event.time}</span>
                    </div>
                  </div>
                  {!user.premium && (
                    <div className="text-yellow-400 text-sm">
                      + ${calculateFee(event.price).toFixed(2)} booking fee
                    </div>
                  )}
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-white mb-2">${event.price}</div>
                  <button
                    onClick={() => handleBooking(event)}
                    className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-6 py-2 rounded-lg font-medium transition-all duration-200 transform hover:scale-105"
                  >
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {flightResults.map((flight) => (
          <div key={flight.id} className="bg-white/5 backdrop-blur-lg p-6 rounded-2xl border border-white/10 hover:border-blue-500/50 transition-all duration-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{flight.departure}</div>
                  <div className="text-sm text-gray-400">DEL</div>
                </div>
                <div className="flex-1 text-center">
                  <div className="text-gray-300 text-sm mb-1">{flight.duration}</div>
                  <div className="h-px bg-gray-600 relative">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Plane className="w-4 h-4 text-blue-400 bg-gray-900 px-1" />
                    </div>
                  </div>
                  <div className="text-gray-400 text-xs mt-1">{flight.stops}</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{flight.arrival}</div>
                  <div className="text-sm text-gray-400">BOM</div>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-lg font-semibold text-white">{flight.airline}</span>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm text-gray-300">{flight.rating}</span>
                  </div>
                </div>
                <div className="text-2xl font-bold text-white mb-2">${flight.price.toLocaleString()}</div>
                {!user.premium && (
                  <div className="text-yellow-400 text-sm mb-2">
                    + ${calculateFee(flight.price).toFixed(2)} booking fee
                  </div>
                )}
                <button
                  onClick={() => handleBooking(flight)}
                  className="bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white px-6 py-2 rounded-lg font-medium transition-all duration-200 transform hover:scale-105"
                >
                  Book Now
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
      <Navigation onNavigate={onNavigate} currentPage="tickets" />
      
      <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Travel & Events</h1>
          <p className="text-gray-400">Book flights, trains, buses, and event tickets with PIN security</p>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 mb-8 bg-white/5 backdrop-blur-lg p-1 rounded-xl border border-white/10 w-fit">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-6 py-3 rounded-lg transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-purple-600 text-white'
                  : 'text-gray-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {renderSearchForm()}
        
        <div className="bg-white/5 backdrop-blur-lg p-8 rounded-2xl border border-white/10">
          <h3 className="text-lg font-semibold text-white mb-6">
            {activeTab === 'events' ? 'Upcoming Events' : 'Available Options'}
          </h3>
          {renderResults()}
        </div>
      </div>

      <PinModal
        isOpen={showPinModal}
        onClose={() => setShowPinModal(false)}
        onSuccess={handlePinSuccess}
        title="Confirm Booking"
        description="Enter your PIN to complete the booking"
        amount={pendingBooking?.amount}
        fee={pendingBooking?.fee}
      />
    </div>
  );
}