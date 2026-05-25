import React from "react";
import TabSection from "./partials/TabSection";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getTopicDetails } from "./topicService";
import LoadingSpinner from "../../components/LoadingSpinner";

export default function Topic() {
  const { id: topicIdFromParams } = useParams();
  console.log("id này:", topicIdFromParams);

  const {
    data: topic,
    isLoading: isLoadingTopic,
    isError: isErrorTopic,
    error: errorTopic,
  } = useQuery({
    queryKey: ["topic", topicIdFromParams],
    queryFn: async () => {
      const fetchedTopic = await getTopicDetails(topicIdFromParams);
      console.log("[Topic.js] useQuery: Fetched topic data:", fetchedTopic);
      if (!fetchedTopic || typeof fetchedTopic.id === "undefined") {
        console.error(
          "[Topic.js] useQuery: Fetched topic data is missing 'id'.",
          fetchedTopic
        );
        throw new Error("Fetched topic data is invalid (missing id).");
      }
      return fetchedTopic;
    },
    enabled: !!topicIdFromParams,
    staleTime: 5 * 60 * 1000,
  });

  if (isErrorTopic) console.log("[Topic.js] Query error:", errorTopic?.message);
  console.log("[Topic.js] Current 'topic' data from useQuery:", topic);

  if (isLoadingTopic) {
    return (
      <div className="flex flex-col  items-center justify-center">
        <div className="w-full h-96 mb-6 bg-black/50 flex justify-center items-center text-white text-5xl font-semibold">
          {}
        </div>
        <LoadingSpinner />
        <p className="mt-2">Đang tải dữ liệu...</p>
      </div>
    );
  }
  const getImageName = (topicIdFromParams) => {
    switch (topicIdFromParams) {
      case "67f357e280e7a31c46a4e333":
        return "/src/app/assets/images/thethao.jpg";
      case "67f3584980e7a31c46a4e334":
        return "/src/app/assets/images/tamly.jpg";
      case "67f3585d80e7a31c46a4e335":
        return "/src/app/assets/images/giaoduc.png";
      case "67f3587d80e7a31c46a4e336":
        return "/src/app/assets/images/tranhluan.jpg";
      case "67f3589080e7a31c46a4e337":
        return "/src/app/assets/images/khoahoc.jpg";
      case "67f358a780e7a31c46a4e338":
        return "/src/app/assets/images/lichsu.jpg";
      case "67f3591980e7a31c46a4e339":
        return "/src/app/assets/images/nghethuat.jpg";
      case "67f3593780e7a31c46a4e33a":
        return "/src/app/assets/images/sach.jpg";
      case "67f3594480e7a31c46a4e33b":
        return "/src/app/assets/images/tinhyeu.jpg";
      case "67f3596980e7a31c46a4e33c":
        return "/src/app/assets/images/xahoi.png";
      default:
        return "/defaultImage.png"; // nếu không khớp thì trả về ảnh mặc định
    }
  };

  // Sử dụng trong component:
  const imageName = getImageName(topicIdFromParams);

  console.log(
    "[Topic.js] Render: Rendering page with valid topicId:",
    topic.id,
    "Topic Name:",
    topic.name
  );

  return (
    <div>
      <div className="relative">
        <div className="absolute inset-0 bg-black/50 flex justify-center items-center text-white text-5xl font-semibold">
          {topic.name?.toString().toUpperCase()}
        </div>
        <img
          src={imageName || "/src/app/assets/images/qđtl.png"}
          alt={topic.name || "Topic image"}
          className="w-full h-96 object-cover"
        />
      </div>
      <div className="mx-auto max-w-6xl mt-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-10 w-full mb-10">
          <div className="lg:col-span-8">
            <TabSection topicId={topic?.id} />
          </div>
          <div className="lg:col-span-4 mt-6 lg:mt-0 text-text">
            <div className="p-4 border border-gray-300 rounded-md h-fit">
              <div className="text-xl font-medium">
                {topic.name?.toString().toUpperCase()}
              </div>
              <div className="font-medium mb-1 mt-4">Nội dung</div>
              <div className="text-sm">{topic.des || "Không có mô tả."}</div>
              <div className="font-medium mb-1 mt-4">Quy định</div>
              <ul className="text-sm list-disc pl-5 space-y-1">
                <li>
                  Những nội dung không thuộc phạm trù của danh mục sẽ bị nhắc
                  nhở và xoá (nếu không thay đổi thích hợp)
                </li>
                <li>Nghiêm cấm spam, quảng cáo</li>
                <li>
                  Nghiêm cấm post nội dung 18+ hay những quan điểm cực đoan liên
                  quan tới chính trị - tôn giáo
                </li>
                <li>Nghiêm cấm phát ngôn thiếu văn hoá và đả kích cá nhân.</li>
                <li>Nghiêm cấm bài đăng không ghi rõ nguồn nếu đi cóp nhặt.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
