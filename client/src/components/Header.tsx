import { useState, useRef, useEffect } from 'react';
import {
  ShoppingCart,
  Menu,
  X,
  Code2,
  Trophy,
  TrendingUp,
  Upload,
  LayoutDashboard,
  HelpCircle,
  Home,
  User
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import LogoWithRoleToggle from '@/components/LogoWithRoleToggle';
import { useRole } from '@/contexts/RoleContext';

const Header = () => {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const userMenuRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { isSeller, isAdmin, setRole } = useRole();

  const isLoggedIn = !!localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  // Helper to get initials
  const getInitials = (name: string) => {
    if (!name) return 'US';
    const parts = name.trim().split(' ');
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const initials = user?.username ? getInitials(user.username) : 'US';

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/signin');
    window.location.reload();
  };

  const isActivePage = (path: string) => location.pathname === path;

  // Buyer nav items
  const buyerNavItems = [
    { name: 'HOME', path: '/', icon: Home },
    { name: 'MARKETPLACE', path: '/templates', icon: Code2 },
    { name: 'COMPETE', path: '/weekends', icon: Trophy },
    { name: 'CART', path: '/cart', icon: ShoppingCart },
  ];

  // Seller nav items
  const sellerNavItems = [
    { name: 'HOME', path: '/seller', icon: LayoutDashboard },
    { name: 'PROFILE', path: '/seller/profile', icon: User },
    { name: 'UPLOAD', path: '/seller/upload', icon: Upload },
    { name: 'HELP', path: '/seller/help', icon: HelpCircle },
    ...(isAdmin ? [{ name: 'ADMIN', path: '/admin', icon: TrendingUp }] : []),
  ];

  const navItems = isSeller ? sellerNavItems : buyerNavItems;

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 shadow-industrial-sm animate-fade-in">
      <div className="container mx-auto flex items-center justify-between py-2 px-4 lg:px-6 h-20">
        <LogoWithRoleToggle />

        {/* 🧭 Navigation (desktop only) */}
        <nav className="hidden lg:flex items-center space-x-8">
          {navItems.map(({ name, path, icon: Icon }) => (
            <Link
              key={name}
              to={path}
              className={`relative px-4 py-2 text-xs uppercase tracking-[0.2em] font-medium transition-all duration-200 flex items-center gap-2 ${
                isActivePage(path)
                  ? "text-foreground"
                  : "text-foreground-muted hover:text-foreground"
              }`}
            >
              {Icon && <Icon className="w-3.5 h-3.5" />}
              {name}
            </Link>
          ))}
        </nav>

        {/* 🎯 User Actions */}
        <div className="flex items-center space-x-2">
          {/* 📱 Mobile Menu Toggle */}
          <button
            className="lg:hidden p-2 h-9 w-9 rounded-[4px] border border-transparent hover:border-border hover:bg-surface transition-all duration-200"
            onClick={() => setShowMobileMenu((v) => !v)}
            aria-label={showMobileMenu ? 'Close menu' : 'Open menu'}
          >
            {showMobileMenu ? <X className="w-4.5 h-4.5 text-foreground" /> : <Menu className="w-4.5 h-4.5 text-foreground" />}
          </button>

          {/* 🖥️ Desktop Auth */}
          <div className="hidden sm:flex items-center space-x-3">
            {!isLoggedIn ? (
              <Link to="/signin" className="whitespace-nowrap">
                <button className="industrial-button-secondary text-xs uppercase tracking-[0.2em]">
                  SIGN IN
                </button>
              </Link>
            ) : (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setShowUserMenu((prev) => !prev)}
                  className={`w-10 h-10 flex items-center justify-center text-xs uppercase font-semibold transition-all duration-200 rounded-full ${
                    isSeller
                      ? 'text-foreground bg-gradient-to-r from-emerald-500/15 to-green-500/15 border border-emerald-500/30 hover:border-emerald-500/50'
                      : 'text-foreground-muted hover:text-foreground bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20 hover:border-purple-500/40'
                  }`}
                >
                  <span className="inline-block text-center" style={{ lineHeight: '1', letterSpacing: '0.05em' }}>
                    {initials}
                  </span>
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-56 bg-surface border border-border rounded-[4px] shadow-industrial-lg z-50 animate-fade-in">
                    {/* Role Toggle */}
                    <div className="px-4 py-3 border-b border-border/50">
                      <p className="text-xs text-foreground-muted mb-2 uppercase tracking-[0.15em]">Switch Role</p>
                      <div className="flex bg-surface-secondary rounded-[4px] p-1">
                        <button
                          onClick={() => {
                            setRole('buyer');
                            setShowUserMenu(false);
                          }}
                          className={`flex-1 py-1.5 text-xs font-medium uppercase tracking-[0.15em] transition-all duration-200 rounded-[3px] ${
                            !isSeller
                              ? 'bg-foreground text-background'
                              : 'text-foreground-muted hover:text-foreground'
                          }`}
                        >
                          Buyer
                        </button>
                        <button
                          onClick={() => {
                            setRole('seller');
                            setShowUserMenu(false);
                          }}
                          className={`flex-1 py-1.5 text-xs font-medium uppercase tracking-[0.15em] transition-all duration-200 rounded-[3px] ${
                            isSeller
                              ? 'bg-foreground text-background'
                              : 'text-foreground-muted hover:text-foreground'
                          }`}
                        >
                          Seller
                        </button>
                      </div>
                    </div>
                    
                    {/* Downloads */}
                    <Link
                      to="/download"
                      className="block px-4 py-3 text-sm text-foreground-muted hover:bg-surface-secondary hover:text-foreground transition-all duration-150 rounded-[4px] m-1"
                      onClick={() => setShowUserMenu(false)}
                    >
                      Downloads
                    </Link>
                    {/* Admin Panel (only if admin) */}
                    {isAdmin && (
                      <Link
                        to="/admin"
                        className="block px-4 py-3 text-sm text-foreground-muted hover:bg-surface-secondary hover:text-foreground transition-all duration-150 rounded-[4px] m-1"
                        onClick={() => setShowUserMenu(false)}
                      >
                        Admin Panel
                      </Link>
                    )}
                    {/* Logout */}
                    <button
                      onClick={() => {
                        handleLogout();
                        setShowUserMenu(false);
                      }}
                      className="w-full text-left px-4 py-3 text-sm text-destructive hover:bg-destructive/10 transition-all duration-150 rounded-[4px] m-1"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 📱 Mobile Menu */}
      {showMobileMenu && (
        <nav
          className="lg:hidden bg-background-secondary border-t border-border shadow-industrial-lg animate-fade-in"
          role="navigation"
          aria-label="Mobile Navigation"
        >
          <div className="flex flex-col py-4">
            {navItems.map(({ name, path, icon: Icon }) => (
              <Link
                key={name}
                to={path}
                onClick={() => setShowMobileMenu(false)}
                className={`w-full text-left px-6 py-3.5 border-b border-border/50 text-xs uppercase tracking-[0.2em] font-medium transition-colors duration-150 flex items-center gap-3 ${
                  isActivePage(path)
                    ? 'text-foreground bg-surface'
                    : 'text-foreground-muted hover:text-foreground hover:bg-surface'
                }`}
              >
                {Icon && <Icon className="w-4 h-4" />}
                {name}
              </Link>
            ))}

            {/* Role Toggle (if logged in) */}
            {isLoggedIn && (
              <div className="px-6 py-3 border-b border-border/50">
                <p className="text-xs text-foreground-muted mb-2 uppercase tracking-[0.15em]">Switch Role</p>
                <div className="flex bg-surface-secondary rounded-[4px] p-1">
                  <button
                    onClick={() => {
                      setRole('buyer');
                      setShowMobileMenu(false);
                    }}
                    className={`flex-1 py-1.5 text-xs font-medium uppercase tracking-[0.15em] transition-all duration-200 rounded-[3px] ${
                      !isSeller
                        ? 'bg-foreground text-background'
                        : 'text-foreground-muted hover:text-foreground'
                    }`}
                  >
                    Buyer
                  </button>
                  <button
                    onClick={() => {
                      setRole('seller');
                      setShowMobileMenu(false);
                    }}
                    className={`flex-1 py-1.5 text-xs font-medium uppercase tracking-[0.15em] transition-all duration-200 rounded-[3px] ${
                      isSeller
                        ? 'bg-foreground text-background'
                        : 'text-foreground-muted hover:text-foreground'
                    }`}
                  >
                    Seller
                  </button>
                </div>
              </div>
            )}
            
            {/* Auth Controls */}
            <div className="px-4 pt-4 pb-2 space-y-2">
              {!isLoggedIn ? (
                <Link to="/signin" onClick={() => setShowMobileMenu(false)} className="block w-full">
                  <button className="industrial-button-primary w-full text-xs uppercase tracking-[0.15em]">
                    SIGN IN
                  </button>
                </Link>
              ) : (
                <button
                  className="industrial-button-ghost w-full text-xs uppercase tracking-[0.15em] text-destructive"
                  onClick={() => {
                    handleLogout();
                    setShowMobileMenu(false);
                  }}
                >
                  LOGOUT
                </button>
              )}
            </div>
          </div>
        </nav>
      )}
    </header>
  );
};

export default Header;
