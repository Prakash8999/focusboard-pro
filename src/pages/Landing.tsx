import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, LayoutDashboard, CheckCircle2, Zap, Shield } from "lucide-react";
import { useNavigate } from "react-router";
import { useAuth } from "@/hooks/use-auth";

export default function Landing() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate("/dashboard");
    } else {
      navigate("/auth");
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <nav className="px-6 py-4 flex items-center justify-between border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="bg-primary text-primary-foreground p-1.5 rounded-lg">
            <LayoutDashboard className="w-5 h-5" />
          </div>
          <span className="font-bold text-lg tracking-tight">FocusBoard</span>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate("/auth")}>
            Sign In
          </Button>
          <Button onClick={handleGetStarted}>
            Get Started
          </Button>
        </div>
      </nav>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 px-6 text-center max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Master Your Workflow
            </h1>
            <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
              A minimalist Kanban board designed for personal productivity. 
              Focus on what matters, limit work in progress, and get things done.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Button size="lg" className="h-12 px-8 text-lg rounded-full" onClick={handleGetStarted}>
                Start for Free <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </div>
          </motion.div>

          {/* Visual Preview */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="mt-16 relative rounded-xl border shadow-2xl overflow-hidden bg-card"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 to-transparent pointer-events-none" />
            <img 
              src="https://images.unsplash.com/photo-1611224923853-80b023f02d71?q=80&w=2539&auto=format&fit=crop" 
              alt="Kanban Board Preview" 
              className="w-full h-auto opacity-90"
            />
          </motion.div>
        </section>

        {/* Features */}
        <section className="py-20 bg-secondary/30">
          <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-10">
            <FeatureCard 
              icon={<Zap className="w-8 h-8 text-yellow-500" />}
              title="Focus Mode"
              description="Strict WIP limits prevent overwhelm. Only 2 tasks in progress at a time."
            />
            <FeatureCard 
              icon={<CheckCircle2 className="w-8 h-8 text-green-500" />}
              title="Visual Progress"
              description="Get that dopamine hit when you drag a task to Done. Track your wins."
            />
            <FeatureCard 
              icon={<Shield className="w-8 h-8 text-blue-500" />}
              title="Blocker Management"
              description="Track what's blocking you. Add reasons and clear the path to success."
            />
          </div>
        </section>
      </main>

      <footer className="py-8 text-center text-sm text-muted-foreground border-t">
        <p>© {new Date().getFullYear()} FocusBoard. Built with Convex & React.</p>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="bg-card p-8 rounded-2xl border shadow-sm hover:shadow-md transition-shadow">
      <div className="mb-4 bg-background w-16 h-16 rounded-2xl flex items-center justify-center shadow-sm border">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">{description}</p>
    </div>
  );
}