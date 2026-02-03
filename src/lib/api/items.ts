import { supabase } from '@/integrations/supabase/client';
import type { Json } from '@/integrations/supabase/types';

export interface Item {
  id: string;
  owner_id: string;
  category_id: string | null;
  title: string;
  description: string | null;
  price_per_day: number;
  price_per_week: number | null;
  price_per_month: number | null;
  deposit_amount: number | null;
  location: string | null;
  latitude: number | null;
  longitude: number | null;
  is_available: boolean | null;
  is_featured: boolean | null;
  condition: string | null;
  images: string[] | null;
  specifications: Json | null;
  view_count: number | null;
  created_at: string;
  updated_at: string;
  owner?: {
    id: string;
    full_name: string | null;
    avatar_url: string | null;
    trust_score: number | null;
  };
  category?: {
    id: string;
    name: string;
    slug: string;
  };
}

export async function getItems(categorySlug?: string) {
  let query = supabase
    .from('items')
    .select(`
      *,
      owner:profiles(id, full_name, avatar_url, trust_score),
      category:categories(id, name, slug)
    `)
    .eq('is_available', true)
    .order('created_at', { ascending: false });

  if (categorySlug) {
    const { data: category } = await supabase
      .from('categories')
      .select('id')
      .eq('slug', categorySlug)
      .maybeSingle();
    
    if (category) {
      query = query.eq('category_id', category.id);
    }
  }

  const { data, error } = await query;
  
  if (error) throw error;
  return data as Item[];
}

export async function getFeaturedItems() {
  const { data, error } = await supabase
    .from('items')
    .select(`
      *,
      owner:profiles(id, full_name, avatar_url, trust_score),
      category:categories(id, name, slug)
    `)
    .eq('is_available', true)
    .eq('is_featured', true)
    .order('created_at', { ascending: false })
    .limit(8);

  if (error) throw error;
  return data as Item[];
}

export async function getItemById(id: string) {
  const { data, error } = await supabase
    .from('items')
    .select(`
      *,
      owner:profiles(id, full_name, avatar_url, trust_score, bio, location, total_listings, total_rentals),
      category:categories(id, name, slug)
    `)
    .eq('id', id)
    .maybeSingle();

  if (error) throw error;
  return data as Item | null;
}

export async function createItem(item: {
  title: string;
  description?: string | null;
  category_id?: string | null;
  price_per_day: number;
  price_per_week?: number | null;
  price_per_month?: number | null;
  deposit_amount?: number | null;
  location?: string | null;
  condition?: string | null;
  images?: string[] | null;
  specifications?: Json | null;
}) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('items')
    .insert({
      title: item.title,
      description: item.description,
      category_id: item.category_id,
      price_per_day: item.price_per_day,
      price_per_week: item.price_per_week,
      price_per_month: item.price_per_month,
      deposit_amount: item.deposit_amount,
      location: item.location,
      condition: item.condition,
      images: item.images,
      specifications: item.specifications,
      owner_id: user.id,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateItem(id: string, updates: {
  title?: string;
  description?: string;
  category_id?: string;
  price_per_day?: number;
  price_per_week?: number;
  price_per_month?: number;
  deposit_amount?: number;
  location?: string;
  condition?: string;
  images?: string[];
  specifications?: Json;
  is_available?: boolean;
}) {
  const { data, error } = await supabase
    .from('items')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteItem(id: string) {
  const { error } = await supabase
    .from('items')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

export async function getMyItems() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('items')
    .select(`
      *,
      owner:profiles!items_owner_id_fkey(id, full_name, avatar_url, trust_score),
      category:categories!items_category_id_fkey(id, name, slug)
    `)
    .eq('owner_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching items:', error);
    throw error;
  }
  return data as Item[];
}

export async function uploadItemImage(file: File, itemId?: string) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const fileExt = file.name.split('.').pop();
  const folder = itemId || `temp/${user.id}`;
  const fileName = `${folder}/${Date.now()}.${fileExt}`;

  const { error: uploadError } = await supabase.storage
    .from('item-images')
    .upload(fileName, file);

  if (uploadError) throw uploadError;

  const { data } = supabase.storage
    .from('item-images')
    .getPublicUrl(fileName);

  return data.publicUrl;
}

export async function searchItems(query: string) {
  const { data, error } = await supabase
    .from('items')
    .select(`
      *,
      owner:profiles(id, full_name, avatar_url, trust_score),
      category:categories(id, name, slug)
    `)
    .eq('is_available', true)
    .or(`title.ilike.%${query}%,description.ilike.%${query}%,location.ilike.%${query}%`)
    .order('created_at', { ascending: false })
    .limit(10);

  if (error) throw error;
  return data as Item[];
}
