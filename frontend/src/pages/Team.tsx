"use client";

import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import TeamMemberCard from "@/components/team/TeamMemberCard";
import InviteMemberButton from "@/components/team/InviteMemberButton";
import TeamFilter from "@/components/team/TeamFilter";

const Team = () => {
  const teamMembers = [
    { 
      id: 1, 
      name: "Alex Johnson", 
      role: "Project Manager", 
      email: "alex@example.com", 
      status: "online" as const,
      tasks: 12
    },
    { 
      id: 2, 
      name: "Sam Smith", 
      role: "Designer", 
      email: "sam@example.com", 
      status: "online" as const,
      tasks: 8
    },
    { 
      id: 3, 
      name: "Taylor Brown", 
      role: "Developer", 
      email: "taylor@example.com", 
      status: "away" as const,
      tasks: 15
    },
    { 
      id: 4, 
      name: "Jordan Lee", 
      role: "Marketing", 
      email: "jordan@example.com", 
      status: "offline" as const,
      tasks: 5
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Team</h1>
        <InviteMemberButton />
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search team members..."
            className="w-full rounded-md border pl-8 pr-4 py-2"
          />
        </div>
        <TeamFilter />
      </div>

      <div className="border rounded-lg">
        <div className="border-b p-4 font-medium">
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-4">Member</div>
            <div className="col-span-3">Role</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-2">Tasks</div>
            <div className="col-span-1"></div>
          </div>
        </div>
        <div className="divide-y">
          {teamMembers.map((member) => (
            <TeamMemberCard
              key={member.id}
              id={member.id}
              name={member.name}
              role={member.role}
              email={member.email}
              status={member.status}
              tasks={member.tasks}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Team;