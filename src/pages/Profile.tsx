import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  User, Mail, Phone, MapPin, Edit2, Save, 
  Camera, Star, Package, ShoppingBag, Calendar
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { getMyProfile, updateProfile, uploadAvatar } from '@/lib/api/profiles';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';

const Profile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    bio: '',
    phone: '',
    location: '',
  });

  // Redirect to auth if not logged in
  useEffect(() => {
    if (!user) {
      navigate('/auth');
    }
  }, [user, navigate]);

  const { data: profile, isLoading, error } = useQuery({
    queryKey: ['myProfile'],
    queryFn: getMyProfile,
    enabled: !!user,
    retry: 1,
  });

  // Update form data when profile loads
  useEffect(() => {
    if (profile && !isEditing) {
      setFormData({
        full_name: profile.full_name || '',
        bio: profile.bio || '',
        phone: profile.phone || '',
        location: profile.location || '',
      });
    }
  }, [profile, isEditing]);

  const updateMutation = useMutation({
    mutationFn: async (data) => {
      console.log('🚀 Mutation starting with:', data);
      await updateProfile(data);
    },
    onSuccess: async () => {
      console.log('✅ Update successful, refetching...');
      
      // Use refetchQueries instead of invalidateQueries
      await queryClient.refetchQueries({ queryKey: ['myProfile'] });
      
      console.log('✅ Refetch complete');
      
      setIsEditing(false);
      toast({
        title: 'Profile updated',
        description: 'Your profile has been updated successfully.',
      });
    },
    onError: (error: Error) => {
      console.error('❌ Mutation error:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to update profile',
        variant: 'destructive',
      });
    },
  });
  const avatarMutation = useMutation({
    mutationFn: async (file: File) => {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        throw new Error('File size must be less than 5MB');
      }
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        throw new Error('File must be an image');
      }

      const url = await uploadAvatar(file);
      await updateProfile({ avatar_url: url });
      return url;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myProfile'] });
      toast({
        title: 'Avatar updated',
        description: 'Your profile picture has been updated.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to upload avatar',
        variant: 'destructive',
      });
    },
  });

  const handleEdit = () => {
    setFormData({
      full_name: profile?.full_name || '',
      bio: profile?.bio || '',
      phone: profile?.phone || '',
      location: profile?.location || '',
    });
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset form data to original profile data
    if (profile) {
      setFormData({
        full_name: profile.full_name || '',
        bio: profile.bio || '',
        phone: profile.phone || '',
        location: profile.location || '',
      });
    }
  };

  const handleSave = () => {
    // All fields are optional now, no validation needed
    console.log('Saving profile with data:', formData);
    updateMutation.mutate(formData);
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      toast({
        title: 'Invalid file type',
        description: 'Please upload a valid image file (JPG, PNG, or WebP)',
        variant: 'destructive',
      });
      e.target.value = '';
      return;
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      toast({
        title: 'File too large',
        description: 'File size must be less than 5MB',
        variant: 'destructive',
      });
      e.target.value = '';
      return;
    }

    // Upload the file
    avatarMutation.mutate(file);
  };

  // Don't render anything if no user (redirecting)
  if (!user) {
    return null;
  }

  // Handle error state
  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-24 pb-16">
          <div className="container mx-auto px-4 max-w-4xl">
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-destructive">Failed to load profile. Please try again.</p>
                <Button onClick={() => queryClient.invalidateQueries({ queryKey: ['myProfile'] })} className="mt-4">
                  Retry
                </Button>
              </CardContent>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const stats = [
    { label: 'Trust Score', value: profile?.trust_score || 0, icon: Star, color: 'text-amber-500' },
    { label: 'Total Listings', value: profile?.total_listings || 0, icon: Package, color: 'text-primary' },
    { label: 'Total Rentals', value: profile?.total_rentals || 0, icon: ShoppingBag, color: 'text-secondary' },
    { label: 'Member Since', value: profile ? new Date(profile.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : '-', icon: Calendar, color: 'text-muted-foreground' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          {isLoading ? (
            <div className="space-y-6">
              <Skeleton className="h-48 w-full" />
              <Skeleton className="h-64 w-full" />
            </div>
          ) : (
            <>
              {/* Profile Header Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card className="mb-6 overflow-hidden">
                  {/* Cover gradient */}
                  <div className="h-32 bg-gradient-to-r from-primary to-primary/60" />
                  
                  <CardContent className="relative pt-0 pb-6">
                    {/* Avatar - Only show camera icon in edit mode */}
                    <div className="absolute -top-16 left-6">
                      <div className="relative">
                        <Avatar className="w-32 h-32 border-4 border-background shadow-lg">
                          <AvatarImage src={profile?.avatar_url || ''} alt={profile?.full_name || 'Profile picture'} />
                          <AvatarFallback className="text-3xl bg-primary text-primary-foreground">
                            {profile?.full_name?.charAt(0) || user.email?.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        
                        {/* Camera icon - only visible in edit mode */}
                        {isEditing && (
                          <label 
                            className="absolute bottom-0 right-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center cursor-pointer hover:bg-primary/90 transition-colors shadow-lg"
                            aria-label="Upload avatar"
                          >
                            {avatarMutation.isPending ? (
                              <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                            ) : (
                              <Camera className="w-5 h-5" />
                            )}
                            <input
                              id="avatar_upload"
                              name="avatar"
                              type="file"
                              accept="image/jpeg,image/png,image/webp,image/jpg"
                              onChange={handleAvatarChange}
                              className="hidden"
                              disabled={avatarMutation.isPending}
                            />
                          </label>
                        )}
                      </div>
                    </div>

                    {/* Edit Button */}
                    <div className="flex justify-end pt-4">
                      {isEditing ? (
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            onClick={handleCancel}
                            disabled={updateMutation.isPending}
                          >
                            Cancel
                          </Button>
                          <Button 
                            onClick={handleSave} 
                            disabled={updateMutation.isPending} 
                            className="gap-2"
                          >
                            <Save className="w-4 h-4" />
                            {updateMutation.isPending ? 'Saving...' : 'Save'}
                          </Button>
                        </div>
                      ) : (
                        <Button variant="outline" onClick={handleEdit} className="gap-2">
                          <Edit2 className="w-4 h-4" />
                          Edit Profile
                        </Button>
                      )}
                    </div>

                    {/* Profile Info - Read-only when not editing */}
                    <div className="mt-8 ml-2">
                      <h1 className="font-display text-2xl font-bold text-foreground">
                        {profile?.full_name || 'Add your name'}
                      </h1>
                      <p className="text-muted-foreground flex items-center gap-2 mt-1">
                        <Mail className="w-4 h-4" />
                        {user.email}
                      </p>
                      {profile?.location && (
                        <p className="text-muted-foreground flex items-center gap-2 mt-1">
                          <MapPin className="w-4 h-4" />
                          {profile.location}
                        </p>
                      )}
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t">
                      {stats.map((stat) => (
                        <div key={stat.label} className="text-center">
                          <div className="flex items-center justify-center gap-2 mb-1">
                            <stat.icon className={`w-4 h-4 ${stat.color}`} />
                            <span className="font-display text-xl font-bold text-foreground">
                              {stat.value}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">{stat.label}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Edit Form / Bio Display */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="w-5 h-5" />
                      {isEditing ? 'Edit Profile' : 'About'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {isEditing ? (
                      <div className="space-y-6">
                        <div className="grid gap-4 md:grid-cols-2">
                          <div className="space-y-2">
                            <Label htmlFor="full_name">Full Name</Label>
                            <Input
                              id="full_name"
                              name="full_name"
                              autoComplete="name"
                              value={formData.full_name}
                              onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                              placeholder="Enter your full name"
                              maxLength={100}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="phone">Phone Number</Label>
                            <Input
                              id="phone"
                              name="phone"
                              type="tel"
                              autoComplete="tel"
                              value={formData.phone}
                              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                              placeholder="Enter your phone number"
                              maxLength={20}
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="location">Location</Label>
                          <Input
                            id="location"
                            name="location"
                            autoComplete="address-level2"
                            value={formData.location}
                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                            placeholder="City, State"
                            maxLength={100}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="bio">Bio</Label>
                          <Textarea
                            id="bio"
                            name="bio"
                            autoComplete="off"
                            value={formData.bio}
                            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                            placeholder="Tell others about yourself..."
                            rows={4}
                            maxLength={500}
                          />
                          <p className="text-xs text-muted-foreground text-right">
                            {formData.bio.length}/500
                          </p>
                        </div>
                        
                        {/* Info message */}
                        <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                          <p className="text-sm text-blue-800 dark:text-blue-200">
                            💡 All fields are optional. Fill in what you're comfortable sharing.
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {profile?.bio ? (
                          <p className="text-foreground whitespace-pre-wrap">{profile.bio}</p>
                        ) : (
                          <p className="text-muted-foreground italic">
                            No bio added yet. Click "Edit Profile" to add one.
                          </p>
                        )}
                        
                        <div className="grid gap-4 md:grid-cols-2 pt-4 border-t">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                              <Phone className="w-5 h-5 text-muted-foreground" />
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Phone</p>
                              <p className="font-medium text-foreground">
                                {profile?.phone || 'Not provided'}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                              <MapPin className="w-5 h-5 text-muted-foreground" />
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Location</p>
                              <p className="font-medium text-foreground">
                                {profile?.location || 'Not provided'}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>

              {/* Quick Links */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mt-6"
              >
                <Card>
                  <CardContent className="p-6">
                    <div className="flex flex-wrap gap-4">
                      <Button variant="outline" onClick={() => navigate('/dashboard')} className="gap-2">
                        <Package className="w-4 h-4" />
                        View Dashboard
                      </Button>
                      <Button variant="outline" onClick={() => navigate('/favorites')} className="gap-2">
                        <Star className="w-4 h-4" />
                        My Favorites
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Profile;