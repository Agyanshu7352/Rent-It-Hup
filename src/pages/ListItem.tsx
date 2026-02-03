import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Upload, X, ChevronRight, ChevronLeft, Check, Camera, IndianRupee , MapPin, FileText, Tag } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/hooks/useAuth';
import { createItem, uploadItemImage } from '@/lib/api/items';
import { getCategories } from '@/lib/api/categories';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';

const steps = [
  { id: 1, title: 'Photos', icon: Camera },
  { id: 2, title: 'Details', icon: FileText },
  { id: 3, title: 'Pricing', icon: IndianRupee  },
  { id: 4, title: 'Location', icon: MapPin },
];

const conditions = [
  { value: 'new', label: 'New' },
  { value: 'like-new', label: 'Like New' },
  { value: 'good', label: 'Good' },
  { value: 'fair', label: 'Fair' },
];

const ListItem = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category_id: '',
    condition: '',
    price_per_day: '',
    price_per_week: '',
    price_per_month: '',
    deposit_amount: '',
    location: '',
  });

  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
  });

  const createItemMutation = useMutation({
    mutationFn: async () => {
      // Upload images first
      const imageUrls: string[] = [];
      for (const image of images) {
        const url = await uploadItemImage(image);
        imageUrls.push(url);
      }

      // Create item
      return createItem({
        title: formData.title,
        description: formData.description,
        category_id: formData.category_id || null,
        condition: formData.condition || null,
        price_per_day: parseFloat(formData.price_per_day),
        price_per_week: formData.price_per_week ? parseFloat(formData.price_per_week) : null,
        price_per_month: formData.price_per_month ? parseFloat(formData.price_per_month) : null,
        deposit_amount: formData.deposit_amount ? parseFloat(formData.deposit_amount) : null,
        location: formData.location || null,
        images: imageUrls,
      });
    },
    onSuccess: () => {
      toast({
        title: 'Success!',
        description: 'Your item has been listed successfully.',
      });
      navigate('/dashboard');
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to list your item. Please try again.',
        variant: 'destructive',
      });
      console.error('Error creating item:', error);
    },
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + images.length > 5) {
      toast({
        title: 'Too many images',
        description: 'You can upload up to 5 images.',
        variant: 'destructive',
      });
      return;
    }

    const newImages = [...images, ...files];
    setImages(newImages);

    // Create preview URLs
    const newPreviewUrls = files.map(file => URL.createObjectURL(file));
    setImagePreviewUrls([...imagePreviewUrls, ...newPreviewUrls]);
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    const newPreviewUrls = imagePreviewUrls.filter((_, i) => i !== index);
    setImages(newImages);
    setImagePreviewUrls(newPreviewUrls);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return images.length > 0;
      case 2:
        return formData.title.trim() !== '' && formData.description.trim() !== '';
      case 3:
        return formData.price_per_day !== '' && parseFloat(formData.price_per_day) > 0;
      case 4:
        return true;
      default:
        return false;
    }
  };

  const handleSubmit = () => {
    createItemMutation.mutate();
  };

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-20 md:pt-24">
        <div className="container mx-auto px-4 py-8 max-w-3xl">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="font-display text-3xl font-bold mb-2">List Your Item</h1>
            <p className="text-muted-foreground">Share what you have and start earning</p>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-center mb-8">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors ${
                    currentStep >= step.id
                      ? 'bg-primary border-primary text-primary-foreground'
                      : 'border-muted-foreground/30 text-muted-foreground'
                  }`}
                >
                  {currentStep > step.id ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <step.icon className="w-5 h-5" />
                  )}
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`w-12 md:w-20 h-0.5 mx-2 ${
                      currentStep > step.id ? 'bg-primary' : 'bg-muted-foreground/30'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Step Content */}
          <div className="bg-card rounded-2xl shadow-card border border-border p-6 md:p-8">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="font-display text-xl font-semibold mb-2">Add Photos</h2>
                    <p className="text-muted-foreground text-sm">Add up to 5 photos. The first photo will be your main image.</p>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {imagePreviewUrls.map((url, index) => (
                      <div key={index} className="relative aspect-square rounded-xl overflow-hidden bg-muted">
                        <img src={url} alt={`Preview ${index + 1}`} className="w-full h-full object-cover" />
                        <button
                          onClick={() => removeImage(index)}
                          className="absolute top-2 right-2 bg-destructive text-destructive-foreground rounded-full p-1 hover:bg-destructive/90"
                        >
                          <X className="w-4 h-4" />
                        </button>
                        {index === 0 && (
                          <span className="absolute bottom-2 left-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
                            Main
                          </span>
                        )}
                      </div>
                    ))}
                    {images.length < 5 && (
                      <label className="aspect-square rounded-xl border-2 border-dashed border-muted-foreground/30 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-primary hover:bg-muted/50 transition-colors">
                        <Upload className="w-8 h-8 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Upload</span>
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="font-display text-xl font-semibold mb-2">Item Details</h2>
                    <p className="text-muted-foreground text-sm">Tell renters about your item</p>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Title *</Label>
                      <Input
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        placeholder="e.g., Professional DSLR Camera"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Description *</Label>
                      <Textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        placeholder="Describe your item, its features, and what's included..."
                        rows={4}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Category</Label>
                        <Select
                          value={formData.category_id}
                          onValueChange={(value) => handleSelectChange('category_id', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent className=' bg-gray-800 text-white'>
                            {categories.map((cat) => (
                              <SelectItem key={cat.id} value={cat.id} className='hover:bg-gray-900 hover:font-bold'>
                                {cat.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Condition</Label>
                        <Select
                          value={formData.condition}
                          onValueChange={(value) => handleSelectChange('condition', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select condition" />
                          </SelectTrigger>
                          <SelectContent className='bg-gray-800 text-white'>
                            {conditions.map((cond) => (
                              <SelectItem key={cond.value} value={cond.value} className='hover:bg-gray-900 hover:font-bold'>
                                {cond.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="font-display text-xl font-semibold mb-2">Set Your Pricing</h2>
                    <p className="text-muted-foreground text-sm">Offer discounts for longer rentals</p>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="price_per_day">Price per Day *</Label>
                      <div className="relative">
                        <IndianRupee  className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="price_per_day"
                          name="price_per_day"
                          type="number"
                          min="0"
                          step="0.01"
                          value={formData.price_per_day}
                          onChange={handleInputChange}
                          placeholder="0.00"
                          className="pl-9"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="price_per_week">Price per Week (optional)</Label>
                        <div className="relative">
                          <IndianRupee  className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            id="price_per_week"
                            name="price_per_week"
                            type="number"
                            min="0"
                            step="0.01"
                            value={formData.price_per_week}
                            onChange={handleInputChange}
                            placeholder="0.00"
                            className="pl-9"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="price_per_month">Price per Month (optional)</Label>
                        <div className="relative">
                          <IndianRupee  className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            id="price_per_month"
                            name="price_per_month"
                            type="number"
                            min="0"
                            step="0.01"
                            value={formData.price_per_month}
                            onChange={handleInputChange}
                            placeholder="0.00"
                            className="pl-9"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="deposit_amount">Security Deposit (optional)</Label>
                      <div className="relative">
                        <IndianRupee  className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="deposit_amount"
                          name="deposit_amount"
                          type="number"
                          min="0"
                          step="0.01"
                          value={formData.deposit_amount}
                          onChange={handleInputChange}
                          placeholder="0.00"
                          className="pl-9"
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">A refundable amount held during the rental period</p>
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 4 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="font-display text-xl font-semibold mb-2">Pickup Location</h2>
                    <p className="text-muted-foreground text-sm">Where can renters pick up your item?</p>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="location"
                          name="location"
                          value={formData.location}
                          onChange={handleInputChange}
                          placeholder="e.g., San Francisco, CA"
                          className="pl-9"
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">Your exact address will only be shared after a booking is confirmed</p>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>

            {/* Navigation */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
              <Button
                variant="outline"
                onClick={() => setCurrentStep(prev => prev - 1)}
                disabled={currentStep === 1}
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Back
              </Button>

              {currentStep < steps.length ? (
                <Button
                  onClick={() => setCurrentStep(prev => prev + 1)}
                  disabled={!canProceed()}
                >
                  Next
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={createItemMutation.isPending}
                >
                  {createItemMutation.isPending ? 'Listing...' : 'List Item'}
                </Button>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ListItem;
