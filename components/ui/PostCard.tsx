'use client';

import { Heart, MessageCircle, Share, MoreHorizontal } from 'lucide-react';
import { PostTypes } from '@/types/feed';
import Image from 'next/image';

interface PostCardProps {
  post: PostTypes;
}

export default function PostCard({ post }: PostCardProps) {
  const formatTimeAgo = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (days > 0) return `${days}d`;
    if (hours > 0) return `${hours}h`;
    return `${minutes}m`;
  };

  return (
    <div className="bg-gray-800 rounded-xl border border-gray-700 p-6 mb-4">
      {/* Post Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Image
              src={post.postAuthor.profilePicture}
              alt={post.postAuthor.name}
              width={40}
              height={40}
              className="rounded-full"
            />
            {post.postAuthor.isPremiumUser && (
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full border-2 border-white dark:border-gray-800"></div>
            )}
          </div>
          <div>
            <h4 className="font-semibold text-white">
              {post.postAuthor.name}
            </h4>
            <p className="text-sm text-gray-400">
              {formatTimeAgo(post.createdAt)} ago
            </p>
          </div>
        </div>
        <button className="p-2 hover:bg-gray-700 rounded-lg">
          <MoreHorizontal className="w-5 h-5 text-gray-400" />
        </button>
      </div>

      {/* Post Content */}
      <div className="mb-4">
        <p className="text-white leading-relaxed">
          {post.content}
        </p>
      </div>

      {/* Post Images */}
      {post.postImages && post.postImages.length > 0 && (
        <div className="mb-4">
          <div className="grid grid-cols-2 gap-2 rounded-xl overflow-hidden">
            {post.postImages.slice(0, 4).map((image, index) => (
              <div key={index} className="relative aspect-square">
                <Image
                  src={image}
                  alt={`Post image ${index + 1}`}
                  fill
                  className="object-cover"
                />
                {index === 3 && post.postImages!.length > 4 && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <span className="text-white font-semibold">
                      +{post.postImages!.length - 4}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Post Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-700">
        <div className="flex items-center space-x-6">
          <button className={`flex items-center space-x-2 ${post.hasReacted ? 'text-red-500' : 'text-gray-500 hover:text-red-500'} transition-colors`}>
            <Heart className={`w-5 h-5 ${post.hasReacted ? 'fill-current' : ''}`} />
            <span className="text-sm font-medium">{post.reactionsCount}</span>
          </button>
          
          <button className="flex items-center space-x-2 text-gray-500 hover:text-blue-500 transition-colors">
            <MessageCircle className="w-5 h-5" />
            <span className="text-sm font-medium">{post.commentsCount}</span>
          </button>
          
          <button className="flex items-center space-x-2 text-gray-500 hover:text-green-500 transition-colors">
            <Share className="w-5 h-5" />
            <span className="text-sm font-medium">Share</span>
          </button>
        </div>
      </div>
    </div>
  );
}