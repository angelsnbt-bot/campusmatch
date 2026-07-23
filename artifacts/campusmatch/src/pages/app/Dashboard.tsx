import React, { useState } from 'react';
import { useGetPosts, useCreatePost, useLikePost, useGetAnnouncements, getGetPostsQueryKey } from '@workspace/api-client-react';
import { PostInputCategory } from '@workspace/api-client-react';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, MessageSquare, Send, Image as ImageIcon, Flame, Bell, Pin, Megaphone, Loader2 } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { formatDistanceToNow } from 'date-fns';

const CATEGORIES = [
  { id: null, label: 'All Campus' },
  { id: 'general', label: 'General' },
  { id: 'study', label: 'Study' },
  { id: 'sports', label: 'Sports' },
  { id: 'hackathon', label: 'Hackathons' },
  { id: 'events', label: 'Events' },
];

export default function Dashboard() {
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<PostInputCategory | null>(null);
  const [newPostContent, setNewPostContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: posts, isLoading: isLoadingPosts } = useGetPosts({ category: selectedCategory || undefined });
  const { data: announcements, isLoading: isLoadingAnnouncements } = useGetAnnouncements();
  
  const createPost = useCreatePost();
  const likePost = useLikePost();

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostContent.trim()) return;
    
    setIsSubmitting(true);
    createPost.mutate(
      { data: { content: newPostContent, category: selectedCategory || 'general' } },
      {
        onSuccess: () => {
          setNewPostContent('');
          queryClient.invalidateQueries({ queryKey: getGetPostsQueryKey({ category: selectedCategory || undefined }) });
          toast({ title: 'Post created!' });
        },
        onError: () => {
          toast({ title: 'Failed to post', variant: 'destructive' });
        },
        onSettled: () => setIsSubmitting(false)
      }
    );
  };

  const handleLike = (postId: number) => {
    likePost.mutate(
      { postId },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getGetPostsQueryKey({ category: selectedCategory || undefined }) });
        }
      }
    );
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Main Feed */}
        <div className="flex-1 space-y-6">
          
          {/* Create Post */}
          <div className="glass-card p-4 rounded-2xl">
            <form onSubmit={handleCreatePost}>
              <div className="flex gap-4">
                <div className="w-10 h-10 shrink-0 rounded-full bg-primary/20 overflow-hidden border border-primary/30">
                  {user?.avatarUrl ? (
                    <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-primary font-bold">
                      {user?.name?.charAt(0)}
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <Input 
                    value={newPostContent}
                    onChange={(e) => setNewPostContent(e.target.value)}
                    placeholder="What's happening on campus?"
                    className="bg-transparent border-none text-white focus-visible:ring-0 focus-visible:ring-offset-0 px-0 placeholder:text-white/40 text-lg"
                  />
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/5">
                    <div className="flex gap-2">
                      <Button type="button" variant="ghost" size="sm" className="text-white/60 hover:text-primary hover:bg-primary/10 rounded-full h-8 px-3">
                        <ImageIcon className="w-4 h-4 mr-2" /> Photo
                      </Button>
                      <select 
                        className="bg-white/5 border border-white/10 text-white text-sm rounded-full px-3 py-1 outline-none focus:ring-1 focus:ring-primary"
                        value={selectedCategory || 'general'}
                        onChange={(e) => setSelectedCategory(e.target.value as PostInputCategory)}
                      >
                        <option value="general" className="bg-background">General</option>
                        <option value="study" className="bg-background">Study</option>
                        <option value="hackathon" className="bg-background">Hackathon</option>
                        <option value="sports" className="bg-background">Sports</option>
                        <option value="events" className="bg-background">Events</option>
                      </select>
                    </div>
                    <Button 
                      type="submit" 
                      disabled={!newPostContent.trim() || isSubmitting}
                      className="rounded-full bg-gradient-to-r from-primary to-secondary text-white border-0 shadow-lg shadow-primary/20 h-8 px-4"
                    >
                      {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Send className="w-3 h-3 mr-2" /> Post</>}
                    </Button>
                  </div>
                </div>
              </div>
            </form>
          </div>

          {/* Filters */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {CATEGORIES.map(cat => (
              <button
                key={cat.label}
                onClick={() => setSelectedCategory(cat.id as PostInputCategory)}
                className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedCategory === cat.id 
                    ? 'bg-white text-black shadow-md' 
                    : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Posts Feed */}
          <div className="space-y-4">
            {isLoadingPosts ? (
              <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 text-primary animate-spin" /></div>
            ) : posts?.length === 0 ? (
              <div className="glass-card p-12 text-center rounded-2xl">
                <p className="text-white/50">No posts in this category yet.</p>
                <p className="text-white/30 text-sm mt-2">Be the first to post something!</p>
              </div>
            ) : (
              <AnimatePresence>
                {posts?.map((post) => (
                  <motion.div 
                    key={post.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-card p-5 rounded-2xl"
                  >
                    <div className="flex gap-3 mb-3">
                      <div className="w-10 h-10 rounded-full bg-white/10 overflow-hidden shrink-0">
                        {post.authorAvatarUrl ? (
                          <img src={post.authorAvatarUrl} alt={post.authorName} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-white/50 text-sm">
                            {post.authorName?.charAt(0) || '?'}
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-white text-sm">{post.authorName}</h4>
                          <span className="text-xs text-white/40">•</span>
                          <span className="text-xs text-white/40">{formatDistanceToNow(new Date(post.createdAt))} ago</span>
                        </div>
                        <div className="text-xs text-primary bg-primary/10 px-2 py-0.5 rounded-full inline-block mt-1">
                          {post.category}
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-white/90 text-sm whitespace-pre-wrap mb-4">{post.content}</p>
                    
                    {post.imageUrl && (
                      <div className="rounded-xl overflow-hidden mb-4 border border-white/10">
                        <img src={post.imageUrl} alt="Post content" className="w-full h-auto object-cover max-h-96" />
                      </div>
                    )}
                    
                    <div className="flex items-center gap-6 pt-3 border-t border-white/5">
                      <button 
                        onClick={() => handleLike(post.id)}
                        className={`flex items-center gap-1.5 text-sm transition-colors ${
                          post.isLiked ? 'text-primary' : 'text-white/50 hover:text-white'
                        }`}
                      >
                        <Heart className={`w-5 h-5 ${post.isLiked ? 'fill-primary' : ''}`} />
                        <span>{post.likeCount}</span>
                      </button>
                      <button className="flex items-center gap-1.5 text-sm text-white/50 hover:text-white transition-colors">
                        <MessageSquare className="w-5 h-5" />
                        <span>Reply</span>
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-full lg:w-80 space-y-6">
          {/* Announcements */}
          <div className="glass-card p-5 rounded-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/10 rounded-full blur-3xl" />
            <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
              <Megaphone className="w-5 h-5 text-secondary" />
              Campus Alerts
            </h3>
            
            <div className="space-y-4">
              {isLoadingAnnouncements ? (
                <Loader2 className="w-5 h-5 text-white/50 animate-spin mx-auto" />
              ) : announcements?.slice(0, 3).map((ann) => (
                <div key={ann.id} className="relative pl-4 border-l-2 border-secondary/50">
                  <div className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-secondary" />
                  <h4 className="text-sm font-semibold text-white">{ann.title}</h4>
                  <p className="text-xs text-white/60 line-clamp-2 mt-1">{ann.content}</p>
                </div>
              ))}
              {announcements?.length === 0 && (
                <p className="text-sm text-white/50">No new announcements.</p>
              )}
            </div>
          </div>

          {/* Quick Links / Trending */}
          <div className="glass-card p-5 rounded-2xl">
            <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
              <Flame className="w-5 h-5 text-orange-500" />
              Trending Modules
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white/5 hover:bg-white/10 p-3 rounded-xl border border-white/5 transition-colors cursor-pointer text-center">
                <div className="text-2xl mb-1">💗</div>
                <div className="text-xs font-medium text-white/80">Dating</div>
              </div>
              <div className="bg-white/5 hover:bg-white/10 p-3 rounded-xl border border-white/5 transition-colors cursor-pointer text-center">
                <div className="text-2xl mb-1">💻</div>
                <div className="text-xs font-medium text-white/80">Hackathons</div>
              </div>
              <div className="bg-white/5 hover:bg-white/10 p-3 rounded-xl border border-white/5 transition-colors cursor-pointer text-center">
                <div className="text-2xl mb-1">📚</div>
                <div className="text-xs font-medium text-white/80">Study</div>
              </div>
              <div className="bg-white/5 hover:bg-white/10 p-3 rounded-xl border border-white/5 transition-colors cursor-pointer text-center">
                <div className="text-2xl mb-1">🛒</div>
                <div className="text-xs font-medium text-white/80">Marketplace</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
