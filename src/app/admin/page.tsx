"use client";

import { useState, useMemo } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  AlertCircle,
  Ban,
  CheckCircle2,
  Download,
  FileX2,
  Send,
  ShieldBan,
  ShieldCheck,
  XCircle,
  Clock,
} from 'lucide-react';
import { users as allUsers, skills as allSkills, swapRequests as allSwaps } from '@/lib/data';
import type { User, Skill, SwapRequest } from '@/lib/data';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';


export default function AdminPage() {
  const { user: authUser, loading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  
  // In a real app, you'd fetch user details from a DB using authUser.uid
  const currentUser = useMemo(() => allUsers.find(u => u.id === '1'), []);
  
  const [users, setUsers] = useState<User[]>(allUsers);
  const [skills, setSkills] = useState<Skill[]>(allSkills);
  const [swaps, setSwaps] = useState<SwapRequest[]>(allSwaps);
  const [announcement, setAnnouncement] = useState('');

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  if (!authUser || !currentUser?.isAdmin) {
    // In a real app, this should be a more robust check on the server
    router.push('/');
    return null;
  }

  const handleBanUser = (userId: string) => {
    setUsers(users.map(u => u.id === userId ? { ...u, isBanned: !u.isBanned } : u));
    const user = users.find(u => u.id === userId);
    toast({
      title: `User ${user?.isBanned ? 'Unbanned' : 'Banned'}`,
      description: `${user?.name} has been ${user?.isBanned ? 'unbanned' : 'banned'}.`,
    });
  };

  const handleRejectSkill = (skillId: string) => {
    setSkills(skills.filter(s => s.id !== skillId));
    const skill = skills.find(s => s.id === skillId);
    toast({
      title: 'Skill Rejected',
      description: `The skill "${skill?.name}" has been removed.`,
      variant: 'destructive',
    });
  };
  
  const handleSendAnnouncement = () => {
      if (!announcement.trim()) {
          toast({ title: 'Cannot send empty message', variant: 'destructive' });
          return;
      }
    toast({
      title: 'Announcement Sent!',
      description: 'Your message has been broadcast to all users.',
    });
    setAnnouncement('');
  };

  const handleDownloadReport = (reportType: string) => {
    toast({
      title: 'Report Download Started',
      description: `Downloading ${reportType} report... (mock action)`,
    });
  };

  const getStatusIcon = (status: SwapRequest['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'accepted':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'cancelled':
        return <FileX2 className="h-4 w-4 text-gray-500" />;
      default:
        return null;
    }
  };


  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold tracking-tight text-foreground font-headline">
        Admin Dashboard
      </h1>

      <Tabs defaultValue="swaps">
        <TabsList className="grid w-full grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <TabsTrigger value="swaps">Swap Monitoring</TabsTrigger>
          <TabsTrigger value="users">User Management</TabsTrigger>
          <TabsTrigger value="skills">Skill Moderation</TabsTrigger>
          <TabsTrigger value="platform">Platform Tools</TabsTrigger>
        </TabsList>
        
        <TabsContent value="swaps" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>All Swap Requests</CardTitle>
              <CardDescription>Monitor all pending, accepted, rejected, and cancelled swaps on the platform.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>From</TableHead>
                    <TableHead>To</TableHead>
                    <TableHead>Swap Details</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {swaps.map(swap => (
                    <TableRow key={swap.id}>
                      <TableCell>{swap.fromUser.name}</TableCell>
                      <TableCell>{swap.toUser.name}</TableCell>
                      <TableCell>
                          <div className='flex items-center gap-2'>
                              <Badge variant="secondary">{swap.skillOffered.name}</Badge>
                              <span>for</span>
                              <Badge variant="outline">{swap.skillWanted.name}</Badge>
                          </div>
                      </TableCell>
                      <TableCell>
                          <div className="flex items-center gap-2 capitalize">
                            {getStatusIcon(swap.status)}
                            {swap.status}
                          </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>View, manage, and ban users who violate platform policies.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map(user => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={user.avatarUrl} />
                            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{user.name}</p>
                            <p className="text-sm text-muted-foreground">{user.isAdmin ? 'Admin' : 'User'}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={user.isBanned ? 'destructive' : 'default'} className="flex items-center gap-1 w-fit">
                          {user.isBanned ? <><ShieldBan className="h-3 w-3" /> Banned</> : <><ShieldCheck className="h-3 w-3" /> Active</>}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant={user.isBanned ? "outline" : "destructive"}
                          size="sm"
                          onClick={() => handleBanUser(user.id)}
                          disabled={user.isAdmin}
                        >
                          {user.isBanned ? <ShieldCheck className="h-4 w-4 mr-2" /> : <Ban className="h-4 w-4 mr-2" />}
                          {user.isBanned ? 'Unban' : 'Ban'}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="skills" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Skill Moderation</CardTitle>
              <CardDescription>Review and reject inappropriate or spammy skill descriptions.</CardDescription>
            </CardHeader>
            <CardContent>
               <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Skill Name</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {skills.map(skill => (
                    <TableRow key={skill.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          {skill.icon && <skill.icon className="h-5 w-5 text-muted-foreground" />}
                          <span className="font-medium">{skill.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button variant="destructive" size="sm" onClick={() => handleRejectSkill(skill.id)}>
                            <AlertCircle className="h-4 w-4 mr-2" />
                            Reject
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="platform" className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
                <CardHeader>
                    <CardTitle>Platform Announcement</CardTitle>
                    <CardDescription>Send a message to all users (e.g., feature updates, downtime alerts).</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Textarea 
                        placeholder="Type your announcement here..." 
                        value={announcement}
                        onChange={(e) => setAnnouncement(e.target.value)}
                        rows={5}
                    />
                    <Button onClick={handleSendAnnouncement}>
                        <Send className="h-4 w-4 mr-2" />
                        Send Announcement
                    </Button>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Download Reports</CardTitle>
                    <CardDescription>Get reports of user activity, feedback logs, and swap statistics.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                    <Button variant="outline" className="w-full justify-start" onClick={() => handleDownloadReport('User Activity')}>
                        <Download className="h-4 w-4 mr-2" />
                        User Activity Report
                    </Button>
                    <Button variant="outline" className="w-full justify-start" onClick={() => handleDownloadReport('Feedback Logs')}>
                        <Download className="h-4 w-4 mr-2" />
                        Feedback Logs
                    </Button>
                    <Button variant="outline" className="w-full justify-start" onClick={() => handleDownloadReport('Swap Statistics')}>
                        <Download className="h-4 w-4 mr-2" />
                        Swap Statistics Report
                    </Button>
                </CardContent>
            </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
