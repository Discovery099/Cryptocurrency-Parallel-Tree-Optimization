import React from 'react';

interface ImageGeneratorProps {
  type: 'dashboard' | 'gpu-management' | 'mining-pools' | 'analytics';
  className?: string;
}

export const ImageGenerator: React.FC<ImageGeneratorProps> = ({ type, className }) => {
  const generateDashboardSVG = () => (
    <svg width="800" height="400" viewBox="0 0 800 400" className={className}>
      <defs>
        <linearGradient id="bg-dashboard" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0F172A"/>
          <stop offset="100%" stopColor="#1E293B"/>
        </linearGradient>
        <linearGradient id="accent-dashboard" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#10B981"/>
          <stop offset="100%" stopColor="#059669"/>
        </linearGradient>
      </defs>
      
      <rect width="800" height="400" fill="url(#bg-dashboard)"/>
      
      {/* Header */}
      <rect x="0" y="0" width="800" height="60" fill="#1F2937"/>
      <text x="20" y="35" fill="white" fontFamily="Arial, sans-serif" fontSize="18" fontWeight="bold">🚀 CryptoTree Mining Dashboard</text>
      <circle cx="750" cy="30" r="8" fill="#10B981"/>
      <text x="720" y="35" fill="#10B981" fontFamily="Arial, sans-serif" fontSize="12">LIVE</text>
      
      {/* Main metrics grid */}
      <rect x="20" y="80" width="180" height="120" rx="8" fill="#374151"/>
      <text x="30" y="105" fill="#9CA3AF" fontFamily="Arial, sans-serif" fontSize="12">Hash Rate</text>
      <text x="30" y="130" fill="white" fontFamily="Arial, sans-serif" fontSize="24" fontWeight="bold">65.6 TH/s</text>
      <text x="30" y="150" fill="#10B981" fontFamily="Arial, sans-serif" fontSize="12">+8.2% ↗</text>
      <rect x="30" y="160" width="160" height="4" rx="2" fill="#1F2937"/>
      <rect x="30" y="160" width="120" height="4" rx="2" fill="url(#accent-dashboard)"/>
      
      <rect x="220" y="80" width="180" height="120" rx="8" fill="#374151"/>
      <text x="230" y="105" fill="#9CA3AF" fontFamily="Arial, sans-serif" fontSize="12">System Uptime</text>
      <text x="230" y="130" fill="white" fontFamily="Arial, sans-serif" fontSize="24" fontWeight="bold">98.7%</text>
      <text x="230" y="150" fill="#10B981" fontFamily="Arial, sans-serif" fontSize="12">Excellent</text>
      
      <rect x="420" y="80" width="180" height="120" rx="8" fill="#374151"/>
      <text x="430" y="105" fill="#9CA3AF" fontFamily="Arial, sans-serif" fontSize="12">Cache Efficiency</text>
      <text x="430" y="130" fill="white" fontFamily="Arial, sans-serif" fontSize="24" fontWeight="bold">96.2%</text>
      <text x="430" y="150" fill="#10B981" fontFamily="Arial, sans-serif" fontSize="12">Optimized</text>
      
      <rect x="620" y="80" width="160" height="120" rx="8" fill="#374151"/>
      <text x="630" y="105" fill="#9CA3AF" fontFamily="Arial, sans-serif" fontSize="12">Daily Revenue</text>
      <text x="630" y="130" fill="white" fontFamily="Arial, sans-serif" fontSize="24" fontWeight="bold">$0.11</text>
      <text x="630" y="150" fill="#10B981" fontFamily="Arial, sans-serif" fontSize="12">Earning</text>
      
      {/* Performance graph */}
      <rect x="20" y="220" width="760" height="160" rx="8" fill="#374151"/>
      <text x="30" y="245" fill="#9CA3AF" fontFamily="Arial, sans-serif" fontSize="14">System Performance (24H)</text>
      <polyline points="40,350 120,330 200,320 280,310 360,300 440,295 520,305 600,290 680,280 760,270"
                stroke="url(#accent-dashboard)" strokeWidth="2" fill="none"/>
      
      <circle cx="50" cy="385" r="3" fill="#10B981"/>
      <text x="60" y="390" fill="#10B981" fontFamily="Arial, sans-serif" fontSize="10">All Systems Operational</text>
    </svg>
  );

  const generateGPUSVG = () => (
    <svg width="800" height="500" viewBox="0 0 800 500" className={className}>
      <defs>
        <linearGradient id="bg-gpu" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0F172A"/>
          <stop offset="100%" stopColor="#1E293B"/>
        </linearGradient>
        <linearGradient id="gpu-accent" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#7C3AED"/>
          <stop offset="100%" stopColor="#5B21B6"/>
        </linearGradient>
      </defs>
      
      <rect width="800" height="500" fill="url(#bg-gpu)"/>
      
      <rect x="0" y="0" width="800" height="50" fill="#1F2937"/>
      <text x="20" y="30" fill="white" fontFamily="Arial, sans-serif" fontSize="16" fontWeight="bold">🔧 GPU Management Interface</text>
      
      {/* GPU Cards */}
      <rect x="20" y="70" width="360" height="120" rx="8" fill="#374151"/>
      <text x="30" y="95" fill="white" fontFamily="Arial, sans-serif" fontSize="14" fontWeight="bold">RTX 3090 #1</text>
      <text x="30" y="115" fill="#10B981" fontFamily="Arial, sans-serif" fontSize="12">8.7 TH/s • 86°C • 367W</text>
      
      <circle cx="320" cy="130" r="30" stroke="#1F2937" strokeWidth="4" fill="none"/>
      <circle cx="320" cy="130" r="30" stroke="#F59E0B" strokeWidth="4" fill="none" 
              strokeDasharray="150" strokeDashoffset="45"/>
      <text x="312" y="135" fill="white" fontFamily="Arial, sans-serif" fontSize="12">86°C</text>
      
      <rect x="400" y="70" width="360" height="120" rx="8" fill="#374151"/>
      <text x="410" y="95" fill="white" fontFamily="Arial, sans-serif" fontSize="14" fontWeight="bold">RTX 4080 Series</text>
      <text x="410" y="115" fill="#10B981" fontFamily="Arial, sans-serif" fontSize="12">23.0 TH/s • 65°C • 320W</text>
      
      <circle cx="700" cy="130" r="30" stroke="#1F2937" strokeWidth="4" fill="none"/>
      <circle cx="700" cy="130" r="30" stroke="#10B981" strokeWidth="4" fill="none" 
              strokeDasharray="150" strokeDashoffset="75"/>
      <text x="692" y="135" fill="white" fontFamily="Arial, sans-serif" fontSize="12">65°C</text>
      
      <rect x="20" y="210" width="360" height="120" rx="8" fill="#374151"/>
      <text x="30" y="235" fill="white" fontFamily="Arial, sans-serif" fontSize="14" fontWeight="bold">RTX 4090 #1</text>
      <text x="30" y="255" fill="#10B981" fontFamily="Arial, sans-serif" fontSize="12">14.2 TH/s • 59°C • 311W</text>
      <text x="30" y="275" fill="#F59E0B" fontFamily="Arial, sans-serif" fontSize="10">⭐ Peak Performance</text>
      
      <rect x="400" y="210" width="360" height="120" rx="8" fill="#374151"/>
      <text x="410" y="235" fill="white" fontFamily="Arial, sans-serif" fontSize="14" fontWeight="bold">Fleet Overview</text>
      <text x="410" y="255" fill="#9CA3AF" fontFamily="Arial, sans-serif" fontSize="12">Total Hash Rate: 65.6 TH/s</text>
      <text x="410" y="275" fill="#9CA3AF" fontFamily="Arial, sans-serif" fontSize="12">Total Power: 1,831W</text>
      <text x="410" y="295" fill="#9CA3AF" fontFamily="Arial, sans-serif" fontSize="12">Status: All Online</text>
      <circle cx="470" cy="312" r="4" fill="#10B981"/>
      
      {/* Performance Chart */}
      <rect x="20" y="350" width="740" height="130" rx="8" fill="#374151"/>
      <text x="30" y="375" fill="white" fontFamily="Arial, sans-serif" fontSize="14" fontWeight="bold">Hash Rate Performance (24H)</text>
      <polyline points="60,450 120,440 180,435 240,445 300,430 360,425 420,430 480,425 540,420 600,415 660,410 720,405"
                stroke="#10B981" strokeWidth="3" fill="none"/>
    </svg>
  );

  const generateMiningPoolsSVG = () => (
    <svg width="800" height="450" viewBox="0 0 800 450" className={className}>
      <defs>
        <linearGradient id="bg-pools" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0F172A"/>
          <stop offset="100%" stopColor="#1E293B"/>
        </linearGradient>
      </defs>
      
      <rect width="800" height="450" fill="url(#bg-pools)"/>
      
      <rect x="0" y="0" width="800" height="50" fill="#1F2937"/>
      <text x="20" y="30" fill="white" fontFamily="Arial, sans-serif" fontSize="16" fontWeight="bold">⛏️ Mining Pool Management</text>
      <text x="650" y="30" fill="#10B981" fontFamily="Arial, sans-serif" fontSize="12">14/17 Connected</text>
      
      {/* Primary Pool */}
      <rect x="20" y="70" width="760" height="60" rx="8" fill="#374151"/>
      <circle cx="40" cy="100" r="8" fill="#10B981"/>
      <text x="60" y="90" fill="white" fontFamily="Arial, sans-serif" fontSize="14" fontWeight="bold">Binance Pool</text>
      <text x="60" y="105" fill="#9CA3AF" fontFamily="Arial, sans-serif" fontSize="12">stratum+tcp://stratum.binance.pool.com:8888</text>
      <text x="60" y="120" fill="#10B981" fontFamily="Arial, sans-serif" fontSize="12">PRIMARY • 176ms latency • 0 workers</text>
      
      <rect x="600" y="85" width="80" height="30" rx="4" fill="#10B981"/>
      <text x="625" y="105" fill="white" fontFamily="Arial, sans-serif" fontSize="12">ACTIVE</text>
      
      {/* Pool Grid */}
      <rect x="20" y="150" width="240" height="80" rx="8" fill="#374151"/>
      <circle cx="35" cy="170" r="6" fill="#10B981"/>
      <text x="50" y="175" fill="white" fontFamily="Arial, sans-serif" fontSize="12" fontWeight="bold">F2Pool</text>
      <text x="50" y="190" fill="#9CA3AF" fontFamily="Arial, sans-serif" fontSize="10">154ms • Connected</text>
      <text x="50" y="205" fill="#10B981" fontFamily="Arial, sans-serif" fontSize="10">12 workers</text>
      
      <rect x="280" y="150" width="240" height="80" rx="8" fill="#374151"/>
      <circle cx="295" cy="170" r="6" fill="#10B981"/>
      <text x="310" y="175" fill="white" fontFamily="Arial, sans-serif" fontSize="12" fontWeight="bold">AntPool</text>
      <text x="310" y="190" fill="#9CA3AF" fontFamily="Arial, sans-serif" fontSize="10">142ms • Connected</text>
      <text x="310" y="205" fill="#10B981" fontFamily="Arial, sans-serif" fontSize="10">8 workers</text>
      
      <rect x="540" y="150" width="240" height="80" rx="8" fill="#374151"/>
      <circle cx="555" cy="170" r="6" fill="#10B981"/>
      <text x="570" y="175" fill="white" fontFamily="Arial, sans-serif" fontSize="12" fontWeight="bold">Poolin</text>
      <text x="570" y="190" fill="#9CA3AF" fontFamily="Arial, sans-serif" fontSize="10">198ms • Connected</text>
      
      {/* Statistics */}
      <rect x="20" y="350" width="760" height="80" rx="8" fill="#374151"/>
      <text x="30" y="375" fill="white" fontFamily="Arial, sans-serif" fontSize="14" fontWeight="bold">Pool Statistics</text>
      <text x="30" y="395" fill="#9CA3AF" fontFamily="Arial, sans-serif" fontSize="12">Average Latency: 124ms</text>
      <text x="250" y="395" fill="#9CA3AF" fontFamily="Arial, sans-serif" fontSize="12">Active Workers: 72 distributed</text>
      <text x="500" y="395" fill="#9CA3AF" fontFamily="Arial, sans-serif" fontSize="12">Connection Health: Excellent</text>
    </svg>
  );

  const generateAnalyticsSVG = () => (
    <svg width="800" height="500" viewBox="0 0 800 500" className={className}>
      <defs>
        <linearGradient id="bg-analytics" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0F172A"/>
          <stop offset="100%" stopColor="#1E293B"/>
        </linearGradient>
        <linearGradient id="chart-analytics" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#10B981" stopOpacity="0.1"/>
          <stop offset="100%" stopColor="#10B981" stopOpacity="0.8"/>
        </linearGradient>
      </defs>
      
      <rect width="800" height="500" fill="url(#bg-analytics)"/>
      
      <rect x="0" y="0" width="800" height="50" fill="#1F2937"/>
      <text x="20" y="30" fill="white" fontFamily="Arial, sans-serif" fontSize="16" fontWeight="bold">📊 Performance Analytics</text>
      
      {/* KPI Cards */}
      <rect x="20" y="70" width="180" height="100" rx="8" fill="#374151"/>
      <text x="30" y="95" fill="#9CA3AF" fontFamily="Arial, sans-serif" fontSize="12">Peak Performance</text>
      <text x="30" y="120" fill="white" fontFamily="Arial, sans-serif" fontSize="20" fontWeight="bold">358.2 TH/s</text>
      <text x="30" y="140" fill="#10B981" fontFamily="Arial, sans-serif" fontSize="12">🏆 Record High</text>
      
      <rect x="220" y="70" width="180" height="100" rx="8" fill="#374151"/>
      <text x="230" y="95" fill="#9CA3AF" fontFamily="Arial, sans-serif" fontSize="12">Average Hash Rate</text>
      <text x="230" y="120" fill="white" fontFamily="Arial, sans-serif" fontSize="20" fontWeight="bold">342.5 TH/s</text>
      <text x="230" y="140" fill="#10B981" fontFamily="Arial, sans-serif" fontSize="12">+8.2% improvement</text>
      
      <rect x="420" y="70" width="180" height="100" rx="8" fill="#374151"/>
      <text x="430" y="95" fill="#9CA3AF" fontFamily="Arial, sans-serif" fontSize="12">Revenue Trend</text>
      <text x="430" y="120" fill="white" fontFamily="Arial, sans-serif" fontSize="20" fontWeight="bold">$3.30</text>
      <text x="430" y="140" fill="#10B981" fontFamily="Arial, sans-serif" fontSize="12">Monthly total</text>
      
      <rect x="620" y="70" width="160" height="100" rx="8" fill="#374151"/>
      <text x="630" y="95" fill="#9CA3AF" fontFamily="Arial, sans-serif" fontSize="12">Efficiency</text>
      <text x="630" y="120" fill="white" fontFamily="Arial, sans-serif" fontSize="20" fontWeight="bold">98.7%</text>
      <text x="630" y="140" fill="#10B981" fontFamily="Arial, sans-serif" fontSize="12">Uptime</text>
      
      {/* Main Chart */}
      <rect x="20" y="190" width="760" height="200" rx="8" fill="#374151"/>
      <text x="30" y="215" fill="white" fontFamily="Arial, sans-serif" fontSize="14" fontWeight="bold">Hash Rate History (7 Days)</text>
      
      <polygon points="60,360 160,340 260,320 360,300 460,285 560,275 660,260 760,250 760,370 60,370"
               fill="url(#chart-analytics)"/>
      
      <polyline points="60,360 160,340 260,320 360,300 460,285 560,275 660,260 760,250"
                stroke="#10B981" strokeWidth="3" fill="none"/>
      
      {/* Data points */}
      <circle cx="60" cy="360" r="4" fill="#10B981"/>
      <circle cx="160" cy="340" r="4" fill="#10B981"/>
      <circle cx="260" cy="320" r="4" fill="#10B981"/>
      <circle cx="360" cy="300" r="4" fill="#10B981"/>
      <circle cx="460" cy="285" r="4" fill="#10B981"/>
      <circle cx="560" cy="275" r="4" fill="#10B981"/>
      <circle cx="660" cy="260" r="4" fill="#10B981"/>
      <circle cx="760" cy="250" r="4" fill="#F59E0B"/>
      
      {/* Optimization Panel */}
      <rect x="20" y="410" width="360" height="70" rx="8" fill="#374151"/>
      <text x="30" y="435" fill="white" fontFamily="Arial, sans-serif" fontSize="14" fontWeight="bold">ML Optimization Status</text>
      <text x="30" y="455" fill="#10B981" fontFamily="Arial, sans-serif" fontSize="12">✓ PhaseNU Algorithm: 94.2% efficiency</text>
      <text x="30" y="470" fill="#10B981" fontFamily="Arial, sans-serif" fontSize="12">✓ Adaptive Restructuring: 91.8% active</text>
      
      {/* Revenue Panel */}
      <rect x="400" y="410" width="380" height="70" rx="8" fill="#374151"/>
      <text x="410" y="435" fill="white" fontFamily="Arial, sans-serif" fontSize="14" fontWeight="bold">Revenue Optimization</text>
      <text x="410" y="455" fill="#9CA3AF" fontFamily="Arial, sans-serif" fontSize="12">Daily: $0.11 • Weekly: $0.77 • Monthly: $3.30</text>
      <text x="410" y="470" fill="#10B981" fontFamily="Arial, sans-serif" fontSize="12">Profit margin optimized through intelligent pool switching</text>
    </svg>
  );

  const getSVG = () => {
    switch (type) {
      case 'dashboard':
        return generateDashboardSVG();
      case 'gpu-management':
        return generateGPUSVG();
      case 'mining-pools':
        return generateMiningPoolsSVG();
      case 'analytics':
        return generateAnalyticsSVG();
      default:
        return generateDashboardSVG();
    }
  };

  return getSVG();
};