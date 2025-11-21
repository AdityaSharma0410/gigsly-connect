import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Mail, Phone, MapPin, Star } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import type { ApiUser } from '@/types/api';

const Professionals = () => {
  const [searchParams] = useSearchParams();
  const [selectedProfessional, setSelectedProfessional] = useState<ApiUser | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('All');

  const { data: professionals = [] } = useQuery({
    queryKey: ['professionals'],
    queryFn: async () => {
      const { data } = await api.get<ApiUser[]>('/users', { params: { role: 'PROFESSIONAL' } });
      return data;
    },
  });

  const categories = useMemo(() => {
    const unique = new Set<string>();
    professionals.forEach((pro) => {
      if (pro.primaryCategory) unique.add(pro.primaryCategory);
    });
    return ['All', ...Array.from(unique)];
  }, [professionals]);

  useEffect(() => {
    const category = searchParams.get('category');
    if (category && categories.includes(category)) {
      setSelectedCategory(category);
    }
  }, [searchParams, categories]);

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
            {categories.map((category) => (
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

              <Button className="w-full">
                Hire {selectedProfessional.fullName}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default Professionals;
