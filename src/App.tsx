import React, { useState, useEffect } from 'react';
import { Home } from './components/Home';
import { Dashboard } from './components/Dashboard';
import { Payments } from './components/Payments';
import { Recharge } from './components/Recharge';
import { Tickets } from './components/Tickets';
import { Convert } from './components/Convert';
import { Trade } from './components/Trade';
import { Wallet } from './components/Wallet';
import { Premium } from './components/Premium';
import { History } from './components/History';
import { Toast } from './components/Toast';
import { LoadingScreen } from './components/LoadingScreen';
import { AppProvider } from './context/AppContext';
import { AlgorandProvider } from './context/AlgorandContext';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [isLoading, setIsLoading] = useState(true);

  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home onNavigate={setCurrentPage} />;
      case 'dashboard':
        return <Dashboard onNavigate={setCurrentPage} />;
      case 'payments':
        return <Payments onNavigate={setCurrentPage} />;
      case 'recharge':
        return <Recharge onNavigate={setCurrentPage} />;
      case 'tickets':
        return <Tickets onNavigate={setCurrentPage} />;
      case 'convert':
        return <Convert onNavigate={setCurrentPage} />;
      case 'trade':
        return <Trade onNavigate={setCurrentPage} />;
      case 'wallet':
        return <Wallet onNavigate={setCurrentPage} />;
      case 'premium':
        return <Premium onNavigate={setCurrentPage} />;
      case 'history':
        return <History onNavigate={setCurrentPage} />;
      default:
        return <Home onNavigate={setCurrentPage} />;
    }
  };

  return (
    <AppProvider>
      <AlgorandProvider>
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 font-inter">
          {isLoading ? (
            <LoadingScreen onComplete={handleLoadingComplete} />
          ) : (
            <>
              {renderPage()}
              <Toast />
            </>
          )}
        </div>
      </AlgorandProvider>
    </AppProvider>
  );
}

export default App;