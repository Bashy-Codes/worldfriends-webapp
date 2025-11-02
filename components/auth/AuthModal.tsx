'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import SignInForm from './SignInForm';
import SignUpForm from './SignUpForm';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [isSignUp, setIsSignUp] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-2xl p-8 w-full max-w-md mx-4 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-lg">WF</span>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">
            {isSignUp ? 'Join WorldFriends' : 'Welcome Back'}
          </h2>
          <p className="text-gray-400">
            {isSignUp 
              ? 'Create your account to connect with friends worldwide' 
              : 'Sign in to your account to continue'
            }
          </p>
        </div>

        {isSignUp ? <SignUpForm /> : <SignInForm />}

        <div className="mt-6 text-center">
          <p className="text-gray-400">
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-blue-400 hover:text-blue-300 font-medium"
            >
              {isSignUp ? 'Sign In' : 'Sign Up'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}