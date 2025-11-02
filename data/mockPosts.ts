import { PostTypes } from '@/types/feed';

export const mockPosts: PostTypes[] = [
  {
    postId: 'post1' as any,
    userId: 'user1' as any,
    content: 'Just had an amazing cultural exchange experience! Learning about different traditions and making new friends from around the world. 🌍✨',
    postImages: [
      'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&h=400&fit=crop'
    ],
    reactionsCount: 24,
    commentsCount: 8,
    hasReacted: true,
    userReaction: '❤️',
    isOwner: false,
    createdAt: Date.now() - 3600000,
    postAuthor: {
      userId: 'user1' as any,
      name: 'Sarah Johnson',
      profilePicture: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
      isPremiumUser: true,
    },
  },
  {
    postId: 'post2' as any,
    userId: 'user2' as any,
    content: 'Looking for language exchange partners! I speak Spanish natively and want to practice English. Anyone interested? 🗣️',
    reactionsCount: 15,
    commentsCount: 12,
    hasReacted: false,
    isOwner: false,
    createdAt: Date.now() - 7200000,
    postAuthor: {
      userId: 'user2' as any,
      name: 'Carlos Rodriguez',
      profilePicture: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
      isPremiumUser: false,
    },
  },
  {
    postId: 'post3' as any,
    userId: 'user3' as any,
    content: 'Sharing some photos from my recent trip to Japan! The culture, food, and people were absolutely incredible. Can\'t wait to go back! 🇯🇵',
    postImages: [
      'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1528164344705-47542687000d?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1480796927426-f609979314bd?w=400&h=400&fit=crop'
    ],
    reactionsCount: 42,
    commentsCount: 18,
    hasReacted: true,
    userReaction: '😍',
    isOwner: false,
    createdAt: Date.now() - 14400000,
    postAuthor: {
      userId: 'user3' as any,
      name: 'Emma Chen',
      profilePicture: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
      isPremiumUser: true,
    },
  },
  {
    postId: 'post4' as any,
    userId: 'user4' as any,
    content: 'Hosting a virtual cooking session this weekend! We\'ll be making traditional Italian pasta. Who wants to join? 🍝👨🍳',
    reactionsCount: 31,
    commentsCount: 22,
    hasReacted: false,
    isOwner: false,
    createdAt: Date.now() - 21600000,
    postAuthor: {
      userId: 'user4' as any,
      name: 'Marco Rossi',
      profilePicture: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
      isPremiumUser: false,
    },
  },
];