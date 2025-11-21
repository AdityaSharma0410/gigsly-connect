import { useMemo, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Calendar, DollarSign, Briefcase } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import type { TaskResponse } from '@/types/api';
import { useAuth } from '@/contexts/AuthContext';

const BrowseTasks = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [selectedTask, setSelectedTask] = useState<TaskResponse | null>(null);
  const [proposalMessage, setProposalMessage] = useState('');
  const [proposedAmount, setProposedAmount] = useState('');
  const [estimatedDuration, setEstimatedDuration] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: tasks } = useQuery({
    queryKey: ['tasks', 'OPEN'],
    queryFn: async () => {
      const { data } = await api.get<TaskResponse[]>('/tasks', { params: { status: 'OPEN' } });
      return data;
    },
  });

  const categories = useMemo(() => {
    const unique = new Set<string>();
    tasks?.forEach((task) => {
      if (task.categoryName) unique.add(task.categoryName);
    });
    return ['All', ...Array.from(unique)];
  }, [tasks]);

  const filteredTasks = useMemo(() => {
    if (!tasks) return [];
    if (selectedCategory === 'All') return tasks;
    return tasks.filter((task) => task.categoryName === selectedCategory);
  }, [tasks, selectedCategory]);

  const handleApply = (task: TaskResponse) => {
    if (user?.role !== 'PROFESSIONAL') {
      toast({
        title: 'Professionals only',
        description: 'Create a professional account to apply for tasks.',
        variant: 'destructive',
      });
      return;
    }
    setSelectedTask(task);
    setProposalMessage('');
    setProposedAmount('');
    setEstimatedDuration('');
  };

  const handleSubmitProposal = async () => {
    if (!selectedTask) return;
    if (!proposalMessage || !proposedAmount || !estimatedDuration) {
      toast({
        title: 'Missing details',
        description: 'Please fill in all fields before submitting.',
        variant: 'destructive',
      });
      return;
    }
    setIsSubmitting(true);
    try {
      await api.post('/proposals', {
        taskId: selectedTask.id,
        message: proposalMessage,
        proposedAmount: Number(proposedAmount),
        estimatedDuration,
      });
      toast({
        title: 'Proposal Submitted!',
        description: `Your proposal for "${selectedTask.title}" has been sent.`,
      });
      setSelectedTask(null);
    } catch (error) {
      toast({
        title: 'Submission failed',
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
        <div className="container mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-4 animate-fade-in">
            Browse Available Tasks
          </h1>
          <p className="text-muted-foreground text-center mb-12 animate-fade-in">
            {user?.role === 'PROFESSIONAL'
              ? 'Find projects that match your skills and start earning'
              : 'Switch to a professional account to apply for tasks'}
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
                      <p className="text-sm text-muted-foreground mb-1">Posted by {task.clientName ?? 'Unknown Client'}</p>
                      {task.categoryName && (
                        <Badge className="bg-primary/20 text-primary border-primary/30">
                          {task.categoryName}
                        </Badge>
                      )}
                    </div>
                  </div>

                  <p className="text-muted-foreground mb-4 line-clamp-2">
                    {task.description}
                  </p>

                  <div className="flex flex-wrap gap-4 mb-4 text-sm">
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-primary" />
                      <span className="font-semibold">
                        ₹{(task.budgetMax ?? task.budgetMin ?? 0).toLocaleString()}
                      </span>
                    </div>
                    {task.deadline && (
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-primary" />
                        <span>Due: {new Date(task.deadline).toLocaleDateString()}</span>
                      </div>
                    )}
                    {task.estimatedDuration && (
                      <div className="flex items-center gap-2">
                        <Briefcase className="w-4 h-4 text-primary" />
                        <span>{task.estimatedDuration}</span>
                      </div>
                    )}
                  </div>

                  <Button className="w-full" onClick={() => handleApply(task)}>
                    Apply for This Task
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Dialog open={!!selectedTask} onOpenChange={() => setSelectedTask(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Apply for Task</DialogTitle>
            <DialogDescription>
              Submit your proposal for "{selectedTask?.title}"
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="message">Cover Letter / Proposal Message</Label>
              <Textarea
                id="message"
                placeholder="Explain why you're the best fit for this task..."
                value={proposalMessage}
                onChange={(e) => setProposalMessage(e.target.value)}
                rows={6}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Proposed Amount (₹)</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="15000"
                  value={proposedAmount}
                  onChange={(e) => setProposedAmount(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration">Estimated Duration</Label>
                <Input
                  id="duration"
                  placeholder="e.g., 7 days"
                  value={estimatedDuration}
                  onChange={(e) => setEstimatedDuration(e.target.value)}
                />
              </div>
            </div>

            <div className="flex gap-3">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => setSelectedTask(null)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button 
                className="flex-1"
                onClick={handleSubmitProposal}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Proposal'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default BrowseTasks;
