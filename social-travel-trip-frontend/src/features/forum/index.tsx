'use client';

import { useState, useEffect } from 'react';
import { PostList } from './components/post-list';
import { PageHeader } from '@/components/ui/page-header';
import { motion } from 'framer-motion';

export function ForumPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [animationComplete, setAnimationComplete] = useState(false);

  useEffect(() => {
    // Set animation complete after initial render
    const timer = setTimeout(() => setAnimationComplete(true), 600);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <PageHeader
          title="Diễn đàn"
          description="Khám phá và chia sẻ trải nghiệm du lịch của bạn"
        />
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <motion.div
          className="md:col-span-2"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <PostList searchQuery={searchQuery} />
        </motion.div>
      </div>
    </>
  );
}