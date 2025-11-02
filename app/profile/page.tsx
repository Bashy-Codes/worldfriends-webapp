'use client';

import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { User, MapPin, Calendar, Globe, MessageSquare, Heart, Edit } from 'lucide-react';

export default function ProfilePage() {
  const profileData = useQuery(api.users.queries.getFullProfile);

  if (profileData === undefined) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">Profile not found</div>
      </div>
    );
  }

  const { user, profile, userInfo } = profileData;
  const age = new Date().getFullYear() - new Date(user.birthDate).getFullYear();

  return (
    <div className="min-h-screen bg-gray-900 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-gray-800 rounded-2xl p-8 mb-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-6">
              <div className="relative">
                <img
                  src={user.profilePicture}
                  alt={user.name}
                  className="w-24 h-24 rounded-full object-cover"
                />
                {user.isPremium && (
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">★</span>
                  </div>
                )}
              </div>
              
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">{user.name}</h1>
                <p className="text-gray-400 mb-2">@{user.userName}</p>
                <div className="flex items-center space-x-4 text-sm text-gray-400">
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-4 h-4" />
                    <span>{user.country}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>{age} years old</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <User className="w-4 h-4" />
                    <span className="capitalize">{user.gender}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <button className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
              <Edit className="w-4 h-4" />
              <span>Edit Profile</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* About Me */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-gray-800 rounded-2xl p-6">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
                <MessageSquare className="w-5 h-5" />
                <span>About Me</span>
              </h2>
              <p className="text-gray-300 leading-relaxed">{profile.aboutMe}</p>
            </div>

            {/* Languages */}
            <div className="bg-gray-800 rounded-2xl p-6">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
                <Globe className="w-5 h-5" />
                <span>Languages</span>
              </h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-white font-medium mb-2">I Speak</h3>
                  <div className="flex flex-wrap gap-2">
                    {profile.spokenLanguages.map(lang => (
                      <span key={lang} className="bg-green-600 text-white px-3 py-1 rounded-full text-sm">
                        {lang}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-white font-medium mb-2">I'm Learning</h3>
                  <div className="flex flex-wrap gap-2">
                    {profile.learningLanguages.map(lang => (
                      <span key={lang} className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm">
                        {lang}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Hobbies */}
            <div className="bg-gray-800 rounded-2xl p-6">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
                <Heart className="w-5 h-5" />
                <span>Hobbies & Interests</span>
              </h2>
              <div className="flex flex-wrap gap-2">
                {profile.hobbies.map(hobby => (
                  <span key={hobby} className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm">
                    {hobby}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Stats */}
            <div className="bg-gray-800 rounded-2xl p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Profile Stats</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Age Group</span>
                  <span className="text-white">{userInfo.ageGroup}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Gender Preference</span>
                  <span className="text-white">{userInfo.genderPreference ? 'Enabled' : 'Disabled'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Premium</span>
                  <span className={user.isPremium ? 'text-yellow-400' : 'text-gray-400'}>
                    {user.isPremium ? 'Yes' : 'No'}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-gray-800 rounded-2xl p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition-colors">
                  View My Posts
                </button>
                <button className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg transition-colors">
                  My Collections
                </button>
                <button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg transition-colors">
                  Account Settings
                </button>
              </div>
            </div>

            {/* Activity */}
            <div className="bg-gray-800 rounded-2xl p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Activity</h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Last Active</span>
                  <span className="text-white">
                    {new Date(userInfo.lastActive).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Member Since</span>
                  <span className="text-white">
                    {new Date(user._creationTime).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}