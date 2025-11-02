'use client';

import { Image, Smile } from 'lucide-react';
import { useState } from 'react';

export default function CreatePost() {
  const [postText, setPostText] = useState('');

  return (
    <div className="bg-gray-800 rounded-xl border border-gray-700 p-6 mb-4">
      <div className="flex items-start space-x-3">
        <img
          src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"
          alt="Your profile"
          className="w-10 h-10 rounded-full"
        />
        
        <div className="flex-1">
          <textarea
            value={postText}
            onChange={(e) => setPostText(e.target.value)}
            placeholder="What's on your mind?"
            className="w-full bg-gray-700 text-white placeholder-gray-400 rounded-lg p-3 resize-none border-none outline-none"
            rows={3}
          />
          
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center space-x-4">
              <button className="flex items-center space-x-2 text-gray-400 hover:text-blue-400 transition-colors">
                <Image className="w-5 h-5" />
                <span className="text-sm">Photo</span>
              </button>
              
              <button className="flex items-center space-x-2 text-gray-400 hover:text-yellow-400 transition-colors">
                <Smile className="w-5 h-5" />
                <span className="text-sm">Feeling</span>
              </button>
            </div>
            
            <button 
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
              disabled={!postText.trim()}
            >
              Post
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}