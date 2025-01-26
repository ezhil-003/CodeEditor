// import React from "react";

interface DocumentCardProps {
  title: string;
  lastOpened: string;
}

const DocumentCard = ({ title, lastOpened }: DocumentCardProps) => {
  return (
    <div className="border border-gray-300 rounded-lg shadow-md p-4 w-20 h-52 hover:shadow-lg transition cursor-pointer">
      <div className="bg-gray-200 h-28 w-full rounded-md mb-4"></div>
      <h3 className="font-medium text-sm">{title}</h3>
      <p className="text-xs text-gray-500">Opened {lastOpened}</p>
    </div>
  );
};

export default DocumentCard;