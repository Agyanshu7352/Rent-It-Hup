import { supabase } from '@/integrations/supabase/client';

export interface Favorite {
  id: string;
  user_id: string;
  item_id: string;
  created_at: string;
  item?: {
    id: string;
    title: string;
    images: string[];
    price_per_day: number;
    location: string | null;
    owner?: {
      id: string;
      full_name: string | null;
      avatar_url: string | null;
      trust_score: number | null;
    };
  };
}

export async function getMyFavorites() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('favorites')
    .select(`
      *,
      item:items(
        id, title, images, price_per_day, location,
        owner:profiles(id, full_name, avatar_url, trust_score)
      )
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as Favorite[];
}

export async function addFavorite(itemId: string) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('favorites')
    .insert({
      user_id: user.id,
      item_id: itemId,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function removeFavorite(itemId: string) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { error } = await supabase
    .from('favorites')
    .delete()
    .eq('user_id', user.id)
    .eq('item_id', itemId);

  if (error) throw error;
}

export async function isFavorite(itemId: string) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;

  const { data, error } = await supabase
    .from('favorites')
    .select('id')
    .eq('user_id', user.id)
    .eq('item_id', itemId)
    .maybeSingle();

  if (error) return false;
  return !!data;
}
