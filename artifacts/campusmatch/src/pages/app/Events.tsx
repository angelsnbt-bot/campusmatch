import React from 'react';
import { useGetEvents, useCreateEvent, useRsvpEvent } from '@workspace/api-client-react';
import { EventInputCategory } from '@workspace/api-client-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { CalendarDays, MapPin, Users, Plus, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { useQueryClient } from '@tanstack/react-query';
import { getGetEventsQueryKey } from '@workspace/api-client-react';

export default function Events() {
  const { data: events, isLoading } = useGetEvents();
  const rsvpMutation = useRsvpEvent();
  const createMutation = useCreateEvent();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);

  const [formData, setFormData] = React.useState({
    title: '',
    description: '',
    date: '',
    venue: '',
    category: 'social' as EventInputCategory
  });

  const handleRsvp = (id: number) => {
    rsvpMutation.mutate({ eventId: id }, {
      onSuccess: () => {
        toast({ title: 'RSVP successful!' });
        queryClient.invalidateQueries({ queryKey: getGetEventsQueryKey() });
      }
    });
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate({ data: formData }, {
      onSuccess: () => {
        toast({ title: 'Event created!' });
        setIsDialogOpen(false);
        queryClient.invalidateQueries({ queryKey: getGetEventsQueryKey() });
        setFormData({ title: '', description: '', date: '', venue: '', category: 'social' });
      }
    });
  };

  const categoryColors: Record<string, string> = {
    hackathon: 'bg-pink-500/20 text-pink-400 border-pink-500/30',
    sports: 'bg-pink-400/20 text-pink-300 border-pink-400/30',
    cultural: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    academic: 'bg-pink-600/20 text-pink-300 border-pink-600/30',
    social: 'bg-pink-500/15 text-pink-300 border-pink-500/25',
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3" style={{ fontFamily: 'Outfit' }}>
            <div className="w-10 h-10 rounded-xl bg-[#ec4899] flex items-center justify-center shadow-lg shadow-pink-500/20">
              <CalendarDays className="w-5 h-5 text-white" />
            </div>
            Campus Events
          </h1>
          <p className="text-white/60" style={{ fontFamily: 'Inter' }}>Discover and join what's happening at VGU.</p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#ec4899] text-white hover:bg-[#db2777] rounded-full px-6 shadow-lg shadow-pink-500/20" style={{ fontFamily: 'Cabin' }}>
              <Plus className="w-4 h-4 mr-2" /> Host Event
            </Button>
          </DialogTrigger>
          <DialogContent className="glass-card border-white/10 text-white sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-xl" style={{ fontFamily: 'Outfit' }}>Host an Event</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label className="text-white/80" style={{ fontFamily: 'Outfit' }}>Event Title</Label>
                <Input required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="bg-white/5 border-white/10" />
              </div>
              <div className="space-y-2">
                <Label className="text-white/80" style={{ fontFamily: 'Outfit' }}>Description</Label>
                <textarea required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:ring-1 focus:ring-[#ec4899] outline-none" rows={3} style={{ fontFamily: 'Inter' }} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-white/80" style={{ fontFamily: 'Outfit' }}>Date & Time</Label>
                  <Input type="datetime-local" required value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="bg-white/5 border-white/10" />
                </div>
                <div className="space-y-2">
                  <Label className="text-white/80" style={{ fontFamily: 'Outfit' }}>Venue</Label>
                  <Input required value={formData.venue} onChange={e => setFormData({...formData, venue: e.target.value})} className="bg-white/5 border-white/10" />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-white/80" style={{ fontFamily: 'Outfit' }}>Category</Label>
                <select 
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-2.5 text-white outline-none"
                  value={formData.category}
                  onChange={e => setFormData({...formData, category: e.target.value as EventInputCategory})}
                >
                  <option value="social" className="bg-[#0d0810]">Social</option>
                  <option value="hackathon" className="bg-[#0d0810]">Hackathon</option>
                  <option value="sports" className="bg-[#0d0810]">Sports</option>
                  <option value="cultural" className="bg-[#0d0810]">Cultural</option>
                  <option value="academic" className="bg-[#0d0810]">Academic</option>
                </select>
              </div>
              <Button type="submit" className="w-full bg-[#ec4899] hover:bg-[#db2777] text-white" disabled={createMutation.isPending} style={{ fontFamily: 'Cabin' }}>
                {createMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Create Event'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 text-pink-500 animate-spin" /></div>
      ) : events?.length === 0 ? (
        <div className="glass-card p-12 text-center rounded-3xl cm-card-elevate">
          <p className="text-white/50" style={{ fontFamily: 'Inter' }}>No upcoming events. Be the first to host one!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events?.map(event => (
            <div key={event.id} className="glass-card rounded-2xl overflow-hidden flex flex-col border border-white/5 group hover:border-pink-500/20 transition-colors cm-card-elevate">
              <div className="h-40 bg-white/5 relative overflow-hidden">
                {event.imageUrl ? (
                  <img src={event.imageUrl} alt={event.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-pink-500/20 to-purple-500/10 flex items-center justify-center">
                    <CalendarDays className="w-12 h-12 text-white/20" />
                  </div>
                )}
                <div className="absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold border backdrop-blur-md uppercase tracking-wider bg-black/40 text-white" style={{ fontFamily: 'Cabin' }}>
                  {event.category}
                </div>
              </div>
              <div className="p-5 flex flex-col flex-1">
                <h3 className="text-xl font-bold text-white mb-2 line-clamp-1" style={{ fontFamily: 'Outfit' }}>{event.title}</h3>
                <p className="text-white/60 text-sm line-clamp-2 mb-4 flex-1" style={{ fontFamily: 'Inter' }}>{event.description}</p>
                
                <div className="space-y-2 mb-6">
                  <div className="flex items-center text-sm text-white/70 gap-2">
                    <CalendarDays className="w-4 h-4 text-pink-400" />
                    <span style={{ fontFamily: 'Inter' }}>{format(new Date(event.date), "MMM d, yyyy • h:mm a")}</span>
                  </div>
                  <div className="flex items-center text-sm text-white/70 gap-2">
                    <MapPin className="w-4 h-4 text-pink-400" />
                    <span style={{ fontFamily: 'Inter' }}>{event.venue}</span>
                  </div>
                  <div className="flex items-center text-sm text-white/70 gap-2">
                    <Users className="w-4 h-4 text-pink-400" />
                    <span style={{ fontFamily: 'Space Grotesk' }}>{event.rsvpCount} Attending</span>
                  </div>
                </div>

                <Button 
                  onClick={() => handleRsvp(event.id)}
                  disabled={event.isRsvped || rsvpMutation.isPending}
                  className={`w-full ${event.isRsvped ? 'bg-white/10 text-white/50 hover:bg-white/10' : 'bg-[#ec4899] text-white hover:bg-[#db2777] shadow-lg shadow-pink-500/20'}`}
                  style={{ fontFamily: 'Cabin' }}
                >
                  {event.isRsvped ? 'RSVP Confirmed' : 'Count Me In'}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
