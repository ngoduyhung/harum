/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef, useCallback } from "react";
import Editor from "./partials/Editor";
import { getTopics, getPostById, updatePostApi } from "./editPostService";
import { useParams, useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { ArrowLeft, Save, Loader2 } from "lucide-react";

const EditFormSkeleton = () => (
  <div className="bg-white shadow-xl rounded-lg p-6 sm:p-8 space-y-6 animate-pulse">
    <div>
      <div className="h-6 bg-gray-300 rounded w-1/4 mb-2"></div> {/* Label */}
      <div className="h-12 bg-gray-300 rounded-md"></div> {/* Input */}
    </div>
    <div>
      <div className="h-6 bg-gray-300 rounded w-1/4 mb-2"></div> {/* Label */}
      <div className="h-12 bg-gray-300 rounded-md"></div> {/* Select */}
    </div>
    <div>
      <div className="h-6 bg-gray-300 rounded w-1/4 mb-2"></div> {/* Label */}
      <div className="h-64 bg-gray-300 rounded-md"></div> {/* Editor Area */}
    </div>
    <div className="flex justify-end pt-4 border-t border-gray-200 mt-8">
      <div className="h-12 bg-gray-300 rounded-lg w-36"></div> {/* Button */}
    </div>
  </div>
);

export default function EditPost() {
  const { id: postId } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("");
  const [topics, setTopics] = useState([]);
  const [images, setImages] = useState([]);
  const [editorDataForLoad, setEditorDataForLoad] = useState(null);
  const editorDataRef = useRef(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const res = await getTopics();
        setTopics(res?.data || []);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách topics:", error);
        setTopics([]);
      }
    };
    fetchTopics();
  }, []);

  useEffect(() => {
    if (!postId) {
      setIsLoading(false);
      toast.error("Không tìm thấy ID bài viết để chỉnh sửa.");
      navigate("/");
      return;
    }
    setIsLoading(true);
    const fetchPost = async () => {
      try {
        const res = await getPostById(postId);
        if (res?.data) {
          const post = res.data;
          setTitle(post.title || "");
          setSelectedTopic(post.topicId || "");

          const convertedBlocks =
            post.contentBlock?.map((blockFromApi) => {
              let editorJsBlockData = {};
              const blockType = blockFromApi.type;
              const blockValueString = blockFromApi.value;

              if (blockType === "image") {
                editorJsBlockData = {
                  file: { url: blockValueString },
                  caption: "",
                  withBorder: false,
                  stretched: false,
                  withBackground: false,
                };
              } else if (
                [
                  "paragraph",
                  "header",
                  "quote",
                  "list",
                  "delimiter",
                  "table",
                  "code",
                  "raw",
                  "warning",
                  "checklist",
                ].includes(blockType)
              ) {
                editorJsBlockData = { text: blockValueString || "" };
                if (blockType === "header")
                  editorJsBlockData.level = blockFromApi.level || 2;
                if (blockType === "list")
                  editorJsBlockData.items =
                    (typeof blockValueString === "string"
                      ? JSON.parse(blockValueString)
                      : blockValueString) || [];
                if (blockType === "list" && blockFromApi.style)
                  editorJsBlockData.style = blockFromApi.style;
              } else {
                try {
                  editorJsBlockData =
                    typeof blockValueString === "string"
                      ? JSON.parse(blockValueString)
                      : blockValueString || {};
                } catch (e) {
                  console.warn(
                    `Không thể parse JSON cho block type ${blockType}:`,
                    blockValueString,
                    e
                  );
                  editorJsBlockData = { text: String(blockValueString) };
                }
              }
              return { type: blockType, data: editorJsBlockData };
            }) || [];
          setEditorDataForLoad({
            time: new Date().getTime(),
            blocks: convertedBlocks,
            version: "2.22.2",
          });
        } else {
          toast.error(`Không tìm thấy dữ liệu bài viết với ID: ${postId}`);
          setEditorDataForLoad({
            time: new Date().getTime(),
            blocks: [],
            version: "2.22.2",
          });
          navigate("/");
        }
      } catch (error) {
        console.error("EditPost: Lỗi khi lấy dữ liệu bài viết:", error);
        toast.error("Có lỗi xảy ra khi tải dữ liệu bài viết.");
        setEditorDataForLoad({
          time: new Date().getTime(),
          blocks: [],
          version: "2.22.2",
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchPost();
  }, [postId, navigate]);

  const handleEditorChange = useCallback((currentEditorJsData) => {
    editorDataRef.current = currentEditorJsData;
  }, []);

  const handleImageUpload = useCallback((file) => {
    console.log("chọn ảnh xong: ", file.name);
    setImages((prevImages) => [...prevImages, file]);
  }, []);

  const handleUpdate = async () => {
    if (
      !editorDataRef.current ||
      !editorDataRef.current.blocks ||
      isSubmitting
    ) {
      toast.warn("Chưa có nội dung hoặc đang trong quá trình cập nhật.");
      return;
    }
    if (!selectedTopic) {
      toast.warn("Vui lòng chọn chủ đề cho bài viết.");
      return;
    }
    if (!title.trim()) {
      toast.warn("Vui lòng nhập tiêu đề cho bài viết.");
      return;
    }
    setIsSubmitting(true);
    const currentEditorBlocks = editorDataRef.current.blocks;
    const blocksToSave = currentEditorBlocks.map((block) => {
      let valueToSave = "";
      const blockType = block.type;
      const blockData = block.data;
      if (blockType === "image") {
        valueToSave = "";
      } else if (
        blockData &&
        typeof blockData.text === "string" &&
        (blockType === "paragraph" ||
          blockType === "header" ||
          blockType === "quote")
      ) {
        valueToSave = blockData.text;
      } else {
        valueToSave = JSON.stringify(blockData || {});
      }
      return { type: block.type, value: valueToSave };
    });
    const formData = new FormData();
    formData.append("title", title);
    formData.append("topicId", selectedTopic);
    formData.append("blocks", JSON.stringify(blocksToSave));
    images.forEach((imageFile) => {
      formData.append("images", imageFile);
    });

    try {
      const responseData = await updatePostApi(postId, formData);
      toast.success("Cập nhật bài viết thành công!");
      navigate(`/post-detail/${postId}`);
    } catch (error) {
      console.error("Lỗi khi gọi API cập nhật bài viết:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Lỗi không xác định khi cập nhật.";
      toast.error(`Cập nhật thất bại: ${errorMessage}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const canSubmit =
    title.trim() !== "" &&
    selectedTopic !== "" &&
    (editorDataRef.current?.blocks?.length > 0 || images.length > 0) &&
    !isSubmitting &&
    !isLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-bgblue py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center text-sblue p-2 rounded-md">
              <ArrowLeft size={24} className="mr-2 opacity-50" />
              <span className="font-medium opacity-50">Về Trang Bài Viết</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-800 opacity-50">
              Chỉnh Sửa Bài Viết
            </h1>
          </div>
          <EditFormSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bgblue py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <Link
            to={postId ? `/post-detail/${postId}` : "/"}
            className="flex items-center text-sblue hover:text-pblue transition-colors duration-200 p-2 rounded-md hover:bg-pblue/10"
            aria-label="Quay lại"
          >
            <ArrowLeft size={24} className="mr-2" />
            <span className="font-medium">Quay Lại</span>
          </Link>
          <h1 className="text-3xl font-bold text-gray-800">
            Chỉnh sửa bài viết
          </h1>
        </div>

        <div className="bg-white shadow-xl rounded-lg p-6 sm:p-8 space-y-6">
          {/* Tiêu đề bài viết */}
          <div>
            <label
              htmlFor="post-title"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Tiêu đề bài viết <span className="text-red-500">*</span>
            </label>
            <input
              id="post-title"
              spellCheck="false"
              type="text"
              placeholder="Nhập tiêu đề..."
              className="w-full text-xl font-semibold p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pblue focus:border-pblue transition-shadow"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={isSubmitting}
            />
          </div>

          {/* Chọn topic */}
          <div>
            <label
              htmlFor="topic-select"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Chọn chủ đề <span className="text-red-500">*</span>
            </label>
            <select
              id="topic-select"
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-pblue focus:border-pblue appearance-none"
              value={selectedTopic}
              onChange={(e) => setSelectedTopic(e.target.value)}
              disabled={isSubmitting}
            >
              <option value="" disabled>
                -- Vui lòng chọn một chủ đề --
              </option>
              {topics.length > 0 ? (
                topics.map((topic) => (
                  <option key={topic.id} value={topic.id}>
                    {topic.name}
                  </option>
                ))
              ) : (
                <option value="" disabled>
                  Đang tải chủ đề...
                </option>
              )}
            </select>
          </div>

          {/* EditorJS */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nội dung bài viết <span className="text-red-500">*</span>
            </label>
            <div
              className={`border border-gray-300 rounded-md  min-h-[300px] focus-within:ring-2 focus-within:ring-pblue focus-within:border-pblue ${
                isSubmitting ? "opacity-70 bg-gray-50" : ""
              }`}
            >
              {editorDataForLoad ? (
                <Editor
                  data={editorDataForLoad}
                  onChange={handleEditorChange}
                  editorBlock="editorjs-container-edit"
                  onImageUpload={handleImageUpload}
                  readOnly={isSubmitting}
                />
              ) : (
                <div className="flex items-center justify-center h-64 text-gray-500">
                  <Loader2 size={32} className="animate-spin mr-2" />
                  Đang tải trình soạn thảo...
                </div>
              )}
            </div>
          </div>

          {/* Submit */}
          <div className="flex justify-end pt-4 border-t border-gray-200 mt-8">
            <button
              onClick={handleUpdate}
              disabled={!canSubmit}
              className={`flex items-center cursor-pointer bg-sblue text-white px-8 py-2 rounded-lg font-semibold text-lg
                hover:bg-pblue transition-all duration-200 ease-in-out
                focus:outline-none focus:ring-2 focus:ring-sblue focus:ring-offset-2
                disabled:bg-gray-400 disabled:cursor-not-allowed disabled:opacity-70`}
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={20} className="animate-spin mr-2" />
                  Đang cập nhật...
                </>
              ) : (
                <>
                  <Save size={20} className="mr-2" />
                  Lưu thay đổi
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
