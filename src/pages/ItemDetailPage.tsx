import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Heart,
  Share2,
  MapPin,
  Calendar,
  Shield,
  Clock,
  Star,
  ChevronLeft,
  ChevronRight,
  Check,
  X,
  User,
  Mail,
  Phone,
  MessageCircle,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { useMutation } from '@tanstack/react-query';
import { sendMessage } from '@/lib/api/messages';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface Item {
  id: string;
  title: string;
  description: string;
  price_per_day: number;
  price_per_week: number;
  price_per_month: number;
  category_id: string;
  location: string;
  images: string[];
  availability_status: string;
  condition: string;
  deposit_amount: number;
  owner_id: string;
  created_at: string;
  owner?: {
    id: string;
    full_name: string;
    avatar_url?: string;
    bio?: string;
    phone?: string;
    location?: string;
  };
  category?: {
    id: string;
    name: string;
    slug: string;
  };
}

const ItemDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [item, setItem] = useState<Item | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState<'day' | 'week' | 'month'>('day');
  
  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: sendMessage,
    onSuccess: () => {
      toast({
        title: 'Message sent',
        description: 'Redirecting to messages...',
      });
      
      // Navigate to messages page after brief delay
      setTimeout(() => {
        navigate('/messages');
      }, 500);
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to send message',
        variant: 'destructive',
      });
    },
  });
  
  // Fetch item details
  useEffect(() => {
    const fetchItem = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        setError(null);
        
        const { data, error: fetchError } = await supabase
          .from('items')
          .select(`
            *,
            owner:profiles!items_owner_id_fkey(id, full_name, avatar_url, bio, phone, location),
            category:categories(id, name, slug)
          `)
          .eq('id', id)
          .single();
        
        if (fetchError) throw fetchError;
        
        if (!data) {
          setError('Item not found');
          return;
        }
        setItem(data);
      } catch (err: any) {
        console.error('Error fetching item:', err);
        setError(err.message || 'Failed to load item');
      } finally {
        setLoading(false);
      }
    };
    
    fetchItem();
  }, [id]);
  
  // Check if item is favorited
  useEffect(() => {
    const checkFavorite = async () => {
      if (!user || !id) return;
      
      try {
        const { data } = await supabase
          .from('favorites')
          .select('id')
          .eq('user_id', user.id)
          .eq('item_id', id)
          .maybeSingle();
        
        setIsFavorite(!!data);
      } catch (err) {
        // Not favorited or error
        setIsFavorite(false);
      }
    };
    
    checkFavorite();
  }, [user, id]);
  
  const handlePreviousImage = () => {
    if (!item?.images?.length) return;
    setCurrentImageIndex((prev) => 
      prev === 0 ? item.images.length - 1 : prev - 1
    );
  };
  
  const handleNextImage = () => {
    if (!item?.images?.length) return;
    setCurrentImageIndex((prev) => 
      prev === item.images.length - 1 ? 0 : prev + 1
    );
  };
  
  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: item?.title,
          text: item?.description,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast({
          title: 'Link copied',
          description: 'Link copied to clipboard!',
        });
      }
    } catch (err) {
      console.error('Error sharing:', err);
    }
  };
  
  const handleToggleFavorite = async () => {
    if (!user) {
      toast({
        title: 'Authentication required',
        description: 'Please log in to save favorites',
        variant: 'destructive',
      });
      navigate('/auth');
      return;
    }

    if (!item) return;

    try {
      if (isFavorite) {
        // Remove from favorites
        await supabase
          .from('favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('item_id', item.id);
        
        setIsFavorite(false);
        toast({
          title: 'Removed from favorites',
          description: 'Item removed from your favorites',
        });
      } else {
        // Add to favorites
        await supabase
          .from('favorites')
          .insert({
            user_id: user.id,
            item_id: item.id,
          });
        
        setIsFavorite(true);
        toast({
          title: 'Added to favorites',
          description: 'Item saved to your favorites',
        });
      }
    } catch (err: any) {
      console.error('Error toggling favorite:', err);
      toast({
        title: 'Error',
        description: 'Failed to update favorites',
        variant: 'destructive',
      });
    }
  };
  
  const handleBookNow = () => {
    if (!user) {
      toast({
        title: 'Authentication required',
        description: 'Please log in to book items',
        variant: 'destructive',
      });
      navigate('/auth');
      return;
    }

    // Navigate to booking page or open booking modal
    toast({
      title: 'Coming soon',
      description: 'Booking feature coming soon!',
    });
  };
  
  const handleContactOwner = () => {
    // Check if user is logged in
    if (!user) {
      toast({
        title: 'Authentication required',
        description: 'Please log in to send messages',
        variant: 'destructive',
      });
      navigate('/auth');
      return;
    }

    // Check if item and owner exist
    if (!item || !item.owner_id) {
      toast({
        title: 'Error',
        description: 'Owner information not available',
        variant: 'destructive',
      });
      return;
    }

    // Prevent messaging yourself
    if (item.owner_id === user.id) {
      toast({
        title: 'Cannot message yourself',
        description: 'This is your own item',
        variant: 'destructive',
      });
      return;
    }

    // Navigate to messages page with owner and item info
    navigate(`/messages?owner=${item.owner_id}&item=${item.id}`);
  };
  
  const getCurrentPrice = () => {
    if (!item) return 0;
    switch (selectedPeriod) {
      case 'week':
        return item.price_per_week || item.price_per_day * 7;
      case 'month':
        return item.price_per_month || item.price_per_day * 30;
      default:
        return item.price_per_day;
    }
  };
  
  const getInitials = (name: string) => {
    return name
      ?.split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2) || '??';
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading item details...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
  
  if (error || !item) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-16 text-center">
          <AlertCircle className="w-16 h-16 text-destructive mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-foreground mb-2">Item Not Found</h1>
          <p className="text-muted-foreground mb-6">{error || 'The item you\'re looking for doesn\'t exist.'}</p>
          <Button onClick={() => navigate(-1)}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
        </div>
        <Footer />
      </div>
    );
  }
  
  const images = item.images?.length > 0 ? item.images : ['/placeholder-item.jpg'];
  const isAvailable = item.availability_status === 'available';
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-20 pb-16">
        <div className="container mx-auto px-4">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
            <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
            <ChevronRight className="w-4 h-4" />
            {item.category && (
              <>
                <Link 
                  to={`/category/${item.category.slug}`}
                  className="hover:text-foreground transition-colors"
                >
                  {item.category.name}
                </Link>
                <ChevronRight className="w-4 h-4" />
              </>
            )}
            <span className="text-foreground">{item.title}</span>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-8 mb-12">
            {/* Left Column - Images */}
            <div>
              {/* Main Image */}
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-muted mb-4">
                <img
                  src={images[currentImageIndex]}
                  alt={item.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/placeholder-item.jpg';
                  }}
                />
                
                {/* Image Navigation */}
                {images.length > 1 && (
                  <>
                    <button
                      onClick={handlePreviousImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-colors"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                      onClick={handleNextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-colors"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>
                    
                    {/* Image Counter */}
                    <div className="absolute bottom-4 right-4 px-3 py-1 rounded-full bg-black/60 text-white text-sm">
                      {currentImageIndex + 1} / {images.length}
                    </div>
                  </>
                )}
                
                {/* Favorite & Share Buttons */}
                <div className="absolute top-4 right-4 flex gap-2">
                  <button
                    onClick={handleToggleFavorite}
                    className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-colors"
                  >
                    <Heart className={`w-5 h-5 ${isFavorite ? 'fill-rose-500 text-rose-500' : 'text-foreground'}`} />
                  </button>
                  <button
                    onClick={handleShare}
                    className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-colors"
                  >
                    <Share2 className="w-5 h-5 text-foreground" />
                  </button>
                </div>
              </div>
              
              {/* Thumbnail Images */}
              {images.length > 1 && (
                <div className="grid grid-cols-5 gap-2">
                  {images.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                        index === currentImageIndex
                          ? 'border-primary shadow-md'
                          : 'border-transparent hover:border-muted-foreground'
                      }`}
                    >
                      <img
                        src={img}
                        alt={`${item.title} ${index + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = '/placeholder-item.jpg';
                        }}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            {/* Right Column - Details */}
            <div>
              {/* Title and Availability */}
              <div className="mb-4">
                <div className="flex items-start justify-between gap-4 mb-2">
                  <h1 className="text-3xl font-display font-bold text-foreground">
                    {item.title}
                  </h1>
                  <Badge 
                    variant={isAvailable ? "default" : "secondary"}
                    className={isAvailable ? "bg-emerald-500" : ""}
                  >
                    {isAvailable ? 'Available' : 'Not Available'}
                  </Badge>
                </div>
                
                {/* Location */}
                {item.location && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    <span>{item.location}</span>
                  </div>
                )}
              </div>
              
              <Separator className="my-6" />
              
              {/* Pricing Section */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-muted-foreground mb-3">Rental Pricing</h3>
                <div className="grid grid-cols-3 gap-3 mb-4">
                  <button
                    onClick={() => setSelectedPeriod('day')}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      selectedPeriod === 'day'
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-muted-foreground'
                    }`}
                  >
                    <div className="text-sm text-muted-foreground">Per Day</div>
                    <div className="text-lg font-bold text-foreground">₹{item.price_per_day}</div>
                  </button>
                  
                  {item.price_per_week && (
                    <button
                      onClick={() => setSelectedPeriod('week')}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        selectedPeriod === 'week'
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-muted-foreground'
                      }`}
                    >
                      <div className="text-sm text-muted-foreground">Per Week</div>
                      <div className="text-lg font-bold text-foreground">₹{item.price_per_week}</div>
                    </button>
                  )}
                  
                  {item.price_per_month && (
                    <button
                      onClick={() => setSelectedPeriod('month')}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        selectedPeriod === 'month'
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-muted-foreground'
                      }`}
                    >
                      <div className="text-sm text-muted-foreground">Per Month</div>
                      <div className="text-lg font-bold text-foreground">₹{item.price_per_month}</div>
                    </button>
                  )}
                </div>
                
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-3xl font-display font-bold text-primary">
                    ₹{getCurrentPrice()}
                  </span>
                  <span className="text-muted-foreground">/ {selectedPeriod}</span>
                </div>
                
                {item.deposit_amount > 0 && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Shield className="w-4 h-4" />
                    <span>Security Deposit: ₹{item.deposit_amount}</span>
                  </div>
                )}
              </div>
              
              <Separator className="my-6" />
              
              {/* Key Features */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Condition</div>
                    <div className="font-medium text-foreground capitalize">{item.condition || 'Good'}</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Available</div>
                    <div className="font-medium text-foreground">
                      {isAvailable ? 'Right Now' : 'Not Available'}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex gap-3 mb-6">
                <Button 
                  size="lg" 
                  className="flex-1"
                  disabled={!isAvailable}
                  onClick={handleBookNow}
                  variant="hero"
                >
                  <Calendar className="w-5 h-5 mr-2" />
                  Book Now
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  onClick={handleContactOwner}
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Contact
                </Button>
              </div>
              
              {/* Owner Info Card */}
              {item.owner && (
                <Card>
                  <CardContent className="p-4">
                    <h3 className="text-sm font-medium text-muted-foreground mb-3">Listed By</h3>
                    <div className="flex items-center gap-3 mb-3">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={item.owner.avatar_url} />
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {getInitials(item.owner.full_name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h4 className="font-semibold text-foreground">{item.owner.full_name}</h4>
                        {item.owner.location && (
                          <p className="text-sm text-muted-foreground">{item.owner.location}</p>
                        )}
                      </div>
                    </div>
                    {item.owner.bio && (
                      <p className="text-sm text-muted-foreground mb-3">{item.owner.bio}</p>
                    )}
                    <Button variant="outline" size="sm" className="w-full" onClick={handleContactOwner}>
                      <Mail className="w-4 h-4 mr-2" />
                      Send Message
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
          
          {/* Tabs Section */}
          <Tabs defaultValue="description" className="mb-12">
            <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="terms">Rental Terms</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>
            
            <TabsContent value="description" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-foreground mb-4">About this item</h3>
                  <div className="prose prose-sm max-w-none">
                    <p className="text-muted-foreground whitespace-pre-wrap">
                      {item.description || 'No description available.'}
                    </p>
                  </div>
                  
                  {/* Specifications */}
                  <div className="mt-6 grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-2">Item Details</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Condition:</span>
                          <span className="font-medium capitalize">{item.condition || 'Good'}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Location:</span>
                          <span className="font-medium">{item.location}</span>
                        </div>
                        {item.category && (
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Category:</span>
                            <span className="font-medium">{item.category.name}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-2">Pricing</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Daily Rate:</span>
                          <span className="font-medium">₹{item.price_per_day}</span>
                        </div>
                        {item.price_per_week && (
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Weekly Rate:</span>
                            <span className="font-medium">₹{item.price_per_week}</span>
                          </div>
                        )}
                        {item.price_per_month && (
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Monthly Rate:</span>
                            <span className="font-medium">₹{item.price_per_month}</span>
                          </div>
                        )}
                        {item.deposit_amount > 0 && (
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Deposit:</span>
                            <span className="font-medium">₹{item.deposit_amount}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="terms" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-foreground mb-4">Rental Terms & Conditions</h3>
                  <div className="space-y-4">
                    <div className="flex gap-3">
                      <Check className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-foreground mb-1">Security Deposit</h4>
                        <p className="text-sm text-muted-foreground">
                          A refundable security deposit of ₹{item.deposit_amount || 0} is required before rental.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex gap-3">
                      <Check className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-foreground mb-1">Condition Check</h4>
                        <p className="text-sm text-muted-foreground">
                          Item will be inspected before and after rental. Any damage will be deducted from deposit.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex gap-3">
                      <Check className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-foreground mb-1">Pickup & Return</h4>
                        <p className="text-sm text-muted-foreground">
                          Item must be picked up and returned at agreed location and time.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex gap-3">
                      <Check className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-foreground mb-1">Cancellation Policy</h4>
                        <p className="text-sm text-muted-foreground">
                          Free cancellation up to 24 hours before pickup. Late cancellations may incur fees.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="reviews" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-foreground mb-4">Customer Reviews</h3>
                  <div className="text-center py-12">
                    <Star className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                    <p className="text-muted-foreground">No reviews yet</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Be the first to rent and review this item!
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
          
          {/* Similar Items Section - Placeholder */}
          <div>
            <h2 className="text-2xl font-display font-bold text-foreground mb-6">Similar Items</h2>
            <div className="text-center py-12 bg-muted/30 rounded-2xl">
              <p className="text-muted-foreground">Similar items will appear here</p>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ItemDetailPage;