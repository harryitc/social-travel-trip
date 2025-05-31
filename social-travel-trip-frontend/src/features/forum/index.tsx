'use client';

import { useState, useEffect } from 'react';
import { PostList } from './components/post-list';
import { PostCreator } from './components/post-creator';
import { motion } from 'framer-motion';

export function ForumPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [animationComplete, setAnimationComplete] = useState(false);

  useEffect(() => {
    // Set animation complete after initial render
    const timer = setTimeout(() => setAnimationComplete(true), 600);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="space-y-6">
      <motion.div
        className="mb-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-2xl font-bold text-purple-800 dark:text-purple-300">Diễn đàn</h1>
        <p className="text-gray-600 dark:text-gray-400">Khám phá và chia sẻ trải nghiệm du lịch của bạn</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <PostCreator />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <PostList searchQuery={searchQuery} />
      </motion.div>
    </div>
  );
}