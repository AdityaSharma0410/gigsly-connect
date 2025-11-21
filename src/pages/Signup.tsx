import { useEffect, useState } from 'react';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import type { UserRole } from "@/types/api";

const roleOptions: { label: string; description: string; value: UserRole }[] = [
  { label: "Hire Professionals", description: "Post tasks and manage projects", value: "CLIENT" },
  { label: "Find Work", description: "Offer services and earn", value: "PROFESSIONAL" },
];

const Signup = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('CLIENT');
  const [isLoading, setIsLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const { signup } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const intent = searchParams.get('intent');
    if (intent === 'work') {
      setRole('PROFESSIONAL');
    } else if (intent === 'hire') {
      setRole('CLIENT');
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const user = await signup({ email, password, fullName, role });
      toast({
        title: 'Account Created!',
        description: `Welcome to Gigsly, ${user.fullName}`,
      });
      if (user.role === 'PROFESSIONAL') {
        navigate('/create-profile', { replace: true });
      } else {
        navigate('/post-task', { replace: true });
      }
    } catch (error) {
      toast({
        title: 'Signup Failed',
        description: error instanceof Error ? error.message : 'Please try again',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <section className="flex-1 flex items-center justify-center px-6">
        <div className="container mx-auto max-w-2xl">
          <Card className="glass-card border-0 animate-scale-in">
            <CardContent className="p-8">
              <h1 className="text-3xl font-bold text-center mb-2">Join Gigsly</h1>
              <p className="text-muted-foreground text-center mb-8">
                Create your account and start your journey
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                {roleOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setRole(option.value)}
                    className={`rounded-xl border p-4 text-left transition hover:border-primary ${
                      role === option.value ? 'border-primary bg-primary/5' : 'border-border'
                    }`}
                  >
                    <h3 className="text-lg font-semibold">{option.label}</h3>
                    <p className="text-sm text-muted-foreground">{option.description}</p>
                  </button>
                ))}
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input 
                    id="name" 
                    type="text" 
                    placeholder="John Doe"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input 
                    id="password" 
                    type="password" 
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? 'Creating account...' : 'Sign Up'}
                </Button>
              </form>
              
              <p className="text-center text-sm text-muted-foreground mt-6">
                Already have an account?{" "}
                <Link to="/login" className="text-primary hover:underline font-medium">
                  Log in
                </Link>
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Signup;
