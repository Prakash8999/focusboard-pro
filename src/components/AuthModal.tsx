import { useState, useEffect } from "react";
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
  const { signIn, signUp, signOut, user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [flow, setFlow] = useState<"signIn" | "signUp">("signIn");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Reset state when modal opens/closes
  useEffect(() => {
    if (!open) {
      setFlow("signIn");
      setError(null);
      setIsLoading(false);
    }
  }, [open]);

  // Close modal when authenticated
  useEffect(() => {
    if (isAuthenticated && open) {
      onOpenChange(false);
      navigate("/dashboard");
      toast.success("Welcome back!");
    }
  }, [isAuthenticated, open, onOpenChange, navigate]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);

    try {
      if (flow === "signUp") {
        await signUp(formData);
        toast.success("Account created successfully!");
      } else {
        await signIn("password", formData);
      }
      // Navigation handled by useEffect
    } catch (error: any) {
      console.error("Auth error:", error);
      let errorMessage = "Authentication failed";
      if (error.code === "auth/email-already-in-use") {
        errorMessage = "This email is already registered. Please sign in instead.";
      } else if (error.code === "auth/invalid-credential" || error.code === "auth/user-not-found" || error.code === "auth/wrong-password") {
        errorMessage = "Invalid email or password.";
      } else if (error.message) {
        errorMessage = error.message;
      }
      setError(errorMessage);
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
              minLength={6}
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
          Secured by Firebase
        </div>
      </DialogContent>
    </Dialog>
  );
}