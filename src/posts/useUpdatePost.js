import { useMutation, useQueryClient } from "@tanstack/react-query";

import toast from "react-hot-toast";
import { updatePost as updatePostApi } from "../services/apiPosts";

export function useUpdatePost() {
  const queryClient = useQueryClient();

  const { mutate: updatePost, isLoading: isUpdating } = useMutation({
    mutationFn: updatePostApi,
    onSuccess: () => {
      toast.success("Post successfully updated");
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
    onError: (error) => toast.error(error.message),
  });

  return { isUpdating, updatePost };
}
