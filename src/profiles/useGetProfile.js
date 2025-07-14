import { useQuery } from "@tanstack/react-query";
import { getAccount } from "../services/apiAccount";

export function useGetProfile(user_id) {
  const {
    data: profile,
    isLoading,
    error,
    isError,
  } = useQuery({
    queryKey: ["profile", user_id],
    queryFn: () => getAccount(user_id),
  });

  return { profile, isLoading, error, isError };
}
