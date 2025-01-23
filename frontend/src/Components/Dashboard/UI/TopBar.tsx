// import React from 'react';

interface TopBarProps {
  onToggleSidebar: () => void;
  buttonClassName?: string; // Add this property
}

const TopBar = ({ onToggleSidebar, buttonClassName }: TopBarProps) => {
  return (
    <header className="bg-gray-100 w-full sticky top-0 z-50 flex items-center justify-between p-4">
      <button
        className={`text-white hover:text-gray-300 focus:outline-none ${
          buttonClassName || ""
        }`}
        onClick={onToggleSidebar}
        aria-label="Toggle Sidebar"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          x="0px"
          y="0px"
          width="28"
          height="28"
          viewBox="0 0 50 50"
        >
          <path d="M 5 8 A 2.0002 2.0002 0 1 0 5 12 L 45 12 A 2.0002 2.0002 0 1 0 45 8 L 5 8 z M 5 23 A 2.0002 2.0002 0 1 0 5 27 L 45 27 A 2.0002 2.0002 0 1 0 45 23 L 5 23 z M 5 38 A 2.0002 2.0002 0 1 0 5 42 L 45 42 A 2.0002 2.0002 0 1 0 45 38 L 5 38 z"></path>
        </svg>
      </button>
      <h1 className="text-xl font-bold">Code Editor</h1>
      <div className="flex items-center">
        <img
          src="/user-avatar.png"
          alt="User Avatar"
          className="w-8 h-8 rounded-full mr-2"
        />
        <span className="text-sm font-medium">John Doe</span>
      </div>
    </header>
  );
};

export default TopBar;
