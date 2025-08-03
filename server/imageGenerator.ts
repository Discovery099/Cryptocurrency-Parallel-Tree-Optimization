// Note: ObjectStorageService will be imported when needed for actual upload functionality

export class ImageGenerator {

  // Generate SVG image for dashboard overview
  generateDashboardImage(): string {
    return `<svg width="800" height="400" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#0F172A"/>
      <stop offset="100%" style="stop-color:#1E293B"/>
    </linearGradient>
    <linearGradient id="accent" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#10B981"/>
      <stop offset="100%" style="stop-color:#059669"/>
    </linearGradient>
  </defs>
  
  <!-- Background -->
  <rect width="800" height="400" fill="url(#bg)"/>
  
  <!-- Header -->
  <rect x="0" y="0" width="800" height="60" fill="#1F2937"/>
  <text x="20" y="35" fill="white" font-family="Arial, sans-serif" font-size="18" font-weight="bold">🚀 CryptoTree Mining Dashboard</text>
  <circle cx="750" cy="30" r="8" fill="#10B981"/>
  <text x="720" y="35" fill="#10B981" font-family="Arial, sans-serif" font-size="12">LIVE</text>
  
  <!-- Main metrics grid -->
  <rect x="20" y="80" width="180" height="120" rx="8" fill="#374151"/>
  <text x="30" y="105" fill="#9CA3AF" font-family="Arial, sans-serif" font-size="12">Hash Rate</text>
  <text x="30" y="130" fill="white" font-family="Arial, sans-serif" font-size="24" font-weight="bold">65.6 TH/s</text>
  <text x="30" y="150" fill="#10B981" font-family="Arial, sans-serif" font-size="12">+8.2% ↗</text>
  <rect x="30" y="160" width="160" height="4" rx="2" fill="#1F2937"/>
  <rect x="30" y="160" width="120" height="4" rx="2" fill="url(#accent)"/>
  
  <rect x="220" y="80" width="180" height="120" rx="8" fill="#374151"/>
  <text x="230" y="105" fill="#9CA3AF" font-family="Arial, sans-serif" font-size="12">System Uptime</text>
  <text x="230" y="130" fill="white" font-family="Arial, sans-serif" font-size="24" font-weight="bold">98.7%</text>
  <text x="230" y="150" fill="#10B981" font-family="Arial, sans-serif" font-size="12">Excellent</text>
  <circle cx="370" cy="140" r="25" stroke="url(#accent)" stroke-width="3" fill="none"/>
  <circle cx="370" cy="140" r="25" stroke="url(#accent)" stroke-width="3" fill="none" stroke-dasharray="144" stroke-dashoffset="17"/>
  
  <rect x="420" y="80" width="180" height="120" rx="8" fill="#374151"/>
  <text x="430" y="105" fill="#9CA3AF" font-family="Arial, sans-serif" font-size="12">Cache Efficiency</text>
  <text x="430" y="130" fill="white" font-family="Arial, sans-serif" font-size="24" font-weight="bold">96.2%</text>
  <text x="430" y="150" fill="#10B981" font-family="Arial, sans-serif" font-size="12">Optimized</text>
  
  <rect x="620" y="80" width="160" height="120" rx="8" fill="#374151"/>
  <text x="630" y="105" fill="#9CA3AF" font-family="Arial, sans-serif" font-size="12">Daily Revenue</text>
  <text x="630" y="130" fill="white" font-family="Arial, sans-serif" font-size="24" font-weight="bold">$0.11</text>
  <text x="630" y="150" fill="#10B981" font-family="Arial, sans-serif" font-size="12">Earning</text>
  
  <!-- GPU Status -->
  <rect x="20" y="220" width="760" height="80" rx="8" fill="#374151"/>
  <text x="30" y="245" fill="#9CA3AF" font-family="Arial, sans-serif" font-size="14">GPU Fleet Status</text>
  
  <!-- GPU bars -->
  <rect x="30" y="255" width="100" height="15" rx="7" fill="#1F2937"/>
  <rect x="30" y="255" width="75" height="15" rx="7" fill="url(#accent)"/>
  <text x="30" y="285" fill="white" font-family="Arial, sans-serif" font-size="10">RTX 3090</text>
  
  <rect x="150" y="255" width="100" height="15" rx="7" fill="#1F2937"/>
  <rect x="150" y="255" width="85" height="15" rx="7" fill="url(#accent)"/>
  <text x="150" y="285" fill="white" font-family="Arial, sans-serif" font-size="10">RTX 4080</text>
  
  <rect x="270" y="255" width="100" height="15" rx="7" fill="#1F2937"/>
  <rect x="270" y="255" width="90" height="15" rx="7" fill="url(#accent)"/>
  <text x="270" y="285" fill="white" font-family="Arial, sans-serif" font-size="10">RTX 4090</text>
  
  <!-- Pool connections -->
  <text x="450" y="265" fill="#9CA3AF" font-family="Arial, sans-serif" font-size="12">Mining Pools: 14/17 Connected</text>
  <circle cx="720" cy="260" r="4" fill="#10B981"/>
  <text x="650" y="280" fill="#10B981" font-family="Arial, sans-serif" font-size="10">Binance Pool Primary</text>
  
  <!-- Performance graph area -->
  <rect x="20" y="320" width="760" height="60" rx="8" fill="#374151"/>
  <text x="30" y="340" fill="#9CA3AF" font-family="Arial, sans-serif" font-size="12">Hash Rate Trend (24H)</text>
  
  <!-- Simple trend line -->
  <polyline points="40,360 120,350 200,355 280,345 360,340 440,335 520,342 600,338 680,332 760,330"
            stroke="url(#accent)" stroke-width="2" fill="none"/>
  
  <!-- Status indicators -->
  <circle cx="50" cy="385" r="3" fill="#10B981"/>
  <text x="60" y="390" fill="#10B981" font-family="Arial, sans-serif" font-size="10">All Systems Operational</text>
</svg>`;
  }

