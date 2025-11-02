'use client';

import { Home, Users, Compass, UserPlus, Mail, MessageCircle, User, LogOut } from 'lucide-react';
import { useState } from 'react';
import { useAuthActions } from '@convex-dev/auth/react';
import Link from 'next/link';

const navigationItems = [
  { icon: Home, label: 'Home', href: '/' },
  { icon: Users, label: 'Communities', href: '/communities' },
  { icon: Compass, label: 'Discover', href: '/discover' },
  { icon: UserPlus, label: 'Friends', href: '/friends' },
  { icon: Mail, label: 'Letters', href: '/letters' },
  { icon: MessageCircle, label: 'Conversations', href: '/conversations' },
  { icon: User, label: 'Profile', href: '/profile' },
];

export default function LeftSidebar() {
  const [activeItem, setActiveItem] = useState('Home');
  const { signOut } = useAuthActions();

  return (
    <aside className="w-64 mx-4 my-4 h-[calc(100vh-8rem)] bg-gray-800 border border-gray-700 rounded-2xl flex flex-col">
      <nav className="flex-1 px-4 py-6">
        <ul className="space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeItem === item.label;
            
            return (
              <li key={item.label}>
                <Link
                  href={item.href}
                  onClick={() => setActiveItem(item.label)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors ${
                    isActive
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      
      {/* Logout button at bottom */}
      <div className="px-4 py-6 border-t border-gray-700">
        <button 
          onClick={() => signOut()}
          className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-900/20 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
}