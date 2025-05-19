import { useQuery } from "@tanstack/react-query";
import { me, refresh } from ".";
import { authKeys } from "./keys";

export const useRefresh = () => {
  return useQuery({
    queryFn: refresh,
    queryKey: authKeys.refresh(),
    retry: false,
  });
};

export const useMe = () => {
  return useQuery({
    queryFn: me,
    queryKey: authKeys.me(),
    retry: false,
    refetchOnWindowFocus: false,
  });
};
