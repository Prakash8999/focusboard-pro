import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useNavigate } from "react-router";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Mail, Lock, User, ArrowRight } from "lucide-react";
import { toast } from "sonner";

interface AuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AuthModal({ open, onOpenChange }: AuthModalProps) {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [flow, setFlow] = useState<"signIn" | "signUp">("signIn");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    formData.append("flow", flow);

    try {
      await signIn("password", formData);
      // The auth state change will be detected by the app, but we can also navigate
      onOpenChange(false);
      navigate("/dashboard");
      toast.success(flow === "signUp" ? "Account created!" : "Welcome back!");
    } catch (error) {
      console.error("Sign in error:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Authentication failed. Please check your credentials."
      );
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold">
            {flow === "signUp" ? "Create an Account" : "Welcome Back"}
          </DialogTitle>
          <DialogDescription className="text-center">
            {flow === "signUp"
              ? "Enter your details to get started"
              : "Enter your email and password to log in"}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <input name="flow" value={flow} type="hidden" />
          
          {flow === "signUp" && (
            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                name="name"
                placeholder="Full Name"
                type="text"
                className="pl-9"
                disabled={isLoading}
                required
              />
            </div>
          )}

          <div className="relative">
            <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              name="email"
              placeholder="name@example.com"
              type="email"
              className="pl-9"
              disabled={isLoading}
              required
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              name="password"
              placeholder="Password"
              type="password"
              className="pl-9"
              disabled={isLoading}
              required
              minLength={8}
            />
          </div>

          {error && (
            <p className="text-sm text-red-500 text-center bg-red-50 dark:bg-red-900/20 p-2 rounded">
              {error}
            </p>
          )}

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                {flow === "signUp" ? "Sign Up" : "Sign In"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>

          <div className="text-center text-sm text-muted-foreground mt-4">
            {flow === "signUp" ? "Already have an account? " : "Don't have an account? "}
            <button
              type="button"
              className="underline hover:text-primary font-medium"
              onClick={() => {
                setFlow(flow === "signUp" ? "signIn" : "signUp");
                setError(null);
              }}
            >
              {flow === "signUp" ? "Sign In" : "Sign Up"}
            </button>
          </div>
        </form>
        
        <div className="mt-4 pt-4 border-t text-center text-xs text-muted-foreground">
          Secured by Convex Auth
        </div>
      </DialogContent>
    </Dialog>
  );
}
