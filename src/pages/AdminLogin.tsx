import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Leaf, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      toast({ title: "Please fill all fields", variant: "destructive" });
      return;
    }
    setLoading(true);
    const { error } = await signIn(username, password);
    setLoading(false);

    if (error) {
      console.error("Login error:", error);
      toast({ title: "Login failed", description: error, variant: "destructive" });
    } else {
      navigate("/admin");
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="glass-card p-8 w-full max-w-sm">
        <div className="flex items-center justify-center gap-2 mb-8">
          <Leaf className="w-7 h-7 text-primary" />
          <span className="font-display text-xl text-foreground font-bold uppercase tracking-widest">Admin Login</span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="bg-muted border-border rounded-xl"
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="bg-muted border-border rounded-xl"
          />
          <Button type="submit" className="w-full rounded-xl font-bold py-6 text-sm uppercase tracking-widest gap-2" disabled={loading}>
            {loading ? <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" /> : <LogIn className="w-4 h-4" />}
            {loading ? "Signing in..." : "Sign In"}
          </Button>
        </form>
      </div>
    </div>
  );
}
