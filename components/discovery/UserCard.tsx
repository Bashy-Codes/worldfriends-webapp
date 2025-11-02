'use client';

import { UserCard as UserCardType } from '@/types/discovery';
import { MapPin, Globe, MessageCircle, UserPlus } from 'lucide-react';

interface UserCardProps {
  user: UserCardType;
}

export default function UserCard({ user }: UserCardProps) {
  return (
    <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700 hover:border-gray-600 transition-colors">
      <div className="flex items-start space-x-4">
        <div className="relative">
          <img
            src={user.profilePicture}
            alt={user.name}
            className="w-16 h-16 rounded-full object-cover"
          />
          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-gray-800"></div>
        </div>
        
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-white">{user.name}</h3>
            <span className="text-sm text-gray-400">{user.age} years</span>
          </div>
          
          <div className="flex items-center space-x-1 text-gray-400 text-sm mb-3">
            <MapPin className="w-4 h-4" />
            <span>{user.country}</span>
            <span className="mx-2">•</span>
            <span className="capitalize">{user.gender}</span>
          </div>

          <div className="space-y-2 mb-4">
            <div>
              <div className="flex items-center space-x-1 mb-1">
                <Globe className="w-3 h-3 text-green-400" />
                <span className="text-xs text-gray-400">Speaks</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {user.spokenLanguages.slice(0, 3).map(lang => (
                  <span key={lang} className="bg-green-600 text-white px-2 py-1 rounded text-xs">
                    {lang}
                  </span>
                ))}
                {user.spokenLanguages.length > 3 && (
                  <span className="text-xs text-gray-400">+{user.spokenLanguages.length - 3}</span>
                )}
              </div>
            </div>
            
            {user.learningLanguages.length > 0 && (
              <div>
                <div className="flex items-center space-x-1 mb-1">
                  <Globe className="w-3 h-3 text-blue-400" />
                  <span className="text-xs text-gray-400">Learning</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {user.learningLanguages.slice(0, 2).map(lang => (
                    <span key={lang} className="bg-blue-600 text-white px-2 py-1 rounded text-xs">
                      {lang}
                    </span>
                  ))}
                  {user.learningLanguages.length > 2 && (
                    <span className="text-xs text-gray-400">+{user.learningLanguages.length - 2}</span>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="flex space-x-2">
            <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-1">
              <UserPlus className="w-4 h-4" />
              <span>Add Friend</span>
            </button>
            <button className="bg-gray-700 hover:bg-gray-600 text-white p-2 rounded-lg transition-colors">
              <MessageCircle className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}