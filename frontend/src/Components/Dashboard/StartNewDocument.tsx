// import React from "react";

const StartNewDocument = () => {
  return (
    <div className="flex flex-col items-center justify-center border border-gray-300 rounded-lg shadow-md p-4 w-40 h-40 hover:shadow-lg transition cursor-pointer">
      <div className="flex items-center justify-center w-20 h-20 bg-blue-500 rounded-full text-white">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-10 w-10"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4v16m8-8H4"
          />
        </svg>
      </div>
      <p className="mt-4 text-center text-sm font-medium">Start a new document</p>
    </div>
  );
};

export default StartNewDocument;