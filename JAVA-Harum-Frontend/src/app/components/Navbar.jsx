import { Menu } from "lucide-react";
import React, { useState, memo, useRef, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";

const Navbar = memo(function Navbar({ topics }) {
  const nav = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const handleClickToggle = () => {
    setIsOpen(!isOpen);
  };
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleNavigate = (topic) => {
    nav(`/topic/${topic.id}`);
    setIsOpen(false);
  };

  const validTopics = Array.isArray(topics) ? topics : [];

  return (
    <div className="w-full bg-transparent h-hnavbar shadow-sm">
      <div className="mx-auto max-w-6xl ">
        <div className="w-full flex justify-between items-center relative">
          <div className="flex">
            {validTopics.slice(0, 5).map((topic) => (
              <div
                key={topic.id}
                className={`flex items-center text-sm h-14 px-8 font-medium cursor-pointer
                hover:bg-bgblue hover:text-pblue
                ${
                  location.pathname === `/topic/${topic.id}`
                    ? "bg-bgblue text-pblue"
                    : "text-text"
                }`}
                onClick={() => handleNavigate(topic)}
                role="button"
                tabIndex={0}
                onKeyPress={(e) => e.key === "Enter" && handleNavigate(topic)}
              >
                {topic.name?.toString().toUpperCase()}
              </div>
            ))}
          </div>
          {validTopics.length > 5 && (
            <div ref={menuRef}>
              <Menu
                className="text-text2 h-7 w-7 cursor-pointer hover:text-pblue"
                onClick={handleClickToggle}
                aria-expanded={isOpen}
                aria-controls="topic-dropdown"
              />
              {isOpen && (
                <div
                  id="topic-dropdown"
                  className="w-60 absolute top-[60px] right-0 z-50 bg-white shadow-lg max-h-[calc(100svh-var(--spacing-hheader)-var(--spacing-hnavbar)-100px)] overflow-y-auto custom-scrollbar rounded-md"
                >
                  {validTopics.slice(5).map((topic) => (
                    <div
                      key={topic.id}
                      className={`flex items-center py-3 px-4 cursor-pointer
                      hover:bg-bgblue hover:text-pblue
                      ${
                        location.pathname === `/topic/${topic.id}`
                          ? "bg-bgblue text-pblue"
                          : "text-text"
                      }`}
                      onClick={() => handleNavigate(topic)}
                      role="menuitem"
                    >
                      {topic.name?.toString().toUpperCase()}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

export default Navbar;
