import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Mail, Phone, MapPin, Star } from 'lucide-react';

interface Professional {
  id: string;
  name: string;
  category: string;
  skills: string[];
  rating: number;
  reviews: number;
  hourlyRate: number;
  location: string;
  email: string;
  phone: string;
  bio: string;
  completedProjects: number;
}

const mockProfessionals: Professional[] = [
  {
    id: '1',
    name: 'Rajesh Kumar',
    category: 'Web Development',
    skills: ['React', 'Node.js', 'TypeScript', 'MongoDB'],
    rating: 4.8,
    reviews: 127,
    hourlyRate: 2500,
    location: 'Bangalore, Karnataka',
    email: 'rajesh.k@email.com',
    phone: '+91 98765 43210',
    bio: 'Full-stack developer with 5+ years of experience building scalable web applications.',
    completedProjects: 89,
  },
  {
    id: '2',
    name: 'Priya Sharma',
    category: 'Video Editing',
    skills: ['Adobe Premiere Pro', 'After Effects', 'DaVinci Resolve', 'Motion Graphics'],
    rating: 4.9,
    reviews: 95,
    hourlyRate: 1800,
    location: 'Mumbai, Maharashtra',
    email: 'priya.s@email.com',
    phone: '+91 98765 43211',
    bio: 'Creative video editor specializing in corporate videos and social media content.',
    completedProjects: 156,
  },
  {
    id: '3',
    name: 'Amit Patel',
    category: 'Tutoring',
    skills: ['Mathematics', 'Physics', 'JEE Preparation', 'NEET Coaching'],
    rating: 5.0,
    reviews: 203,
    hourlyRate: 1200,
    location: 'Delhi, NCR',
    email: 'amit.p@email.com',
    phone: '+91 98765 43212',
    bio: 'Experienced tutor with 10+ years helping students excel in competitive exams.',
    completedProjects: 412,
  },
  {
    id: '4',
    name: 'Sneha Reddy',
    category: 'Software Development',
    skills: ['Python', 'Django', 'AWS', 'Docker', 'Kubernetes'],
    rating: 4.7,
    reviews: 84,
    hourlyRate: 3000,
    location: 'Hyderabad, Telangana',
    email: 'sneha.r@email.com',
    phone: '+91 98765 43213',
    bio: 'Backend engineer specializing in cloud-native applications and microservices.',
    completedProjects: 67,
  },
  {
    id: '5',
    name: 'Arjun Mehta',
    category: 'Content Writing',
    skills: ['SEO Writing', 'Technical Writing', 'Copywriting', 'Blog Posts'],
    rating: 4.6,
    reviews: 142,
    hourlyRate: 1000,
    location: 'Pune, Maharashtra',
    email: 'arjun.m@email.com',
    phone: '+91 98765 43214',
    bio: 'Professional content writer with expertise in tech and business niches.',
    completedProjects: 234,
  },
  {
    id: '6',
    name: 'Kavya Singh',
    category: 'Web Development',
    skills: ['Vue.js', 'Laravel', 'MySQL', 'REST APIs'],
    rating: 4.8,
    reviews: 76,
    hourlyRate: 2200,
    location: 'Jaipur, Rajasthan',
    email: 'kavya.s@email.com',
    phone: '+91 98765 43215',
    bio: 'Frontend specialist with a passion for creating beautiful user interfaces.',
    completedProjects: 54,
  },
];

const categories = ['All', 'Web Development', 'Video Editing', 'Tutoring', 'Software Development', 'Content Writing'];

const Professionals = () => {
  const [searchParams] = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedProfessional, setSelectedProfessional] = useState<Professional | null>(null);

  useEffect(() => {
    const category = searchParams.get('category');
    if (category && categories.includes(category)) {
      setSelectedCategory(category);
    }
  }, [searchParams]);

  const filteredProfessionals = selectedCategory === 'All' 
    ? mockProfessionals 
    : mockProfessionals.filter(p => p.category === selectedCategory);

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <section className="pt-32 pb-20 px-6">
        <div className="container mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-4 animate-fade-in">
            Browse Professionals
          </h1>
          <p className="text-muted-foreground text-center mb-12 animate-fade-in">
            Find the perfect professional for your project
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
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-semibold mb-1">{professional.name}</h3>
                      <p className="text-sm text-muted-foreground">{professional.category}</p>
                    </div>
                    <Badge className="bg-primary/20 text-primary border-primary/30">
                      ₹{professional.hourlyRate}/hr
                    </Badge>
                  </div>

                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">{professional.rating}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      ({professional.reviews} reviews)
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {professional.skills.slice(0, 3).map((skill) => (
                      <Badge key={skill} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                    {professional.skills.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{professional.skills.length - 3} more
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    <span>{professional.location}</span>
                  </div>

                  <Button className="w-full mt-4" onClick={(e) => {
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
            <DialogTitle className="text-2xl">{selectedProfessional?.name}</DialogTitle>
          </DialogHeader>
          
          {selectedProfessional && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <Badge className="bg-primary/20 text-primary border-primary/30">
                  {selectedProfessional.category}
                </Badge>
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold">{selectedProfessional.rating}</span>
                  <span className="text-muted-foreground">
                    ({selectedProfessional.reviews} reviews)
                  </span>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">About</h4>
                <p className="text-muted-foreground">{selectedProfessional.bio}</p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedProfessional.skills.map((skill) => (
                    <Badge key={skill} variant="secondary">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">Hourly Rate</h4>
                  <p className="text-2xl font-bold text-primary">
                    ₹{selectedProfessional.hourlyRate}/hr
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Completed Projects</h4>
                  <p className="text-2xl font-bold">{selectedProfessional.completedProjects}</p>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold">Contact Information</h4>
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Mail className="w-5 h-5" />
                  <span>{selectedProfessional.email}</span>
                </div>
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Phone className="w-5 h-5" />
                  <span>{selectedProfessional.phone}</span>
                </div>
                <div className="flex items-center gap-3 text-muted-foreground">
                  <MapPin className="w-5 h-5" />
                  <span>{selectedProfessional.location}</span>
                </div>
              </div>

              <Button className="w-full">Hire {selectedProfessional.name}</Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default Professionals;
