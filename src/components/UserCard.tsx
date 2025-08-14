"use client";

import Image from 'next/image';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { User } from '@/lib/data';
import { ArrowRight, MapPin } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

interface UserCardProps {
  user: User;
}

export function UserCard({ user: userData }: UserCardProps) {
  const router = useRouter();
  const { user: authUser } = useAuth();


  const handleRequestSwap = () => {
    if (authUser) {
      // Logic for when user is logged in
      console.log('Requesting swap with', userData.name);
      // For now, we'll just log. Later we can open a swap request modal.
      router.push('/swaps');
    } else {
      // Redirect to login page
      router.push('/login');
    }
  };

  return (
    <Card className="flex flex-col overflow-hidden transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-xl">
      <CardHeader className="flex flex-row items-center gap-4 p-4 bg-secondary/30">
        <Avatar className="h-16 w-16 border-2 border-primary">
          <AvatarImage src={userData.avatarUrl} alt={userData.name} />
          <AvatarFallback>{userData.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div>
          <CardTitle className="text-xl font-headline">{userData.name}</CardTitle>
          {userData.location && (
            <CardDescription className="flex items-center gap-1 text-muted-foreground">
              <MapPin className="h-4 w-4" />
              {userData.location}
            </CardDescription>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-sm mb-2 text-foreground">Offers</h4>
            <div className="flex flex-wrap gap-2">
              {userData.skillsOffered.map(skill => (
                <Badge key={skill.id} variant="secondary">{skill.name}</Badge>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-sm mb-2 text-foreground">Wants</h4>
            <div className="flex flex-wrap gap-2">
              {userData.skillsWanted.map(skill => (
                <Badge key={skill.id} variant="outline">{skill.name}</Badge>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 bg-muted/50">
        <Button onClick={handleRequestSwap} className="w-full" style={{ backgroundColor: 'hsl(var(--accent))', color: 'hsl(var(--accent-foreground))' }} >
          Request Swap
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}
