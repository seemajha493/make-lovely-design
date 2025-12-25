import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, Phone, Heart, User, LogOut, Stethoscope, Pill, Briefcase, Shield, LayoutDashboard, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";
import { supabase } from "@/integrations/supabase/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

const navLinks = [
  { name: "Home", path: "/" },
  { name: "Hospitals", path: "/hospitals" },
  { name: "Medicines", path: "/medicines" },
  { name: "Pharmacies", path: "/pharmacies" },
  { name: "First Aid", path: "/first-aid" },
  { name: "Emergency Contacts", path: "/contacts" },
];

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { totalItems } = useCart();

  useEffect(() => {
    const checkAdminRole = async () => {
      if (!user) {
        setIsAdmin(false);
        return;
      }
      const { data } = await supabase.rpc('has_role', { _user_id: user.id, _role: 'admin' });
      setIsAdmin(!!data);
    };
    checkAdminRole();
  }, [user]);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-card/80 backdrop-blur-lg">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg gradient-primary">
            <Heart className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-lg font-bold text-foreground">
            Emergency<span className="text-primary">Help</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                location.pathname === link.path
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
              }`}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            className="gap-2 relative"
            onClick={() => navigate("/cart")}
          >
            <ShoppingCart className="h-4 w-4" />
            Cart
            {totalItems > 0 && (
              <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                {totalItems}
              </Badge>
            )}
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <Briefcase className="h-4 w-4" />
                Medical Professionals
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-popover">
              <DropdownMenuItem onClick={() => navigate("/doctor-auth")}>
                <Stethoscope className="h-4 w-4 mr-2" />
                For Doctors
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate("/pharmacist-auth")}>
                <Pill className="h-4 w-4 mr-2" />
                For Pharmacists
              </DropdownMenuItem>
              {isAdmin && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate("/admin")}>
                    <LayoutDashboard className="h-4 w-4 mr-2" />
                    Admin Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/admin/doctors")}>
                    <Shield className="h-4 w-4 mr-2" />
                    Verify Doctors
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/admin/pharmacists")}>
                    <Shield className="h-4 w-4 mr-2" />
                    Verify Pharmacists
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <User className="h-4 w-4" />
                  Profile
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => navigate("/profile")}>
                  <User className="h-4 w-4 mr-2" />
                  My Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/orders")}>
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  My Orders
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button variant="outline" size="sm" onClick={() => navigate("/auth")} className="gap-2">
              <User className="h-4 w-4" />
              Sign In
            </Button>
          )}
          <Button variant="emergency" size="sm" className="gap-2">
            <Phone className="h-4 w-4" />
            Call 108
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 rounded-lg hover:bg-accent"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-border bg-card">
          <nav className="container py-4 flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsMenuOpen(false)}
                className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  location.pathname === link.path
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                }`}
              >
                {link.name}
              </Link>
            ))}
            
            {/* Medical Professionals Section */}
            <div className="border-t border-border pt-2 mt-2">
              <p className="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Medical Professionals
              </p>
              <Link
                to="/doctor-auth"
                onClick={() => setIsMenuOpen(false)}
                className="px-4 py-3 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent flex items-center gap-2"
              >
                <Stethoscope className="h-4 w-4" />
                For Doctors
              </Link>
              <Link
                to="/pharmacist-auth"
                onClick={() => setIsMenuOpen(false)}
                className="px-4 py-3 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent flex items-center gap-2"
              >
                <Pill className="h-4 w-4" />
                For Pharmacists
              </Link>
            </div>

            {/* Admin Section */}
            {isAdmin && (
              <div className="border-t border-border pt-2 mt-2">
                <p className="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Admin Panel
                </p>
                <Link
                  to="/admin"
                  onClick={() => setIsMenuOpen(false)}
                  className="px-4 py-3 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent flex items-center gap-2"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  Admin Dashboard
                </Link>
                <Link
                  to="/admin/doctors"
                  onClick={() => setIsMenuOpen(false)}
                  className="px-4 py-3 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent flex items-center gap-2"
                >
                  <Shield className="h-4 w-4" />
                  Verify Doctors
                </Link>
                <Link
                  to="/admin/pharmacists"
                  onClick={() => setIsMenuOpen(false)}
                  className="px-4 py-3 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent flex items-center gap-2"
                >
                  <Shield className="h-4 w-4" />
                  Verify Pharmacists
                </Link>
              </div>
            )}

            {/* User Section */}
            <div className="border-t border-border pt-2 mt-2">
              {user ? (
                <>
                  <Link
                    to="/profile"
                    onClick={() => setIsMenuOpen(false)}
                    className="px-4 py-3 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent flex items-center gap-2"
                  >
                    <User className="h-4 w-4" />
                    My Profile
                  </Link>
                  <Button variant="outline" onClick={handleSignOut} className="w-full mt-2 gap-2">
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </Button>
                </>
              ) : (
                <Button variant="outline" onClick={() => { navigate("/auth"); setIsMenuOpen(false); }} className="w-full mt-2 gap-2">
                  <User className="h-4 w-4" />
                  Sign In
                </Button>
              )}
            </div>

            <Button variant="emergency" className="mt-2 gap-2">
              <Phone className="h-4 w-4" />
              Call 108
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
}
