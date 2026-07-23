import React from 'react';
import { useGetProfile, useUpdateProfile } from '@workspace/api-client-react';
import { useAuth } from '@/hooks/use-auth';
import { Loader2, Camera, Trophy, MapPin, Book, Edit3, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';

export default function Profile() {
  const { data: profile, isLoading, refetch } = useGetProfile();
  const updateMutation = useUpdateProfile();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = React.useState(false);

  const [formData, setFormData] = React.useState({
    bio: '',
    branch: '',
    year: 1,
    hostel: '',
    interests: '',
  });

  React.useEffect(() => {
    if (profile) {
      setFormData({
        bio: profile.bio || '',
        branch: profile.branch || '',
        year: profile.year || 1,
        hostel: profile.hostel || '',
        interests: profile.interests ? profile.interests.join(', ') : '',
      });
    }
  }, [profile]);

  if (isLoading) {
    return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 text-primary animate-spin" /></div>;
  }

  if (!profile) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate({
      data: {
        bio: formData.bio,
        branch: formData.branch,
        year: Number(formData.year),
        hostel: formData.hostel,
        interests: formData.interests.split(',').map(s => s.trim()).filter(Boolean),
      }
    }, {
      onSuccess: () => {
        toast({ title: 'Profile updated successfully' });
        setIsEditing(false);
        refetch();
      }
    });
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="relative">
        {/* Cover */}
        <div className="h-48 md:h-64 w-full rounded-3xl bg-gradient-to-br from-primary/40 via-secondary/20 to-background overflow-hidden relative border border-white/5">
          <div className="absolute inset-0 opacity-20 mix-blend-overlay" style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.03) 10px, rgba(255,255,255,0.03) 20px)' }}></div>
        </div>

        {/* Avatar & Basic Info */}
        <div className="absolute left-8 -bottom-16 flex items-end gap-6">
          <div className="relative">
            <div className="w-32 h-32 rounded-2xl bg-card border-4 border-background overflow-hidden shadow-2xl">
              {profile.avatarUrl ? (
                <img src={profile.avatarUrl} alt={profile.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-primary bg-white/5">
                  {profile.name.charAt(0)}
                </div>
              )}
            </div>
            <button className="absolute -bottom-2 -right-2 w-10 h-10 rounded-xl bg-white text-black flex items-center justify-center shadow-lg hover:bg-gray-200 transition-colors z-10" title="Profile photo upload coming soon">
              <Camera className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Actions */}
        <div className="absolute right-4 -bottom-12">
          {!isEditing && (
            <Button onClick={() => setIsEditing(true)} variant="outline" className="bg-card border-white/10 hover:bg-white/10 text-white rounded-full px-6">
              <Edit3 className="w-4 h-4 mr-2" /> Edit Profile
            </Button>
          )}
        </div>
      </div>

      <div className="mt-20 px-2">
        <div className="flex items-center gap-3 mb-1">
          <h1 className="text-3xl font-bold text-white tracking-tight">{profile.name}</h1>
          {profile.isVerified && (
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-500/20 border border-blue-500/30 text-blue-400 text-xs font-medium">
              <ShieldCheck className="w-3 h-3" /> Verified Student
            </div>
          )}
        </div>

        {/* First 100 Badge */}
        {profile.isFirst100 && (
          <div className="inline-flex items-center gap-2 mt-2 px-3 py-1.5 rounded-xl bg-gradient-to-r from-yellow-500/20 to-yellow-600/10 border border-yellow-500/30 text-yellow-500 text-sm font-semibold">
            <Trophy className="w-4 h-4" /> First 100 Member
          </div>
        )}

        <div className="flex flex-wrap gap-4 mt-6 text-white/60 text-sm">
          <div className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">
            <Book className="w-4 h-4 text-primary" /> {profile.branch}, Year {profile.year}
          </div>
          {profile.hostel && (
            <div className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">
              <MapPin className="w-4 h-4 text-secondary" /> {profile.hostel} Hostel
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">
          
          <div className="md:col-span-2 space-y-8">
            {isEditing ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card p-6 rounded-2xl">
                <h3 className="text-lg font-bold text-white mb-4">Edit Profile</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-white/80">Bio</Label>
                    <textarea 
                      className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:ring-1 focus:ring-primary outline-none"
                      rows={3}
                      value={formData.bio}
                      onChange={(e) => setFormData({...formData, bio: e.target.value})}
                      placeholder="Write something about yourself..."
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-white/80">Branch</Label>
                      <Input 
                        value={formData.branch}
                        onChange={(e) => setFormData({...formData, branch: e.target.value})}
                        className="bg-white/5 border-white/10 text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-white/80">Year</Label>
                      <Input 
                        type="number"
                        min="1" max="5"
                        value={formData.year}
                        onChange={(e) => setFormData({...formData, year: Number(e.target.value)})}
                        className="bg-white/5 border-white/10 text-white"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-white/80">Hostel / Location</Label>
                    <Input 
                      value={formData.hostel}
                      onChange={(e) => setFormData({...formData, hostel: e.target.value})}
                      className="bg-white/5 border-white/10 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-white/80">Interests (comma separated)</Label>
                    <Input 
                      value={formData.interests}
                      onChange={(e) => setFormData({...formData, interests: e.target.value})}
                      placeholder="Coding, Music, Basketball..."
                      className="bg-white/5 border-white/10 text-white"
                    />
                  </div>
                  <div className="flex justify-end gap-3 pt-4">
                    <Button type="button" variant="ghost" onClick={() => setIsEditing(false)} className="text-white/60">Cancel</Button>
                    <Button type="submit" disabled={updateMutation.isPending} className="bg-primary text-white hover:bg-primary/90">
                      {updateMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save Changes'}
                    </Button>
                  </div>
                </form>
              </motion.div>
            ) : (
              <>
                <div>
                  <h3 className="text-sm font-bold text-white/40 uppercase tracking-wider mb-3">About Me</h3>
                  <p className="text-white/90 leading-relaxed bg-white/5 p-5 rounded-2xl border border-white/5">
                    {profile.bio || <span className="italic opacity-50">No bio written yet. Add one to get more matches!</span>}
                  </p>
                </div>

                {profile.interests && profile.interests.length > 0 && (
                  <div>
                    <h3 className="text-sm font-bold text-white/40 uppercase tracking-wider mb-3">Interests</h3>
                    <div className="flex flex-wrap gap-2">
                      {profile.interests.map(int => (
                        <span key={int} className="px-4 py-2 bg-gradient-to-r from-primary/10 to-secondary/10 border border-white/10 rounded-xl text-white text-sm font-medium">
                          {int}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
          
          <div className="md:col-span-1 space-y-4">
            <div className="glass-card p-5 rounded-2xl">
              <h3 className="text-sm font-bold text-white/40 uppercase tracking-wider mb-4">Account Info</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-white/60">Status</span>
                  <span className={`font-bold ${profile.isVerified ? 'text-green-400' : 'text-yellow-400'}`}>
                    {profile.isVerified ? 'Verified' : 'Pending'}
                  </span>
                </div>
                {profile.isFirst100 && (
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-white/60">Badge</span>
                    <span className="text-yellow-400 font-bold">First 100</span>
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
