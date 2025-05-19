import { useMutation, useQueryClient } from "@tanstack/react-query";
import { login, logout, resendVerification, signup, verifyAccount } from ".";
import { toast } from "sonner";
import useAuthStore from "@/lib/stores/authStore";
import { useNavigate } from "react-router-dom";
import { authKeys } from "./keys";

export const useLogin = () => {
  const loginUser = useAuthStore((state) => state.loginUser);
  const navigate = useNavigate();

  return useMutation({
    mutationFn: login,
    onSuccess: ({ data, message }) => {
      toast.success(message);
      loginUser(data.user, data.accessToken);
      navigate("/");
    },
    onError: ({ message }) => toast.error(message),
  });
};

export const useSignup = () => {
  const loginUser = useAuthStore((state) => state.loginUser);
  const navigate = useNavigate();

  return useMutation({
    mutationFn: signup,
    onSuccess: ({ data, message }) => {
      toast.success(message);
      loginUser(data.user, data.accessToken);
      navigate("/verify");
    },
    onError: ({ message }) => toast.error(message),
  });
};

export const useLogout = () => {
  const logoutUser = useAuthStore((state) => state.logoutUser);

  return useMutation({
    mutationFn: logout,
    onSuccess: ({ message }) => {
      toast.success(message);
      logoutUser();
    },
    onError: ({ message }) => toast.error(message),
  });
};

export const useResendVerification = () => {
  return useMutation({
    mutationFn: resendVerification,
    onSuccess: ({ message }) => toast.success(message),
    onError: ({ message }) => toast.error(message),
  });
};

export const useVerify = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: verifyAccount,
    onSuccess: ({ message }) => {
      toast.success(message);
      queryClient.invalidateQueries({ queryKey: authKeys.me() });
    },
    onError: ({ message }) => toast.error(message),
  });
};