  // Generate SVG image for GPU management interface
  generateGPUManagementImage(): string {
    return `<svg width="800" height="500" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg2" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#0F172A"/>
      <stop offset="100%" style="stop-color:#1E293B"/>
    </linearGradient>
    <linearGradient id="gpu" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#7C3AED"/>
      <stop offset="100%" style="stop-color:#5B21B6"/>
    </linearGradient>
  </defs>
  
  <rect width="800" height="500" fill="url(#bg2)"/>
  
  <!-- Header -->
  <rect x="0" y="0" width="800" height="50" fill="#1F2937"/>
  <text x="20" y="30" fill="white" font-family="Arial, sans-serif" font-size="16" font-weight="bold">🔧 GPU Management Interface</text>
  
  <!-- GPU Cards -->
  <rect x="20" y="70" width="360" height="120" rx="8" fill="#374151"/>
  <text x="30" y="95" fill="white" font-family="Arial, sans-serif" font-size="14" font-weight="bold">RTX 3090 #1</text>
  <text x="30" y="115" fill="#10B981" font-family="Arial, sans-serif" font-size="12">8.7 TH/s • 86°C • 367W</text>
  
  <!-- Temperature gauge -->
  <circle cx="320" cy="130" r="30" stroke="#1F2937" stroke-width="4" fill="none"/>
  <circle cx="320" cy="130" r="30" stroke="#F59E0B" stroke-width="4" fill="none" 
          stroke-dasharray="150" stroke-dashoffset="45" transform="rotate(-90 320 130)"/>
  <text x="312" y="135" fill="white" font-family="Arial, sans-serif" font-size="12">86°C</text>
  
  <!-- Memory usage bar -->
  <rect x="30" y="140" width="200" height="8" rx="4" fill="#1F2937"/>
  <rect x="30" y="140" width="125" height="8" rx="4" fill="url(#gpu)"/>
  <text x="30" y="160" fill="#9CA3AF" font-family="Arial, sans-serif" font-size="10">Memory: 12.5GB / 24.0GB</text>
  
  <!-- Power usage -->
  <rect x="250" y="140" width="50" height="35" rx="4" fill="#1F2937"/>
  <rect x="250" y="160" width="50" height="15" rx="2" fill="#EF4444"/>
  <text x="255" y="185" fill="#9CA3AF" font-family="Arial, sans-serif" font-size="10">367W</text>
  
  <!-- Second GPU -->
  <rect x="400" y="70" width="360" height="120" rx="8" fill="#374151"/>
  <text x="410" y="95" fill="white" font-family="Arial, sans-serif" font-size="14" font-weight="bold">RTX 4080 Series</text>
  <text x="410" y="115" fill="#10B981" font-family="Arial, sans-serif" font-size="12">23.0 TH/s • 65°C • 320W</text>
  
  <circle cx="700" cy="130" r="30" stroke="#1F2937" stroke-width="4" fill="none"/>
  <circle cx="700" cy="130" r="30" stroke="#10B981" stroke-width="4" fill="none" 
          stroke-dasharray="150" stroke-dashoffset="75" transform="rotate(-90 700 130)"/>
  <text x="692" y="135" fill="white" font-family="Arial, sans-serif" font-size="12">65°C</text>
  
  <rect x="410" y="140" width="200" height="8" rx="4" fill="#1F2937"/>
  <rect x="410" y="140" width="140" height="8" rx="4" fill="url(#gpu)"/>
  <text x="410" y="160" fill="#9CA3AF" font-family="Arial, sans-serif" font-size="10">Memory: 11.8GB / 16.0GB</text>
  
  <!-- Third GPU -->
  <rect x="20" y="210" width="360" height="120" rx="8" fill="#374151"/>
  <text x="30" y="235" fill="white" font-family="Arial, sans-serif" font-size="14" font-weight="bold">RTX 4090 #1</text>
  <text x="30" y="255" fill="#10B981" font-family="Arial, sans-serif" font-size="12">14.2 TH/s • 59°C • 311W</text>
  <text x="30" y="275" fill="#F59E0B" font-family="Arial, sans-serif" font-size="10">⭐ Peak Performance</text>
  
  <circle cx="320" cy="270" r="30" stroke="#1F2937" stroke-width="4" fill="none"/>
  <circle cx="320" cy="270" r="30" stroke="#10B981" stroke-width="4" fill="none" 
          stroke-dasharray="150" stroke-dashoffset="90" transform="rotate(-90 320 270)"/>
  <text x="312" y="275" fill="white" font-family="Arial, sans-serif" font-size="12">59°C</text>
  
  <rect x="30" y="290" width="200" height="8" rx="4" fill="#1F2937"/>
  <rect x="30" y="290" width="165" height="8" rx="4" fill="url(#gpu)"/>
  <text x="30" y="310" fill="#9CA3AF" font-family="Arial, sans-serif" font-size="10">Memory: 19.8GB / 24.0GB</text>
  
  <!-- System Overview -->
  <rect x="400" y="210" width="360" height="120" rx="8" fill="#374151"/>
  <text x="410" y="235" fill="white" font-family="Arial, sans-serif" font-size="14" font-weight="bold">Fleet Overview</text>
  
  <text x="410" y="255" fill="#9CA3AF" font-family="Arial, sans-serif" font-size="12">Total Hash Rate:</text>
  <text x="520" y="255" fill="white" font-family="Arial, sans-serif" font-size="12" font-weight="bold">65.6 TH/s</text>
  
  <text x="410" y="275" fill="#9CA3AF" font-family="Arial, sans-serif" font-size="12">Total Power:</text>
  <text x="520" y="275" fill="white" font-family="Arial, sans-serif" font-size="12" font-weight="bold">1,831W</text>
  
  <text x="410" y="295" fill="#9CA3AF" font-family="Arial, sans-serif" font-size="12">Avg Temperature:</text>
  <text x="520" y="295" fill="white" font-family="Arial, sans-serif" font-size="12" font-weight="bold">60°C</text>
  
  <text x="410" y="315" fill="#9CA3AF" font-family="Arial, sans-serif" font-size="12">Status:</text>
  <circle cx="470" cy="312" r="4" fill="#10B981"/>
  <text x="480" y="315" fill="#10B981" font-family="Arial, sans-serif" font-size="12">All Online</text>
  
  <!-- Performance Chart -->
  <rect x="20" y="350" width="740" height="130" rx="8" fill="#374151"/>
  <text x="30" y="375" fill="white" font-family="Arial, sans-serif" font-size="14" font-weight="bold">Hash Rate Performance (24H)</text>
  
  <!-- Chart axes -->
  <line x1="60" y1="400" x2="60" y2="460" stroke="#4B5563" stroke-width="1"/>
  <line x1="60" y1="460" x2="740" y2="460" stroke="#4B5563" stroke-width="1"/>
  
  <!-- Chart data -->
  <polyline points="60,450 120,440 180,435 240,445 300,430 360,425 420,430 480,425 540,420 600,415 660,410 720,405"
            stroke="#10B981" stroke-width="3" fill="none"/>
  
  <!-- Chart labels -->
  <text x="30" y="405" fill="#9CA3AF" font-family="Arial, sans-serif" font-size="10">70</text>
  <text x="30" y="430" fill="#9CA3AF" font-family="Arial, sans-serif" font-size="10">65</text>
  <text x="30" y="455" fill="#9CA3AF" font-family="Arial, sans-serif" font-size="10">60</text>
  <text x="30" y="465" fill="#9CA3AF" font-family="Arial, sans-serif" font-size="10">TH/s</text>
</svg>`;
  }

