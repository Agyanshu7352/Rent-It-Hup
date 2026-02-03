import type { LucideIcon } from 'lucide-react';
import { 
  Wrench, 
  Camera, 
  Gamepad2, 
  Tent, 
  Dumbbell, 
  PartyPopper,
  Laptop,
  Car
} from 'lucide-react';

export interface Category {
  icon: LucideIcon;
  name: string;
  slug: string;
  count: string;
  color: string;
  description: string;
}

export interface RentalItem {
  id: number;
  title: string;
  category: string;
  categorySlug: string;
  price: number;
  priceUnit: string;
  location: string;
  rating: number;
  reviews: number;
  image: string;
  owner: { name: string; avatar: string };
  available: boolean;
  condition: string;
}

export const categories: Category[] = [
  { 
    icon: Wrench, 
    name: 'Tools & Equipment', 
    slug: 'tools-equipment',
    count: '2,340+', 
    color: 'from-teal-500 to-teal-600',
    description: 'Professional and DIY tools for every project'
  },
  { 
    icon: Camera, 
    name: 'Electronics', 
    slug: 'electronics',
    count: '5,120+', 
    color: 'from-amber-500 to-orange-500',
    description: 'Cameras, audio equipment, and more'
  },
  { 
    icon: Gamepad2, 
    name: 'Gaming', 
    slug: 'gaming',
    count: '1,890+', 
    color: 'from-purple-500 to-indigo-500',
    description: 'Consoles, VR headsets, and gaming gear'
  },
  { 
    icon: Tent, 
    name: 'Camping Gear', 
    slug: 'camping-gear',
    count: '980+', 
    color: 'from-emerald-500 to-green-600',
    description: 'Everything for your outdoor adventures'
  },
  { 
    icon: Dumbbell, 
    name: 'Sports & Fitness', 
    slug: 'sports-fitness',
    count: '1,450+', 
    color: 'from-rose-500 to-pink-500',
    description: 'Gym equipment, and sports gear'
  },
  { 
    icon: PartyPopper, 
    name: 'Party Supplies', 
    slug: 'party-supplies',
    count: '760+', 
    color: 'from-yellow-500 to-amber-500',
    description: 'Decorations, sound systems, and more'
  },
  { 
    icon: Laptop, 
    name: 'Tech Gadgets', 
    slug: 'tech-gadgets',
    count: '3,200+', 
    color: 'from-blue-500 to-cyan-500',
    description: 'Laptops, tablets, and smart devices'
  },
  { 
    icon: Car, 
    name: 'Vehicles', 
    slug: 'vehicles',
    count: '540+', 
    color: 'from-slate-500 to-gray-600',
    description: 'Cars, bikes, and recreational vehicles'
  },
];

