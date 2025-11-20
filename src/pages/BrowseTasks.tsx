import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, DollarSign, Briefcase } from 'lucide-react';

interface Task {
  id: string;
  title: string;
  category: string;
  budget: number;
  deadline: string;
  description: string;
  clientName: string;
  proposalsCount: number;
}

const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Build a Modern E-commerce Website',
    category: 'Web Development',
    budget: 50000,
    deadline: '2024-02-15',
    description: 'Looking for an experienced web developer to create a fully functional e-commerce website with payment gateway integration.',
    clientName: 'Ananya Gupta',
    proposalsCount: 12,
  },
  {
    id: '2',
    title: 'Edit Wedding Highlight Video',
    category: 'Video Editing',
    budget: 15000,
    deadline: '2024-01-25',
    description: 'Need a professional video editor to create a 5-minute wedding highlight video with music and color grading.',
    clientName: 'Karan Singh',
    proposalsCount: 8,
  },
  {
    id: '3',
    title: 'JEE Mathematics Tutoring',
    category: 'Tutoring',
    budget: 8000,
    deadline: '2024-01-30',
    description: 'Looking for an experienced tutor for JEE Advanced mathematics preparation. 3 sessions per week.',
    clientName: 'Meera Patel',
    proposalsCount: 15,
  },
  {
    id: '4',
    title: 'Develop Mobile App Backend',
    category: 'Software Development',
    budget: 75000,
    deadline: '2024-03-01',
    description: 'Need a backend developer to create REST APIs for a mobile application using Node.js and MongoDB.',
    clientName: 'Rahul Sharma',
    proposalsCount: 20,
  },
  {
    id: '5',
    title: 'Write SEO Blog Articles',
    category: 'Content Writing',
    budget: 12000,
    deadline: '2024-02-10',
    description: 'Looking for a content writer to create 10 SEO-optimized blog articles for our tech startup.',
    clientName: 'Deepa Krishnan',
    proposalsCount: 25,
  },
];

const categories = ['All', 'Web Development', 'Video Editing', 'Tutoring', 'Software Development', 'Content Writing'];

const BrowseTasks = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredTasks = selectedCategory === 'All' 
    ? mockTasks 
    : mockTasks.filter(t => t.category === selectedCategory);

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <section className="pt-32 pb-20 px-6">
        <div className="container mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-4 animate-fade-in">
            Browse Available Tasks
          </h1>
          <p className="text-muted-foreground text-center mb-12 animate-fade-in">
            Find projects that match your skills and start earning
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

          <div className="max-w-4xl mx-auto space-y-6">
            {filteredTasks.map((task) => (
              <Card 
                key={task.id} 
                className="glass-card border-0 hover-scale transition-all animate-fade-in"
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold mb-2">{task.title}</h3>
                      <p className="text-sm text-muted-foreground mb-1">Posted by {task.clientName}</p>
                      <Badge className="bg-primary/20 text-primary border-primary/30">
                        {task.category}
                      </Badge>
                    </div>
                  </div>

                  <p className="text-muted-foreground mb-4 line-clamp-2">
                    {task.description}
                  </p>

                  <div className="flex flex-wrap gap-4 mb-4 text-sm">
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-primary" />
                      <span className="font-semibold">₹{task.budget.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-primary" />
                      <span>Due: {new Date(task.deadline).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-primary" />
                      <span>{task.proposalsCount} proposals</span>
                    </div>
                  </div>

                  <Button className="w-full">Apply for This Task</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default BrowseTasks;
