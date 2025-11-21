import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import type { CategoryResponse } from '@/types/api';

const CreateProfile = () => {
  const { user, refreshUser } = useAuth();
  const { toast } = useToast();
  const [skills, setSkills] = useState<string[]>([]);
  const [currentSkill, setCurrentSkill] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    category: '',
    hourlyRate: '',
    bio: '',
    location: '',
    phone: '',
  });

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data } = await api.get<CategoryResponse[]>('/categories');
      return data;
    },
  });

  useEffect(() => {
    if (user) {
      setFormData({
        category: user.primaryCategory ?? '',
        hourlyRate: user.hourlyRate ? String(user.hourlyRate) : '',
        bio: user.bio ?? '',
        location: user.location ?? '',
        phone: user.mobile ?? '',
      });
      setSkills(user.skills ?? []);
    }
  }, [user]);

  const addSkill = () => {
    const value = currentSkill.trim();
    if (value && !skills.includes(value)) {
      setSkills([...skills, value]);
      setCurrentSkill('');
    }
  };

  const removeSkill = (skill: string) => {
    setSkills(skills.filter(s => s !== skill));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (user?.role !== 'PROFESSIONAL') {
      toast({
        title: 'Professionals only',
        description: 'Switch to a professional account to update your profile.',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await api.put('/users/me/profile', {
        primaryCategory: formData.category,
        skills,
        hourlyRate: Number(formData.hourlyRate),
        bio: formData.bio,
        location: formData.location,
        phone: formData.phone,
      });
      await refreshUser();
      toast({
        title: 'Profile Updated',
        description: 'Your professional profile has been saved.',
      });
    } catch (error) {
      toast({
        title: 'Update failed',
        description: error instanceof Error ? error.message : 'Please try again',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <section className="flex-1 pt-32 pb-20 px-6">
        <div className="container mx-auto max-w-2xl">
          <Card className="glass-card border-0 animate-scale-in">
            <CardContent className="p-8">
              <h1 className="text-3xl font-bold mb-2">Professional Profile</h1>
              <p className="text-muted-foreground mb-8">
                Showcase your skills and increase your chances of getting hired
              </p>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="category">Primary Category</Label>
                  <Select 
                    value={formData.category} 
                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                    disabled={user?.role !== 'PROFESSIONAL'}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select your expertise" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories?.map((category) => (
                        <SelectItem key={category.id} value={category.name}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="skills">Skills</Label>
                  <div className="flex gap-2">
                    <Input 
                      id="skills" 
                      placeholder="Add a skill"
                      value={currentSkill}
                      onChange={(e) => setCurrentSkill(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                      disabled={user?.role !== 'PROFESSIONAL'}
                    />
                    <Button type="button" onClick={addSkill} disabled={user?.role !== 'PROFESSIONAL'}>
                      Add
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {skills.map((skill) => (
                      <Badge key={skill} variant="secondary" className="gap-1">
                        {skill}
                        <X 
                          className="w-3 h-3 cursor-pointer" 
                          onClick={() => removeSkill(skill)}
                        />
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="hourlyRate">Hourly Rate (₹)</Label>
                  <Input 
                    id="hourlyRate" 
                    type="number" 
                    placeholder="1500"
                    value={formData.hourlyRate}
                    onChange={(e) => setFormData({ ...formData, hourlyRate: e.target.value })}
                    required
                    disabled={user?.role !== 'PROFESSIONAL'}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Professional Bio</Label>
                  <Textarea 
                    id="bio" 
                    rows={4}
                    placeholder="Tell clients about your experience and expertise..."
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    required
                    disabled={user?.role !== 'PROFESSIONAL'}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input 
                      id="location" 
                      placeholder="City, State"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      required
                      disabled={user?.role !== 'PROFESSIONAL'}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input 
                      id="phone" 
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      required
                      disabled={user?.role !== 'PROFESSIONAL'}
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={user?.role !== 'PROFESSIONAL' || isSubmitting}>
                  {isSubmitting ? 'Saving...' : 'Save Profile'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default CreateProfile;
