import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import ProfileEdit from "./partials/ProfileEdit";
import ChangePassword from "./partials/ChangePassword";
import UserTopics from "./partials/UserTopics";
const ProfileSetting = () => {
  const navigate = useNavigate();
  const location = useLocation();
 let activeTab = "profile";
  if (location.pathname.includes("password")) {
    activeTab = "password";
  } else if (location.pathname.includes("topics")) {
    activeTab = "topics";
  }

  return (
    <div className="max-w-6xl mx-auto p-6 flex">
      {/* Sidebar Tabs */}
      <div className="w-1/4 pr-4">
        <button
          className={`block w-full text-left py-2 px-4 mb-2 border-l-4 cursor-pointer ${
            activeTab === "profile"
              ? "border-pblue  text-pblue font-bold"
              : "border-transparent text-gray-600"
          }`}
          onClick={() => navigate("/profileedit")}
        >
          Thông tin cơ bản
        </button>
        <button
          className={`block w-full text-left py-2 px-4 border-l-4 cursor-pointer ${
            activeTab === "password"
              ? "border-pblue text-pblue font-bold"
              : "border-transparent text-gray-600"
          }`}
          onClick={() => navigate("/changepassword")}
        >
          Đổi mật khẩu
        </button>
        <button
          className={`block w-full text-left py-2 px-4 border-l-4 cursor-pointer ${
            activeTab === "topics"
              ? "border-pblue text-pblue font-bold bg-blue-50"
              : "border-transparent text-gray-600 hover:bg-gray-100"
          }`}
          onClick={() => navigate("/changetopics")} 
        >
          Sở thích
        </button>
      </div>
      

     <div className="w-full md:w-3/4 md:pl-6 flex-grow">
        {activeTab === "profile" && <ProfileEdit />}
        {activeTab === "password" && <ChangePassword />}
        {activeTab === "topics" && <UserTopics />}
      </div>
    </div>
  );
};

export default ProfileSetting;
