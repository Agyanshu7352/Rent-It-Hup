import { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { format } from 'date-fns';
import { ArrowLeft, Search, MessageSquare, MoreVertical, SendHorizonal } from 'lucide-react';
import { motion } from 'framer-motion';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/useAuth';
import { getConversations, sendMessage, markAsRead, subscribeToMessages, type Message } from '@/lib/api/messages';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface Conversation {
  id: string;
  partnerId: string;
  partnerName: string;
  partnerAvatar: string | null;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  messages: Message[];
}

const Messages = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const hasAutoSelected = useRef(false);

  const ownerIdFromUrl = searchParams.get('owner');
  const itemIdFromUrl = searchParams.get('item');

  const { data: messages = [], isLoading } = useQuery({
    queryKey: ['conversations'],
    queryFn: getConversations,
    enabled: !!user,
  });

  // Group messages into conversations
  const conversations: Conversation[] = messages.reduce((acc: Conversation[], message) => {
    const partnerId = message.sender_id === user?.id ? message.receiver_id : message.sender_id;
    const partner = message.sender_id === user?.id ? message.receiver : message.sender;

    let conversation = acc.find(c => c.partnerId === partnerId);
    if (!conversation) {
      conversation = {
        id: partnerId,
        partnerId,
        partnerName: partner?.full_name || 'Unknown User',
        partnerAvatar: partner?.avatar_url || null,
        lastMessage: message.content,
        lastMessageTime: message.created_at,
        unreadCount: 0,
        messages: [],
      };
      acc.push(conversation);
    }

    if (new Date(message.created_at) > new Date(conversation.lastMessageTime)) {
      conversation.lastMessage = message.content;
      conversation.lastMessageTime = message.created_at;
    }

    conversation.messages.push(message);
    if (!message.is_read && message.receiver_id === user?.id) {
      conversation.unreadCount++;
    }

    return acc;
  }, []);

  conversations.sort((a, b) => new Date(b.lastMessageTime).getTime() - new Date(a.lastMessageTime).getTime());

  const filteredConversations = conversations.filter(c =>
    c.partnerName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    hasAutoSelected.current = false;
  }, [ownerIdFromUrl]);

  useEffect(() => {
    if (!ownerIdFromUrl || !user || hasAutoSelected.current || isLoading) return;

    const existingConversation = conversations.find(c => c.partnerId === ownerIdFromUrl);

    if (existingConversation) {
      setSelectedConversation(existingConversation);
      hasAutoSelected.current = true;
    } else {
      const fetchOwner = async () => {
        try {
          const { data: ownerData } = await supabase
            .from('profiles')
            .select('id, full_name, avatar_url')
            .eq('id', ownerIdFromUrl)
            .single();

          if (ownerData) {
            setSelectedConversation({
              id: ownerData.id,
              partnerId: ownerData.id,
              partnerName: ownerData.full_name || 'Unknown User',
              partnerAvatar: ownerData.avatar_url || null,
              lastMessage: '',
              lastMessageTime: new Date().toISOString(),
              unreadCount: 0,
              messages: [],
            });

            if (itemIdFromUrl) {
              setNewMessage('Hi! I\'m interested in renting your item.');
            }

            hasAutoSelected.current = true;
          }
        } catch (error) {
          console.error('Error fetching owner:', error);
        }
      };

      fetchOwner();
    }
  }, [ownerIdFromUrl, itemIdFromUrl, user, isLoading]);

  useEffect(() => {
    if (!selectedConversation) return;
    const updated = conversations.find(c => c.partnerId === selectedConversation.partnerId);
    if (updated) {
      setSelectedConversation(updated);
    }
  }, [messages]);

  const selectedMessages = selectedConversation?.messages
    .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()) || [];

  const sendMessageMutation = useMutation({
    mutationFn: sendMessage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
      setNewMessage('');
      setTimeout(() => {
        if (messagesEndRef.current) {
          messagesEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
        }
      }, 100);
    },
  });

  useEffect(() => {
    if (!user) return;
    const unsubscribe = subscribeToMessages(user.id, () => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    });
    return unsubscribe;
  }, [user, queryClient]);

  useEffect(() => {
    if (!selectedConversation) return;
    selectedConversation.messages
      .filter(m => !m.is_read && m.receiver_id === user?.id)
      .forEach(m => markAsRead(m.id));
  }, [selectedConversation?.id]);

  useEffect(() => {
    if (!selectedConversation) return;
    setTimeout(() => {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
      }
    }, 200);
  }, [selectedConversation?.id]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation) return;

    sendMessageMutation.mutate({
      receiver_id: selectedConversation.partnerId,
      content: newMessage.trim(),
      item_id: itemIdFromUrl || undefined,
    });
  };

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

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return format(date, 'h:mm a');
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    }
    return format(date, 'MMM d');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="flex-1 pt-20 md:pt-24">
        <div className="container mx-auto px-4 py-8">
          <div 
            className="bg-card rounded-2xl shadow-card overflow-hidden border border-border flex"
            style={{ height: 'calc(100vh - 200px)', minHeight: '500px' }}
          >
            
            {/* LEFT SIDEBAR - Always visible on desktop (md and up) */}
            <div 
              className={`w-full md:w-[380px] border-r border-border flex flex-col flex-shrink-0 ${
                selectedConversation ? 'hidden md:flex' : 'flex'
              }`}
            >
              {/* Header */}
              <div className="p-4 border-b border-border bg-muted/20">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="font-semibold text-xl">Chats</h2>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreVertical className="h-5 w-5" />
                  </Button>
                </div>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 h-9 text-sm"
                  />
                </div>
              </div>

              {/* Conversations */}
              <div className="flex-1 overflow-y-auto">
                {isLoading ? (
                  <div className="p-4 space-y-3">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="animate-pulse flex gap-3">
                        <div className="w-12 h-12 rounded-full bg-muted" />
                        <div className="flex-1 space-y-2">
                          <div className="h-4 w-32 bg-muted rounded" />
                          <div className="h-3 w-full bg-muted rounded" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : filteredConversations.length === 0 ? (
                  <div className="p-8 text-center text-muted-foreground">
                    <MessageSquare className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p className="font-medium">No conversations</p>
                  </div>
                ) : (
                  filteredConversations.map(conversation => (
                    <button
                      key={conversation.id}
                      onClick={() => setSelectedConversation(conversation)}
                      className={`w-full p-3 flex gap-3 hover:bg-muted/50 transition-colors text-left border-b border-border/50 ${
                        selectedConversation?.id === conversation.id ? 'bg-muted' : ''
                      }`}
                    >
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={conversation.partnerAvatar || undefined} />
                        <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                          {conversation.partnerName.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <p className="font-semibold truncate">{conversation.partnerName}</p>
                          <span className="text-xs text-muted-foreground">
                            {formatTime(conversation.lastMessageTime)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-sm text-muted-foreground truncate">
                            {conversation.lastMessage || 'No messages'}
                          </p>
                          {conversation.unreadCount > 0 && (
                            <span className="bg-primary text-primary-foreground text-xs font-bold min-w-[20px] h-5 px-1.5 flex items-center justify-center rounded-full">
                              {conversation.unreadCount}
                            </span>
                          )}
                        </div>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>

            {/* RIGHT SIDE - Chat */}
            <div 
              className={`flex-1 flex flex-col ${
                !selectedConversation ? 'hidden md:flex' : 'flex'
              }`}
            >
              {selectedConversation ? (
                <>
                  {/* CHAT HEADER - Always visible */}
                  <div className="px-4 py-3 border-b border-border flex items-center gap-3 bg-muted/20">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="md:hidden"
                      onClick={() => setSelectedConversation(null)}
                    >
                      <ArrowLeft className="h-5 w-5" />
                    </Button>

                    <Avatar className="h-10 w-10">
                      <AvatarImage src={selectedConversation.partnerAvatar || undefined} />
                      <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                        {selectedConversation.partnerName.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1">
                      <p className="font-semibold">{selectedConversation.partnerName}</p>
                      <p className="text-xs text-muted-foreground">
                        {selectedMessages.length} messages
                      </p>
                    </div>

                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-5 w-5" />
                    </Button>
                  </div>

                  {/* MESSAGES - Scrollable area */}
                  <div 
                    className="flex-1 p-4 overflow-y-auto"
                    style={{ minHeight: 0 }}
                  >
                    {selectedMessages.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-full">
                        <Avatar className="h-20 w-20 mb-4">
                          <AvatarImage src={selectedConversation.partnerAvatar || undefined} />
                          <AvatarFallback className="bg-primary/10 text-primary text-2xl font-semibold">
                            {selectedConversation.partnerName.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <p className="font-semibold text-lg">{selectedConversation.partnerName}</p>
                        <p className="text-sm text-muted-foreground mt-1">Start your conversation</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {selectedMessages.map((message) => (
                          <motion.div
                            key={message.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`flex ${message.sender_id === user?.id ? 'justify-end' : 'justify-start'}`}
                          >
                            <div
                              className={`max-w-[70%] rounded-lg px-3 py-2 ${
                                message.sender_id === user?.id
                                  ? 'bg-primary text-primary-foreground'
                                  : 'bg-muted'
                              }`}
                            >
                              <p className="text-sm">{message.content}</p>
                              <p className={`text-xs mt-1 ${
                                message.sender_id === user?.id
                                  ? 'text-primary-foreground/70'
                                  : 'text-muted-foreground'
                              }`}>
                                {format(new Date(message.created_at), 'h:mm a')}
                                {message.sender_id === user?.id && (
                                  <span className="ml-1">{message.is_read ? '✓✓' : '✓'}</span>
                                )}
                              </p>
                            </div>
                          </motion.div>
                        ))}
                        <div ref={messagesEndRef} />
                      </div>
                    )}
                  </div>

                  {/* INPUT */}
                  <div className="p-4 border-t border-border">
                    <form onSubmit={handleSendMessage} className="flex gap-1.5">
                      <Input
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1"
                      />
                      <Button type="submit" disabled={!newMessage.trim()}>
                        <SendHorizonal className="h-6 w-6 scale-180 px-0"/>
                      </Button>
                    </form>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center text-muted-foreground">
                    <MessageSquare className="h-20 w-20 mx-auto mb-4 opacity-20" />
                    <p className="font-semibold text-lg">Select a chat</p>
                    <p className="text-sm mt-1">Choose a conversation to start messaging</p>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Messages;