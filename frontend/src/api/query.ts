import { useMutation } from "@tanstack/react-query";
import { loginUser, registerUser, refreshToken, createProject } from "./api";
import { useAuth } from "../Contexts/AuthContext";
import { decryptRefreshToken, encryptRefreshToken } from "../utils/encryption";
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
  const handleSuccess = async (data: any) => {
    const { token, refreshToken } = data;
    const { setToken, setRefreshToken } = useAuth();

    setToken(token);
    setRefreshToken(refreshToken);

    const encrypted = await encryptRefreshToken(refreshToken)
    // Store tokens in localStorage (with encryption for refreshToken)
    localStorage.setItem("accessToken", token);
    localStorage.setItem("refreshToken", encrypted);
  }
  return useMutation({
    mutationFn: refreshToken,
    onSuccess: handleSuccess,
    onError: (error) => {
      // Handle refresh token error (e.g., display an error message, log the user out)
      console.error('Refresh token error:', error);
      // Optionally: localStorage.removeItem('refreshToken'); 
      // Optionally: Invalidate any queries that depend on the access token
    },
  }
  );
};

export const useCreateProject = () => {
  const navigate = useNavigate();

  const getAuthorization = () => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      console.error("useCreateProject: No access token found.");
      return null;
    }
    return token;
  };

  const handleSuccess = (data: any) => {
    const { project_id } = data;
    navigate(`/editor/${project_id}`);
  };

  return useMutation({
    mutationFn: async ({ name, template }: { name: string; template: string }) => {
      const authToken = await getAuthorization();
      if (!authToken) throw new Error("Authorization token is missing.");
      return createProject(name, template, authToken);
    },
    onSuccess: handleSuccess,
    onError: (error) => {
      console.error('Project creation error:', error);
    },
  });
};