export const allItems: RentalItem[] = [
  // Tools & Equipment
  {
    id: 1,
    title: 'Power Drill & Tool Set',
    category: 'Tools & Equipment',
    categorySlug: 'tools-equipment',
    price: 150,
    priceUnit: 'day',
    location: 'Indiranagar, Bangalore',
    rating: 4.7,
    reviews: 89,
    image: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=400&h=300&fit=crop',
    owner: { name: 'Amit V.', avatar: 'https://i.pravatar.cc/40?img=3' },
    available: true,
    condition: 'Excellent'
  },
  {
    id: 2,
    title: 'Pressure Washer Pro',
    category: 'Tools & Equipment',
    categorySlug: 'tools-equipment',
    price: 200,
    priceUnit: 'day',
    location: 'HSR Layout, Bangalore',
    rating: 4.8,
    reviews: 45,
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop',
    owner: { name: 'Suresh K.', avatar: 'https://i.pravatar.cc/40?img=10' },
    available: true,
    condition: 'Good'
  },
  {
    id: 3,
    title: 'Circular Saw & Blades',
    category: 'Tools & Equipment',
    categorySlug: 'tools-equipment',
    price: 180,
    priceUnit: 'day',
    location: 'Koramangala, Bangalore',
    rating: 4.6,
    reviews: 34,
    image: 'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=400&h=300&fit=crop',
    owner: { name: 'Rajesh P.', avatar: 'https://i.pravatar.cc/40?img=11' },
    available: false,
    condition: 'Excellent'
  },
  
  // Electronics
  {
    id: 4,
    title: 'Professional DSLR Camera Kit',
    category: 'Electronics',
    categorySlug: 'electronics',
    price: 500,
    priceUnit: 'day',
    location: 'Koramangala, Bangalore',
    rating: 4.9,
    reviews: 47,
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&h=300&fit=crop',
    owner: { name: 'Rahul S.', avatar: 'https://i.pravatar.cc/40?img=1' },
    available: true,
    condition: 'Excellent'
  },
  {
    id: 5,
    title: 'Sony A7III Mirrorless',
    category: 'Electronics',
    categorySlug: 'electronics',
    price: 600,
    priceUnit: 'day',
    location: 'Whitefield, Bangalore',
    rating: 4.9,
    reviews: 78,
    image: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400&h=300&fit=crop',
    owner: { name: 'Neha T.', avatar: 'https://i.pravatar.cc/40?img=5' },
    available: true,
    condition: 'Excellent'
  },
  {
    id: 6,
    title: 'DJI Drone Mavic Pro',
    category: 'Electronics',
    categorySlug: 'electronics',
    price: 800,
    priceUnit: 'day',
    location: 'Electronic City, Bangalore',
    rating: 4.8,
    reviews: 56,
    image: 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=400&h=300&fit=crop',
    owner: { name: 'Vikram R.', avatar: 'https://i.pravatar.cc/40?img=12' },
    available: true,
    condition: 'Good'
  },
  
  // Gaming
  {
    id: 7,
    title: 'PlayStation 5 Console',
    category: 'Gaming',
    categorySlug: 'gaming',
    price: 400,
    priceUnit: 'day',
    location: 'Whitefield, Bangalore',
    rating: 4.9,
    reviews: 156,
    image: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400&h=300&fit=crop',
    owner: { name: 'Karan M.', avatar: 'https://i.pravatar.cc/40?img=4' },
    available: true,
    condition: 'Excellent'
  },
  {
    id: 8,
    title: 'Xbox Series X Bundle',
    category: 'Gaming',
    categorySlug: 'gaming',
    price: 350,
    priceUnit: 'day',
    location: 'Marathahalli, Bangalore',
    rating: 4.7,
    reviews: 89,
    image: 'https://images.unsplash.com/photo-1621259182978-fbf93132d53d?w=400&h=300&fit=crop',
    owner: { name: 'Arjun S.', avatar: 'https://i.pravatar.cc/40?img=13' },
    available: true,
    condition: 'Excellent'
  },
  {
    id: 9,
    title: 'Meta Quest 3 VR Headset',
    category: 'Gaming',
    categorySlug: 'gaming',
    price: 450,
    priceUnit: 'day',
    location: 'Jayanagar, Bangalore',
    rating: 4.8,
    reviews: 67,
    image: 'https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?w=400&h=300&fit=crop',
    owner: { name: 'Deepak L.', avatar: 'https://i.pravatar.cc/40?img=14' },
    available: false,
    condition: 'Good'
  },
  
  // Camping Gear
  {
    id: 10,
    title: 'Camping Tent (4-Person)',
    category: 'Camping Gear',
    categorySlug: 'camping-gear',
    price: 300,
    priceUnit: 'day',
    location: 'HSR Layout, Bangalore',
    rating: 4.8,
    reviews: 32,
    image: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=400&h=300&fit=crop',
    owner: { name: 'Priya K.', avatar: 'https://i.pravatar.cc/40?img=2' },
    available: true,
    condition: 'Excellent'
  },
  {
    id: 11,
    title: 'Complete Camping Kit',
    category: 'Camping Gear',
    categorySlug: 'camping-gear',
    price: 500,
    priceUnit: 'day',
    location: 'Malleshwaram, Bangalore',
    rating: 4.9,
    reviews: 45,
    image: 'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=400&h=300&fit=crop',
    owner: { name: 'Rohit M.', avatar: 'https://i.pravatar.cc/40?img=15' },
    available: true,
    condition: 'Excellent'
  },
  {
    id: 12,
    title: 'Sleeping Bag Set (2)',
    category: 'Camping Gear',
    categorySlug: 'camping-gear',
    price: 100,
    priceUnit: 'day',
    location: 'BTM Layout, Bangalore',
    rating: 4.5,
    reviews: 28,
    image: 'https://images.unsplash.com/photo-1445308394109-4ec2920981b1?w=400&h=300&fit=crop',
    owner: { name: 'Sneha V.', avatar: 'https://i.pravatar.cc/40?img=16' },
    available: true,
    condition: 'Good'
  },
  
  // Sports & Fitness
  {
    id: 13,
    title: 'Mountain Bike Pro',
    category: 'Sports & Fitness',
    categorySlug: 'sports-fitness',
    price: 250,
    priceUnit: 'day',
    location: 'Banashankari, Bangalore',
    rating: 4.7,
    reviews: 56,
    image: 'https://images.unsplash.com/photo-1576435728678-68d0fbf94e91?w=400&h=300&fit=crop',
    owner: { name: 'Arun K.', avatar: 'https://i.pravatar.cc/40?img=17' },
    available: true,
    condition: 'Excellent'
  },
  {
    id: 14,
    title: 'Home Gym Equipment Set',
    category: 'Sports & Fitness',
    categorySlug: 'sports-fitness',
    price: 400,
    priceUnit: 'week',
    location: 'JP Nagar, Bangalore',
    rating: 4.6,
    reviews: 34,
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=300&fit=crop',
    owner: { name: 'Kavitha R.', avatar: 'https://i.pravatar.cc/40?img=18' },
    available: true,
    condition: 'Good'
  },
  {
    id: 15,
    title: 'Golf Club Set',
    category: 'Sports & Fitness',
    categorySlug: 'sports-fitness',
    price: 350,
    priceUnit: 'day',
    location: 'Yelahanka, Bangalore',
    rating: 4.8,
    reviews: 23,
    image: 'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=400&h=300&fit=crop',
    owner: { name: 'Mohan S.', avatar: 'https://i.pravatar.cc/40?img=19' },
    available: false,
    condition: 'Excellent'
  },
  
  // Party Supplies
  {
    id: 16,
    title: 'DJ Sound System',
    category: 'Party Supplies',
    categorySlug: 'party-supplies',
    price: 600,
    priceUnit: 'day',
    location: 'MG Road, Bangalore',
    rating: 4.9,
    reviews: 89,
    image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&h=300&fit=crop',
    owner: { name: 'Sameer J.', avatar: 'https://i.pravatar.cc/40?img=20' },
    available: true,
    condition: 'Excellent'
  },
  {
    id: 17,
    title: 'Party Decoration Kit',
    category: 'Party Supplies',
    categorySlug: 'party-supplies',
    price: 200,
    priceUnit: 'day',
    location: 'Richmond Town, Bangalore',
    rating: 4.7,
    reviews: 45,
    image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=400&h=300&fit=crop',
    owner: { name: 'Anita B.', avatar: 'https://i.pravatar.cc/40?img=21' },
    available: true,
    condition: 'Good'
  },
  {
    id: 18,
    title: 'Projector & Screen Set',
    category: 'Party Supplies',
    categorySlug: 'party-supplies',
    price: 300,
    priceUnit: 'day',
    location: 'Cunningham Road, Bangalore',
    rating: 4.6,
    reviews: 34,
    image: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=400&h=300&fit=crop',
    owner: { name: 'Venkat P.', avatar: 'https://i.pravatar.cc/40?img=22' },
    available: true,
    condition: 'Excellent'
  },
  
  // Tech Gadgets
  {
    id: 19,
    title: 'MacBook Pro 16" M3',
    category: 'Tech Gadgets',
    categorySlug: 'tech-gadgets',
    price: 800,
    priceUnit: 'day',
    location: 'Koramangala, Bangalore',
    rating: 4.9,
    reviews: 123,
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=300&fit=crop',
    owner: { name: 'Sanjay N.', avatar: 'https://i.pravatar.cc/40?img=23' },
    available: true,
    condition: 'Excellent'
  },
  {
    id: 20,
    title: 'iPad Pro with Pencil',
    category: 'Tech Gadgets',
    categorySlug: 'tech-gadgets',
    price: 400,
    priceUnit: 'day',
    location: 'Indiranagar, Bangalore',
    rating: 4.8,
    reviews: 67,
    image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=300&fit=crop',
    owner: { name: 'Ritu S.', avatar: 'https://i.pravatar.cc/40?img=24' },
    available: true,
    condition: 'Excellent'
  },
  {
    id: 21,
    title: 'Portable Monitor 15.6"',
    category: 'Tech Gadgets',
    categorySlug: 'tech-gadgets',
    price: 150,
    priceUnit: 'day',
    location: 'HSR Layout, Bangalore',
    rating: 4.5,
    reviews: 29,
    image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&h=300&fit=crop',
    owner: { name: 'Ganesh K.', avatar: 'https://i.pravatar.cc/40?img=25' },
    available: false,
    condition: 'Good'
  },
  
  // Vehicles
  {
    id: 22,
    title: 'Royal Enfield Classic 350',
    category: 'Vehicles',
    categorySlug: 'vehicles',
    price: 500,
    priceUnit: 'day',
    location: 'Jayanagar, Bangalore',
    rating: 4.8,
    reviews: 89,
    image: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=400&h=300&fit=crop',
    owner: { name: 'Prakash V.', avatar: 'https://i.pravatar.cc/40?img=26' },
    available: true,
    condition: 'Excellent'
  },
  {
    id: 23,
    title: 'Mahindra Thar 4x4',
    category: 'Vehicles',
    categorySlug: 'vehicles',
    price: 2500,
    priceUnit: 'day',
    location: 'Whitefield, Bangalore',
    rating: 4.9,
    reviews: 45,
    image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=400&h=300&fit=crop',
    owner: { name: 'Hari M.', avatar: 'https://i.pravatar.cc/40?img=27' },
    available: true,
    condition: 'Excellent'
  },
  {
    id: 24,
    title: 'Electric Scooter Ather',
    category: 'Vehicles',
    categorySlug: 'vehicles',
    price: 300,
    priceUnit: 'day',
    location: 'Electronic City, Bangalore',
    rating: 4.7,
    reviews: 67,
    image: 'https://images.unsplash.com/photo-1558980664-769d59546b3d?w=400&h=300&fit=crop',
    owner: { name: 'Lakshmi R.', avatar: 'https://i.pravatar.cc/40?img=28' },
    available: true,
    condition: 'Good'
  },
];

export const getCategoryBySlug = (slug: string): Category | undefined => {
  return categories.find(cat => cat.slug === slug);
};

export const getItemsByCategory = (categorySlug: string): RentalItem[] => {
  return allItems.filter(item => item.categorySlug === categorySlug);
};
