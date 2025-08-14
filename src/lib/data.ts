import { Brush, Code2, CookingPot, Guitar, Languages, Mic, Camera, ShieldBan, ShieldCheck } from 'lucide-react';

export type Skill = {
  id: string;
  name: string;
  icon?: React.ComponentType<{ className?: string }>;
};

export type User = {
  id: string;
  name: string;
  location?: string;
  avatarUrl: string;
  dataAiHint: string;
  availability: string[];
  skillsOffered: Skill[];
  skillsWanted: Skill[];
  isPublic: boolean;
  isAdmin?: boolean;
  isBanned?: boolean;
};

export type SwapRequest = {
  id: string;
  fromUser: Pick<User, 'id' | 'name' | 'avatarUrl' | 'dataAiHint'>;
  toUser: Pick<User, 'id' | 'name' | 'avatarUrl' | 'dataAiHint'>;
  skillOffered: Skill;
  skillWanted: Skill;
  status: 'pending' | 'accepted' | 'rejected' | 'cancelled';
  message?: string;
};

export const skills: Skill[] = [
  { id: '1', name: 'Web Development', icon: Code2 },
  { id: '2', name: 'Graphic Design', icon: Brush },
  { id: '3', name: 'Spanish', icon: Languages },
  { id: '4', name: 'Guitar Lessons', icon: Guitar },
  { id: '5', name: 'Cooking', icon: CookingPot },
  { id: '6', name: 'Podcasting', icon: Mic },
  { id: '7', name: 'Photography', icon: Camera },
];

export const users: User[] = [
  {
    id: '1',
    name: 'Alex Johnson',
    location: 'San Francisco, CA',
    avatarUrl: 'https://placehold.co/128x128.png',
    dataAiHint: 'professional portrait',
    availability: ['Weekends', 'Evenings'],
    skillsOffered: [skills[0], skills[1]],
    skillsWanted: [skills[2], skills[3]],
    isPublic: true,
    isAdmin: true,
  },
  {
    id: '2',
    name: 'Maria Garcia',
    location: 'Austin, TX',
    avatarUrl: 'https://placehold.co/128x128.png',
    dataAiHint: 'smiling woman',
    availability: ['Weekdays'],
    skillsOffered: [skills[2], skills[4]],
    skillsWanted: [skills[0]],
    isPublic: true,
  },
  {
    id: '3',
    name: 'Chen Wei',
    location: 'New York, NY',
    avatarUrl: 'https://placehold.co/128x128.png',
    dataAiHint: 'man city',
    availability: ['Evenings'],
    skillsOffered: [skills[3], skills[6]],
    skillsWanted: [skills[1], skills[5]],
    isPublic: true,
    isBanned: true,
  },
  {
    id: '4',
    name: 'Fatima Al-Sayed',
    location: 'Chicago, IL',
    avatarUrl: 'https://placehold.co/128x128.png',
    dataAiHint: 'woman scarf',
    availability: ['Weekends'],
    skillsOffered: [skills[5]],
    skillsWanted: [skills[4]],
    isPublic: true,
  },
   {
    id: '5',
    name: 'Ben Carter',
    location: 'London, UK',
    avatarUrl: 'https://placehold.co/128x128.png',
    dataAiHint: 'man glasses',
    availability: ['Weekends', 'Evenings'],
    skillsOffered: [skills[1], skills[6]],
    skillsWanted: [skills[0]],
    isPublic: false,
  },
  {
    id: '6',
    name: 'Yuki Tanaka',
    location: 'Tokyo, JP',
    avatarUrl: 'https://placehold.co/128x128.png',
    dataAiHint: 'asian woman',
    availability: ['Weekdays'],
    skillsOffered: [skills[4]],
    skillsWanted: [skills[3], skills[6]],
    isPublic: true,
  },
];

export const swapRequests: SwapRequest[] = [
  {
    id: 'req1',
    fromUser: users[1],
    toUser: users[0],
    skillOffered: skills[2],
    skillWanted: skills[0],
    status: 'pending',
    message: 'Hi Alex, I saw you want to learn Spanish. I can teach you in exchange for some web dev help!',
  },
  {
    id: 'req2',
    fromUser: users[2],
    toUser: users[1],
    skillOffered: skills[3],
    skillWanted: skills[4],
    status: 'accepted',
  },
  {
    id: 'req3',
    fromUser: users[0],
    toUser: users[3],
    skillOffered: skills[1],
    skillWanted: skills[5],
    status: 'pending',
    message: "Hey Fatima, I'd love to help with design if you can teach me some cooking basics.",
  },
  {
    id: 'req4',
    fromUser: users[0],
    toUser: users[2],
    skillOffered: skills[0],
    skillWanted: skills[6],
    status: 'rejected',
  },
  {
    id: 'req5',
    fromUser: users[4],
    toUser: users[5],
    skillOffered: skills[1],
    skillWanted: skills[3],
    status: 'cancelled',
  }
];
