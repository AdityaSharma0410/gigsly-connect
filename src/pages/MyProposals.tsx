import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import type { ProposalResponse } from '@/types/api';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

const MyProposals = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: proposals = [], isLoading } = useQuery({
    queryKey: ['myProposals'],
    queryFn: async () => {
      const { data } = await api.get<ProposalResponse[]>('/proposals/mine');
      return data;
    },
  });

  const refresh = () => queryClient.invalidateQueries({ queryKey: ['myProposals'] });

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <section className="flex-1 pt-32 pb-20 px-6">
        <div className="container mx-auto max-w-4xl space-y-6">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-2">My Proposals</h1>
            <p className="text-muted-foreground">
              Track the status of the proposals you've submitted
            </p>
          </div>

          {user?.role !== 'PROFESSIONAL' ? (
            <Card>
              <CardContent className="p-6 text-center text-muted-foreground">
                Switch to a professional account to manage proposals.
              </CardContent>
            </Card>
          ) : isLoading ? (
            <Card>
              <CardContent className="p-6 text-center">Loading proposals...</CardContent>
            </Card>
          ) : proposals.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center text-muted-foreground">
                You haven't submitted any proposals yet.
              </CardContent>
            </Card>
          ) : (
            proposals.map((proposal) => (
              <Card key={proposal.id} className="glass-card border-0">
                <CardContent className="p-6 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-lg font-semibold">{proposal.taskTitle}</p>
                      <p className="text-sm text-muted-foreground">Status: <Badge variant="outline">{proposal.status}</Badge></p>
                    </div>
                    <Button variant="outline" size="sm" onClick={refresh}>
                      Refresh
                    </Button>
                  </div>
                  <p className="text-muted-foreground">{proposal.message}</p>
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    {proposal.proposedAmount && <span>Bid: ₹{proposal.proposedAmount}</span>}
                    {proposal.estimatedDuration && <span>Timeline: {proposal.estimatedDuration}</span>}
                    {proposal.acceptedAt && <span>Accepted: {new Date(proposal.acceptedAt).toLocaleDateString()}</span>}
                    {proposal.rejectedAt && <span>Rejected: {new Date(proposal.rejectedAt).toLocaleDateString()}</span>}
                  </div>
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

export default MyProposals;

