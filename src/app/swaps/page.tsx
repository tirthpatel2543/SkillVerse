"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { swapRequests as allRequests, users } from '@/lib/data';
import type { SwapRequest } from '@/lib/data';
import { ArrowLeftRight, Check, X, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const currentUser = users[0];

export default function SwapsPage() {
  const [requests, setRequests] = useState<SwapRequest[]>(allRequests);
  const { toast } = useToast();

  const handleRequest = (requestId: string, newStatus: 'accepted' | 'rejected') => {
    setRequests(requests.map(req => req.id === requestId ? { ...req, status: newStatus } : req));
    toast({
      title: `Request ${newStatus}`,
      description: `You have ${newStatus} the swap request.`,
    });
  };

  const handleDelete = (requestId: string) => {
    setRequests(requests.filter(req => req.id !== requestId));
     toast({
      title: `Request Deleted`,
      description: `You have deleted the pending swap request.`,
      variant: 'destructive',
    });
  };
  
  const handleCancel = (requestId: string) => {
     setRequests(requests.map(req => req.id === requestId ? { ...req, status: 'cancelled' } : req));
     toast({
      title: `Swap Cancelled`,
      description: `You have cancelled the confirmed swap.`,
    });
  }

  const incomingRequests = requests.filter(r => r.toUser.id === currentUser.id && r.status === 'pending');
  const sentRequests = requests.filter(r => r.fromUser.id === currentUser.id && r.status === 'pending');
  const confirmedSwaps = requests.filter(r => (r.toUser.id === currentUser.id || r.fromUser.id === currentUser.id) && r.status === 'accepted');

  const SwapCard = ({ request }: { request: SwapRequest }) => (
    <Card>
      <CardContent className="p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="flex items-center gap-3 flex-shrink-0">
          <Avatar className="h-12 w-12">
            <AvatarImage src={request.fromUser.id === currentUser.id ? request.toUser.avatarUrl : request.fromUser.avatarUrl} data-ai-hint={request.fromUser.id === currentUser.id ? request.toUser.dataAiHint : request.fromUser.dataAiHint} />
            <AvatarFallback>{(request.fromUser.id === currentUser.id ? request.toUser.name : request.fromUser.name).charAt(0)}</AvatarFallback>
          </Avatar>
           <div>
            <p className="font-semibold">{request.fromUser.id === currentUser.id ? request.toUser.name : request.fromUser.name}</p>
            <div className="flex items-center text-sm text-muted-foreground">
                <Badge variant="secondary" className="mr-2">{request.fromUser.id === currentUser.id ? request.skillWanted.name : request.skillOffered.name}</Badge>
                <ArrowLeftRight className="h-4 w-4 text-muted-foreground" />
                <Badge variant="outline" className="ml-2">{request.fromUser.id === currentUser.id ? request.skillOffered.name : request.skillWanted.name}</Badge>
            </div>
          </div>
        </div>
        
        {request.message && <p className="text-sm text-muted-foreground border-l-2 pl-3 italic sm:ml-auto flex-grow">{request.message}</p>}

        <div className="flex gap-2 ml-auto flex-shrink-0">
          {request.toUser.id === currentUser.id && request.status === 'pending' && (
            <>
              <Button size="sm" onClick={() => handleRequest(request.id, 'accepted')} className="bg-green-600 hover:bg-green-700"><Check className="h-4 w-4 mr-1"/>Accept</Button>
              <Button size="sm" variant="destructive" onClick={() => handleRequest(request.id, 'rejected')}><X className="h-4 w-4 mr-1"/>Decline</Button>
            </>
          )}
          {request.fromUser.id === currentUser.id && request.status === 'pending' && (
             <Button size="sm" variant="destructive" onClick={() => handleDelete(request.id)}><Trash2 className="h-4 w-4 mr-1"/>Delete</Button>
          )}
          {request.status === 'accepted' && (
             <div className="flex items-center gap-2">
                <Badge className="bg-green-100 text-green-800 border-green-300">Confirmed</Badge>
                <Button size="sm" variant="outline" onClick={() => handleCancel(request.id)}>Cancel</Button>
             </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-8">
       <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-headline">Manage Your Swaps</CardTitle>
          <CardDescription>Review requests from others and track your outgoing proposals.</CardDescription>
        </CardHeader>
      </Card>

      <Tabs defaultValue="incoming">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="incoming">Incoming Requests <Badge className="ml-2">{incomingRequests.length}</Badge></TabsTrigger>
          <TabsTrigger value="sent">Sent Requests <Badge className="ml-2">{sentRequests.length}</Badge></TabsTrigger>
          <TabsTrigger value="confirmed">Confirmed Swaps <Badge className="ml-2">{confirmedSwaps.length}</Badge></TabsTrigger>
        </TabsList>

        <TabsContent value="incoming" className="mt-6 space-y-4">
          {incomingRequests.length > 0 ? incomingRequests.map(req => <SwapCard key={req.id} request={req} />) : <p className="text-center text-muted-foreground py-8">No new incoming requests.</p>}
        </TabsContent>
        <TabsContent value="sent" className="mt-6 space-y-4">
          {sentRequests.length > 0 ? sentRequests.map(req => <SwapCard key={req.id} request={req} />) : <p className="text-center text-muted-foreground py-8">You haven't sent any requests yet.</p>}
        </TabsContent>
        <TabsContent value="confirmed" className="mt-6 space-y-4">
          {confirmedSwaps.length > 0 ? confirmedSwaps.map(req => <SwapCard key={req.id} request={req} />) : <p className="text-center text-muted-foreground py-8">No confirmed swaps yet.</p>}
        </TabsContent>
      </Tabs>
    </div>
  );
}
