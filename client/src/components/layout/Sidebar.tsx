import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard,
  Table,
  Microchip,
  Network,
  BarChart3,
  Settings,
  Shield,
  Zap,
  Brain
} from "lucide-react";

const navigation = [
  {
    name: 'Dashboard',
    href: '/',
    icon: LayoutDashboard,
    current: false,
  },
  {
    name: 'Merkle Trees',
    href: '/merkle-trees',
    icon: Table,
    current: false,
  },
  {
    name: 'GPU Management',
    href: '/gpu-management',
    icon: Microchip,
    current: false,
  },
  {
    name: 'Mining Pools',
    href: '/mining-pools',
    icon: Network,
    current: false,
  },
  {
    name: 'Analytics',
    href: '/analytics',
    icon: BarChart3,
    current: false,
  },
  {
    name: 'AI Optimizations',
    href: '/ai-optimizations',
    icon: Brain,
    current: false,
  },
  {
    name: 'Configuration',
    href: '/configuration',
    icon: Settings,
    current: false,
  },
  {
    name: 'Security',
    href: '/security',
    icon: Shield,
    current: false,
  },
];

export default function Sidebar() {
  const [location] = useLocation();

  return (
    <aside className="w-64 bg-slate-800 border-r border-slate-700 flex flex-col" data-testid="sidebar">
      <div className="p-6 border-b border-slate-700">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center">
            <Zap className="text-white text-lg" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white" data-testid="app-title">CryptoTree</h1>
            <p className="text-slate-400 text-sm" data-testid="app-subtitle">Parallel Optimization</p>
          </div>
        </div>
      </div>
      
      <nav className="flex-1 p-4 space-y-2" data-testid="navigation">
        {navigation.map((item) => {
          const isActive = location === item.href;
          const Icon = item.icon;
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "nav-item",
                isActive 
                  ? "active bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" 
                  : "text-slate-300 hover:bg-slate-700"
              )}
              data-testid={`nav-${item.name.toLowerCase().replace(' ', '-')}`}
            >
              <Icon className="h-5 w-5" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>
      
      <div className="p-4 border-t border-slate-700">
        <div className="bg-slate-700 rounded-lg p-3">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-semibold" data-testid="user-avatar">JD</span>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-white" data-testid="user-name">John Doe</p>
              <p className="text-xs text-slate-400" data-testid="user-role">Admin</p>
            </div>
            <button className="text-slate-400 hover:text-white transition-colors" data-testid="user-menu">
              <Settings className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
