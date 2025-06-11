// hooks/usePostDetail.ts
import { useQuery } from "@tanstack/react-query";
import { fetchPostDetail } from "../lib/api/post";

export const usePostDetail = (id: string) => {
  
  return useQuery({
    queryKey: ["post", id],
    queryFn: () => fetchPostDetail(id),
    enabled: !!id,
  });
};
