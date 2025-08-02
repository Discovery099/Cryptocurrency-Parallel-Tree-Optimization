import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/Dashboard";
import MerkleTrees from "@/pages/MerkleTrees";
import GPUManagement from "@/pages/GPUManagement";
import MiningPools from "@/pages/MiningPools";
import Analytics from "@/pages/Analytics";
import Configuration from "@/pages/Configuration";
import Security from "@/pages/Security";
import AIOptimizations from "@/pages/AIOptimizations";
import LandingPage from "@/pages/LandingPage";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import { WebSocketProvider } from "@/lib/websocket";

function Router() {
  return (
    <Switch>
      <Route path="/landing" component={LandingPage} />
      <Route path="/" component={Dashboard} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/merkle-trees" component={MerkleTrees} />
      <Route path="/gpu-management" component={GPUManagement} />
      <Route path="/mining-pools" component={MiningPools} />
      <Route path="/analytics" component={Analytics} />
      <Route path="/ai-optimizations" component={AIOptimizations} />
      <Route path="/configuration" component={Configuration} />
      <Route path="/security" component={Security} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <WebSocketProvider>
        <TooltipProvider>
          <div className="flex h-screen bg-slate-900 text-slate-50">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
              <Header />
              <main className="flex-1 overflow-auto">
                <Router />
              </main>
            </div>
          </div>
          <Toaster />
        </TooltipProvider>
      </WebSocketProvider>
    </QueryClientProvider>
  );
}

export default App;
