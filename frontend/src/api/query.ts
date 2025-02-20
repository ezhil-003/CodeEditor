// src/api/query.ts
import { useMutation, useQuery } from "@tanstack/react-query";
import { loginUser, registerUser, createProject, getRecentProjects, refreshAccessToken } from "./api";
import { useAuth } from "../Contexts/AuthContext";
import { encryptRefreshToken } from "../utils/encryption";
import { useNavigate } from "react-router";

export const useRegisterMutation = (navigate: any) => {
  const handleSuccess = () => {
    alert("Account created successfully!");
    navigate("/", { state: { message: "Account created successfully!" } });
  };

  return useMutation({
    mutationFn: registerUser,
    onSuccess: handleSuccess,
    onError: (error: Error) => {
      console.error("Registration failed:", error);
      // You can display an error message to the user here
      alert("Error on creating the account");
    },
  });
};

export const useLoginMutation = (navigate: any) => {
  const { setToken, setRefreshToken } = useAuth();
  const handleSuccess = async (data: any) => {

    const { token, refreshToken } = data;
    setToken(token);
    setRefreshToken(refreshToken);

    const encrypted = await encryptRefreshToken(refreshToken)
    // Store tokens in localStorage (with encryption for refreshToken)
    localStorage.setItem("accessToken", token);
    localStorage.setItem("refreshToken", encrypted);
    navigate("/user/dashboard", {
      state: { message: "Account Loggedin successfully!" },
    });
  };
  return useMutation({
    mutationFn: loginUser,
    onSuccess: handleSuccess,
    onError: (error) => {
      console.error("Login Mutation Error:", error);
      // Display an error message to the user
    },
  });
};



export const useRefreshTokenMutation = () => {
  const auth = useAuth(); // ✅ Access context here
  return useMutation({
    mutationFn: refreshAccessToken, // ✅ Directly use the function
    onSuccess: (newAccessToken) => {
      if (!auth) {
        console.error("Auth context is not available.");
        return;
      }
      auth.setToken(newAccessToken); // ✅ Now using context safely
      localStorage.setItem("accessToken", newAccessToken);
    },
    onError: (error) => {
      console.error("Token refresh failed:", error);
    },
  });
};

export const useCreateProject = () => {
  const navigate = useNavigate();
  const handleSuccess = (data: any) => {
    const { projectId } = data;
    navigate(`/editor/${projectId}`);
  };

  return useMutation({
    mutationFn: async ({ name, template }: { name: string; template: string }) => {
      return createProject(name, template);
    },
    onSuccess: handleSuccess,
    onError: (error) => {
      console.error('Project creation error:', error);
    },
  });
};

export const useRecentProjects = () => {
  return useQuery({
    queryKey: ["recentProjects"],
    queryFn: getRecentProjects,
    staleTime: 1000 * 60 * 5, // Cache data for 5 minutes
    retry: 3, // Retry failed requests up to 3 times
    refetchOnWindowFocus: false, // Prevent unnecessary refetching when switching tabs
    onError: (error : Error) => {
      console.error("Error fetching recent projects:", error);
    },
  });
};


