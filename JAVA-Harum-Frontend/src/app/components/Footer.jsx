import { Link } from "react-router-dom";
import { Facebook, Twitter, Linkedin, Instagram } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-8 ">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Logo & Giới thiệu */}
        <div>
          <Link to="/">
            <img src="/logoFull.svg" alt="Logo" className="h-16 mb-3" />
          </Link>
          <p className="text-gray-400 text-sm">
            Website chia sẻ kiến thức về lập trình, công nghệ và kỹ năng mềm. Cập nhật bài viết mới mỗi ngày!
          </p>
        </div>

        {/* Danh mục */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Danh mục</h3>
          <ul className="text-gray-400 space-y-2">
            <li><Link to="/" className="hover:text-white">Lập trình</Link></li>
            <li><Link to="/" className="hover:text-white">Công nghệ</Link></li>
            <li><Link to="/" className="hover:text-white">Kỹ năng mềm</Link></li>
            <li><Link to="/" className="hover:text-white">Về chúng tôi</Link></li>
          </ul>
        </div>

        {/* Liên hệ & Mạng xã hội */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Liên hệ</h3>
          <p className="text-gray-400 text-sm">Email: javaHarum@gmail.com</p>
          <div className="flex space-x-4 mt-3">
            <Link to="/" className="text-gray-400 hover:text-white">
              <Facebook size={20} />
            </Link>
            
            <Link to="/" className="text-gray-400 hover:text-white">
              <Instagram size={20} />
            </Link>
          </div>
        </div>
      </div>

      {/* Bản quyền */}
      <div className="text-center text-gray-500 text-sm mt-6">
        © 2025 Harum. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
