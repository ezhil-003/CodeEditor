// import React from "react";
import { useState } from "react";
import { useCreateProject } from "../../api/query";
import { Button, Input, Modal, ModalBody, ModalContent, ModalHeader, ModalFooter } from "@nextui-org/react";

const StartNewProject = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [template, setTemplate] = useState("vite-react");
  const createProjectMutation = useCreateProject();

  const handleOpenModal = () => setIsOpen(true);

  const handleCreateProject = async () => {
    if (!name) return;
    createProjectMutation.mutate(
      { name, template },
      {
        onSuccess: () => setIsOpen(false),
        onError: () => alert("Unable to create project, try again."),
      }
    );
  };
  return (
    <>
      <button className="flex flex-col items-center justify-center border border-gray-300 rounded-lg shadow-md p-4 w-40 h-40 hover:shadow-lg transition cursor-pointer"
        onClick={handleOpenModal}
        disabled={createProjectMutation.isPending}
      >
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
      </button>

      <Modal isOpen={isOpen} onOpenChange={setIsOpen}>
        <ModalContent>
          <ModalHeader>Create a New Project</ModalHeader>
          <ModalBody>
            <Input
              label="Project Title"
              placeholder="Enter project name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="light" onPress={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button color="primary" onPress={handleCreateProject} isLoading={createProjectMutation.isPending}>
              {createProjectMutation.isPending ? "Creating..." : "Confirm"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default StartNewProject;