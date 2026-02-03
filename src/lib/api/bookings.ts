import { supabase } from '@/integrations/supabase/client';

export type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';

export interface Booking {
  id: string;
  item_id: string;
  renter_id: string;
  status: BookingStatus;
  start_date: string;
  end_date: string;
  total_price: number;
  deposit_paid: number | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  item?: {
    id: string;
    title: string;
    images: string[];
    price_per_day: number;
    owner_id: string;
    owner?: {
      id: string;
      full_name: string | null;
      avatar_url: string | null;
    };
  };
  renter?: {
    id: string;
    full_name: string | null;
    avatar_url: string | null;
  };
}

export async function getMyBookings() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('bookings')
    .select(`
      *,
      item:items!bookings_item_id_fkey(
        id, 
        title, 
        images, 
        price_per_day,
        owner:profiles!items_owner_id_fkey(id, full_name, avatar_url)
      ),
      renter:profiles!bookings_renter_id_fkey(id, full_name, avatar_url)
    `)
    .eq('renter_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching bookings:', error);
    throw error;
  }
  return data as Booking[];
}

export async function createBooking(booking: {
  item_id: string;
  start_date: string;
  end_date: string;
  total_price: number;
  notes?: string;
}) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('bookings')
    .insert({
      ...booking,
      renter_id: user.id,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateBookingStatus(id: string, status: BookingStatus) {
  const { data, error } = await supabase
    .from('bookings')
    .update({ status })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getMyRentals() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('bookings')
    .select(`
      *,
      item:items!bookings_item_id_fkey(id, title, images, price_per_day),
      renter:profiles!bookings_renter_id_fkey(id, full_name, avatar_url)
    `)
    .eq('owner_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching rentals:', error);
    throw error;
  }
  return data as Booking[];
}