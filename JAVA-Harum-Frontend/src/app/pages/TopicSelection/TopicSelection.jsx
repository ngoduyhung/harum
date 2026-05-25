import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { toast } from 'react-toastify'; 
import { getTopics, updateUserTopicsApi } from './TopicSelectionService'; 

const TopicSelection = () => {
  const MIN_TOPICS_REQUIRED = 3;

  const [topics, setTopics] = useState([]);
  const [selectedTopics, setSelectedTopics] = useState(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  
  const nav = useNavigate(); 

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const data = await getTopics();
        setTopics(data); 
        setError(null);
      } catch (err) {
        setError("Không thể tải được danh sách chủ đề. Vui lòng thử lại sau.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTopics();
  }, []); 

  const handleTopicToggle = (topicId) => {
    setSelectedTopics(prev => {
      const newSelected = new Set(prev);
      if (newSelected.has(topicId)) {
        newSelected.delete(topicId);
      } else {
        newSelected.add(topicId);
      }
      return newSelected;
    });
  };

 const handleSavePreferences = async () => {
    if (selectedTopics.size < MIN_TOPICS_REQUIRED) {
      toast.warn(`Vui lòng chọn ít nhất ${MIN_TOPICS_REQUIRED} chủ đề`);
      return;
    }
    
    const userId = localStorage.getItem('user_id');
    if (!userId) {
      toast.error("Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại.");
      return;
    }

    setIsSubmitting(true);
    
    try {

      const selectedIds = Array.from(selectedTopics);
      
      const fullTopicsPayload = selectedIds.map(id => {
        const fullTopic = topics.find(topic => topic.id === id);

        return fullTopic ? { id: fullTopic.id, name: fullTopic.name } : null;
      }).filter(Boolean); 

      await updateUserTopicsApi(userId, fullTopicsPayload);
      
      toast.success("Đã lưu sở thích của bạn thành công!");
      nav('/');

    } catch (err) {
      toast.error("Đã có lỗi xảy ra khi lưu sở thích. Vui lòng thử lại.");
      console.error("Failed to save user topics:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const topicsRemaining = MIN_TOPICS_REQUIRED - selectedTopics.size;

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gray-50">
        <div className="w-12 h-12 border-4 border-pblue border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-lg text-text">Đang tải các chủ đề...</p>
      </div>
    );
  }

  if (error) {
    return (
       <div className="flex flex-col justify-center items-center h-screen bg-gray-50">
         <p className="mt-4 text-lg text-red-500">{error}</p>
       </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-6 sm:p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-text mb-2">
            Hãy chọn những chủ đề bạn quan tâm để chúng tôi cá nhân hóa trải nghiệm.
          </h1>
          <p className="text-base sm:text-lg text-gray-600">
            Vui lòng chọn ít nhất <span className="font-bold text-pblue">{MIN_TOPICS_REQUIRED}</span> chủ đề bạn quan tâm
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mb-8">
          {topics.map((topic) => {
            const isSelected = selectedTopics.has(topic.id);
            return (
              <div
                key={topic.id}
                onClick={() => handleTopicToggle(topic.id)}
                className={`
                  relative p-3 text-center rounded-full border-2 cursor-pointer
                  font-medium transition-all duration-200 ease-in-out select-none
                  hover:scale-105 hover:shadow-md
                  min-h-[80px] flex items-center justify-center
                  text-sm sm:text-base
                  ${
                    isSelected
                      ? 'bg-pblue border-pblue text-white'
                      : 'bg-white border-gray-300 text-text hover:border-pblue'
                  }
                `}
                style={{ minWidth: '120px' }}
              >
                <span className="px-2 break-words">
                  {topic.name}
                </span>
              </div>
            );
          })}
        </div>

        <div className="flex flex-col items-center gap-2 mt-auto">
          {selectedTopics.size > 0 && topicsRemaining > 0 && (
            <p className="text-pblue font-medium text-sm transition-opacity duration-300">
              Vui lòng chọn thêm {topicsRemaining} chủ đề nữa
            </p>
          )}
          
          <button
            onClick={handleSavePreferences}
            disabled={selectedTopics.size < MIN_TOPICS_REQUIRED || isSubmitting}
            className="w-full sm:w-auto mt-2 px-12 py-3 text-lg font-bold text-white rounded-full transition-all duration-300
                       bg-pblue hover:bg-pblue focus:outline-none focus:ring-4 focus:ring-blue-300
                       disabled:bg-gray-400 disabled:cursor-not-allowed disabled:hover:bg-gray-400 disabled:scale-100"
          >
            {isSubmitting ? 'Đang lưu...' : 'Tiếp tục'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TopicSelection;