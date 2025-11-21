import { useEffect, useMemo, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Mail, Phone, MapPin, Star } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import type { ApiUser, CategoryResponse } from '@/types/api';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const Professionals = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedProfessional, setSelectedProfessional] = useState<ApiUser | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showHireDialog, setShowHireDialog] = useState(false);
  const [isHiring, setIsHiring] = useState(false);
  const [taskForm, setTaskForm] = useState({
    title: '',
    description: '',
    categoryId: '',
    budgetMin: '',
    budgetMax: '',
    deadline: '',
    estimatedDuration: '',
    location: '',
    requiredSkills: '',
  });

  const { data: professionals = [] } = useQuery({
    queryKey: ['professionals'],
    queryFn: async () => {
      const { data } = await api.get<ApiUser[]>('/users', { params: { role: 'PROFESSIONAL' } });
      return data;
    },
  });

  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data } = await api.get<CategoryResponse[]>('/categories');
      return data;
    },
  });

  const hireMutation = useMutation({
    mutationFn: async (formData: typeof taskForm) => {
      const response = await api.post('/tasks', {
        ...formData,
        categoryId: Number(formData.categoryId),
        budgetMin: formData.budgetMin ? Number(formData.budgetMin) : null,
        budgetMax: formData.budgetMax ? Number(formData.budgetMax) : null,
        deadline: formData.deadline ? new Date(formData.deadline).toISOString() : null,
        remote: false,
        assignedProfessionalId: selectedProfessional?.id,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myTasks'] });
      toast({
        title: 'Professional Hired!',
        description: `Task created and assigned to ${selectedProfessional?.fullName}`,
      });
      setIsHiring(false);
      setShowHireDialog(false);
      setSelectedProfessional(null);
      setTaskForm({
        title: '',
        description: '',
        categoryId: '',
        budgetMin: '',
        budgetMax: '',
        deadline: '',
        estimatedDuration: '',
        location: '',
        requiredSkills: '',
      });
      navigate('/dashboard/tasks');
    },
    onError: (error: any) => {
      setIsHiring(false);
      toast({
        title: 'Failed to hire professional',
        description: error?.response?.data?.message || error?.message || 'Please try again',
        variant: 'destructive',
      });
    },
  });

  const categoryFilters = useMemo(() => {
    const unique = new Set<string>();
    professionals.forEach((pro) => {
      if (pro.primaryCategory) unique.add(pro.primaryCategory);
    });
    return ['All', ...Array.from(unique)];
  }, [professionals]);

  useEffect(() => {
    const category = searchParams.get('category');
    if (category && categoryFilters.includes(category)) {
      setSelectedCategory(category);
    }
  }, [searchParams, categoryFilters]);

  const filteredProfessionals = useMemo(() => {
    if (selectedCategory === 'All') return professionals;
    return professionals.filter((pro) => pro.primaryCategory === selectedCategory);
  }, [professionals, selectedCategory]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <section className="flex-1 pt-32 pb-20 px-6">
        <div className="container mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-4 animate-fade-in">
            Browse Professionals
          </h1>
          <p className="text-muted-foreground text-center mb-12 animate-fade-in">
            Connect with verified experts across every service category
          </p>

          <div className="flex flex-wrap gap-3 justify-center mb-12 animate-scale-in">
            {categoryFilters.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? 'default' : 'outline'}
                onClick={() => setSelectedCategory(category)}
                className="transition-all"
              >
                {category}
              </Button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProfessionals.map((professional) => (
              <Card 
                key={professional.id} 
                className="glass-card border-0 hover-scale cursor-pointer transition-all animate-fade-in"
                onClick={() => setSelectedProfessional(professional)}
              >
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-xl font-semibold mb-1">{professional.fullName}</h3>
                      <p className="text-sm text-muted-foreground">{professional.primaryCategory ?? 'General'}</p>
                    </div>
                    {professional.hourlyRate && (
                      <Badge className="bg-primary/20 text-primary border-primary/30">
                        ₹{professional.hourlyRate}/hr
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">{professional.averageRating?.toFixed(1) ?? 'New'}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      ({professional.reviewCount ?? 0} reviews)
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {(professional.skills ?? []).slice(0, 3).map((skill) => (
                      <Badge key={skill} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                    {(professional.skills?.length ?? 0) > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{(professional.skills?.length ?? 0) - 3} more
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    <span>{professional.location ?? 'Remote'}</span>
                  </div>

                  <Button className="w-full" onClick={(e) => {
                    e.stopPropagation();
                    setSelectedProfessional(professional);
                  }}>
                    View Profile
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Dialog open={!!selectedProfessional} onOpenChange={() => setSelectedProfessional(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">{selectedProfessional?.fullName}</DialogTitle>
          </DialogHeader>
          
          {selectedProfessional && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <Badge className="bg-primary/20 text-primary border-primary/30">
                  {selectedProfessional.primaryCategory ?? 'General'}
                </Badge>
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold">
                    {selectedProfessional.averageRating?.toFixed(1) ?? 'New'}
                  </span>
                  <span className="text-muted-foreground">
                    ({selectedProfessional.reviewCount ?? 0} reviews)
                  </span>
                </div>
              </div>

              {selectedProfessional.bio && (
                <div>
                  <h4 className="font-semibold mb-2">About</h4>
                  <p className="text-muted-foreground">{selectedProfessional.bio}</p>
                </div>
              )}

              {(selectedProfessional.skills?.length ?? 0) > 0 && (
                <div>
                  <h4 className="font-semibold mb-2">Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedProfessional.skills?.map((skill) => (
                      <Badge key={skill} variant="secondary">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                {selectedProfessional.hourlyRate && (
                  <div>
                    <h4 className="font-semibold mb-2">Hourly Rate</h4>
                    <p className="text-2xl font-bold text-primary">
                      ₹{selectedProfessional.hourlyRate}/hr
                    </p>
                  </div>
                )}
                <div>
                  <h4 className="font-semibold mb-2">Completed Projects</h4>
                  <p className="text-2xl font-bold">{selectedProfessional.completedProjects ?? 0}</p>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold">Contact Information</h4>
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Mail className="w-5 h-5" />
                  <span>{selectedProfessional.email}</span>
                </div>
                {selectedProfessional.mobile && (
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <Phone className="w-5 h-5" />
                    <span>{selectedProfessional.mobile}</span>
                  </div>
                )}
                <div className="flex items-center gap-3 text-muted-foreground">
                  <MapPin className="w-5 h-5" />
                  <span>{selectedProfessional.location ?? 'Remote'}</span>
                </div>
              </div>

              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => {
                    setSelectedProfessional(null);
                  }}
                >
                  Close
                </Button>
                {user?.role === 'CLIENT' || user?.role === 'ADMIN' ? (
                  <Button 
                    className="flex-1"
                    onClick={() => {
                      setShowHireDialog(true);
                      // Pre-fill category if professional has one
                      if (selectedProfessional.primaryCategory) {
                        const matchingCategory = categories.find(
                          c => c.name === selectedProfessional.primaryCategory
                        );
                        if (matchingCategory) {
                          setTaskForm(prev => ({ ...prev, categoryId: String(matchingCategory.id) }));
                        }
                      }
                    }}
                  >
                    Hire {selectedProfessional.fullName}
                  </Button>
                ) : (
                  <Button 
                    className="flex-1"
                    onClick={() => {
                      toast({
                        title: 'Clients only',
                        description: 'Switch to a client account to hire professionals.',
                        variant: 'destructive',
                      });
                    }}
                  >
                    Hire {selectedProfessional.fullName}
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={showHireDialog} onOpenChange={setShowHireDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Hire {selectedProfessional?.fullName}</DialogTitle>
            <DialogDescription>
              Create a new task and assign it directly to {selectedProfessional?.fullName}
            </DialogDescription>
          </DialogHeader>
          
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              if (!taskForm.title || !taskForm.description || !taskForm.categoryId) {
                toast({
                  title: 'Missing fields',
                  description: 'Please fill in title, description, and category',
                  variant: 'destructive',
                });
                return;
              }
              setIsHiring(true);
              hireMutation.mutate(taskForm);
            }}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label htmlFor="title">Task Title *</Label>
              <Input
                id="title"
                placeholder="e.g., Website Development Project"
                value={taskForm.title}
                onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select
                value={taskForm.categoryId}
                onValueChange={(value) => setTaskForm({ ...taskForm, categoryId: value })}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={String(category.id)}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                placeholder="Describe the task requirements in detail..."
                value={taskForm.description}
                onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
                rows={4}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="budgetMin">Budget Min (₹)</Label>
                <Input
                  id="budgetMin"
                  type="number"
                  placeholder="5000"
                  value={taskForm.budgetMin}
                  onChange={(e) => setTaskForm({ ...taskForm, budgetMin: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="budgetMax">Budget Max (₹)</Label>
                <Input
                  id="budgetMax"
                  type="number"
                  placeholder="15000"
                  value={taskForm.budgetMax}
                  onChange={(e) => setTaskForm({ ...taskForm, budgetMax: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="deadline">Deadline</Label>
                <Input
                  id="deadline"
                  type="date"
                  value={taskForm.deadline}
                  onChange={(e) => setTaskForm({ ...taskForm, deadline: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="duration">Estimated Duration</Label>
                <Input
                  id="duration"
                  placeholder="e.g., 2 weeks"
                  value={taskForm.estimatedDuration}
                  onChange={(e) => setTaskForm({ ...taskForm, estimatedDuration: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                placeholder="City, Country or Remote"
                value={taskForm.location}
                onChange={(e) => setTaskForm({ ...taskForm, location: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="skills">Required Skills</Label>
              <Input
                id="skills"
                placeholder="Comma separated skills"
                value={taskForm.requiredSkills}
                onChange={(e) => setTaskForm({ ...taskForm, requiredSkills: e.target.value })}
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => setShowHireDialog(false)}
                disabled={isHiring}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1"
                disabled={isHiring}
              >
                {isHiring ? 'Creating Task...' : 'Create Task & Hire'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default Professionals;
