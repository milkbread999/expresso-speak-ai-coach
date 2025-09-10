import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const LogIn = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate(from);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md bg-gradient-to-br from-card to-card/80 shadow-xl border-0">
        <CardContent className="p-8">
          <div className="text-center space-y-4 mb-6">
            <div className="w-14 h-14 bg-gradient-hero rounded-xl flex items-center justify-center shadow-soft mx-auto">
              <img 
                src="/expressologo.png" 
                alt="Expresso Logo" 
                className="w-8 h-8 object-contain rounded-full" 
              />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-hero bg-clip-text text-transparent">
              Welcome Back
            </h1>
            <p className="text-muted-foreground text-sm">
              Sign in to continue your Expresso journey.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>

            <Button type="submit" className="w-full bg-gradient-hero hover:opacity-90 transition-opacity">
              Sign In
            </Button>

            <p className="text-sm text-center mt-4 text-muted-foreground">
              Don’t have an account?{' '}
              <a href="/sign-up" className="text-primary font-medium hover:underline">
                Sign up
              </a>
            </p>

            {error && (
              <p className="text-red-500 text-sm text-center mt-2">
                {error}
              </p>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default LogIn;
