import { motion } from 'framer-motion';
import { MapPin, Star, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';


const items = [
  {
    id: 1,
    title: 'Professional DSLR Camera Kit',
    category: 'Electronics',
    price: 500,
    location: 'Koramangala, Bangalore',
    rating: 4.9,
    reviews: 47,
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&h=300&fit=crop',
    owner: { name: 'Rahul S.', avatar: 'https://i.pravatar.cc/40?img=1' },
  },
  {
    id: 2,
    title: 'Camping Tent (4-Person)',
    category: 'Camping Gear',
    price: 300,
    location: 'HSR Layout, Bangalore',
    rating: 4.8,
    reviews: 32,
    image: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=400&h=300&fit=crop',
    owner: { name: 'Priya K.', avatar: 'https://i.pravatar.cc/40?img=2' },
  },
  {
    id: 3,
    title: 'Power Drill & Tool Set',
    category: 'Tools',
    price: 150,
    location: 'Indiranagar, Bangalore',
    rating: 4.7,
    reviews: 89,
    image: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=400&h=300&fit=crop',
    owner: { name: 'Amit V.', avatar: 'https://i.pravatar.cc/40?img=3' },
  },
  {
    id: 4,
    title: 'PlayStation 5 Console',
    category: 'Gaming',
    price: 400,
    location: 'Whitefield, Bangalore',
    rating: 4.9,
    reviews: 156,
    image: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400&h=300&fit=crop',
    owner: { name: 'Karan M.', avatar: 'https://i.pravatar.cc/40?img=4' },
  },
];

const FeaturedItems = () => {
  return (
    <section className="py-24">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-12"
        >
          <div>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
              Featured <span className="gradient-text">Listings</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-xl">
              Popular items available for rent in your area right now
            </p>
          </div>
          <Button variant="outline" className="mt-4 md:mt-0 rounded-full">
            View All Listings
          </Button>
        </motion.div>

        {/* Items Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group bg-card rounded-2xl overflow-hidden shadow-card hover:shadow-elevated transition-all duration-300 hover:-translate-y-1"
            >
              {/* Image */}
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Wishlist Button */}
                <button className="absolute top-3 right-3 w-8 h-8 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-background">
                  <Heart className="w-4 h-4 text-foreground" />
                </button>
                
                {/* Category Badge */}
                <span className="absolute bottom-3 left-3 px-3 py-1 rounded-full bg-background/80 backdrop-blur-sm text-xs font-medium">
                  {item.category}
                </span>
              </div>
              
              {/* Content */}
              <div className="p-4">
                <h3 className="font-display font-semibold text-foreground mb-2 line-clamp-1 group-hover:text-primary transition-colors">
                  {item.title}
                </h3>
                
                {/* Location */}
                <div className="flex items-center gap-1 text-muted-foreground text-sm mb-3">
                  <MapPin className="w-3.5 h-3.5" />
                  <span className="line-clamp-1">{item.location}</span>
                </div>
                
                {/* Rating & Price */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-secondary fill-secondary" />
                    <span className="font-medium text-sm">{item.rating}</span>
                    <span className="text-muted-foreground text-sm">({item.reviews})</span>
                  </div>
                  <div className="text-right">
                    <span className="font-display font-bold text-lg text-foreground">₹{item.price}</span>
                    <span className="text-muted-foreground text-sm">/day</span>
                  </div>
                </div>
                
                {/* Owner */}
                <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border">
                  <img
                    src={item.owner.avatar}
                    alt={item.owner.name}
                    className="w-6 h-6 rounded-full"
                  />
                  <span className="text-sm text-muted-foreground">{item.owner.name}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedItems;
