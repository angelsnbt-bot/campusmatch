import React, { useState } from 'react';
import { useGetListings, useCreateListing } from '@workspace/api-client-react';
import { GetListingsCategory, ListingInputCategory } from '@workspace/api-client-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { ShoppingCart, Plus, Loader2, Tag, Phone, MessageCircle, BookOpen, Search, X } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { getGetListingsQueryKey } from '@workspace/api-client-react';
import { useAuth } from '@/hooks/use-auth';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';

const CATEGORIES = [
  { id: null,          label: 'All Items',        emoji: '🛒' },
  { id: 'books',       label: 'Books & Notes',    emoji: '📚' },
  { id: 'cycles',      label: 'Cycles',           emoji: '🚲' },
  { id: 'electronics', label: 'Electronics',      emoji: '💻' },
  { id: 'furniture',   label: 'Hostel Furniture', emoji: '🛋️' },
  { id: 'other',       label: 'Other',            emoji: '📦' },
];

const CATEGORY_COLORS: Record<string, string> = {
  books:       'from-amber-500 to-orange-600',
  cycles:      'from-green-500 to-emerald-600',
  electronics: 'from-blue-500 to-indigo-600',
  furniture:   'from-purple-500 to-violet-600',
  other:       'from-gray-500 to-slate-600',
};

interface ContactDialogProps {
  item: any;
  open: boolean;
  onClose: () => void;
}

