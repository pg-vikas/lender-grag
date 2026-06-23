import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/admin/components/ui/button";
import { Input } from "@/admin/components/ui/input";
import { Label } from "@/admin/components/ui/label";
import { Checkbox } from "@/admin/components/ui/checkbox";

export default function Login() {
  const [, setLocation] = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Dummy login, redirect to home
    setLocation("/admin/home");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
         <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary rounded-full blur-[120px]" />
         <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500 rounded-full blur-[120px]" />
      </div>

      <div className="w-full max-w-md bg-slate-950/10 backdrop-blur-mdard/50 backdrop-blur-xl border border-border rounded-2xl shadow-2xl p-8 z-10 animate-in fade-in zoom-in duration-500">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-primary/20 rounded-xl flex items-center justify-center mb-4 border border-primary/50">
            <span className="text-3xl font-black text-primary">GH</span>
          </div>
          <h1 className="text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]xl font-bold tracking-tight text-foreground">Log In</h1>
          <p className="text-sm text-muted-foreground mt-2">Welcome back to Greg Gorilla Hub</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input 
              id="email" 
              type="email" 
              placeholder="name@example.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-background/50 h-12"
              required
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <a href="#" className="text-xs text-primary hover:underline" onClick={(e) => e.preventDefault()}>
                Forgot your password?
              </a>
            </div>
            <Input 
              id="password" 
              type="password" 
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-background/50 h-12"
              required
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox id="remember" />
            <label
              htmlFor="remember"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Stay logged in
            </label>
          </div>

          <Button type="submit" className="w-full h-12 font-semibold text-primary-foreground bg-primary hover:bg-primary/90 mt-2">
            Log In
          </Button>
        </form>
        
        <div className="mt-8 text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]enter text-xs text-muted-foreground">
          <p>StripeM-Inner</p>
        </div>
      </div>
    </div>
  );
}