  // Generate SVG for mining pools interface
  generateMiningPoolsImage(): string {
    return `<svg width="800" height="450" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg3" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#0F172A"/>
      <stop offset="100%" style="stop-color:#1E293B"/>
    </linearGradient>
  </defs>
  
  <rect width="800" height="450" fill="url(#bg3)"/>
  
  <!-- Header -->
  <rect x="0" y="0" width="800" height="50" fill="#1F2937"/>
  <text x="20" y="30" fill="white" font-family="Arial, sans-serif" font-size="16" font-weight="bold">⛏️ Mining Pool Management</text>
  <text x="650" y="30" fill="#10B981" font-family="Arial, sans-serif" font-size="12">14/17 Connected</text>
  
  <!-- Primary Pool -->
  <rect x="20" y="70" width="760" height="60" rx="8" fill="#374151"/>
  <circle cx="40" cy="100" r="8" fill="#10B981"/>
  <text x="60" y="90" fill="white" font-family="Arial, sans-serif" font-size="14" font-weight="bold">Binance Pool</text>
  <text x="60" y="105" fill="#9CA3AF" font-family="Arial, sans-serif" font-size="12">stratum+tcp://stratum.binance.pool.com:8888</text>
  <text x="60" y="120" fill="#10B981" font-family="Arial, sans-serif" font-size="12">PRIMARY • 176ms latency • 0 workers</text>
  
  <rect x="600" y="85" width="80" height="30" rx="4" fill="#10B981"/>
  <text x="625" y="105" fill="white" font-family="Arial, sans-serif" font-size="12">ACTIVE</text>
  
  <!-- Pool Grid -->
  <rect x="20" y="150" width="240" height="80" rx="8" fill="#374151"/>
  <circle cx="35" cy="170" r="6" fill="#10B981"/>
  <text x="50" y="175" fill="white" font-family="Arial, sans-serif" font-size="12" font-weight="bold">F2Pool</text>
  <text x="50" y="190" fill="#9CA3AF" font-family="Arial, sans-serif" font-size="10">154ms • Connected</text>
  <text x="50" y="205" fill="#10B981" font-family="Arial, sans-serif" font-size="10">12 workers</text>
  
  <rect x="280" y="150" width="240" height="80" rx="8" fill="#374151"/>
  <circle cx="295" cy="170" r="6" fill="#10B981"/>
  <text x="310" y="175" fill="white" font-family="Arial, sans-serif" font-size="12" font-weight="bold">AntPool</text>
  <text x="310" y="190" fill="#9CA3AF" font-family="Arial, sans-serif" font-size="10">142ms • Connected</text>
  <text x="310" y="205" fill="#10B981" font-family="Arial, sans-serif" font-size="10">8 workers</text>
  
  <rect x="540" y="150" width="240" height="80" rx="8" fill="#374151"/>
  <circle cx="555" cy="170" r="6" fill="#10B981"/>
  <text x="570" y="175" fill="white" font-family="Arial, sans-serif" font-size="12" font-weight="bold">Poolin</text>
  <text x="570" y="190" fill="#9CA3AF" font-family="Arial, sans-serif" font-size="10">198ms • Connected</text>
  <text x="570" y="205" fill="#10B981" font-family="Arial, sans-serif" font-size="10">6 workers</text>
  
  <rect x="20" y="250" width="240" height="80" rx="8" fill="#374151"/>
  <circle cx="35" cy="270" r="6" fill="#EF4444"/>
  <text x="50" y="275" fill="white" font-family="Arial, sans-serif" font-size="12" font-weight="bold">SlushPool</text>
  <text x="50" y="290" fill="#9CA3AF" font-family="Arial, sans-serif" font-size="10">Timeout • Reconnecting</text>
  <text x="50" y="305" fill="#EF4444" font-family="Arial, sans-serif" font-size="10">Offline</text>
  
  <rect x="280" y="250" width="240" height="80" rx="8" fill="#374151"/>
  <circle cx="295" cy="270" r="6" fill="#F59E0B"/>
  <text x="310" y="275" fill="white" font-family="Arial, sans-serif" font-size="12" font-weight="bold">ViaBTC</text>
  <text x="310" y="290" fill="#9CA3AF" font-family="Arial, sans-serif" font-size="10">256ms • Slow</text>
  <text x="310" y="305" fill="#F59E0B" font-family="Arial, sans-serif" font-size="10">Warning</text>
  
  <rect x="540" y="250" width="240" height="80" rx="8" fill="#374151"/>
  <text x="555" y="275" fill="#9CA3AF" font-family="Arial, sans-serif" font-size="12">+11 More Pools</text>
  <text x="555" y="290" fill="#9CA3AF" font-family="Arial, sans-serif" font-size="10">Auto-failover enabled</text>
  <text x="555" y="305" fill="#10B981" font-family="Arial, sans-serif" font-size="10">Standby ready</text>
  
  <!-- Statistics -->
  <rect x="20" y="350" width="760" height="80" rx="8" fill="#374151"/>
  <text x="30" y="375" fill="white" font-family="Arial, sans-serif" font-size="14" font-weight="bold">Pool Statistics</text>
  
  <text x="30" y="395" fill="#9CA3AF" font-family="Arial, sans-serif" font-size="12">Average Latency:</text>
  <text x="150" y="395" fill="white" font-family="Arial, sans-serif" font-size="12">124ms</text>
  
  <text x="250" y="395" fill="#9CA3AF" font-family="Arial, sans-serif" font-size="12">Active Workers:</text>
  <text x="350" y="395" fill="white" font-family="Arial, sans-serif" font-size="12">72 distributed</text>
  
  <text x="500" y="395" fill="#9CA3AF" font-family="Arial, sans-serif" font-size="12">Failover Events:</text>
  <text x="600" y="395" fill="white" font-family="Arial, sans-serif" font-size="12">3 today</text>
  
  <text x="30" y="415" fill="#9CA3AF" font-family="Arial, sans-serif" font-size="12">Pool Switching:</text>
  <text x="150" y="415" fill="#10B981" font-family="Arial, sans-serif" font-size="12">Automatic</text>
  
  <text x="250" y="415" fill="#9CA3AF" font-family="Arial, sans-serif" font-size="12">Connection Health:</text>
  <text x="350" y="415" fill="#10B981" font-family="Arial, sans-serif" font-size="12">Excellent</text>
</svg>`;
  }

