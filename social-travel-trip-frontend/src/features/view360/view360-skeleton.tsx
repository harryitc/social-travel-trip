'use client';

import React from 'react';

interface View360SkeletonProps {
  className?: string;
}

export const View360Skeleton: React.FC<View360SkeletonProps> = ({ className = '' }) => {
  return (
    <div className={`space-y-6 ${className}`}>
      {/* Search Section Skeleton */}
      <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl shadow-lg border border-purple-200/50 dark:border-purple-700/50 overflow-hidden">
        <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 dark:from-purple-400/10 dark:to-blue-400/10 p-1">
          <div className="bg-white dark:bg-gray-900 rounded-xl p-4 sm:p-6">
            {/* Header Skeleton */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-200 to-blue-200 dark:from-purple-700 dark:to-blue-700 rounded-lg animate-pulse"></div>
              <div className="space-y-2">
                <div className="h-5 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                <div className="h-4 w-64 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              </div>
            </div>

            {/* Region Filters Skeleton */}
            <div className="space-y-3 mb-4">
              <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              <div className="flex flex-wrap gap-2">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"
                    style={{ animationDelay: `${i * 100}ms` }}
                  ></div>
                ))}
              </div>
            </div>

            {/* Search Input Skeleton */}
            <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Location Details Skeleton */}
      <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-2xl shadow-lg border border-purple-200/50 dark:border-purple-700/50 overflow-hidden">
        <div className="bg-gradient-to-r from-purple-500 to-blue-500 p-4 sm:p-6">
          <div className="flex items-center space-x-3 sm:space-x-4">
            <div className="w-12 h-12 bg-white/20 rounded-full animate-pulse"></div>
            <div className="flex-1 space-y-2">
              <div className="h-6 w-48 bg-white/20 rounded animate-pulse"></div>
              <div className="h-4 w-32 bg-white/20 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>

      {/* 360 View Container Skeleton */}
      <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-2xl shadow-xl border border-purple-200/50 dark:border-purple-700/50 overflow-hidden">
        <div className="relative">
          <div className="h-[400px] sm:h-[500px] md:h-[600px] lg:h-[700px] bg-gradient-to-br from-purple-100 via-white to-blue-100 dark:from-purple-900/50 dark:via-gray-800 dark:to-blue-900/50 flex items-center justify-center">
            <div className="text-center space-y-4">
              <div className="relative">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-200 border-t-purple-600 mx-auto"></div>
                <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-400 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
              </div>
              <div className="space-y-2">
                <div className="h-6 w-48 bg-purple-200 dark:bg-purple-700 rounded animate-pulse mx-auto"></div>
                <div className="h-4 w-36 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mx-auto"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default View360Skeleton;
