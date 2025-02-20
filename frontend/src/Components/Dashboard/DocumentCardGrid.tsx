import {
  Card,
  CardHeader,
  CardBody,
  Image,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Skeleton,
} from "@nextui-org/react";
import { useEffect } from "react";
import { useRecentProjects } from "../../api/query";
import { useNavigate } from "react-router";

const DocumentCardGrid = () => {
  const { data: projects, isLoading, error, refetch } = useRecentProjects();
  // Optional: Trigger refetch on mount (not needed unless required)
  const navigate = useNavigate();
  useEffect(() => {
    refetch();
  }, [refetch]);
  const handleCardPress = (projectId: string) => {
    if (!isLoading) {
      navigate(`/editor/${projectId}`)
    }
  }

  if (error) {
    return <p className="text-red-500 p-4">Error fetching projects.</p>;
  }

  return (
    <div className="flex flex-row gap-4 p-6 flex-wrap">
      {(isLoading ? [...Array(6)] : projects).map((project: any, index: number) => (
        <Card
          key={project?.id || index}
          isPressable={!isLoading}
          onPress={() => handleCardPress(project.id)}
          className="hover:shadow-xl transition-shadow duration-300 border border-gray-300 w-[300px] flex-shrink-0"
        >
          {/* Card Header with Image Skeleton */}
          <CardHeader className="relative p-0 h-48">
            <Skeleton className="w-full h-full rounded-t-lg" isLoaded={isLoading ? false : true}>
              <Image
                src={"/tile2.jpg"}
                alt={`Preview of ${project?.name}`}
                className="object-cover w-full h-full rounded-t-lg"
              />
            </Skeleton>
          </CardHeader>

          {/* Card Body */}
          <CardBody className="p-4 bg-gray-800 rounded-b-lg">
            <div className="flex justify-between items-center">
              {/* Project Details */}
              <div className="flex-1">
                <Skeleton className="h-4 w-3/4 mb-2">
                  <h3 className="font-semibold text-white truncate">{project?.name}</h3>
                </Skeleton>
                <Skeleton>
                  <p className="text-sm text-gray-300 mt-1">
                    Last opened: {new Date(project?.createdAt).toLocaleDateString()}
                  </p>
                </Skeleton>
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
          </CardBody>
        </Card>
      ))}
    </div>
  );
};

export default DocumentCardGrid;