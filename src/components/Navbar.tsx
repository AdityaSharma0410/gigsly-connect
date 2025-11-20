import { Link, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Briefcase, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const Navbar = () => {
  const navigate = useNavigate();
  const { isAuthenticated, logout, user } = useAuth();

  const handlePostService = () => {
    if (!isAuthenticated) {
      navigate("/signup");
    } else {
      navigate("/post-task");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-7xl">
      <div className="glass-card glass-nav px-6 py-4">
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
              {isAuthenticated ? (
                <>
                  <span className="text-sm text-muted-foreground">
                    Welcome, {user?.fullName}
                  </span>
                  <Button 
                    onClick={handlePostService}
                    className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-white"
                  >
                    Post a Service
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={handleLogout}
                    className="border-primary/20 hover:bg-primary/10"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                </>
              ) : (
                <>
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
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
