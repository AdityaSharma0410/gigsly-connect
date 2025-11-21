import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import type { ProposalResponse, TaskResponse } from '@/types/api';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

const TaskDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [expandedTaskId, setExpandedTaskId] = useState<number | null>(null);

  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ['myTasks'],
    queryFn: async () => {
      const { data } = await api.get<TaskResponse[]>('/tasks/mine');
      return data;
    },
  });

  const proposalsQuery = useQuery({
    queryKey: ['taskProposals', expandedTaskId],
    queryFn: async () => {
      if (!expandedTaskId) return [];
      const { data } = await api.get<ProposalResponse[]>(`/proposals/task/${expandedTaskId}`);
      return data;
    },
    enabled: !!expandedTaskId,
  });

  const updateProposal = useMutation({
    mutationFn: ({ proposalId, status }: { proposalId: number; status: 'ACCEPTED' | 'REJECTED' }) =>
      api.post(`/proposals/${proposalId}/status`, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['taskProposals', expandedTaskId] });
      queryClient.invalidateQueries({ queryKey: ['myTasks'] });
      toast({ title: 'Proposal updated' });
    },
    onError: (error) => {
      toast({
        title: 'Update failed',
        description: error instanceof Error ? error.message : 'Please try again',
        variant: 'destructive',
      });
    },
  });

  const updateTaskStatus = useMutation({
    mutationFn: ({ taskId, status }: { taskId: number; status: 'IN_PROGRESS' | 'COMPLETED' }) =>
      api.post(`/tasks/${taskId}/status`, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myTasks'] });
      toast({ title: 'Task status updated' });
    },
    onError: (error) => {
      toast({
        title: 'Update failed',
        description: error instanceof Error ? error.message : 'Please try again',
        variant: 'destructive',
      });
    },
  });

  const isClient = user?.role === 'CLIENT' || user?.role === 'ADMIN';

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <section className="flex-1 pt-32 pb-20 px-6">
        <div className="container mx-auto max-w-5xl space-y-6">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-2">My Tasks</h1>
            <p className="text-muted-foreground">
              Review proposals and manage project progress
            </p>
          </div>

          {!isClient ? (
            <Card>
              <CardContent className="p-6 text-center text-muted-foreground">
                Switch to a client account to manage tasks.
              </CardContent>
            </Card>
          ) : isLoading ? (
            <Card>
              <CardContent className="p-6 text-center">Loading tasks...</CardContent>
            </Card>
          ) : tasks.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center text-muted-foreground">
                You haven't posted any tasks yet.
              </CardContent>
            </Card>
          ) : (
            tasks.map((task) => (
              <Card key={task.id} className="glass-card border-0">
                <CardContent className="p-6 space-y-4">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <h3 className="text-2xl font-semibold">{task.title}</h3>
                      <p className="text-muted-foreground">{task.description}</p>
                      <div className="flex flex-wrap gap-3 mt-3 text-sm text-muted-foreground">
                        <span>Status: <Badge variant="outline">{task.status}</Badge></span>
                        {task.categoryName && <span>Category: {task.categoryName}</span>}
                        {task.assignedProfessionalName && (
                          <span>Assigned to: {task.assignedProfessionalName}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {task.status !== 'COMPLETED' && (
                        <Button
                          variant="outline"
                          onClick={() => setExpandedTaskId(task.id === expandedTaskId ? null : task.id)}
                        >
                          {expandedTaskId === task.id ? 'Hide Proposals' : 'View Proposals'}
                        </Button>
                      )}
                      {task.status === 'IN_PROGRESS' && (
                        <Button
                          onClick={() => updateTaskStatus.mutate({ taskId: task.id, status: 'COMPLETED' })}
                        >
                          Mark Completed
                        </Button>
                      )}
                    </div>
                  </div>

                  {expandedTaskId === task.id && (
                    <div className="space-y-4 border-t pt-4">
                      {proposalsQuery.isLoading ? (
                        <p>Loading proposals...</p>
                      ) : (proposalsQuery.data?.length ?? 0) === 0 ? (
                        <p className="text-muted-foreground">No proposals yet.</p>
                      ) : (
                        proposalsQuery.data?.map((proposal) => (
                          <div
                            key={proposal.id}
                            className="border rounded-xl p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
                          >
                            <div>
                              <p className="font-semibold">{proposal.professionalName}</p>
                              <p className="text-sm text-muted-foreground">{proposal.message}</p>
                              <div className="flex gap-4 text-sm text-muted-foreground mt-2">
                                {proposal.proposedAmount && (
                                  <span>Bid: ₹{proposal.proposedAmount}</span>
                                )}
                                {proposal.estimatedDuration && (
                                  <span>Timeline: {proposal.estimatedDuration}</span>
                                )}
                                <Badge variant="outline">{proposal.status}</Badge>
                              </div>
                            </div>
                            {proposal.status === 'PENDING' && (
                              <div className="flex gap-2">
                                <Button
                                  variant="outline"
                                  onClick={() => updateProposal.mutate({ proposalId: proposal.id, status: 'REJECTED' })}
                                >
                                  Reject
                                </Button>
                                <Button
                                  onClick={() => updateProposal.mutate({ proposalId: proposal.id, status: 'ACCEPTED' })}
                                >
                                  Accept
                                </Button>
                              </div>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default TaskDashboard;

