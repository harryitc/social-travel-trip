'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/radix-ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/radix-ui/avatar';
import { Badge } from '@/components/ui/radix-ui/badge';
import { Button } from '@/components/ui/radix-ui/button';
import { Calendar, MapPin, Users, Clock, Globe, Lock } from 'lucide-react';
import { InviteMembersDialog } from './invite-members-dialog';

type TripDetailsProps = {
  trip: {
    id: string;
    title: string;
    description: string;
    location: string;
    date: string;
    duration: string;
    image: string;
    members: {
      count: number;
      max: number;
      list: {
        id: string;
        name: string;
        avatar: string;
      }[];
    };
    hashtags: string[];
    isPrivate: boolean;
  };
};

export function TripDetails({ trip }: TripDetailsProps) {
  const [members, setMembers] = useState(trip.members.list);
  const [memberCount, setMemberCount] = useState(trip.members.count);

  const handleInviteMembers = (newMembers: typeof trip.members.list) => {
    setMembers([...members, ...newMembers]);
    setMemberCount(memberCount + newMembers.length);
  };
  return (
    <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
      <Card className="lg:col-span-2 border-purple-100 dark:border-purple-900 bg-white/90 dark:bg-gray-950/90 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Thông tin chuyến đi</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="aspect-video rounded-lg overflow-hidden">
            {/* eslint-disable-next-line */}
            <img
              src={trip.image}
              alt={trip.title}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>{trip.location}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>{trip.date}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>{trip.duration}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Users className="h-4 w-4" />
                <span>{memberCount}/{trip.members.max} thành viên</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                {trip.isPrivate ? (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Lock className="h-3 w-3" />
                    Riêng tư
                  </Badge>
                ) : (
                  <Badge className="bg-green-500 flex items-center gap-1">
                    <Globe className="h-3 w-3" />
                    Công khai
                  </Badge>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                {trip.hashtags.map((tag) => (
                  <Badge key={tag} variant="outline" className="bg-purple-100/50 hover:bg-purple-200/50 text-purple-700 dark:bg-purple-900/30 dark:hover:bg-purple-800/30 dark:text-purple-300 border-purple-200 dark:border-purple-800">
                    #{tag}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-2">Mô tả</h3>
            <p className="text-muted-foreground">{trip.description}</p>
          </div>
        </CardContent>
      </Card>

      <Card className="border-purple-100 dark:border-purple-900 bg-white/90 dark:bg-gray-950/90 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Thành viên</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {members.map((member) => (
              <div key={member.id} className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={member.avatar} alt={member.name} />
                  <AvatarFallback>{member.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{member.name}</p>
                </div>
              </div>
            ))}

            {memberCount < trip.members.max && (
              <InviteMembersDialog
                tripId={trip.id}
                currentMembers={members}
                maxMembers={trip.members.max}
                onInvite={handleInviteMembers}
              />
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}