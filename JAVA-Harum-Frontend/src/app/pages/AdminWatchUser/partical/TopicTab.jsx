// File: TopicsTab.js
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getUserProfileApi } from '../AdminWatchUserService';
import { Tag, Loader2 } from 'lucide-react';

const TopicsTabSkeleton = () => (
  <div className="col-span-full animate-pulse">
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {Array.from({ length: 10 }).map((_, i) => (
        <div key={i} className="h-10 bg-gray-200 rounded-lg"></div>
      ))}
    </div>
  </div>
);

const TopicsTab = ({ userId }) => {
  const {
    data: userProfile,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['userProfile', userId], 
    queryFn: () => getUserProfileApi(userId),
    enabled: !!userId, 
  });

  if (isLoading) {
    return <TopicsTabSkeleton />;
  }

  if (error) {
    return (
      <p className="text-red-500 text-center col-span-full">
        Không thể tải danh sách sở thích.
      </p>
    );
  }

  const favoriteTopics = userProfile?.favoriteTopics || [];

  if (favoriteTopics.length === 0) {
    return (
      <p className="text-gray-500 text-center col-span-full">
        Người dùng này chưa chọn sở thích nào.
      </p>
    );
  }

  return (
    <>
      {favoriteTopics.map((topic) => (
        <div
          key={topic.id}
          className="col-span-1 flex items-center gap-2 px-4 py-2 bg-bgblue text-pblue font-semibold rounded-lg border border-blue-200"
        >
          <Tag size={18} />
          <span>{topic.name}</span>
        </div>
      ))}
    </>
  );
};

export default TopicsTab;