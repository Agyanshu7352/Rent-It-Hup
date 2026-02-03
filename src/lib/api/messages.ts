import { supabase } from '@/integrations/supabase/client';

export interface Message {
  id: string;
  booking_id: string | null;
  sender_id: string;
  receiver_id: string;
  item_id: string | null;
  content: string;
  is_read: boolean;
  created_at: string;
  sender?: {
    id: string;
    full_name: string | null;
    avatar_url: string | null;
  };
  receiver?: {
    id: string;
    full_name: string | null;
    avatar_url: string | null;
  };
}

export async function getConversations(): Promise<Message[]> {
  // ✅ Step 1: Get the current user first
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  // ✅ Step 2: Fetch messages
  const { data: messages, error } = await supabase
    .from('messages')
    .select('*')
    .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching messages:', error);
    throw error;
  }

  if (!messages || messages.length === 0) return [];

  // ✅ Step 3: Get all unique partner IDs
  const partnerIds = [...new Set(
    messages.map(m => m.sender_id === user.id ? m.receiver_id : m.sender_id)
  )];

  // ✅ Step 4: Fetch all partner profiles in one query
  const { data: profiles } = await supabase
    .from('profiles')
    .select('id, full_name, avatar_url')
    .in('id', partnerIds);

  // ✅ Step 5: Attach profiles to messages
  const messagesWithProfiles: Message[] = messages.map(msg => ({
    ...msg,
    sender: profiles?.find(p => p.id === msg.sender_id) || undefined,
    receiver: profiles?.find(p => p.id === msg.receiver_id) || undefined,
  }));

  return messagesWithProfiles;
}

export async function sendMessage(message: {
  receiver_id: string;
  content: string;
  booking_id?: string;
  item_id?: string;
}) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('messages')
    .insert({
      ...message,
      sender_id: user.id,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function markAsRead(messageId: string) {
  const { error } = await supabase
    .from('messages')
    .update({ is_read: true })
    .eq('id', messageId);

  if (error) throw error;
}

export function subscribeToMessages(userId: string, callback: (message: Message) => void) {
  const channel = supabase
    .channel('messages-realtime')
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `receiver_id=eq.${userId}`,
      },
      (payload) => callback(payload.new as Message)
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}