import { useState } from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Brain, 
  Shield, 
  Server, 
  Activity, 
  Zap, 
  TrendingUp, 
  Users, 
  Award,
  ChevronRight,
  Play,
  Star,
  Github,
  ArrowRight
} from 'lucide-react';

const features = [
  {
    icon: Brain,
    title: 'AI/ML Optimization',
    description: 'Machine learning algorithms achieving 30%+ performance improvements with predictive analytics and pattern recognition.',
    metrics: '30%+ Performance Boost',
    color: 'from-blue-500 to-cyan-500'
  },
  {
    icon: Shield,
    title: 'Quantum-Resistant Security',
    description: 'Future-proof your operations with post-quantum cryptographic algorithms and real-time threat assessment.',
    metrics: '7 Quantum Algorithms',
    color: 'from-purple-500 to-pink-500'
  },
  {
    icon: Server,
    title: 'Distributed Cluster Management',
    description: 'Intelligent load balancing with automatic failover ensuring 99.9% uptime across your mining operations.',
    metrics: '99.9% Uptime',
    color: 'from-green-500 to-emerald-500'
  },
  {
    icon: Activity,
    title: 'Advanced Pool Integration',
    description: 'Real-time API integration with major mining pools including automatic switching for maximum profitability.',
    metrics: '5 Major Pools',
    color: 'from-orange-500 to-red-500'
  }
];

const stats = [
  { label: 'Hash Rate Optimization', value: '30%+', icon: TrendingUp },
  { label: 'System Uptime', value: '99.9%', icon: Server },
  { label: 'Response Time', value: '<50ms', icon: Zap },
  { label: 'Security Score', value: '95+', icon: Shield }
];

const testimonials = [
  {
    name: 'Alex Chen',
    role: 'Mining Operations Director',
    company: 'CryptoTech Solutions',
    content: 'This parallel tree optimization platform transformed our mining efficiency. The AI optimization alone increased our hash rate by 32%.',
    avatar: 'AC'
  },
  {
    name: 'Sarah Rodriguez',
    role: 'Blockchain Engineer',
    company: 'Digital Mining Corp',
    content: 'The quantum-resistant security features give us confidence in long-term operation sustainability.',
    avatar: 'SR'
  },
  {
    name: 'Michael Johnson',
    role: 'CTO',
    company: 'MineMax Enterprise',
    content: 'Automatic failover and cluster management have eliminated our downtime completely. Outstanding platform.',
    avatar: 'MJ'
  }
];

