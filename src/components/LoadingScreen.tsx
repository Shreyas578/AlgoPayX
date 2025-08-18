import React, { useEffect, useState } from 'react';
import { Zap } from 'lucide-react';

interface LoadingScreenProps {
  onComplete: () => void;
}

export function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(onComplete, 500);
          return 100;
        }
        return prev + 2;
      });
    }, 50);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 flex items-center justify-center z-50">
      <div className="text-center">
        {/* Main Logo */}
        <div className="mb-8">
          <div className="flex items-center justify-center mb-6">
            <div className="relative">
              <div className="bg-gradient-to-r from-blue-500 to-teal-500 p-4 rounded-3xl shadow-2xl">
                <Zap className="w-16 h-16 text-white" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-teal-500 rounded-3xl blur-xl opacity-50 animate-pulse"></div>
            </div>
          </div>
          <h1 className="text-6xl font-bold text-white mb-4 tracking-tight">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-400">
              AlgoPayX
            </span>
          </h1>
          <p className="text-xl text-gray-300 mb-8">One App. Every Payment. All on Chain.</p>
        </div>

        {/* Progress Bar */}
        <div className="w-80 mx-auto mb-8">
          <div className="bg-gray-800 rounded-full h-2 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-blue-500 to-teal-500 h-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="text-gray-400 text-sm mt-2">{progress}%</div>
        </div>

        {/* Partner Logos */}
        <div className="mb-8">
          <p className="text-gray-400 text-sm mb-4">Brought to you by</p>
          <div className="flex items-center justify-center space-x-8">
            {/* RevenueCat */}
            <div className="flex items-center space-x-2 bg-white/5 px-4 py-2 rounded-lg">
              <div className="w-6 h-6 bg-gradient-to-r from-orange-500 to-red-500 rounded flex items-center justify-center">
                <span className="text-white font-bold text-xs">R</span>
              </div>
              <span className="text-gray-300 text-sm font-medium">RevenueCat</span>
            </div>

            {/* Entri */}
            <div className="flex items-center space-x-2 bg-white/5 px-4 py-2 rounded-lg">
              <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded flex items-center justify-center">
                <span className="text-white font-bold text-xs">E</span>
              </div>
              <span className="text-gray-300 text-sm font-medium">Entri</span>
            </div>

            {/* Netlify */}
            <div className="flex items-center space-x-2 bg-white/5 px-4 py-2 rounded-lg">
              <div className="w-6 h-6 bg-gradient-to-r from-teal-500 to-blue-500 rounded flex items-center justify-center">
                <span className="text-white font-bold text-xs">N</span>
              </div>
              <span className="text-gray-300 text-sm font-medium">Netlify</span>
            </div>

            {/* Algorand */}
            <div className="flex items-center space-x-2 bg-white/5 px-4 py-2 rounded-lg">
              <div className="w-6 h-6 bg-gradient-to-r from-blue-600 to-teal-600 rounded flex items-center justify-center">
                <span className="text-white font-bold text-xs">A</span>
              </div>
              <span className="text-gray-300 text-sm font-medium">Algorand</span>
            </div>
          </div>
        </div>

        {/* Loading Text */}
        <div className="text-gray-400 text-sm animate-pulse">
          {progress < 30 && "Initializing secure environment..."}
          {progress >= 30 && progress < 60 && "Loading blockchain connections..."}
          {progress >= 60 && progress < 90 && "Setting up payment systems..."}
          {progress >= 90 && "Almost ready..."}
        </div>
      </div>
    </div>
  );
}