function ContactSellerDialog({ item, open, onClose }: ContactDialogProps) {
  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="bg-[hsl(278,70%,5%)] border border-white/10 text-white max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-lg">Contact Seller</DialogTitle>
        </DialogHeader>
        <div className="mt-2 space-y-4">
          {/* Item preview */}
          <div className="flex gap-3 p-3 bg-white/5 rounded-xl border border-white/8">
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${CATEGORY_COLORS[item.category] || 'from-gray-500 to-slate-600'} flex items-center justify-center shrink-0`}>
              <span className="text-xl">{CATEGORIES.find(c => c.id === item.category)?.emoji || '📦'}</span>
            </div>
            <div className="overflow-hidden">
              <p className="font-semibold text-white text-sm line-clamp-1">{item.title}</p>
              <p className="text-primary font-bold">₹{item.price}</p>
              <p className="text-white/40 text-xs">Sold by {item.sellerName}</p>
            </div>
          </div>

          {/* Contact options */}
          <div className="space-y-2">
            <p className="text-xs text-white/50 font-medium uppercase tracking-wider">Reach out via</p>
            <a
              href={`tel:${item.sellerPhone || ''}`}
              className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
            >
              <div className="w-9 h-9 rounded-lg bg-green-500/20 flex items-center justify-center">
                <Phone className="w-4 h-4 text-green-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-white">Call Seller</p>
                <p className="text-xs text-white/40">{item.sellerPhone ? item.sellerPhone : 'Login to view'}</p>
              </div>
            </a>
            <a
              href={`https://wa.me/91${(item.sellerPhone || '').replace(/\D/g, '')}?text=Hi! I'm interested in your listing: ${encodeURIComponent(item.title)} (₹${item.price}) on CampusMatch.`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-green-500/10 hover:border-green-500/30 transition-colors"
            >
              <div className="w-9 h-9 rounded-lg bg-green-500/20 flex items-center justify-center">
                <MessageCircle className="w-4 h-4 text-green-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-white">WhatsApp</p>
                <p className="text-xs text-white/40">Message instantly</p>
              </div>
            </a>
          </div>

          <p className="text-xs text-white/30 text-center">
            🔒 Only verified VGU students can view seller contacts
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function Marketplace() {
  const { user } = useAuth();
  const [selectedCat, setSelectedCat] = useState<GetListingsCategory>(null);
  const [search, setSearch] = useState('');
  const { data: listings, isLoading } = useGetListings({ category: selectedCat || undefined });
  const createMutation = useCreateListing();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [contactItem, setContactItem] = useState<any | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: 'books' as ListingInputCategory,
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const price = Number(formData.price);
    if (!price || price < 1) {
      toast({ title: 'Invalid price', description: 'Price must be greater than 0.', variant: 'destructive' });
      return;
    }
    createMutation.mutate({
      data: { ...formData, price }
    }, {
      onSuccess: () => {
        toast({ title: '✅ Item listed!', description: 'Your item is now visible to all VGU students.' });
        setIsDialogOpen(false);
        queryClient.invalidateQueries({ queryKey: getGetListingsQueryKey({ category: selectedCat || undefined }) });
        setFormData({ title: '', description: '', price: '', category: 'books' });
      },
      onError: (err) => {
        toast({ title: 'Failed to list', description: (err?.data as any)?.error || err?.message || 'Try again.', variant: 'destructive' });
      }
    });
  };

  const filtered = listings?.filter(item =>
    !search || item.title.toLowerCase().includes(search.toLowerCase()) || item.description.toLowerCase().includes(search.toLowerCase())
  ) ?? [];

  // Separate books for featured section
  const books = filtered.filter(l => l.category === 'books');
  const nonBooks = filtered.filter(l => l.category !== 'books');
  const showAll = selectedCat !== null || search !== '';
  const displayItems = showAll ? filtered : filtered;

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-green-500/30">
              <ShoppingCart className="w-5 h-5 text-white" />
            </div>
            Campus Marketplace
          </h1>
          <p className="text-white/50 text-sm">Buy & sell within the VGU community — verified students only</p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-green-500 to-emerald-600 hover:opacity-90 text-white border-0 rounded-xl px-5 h-10 font-semibold shadow-lg shadow-green-500/25">
              <Plus className="w-4 h-4 mr-2" /> Sell an Item
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-[hsl(278,70%,5%)] border border-white/10 text-white sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-xl">List Item for Sale</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4 mt-4">
              <div className="space-y-1.5">
                <Label className="text-white/70 text-sm">Item Title *</Label>
                <Input required value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Engineering Mathematics 3rd Ed" className="bg-white/5 border-white/10 h-11" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-white/70 text-sm">Description *</Label>
                <textarea
                  required
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white text-sm focus:ring-1 focus:ring-primary outline-none resize-none"
                  rows={3}
                  placeholder="Condition, edition, why selling..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-white/70 text-sm">Price (₹) *</Label>
                  <Input type="number" required min="1" value={formData.price}
                    onChange={e => setFormData({ ...formData, price: e.target.value })}
                    placeholder="450" className="bg-white/5 border-white/10 h-11" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-white/70 text-sm">Category *</Label>
                  <select
                    className="w-full h-11 bg-white/5 border border-white/10 rounded-xl px-3 text-white text-sm outline-none focus:ring-1 focus:ring-primary"
                    value={formData.category}
                    onChange={e => setFormData({ ...formData, category: e.target.value as ListingInputCategory })}
                  >
                    <option value="books" className="bg-[#0d0014]">📚 Books</option>
                    <option value="cycles" className="bg-[#0d0014]">🚲 Cycles</option>
                    <option value="electronics" className="bg-[#0d0014]">💻 Electronics</option>
                    <option value="furniture" className="bg-[#0d0014]">🛋️ Furniture</option>
                    <option value="other" className="bg-[#0d0014]">📦 Other</option>
                  </select>
                </div>
              </div>
              <div className="p-3 rounded-xl bg-green-500/5 border border-green-500/20 text-xs text-white/50">
                💡 Your phone number will be shared with buyers so they can contact you directly.
              </div>
              <Button type="submit" className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:opacity-90 text-white border-0 h-11 font-semibold" disabled={createMutation.isPending}>
                {createMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : '✅ Post Listing'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search + Categories */}
      <div className="flex flex-col gap-3 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search books, cycles, electronics…"
            className="w-full h-11 pl-10 pr-10 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder:text-white/25 outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500/50 transition-all"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {CATEGORIES.map(cat => (
            <button
              key={String(cat.id)}
              onClick={() => setSelectedCat(cat.id as GetListingsCategory)}
              className={`whitespace-nowrap flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all border ${
                selectedCat === cat.id
                  ? 'bg-green-500 border-green-500 text-white shadow-lg shadow-green-500/25'
                  : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10 hover:text-white'
              }`}
            >
              {cat.emoji} {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Books spotlight (when no filter) */}
      {!selectedCat && !search && books.length > 0 && (
        <section className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg font-bold text-white">Second-Hand Books</h2>
            <span className="px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-400 text-xs font-semibold">{books.length} available</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {books.map(item => (
              <ListingCard key={item.id} item={item} onContact={() => setContactItem(item)} highlight />
            ))}
          </div>
        </section>
      )}

      {/* All / filtered listings */}
      {isLoading ? (
        <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" /></div>
      ) : displayItems.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-4xl mb-4">🛒</div>
          <p className="text-white/40 font-medium">No items found</p>
          <p className="text-white/25 text-sm mt-1">Be the first to list something!</p>
        </div>
      ) : (
        <section>
          {(!selectedCat && !search && books.length > 0) && (
            <h2 className="text-lg font-bold text-white mb-4">All Listings</h2>
          )}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {(showAll || books.length === 0 ? displayItems : nonBooks).map(item => (
              <ListingCard key={item.id} item={item} onContact={() => setContactItem(item)} />
            ))}
          </div>
        </section>
      )}

      {/* Contact dialog */}
      {contactItem && (
        <ContactSellerDialog item={contactItem} open={!!contactItem} onClose={() => setContactItem(null)} />
      )}
    </div>
  );
}

function ListingCard({ item, onContact, highlight }: { item: any; onContact: () => void; highlight?: boolean }) {
  const gradClass = CATEGORY_COLORS[item.category] || 'from-gray-500 to-slate-600';
  const catEmoji = CATEGORIES.find(c => c.id === item.category)?.emoji || '📦';
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white/[0.04] rounded-2xl overflow-hidden flex flex-col border transition-all hover:-translate-y-0.5 ${
        highlight ? 'border-amber-500/20 hover:border-amber-500/40' : 'border-white/8 hover:border-white/20'
      }`}
    >
      {/* Image / placeholder */}
      <div className="aspect-[4/3] relative overflow-hidden">
        {item.imageUrl ? (
          <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
        ) : (
          <div className={`w-full h-full bg-gradient-to-br ${gradClass} flex items-center justify-center opacity-60`}>
            <span className="text-4xl">{catEmoji}</span>
          </div>
        )}
        {/* Price badge */}
        <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm px-2.5 py-1 rounded-lg">
          <span className="text-white font-bold text-sm">₹{item.price}</span>
        </div>
        {/* Category badge */}
        <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-sm text-white/70 text-[10px] font-medium capitalize">
          {item.category}
        </div>
      </div>

      <div className="p-3 flex flex-col flex-1 gap-2">
        <div>
          <h3 className="font-semibold text-white text-sm line-clamp-1">{item.title}</h3>
          <p className="text-white/40 text-xs line-clamp-2 mt-0.5">{item.description}</p>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-white/5 mt-auto">
          <div>
            <p className="text-xs text-white/50 font-medium">{item.sellerName}</p>
          </div>
          <Button
            size="sm"
            onClick={onContact}
            className="h-7 px-3 text-xs bg-gradient-to-r from-blue-500/80 to-indigo-500/80 hover:opacity-90 text-white border-0 rounded-lg font-medium"
          >
            Contact
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