  // Generate SVG for analytics dashboard
  generateAnalyticsImage(): string {
    return `<svg width="800" height="500" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg4" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#0F172A"/>
      <stop offset="100%" style="stop-color:#1E293B"/>
    </linearGradient>
    <linearGradient id="chart" x1="0%" y1="100%" x2="0%" y2="0%">
      <stop offset="0%" style="stop-color:#10B981" stop-opacity="0.1"/>
      <stop offset="100%" style="stop-color:#10B981" stop-opacity="0.8"/>
    </linearGradient>
  </defs>
  
  <rect width="800" height="500" fill="url(#bg4)"/>
  
  <!-- Header -->
  <rect x="0" y="0" width="800" height="50" fill="#1F2937"/>
  <text x="20" y="30" fill="white" font-family="Arial, sans-serif" font-size="16" font-weight="bold">📊 Performance Analytics</text>
  
  <!-- KPI Cards -->
  <rect x="20" y="70" width="180" height="100" rx="8" fill="#374151"/>
  <text x="30" y="95" fill="#9CA3AF" font-family="Arial, sans-serif" font-size="12">Peak Performance</text>
  <text x="30" y="120" fill="white" font-family="Arial, sans-serif" font-size="20" font-weight="bold">358.2 TH/s</text>
  <text x="30" y="140" fill="#10B981" font-family="Arial, sans-serif" font-size="12">🏆 Record High</text>
  
  <rect x="220" y="70" width="180" height="100" rx="8" fill="#374151"/>
  <text x="230" y="95" fill="#9CA3AF" font-family="Arial, sans-serif" font-size="12">Average Hash Rate</text>
  <text x="230" y="120" fill="white" font-family="Arial, sans-serif" font-size="20" font-weight="bold">342.5 TH/s</text>
  <text x="230" y="140" fill="#10B981" font-family="Arial, sans-serif" font-size="12">+8.2% improvement</text>
  
  <rect x="420" y="70" width="180" height="100" rx="8" fill="#374151"/>
  <text x="430" y="95" fill="#9CA3AF" font-family="Arial, sans-serif" font-size="12">Revenue Trend</text>
  <text x="430" y="120" fill="white" font-family="Arial, sans-serif" font-size="20" font-weight="bold">$3.30</text>
  <text x="430" y="140" fill="#10B981" font-family="Arial, sans-serif" font-size="12">Monthly total</text>
  
  <rect x="620" y="70" width="160" height="100" rx="8" fill="#374151"/>
  <text x="630" y="95" fill="#9CA3AF" font-family="Arial, sans-serif" font-size="12">Efficiency</text>
  <text x="630" y="120" fill="white" font-family="Arial, sans-serif" font-size="20" font-weight="bold">98.7%</text>
  <text x="630" y="140" fill="#10B981" font-family="Arial, sans-serif" font-size="12">Uptime</text>
  
  <!-- Main Chart -->
  <rect x="20" y="190" width="760" height="200" rx="8" fill="#374151"/>
  <text x="30" y="215" fill="white" font-family="Arial, sans-serif" font-size="14" font-weight="bold">Hash Rate History (7 Days)</text>
  
  <!-- Chart grid -->
  <line x1="60" y1="230" x2="60" y2="370" stroke="#4B5563" stroke-width="1"/>
  <line x1="60" y1="370" x2="760" y2="370" stroke="#4B5563" stroke-width="1"/>
  
  <!-- Grid lines -->
  <line x1="60" y1="250" x2="760" y2="250" stroke="#374151" stroke-width="1"/>
  <line x1="60" y1="290" x2="760" y2="290" stroke="#374151" stroke-width="1"/>
  <line x1="60" y1="330" x2="760" y2="330" stroke="#374151" stroke-width="1"/>
  
  <!-- Chart area fill -->
  <polygon points="60,360 160,340 260,320 360,300 460,285 560,275 660,260 760,250 760,370 60,370"
           fill="url(#chart)"/>
  
  <!-- Chart line -->
  <polyline points="60,360 160,340 260,320 360,300 460,285 560,275 660,260 760,250"
            stroke="#10B981" stroke-width="3" fill="none"/>
  
  <!-- Data points -->
  <circle cx="60" cy="360" r="4" fill="#10B981"/>
  <circle cx="160" cy="340" r="4" fill="#10B981"/>
  <circle cx="260" cy="320" r="4" fill="#10B981"/>
  <circle cx="360" cy="300" r="4" fill="#10B981"/>
  <circle cx="460" cy="285" r="4" fill="#10B981"/>
  <circle cx="560" cy="275" r="4" fill="#10B981"/>
  <circle cx="660" cy="260" r="4" fill="#10B981"/>
  <circle cx="760" cy="250" r="4" fill="#F59E0B"/>
  
  <!-- Y-axis labels -->
  <text x="45" y="255" fill="#9CA3AF" font-family="Arial, sans-serif" font-size="10">400</text>
  <text x="45" y="295" fill="#9CA3AF" font-family="Arial, sans-serif" font-size="10">350</text>
  <text x="45" y="335" fill="#9CA3AF" font-family="Arial, sans-serif" font-size="10">300</text>
  <text x="45" y="375" fill="#9CA3AF" font-family="Arial, sans-serif" font-size="10">250</text>
  
  <!-- X-axis labels -->
  <text x="55" y="385" fill="#9CA3AF" font-family="Arial, sans-serif" font-size="10">7d</text>
  <text x="255" y="385" fill="#9CA3AF" font-family="Arial, sans-serif" font-size="10">3d</text>
  <text x="455" y="385" fill="#9CA3AF" font-family="Arial, sans-serif" font-size="10">1d</text>
  <text x="655" y="385" fill="#9CA3AF" font-family="Arial, sans-serif" font-size="10">12h</text>
  <text x="745" y="385" fill="#9CA3AF" font-family="Arial, sans-serif" font-size="10">Now</text>
  
  <!-- Optimization Panel -->
  <rect x="20" y="410" width="360" height="70" rx="8" fill="#374151"/>
  <text x="30" y="435" fill="white" font-family="Arial, sans-serif" font-size="14" font-weight="bold">ML Optimization Status</text>
  <text x="30" y="455" fill="#10B981" font-family="Arial, sans-serif" font-size="12">✓ PhaseNU Algorithm: 94.2% efficiency</text>
  <text x="30" y="470" fill="#10B981" font-family="Arial, sans-serif" font-size="12">✓ Adaptive Restructuring: 91.8% active</text>
  
  <!-- Revenue Panel -->
  <rect x="400" y="410" width="380" height="70" rx="8" fill="#374151"/>
  <text x="410" y="435" fill="white" font-family="Arial, sans-serif" font-size="14" font-weight="bold">Revenue Optimization</text>
  <text x="410" y="455" fill="#9CA3AF" font-family="Arial, sans-serif" font-size="12">Daily: $0.11 • Weekly: $0.77 • Monthly: $3.30</text>
  <text x="410" y="470" fill="#10B981" font-family="Arial, sans-serif" font-size="12">Profit margin optimized through intelligent pool switching</text>
</svg>`;
  }

  // Generate all platform images as data URLs
  generateAllImages(): { [key: string]: string } {
    const images = {
      dashboard: this.generateDashboardImage(),
      gpuManagement: this.generateGPUManagementImage(),
      miningPools: this.generateMiningPoolsImage(),
      analytics: this.generateAnalyticsImage(),
    };

    const dataUrls: { [key: string]: string } = {};
    
    for (const [name, svgContent] of Object.entries(images)) {
      // Convert SVG to data URL for direct embedding
      const encodedSvg = encodeURIComponent(svgContent);
      dataUrls[name] = `data:image/svg+xml,${encodedSvg}`;
      console.log(`Generated ${name} image as data URL`);
    }
    
    return dataUrls;
  }
}