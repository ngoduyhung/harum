import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Loader2 } from "lucide-react";
import { getAllTopic, getUserProfileApi, updateUserTopicsApi } from "../ProfileEditService";

const TopicsSkeleton = () => (
  <div className="bg-white rounded-lg shadow-xl p-8 animate-pulse">
    <div className="h-8 bg-gray-200 rounded-md w-1/3 mb-10"></div>
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {Array.from({ length: 15 }).map((_, i) => (
        <div key={i} className="h-12 bg-gray-200 rounded-lg"></div>
      ))}
    </div>
    <div className="flex justify-end gap-4 mt-8">
      <div className="h-11 w-24 bg-gray-200 rounded-md"></div>
      <div className="h-11 w-32 bg-gray-300 rounded-md"></div>
    </div>
  </div>
);

const UserTopics = () => {
  const nav = useNavigate();
  const userId = localStorage.getItem("user_id");

  const MIN_TOPICS_REQUIRED = 3;

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [allTopics, setAllTopics] = useState([]);
  const [selectedTopicIds, setSelectedTopicIds] = useState(new Set());
  const [initialSelectedTopicIds, setInitialSelectedTopicIds] = useState(
    new Set()
  );

  useEffect(() => {
    if (!userId) {
      toast.error("Vui lòng đăng nhập để thực hiện chức năng này.");
      nav("/login");
      return;
    }

    const fetchData = async () => {
      try {
        const [topicsResponse, userProfileResponse] = await Promise.all([
          getAllTopic(),
          getUserProfileApi(userId),
        ]);

        setAllTopics(topicsResponse || []);

        const userTopicIdSet = new Set(
          (userProfileResponse?.favoriteTopics || []).map((topic) => topic.id)
        );
        setSelectedTopicIds(userTopicIdSet);
        setInitialSelectedTopicIds(userTopicIdSet);

      } catch (error) {
        console.error("Lỗi khi tải dữ liệu topics:", error);
        toast.error("Không thể tải danh sách sở thích. Vui lòng thử lại.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [userId, nav]);


  const handleTopicClick = (topicId) => {
    setSelectedTopicIds((prevSelectedIds) => {
      const newSelectedIds = new Set(prevSelectedIds);
      if (newSelectedIds.has(topicId)) {
        newSelectedIds.delete(topicId);
      } else {
        newSelectedIds.add(topicId);
      }
      return newSelectedIds;
    });
  };


  const handleSave = async () => {

    if (selectedTopicIds.size < MIN_TOPICS_REQUIRED) {
      toast.warn(`Bạn phải chọn ít nhất ${MIN_TOPICS_REQUIRED} chủ đề.`);
      return;
    }

    setIsSaving(true);
    try {
      const topicIdsArray = Array.from(selectedTopicIds);
      const fullTopicsPayload = topicIdsArray.map(id => {
        const fullTopic = allTopics.find(topic => topic.id === id);
        return { id: fullTopic.id, name: fullTopic.name };
      }).filter(Boolean); 

     const updatedUserObject = await updateUserTopicsApi(userId, fullTopicsPayload);

      const updatedFavoriteTopics = updatedUserObject?.favoriteTopics || [];

      const newTopicIdSet = new Set(updatedFavoriteTopics.map(topic => topic.id));

      setSelectedTopicIds(newTopicIdSet);
      setInitialSelectedTopicIds(newTopicIdSet);
      
      toast.success("Cập nhật sở thích thành công!");

    } catch (error) {
      console.error("Lỗi khi cập nhật topics:", error);
      toast.error("Có lỗi xảy ra, không thể lưu thay đổi.");
    } finally {
      setIsSaving(false);
    }
  };

  const hasChanges = useMemo(() => {
    if (initialSelectedTopicIds.size !== selectedTopicIds.size) return true;
    for (const id of initialSelectedTopicIds) {
      if (!selectedTopicIds.has(id)) return true;
    }
    for (const id of selectedTopicIds) {
      if (!initialSelectedTopicIds.has(id)) return true;
    }
    return false;
  }, [initialSelectedTopicIds, selectedTopicIds]);

  const topicsNeeded = useMemo(() => {
    const needed = MIN_TOPICS_REQUIRED - selectedTopicIds.size;
    return needed > 0 ? needed : 0;
  }, [selectedTopicIds]);

  if (isLoading) {
    return <TopicsSkeleton />;
  }

  return (
    <div className="w-full mx-auto bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Chỉnh sửa sở thích
      </h2>
      <p className="text-gray-600 mb-2">
        Chọn các chủ đề bạn quan tâm để chúng tôi có thể gợi ý những nội dung
        phù hợp nhất với bạn.
      </p>
      <p className="text-sm text-pblue mb-6">
        (Vui lòng chọn ít nhất {MIN_TOPICS_REQUIRED} chủ đề)
      </p>
      {hasChanges && topicsNeeded > 0 && (
        <p className="text-red-500 text-sm mb-4 font-semibold animate-pulse">
          Bạn cần chọn thêm {topicsNeeded} chủ đề nữa.
        </p>
      )}


      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {allTopics.map((topic) => {
          const isSelected = selectedTopicIds.has(topic.id);
          return (
            <button
              key={topic.id}
              onClick={() => handleTopicClick(topic.id)}
              className={`px-4 py-3 text-center font-semibold rounded-lg border-2 transition-all duration-200 ${
                isSelected
                  ? "bg-pblue text-white border-pblue"
                  : "bg-gray-100 text-gray-700 border-gray-200 hover:border-sblue hover:text-sblue"
                }`}
            >
              {topic.name}
            </button>
          );
        })}
      </div>

      <div className="flex justify-end gap-4 mt-10">
        <button
          className="px-6 py-2.5 font-semibold cursor-pointer text-gray-700 bg-gray-200 hover:bg-gray-300 transition-colors duration-200 rounded-lg"
          onClick={() => nav(-1)}
          disabled={isSaving}
        >
          Hủy
        </button>
        <button
          className="px-6 py-2.5 font-semibold cursor-pointer text-white bg-pblue hover:bg-sblue transition-colors duration-200 rounded-lg flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
          onClick={handleSave}

          disabled={isSaving || !hasChanges || selectedTopicIds.size < MIN_TOPICS_REQUIRED}
        >
          {isSaving ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Đang lưu...
            </>
          ) : (
            "Lưu thay đổi"
          )}
        </button>
      </div>
    </div>
  );
};

export default UserTopics;