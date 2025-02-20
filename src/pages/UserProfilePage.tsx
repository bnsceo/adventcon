import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2, User, Users, BookOpen, Bell } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfileForm } from "@/components/profile/ProfileForm";
import type { Profile } from "@/types/profile";

const UserProfilePage = () => {
  // ... existing imports and state declarations remain the same ...

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header />
        <main className="max-w-4xl mx-auto px-4 pt-20 pb-16">
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
          </div>
        </main>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header />
        <main className="max-w-4xl mx-auto px-4 pt-20 pb-16">
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <h1 className="text-2xl font-bold text-slate-900 mb-2">Profile not found</h1>
            <p className="text-slate-600">The requested profile could not be found.</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <main className="max-w-4xl mx-auto px-4 pt-20 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Left Sidebar - Profile Summary */}
          <aside className="hidden md:block md:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-4 sticky top-20">
              <div className="flex flex-col items-center">
                <div className="w-20 h-20 rounded-full overflow-hidden mb-3">
                  <img
                    src={profile.avatar_url || '/default-avatar.png'}
                    alt={`${profile.username}'s profile`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h2 className="font-semibold text-lg text-slate-900">{profile.username}</h2>
                {profile.full_name && (
                  <p className="text-sm text-slate-600 mb-1">{profile.full_name}</p>
                )}
                
                <div className="w-full border-t border-slate-200 pt-4 mt-2">
                  <div className="flex justify-between text-sm mb-4">
                    <span className="text-slate-600">Connections</span>
                    <span className="font-medium text-indigo-600">247</span>
                  </div>
                  <div className="flex justify-between text-sm mb-4">
                    <span className="text-slate-600">Bible Studies</span>
                    <span className="font-medium text-indigo-600">12</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Prayer Requests</span>
                    <span className="font-medium text-indigo-600">8</span>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Profile Content */}
          <div className="md:col-span-3">
            <Card className="bg-white rounded-lg shadow-sm">
              <CardHeader className="border-b border-slate-200">
                <h1 className="text-xl font-bold text-slate-900">
                  {isOwnProfile ? 'Your Profile' : `${profile.username}'s Profile`}
                </h1>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-6">
                  <ProfileHeader
                    profile={profile}
                    isOwnProfile={isOwnProfile}
                    isEditing={isEditing}
                    avatarFile={avatarFile}
                    onAvatarChange={handleFileChange}
                  />
                  <ProfileForm
                    profile={profile}
                    isEditing={isEditing}
                    isOwnProfile={isOwnProfile}
                    formData={formData}
                    setFormData={setFormData}
                    onSubmit={handleSubmit}
                    setIsEditing={setIsEditing}
                    isPending={updateProfile.isPending}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <MobileNav />
    </div>
  );
};

// Reusable Header Component
const Header = () => (
  <header className="bg-indigo-700 text-white fixed w-full z-10 shadow-md">
    <div className="max-w-6xl mx-auto px-4">
      <nav className="flex items-center justify-between h-16">
        <h1 className="text-xl font-bold">Adventist.com</h1>
        <div className="flex items-center gap-4">
          <button className="p-2 rounded-full hover:bg-indigo-600 transition-colors">
            <Bell className="w-5 h-5" />
          </button>
          <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-200">
            <User className="w-full h-full p-1.5 text-slate-600" />
          </div>
        </div>
      </nav>
    </div>
  </header>
);

// Reusable Mobile Navigation
const MobileNav = () => (
  <nav className="md:hidden fixed bottom-0 w-full bg-white border-t border-slate-200 shadow-lg z-10">
    <div className="flex justify-around items-center h-16">
      {[
        { icon: <Home className="w-6 h-6" />, label: 'Home' },
        { icon: <Users className="w-6 h-6" />, label: 'Community' },
        { icon: <BookOpen className="w-6 h-6" />, label: 'Studies' },
        { icon: <User className="w-6 h-6" />, label: 'Profile' },
      ].map((item) => (
        <button
          key={item.label}
          className="flex flex-col items-center text-slate-600"
          aria-label={item.label}
        >
          {item.icon}
          <span className="text-xs mt-1">{item.label}</span>
        </button>
      ))}
    </div>
  </nav>
);

export default UserProfilePage;
