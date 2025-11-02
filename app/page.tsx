'use client';

import { useAuthActions } from '@convex-dev/auth/react';
import { Authenticated, Unauthenticated, useQuery } from 'convex/react';
import { useState } from 'react';
import { api } from '@/convex/_generated/api';
import Header from "@/components/layout/Header";
import LeftSidebar from "@/components/layout/LeftSidebar";
import RightSidebar from "@/components/layout/RightSidebar";
import Feed from "@/components/ui/Feed";
import AuthModal from "@/components/auth/AuthModal";
import CreateProfile from "@/components/profile/CreateProfile";

function AuthenticatedApp() {
  const profile = useQuery(api.users.queries.getCurrentProfile);
  
  if (profile === undefined) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }
  
  if (!profile) {
    return <CreateProfile />;
  }
  
  return (
    <>
      <Header />
      <div className="flex">
        <LeftSidebar />
        <main className="flex-1 py-6">
          <Feed />
        </main>
        <RightSidebar />
      </div>
    </>
  );
}

export default function Home() {
  const [showAuthModal, setShowAuthModal] = useState(false);

  return (
    <div className="min-h-screen bg-gray-900">
      <Authenticated>
        <AuthenticatedApp />
      </Authenticated>

      <Unauthenticated>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <span className="text-white font-bold text-xl">WF</span>
            </div>
            <h1 className="text-4xl font-bold text-white mb-4">
              Welcome to WorldFriends
            </h1>
            <p className="text-gray-400 mb-8 max-w-md">
              Connect with friends from around the world, share experiences, and build meaningful relationships.
            </p>
            <button
              onClick={() => setShowAuthModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-colors"
            >
              Get Started
            </button>
          </div>
        </div>
        
        <AuthModal 
          isOpen={showAuthModal} 
          onClose={() => setShowAuthModal(false)} 
        />
      </Unauthenticated>
    </div>
  );
}
