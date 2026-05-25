import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./app/pages/Home/Home";
import DefaultLayout from "./app/layouts/DefaultLayout";
import NotFound from "./app/pages/NotFound/NotFound";
import AccessLayout from "./app/layouts/AccessLayout";
import Login from "./app/pages/Login/Login";
import Signup from "./app/pages/Signup/Signup";
import { ToastContainer } from "react-toastify";
import PrivatePart from "./app/components/PrivatePart";
import ProfileLayout from "./app/layouts/ProfileLayout";
import ProfileSetting from "./app/pages/ProfileEdit/ProfileSetting";
import Topic from "./app/pages/Topic/Topic";
import Message from "./app/pages/messages/Messages";
import Search from "./app/pages/Search/Search";
import PostDetail from "./app/pages/PostDetail/PostDetail";
import WritePost from "./app/pages/WritePost/WritePost";
import WriteLayout from "./app/layouts/WriteLayout";
import EditPost from "./app/pages/EditPost/EditPost";
import AdminLayout from "./app/layouts/AdminLayout";
import UserPage from "./app/pages/AdminUser/AdminUser";
import PostPage from "./app/pages/AdminPost/AdminPost";
import CommentPage from "./app/pages/AdminComment/AdminComment";
import ProfileRouter from "./app/pages/ProfileRoute/ProfileRoute";
import AdminWatchPost from "./app/pages/AdminPost/partials/AdminWatchPost";
import { AuthProvider } from "./app/contexts/AuthContext";
import AdminRoute from "./app/routes/AdminRoute";
import TopicSelection from "./app/pages/TopicSelection/TopicSelection";
import AdminDashboardPage from "./app/pages/AdminDashboard/AdminDashboard";
import AdminWatchUser from "./app/pages/AdminWatchUser/AdminWatchUser";
function App() {
  return (
    <>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="*" element={<NotFound />} />
            <Route element={<DefaultLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/search" element={<Search />} />
              <Route path="/post-detail/:id" element={<PostDetail />} />

              <Route path="/topic/:id" element={<Topic />} />
            </Route>
            <Route element={<AccessLayout />}>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
            </Route>
            <Route element={<ProfileLayout />}>
              <Route path="/profile/:id" element={<ProfileRouter />} />
              <Route
                path="/profileedit"
                element={
                  <PrivatePart>
                    <ProfileSetting />
                  </PrivatePart>
                }
              />
              <Route
                path="/changepassword"
                element={
                  <PrivatePart>
                    <ProfileSetting />
                  </PrivatePart>
                }
              />
              <Route
                path="/changetopics"
                element={
                  <PrivatePart>
                    <ProfileSetting />
                  </PrivatePart>
                }
              />

            </Route>
            <Route element={<WriteLayout />}>
              <Route
                path="/write-post"
                element={
                  <PrivatePart>
                    <WritePost />
                  </PrivatePart>
                }
              />
              <Route
                path="/message"
                element={
                  <PrivatePart>
                    <Message />
                  </PrivatePart>
                }
              />
              <Route
                path="/edit-post/:id"
                element={
                  <PrivatePart>
                    <EditPost />
                  </PrivatePart>
                }
              />
              <Route path="/topicselection" element={<TopicSelection />}/>
              
            </Route>
            <Route element={<AdminRoute />}>
              <Route path="/admin" element={<AdminLayout />}>
                <Route path="users" element={<UserPage />} />
                <Route path="posts" element={<PostPage />} />
                <Route path="comments" element={<CommentPage />} />
                 <Route path="profile/:id" element={<AdminWatchUser />} />
               <Route path="posts/:id" element={<AdminWatchPost />} />
                <Route path="dashboard" element={<AdminDashboardPage />} />
              </Route>
            </Route>
          </Routes>
        </BrowserRouter>
        <ToastContainer autoClose={2000} />
      </AuthProvider>
    </>
  );
}

export default App;
