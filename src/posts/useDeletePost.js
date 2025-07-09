import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deletePost as deletePostApi } from "../services/apiPosts";

export function useDeletePost() {
  const queryClient = useQueryClient();

  const { mutate: deletePost, isLoading: isDeletingPost } = useMutation({
    mutationFn: deletePostApi,
    onSuccess: () => {
      alert("Post successfully deleted");

      queryClient.invalidateQueries({
        queryKey: ["posts"],
      });
    },
    onError: (err) => alert(err.message),
  });

  return { deletePost, isDeletingPost };
}
