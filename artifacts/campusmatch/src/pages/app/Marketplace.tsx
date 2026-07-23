import React, { useState } from 'react';
import { useGetListings, useCreateListing } from '@workspace/api-client-react';
import { GetListingsCategory, ListingInputCategory } from '@workspace/api-client-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { ShoppingCart, Plus, Loader2, Tag } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { getGetListingsQueryKey } from '@workspace/api-client-react';

const CATEGORIES = [
  { id: null, label: 'All Items' },
  { id: 'books', label: 'Books & Notes' },
  { id: 'cycles', label: 'Cycles' },
  { id: 'electronics', label: 'Electronics' },
  { id: 'furniture', label: 'Hostel Furniture' },
  { id: 'other', label: 'Other' },
];

export default function Marketplace() {
  const [selectedCat, setSelectedCat] = useState<GetListingsCategory>(null);
  const { data: listings, isLoading } = useGetListings({ category: selectedCat || undefined });
  const createMutation = useCreateListing();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: 'books' as ListingInputCategory,
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate({
      data: {
        ...formData,
        price: Number(formData.price)
      }
    }, {
      onSuccess: () => {
        toast({ title: 'Item listed successfully!' });
        setIsDialogOpen(false);
        queryClient.invalidateQueries({ queryKey: getGetListingsQueryKey({ category: selectedCat || undefined }) });
        setFormData({ title: '', description: '', price: '', category: 'books' });
      }
    });
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center">
              <ShoppingCart className="w-5 h-5 text-white" />
            </div>
            Campus Marketplace
          </h1>
          <p className="text-white/60">Buy and sell within the VGU community safely.</p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-white text-black hover:bg-white/90 rounded-full px-6">
              <Plus className="w-4 h-4 mr-2" /> Sell an Item
            </Button>
          </DialogTrigger>
          <DialogContent className="glass-card border-white/10 text-white sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-xl">List Item for Sale</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label>Item Title</Label>
                <Input required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="e.g. Engineering Mathematics 3rd Ed" className="bg-white/5 border-white/10" />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <textarea required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:ring-1 focus:ring-primary outline-none" rows={3} placeholder="Condition, why you're selling, etc." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Price (₹)</Label>
                  <Input type="number" required min="0" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} placeholder="450" className="bg-white/5 border-white/10" />
                </div>
                <div className="space-y-2">
                  <Label>Category</Label>
                  <select 
                    className="w-full h-10 bg-white/5 border border-white/10 rounded-xl px-3 text-white outline-none"
                    value={formData.category}
                    onChange={e => setFormData({...formData, category: e.target.value as ListingInputCategory})}
                  >
                    <option value="books" className="bg-background">Books</option>
                    <option value="cycles" className="bg-background">Cycles</option>
                    <option value="electronics" className="bg-background">Electronics</option>
                    <option value="furniture" className="bg-background">Furniture</option>
                    <option value="other" className="bg-background">Other</option>
                  </select>
                </div>
              </div>
              <Button type="submit" className="w-full bg-green-500 hover:bg-green-600 text-white" disabled={createMutation.isPending}>
                {createMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Post Listing'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-4 mb-4 scrollbar-hide">
        {CATEGORIES.map(cat => (
          <button
            key={cat.label}
            onClick={() => setSelectedCat(cat.id as GetListingsCategory)}
            className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-all border ${
              selectedCat === cat.id 
                ? 'bg-green-500 border-green-500 text-white' 
                : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 text-primary animate-spin" /></div>
      ) : listings?.length === 0 ? (
        <div className="glass-card p-12 text-center rounded-3xl">
          <p className="text-white/50">No items listed in this category yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {listings?.map(item => (
            <div key={item.id} className="glass-card rounded-2xl overflow-hidden flex flex-col group border border-white/5 hover:border-green-500/30 transition-colors">
              <div className="aspect-square bg-white/5 relative">
                {item.imageUrl ? (
                  <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-white/5 to-white/10">
                    <Tag className="w-10 h-10 text-white/20" />
                  </div>
                )}
                <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded-lg text-white font-bold text-sm">
                  ₹{item.price}
                </div>
              </div>
              <div className="p-4 flex flex-col flex-1">
                <h3 className="font-bold text-white text-sm line-clamp-1 mb-1">{item.title}</h3>
                <p className="text-white/40 text-xs line-clamp-2 mb-3 flex-1">{item.description}</p>
                <div className="flex items-center justify-between mt-auto pt-3 border-t border-white/5">
                  <span className="text-xs text-white/50">{item.sellerName}</span>
                  <Button size="sm" variant="ghost" className="h-7 text-xs bg-white/5 hover:bg-green-500/20 hover:text-green-400 text-white">Contact</Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
