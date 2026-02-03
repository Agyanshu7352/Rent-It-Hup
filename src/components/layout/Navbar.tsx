import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, Package, Search, User, LogOut, LayoutDashboard, Heart, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import SearchDialog from '@/components/SearchDialog';
import { supabase } from '@/integrations/supabase/client';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const navLinks = [
  { href: '#categories', label: 'Categories' },
  { href: '#how-it-works', label: 'How It Works' },
  { href: '#trust', label: 'Trust & Safety' },
  { href: '#about', label: 'About' },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const { user, signOut, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Fetch unread message count with real-time updates
  useEffect(() => {
    if (!user) {
      setUnreadCount(0);
      return;
    }
    
    const fetchUnread = async () => {
      const { count } = await supabase
        .from('messages')
        .select('*', { count: 'exact', head: true })
        .eq('receiver_id', user.id)
        .eq('is_read', false);
      
      setUnreadCount(count || 0);
    };
    
    fetchUnread();

    // Real-time subscription for instant updates
    const channel = supabase
      .channel('unread-messages-navbar')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'messages',
          filter: `receiver_id=eq.${user.id}`,
        },
        () => {
          fetchUnread();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (location.pathname !== '/') {
      e.preventDefault();
      navigate('/' + href);
    }
    setIsOpen(false);
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group">
              <img
                src="/rent-it-hub_logo.png"
                alt="Rent-It-Hub Logo"
                className="h-33 w-auto object-contain transition-transform duration-200 group-hover:scale-110"
              />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className="text-muted-foreground hover:text-foreground transition-colors font-medium text-sm relative group"
                >
                  {link.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
                </a>
              ))}
            </div>

            {/* Desktop CTA */}
            <div className="hidden md:flex items-center gap-3">
              <Button 
                variant="ghost" 
                size="icon" 
                className="rounded-full"
                onClick={() => setSearchOpen(true)}
              >
                <Search className="w-5 h-5" />
              </Button>
              
              {!loading && (
                <>
                  {user ? (
                    <>
                      <Button variant="ghost" size="icon" className="rounded-full" asChild>
                        <Link to="/favorites">
                          <Heart className="w-5 h-5" />
                        </Link>
                      </Button>
                      
                      {/* Messages with Badge */}
                      <Button variant="ghost" size="icon" className="rounded-full relative" asChild>
                        <Link to="/messages">
                          <MessageSquare className="w-5 h-5" />
                          {unreadCount > 0 && (
                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 min-w-[20px] flex items-center justify-center px-1 shadow-lg">
                              {unreadCount > 99 ? '99+' : unreadCount}
                            </span>
                          )}
                        </Link>
                      </Button>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" className="rounded-full">
                            <User className="w-4 h-4 mr-2" />
                            Account
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuItem asChild>
                            <Link to="/dashboard" className="cursor-pointer">
                              <LayoutDashboard className="w-4 h-4 mr-2" />
                              Dashboard
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link to="/profile" className="cursor-pointer">
                              <User className="w-4 h-4 mr-2" />
                              Profile
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link to="/favorites" className="cursor-pointer">
                              <Heart className="w-4 h-4 mr-2" />
                              Favorites
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-destructive">
                            <LogOut className="w-4 h-4 mr-2" />
                            Sign Out
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                      <Button variant="hero" className="rounded-full" asChild>
                        <Link to="/list-item">List Your Item</Link>
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button variant="outline" className="rounded-full" asChild>
                        <Link to="/auth">
                          <User className="w-4 h-4 mr-2" />
                          Sign In
                        </Link>
                      </Button>
                      <Button variant="hero" className="rounded-full" asChild>
                        <Link to="/auth">List Your Item</Link>
                      </Button>
                    </>
                  )}
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="icon" 
                className="rounded-full"
                onClick={() => setSearchOpen(true)}
              >
                <Search className="w-5 h-5" />
              </Button>
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 rounded-lg hover:bg-muted transition-colors"
              >
                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-background border-b border-border"
            >
              <div className="container mx-auto px-4 py-4 space-y-4">
                {navLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    className="block py-2 text-muted-foreground hover:text-foreground transition-colors font-medium"
                    onClick={(e) => handleNavClick(e, link.href)}
                  >
                    {link.label}
                  </a>
                ))}
                <div className="pt-4 border-t border-border space-y-3">
                  {user ? (
                    <>
                      <Link
                        to="/dashboard"
                        className="flex items-center gap-2 py-2 text-muted-foreground hover:text-foreground"
                        onClick={() => setIsOpen(false)}
                      >
                        <LayoutDashboard className="w-4 h-4" />
                        Dashboard
                      </Link>
                      <Link
                        to="/profile"
                        className="flex items-center gap-2 py-2 text-muted-foreground hover:text-foreground"
                        onClick={() => setIsOpen(false)}
                      >
                        <User className="w-4 h-4" />
                        Profile
                      </Link>
                      
                      {/* Mobile Messages with Badge */}
                      <Link
                        to="/messages"
                        className="flex items-center gap-2 py-2 text-muted-foreground hover:text-foreground relative"
                        onClick={() => setIsOpen(false)}
                      >
                        <MessageSquare className="w-4 h-4" />
                        Messages
                        {unreadCount > 0 && (
                          <span className="ml-auto bg-red-500 text-white text-xs font-bold rounded-full h-5 min-w-[20px] flex items-center justify-center px-1.5">
                            {unreadCount > 99 ? '99+' : unreadCount}
                          </span>
                        )}
                      </Link>

                      <Button
                        variant="outline"
                        className="w-full rounded-full"
                        onClick={() => {
                          handleSignOut();
                          setIsOpen(false);
                        }}
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        Sign Out
                      </Button>
                      <Button variant="hero" className="w-full rounded-full" asChild>
                        <Link to="/list-item" onClick={() => setIsOpen(false)}>
                          List Your Item
                        </Link>
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button variant="outline" className="w-full rounded-full" asChild>
                        <Link to="/auth" onClick={() => setIsOpen(false)}>
                          <User className="w-4 h-4 mr-2" />
                          Sign In
                        </Link>
                      </Button>
                      <Button variant="hero" className="w-full rounded-full" asChild>
                        <Link to="/auth" onClick={() => setIsOpen(false)}>
                          List Your Item
                        </Link>
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
    </>
  );
};

export default Navbar;