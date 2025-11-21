import { useMemo, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Star } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import type { TaskResponse } from '@/types/api';

const GiveFeedback = () => {
  const [selectedTaskId, setSelectedTaskId] = useState('');
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();

  const { data: myTasks = [] } = useQuery({
    queryKey: ['myTasks', 'feedback'],
    queryFn: async () => {
      const { data } = await api.get<TaskResponse[]>('/tasks/mine');
      return data;
    },
  });

  const eligibleTasks = useMemo(() => {
    return myTasks.filter((task) => task.status === 'COMPLETED');
  }, [myTasks]);

  const selectedTask = eligibleTasks.find((task) => String(task.id) === selectedTaskId);

  const handleStarClick = (value: number) => {
    setRating(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedTask) {
      toast({
        title: 'Select a task',
        description: 'Please choose a completed task to review.',
        variant: 'destructive',
      });
      return;
    }

    const revieweeId = user?.role === 'PROFESSIONAL' ? selectedTask.clientId : selectedTask.assignedProfessionalId;

    if (!revieweeId) {
      toast({
        title: 'No partner found',
        description: 'This task does not have an assigned partner to review.',
        variant: 'destructive',
      });
      return;
    }

    if (rating === 0) {
      toast({
        title: 'Missing rating',
        description: 'Please provide a rating.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    
    try {
      await api.post('/reviews', {
        taskId: selectedTask.id,
        revieweeId,
        rating,
        comment,
      });
      toast({
        title: 'Feedback Submitted!',
        description: 'Thank you for your feedback. It helps improve our community.',
      });
      navigate('/');
    } catch (error) {
      toast({
        title: 'Submission failed',
        description: error instanceof Error ? error.message : 'Please try again',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const canReview = user?.role === 'CLIENT' || user?.role === 'PROFESSIONAL';

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <section className="pt-32 pb-20 px-6">
        <div className="container mx-auto max-w-2xl">
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-4 animate-fade-in">
            Give Feedback
          </h1>
          <p className="text-muted-foreground text-center mb-12 animate-fade-in">
            Share your experience and help build a better community
          </p>

          <Card className="glass-card border-0 animate-scale-in">
            <CardContent className="p-8">
              {!canReview ? (
                <p className="text-center text-muted-foreground">
                  Only clients and professionals can leave feedback. Switch to an appropriate account.
                </p>
              ) : eligibleTasks.length === 0 ? (
                <p className="text-center text-muted-foreground">
                  You do not have any completed tasks yet. Complete a task to share feedback.
                </p>
              ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="task">Select Completed Task</Label>
                  <Select value={selectedTaskId} onValueChange={setSelectedTaskId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a task" />
                    </SelectTrigger>
                    <SelectContent>
                      {eligibleTasks.map((task) => (
                        <SelectItem key={task.id} value={String(task.id)}>
                          {task.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {selectedTask && (
                  <p className="text-sm text-muted-foreground">
                    You are reviewing {user?.role === 'PROFESSIONAL' ? selectedTask.clientName : selectedTask.assignedProfessionalName}
                  </p>
                )}
                {eligibleTasks.length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    Complete a task before leaving feedback. Only completed tasks appear here.
                  </p>
                )}

                <div className="space-y-2">
                  <Label>Rating</Label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((value) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => handleStarClick(value)}
                        className="transition-transform hover:scale-110"
                      >
                        <Star
                          className={`w-8 h-8 ${
                            value <= rating
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-muted-foreground'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                  {rating > 0 && (
                    <p className="text-sm text-muted-foreground">
                      You rated {rating} out of 5 stars
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="comment">Detailed Feedback</Label>
                  <Textarea
                    id="comment"
                    placeholder="Share your experience working on this task..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows={6}
                    required
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? 'Submitting...' : 'Submit Feedback'}
                </Button>
              </form>
              )}
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default GiveFeedback;
