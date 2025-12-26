import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, Phone, Heart, User, LogOut, Stethoscope, Pill, Shield, LayoutDashboard, ShoppingCart, Package, ChevronDown, Hospital, Cross, BookOpen, Users, CalendarCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";
import { supabase } from "@/integrations/supabase/client";
import { useTranslation } from "react-i18next";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

const mainNavLinks = [
  { nameKey: "common.hospitals", path: "/hospitals", icon: Hospital },
  { nameKey: "common.medicines", path: "/medicines", icon: Pill },
  { nameKey: "common.appointments", path: "/appointments", icon: CalendarCheck },
  { nameKey: "common.firstAid", path: "/first-aid", icon: Cross },
];

const moreLinks = [
  { nameKey: "common.pharmacies", path: "/pharmacies", icon: Pill },
  { nameKey: "contacts.title", path: "/contacts", icon: Phone },
  { nameKey: "common.prescription", path: "/prescription", icon: BookOpen },
  { nameKey: "common.doctors", path: "/doctors", icon: Stethoscope },
  { nameKey: "common.bloodBanks", path: "/blood-banks", icon: Cross },
];

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { totalItems } = useCart();
  const { t } = useTranslation();

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

  const isMoreActive = moreLinks.some(link => location.pathname === link.path);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-card/95 backdrop-blur-lg">
      <div className="container flex h-14 items-center justify-between gap-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 flex-shrink-0">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-primary">
            <Heart className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="text-lg font-bold text-foreground hidden sm:block">
            Jeevan<span className="text-primary">Raksha</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1 flex-1 justify-center">
          <Link
            to="/"
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              location.pathname === "/"
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:text-foreground hover:bg-accent"
            }`}
          >
            {t('common.home')}
          </Link>
          {mainNavLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                location.pathname === link.path
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
              }`}
            >
              {t(link.nameKey)}
            </Link>
          ))}
          
          {/* More Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button 
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors inline-flex items-center gap-1 ${
                  isMoreActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                }`}
              >
                {t('common.more')}
                <ChevronDown className="h-3 w-3" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center" className="bg-card border-border w-48">
              {moreLinks.map((link) => (
                <DropdownMenuItem 
                  key={link.path} 
                  onClick={() => navigate(link.path)}
                  className={location.pathname === link.path ? "bg-primary/10 text-primary" : ""}
                >
                  <link.icon className="h-4 w-4 mr-2" />
                  {t(link.nameKey)}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>

        {/* Right Section */}
        <div className="hidden lg:flex items-center gap-1">
          {/* Language Switcher */}
          <LanguageSwitcher />
          
          {/* Cart */}
          <Button 
            variant="ghost" 
            size="icon"
            className="relative"
            onClick={() => navigate("/cart")}
          >
            <ShoppingCart className="h-5 w-5" />
            {totalItems > 0 && (
              <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                {totalItems}
              </Badge>
            )}
          </Button>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-card border-border w-56">
              {user ? (
                <>
                  <DropdownMenuLabel className="font-normal">
                    <p className="text-sm font-medium">Account</p>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate("/profile")}>
                    <User className="h-4 w-4 mr-2" />
                    My Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/orders")}>
                    <Package className="h-4 w-4 mr-2" />
                    My Orders
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuLabel className="font-normal">
                    <p className="text-xs text-muted-foreground">For Professionals</p>
                  </DropdownMenuLabel>
                  <DropdownMenuItem onClick={() => navigate("/doctor-auth")}>
                    <Stethoscope className="h-4 w-4 mr-2" />
                    Doctor Portal
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/pharmacist-auth")}>
                    <Pill className="h-4 w-4 mr-2" />
                    Pharmacist Portal
                  </DropdownMenuItem>
                  {isAdmin && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuLabel className="font-normal">
                        <p className="text-xs text-muted-foreground">Admin</p>
                      </DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => navigate("/admin")}>
                        <LayoutDashboard className="h-4 w-4 mr-2" />
                        Dashboard
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate("/admin/orders")}>
                        <Package className="h-4 w-4 mr-2" />
                        Manage Orders
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
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="text-destructive focus:text-destructive">
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </>
              ) : (
                <>
                  <DropdownMenuItem onClick={() => navigate("/auth")}>
                    <User className="h-4 w-4 mr-2" />
                    Sign In / Sign Up
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuLabel className="font-normal">
                    <p className="text-xs text-muted-foreground">For Professionals</p>
                  </DropdownMenuLabel>
                  <DropdownMenuItem onClick={() => navigate("/doctor-auth")}>
                    <Stethoscope className="h-4 w-4 mr-2" />
                    Doctor Portal
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/pharmacist-auth")}>
                    <Pill className="h-4 w-4 mr-2" />
                    Pharmacist Portal
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Emergency Button */}
          <Button variant="destructive" size="sm" className="gap-1.5 ml-1">
            <Phone className="h-4 w-4" />
            <span className="hidden xl:inline">108</span>
          </Button>
        </div>

        {/* Mobile: Language + Cart + Menu */}
        <div className="flex lg:hidden items-center gap-1">
          <LanguageSwitcher />
          <Button 
            variant="ghost" 
            size="icon"
            className="relative"
            onClick={() => navigate("/cart")}
          >
            <ShoppingCart className="h-5 w-5" />
            {totalItems > 0 && (
              <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                {totalItems}
              </Badge>
            )}
          </Button>
          <button
            className="p-2 rounded-lg hover:bg-accent"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="lg:hidden border-t border-border bg-card max-h-[80vh] overflow-y-auto">
          <nav className="container py-3 flex flex-col gap-1">
            <Link
              to="/"
              onClick={() => setIsMenuOpen(false)}
              className={`px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                location.pathname === "/"
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
              }`}
            >
              {t('common.home')}
            </Link>
            {mainNavLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsMenuOpen(false)}
                className={`px-3 py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                  location.pathname === link.path
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                }`}
              >
                <link.icon className="h-4 w-4" />
                {t(link.nameKey)}
              </Link>
            ))}
            
            <div className="border-t border-border my-2 pt-2">
              <p className="px-3 py-1 text-xs font-medium text-muted-foreground">{t('common.more')}</p>
              {moreLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`px-3 py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                    location.pathname === link.path
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent"
                  }`}
                >
                  <link.icon className="h-4 w-4" />
                  {t(link.nameKey)}
                </Link>
              ))}
            </div>

            <div className="border-t border-border my-2 pt-2">
              <p className="px-3 py-1 text-xs font-medium text-muted-foreground">{t('header.forProfessionals')}</p>
              <Link
                to="/doctor-auth"
                onClick={() => setIsMenuOpen(false)}
                className="px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent flex items-center gap-2"
              >
                <Stethoscope className="h-4 w-4" />
                {t('header.doctorPortal')}
              </Link>
              <Link
                to="/pharmacist-auth"
                onClick={() => setIsMenuOpen(false)}
                className="px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent flex items-center gap-2"
              >
                <Pill className="h-4 w-4" />
                {t('header.pharmacistPortal')}
              </Link>
            </div>

            {isAdmin && (
              <div className="border-t border-border my-2 pt-2">
                <p className="px-3 py-1 text-xs font-medium text-muted-foreground">{t('header.adminPanel')}</p>
                <Link
                  to="/admin"
                  onClick={() => setIsMenuOpen(false)}
                  className="px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent flex items-center gap-2"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  {t('header.dashboard')}
                </Link>
                <Link
                  to="/admin/orders"
                  onClick={() => setIsMenuOpen(false)}
                  className="px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent flex items-center gap-2"
                >
                  <Package className="h-4 w-4" />
                  {t('header.manageOrders')}
                </Link>
              </div>
            )}

            <div className="border-t border-border my-2 pt-2 space-y-2">
              {user ? (
                <>
                  <Link
                    to="/profile"
                    onClick={() => setIsMenuOpen(false)}
                    className="px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent flex items-center gap-2"
                  >
                    <User className="h-4 w-4" />
                    {t('common.profile')}
                  </Link>
                  <Link
                    to="/orders"
                    onClick={() => setIsMenuOpen(false)}
                    className="px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent flex items-center gap-2"
                  >
                    <Package className="h-4 w-4" />
                    {t('common.orders')}
                  </Link>
                  <Button variant="outline" onClick={handleSignOut} className="w-full gap-2">
                    <LogOut className="h-4 w-4" />
                    {t('common.signOut')}
                  </Button>
                </>
              ) : (
                <Button variant="default" onClick={() => { navigate("/auth"); setIsMenuOpen(false); }} className="w-full gap-2">
                  <User className="h-4 w-4" />
                  {t('common.signIn')}
                </Button>
              )}
              <Button variant="destructive" className="w-full gap-2">
                <Phone className="h-4 w-4" />
                {t('header.emergencyHelp')}: 108
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
