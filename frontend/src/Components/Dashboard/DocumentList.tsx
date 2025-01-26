// import React from "react";
import DocumentCard from "./UI/DocumentCard";

const DocumentList = () => {
  const documents = [
    { title: "Assignment: Job Posting Board", lastOpened: "19 Oct 2024" },
    { title: "Untitled document", lastOpened: "18 Aug 2024" },
    { title: "2020 MTech 4th Semester", lastOpened: "18 Aug 2024" },
    { title: "Project Title List", lastOpened: "7 Aug 2024" },
  ];

  return (
    <div className="flex flex-row gap-6">
      {documents.map((doc, index) => (
        <DocumentCard
          key={index}
          title={doc.title}
          lastOpened={doc.lastOpened}
        />
      ))}
    </div>
  );
};

export default DocumentList;