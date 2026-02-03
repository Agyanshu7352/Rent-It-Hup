import { motion } from 'framer-motion';
import { MapPin, Heart, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

interface ItemCardProps {
  item: {
    id: string;
    title: string;
    description?: string;
    price_per_day: number;
    price_per_week?: number;
    price_per_month?: number;
    category_id: string;
    location?: string;
    images: string[];
    availability_status: string;
    condition?: string;
    deposit_amount?: number;
    owner_id: string;
    created_at: string;
    owner?: {
      id: string;
      full_name: string;
      avatar_url?: string;
    };
  };
  index?: number;
}

const ItemCard = ({ item, index = 0 }: ItemCardProps) => {
  const [isFavorite, setIsFavorite] = useState(false);
  
  // Get the first image or use a placeholder
  const imageUrl = item.images?.[0] || '/placeholder-item.jpg';
  
  // Check if item is available
  const isAvailable = item.availability_status === 'available';
  
  // Get owner initials if no avatar
  const getInitials = (name: string) => {
    return name
      ?.split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2) || '??';
  };

  return (
    <Link to={`/item/${item.id}`}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        className="group bg-card rounded-2xl overflow-hidden shadow-card hover:shadow-elevated transition-all duration-300 hover:-translate-y-1"
      >
        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden bg-muted">
          <img
            src={imageUrl}
            alt={item.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = '/placeholder-item.jpg';
            }}
          />
          
          {/* Availability Badge */}
          <div className="absolute top-3 left-3">
            <Badge 
              variant={isAvailable ? "default" : "secondary"}
              className={isAvailable 
                ? "bg-emerald-500 hover:bg-emerald-600" 
                : "bg-muted text-muted-foreground"
              }
            >
              {isAvailable ? 'Available' : 'Not Available'}
            </Badge>
          </div>
          
          {/* Condition Badge */}
          {item.condition && (
            <div className="absolute top-3 right-3">
              <Badge variant="secondary" className="bg-white/90 backdrop-blur-sm text-foreground">
                {item.condition}
              </Badge>
            </div>
          )}
          
          {/* Wishlist Button */}
          <button 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsFavorite(!isFavorite);
            }}
            className="absolute bottom-3 right-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white hover:scale-110"
          >
            <Heart 
              className={`w-5 h-5 transition-colors ${
                isFavorite ? 'fill-rose-500 text-rose-500' : 'text-muted-foreground'
              }`} 
            />
          </button>
          
          {/* Owner Avatar */}
          {item.owner && (
            <div className="absolute bottom-3 left-3 flex items-center gap-2 bg-white/90 backdrop-blur-sm rounded-full pr-3 py-1 pl-1">
              {item.owner.avatar_url ? (
                <img 
                  src={item.owner.avatar_url} 
                  alt={item.owner.full_name}
                  className="w-7 h-7 rounded-full object-cover border-2 border-white"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                  }}
                />
              ) : (
                <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center border-2 border-white">
                  <span className="text-xs font-semibold text-primary">
                    {getInitials(item.owner.full_name)}
                  </span>
                </div>
              )}
              <span className="text-sm font-medium text-foreground line-clamp-1">
                {item.owner.full_name}
              </span>
            </div>
          )}
        </div>
        
        {/* Content */}
        <div className="p-4">
          <h3 className="font-display font-semibold text-foreground mb-2 line-clamp-1 group-hover:text-primary transition-colors">
            {item.title}
          </h3>
          
          {/* Location */}
          {item.location && (
            <div className="flex items-center gap-1 text-sm text-muted-foreground mb-3">
              <MapPin className="w-4 h-4 flex-shrink-0" />
              <span className="line-clamp-1">{item.location}</span>
            </div>
          )}
          
          {/* Description */}
          {item.description && (
            <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
              {item.description}
            </p>
          )}
          
          {/* Price and Action */}
          <div className="flex items-end justify-between gap-2">
            <div>
              <div className="flex items-baseline gap-1">
                <span className="font-display font-bold text-xl text-primary">
                  ₹{item.price_per_day}
                </span>
                <span className="text-sm text-muted-foreground">/day</span>
              </div>
              
              {/* Additional pricing */}
              {(item.price_per_week || item.price_per_month) && (
                <div className="flex gap-2 text-xs text-muted-foreground mt-1">
                  {item.price_per_week && (
                    <span>₹{item.price_per_week}/week</span>
                  )}
                  {item.price_per_month && (
                    <span>₹{item.price_per_month}/month</span>
                  )}
                </div>
              )}
            </div>
            
            <Button 
              size="sm" 
              variant={isAvailable ? "default" : "secondary"}
              disabled={!isAvailable}
              className="rounded-full"
              onClick={(e) => {
                e.preventDefault();
                // Handle booking click
                window.location.href = `/item/${item.id}`;
              }}
            >
              <Calendar className="w-4 h-4 mr-1" />
              {isAvailable ? 'Book' : 'Unavailable'}
            </Button>
          </div>
          
          {/* Deposit info */}
          {item.deposit_amount && item.deposit_amount > 0 && (
            <div className="mt-3 pt-3 border-t border-border">
              <span className="text-xs text-muted-foreground">Deposit: </span>
              <span className="text-xs font-medium text-foreground">₹{item.deposit_amount}</span>
            </div>
          )}
        </div>
      </motion.div>
    </Link>
  );
};

export default ItemCard;