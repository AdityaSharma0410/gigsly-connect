import { Link, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { LogOut, UserCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import logo from "@/assets/logo.png";

const Navbar = () => {
  const navigate = useNavigate();
  const { isAuthenticated, logout, user } = useAuth();
  const { toast } = useToast();

  const ensureClient = () => {
    if (!user || user.role === "ADMIN" || user.role === "CLIENT") {
      return true;
    }
    toast({
      title: "Clients only",
      description: "Switch to a client account to post new tasks.",
      variant: "destructive",
    });
    return false;
  };

  const ensureProfessional = () => {
    if (user?.role === "PROFESSIONAL") {
      return true;
    }
    toast({
      title: "Professionals only",
      description: "Create a professional account to browse and apply for tasks.",
      variant: "destructive",
    });
    return false;
  };

  const handlePostService = () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    if (!ensureClient()) return;
    navigate("/post-task");
  };

  const handleFindWork = () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    if (!ensureProfessional()) return;
    navigate("/find-work");
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-7xl">
      <div className="glass-card glass-nav px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <img src={logo} alt="Gigsly Logo" className="h-10 w-10 transition-transform group-hover:scale-110" />
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
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <UserCircle className="h-4 w-4 text-primary" />
                    <span>{user?.fullName}</span>
                  </div>
                  {user?.role === "CLIENT" && (
                    <Button
                      variant="ghost"
                      onClick={() => navigate("/dashboard/tasks")}
                      className="hover:bg-primary/10"
                    >
                      My Tasks
                    </Button>
                  )}
                  {user?.role === "PROFESSIONAL" && (
                    <Button 
                      onClick={handleFindWork}
                      variant="ghost"
                      className="hover:bg-primary/10"
                    >
                      Find Work
                    </Button>
                  )}
                  {user?.role === "PROFESSIONAL" && (
                    <Button
                      variant="ghost"
                      onClick={() => navigate("/dashboard/proposals")}
                      className="hover:bg-primary/10"
                    >
                      My Proposals
                    </Button>
                  )}
                  {(user?.role === "CLIENT" || user?.role === "ADMIN") && (
                    <Button 
                      onClick={handlePostService}
                      className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-white"
                    >
                      Post a Task
                    </Button>
                  )}
                  {user?.role === "PROFESSIONAL" && (
                    <Button
                      variant="ghost"
                      onClick={() => navigate("/create-profile")}
                      className="hover:bg-primary/10"
                    >
                      Update Profile
                    </Button>
                  )}
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
                    Post a Task
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
