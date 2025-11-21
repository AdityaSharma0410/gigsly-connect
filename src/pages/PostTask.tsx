import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from "@/components/ui/checkbox";
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import api from '@/lib/api';
import type { CategoryResponse } from '@/types/api';

const PostTask = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    title: '',
    categoryId: '',
    budgetMin: '',
    budgetMax: '',
    deadline: '',
    description: '',
    location: '',
    requiredSkills: '',
    estimatedDuration: '',
    isRemote: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data } = await api.get<CategoryResponse[]>('/categories');
      return data;
    },
  });

  const disabled = user?.role !== 'CLIENT' && user?.role !== 'ADMIN';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (disabled) {
      toast({
        title: 'Clients only',
        description: 'Only clients can post tasks. Switch to a client account.',
        variant: 'destructive',
      });
      return;
    }
    setIsSubmitting(true);
    try {
      await api.post('/tasks', {
        title: formData.title,
        description: formData.description,
        categoryId: Number(formData.categoryId),
        budgetMin: formData.budgetMin ? Number(formData.budgetMin) : null,
        budgetMax: formData.budgetMax ? Number(formData.budgetMax) : null,
        deadline: formData.deadline ? new Date(formData.deadline).toISOString() : null,
        requiredSkills: formData.requiredSkills,
        location: formData.location,
        remote: formData.isRemote,
        estimatedDuration: formData.estimatedDuration,
      });
      toast({
        title: 'Task Posted Successfully!',
        description: 'Professionals will start applying soon.',
      });
      setFormData({
        title: '',
        categoryId: '',
        budgetMin: '',
        budgetMax: '',
        deadline: '',
        description: '',
        location: '',
        requiredSkills: '',
        estimatedDuration: '',
        isRemote: false,
      });
    } catch (error) {
      toast({
        title: 'Failed to post task',
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
            <CardContent className="p-8 space-y-6">
              <div>
                <h1 className="text-3xl font-bold mb-2">Post a Task</h1>
                <p className="text-muted-foreground">
                  {disabled
                    ? 'Switch to a client account to post tasks.'
                    : 'Describe your project and receive proposals from professionals.'}
                </p>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Task Title</Label>
                  <Input 
                    id="title" 
                    placeholder="e.g., Build a responsive website"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                    disabled={disabled}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select 
                    value={formData.categoryId} 
                    onValueChange={(value) => setFormData({ ...formData, categoryId: value })}
                    disabled={disabled}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories?.map((category) => (
                        <SelectItem key={category.id} value={String(category.id)}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="budgetMin">Budget Min (₹)</Label>
                    <Input 
                      id="budgetMin" 
                      type="number" 
                      placeholder="5000"
                      value={formData.budgetMin}
                      onChange={(e) => setFormData({ ...formData, budgetMin: e.target.value })}
                      disabled={disabled}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="budgetMax">Budget Max (₹)</Label>
                    <Input 
                      id="budgetMax" 
                      type="number" 
                      placeholder="15000"
                      value={formData.budgetMax}
                      onChange={(e) => setFormData({ ...formData, budgetMax: e.target.value })}
                      disabled={disabled}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="deadline">Deadline</Label>
                    <Input 
                      id="deadline" 
                      type="date"
                      value={formData.deadline}
                      onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                      disabled={disabled}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="estimatedDuration">Estimated Duration</Label>
                    <Input
                      id="estimatedDuration"
                      placeholder="e.g., 2 weeks"
                      value={formData.estimatedDuration}
                      onChange={(e) => setFormData({ ...formData, estimatedDuration: e.target.value })}
                      disabled={disabled}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    placeholder="City, Country or Remote"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    disabled={disabled}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="isRemote"
                    checked={formData.isRemote}
                    onCheckedChange={(checked) => setFormData({ ...formData, isRemote: Boolean(checked) })}
                    disabled={disabled}
                  />
                  <Label htmlFor="isRemote">This task can be done remotely</Label>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="skills">Required Skills</Label>
                  <Input
                    id="skills"
                    placeholder="Comma separated skills"
                    value={formData.requiredSkills}
                    onChange={(e) => setFormData({ ...formData, requiredSkills: e.target.value })}
                    disabled={disabled}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea 
                    id="description" 
                    rows={6}
                    placeholder="Describe your project requirements in detail..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                    disabled={disabled}
                  />
                </div>

                <Button type="submit" className="w-full" disabled={disabled || isSubmitting}>
                  {isSubmitting ? 'Posting...' : 'Post Task'}
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

export default PostTask;
