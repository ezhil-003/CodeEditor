import { Card, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Image } from "@nextui-org/react";
// import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";

const DocumentCardGrid = () => {
  const documents = [
    {
      id: 1,
      title: "Project Proposal",
      lastOpened: "2024-02-15",
      previewImage: "/tile2.jpg"
    },
    {
      id: 2,
      title: "Meeting Notes",
      lastOpened: "2024-02-14",
      previewImage: "/tile2.jpg"
    },
    {
      id: 3,
      title: "Technical Specs",
      lastOpened: "2024-02-13",
      previewImage: "/tile2.jpg"
    },
    // Add more documents
  ];

  return (
    <div className="flex flex-row gap-4 p-6 flex-wrap">
      {documents.map((doc) => (
        <Card
          key={doc.id}
          className="hover:shadow-lg transition-shadow duration-300 border border-gray-200 w-[300px] p-2 flex-shrink-0"
        >
          {/* Document Preview Area */}
          <div className="h-48 relative p-4 bg-gray-50">
            <Image
              src={doc.previewImage}
              alt={`Preview of ${doc.title}`}
            
              className="object-cover rounded-t-lg"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
           
              
            />
          </div>

          {/* Footer */}
          <div className="p-4 bg-gray-800 rounded-b-lg">
            <div className="flex justify-between items-center">
              {/* Document Details */}
              <div className="flex-1">
                <h3 className="font-semibold text-white truncate">{doc.title}</h3>
                <p className="text-sm text-gray-300 mt-1">
                  Last opened: {new Date(doc.lastOpened).toLocaleDateString()}
                </p>
              </div>

              {/* Three-dot Menu */}
              <Dropdown>
                <DropdownTrigger>
                  <button className="text-white hover:bg-gray-700 rounded-full p-2 transition-colors">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="size-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z"
                      />
                    </svg>
                  </button>
                </DropdownTrigger>
                <DropdownMenu aria-label="Document actions">
                  <DropdownItem key="rename">Rename</DropdownItem>
                  <DropdownItem key="share">Share</DropdownItem>
                  <DropdownItem key="delete" className="text-danger">
                    Delete
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default DocumentCardGrid;