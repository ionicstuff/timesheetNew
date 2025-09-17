"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  User, 
  Building2, 
  Users, 
  CheckCircle,
  ArrowRight,
  ArrowLeft
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";

const UserOnboarding = () => {
  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    bio: "",
    avatar: ""
  });
  
  const [workspace, setWorkspace] = useState({
    name: "",
    description: ""
  });
  
  const [team, setTeam] = useState({
    members: [] as string[]
  });
  
  const { toast } = useToast();

  const nextStep = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      // Complete onboarding
      console.log("Onboarding complete:", { profile, workspace, team });
      toast({
        title: "Onboarding complete!",
        description: "Welcome to Motion. Your account is ready to use."
      });
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setProfile(prev => ({
            ...prev,
            avatar: event.target?.result as string
          }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">Welcome to Motion</h1>
        <p className="text-muted-foreground mt-2">
          Let's set up your account and get you started
        </p>
      </div>
      
      <div className="mb-8">
        <div className="flex justify-center">
          <div className="flex items-center">
            {[1, 2, 3].map((num) => (
              <div key={num} className="flex items-center">
                <div 
                  className={`h-8 w-8 rounded-full flex items-center justify-center ${
                    step >= num 
                      ? "bg-primary text-primary-foreground" 
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {step > num ? <CheckCircle className="h-4 w-4" /> : num}
                </div>
                {num < 3 && (
                  <div 
                    className={`h-1 w-16 ${
                      step > num ? "bg-primary" : "bg-muted"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
        <div className="flex justify-center mt-2">
          <p className="text-sm text-muted-foreground">
            {step === 1 && "Tell us about yourself"}
            {step === 2 && "Create your workspace"}
            {step === 3 && "Invite your team"}
          </p>
        </div>
      </div>
      
      <div className="border rounded-lg p-6">
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-2">Your Profile</h2>
              <p className="text-muted-foreground">
                Help others recognize you in Motion
              </p>
            </div>
            
            <div className="flex items-center gap-6">
              <div className="relative">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={profile.avatar} alt="Profile" />
                  <AvatarFallback>
                    {profile.firstName.charAt(0)}{profile.lastName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <label 
                  htmlFor="avatar-upload" 
                  className="absolute bottom-0 right-0 bg-primary rounded-full p-1.5 cursor-pointer"
                >
                  <User className="h-3 w-3 text-primary-foreground" />
                </label>
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  JPG, GIF or PNG. Max size of 5MB
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="first-name">First Name</Label>
                <Input
                  id="first-name"
                  value={profile.firstName}
                  onChange={(e) => setProfile(prev => ({ ...prev, firstName: e.target.value }))}
                  placeholder="John"
                />
              </div>
              <div>
                <Label htmlFor="last-name">Last Name</Label>
                <Input
                  id="last-name"
                  value={profile.lastName}
                  onChange={(e) => setProfile(prev => ({ ...prev, lastName: e.target.value }))}
                  placeholder="Doe"
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  placeholder="Tell us about yourself"
                  className="resize-none"
                  rows={3}
                  value={profile.bio}
                  onChange={(e) => setProfile(prev => ({ ...prev, bio: e.target.value }))}
                />
              </div>
            </div>
          </div>
        )}
        
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-2">Your Workspace</h2>
              <p className="text-muted-foreground">
                A workspace is where you'll organize your projects and collaborate with your team
              </p>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="workspace-name">Workspace Name</Label>
                <Input
                  id="workspace-name"
                  value={workspace.name}
                  onChange={(e) => setWorkspace(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Acme Inc."
                />
              </div>
              <div>
                <Label htmlFor="workspace-description">Description (Optional)</Label>
                <Textarea
                  id="workspace-description"
                  placeholder="What is this workspace for?"
                  className="resize-none"
                  rows={3}
                  value={workspace.description}
                  onChange={(e) => setWorkspace(prev => ({ ...prev, description: e.target.value }))}
                />
              </div>
            </div>
            
            <div className="p-4 bg-muted rounded-lg">
              <div className="flex items-start gap-3">
                <Building2 className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium">Workspace Tips</p>
                  <ul className="text-sm text-muted-foreground list-disc pl-5 mt-1 space-y-1">
                    <li>Workspaces can be organized by company, department, or project</li>
                    <li>You can create multiple workspaces and switch between them anytime</li>
                    <li>Each workspace has its own members, projects, and settings</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-2">Invite Your Team</h2>
              <p className="text-muted-foreground">
                Bring your colleagues to Motion to start collaborating
              </p>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="email-invite">Invite by email</Label>
                <div className="flex gap-2 mt-1">
                  <Input
                    id="email-invite"
                    type="email"
                    placeholder="colleague@example.com"
                  />
                  <Button variant="outline">Add</Button>
                </div>
              </div>
              
              <div className="border rounded-lg p-4">
                <h3 className="font-medium mb-3">Added Members</h3>
                {team.members.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No members added yet. Add email addresses above to invite them.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {team.members.map((member, index) => (
                      <div key={index} className="flex items-center justify-between p-2 hover:bg-muted rounded">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>
                              {member.split('@')[0].charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <span>{member}</span>
                        </div>
                        <Button variant="ghost" size="sm">Remove</Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            <div className="p-4 bg-muted rounded-lg">
              <div className="flex items-start gap-3">
                <Users className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium">Team Collaboration</p>
                  <ul className="text-sm text-muted-foreground list-disc pl-5 mt-1 space-y-1">
                    <li>Team members can be invited to specific projects or the entire workspace</li>
                    <li>You can manage permissions and roles after setup</li>
                    <li>Members will receive an email invitation to join</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div className="flex justify-between mt-8">
          <Button 
            variant="outline" 
            onClick={prevStep} 
            disabled={step === 1}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <Button onClick={nextStep}>
            {step === 3 ? "Complete Setup" : "Continue"}
            {step < 3 && <ArrowRight className="h-4 w-4 ml-2" />}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UserOnboarding;