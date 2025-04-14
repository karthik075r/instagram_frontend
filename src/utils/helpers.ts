import { InstagramComment } from "../types/instagram";
import { eLocalStorage } from "./constants";

export const setAccessToken = (accessToken: string) => {
  localStorage.setItem(eLocalStorage?.ACCESS_TOKEN, accessToken);
};

export const getUniqueCommentsWithoutReplies = (
  comments: InstagramComment[]
): InstagramComment[] => {
  // Step 1: Collect all reply IDs
  const replyIds = new Set<string>();
  comments.forEach((comment) => {
    if (comment.replies?.data) {
      comment.replies.data.forEach((reply) => {
        replyIds.add(reply.id);
      });
    }
  });

  // Step 2: Filter comments where id is not in replyIds
  const filteredComments = comments.filter(
    (comment) => !replyIds.has(comment.id)
  );

  // Step 3: Ensure uniqueness by id (in case input has duplicates)
  const uniqueComments = Array.from(
    new Map(filteredComments.map((comment) => [comment.id, comment])).values()
  );

  return uniqueComments;
};
