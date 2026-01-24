import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, BookOpen, List, Kanban, Brain, FileText, CheckSquare, Star, Sparkles, Lightbulb } from "lucide-react";
import { useNavigate } from "react-router";
import { useAuth } from "@/hooks/use-auth";
import { useState } from "react";
import { AuthModal } from "@/components/AuthModal";
import { ModeToggle } from "@/components/mode-toggle";

export default function Landing() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate("/dashboard");
    } else {
      setIsAuthModalOpen(true);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col overflow-x-hidden selection:bg-primary/20">
      {/* Navbar */}
      <nav className="px-4 md:px-6 py-4 flex items-center justify-between border-b bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
          <div className="bg-gradient-to-br from-primary to-blue-600 p-1.5 rounded-lg shadow-lg shadow-primary/20">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-lg tracking-tight">Study App <span className="text-xs px-1.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">PERSONAL</span></span>
        </div>
        <div className="flex items-center gap-4">
          <ModeToggle />
          <Button variant="ghost" onClick={() => setIsAuthModalOpen(true)} className="hidden sm:flex">
            Sign In
          </Button>
          <Button onClick={handleGetStarted} className="rounded-full px-6 shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all">
            Get Started
          </Button>
        </div>
      </nav>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-20 md:py-32 px-4 md:px-6 overflow-hidden">
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-primary/10 rounded-full blur-3xl opacity-50" />
            <div className="absolute bottom-0 right-0 w-[800px] h-[600px] bg-blue-500/5 rounded-full blur-3xl opacity-30" />
          </div>

          <div className="max-w-5xl mx-auto text-center relative z-10">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={containerVariants}
            >
              <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/50 border border-border mb-6 text-sm font-medium text-muted-foreground">
                <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                <span>Your personal study companion</span>
              </motion.div>

              <motion.h1 variants={itemVariants} className="text-4xl md:text-7xl lg:text-8xl font-extrabold tracking-tight mb-6 text-foreground">
                Study Smarter, <br className="hidden md:block" />
                <span className="bg-gradient-to-r from-primary via-blue-600 to-purple-600 bg-clip-text text-transparent animate-gradient bg-300%">
                  Not Harder
                </span>
              </motion.h1>

              <motion.p variants={itemVariants} className="text-lg md:text-2xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
                Your all-in-one personal study app. Take detailed notes, track learning topics, and manage tasks — all in one beautiful interface.
              </motion.p>

              <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button size="lg" className="h-14 px-8 text-lg rounded-full w-full sm:w-auto shadow-xl shadow-primary/20 hover:shadow-primary/30 transition-all hover:scale-105" onClick={handleGetStarted}>
                  Start Learning Free <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                <Button size="lg" variant="outline" className="h-14 px-8 text-lg rounded-full w-full sm:w-auto hover:bg-secondary/50" onClick={() => setIsAuthModalOpen(true)}>
                  See Demo
                </Button>
              </motion.div>
            </motion.div>

            {/* Visual Preview - 3 Tabs */}
            <motion.div
              initial={{ opacity: 0, y: 60, rotateX: 20 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{ delay: 0.4, duration: 0.8, type: "spring" }}
              className="mt-20 relative mx-auto max-w-5xl perspective-1000"
            >
              <div className="relative rounded-xl border bg-card/50 backdrop-blur-sm shadow-2xl overflow-hidden ring-1 ring-white/10 dark:ring-white/5">
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 to-transparent pointer-events-none" />

                {/* Tab Navigation Mock */}
                <div className="flex gap-2 p-4 border-b bg-muted/20">
                  <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 border border-primary/20">
                    <div className="w-4 h-4 rounded bg-primary/30" />
                    <div className="h-3 w-16 bg-primary/30 rounded" />
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-muted/20">
                    <div className="w-4 h-4 rounded bg-muted" />
                    <div className="h-3 w-12 bg-muted rounded" />
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-muted/20">
                    <div className="w-4 h-4 rounded bg-muted" />
                    <div className="h-3 w-14 bg-muted rounded" />
                  </div>
                </div>

                {/* Content Mock */}
                <div className="p-4 md:p-6 space-y-4">
                  <div className="h-8 w-48 bg-muted rounded-md" />
                  <div className="space-y-2">
                    <div className="h-4 w-full bg-muted/60 rounded" />
                    <div className="h-4 w-5/6 bg-muted/60 rounded" />
                    <div className="h-4 w-4/6 bg-muted/60 rounded" />
                  </div>
                  <div className="grid grid-cols-2 gap-3 mt-6">
                    <div className="h-32 rounded-lg bg-gradient-to-br from-primary/10 to-blue-500/10 border" />
                    <div className="h-32 rounded-lg bg-gradient-to-br from-purple-500/10 to-pink-500/10 border" />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* 3 Main Features - Tabs */}
        <section className="py-24 bg-secondary/30 relative">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">Three powerful tools in one</h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Everything you need to organize your learning journey, from detailed notes to quick checklists.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <TabFeatureCard
                icon={<BookOpen className="w-8 h-8 text-blue-500" />}
                title="Study Topics"
                description="Create detailed study notes with rich text editor. Upload images, link to tasks, and keep all your learning materials in one place."
                color="blue"
              />
              <TabFeatureCard
                icon={<List className="w-8 h-8 text-green-500" />}
                title="Learning Topics"
                description="Quick checklist for tracking what you need to learn. Add topics in bulk, group them by subject, and mark them complete as you progress."
                color="green"
              />
              <TabFeatureCard
                icon={<Kanban className="w-8 h-8 text-purple-500" />}
                title="Task Board"
                description="Visual Kanban board to manage your study tasks. Drag and drop cards, track progress, and link tasks to your study notes."
                color="purple"
              />
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-24 relative">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">Built for focused learning</h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Simple, powerful features designed for personal use — no clutter, no distractions.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <FeatureCard
                icon={<Brain className="w-6 h-6 text-indigo-500" />}
                title="Rich Text Editor"
                description="Write unlimited notes with formatting, images, and code blocks. Perfect for detailed study materials and long-form content."
              />
              <FeatureCard
                icon={<Lightbulb className="w-6 h-6 text-yellow-500" />}
                title="Smart Linking"
                description="Connect your study notes with tasks and topics. See related content at a glance and navigate seamlessly between them."
              />
              <FeatureCard
                icon={<CheckSquare className="w-6 h-6 text-green-500" />}
                title="Progress Tracking"
                description="Track completed topics, view linked tasks, and see your learning progress. Stay motivated with visual completion indicators."
              />
              <FeatureCard
                icon={<FileText className="w-6 h-6 text-blue-500" />}
                title="Search Everything"
                description="Instant full-text search across all your notes and topics. Find what you need quickly without scrolling."
              />
              <FeatureCard
                icon={<Sparkles className="w-6 h-6 text-pink-500" />}
                title="Auto-Save"
                description="Never lose your work. All changes are automatically saved to the cloud with real-time sync across devices."
              />
              <FeatureCard
                icon={<Star className="w-6 h-6 text-orange-500" />}
                title="100% Private"
                description="Your personal study space. No social features, no sharing, no distractions — just you and your learning goals."
              />
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 px-6">
          <div className="max-w-4xl mx-auto bg-gradient-to-br from-primary to-blue-600 text-primary-foreground rounded-3xl p-8 md:p-16 text-center relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
            <div className="relative z-10">
              <h2 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight">Ready to level up your learning?</h2>
              <p className="text-primary-foreground/90 text-lg md:text-xl mb-10 max-w-2xl mx-auto">
                Start organizing your study materials, track your progress, and achieve your learning goals — all for free.
              </p>
              <Button size="lg" variant="secondary" className="h-14 px-8 text-lg rounded-full shadow-xl hover:scale-105 transition-transform" onClick={handleGetStarted}>
                Get Started Now — It's Free
              </Button>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-12 px-6 border-t bg-card">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="bg-primary/10 p-1.5 rounded-lg">
              <BookOpen className="w-5 h-5 text-primary" />
            </div>
            <span className="font-bold text-lg">Study App</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Study App. Built with Firebase & React.
          </p>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
            <a href="#" className="hover:text-foreground transition-colors">Terms</a>
            <a href="#" className="hover:text-foreground transition-colors">GitHub</a>
          </div>
        </div>
      </footer>

      <AuthModal open={isAuthModalOpen} onOpenChange={setIsAuthModalOpen} />
    </div>
  );
}

function TabFeatureCard({ icon, title, description, color }: { icon: React.ReactNode, title: string, description: string, color: string }) {
  const colorMap: Record<string, string> = {
    blue: "from-blue-500/10 to-blue-600/5 border-blue-500/20 hover:border-blue-500/40",
    green: "from-green-500/10 to-green-600/5 border-green-500/20 hover:border-green-500/40",
    purple: "from-purple-500/10 to-purple-600/5 border-purple-500/20 hover:border-purple-500/40",
  };

  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      className={`bg-gradient-to-br ${colorMap[color]} p-8 rounded-2xl border shadow-lg hover:shadow-2xl transition-all duration-300 group`}
    >
      <div className="mb-6 bg-background/50 w-16 h-16 rounded-2xl flex items-center justify-center shadow-sm border group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
      <h3 className="text-2xl font-bold mb-4 group-hover:text-primary transition-colors">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">{description}</p>
    </motion.div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-card p-8 rounded-2xl border shadow-sm hover:shadow-xl transition-all duration-300 group"
    >
      <div className="mb-6 bg-secondary/50 w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm border group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">{description}</p>
    </motion.div>
  );
}