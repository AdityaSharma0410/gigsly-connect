import { Link, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Briefcase } from "lucide-react";

const Navbar = () => {
  const navigate = useNavigate();

  const handlePostService = () => {
    // For now, redirect to signup. In production, check auth state
    navigate("/signup");
  };

  return (
    <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-7xl">
      <div className="glass-card px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <Briefcase className="h-6 w-6 text-primary transition-transform group-hover:scale-110" />
            <span className="text-2xl font-bold gradient-text">Gigsly</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link 
              to="/about" 
              className="text-foreground/80 hover:text-primary transition-colors font-medium"
            >
              About Us
            </Link>
            
            <div className="flex items-center gap-3">
              <Button 
                variant="ghost" 
                onClick={() => navigate("/login")}
                className="hover:bg-primary/10"
              >
                Login
              </Button>
              <Button 
                variant="outline"
                onClick={() => navigate("/signup")}
                className="border-primary/20 hover:bg-primary/10"
              >
                Sign Up
              </Button>
              <Button 
                onClick={handlePostService}
                className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-white"
              >
                Post a Service
              </Button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
