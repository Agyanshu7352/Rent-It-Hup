import { useState, useMemo, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, SlidersHorizontal, Grid3X3, List, Search, X, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ItemCard from '@/components/ItemCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

// Define interfaces locally since we're fetching directly
interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  image_url: string | null;
  item_count?: number;
  created_at: string;
}

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
    avatar_url: string;
  };
}

const CategoryPage = () => {
  const { slug } = useParams<{ slug: string }>();
  
  const [category, setCategory] = useState<Category | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('popular');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [gridViewMode, setGridViewMode] = useState(false)
  const [showAvailableOnly, setShowAvailableOnly] = useState(false);
  const [priceRange, setPriceRange] = useState<string>('all');
  
  // Fetch category and items from database
  useEffect(() => {
    const fetchData = async () => {
      if (!slug) {
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        setError(null);
        
        
        
        // Fetch current category by slug
        const { data: categoryData, error: categoryError } = await supabase
          .from('categories')
          .select('*')
          .eq('slug', slug)
          .maybeSingle();
        
        
        
        if (categoryError) {
          console.error('❌ Category error:', categoryError);
          throw categoryError;
        }
        
        if (!categoryData) {
          console.warn('⚠️ No category found with slug:', slug);
          setError('Category not found');
          setLoading(false);
          return;
        }
        
       
        setCategory(categoryData);
        
        // Fetch all categories for sidebar
        const { data: allCategories, error: categoriesError } = await supabase
          .from('categories')
          .select('*')
          .order('name');
        
        if (categoriesError) {
          throw categoriesError;
        }
        
        setCategories(allCategories || []);
        
        
        // Fetch items for this category - ONLY select fields that exist
        const { data: itemsData, error: itemsError } = await supabase
          .from('items')
          .select(`
            *,
            owner:profiles(id, full_name, avatar_url)
          `)
          .eq('category_id', categoryData.id)
          .eq('is_active', true)
          .order('created_at', { ascending: false });
        
        if (itemsError) {
          console.error('❌ Items error:', itemsError);
          throw itemsError;
        }
        
        setItems(itemsData || []);
        
      } catch (err: any) {
        setError(err.message || 'Failed to load items. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [slug]);
  
  const filteredItems = useMemo(() => {
    let filtered = [...items];
    
    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(item => 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.location?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Availability filter
    if (showAvailableOnly) {
      filtered = filtered.filter(item => item.availability_status === 'available');
    }
    
    // Price range filter (using price_per_day)
    if (priceRange !== 'all') {
      const [min, max] = priceRange.split('-').map(Number);
      filtered = filtered.filter(item => {
        if (max) {
          return item.price_per_day >= min && item.price_per_day <= max;
        }
        return item.price_per_day >= min;
      });
    }
    
    // Sorting
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price_per_day - b.price_per_day);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price_per_day - a.price_per_day);
        break;
      case 'newest':
        filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
      case 'oldest':
        filtered.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
        break;
      case 'popular':
      default:
        // Keep default order from database
        break;
    }
    
    return filtered;
  }, [items, searchQuery, sortBy, showAvailableOnly, priceRange]);

  if (!category && !loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-24 pb-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-3xl font-bold text-foreground mb-4">Category Not Found</h1>
            <p className="text-muted-foreground mb-8">The category you're looking for doesn't exist.</p>
            <Button asChild>
              <Link to="/">Go Back Home</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Availability */}
      <div>
        <h4 className="font-medium text-foreground mb-3">Availability</h4>
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="available" 
            checked={showAvailableOnly}
            onCheckedChange={(checked) => setShowAvailableOnly(checked as boolean)}
          />
          <Label htmlFor="available" className="text-sm text-muted-foreground">
            Show available only
          </Label>
        </div>
      </div>
      
      {/* Price Range */}
      <div>
        <h4 className="font-medium text-foreground mb-3">Price Range (per day)</h4>
        <Select value={priceRange} onValueChange={setPriceRange}>
          <SelectTrigger>
            <SelectValue placeholder="Select range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Prices</SelectItem>
            <SelectItem value="0-200">Under ₹200</SelectItem>
            <SelectItem value="200-500">₹200 - ₹500</SelectItem>
            <SelectItem value="500-1000">₹500 - ₹1,000</SelectItem>
            <SelectItem value="1000-">₹1,000+</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {/* Other Categories */}
      {categories.length > 0 && (
        <div>
          <h4 className="font-medium text-foreground mb-3">Browse Other Categories</h4>
          <div className="space-y-2">
            {categories.filter(cat => cat.slug !== slug).map((cat) => (
              <Link
                key={cat.id}
                to={`/category/${cat.slug}`}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted transition-colors"
              >
                {cat.image_url ? (
                  <img 
                    src={cat.image_url} 
                    alt={cat.name}
                    className="w-8 h-8 rounded-lg object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <span className="text-xs font-medium text-primary">
                      {cat.name.substring(0, 2).toUpperCase()}
                    </span>
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <span className="text-sm text-muted-foreground hover:text-foreground block truncate">
                    {cat.name}
                  </span>
                  {cat.item_count && cat.item_count > 0 && (
                    <span className="text-xs text-muted-foreground/60">
                      {cat.item_count} items
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-20">
        {/* Hero Section */}
        {category && (
          <section className="py-12 bg-gradient-to-br from-primary/20 to-primary/5 relative overflow-hidden">
            <div className="container mx-auto px-4 relative z-10">
              <Link 
                to="/#categories" 
                className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Categories
              </Link>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex items-center gap-4"
              >
                {category.image_url ? (
                  <img 
                    src={category.image_url} 
                    alt={category.name}
                    className="w-16 h-16 rounded-2xl object-cover shadow-lg"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center">
                    <span className="text-2xl font-bold text-primary">
                      {category.name.substring(0, 2).toUpperCase()}
                    </span>
                  </div>
                )}
                <div>
                  <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-2">
                    {category.name}
                  </h1>
                  {category.description && (
                    <p className="text-muted-foreground">{category.description}</p>
                  )}
                </div>
              </motion.div>
            </div>
          </section>
        )}
        
        {/* Main Content */}
        <section className="py-8">
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Desktop Sidebar */}
              <aside className="hidden lg:block w-72 flex-shrink-0">
                <div className="sticky top-24 bg-card rounded-2xl p-6 shadow-card border">
                  <h3 className="font-display font-semibold text-foreground mb-6">Filters</h3>
                  <FilterContent />
                </div>
              </aside>
              
              {/* Main Content */}
              <div className="flex-1">
                {/* Toolbar */}
                <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                  <div className="flex items-center gap-3 flex-1 max-w-md">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        placeholder="Search items..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                      {searchQuery && (
                        <button
                          onClick={() => setSearchQuery('')}
                          className="absolute right-3 top-1/2 -translate-y-1/2"
                        >
                          <X className="w-4 h-4 text-muted-foreground hover:text-foreground" />
                        </button>
                      )}
                    </div>
                    
                    {/* Mobile Filter Button */}
                    <Sheet>
                      <SheetTrigger asChild>
                        <Button variant="outline" size="icon" className="lg:hidden">
                          <SlidersHorizontal className="w-4 h-4" />
                        </Button>
                      </SheetTrigger>
                      <SheetContent side="left">
                        <SheetHeader>
                          <SheetTitle>Filters</SheetTitle>
                        </SheetHeader>
                        <div className="mt-6">
                          <FilterContent />
                        </div>
                      </SheetContent>
                    </Sheet>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="popular">Most Popular</SelectItem>
                        <SelectItem value="newest">Newest First</SelectItem>
                        <SelectItem value="oldest">Oldest First</SelectItem>
                        <SelectItem value="price-low">Price: Low to High</SelectItem>
                        <SelectItem value="price-high">Price: High to Low</SelectItem>
                      </SelectContent>
                    </Select>
                    <div className="hidden sm:flex items-center border rounded-lg overflow-hidden px-3">
                      {gridViewMode ? (
                        <button
                          onClick={() => { setViewMode('grid'); setGridViewMode(false); }}
                          className={`px-4 py-3 ${viewMode === 'grid' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}
                        >
                          <Grid3X3 className="w-4 h-4 scale-130" />
                        </button>
                      ) : (
                        <button
                          onClick={() => { setViewMode('list'); setGridViewMode(true); }}
                          className={`p-2 ${viewMode === 'list' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}
                        >
                          <List className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Loading State */}
                {loading ? (
                  <div className="flex flex-col items-center justify-center py-16">
                    <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
                    <p className="text-muted-foreground">Loading items...</p>
                  </div>
                ) : error ? (
                  // Error State
                  <div className="text-center py-16">
                    <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-4">
                      <X className="w-8 h-8 text-destructive" />
                    </div>
                    <h3 className="font-display font-semibold text-foreground mb-2">Error Loading Items</h3>
                    <p className="text-muted-foreground mb-4">{error}</p>
                    <Button onClick={() => window.location.reload()}>
                      Try Again
                    </Button>
                  </div>
                ) : (
                  <>
                    {/* Results Count */}
                    <p className="text-sm text-muted-foreground mb-6">
                      Showing {filteredItems.length} of {items.length} items
                    </p>
                    
                    {/* Items Grid */}
                    {filteredItems.length > 0 ? (
                      <div className={
                        viewMode === 'grid' 
                          ? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6" 
                          : "space-y-4"
                      }>
                        {filteredItems.map((item, index) => (
                          <ItemCard key={item.id} item={item} index={index} />
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-16">
                        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                          <Search className="w-8 h-8 text-muted-foreground" />
                        </div>
                        <h3 className="font-display font-semibold text-foreground mb-2">No items found</h3>
                        <p className="text-muted-foreground mb-4">Try adjusting your filters or search query</p>
                        <Button variant="outline" onClick={() => {
                          setSearchQuery('');
                          setShowAvailableOnly(false);
                          setPriceRange('all');
                        }}>
                          Clear Filters
                        </Button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default CategoryPage;