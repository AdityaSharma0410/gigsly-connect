import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Star } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

const GiveFeedback = () => {
  const [taskName, setTaskName] = useState('');
  const [taskId, setTaskId] = useState('');
  const [revieweeEmail, setRevieweeEmail] = useState('');
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [category, setCategory] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleStarClick = (value: number) => {
    setRating(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (rating === 0) {
      toast({
        title: 'Error',
        description: 'Please provide a rating',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast({
      title: 'Feedback Submitted!',
      description: 'Thank you for your feedback. It helps improve our community.',
    });
    
    setIsLoading(false);
    navigate('/');
  };

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
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="taskName">Task Name</Label>
                  <Input
                    id="taskName"
                    placeholder="Enter the task name"
                    value={taskName}
                    onChange={(e) => setTaskName(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="taskId">Task ID (Optional)</Label>
                  <Input
                    id="taskId"
                    placeholder="Enter task ID if known"
                    value={taskId}
                    onChange={(e) => setTaskId(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select value={category} onValueChange={setCategory} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select task category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Web Development">Web Development</SelectItem>
                      <SelectItem value="Video Editing">Video Editing</SelectItem>
                      <SelectItem value="Tutoring">Tutoring</SelectItem>
                      <SelectItem value="Software Development">Software Development</SelectItem>
                      <SelectItem value="Content Writing">Content Writing</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="revieweeEmail">Professional's Email</Label>
                  <Input
                    id="revieweeEmail"
                    type="email"
                    placeholder="professional@example.com"
                    value={revieweeEmail}
                    onChange={(e) => setRevieweeEmail(e.target.value)}
                    required
                  />
                </div>

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
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default GiveFeedback;
