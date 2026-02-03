import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Heart, Trash2, MapPin, Star, ShoppingBag } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { getMyFavorites, removeFavorite } from '@/lib/api/favorites';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

const Favorites = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: favorites, isLoading } = useQuery({
    queryKey: ['myFavorites'],
    queryFn: getMyFavorites,
    enabled: !!user,
  });

  const removeMutation = useMutation({
    mutationFn: removeFavorite,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myFavorites'] });
      toast({
        title: 'Removed from favorites',
        description: 'Item has been removed from your favorites.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  if (!user) {
    navigate('/auth');
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-xl bg-rose-500/10 flex items-center justify-center">
                <Heart className="w-6 h-6 text-rose-500" />
              </div>
              <div>
                <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground">
                  My Favorites
                </h1>
                <p className="text-muted-foreground">
                  {favorites?.length || 0} items saved
                </p>
              </div>
            </div>
          </motion.div>

          {/* Content */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map(i => (
                <Skeleton key={i} className="h-80 w-full rounded-2xl" />
              ))}
            </div>
          ) : favorites && favorites.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {favorites.map((favorite, index) => (
                <motion.div
                  key={favorite.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                    {/* Image */}
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <img
                        src={favorite.item?.images?.[0] || '/placeholder.svg'}
                        alt={favorite.item?.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      
                      {/* Remove Button */}
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <button className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-white hover:scale-110 transition-all">
                            <Heart className="w-5 h-5 fill-rose-500 text-rose-500" />
                          </button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Remove from favorites?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This will remove "{favorite.item?.title}" from your favorites list.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => removeMutation.mutate(favorite.item_id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Remove
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>

                      {/* Owner Avatar */}
                      {favorite.item?.owner && (
                        <div className="absolute bottom-3 left-3 flex items-center gap-2 bg-white/90 backdrop-blur-sm rounded-full pr-3 py-1 pl-1">
                          <img 
                            src={favorite.item.owner.avatar_url || '/placeholder.svg'} 
                            alt={favorite.item.owner.full_name || 'Owner'}
                            className="w-7 h-7 rounded-full object-cover border-2 border-white"
                          />
                          <span className="text-sm font-medium text-foreground">
                            {favorite.item.owner.full_name || 'Owner'}
                          </span>
                        </div>
                      )}
                    </div>
                    
                    {/* Content */}
                    <CardContent className="p-4">
                      <h3 className="font-display font-semibold text-foreground mb-2 line-clamp-1 group-hover:text-primary transition-colors">
                        {favorite.item?.title}
                      </h3>
                      
                      {favorite.item?.location && (
                        <div className="flex items-center gap-1 text-sm text-muted-foreground mb-3">
                          <MapPin className="w-4 h-4" />
                          <span className="line-clamp-1">{favorite.item.location}</span>
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between">
                        {favorite.item?.owner?.trust_score && (
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                            <span className="font-medium text-foreground">
                              {favorite.item.owner.trust_score}
                            </span>
                          </div>
                        )}
                        
                        <div className="text-right">
                          <span className="font-display font-bold text-lg text-primary">
                            ₹{favorite.item?.price_per_day}
                          </span>
                          <span className="text-sm text-muted-foreground">/day</span>
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t border-border">
                        <Button className="w-full gap-2">
                          <ShoppingBag className="w-4 h-4" />
                          Rent Now
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="max-w-md mx-auto">
                <CardContent className="p-12 text-center">
                  <div className="w-16 h-16 mx-auto rounded-full bg-rose-500/10 flex items-center justify-center mb-6">
                    <Heart className="w-8 h-8 text-rose-500" />
                  </div>
                  <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                    No favorites yet
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Browse items and click the heart icon to save them here
                  </p>
                  <Button onClick={() => navigate('/')} className="gap-2">
                    Browse Items
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Favorites;
