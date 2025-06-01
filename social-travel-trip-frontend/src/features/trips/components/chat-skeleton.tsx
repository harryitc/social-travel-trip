import React from 'react';
import { motion } from 'framer-motion';

const shimmerVariants = {
  animate: {
    x: ['-100%', '100%'],
    transition: {
      repeat: Infinity,
      duration: 1.5,
      ease: 'linear'
    }
  }
};

const skeletonVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.3 }
  }
};

export function ChatSkeleton() {
  return (
    <motion.div
      className="flex flex-col h-full"
      variants={skeletonVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header skeleton */}
      <motion.div
        className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700"
        variants={itemVariants}
      >
        <div className="flex items-center space-x-3">
          <motion.div
            className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full relative overflow-hidden"
            variants={itemVariants}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              variants={shimmerVariants}
              animate="animate"
            />
          </motion.div>
          <div className="space-y-2">
            <motion.div
              className="w-32 h-4 bg-gray-200 dark:bg-gray-700 rounded relative overflow-hidden"
              variants={itemVariants}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                variants={shimmerVariants}
                animate="animate"
              />
            </motion.div>
            <motion.div
              className="w-20 h-3 bg-gray-200 dark:bg-gray-700 rounded relative overflow-hidden"
              variants={itemVariants}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                variants={shimmerVariants}
                animate="animate"
              />
            </motion.div>
          </div>
        </div>
        <motion.div
          className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded relative overflow-hidden"
          variants={itemVariants}
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            variants={shimmerVariants}
            animate="animate"
          />
        </motion.div>
      </motion.div>

      {/* Messages skeleton */}
      <motion.div
        className="flex-1 overflow-y-auto p-4 space-y-4"
        variants={itemVariants}
      >
        {/* Message 1 - Other user */}
        <motion.div
          className="flex items-start space-x-3"
          variants={itemVariants}
        >
          <motion.div
            className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full flex-shrink-0 relative overflow-hidden"
            variants={itemVariants}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              variants={shimmerVariants}
              animate="animate"
            />
          </motion.div>
          <div className="flex-1 space-y-2">
            <motion.div
              className="w-24 h-3 bg-gray-200 dark:bg-gray-700 rounded relative overflow-hidden"
              variants={itemVariants}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                variants={shimmerVariants}
                animate="animate"
              />
            </motion.div>
            <motion.div
              className="w-64 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg relative overflow-hidden"
              variants={itemVariants}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                variants={shimmerVariants}
                animate="animate"
              />
            </motion.div>
          </div>
        </motion.div>

        {/* Message 2 - Current user */}
        <motion.div
          className="flex items-start space-x-3 justify-end"
          variants={itemVariants}
        >
          <div className="flex-1 space-y-2 flex flex-col items-end">
            <motion.div
              className="w-48 h-10 bg-blue-200 dark:bg-blue-800 rounded-lg relative overflow-hidden"
              variants={itemVariants}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                variants={shimmerVariants}
                animate="animate"
              />
            </motion.div>
          </div>
        </motion.div>

        {/* Message 3 - Other user */}
        <motion.div
          className="flex items-start space-x-3"
          variants={itemVariants}
        >
          <motion.div
            className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full flex-shrink-0 relative overflow-hidden"
            variants={itemVariants}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              variants={shimmerVariants}
              animate="animate"
            />
          </motion.div>
          <div className="flex-1 space-y-2">
            <motion.div
              className="w-20 h-3 bg-gray-200 dark:bg-gray-700 rounded relative overflow-hidden"
              variants={itemVariants}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                variants={shimmerVariants}
                animate="animate"
              />
            </motion.div>
            <motion.div
              className="w-80 h-16 bg-gray-200 dark:bg-gray-700 rounded-lg relative overflow-hidden"
              variants={itemVariants}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                variants={shimmerVariants}
                animate="animate"
              />
            </motion.div>
          </div>
        </motion.div>

        {/* Message 4 - Current user */}
        <motion.div
          className="flex items-start space-x-3 justify-end"
          variants={itemVariants}
        >
          <div className="flex-1 space-y-2 flex flex-col items-end">
            <motion.div
              className="w-32 h-8 bg-blue-200 dark:bg-blue-800 rounded-lg relative overflow-hidden"
              variants={itemVariants}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                variants={shimmerVariants}
                animate="animate"
              />
            </motion.div>
          </div>
        </motion.div>

        {/* Message 5 - Other user with image */}
        <motion.div
          className="flex items-start space-x-3"
          variants={itemVariants}
        >
          <motion.div
            className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full flex-shrink-0 relative overflow-hidden"
            variants={itemVariants}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              variants={shimmerVariants}
              animate="animate"
            />
          </motion.div>
          <div className="flex-1 space-y-2">
            <motion.div
              className="w-28 h-3 bg-gray-200 dark:bg-gray-700 rounded relative overflow-hidden"
              variants={itemVariants}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                variants={shimmerVariants}
                animate="animate"
              />
            </motion.div>
            <motion.div
              className="w-40 h-32 bg-gray-200 dark:bg-gray-700 rounded-lg relative overflow-hidden"
              variants={itemVariants}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                variants={shimmerVariants}
                animate="animate"
              />
            </motion.div>
          </div>
        </motion.div>

        {/* Message 6 - Current user */}
        <motion.div
          className="flex items-start space-x-3 justify-end"
          variants={itemVariants}
        >
          <div className="flex-1 space-y-2 flex flex-col items-end">
            <motion.div
              className="w-56 h-12 bg-blue-200 dark:bg-blue-800 rounded-lg relative overflow-hidden"
              variants={itemVariants}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                variants={shimmerVariants}
                animate="animate"
              />
            </motion.div>
          </div>
        </motion.div>
      </motion.div>

      {/* Input skeleton */}
      <motion.div
        className="p-4 border-t border-gray-200 dark:border-gray-700"
        variants={itemVariants}
      >
        <div className="flex items-center space-x-3">
          <motion.div
            className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded relative overflow-hidden"
            variants={itemVariants}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              variants={shimmerVariants}
              animate="animate"
            />
          </motion.div>
          <motion.div
            className="flex-1 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg relative overflow-hidden"
            variants={itemVariants}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              variants={shimmerVariants}
              animate="animate"
            />
          </motion.div>
          <motion.div
            className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded relative overflow-hidden"
            variants={itemVariants}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              variants={shimmerVariants}
              animate="animate"
            />
          </motion.div>
          <motion.div
            className="w-8 h-8 bg-blue-200 dark:bg-blue-800 rounded relative overflow-hidden"
            variants={itemVariants}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              variants={shimmerVariants}
              animate="animate"
            />
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export function GroupListSkeleton() {
  return (
    <div className="flex flex-col h-full">
      {/* Header skeleton */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <div className="w-24 h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          <div className="flex space-x-2">
            <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          </div>
        </div>
        <div className="w-full h-10 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
      </div>

      {/* Group list skeleton */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="flex items-center space-x-3 p-3 rounded-lg">
            <div className="w-11 h-11 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse flex-shrink-0"></div>
            <div className="flex-1 space-y-2">
              <div className="flex items-center justify-between">
                <div className="w-32 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                <div className="w-12 h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              </div>
              <div className="w-48 h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                <div className="w-20 h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                <div className="w-16 h-4 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function GroupDetailsSkeleton() {
  return (
    <div className="flex flex-col h-full p-4 space-y-6">
      {/* Group info skeleton */}
      <div className="space-y-4">
        <div className="w-full h-32 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
        <div className="space-y-2">
          <div className="w-48 h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          <div className="w-full h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          <div className="w-3/4 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
        </div>
      </div>

      {/* Members skeleton */}
      <div className="space-y-3">
        <div className="w-20 h-5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
            <div className="flex-1 space-y-1">
              <div className="w-24 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              <div className="w-16 h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            </div>
          </div>
        ))}
      </div>

      {/* Actions skeleton */}
      <div className="space-y-3">
        <div className="w-full h-10 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
        <div className="w-full h-10 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
      </div>
    </div>
  );
}
