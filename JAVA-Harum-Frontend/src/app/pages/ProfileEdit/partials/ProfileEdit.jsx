import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Camera, Loader2 } from "lucide-react"; // Import icons
import { getUserProfileApi, updateUserProfileApi } from "../ProfileEditService";
import { toast } from "react-toastify";

// Component con cho giao diện Skeleton Loading
const ProfileEditSkeleton = () => (
  <div className="bg-white rounded-lg shadow-xl p-8 animate-pulse">
    <div className="h-10 bg-gray-200 rounded-md w-1/3 mb-10"></div>
    <div className="flex flex-col md:flex-row gap-12">
      {/* Skeleton for Avatar */}
      <div className="flex flex-col items-center gap-4 w-full md:w-1/4">
        <div className="w-36 h-36 bg-gray-300 rounded-full"></div>
        <div className="h-8 bg-gray-200 rounded-md w-28"></div>
      </div>
      {/* Skeleton for Form */}
      <div className="flex-1 space-y-6">
        <div className="space-y-2">
          <div className="h-5 bg-gray-200 rounded-md w-20"></div>
          <div className="h-24 bg-gray-200 rounded-md"></div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <div className="h-5 bg-gray-200 rounded-md w-24"></div>
            <div className="h-11 bg-gray-200 rounded-md"></div>
          </div>
          <div className="space-y-2">
            <div className="h-5 bg-gray-200 rounded-md w-16"></div>
            <div className="h-11 bg-gray-200 rounded-md"></div>
          </div>
        </div>
        <div className="flex justify-end gap-4 mt-8">
          <div className="h-11 w-24 bg-gray-200 rounded-md"></div>
          <div className="h-11 w-24 bg-gray-300 rounded-md"></div>
        </div>
      </div>
    </div>
  </div>
);

const ProfileEdit = () => {
  const nav = useNavigate();
  const id = localStorage.getItem("user_id");
  const avatarInputRef = useRef(null);

  // ✅ State để quản lý trạng thái tải
  const [isFetching, setIsFetching] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // State cho dữ liệu form
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const [bio, setBio] = useState("");
  const [username, setUsername] = useState(""); // Đổi tên cho nhất quán
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (!id) {
      setIsFetching(false);
      // Có thể chuyển hướng người dùng nếu không có ID
      // nav('/login');
      return;
    }

    setIsFetching(true);
    getUserProfileApi(id)
      .then((data) => {
        setAvatarPreview(data.avatarUrl || null);
        setBio(data.bio || "");
        setUsername(data.username || "");
        setEmail(data.email || "");
      })
      .catch((error) => {
        console.error("Failed to fetch profile:", error);
        // Có thể hiển thị một thông báo lỗi ở đây
      })
      .finally(() => {
        setIsFetching(false);
      });
  }, [id]);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setAvatarPreview(URL.createObjectURL(file));
      setAvatarFile(file);
    }
  };

  const handleSave = async () => {
    if (isSaving) return;
    setIsSaving(true);
    try {
      const formData = new FormData();
      const userData = { username, email, bio };

      formData.append(
        "user",
        new Blob([JSON.stringify(userData)], { type: "application/json" })
      );

      if (avatarFile) {
        formData.append("avatar", avatarFile);
      }

      const res = await updateUserProfileApi(id, formData);
      if (res?.status === 200) {
        if (res?.data?.avatarUrl) {
          localStorage.setItem("avatarUrl", res.data.avatarUrl);
        }
      }
      nav(`/profile/${id}`);
    } catch (error) {
      if (error?.status === 413) {
        toast.warn("Dung lượng ảnh quá lớn, vui lòng chọn ảnh khác!");
        return;
      }
      toast.warn("Có lỗi xảy ra khi cập nhật!");
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  if (isFetching) {
    return <ProfileEditSkeleton />;
  }

  return (
    <div className="bg-white rounded-lg shadow-xl p-8">
      <div className="flex flex-col md:flex-row gap-12">
        {/* Phần ảnh đại diện */}
        <div className="flex flex-col items-center gap-4 w-full md:w-1/4">
          <div
            className="relative group cursor-pointer"
            onClick={() => avatarInputRef.current.click()}
          >
            <img
              src={avatarPreview || "/defaultAvatar.jpg"} // Cập nhật đường dẫn nếu cần
              alt="Avatar Preview"
              className="w-36 h-36 object-cover rounded-full border-4 border-gray-100 shadow-md transition-transform transform group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/30 group-hover:bg-opacity-40 rounded-full flex items-center justify-center transition-opacity duration-300">
              <Camera className="w-8 h-8 text-white opacity-0 group-hover:opacity-100" />
            </div>
          </div>
          <div className="text-sm font-semibold ">Ảnh đại diện</div>
          <input
            type="file"
            className="hidden"
            accept="image/*"
            ref={avatarInputRef}
            onChange={handleAvatarChange}
          />
        </div>

        {/* Phần thông tin */}
        <div className="flex-1">
          <div className="space-y-6">
            <div>
              <label
                htmlFor="bio"
                className="block text-sm font-semibold text-gray-600 mb-1"
              >
                Tiểu sử
              </label>
              <textarea
                id="bio"
                spellCheck="false"
                className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pblue focus:border-pblue transition-shadow duration-200"
                rows="4"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Giới thiệu một chút về bạn..."
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-semibold text-gray-600 mb-1"
                >
                  Tên hiển thị
                </label>
                <input
                  spellCheck="false"
                  id="username"
                  type="text"
                  className="w-full p-3 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pblue focus:border-pblue transition-shadow duration-200"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-semibold text-gray-600 mb-1"
                >
                  Email
                </label>
                <input
                  spellCheck="false"
                  id="email"
                  disabled
                  type="email"
                  className="w-full p-3 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pblue focus:border-pblue transition-shadow duration-200"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4 mt-8">
            <button
              className="px-6 py-2.5 font-semibold  cursor-pointer text-gray-700 bg-gray-200 hover:bg-gray-300 transition-colors duration-200 rounded-lg"
              onClick={() => nav(-1)}
              disabled={isSaving}
            >
              Hủy
            </button>
            <button
              className="px-6 py-2.5 font-semibold cursor-pointer text-white bg-pblue hover:bg-sblue transition-colors duration-200 rounded-lg flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
              onClick={handleSave}
              disabled={isSaving}
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
      </div>
    </div>
  );
};

export default ProfileEdit;
