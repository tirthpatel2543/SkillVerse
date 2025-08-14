"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { users, skills as allSkills } from '@/lib/data';
import type { Skill } from '@/lib/data';
import { Upload, X, PlusCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function ProfilePage() {
  const [user, setUser] = useState(users[0]);
  const [skillInput, setSkillInput] = useState<{ offered: string; wanted: string }>({ offered: '', wanted: '' });
  const { toast } = useToast();

  const handleAddSkill = (type: 'offered' | 'wanted') => {
    const newSkillName = skillInput[type].trim();
    if (newSkillName) {
      const existingSkill = user.skillsOffered.find(s => s.name.toLowerCase() === newSkillName.toLowerCase()) || user.skillsWanted.find(s => s.name.toLowerCase() === newSkillName.toLowerCase());
      if (existingSkill) {
        toast({ title: "Skill already added", description: "You have this skill in one of your lists already.", variant: "destructive" });
        return;
      }
      
      const newSkill: Skill = {
        id: (allSkills.length + 1).toString(),
        name: newSkillName,
      };
      
      const key = type === 'offered' ? 'skillsOffered' : 'skillsWanted';
      setUser({ ...user, [key]: [...user[key], newSkill] });
      setSkillInput({ ...skillInput, [type]: '' });
    }
  };

  const handleRemoveSkill = (skillId: string, type: 'offered' | 'wanted') => {
    const key = type === 'offered' ? 'skillsOffered' : 'skillsWanted';
    setUser({ ...user, [key]: user[key].filter(s => s.id !== skillId) });
  };
  
  const handleSaveChanges = () => {
    toast({
      title: "Profile Saved!",
      description: "Your changes have been successfully saved.",
    });
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-headline">Edit Your Profile</CardTitle>
          <CardDescription>Keep your profile details and skills up to date.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center space-x-6">
            <Avatar className="h-24 w-24 border-4 border-primary/50">
              <AvatarImage src={user.avatarUrl} alt={user.name} />
              <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="space-y-2">
              <Label htmlFor="profile-photo">Profile Photo</Label>
              <Button variant="outline"><Upload className="mr-2 h-4 w-4" /> Upload New Photo</Button>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" value={user.name} onChange={(e) => setUser({...user, name: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location (Optional)</Label>
              <Input id="location" value={user.location} onChange={(e) => setUser({...user, location: e.target.value})} placeholder="e.g., San Francisco, CA" />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Skills Offered</CardTitle>
            <CardDescription>What skills can you share with others?</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input value={skillInput.offered} onChange={(e) => setSkillInput({...skillInput, offered: e.target.value})} placeholder="e.g., Painting" />
              <Button onClick={() => handleAddSkill('offered')}><PlusCircle className="h-4 w-4 mr-2" /> Add</Button>
            </div>
            <div className="flex flex-wrap gap-2 min-h-[40px]">
              {user.skillsOffered.map(skill => (
                <Badge key={skill.id} className="text-base py-1 pl-3 pr-1">
                  {skill.name}
                  <button onClick={() => handleRemoveSkill(skill.id, 'offered')} className="ml-2 rounded-full hover:bg-destructive/80 p-0.5">
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Skills Wanted</CardTitle>
            <CardDescription>What skills are you looking to learn?</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input value={skillInput.wanted} onChange={(e) => setSkillInput({...skillInput, wanted: e.target.value})} placeholder="e.g., Public Speaking" />
              <Button onClick={() => handleAddSkill('wanted')}><PlusCircle className="h-4 w-4 mr-2" /> Add</Button>
            </div>
            <div className="flex flex-wrap gap-2 min-h-[40px]">
              {user.skillsWanted.map(skill => (
                 <Badge key={skill.id} variant="secondary" className="text-base py-1 pl-3 pr-1">
                  {skill.name}
                  <button onClick={() => handleRemoveSkill(skill.id, 'wanted')} className="ml-2 rounded-full hover:bg-destructive/80 p-0.5">
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Availability & Privacy</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label className="font-semibold">Set Your Availability</Label>
            <div className="flex flex-col sm:flex-row gap-4 mt-2">
              {['Weekdays', 'Weekends', 'Evenings'].map(day => (
                <div key={day} className="flex items-center space-x-2">
                  <Checkbox id={day.toLowerCase()} checked={user.availability.includes(day)} onCheckedChange={(checked) => {
                    const newAvailability = checked ? [...user.availability, day] : user.availability.filter(d => d !== day);
                    setUser({...user, availability: newAvailability});
                  }} />
                  <Label htmlFor={day.toLowerCase()}>{day}</Label>
                </div>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div>
              <Label htmlFor="privacy-mode" className="font-semibold">Public Profile</Label>
              <p className="text-sm text-muted-foreground">Allow other users to find your profile in searches.</p>
            </div>
            <Switch id="privacy-mode" checked={user.isPublic} onCheckedChange={(checked) => setUser({...user, isPublic: checked})} />
          </div>
        </CardContent>
      </Card>
      
      <div className="flex justify-end">
        <Button size="lg" onClick={handleSaveChanges} style={{ backgroundColor: 'hsl(var(--accent))', color: 'hsl(var(--accent-foreground))' }}>Save Changes</Button>
      </div>
    </div>
  );
}
