import { supabase } from '@/integrations/supabase/client';

export interface Review {
  id: string;
  booking_id: string;
  reviewer_id: string;
  target_id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  reviewer?: {
    id: string;
    full_name: string | null;
    avatar_url: string | null;
  };
}

export async function getReviewsForUser(userId: string) {
  const { data, error } = await supabase
    .from('reviews')
    .select(`
      *,
      reviewer:profiles!reviews_reviewer_id_fkey(id, full_name, avatar_url)
    `)
    .eq('target_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as Review[];
}

export async function createReview(review: {
  booking_id: string;
  target_id: string;
  rating: number;
  comment?: string;
}) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('reviews')
    .insert({
      ...review,
      reviewer_id: user.id,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

