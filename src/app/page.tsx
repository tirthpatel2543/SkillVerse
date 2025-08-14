"use client";

import { useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { UserCard } from '@/components/UserCard';
import { users as allUsers } from '@/lib/data';
import type { User } from '@/lib/data';
import { Search } from 'lucide-react';

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const [users] = useState<User[]>(allUsers);

  const filteredUsers = useMemo(() => {
    if (!searchTerm) {
      return users;
    }
    return users.filter(user =>
      user.skillsOffered.some(skill =>
        skill.name.toLowerCase().includes(searchTerm.toLowerCase())
      ) ||
      user.skillsWanted.some(skill =>
        skill.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, users]);

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl font-headline">
          Find Your Skill Swap
        </h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          Browse profiles, discover new talents, and connect with people to exchange skills.
        </p>
      </div>

      <div className="max-w-xl mx-auto">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search for a skill (e.g., 'Guitar', 'Cooking')..."
            className="pl-10 text-base"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {filteredUsers.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredUsers.map(user => (
            <UserCard key={user.id} user={user} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-muted-foreground">No users found matching your search.</p>
        </div>
      )}
    </div>
  );
}