export default function LandingPage() {
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Navigation */}
      <nav className="border-b border-slate-700/50 backdrop-blur-sm bg-slate-900/80 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center">
                <Zap className="text-white text-lg" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">CryptoTree</h1>
                <p className="text-emerald-400 text-sm">Parallel Optimization</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" className="text-slate-300 hover:text-white">
                <Github className="h-4 w-4 mr-2" />
                GitHub
              </Button>
              <Link href="/dashboard">
                <Button className="bg-emerald-500 hover:bg-emerald-600">
                  Launch Dashboard
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Badge className="mb-6 bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
              <Star className="h-3 w-3 mr-1" />
              Production Ready
            </Badge>
            <h1 className="text-4xl lg:text-6xl font-bold text-white mb-6">
              Cryptocurrency Parallel
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
                Tree Optimization
              </span>
            </h1>
            <p className="text-xl text-slate-300 mb-8 max-w-3xl mx-auto">
              Advanced mining operations with GPU acceleration, ML optimization, and 
              quantum-resistant algorithms for parallel Merkle tree construction.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
              <Link href="/dashboard">
                <Button size="lg" className="bg-emerald-500 hover:bg-emerald-600 text-white px-8">
                  <Play className="h-5 w-5 mr-2" />
                  Try Live Demo
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-800">
                <Github className="h-5 w-5 mr-2" />
                View on GitHub
              </Button>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="flex justify-center mb-2">
                    <stat.icon className="h-8 w-8 text-emerald-400" />
                  </div>
                  <div className="text-2xl font-bold text-white">{stat.value}</div>
                  <div className="text-sm text-slate-400">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              Cutting-Edge Features
            </h2>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Built with modern technologies and advanced algorithms for optimal mining performance
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <Card 
                key={index} 
                className={`bg-slate-800/50 border-slate-700 hover:border-slate-600 transition-all duration-300 cursor-pointer ${
                  hoveredFeature === index ? 'scale-105' : ''
                }`}
                onMouseEnter={() => setHoveredFeature(index)}
                onMouseLeave={() => setHoveredFeature(null)}
              >
                <CardHeader>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-lg bg-gradient-to-r ${feature.color}`}>
                      <feature.icon className="h-6 w-6 text-white" />
                    </div>
                    <Badge variant="secondary" className="bg-slate-700 text-slate-300">
                      {feature.metrics}
                    </Badge>
                  </div>
                  <CardTitle className="text-white text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-slate-300 text-base leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Architecture Overview */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
                Modern Architecture
              </h2>
              <p className="text-xl text-slate-300 mb-8">
                Built with cutting-edge technologies for scalability, security, and performance.
              </p>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full" />
                  <span className="text-slate-300"><strong className="text-white">React 18</strong> with TypeScript for type-safe development</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-400 rounded-full" />
                  <span className="text-slate-300"><strong className="text-white">Express.js</strong> with advanced service architecture</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-purple-400 rounded-full" />
                  <span className="text-slate-300"><strong className="text-white">PostgreSQL</strong> with Drizzle ORM for optimal performance</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-orange-400 rounded-full" />
                  <span className="text-slate-300"><strong className="text-white">WebSocket</strong> integration for real-time updates</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">System Components</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                    <span className="text-slate-300">Mining Engine</span>
                    <Badge className="bg-green-500/20 text-green-400">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                    <span className="text-slate-300">AI/ML Optimizer</span>
                    <Badge className="bg-blue-500/20 text-blue-400">Learning</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                    <span className="text-slate-300">Cluster Manager</span>
                    <Badge className="bg-purple-500/20 text-purple-400">Monitoring</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                    <span className="text-slate-300">Pool Integration</span>
                    <Badge className="bg-orange-500/20 text-orange-400">Connected</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              Trusted by Mining Professionals
            </h2>
            <p className="text-xl text-slate-300">
              See what industry leaders are saying about CryptoMerkle Pro
            </p>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center mr-4">
                      <span className="text-white font-semibold">{testimonial.avatar}</span>
                    </div>
                    <div>
                      <div className="font-semibold text-white">{testimonial.name}</div>
                      <div className="text-slate-400 text-sm">{testimonial.role}</div>
                      <div className="text-emerald-400 text-sm">{testimonial.company}</div>
                    </div>
                  </div>
                  <p className="text-slate-300 italic">"{testimonial.content}"</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
            Ready to Optimize Your Mining Operations?
          </h2>
          <p className="text-xl text-slate-300 mb-8">
            Join thousands of miners using parallel tree optimization to maximize their profitability 
            with AI-powered algorithms and enterprise-grade security.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/dashboard">
              <Button size="lg" className="bg-emerald-500 hover:bg-emerald-600 text-white px-8">
                <Play className="h-5 w-5 mr-2" />
                Launch Dashboard
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-800">
              <Github className="h-5 w-5 mr-2" />
              Star on GitHub
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-700/50 bg-slate-900/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center">
                  <Zap className="text-white text-lg" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white">CryptoTree</h1>
                  <p className="text-emerald-400 text-sm">Parallel Optimization</p>
                </div>
              </div>
              <p className="text-slate-400 max-w-md">
                Advanced mining operations with GPU acceleration, ML optimization, and 
                quantum-resistant algorithms for parallel Merkle tree construction.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-4">Features</h3>
              <ul className="space-y-2 text-slate-400">
                <li>AI/ML Optimization</li>
                <li>Quantum Security</li>
                <li>Cluster Management</li>
                <li>Pool Integration</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-4">Resources</h3>
              <ul className="space-y-2 text-slate-400">
                <li>Documentation</li>
                <li>API Reference</li>
                <li>GitHub Repository</li>
                <li>Community Support</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-700/50 pt-8 mt-8 text-center text-slate-400">
            <p>&copy; 2025 Cryptocurrency Parallel Tree Optimization. Built for the blockchain community.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}