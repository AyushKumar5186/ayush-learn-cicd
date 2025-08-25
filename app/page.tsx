'use client';

import { useState, useEffect } from 'react';

// Type definitions
interface ConfettiParticle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
}

interface Balloon {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
  delay: number;
  floatSpeed: number;
}

export default function Home() {
  const [name, setName] = useState('');
  const [showGreeting, setShowGreeting] = useState(false);
  const [confetti, setConfetti] = useState<ConfettiParticle[]>([]);
  const [balloons, setBalloons] = useState<Balloon[]>([]);
  const [isClient, setIsClient] = useState(false);

  // Check if we're on the client side
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Generate confetti particles
  useEffect(() => {
    if (showGreeting && isClient) {
      const particles: ConfettiParticle[] = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1200),
        y: -10,
        vx: (Math.random() - 0.5) * 8,
        vy: Math.random() * 3 + 2,
        color: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8'][Math.floor(Math.random() * 7)],
        size: Math.random() * 8 + 4,
      }));
      setConfetti(particles);

      // Generate floating balloons
      const balloonColors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8'];
      const newBalloons: Balloon[] = Array.from({ length: 8 }, (_, i) => ({
        id: i,
        x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1200),
        y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 800),
        color: balloonColors[Math.floor(Math.random() * balloonColors.length)],
        size: Math.random() * 40 + 60,
        delay: Math.random() * 2,
        floatSpeed: Math.random() * 2 + 1,
      }));
      setBalloons(newBalloons);
    }
  }, [showGreeting, isClient]);

  // Animate confetti
  useEffect(() => {
    if (confetti.length > 0 && isClient) {
      const interval = setInterval(() => {
        setConfetti(prev => 
          prev.map(particle => ({
            ...particle,
            x: particle.x + particle.vx,
            y: particle.y + particle.vy,
            vy: particle.vy + 0.1, // gravity
          })).filter(particle => particle.y < (typeof window !== 'undefined' ? window.innerHeight : 800) + 100)
        );
      }, 50);

      return () => clearInterval(interval);
    }
  }, [confetti, isClient]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      setShowGreeting(true);
    }
  };

  const resetGreeting = () => {
    setShowGreeting(false);
    setName('');
    setConfetti([]);
    setBalloons([]);
  };

  // Don't render anything until we're on the client side
  if (!isClient) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-6 animate-bounce">🎂</div>
          <p className="text-xl text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (showGreeting) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 flex items-center justify-center relative overflow-hidden">
        {/* Floating Balloons */}
        {balloons.map(balloon => (
          <div
            key={balloon.id}
            className="absolute animate-float"
            style={{
              left: balloon.x,
              top: balloon.y,
              animationDelay: `${balloon.delay}s`,
              animationDuration: `${balloon.floatSpeed}s`,
            }}
          >
            <div
              className="rounded-full relative"
              style={{
                width: balloon.size,
                height: balloon.size * 1.2,
                backgroundColor: balloon.color,
                boxShadow: `0 4px 20px ${balloon.color}40`,
              }}
            >
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-16 bg-gray-400"></div>
            </div>
          </div>
        ))}

        {/* Confetti */}
        {confetti.map(particle => (
          <div
            key={particle.id}
            className="absolute rounded-full animate-bounce"
            style={{
              left: particle.x,
              top: particle.y,
              width: particle.size,
              height: particle.size,
              backgroundColor: particle.color,
              transform: `rotate(${particle.x * 0.1}deg)`,
            }}
          />
        ))}

        {/* Birthday Greeting */}
        <div className="text-center z-10 bg-white/90 backdrop-blur-md rounded-3xl p-12 shadow-2xl border border-white/30 max-w-2xl mx-4 animate-fade-in">
          <div className="text-8xl mb-6 animate-bounce">🎉</div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent mb-4">
            Happy Birthday!
          </h1>
          <h2 className="text-3xl font-semibold text-gray-800 mb-6">
            Dear {name} 🎂
          </h2>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            May your special day be filled with joy, laughter, and wonderful memories. 
            Here&apos;s to another amazing year ahead! ✨
          </p>
          
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <div className="text-4xl animate-pulse">🎈</div>
            <div className="text-4xl animate-pulse delay-100">🎁</div>
            <div className="text-4xl animate-pulse delay-200">🎊</div>
            <div className="text-4xl animate-pulse delay-300">🌟</div>
            <div className="text-4xl animate-pulse delay-400">💝</div>
            <div className="text-4xl animate-pulse delay-500">🎀</div>
          </div>

          <button
            onClick={resetGreeting}
            className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-3 rounded-full font-semibold text-lg hover:from-pink-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-lg"
          >
            Create Another Greeting
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 flex items-center justify-center relative overflow-hidden">
      {/* Background floating elements */}
      <div className="absolute top-20 left-20 text-6xl animate-float opacity-20">🎈</div>
      <div className="absolute top-40 right-20 text-5xl animate-float delay-100 opacity-20">🎁</div>
      <div className="absolute bottom-40 left-32 text-4xl animate-float delay-200 opacity-20">🎊</div>
      <div className="absolute bottom-20 right-32 text-5xl animate-float delay-300 opacity-20">🌟</div>

      <div className="text-center bg-white/90 backdrop-blur-md rounded-3xl p-12 shadow-2xl border border-white/30 max-w-md mx-4 z-10">
        <div className="text-6xl mb-6 animate-bounce">🎂</div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent mb-6">
          Birthday Wishes
        </h1>
        <p className="text-gray-600 mb-8">
          Create a special birthday greeting for someone special!
        </p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Enter their name:
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Sarah, Mom, Best Friend..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all duration-300 text-center text-lg"
              required
            />
          </div>
          
          <button
            type="submit"
            disabled={!name.trim()}
            className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-3 rounded-lg font-semibold text-lg hover:from-pink-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            Create Birthday Greeting 🎉
          </button>
        </form>
        
        <div className="mt-8 text-sm text-gray-500">
          Made with ❤️ using Next.js
        </div>
      </div>
    </div>
  );
}
