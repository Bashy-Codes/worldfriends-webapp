'use client';

import { useState, useEffect } from 'react';
import { useMutation, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { User, Calendar, Globe, MessageSquare, Heart, Camera, ArrowRight, ArrowLeft } from 'lucide-react';
import MultiSelect from './MultiSelect';
import { COUNTRIES, LANGUAGES, HOBBIES } from '@/constants/data';

interface ProfileData {
  name: string;
  userName: string;
  gender: 'male' | 'female' | 'other';
  birthDate: string;
  country: string;
  spokenLanguages: string[];
  learningLanguages: string[];
  aboutMe: string;
  hobbies: string[];
  profilePicture: string;
  genderPreference: boolean;
}

const STEPS = [
  'Basic Info',
  'Location & Languages',
  'About You',
  'Profile Photo'
];

export default function CreateProfile() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [usernameError, setUsernameError] = useState('');
  const [profileData, setProfileData] = useState<ProfileData>({
    name: '',
    userName: '',
    gender: 'other',
    birthDate: '',
    country: '',
    spokenLanguages: [],
    learningLanguages: [],
    aboutMe: '',
    hobbies: [],
    profilePicture: '',
    genderPreference: false
  });

  const createProfile = useMutation(api.users.mutations.createProfile);
  const checkUsername = useQuery(
    api.users.queries.checkUsernameAvailability,
    { userName: profileData.userName }
  );

  useEffect(() => {
    if (profileData.userName.length >= 3 && checkUsername !== undefined) {
      setUsernameError(checkUsername.available ? '' : 'Username is already taken');
    }
  }, [checkUsername, profileData.userName]);

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      await createProfile(profileData);
    } catch (error) {
      console.error('Failed to create profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 0:
        return profileData.name.length >= 2 &&
          profileData.userName.length >= 3 &&
          !usernameError &&
          profileData.birthDate;
      case 1:
        return profileData.country &&
          profileData.spokenLanguages.length > 0;
      case 2:
        return profileData.aboutMe.length >= 10 &&
          profileData.hobbies.length > 0;
      case 3:
        return profileData.profilePicture;
      default:
        return false;
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <User className="w-16 h-16 text-blue-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">Basic Information</h2>
              <p className="text-gray-400">Tell us about yourself</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
              <input
                type="text"
                value={profileData.name}
                onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Username</label>
              <input
                type="text"
                value={profileData.userName}
                onChange={(e) => setProfileData({ ...profileData, userName: e.target.value.toLowerCase() })}
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                placeholder="Choose a unique username"
              />
              {usernameError && <p className="text-red-400 text-sm mt-1">{usernameError}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Gender</label>
              <div className="grid grid-cols-3 gap-3">
                {(['male', 'female', 'other'] as const).map(gender => (
                  <button
                    key={gender}
                    onClick={() => setProfileData({ ...profileData, gender })}
                    className={`p-3 rounded-lg border transition-colors ${profileData.gender === gender
                        ? 'bg-blue-600 border-blue-500 text-white'
                        : 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600'
                      }`}
                  >
                    {gender.charAt(0).toUpperCase() + gender.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Birth Date</label>
              <input
                type="date"
                value={profileData.birthDate}
                onChange={(e) => setProfileData({ ...profileData, birthDate: e.target.value })}
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <Globe className="w-16 h-16 text-blue-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">Location & Languages</h2>
              <p className="text-gray-400">Where are you from and what languages do you speak?</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Country</label>
              <select
                value={profileData.country}
                onChange={(e) => setProfileData({ ...profileData, country: e.target.value })}
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
              >
                <option value="">Select your country</option>
                {COUNTRIES.map(country => (
                  <option key={country} value={country}>{country}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Languages I Speak</label>
              <MultiSelect
                options={LANGUAGES}
                selected={profileData.spokenLanguages}
                onChange={(selected) => setProfileData({ ...profileData, spokenLanguages: selected })}
                placeholder="Select languages you speak"
                maxSelections={5}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Languages I'm Learning</label>
              <MultiSelect
                options={LANGUAGES}
                selected={profileData.learningLanguages}
                onChange={(selected) => setProfileData({ ...profileData, learningLanguages: selected })}
                placeholder="Select languages you're learning"
                maxSelections={3}
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <MessageSquare className="w-16 h-16 text-blue-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">About You</h2>
              <p className="text-gray-400">Share your interests and tell us about yourself</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">About Me</label>
              <textarea
                value={profileData.aboutMe}
                onChange={(e) => setProfileData({ ...profileData, aboutMe: e.target.value })}
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 resize-none"
                rows={4}
                placeholder="Tell us about yourself, your interests, what you're looking for..."
              />
              <p className="text-sm text-gray-400 mt-1">{profileData.aboutMe.length}/500</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Hobbies & Interests</label>
              <MultiSelect
                options={HOBBIES}
                selected={profileData.hobbies}
                onChange={(selected) => setProfileData({ ...profileData, hobbies: selected })}
                placeholder="Select your hobbies and interests"
                maxSelections={10}
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
              <div>
                <h3 className="text-white font-medium">Gender Preference</h3>
                <p className="text-gray-400 text-sm">Show my gender in discovery</p>
              </div>
              <button
                onClick={() => setProfileData({ ...profileData, genderPreference: !profileData.genderPreference })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${profileData.genderPreference ? 'bg-blue-600' : 'bg-gray-600'
                  }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${profileData.genderPreference ? 'translate-x-6' : 'translate-x-1'
                    }`}
                />
              </button>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <Camera className="w-16 h-16 text-blue-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">Profile Photo</h2>
              <p className="text-gray-400">Add a photo to complete your profile</p>
            </div>

            <div className="text-center">
              <div className="w-32 h-32 bg-gray-700 rounded-full mx-auto mb-4 flex items-center justify-center">
                {profileData.profilePicture ? (
                  <img src={profileData.profilePicture} alt="Profile" className="w-full h-full rounded-full object-cover" />
                ) : (
                  <Camera className="w-12 h-12 text-gray-400" />
                )}
              </div>
              <button
                onClick={() => setProfileData({ ...profileData, profilePicture: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face' })}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
              >
                Upload Photo
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-2xl p-8 w-full max-w-2xl">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            {STEPS.map((step, index) => (
              <div key={step} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${index <= currentStep ? 'bg-blue-600 text-white' : 'bg-gray-600 text-gray-400'
                  }`}>
                  {index + 1}
                </div>
                {index < STEPS.length - 1 && (
                  <div className={`w-16 h-1 mx-2 ${index < currentStep ? 'bg-blue-600' : 'bg-gray-600'
                    }`} />
                )}
              </div>
            ))}
          </div>
          <p className="text-center text-gray-400">{STEPS[currentStep]}</p>
        </div>

        {/* Step Content */}
        {renderStep()}

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <button
            onClick={handleBack}
            disabled={currentStep === 0}
            className="flex items-center gap-2 px-6 py-3 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:text-gray-500 text-white rounded-lg transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>

          {currentStep === STEPS.length - 1 ? (
            <button
              onClick={handleSubmit}
              disabled={!isStepValid() || isLoading}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded-lg transition-colors"
            >
              {isLoading ? 'Creating...' : 'Complete Profile'}
              <Heart className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleNext}
              disabled={!isStepValid()}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded-lg transition-colors"
            >
              Next
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}