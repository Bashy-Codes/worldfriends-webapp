'use client';

import CreatePost from './CreatePost';
import PostCard from './PostCard';
import { mockPosts } from '@/data/mockPosts';

export default function Feed() {
  return (
    <div className="max-w-2xl mx-auto px-4 h-[calc(100vh-8rem)] overflow-y-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">
          Your Feed
        </h2>
        <p className="text-gray-400">
          Stay connected with your global community
        </p>
      </div>
      
      <CreatePost />
      
      <div className="space-y-4">
        {mockPosts.map((post) => (
          <PostCard key={post.postId} post={post} />
        ))}
      </div>
    </div>
  );
}