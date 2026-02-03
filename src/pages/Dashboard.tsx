import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { 
  Package, ShoppingBag, TrendingUp, Star, 
  Plus, Eye, Calendar, Clock, CheckCircle, 
  XCircle, AlertCircle, ChevronRight
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { getMyItems, getMyBookings, getMyRentals, type Item, type Booking } from '@/lib/api';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const { data: myItems, isLoading: itemsLoading } = useQuery<Item[]>({
    queryKey: ['myItems'],
    queryFn: getMyItems,
    enabled: !!user,
  });

  const { data: myBookings, isLoading: bookingsLoading } = useQuery<Booking[]>({
    queryKey: ['myBookings'],
    queryFn: getMyBookings,
    enabled: !!user,
  });

  const { data: myRentals, isLoading: rentalsLoading } = useQuery<Booking[]>({
    queryKey: ['myRentals'],
    queryFn: getMyRentals,
    enabled: !!user,
  });

  // Navigation check in useEffect
  React.useEffect(() => {
    if (!user) {
      navigate('/auth');
    }
  }, [user, navigate]);

  const stats = [
    {
      title: 'Total Listings',
      value: myItems?.length || 0,
      icon: Package,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      title: 'Active Rentals',
      value: myBookings?.filter(b => b.status === 'confirmed').length || 0,
      icon: ShoppingBag,
      color: 'text-secondary',
      bgColor: 'bg-secondary/10',
    },
    {
      title: 'Items Rented Out',
      value: myRentals?.filter(r => r.status === 'confirmed').length || 0,
      icon: TrendingUp,
      color: 'text-emerald-500',
      bgColor: 'bg-emerald-500/10',
    },
    {
      title: 'Avg. Rating',
      value: '4.8',
      icon: Star,
      color: 'text-amber-500',
      bgColor: 'bg-amber-500/10',
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="text-amber-600 border-amber-300 bg-amber-50"><Clock className="w-3 h-3 mr-1" /> Pending</Badge>;
      case 'confirmed':
        return <Badge variant="outline" className="text-emerald-600 border-emerald-300 bg-emerald-50"><CheckCircle className="w-3 h-3 mr-1" /> Confirmed</Badge>;
      case 'completed':
        return <Badge variant="outline" className="text-blue-600 border-blue-300 bg-blue-50"><CheckCircle className="w-3 h-3 mr-1" /> Completed</Badge>;
      case 'cancelled':
        return <Badge variant="outline" className="text-red-600 border-red-300 bg-red-50"><XCircle className="w-3 h-3 mr-1" /> Cancelled</Badge>;
      default:
        return <Badge variant="outline"><AlertCircle className="w-3 h-3 mr-1" /> {status}</Badge>;
    }
  };

  if (!user) {
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
            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
              Welcome back! 👋
            </h1>
            <p className="text-muted-foreground">
              Here's an overview of your rental activity
            </p>
          </motion.div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-12 h-12 rounded-xl ${stat.bgColor} flex items-center justify-center`}>
                        <stat.icon className={`w-6 h-6 ${stat.color}`} />
                      </div>
                    </div>
                    <h3 className="font-display text-2xl font-bold text-foreground">
                      {stat.value}
                    </h3>
                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-8"
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-wrap gap-4">
                  <Button variant="outline" className="gap-2" onClick={() => navigate('/list-item')}>
                    <Plus className="w-4 h-4" />
                    List New Item
                  </Button>
                  <Button variant="outline" className="gap-2" onClick={() => navigate('/favorites')}>
                    <Eye className="w-4 h-4" />
                    View Favorites
                  </Button>
                  <Button variant="outline" className="gap-2" onClick={() => navigate('/profile')}>
                    <Calendar className="w-4 h-4" />
                    Edit Profile
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Tabs for Listings and Bookings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Tabs defaultValue="listings" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
                <TabsTrigger value="listings">My Listings</TabsTrigger>
                <TabsTrigger value="bookings">My Bookings</TabsTrigger>
                <TabsTrigger value="rentals">Rented Out</TabsTrigger>
              </TabsList>

              <TabsContent value="listings">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>Your Listed Items</span>
                      <Button size="sm" className="gap-2" onClick={() => navigate('/list-item')}>
                        <Plus className="w-4 h-4" />
                        Add New
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {itemsLoading ? (
                      <div className="space-y-4">
                        {[1, 2, 3].map(i => (
                          <Skeleton key={i} className="h-20 w-full" />
                        ))}
                      </div>
                    ) : myItems && myItems.length > 0 ? (
                      <div className="space-y-4">
                        {myItems.map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center gap-4 p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors cursor-pointer group"
                          >
                            <img
                              src={item.images?.[0] || '/placeholder.svg'}
                              alt={item.title}
                              className="w-16 h-16 rounded-lg object-cover"
                            />
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-foreground truncate group-hover:text-primary transition-colors">
                                {item.title}
                              </h4>
                              <p className="text-sm text-muted-foreground">
                                ₹{item.price_per_day}/day • {item.location || 'No location'}
                              </p>
                            </div>
                            <Badge variant={item.is_available ? "default" : "secondary"}>
                              {item.is_available ? 'Available' : 'Rented'}
                            </Badge>
                            <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <Package className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                        <h3 className="font-medium text-foreground mb-2">No listings yet</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          Start earning by listing your first item
                        </p>
                        <Button className="gap-2">
                          <Plus className="w-4 h-4" />
                          List Your First Item
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="bookings">
                <Card>
                  <CardHeader>
                    <CardTitle>Items You're Renting</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {bookingsLoading ? (
                      <div className="space-y-4">
                        {[1, 2, 3].map(i => (
                          <Skeleton key={i} className="h-20 w-full" />
                        ))}
                      </div>
                    ) : myBookings && myBookings.length > 0 ? (
                      <div className="space-y-4">
                        {myBookings.map((booking) => (
                          <div
                            key={booking.id}
                            className="flex items-center gap-4 p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors cursor-pointer group"
                          >
                            <img
                              src={booking.item?.images?.[0] || '/placeholder.svg'}
                              alt={booking.item?.title}
                              className="w-16 h-16 rounded-lg object-cover"
                            />
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-foreground truncate group-hover:text-primary transition-colors">
                                {booking.item?.title}
                              </h4>
                              <p className="text-sm text-muted-foreground">
                                {new Date(booking.start_date).toLocaleDateString()} - {new Date(booking.end_date).toLocaleDateString()}
                              </p>
                            </div>
                            {getStatusBadge(booking.status)}
                            <div className="text-right">
                              <p className="font-medium text-foreground">₹{booking.total_price}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <ShoppingBag className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                        <h3 className="font-medium text-foreground mb-2">No bookings yet</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          Browse items and make your first rental
                        </p>
                        <Button onClick={() => navigate('/')} className="gap-2">
                          Browse Items
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="rentals">
                <Card>
                  <CardHeader>
                    <CardTitle>Items You've Rented Out</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {rentalsLoading ? (
                      <div className="space-y-4">
                        {[1, 2, 3].map(i => (
                          <Skeleton key={i} className="h-20 w-full" />
                        ))}
                      </div>
                    ) : myRentals && myRentals.length > 0 ? (
                      <div className="space-y-4">
                        {myRentals.map((rental) => (
                          <div
                            key={rental.id}
                            className="flex items-center gap-4 p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors cursor-pointer group"
                          >
                            <img
                              src={rental.item?.images?.[0] || '/placeholder.svg'}
                              alt={rental.item?.title}
                              className="w-16 h-16 rounded-lg object-cover"
                            />
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-foreground truncate group-hover:text-primary transition-colors">
                                {rental.item?.title}
                              </h4>
                              <p className="text-sm text-muted-foreground">
                                Rented by {rental.renter?.full_name || 'User'}
                              </p>
                            </div>
                            {getStatusBadge(rental.status)}
                            <div className="text-right">
                              <p className="font-medium text-foreground">₹{rental.total_price}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <TrendingUp className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                        <h3 className="font-medium text-foreground mb-2">No rentals yet</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          List items to start receiving rental requests
                        </p>
                        <Button className="gap-2">
                          <Plus className="w-4 h-4" />
                          List an Item
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Dashboard;