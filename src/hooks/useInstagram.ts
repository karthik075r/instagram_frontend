import { useCallback, useEffect } from "react";
import { message } from "antd";
import {
  fetchInstagramProfile,
  fetchInstagramMedia,
  fetchInstagramComments,
  postInstagramReply,
  toggleComments,
  setReplyText,
  setActiveReplyCommentId,
  setProfileError,
  setError,
  toggleShowMoreProfileDetails,
} from "../redux/instagramSlice";
import { useAppDispatch, useAppSelector } from "./redux"; // Import custom hooks
import { UseInstagramReturn } from "../types/instagram";

export const useInstagram = (): UseInstagramReturn => {
  const dispatch = useAppDispatch(); // Use typed dispatch
  // Selectors
  const profile = useAppSelector((state) => state.instagram.profile); // Use typed selector
  const media = useAppSelector((state) => state.instagram.media);
  const comments = useAppSelector((state) => state.instagram.comments);
  const showComments = useAppSelector((state) => state.instagram.showComments);
  const replyText = useAppSelector((state) => state.instagram.replyText);
  const activeReplyCommentId = useAppSelector(
    (state) => state.instagram.activeReplyCommentId
  );
  const profileLoading = useAppSelector(
    (state) => state.instagram.profileLoading
  );
  const mediaLoading = useAppSelector((state) => state.instagram.mediaLoading);
  const commentLoading = useAppSelector(
    (state) => state.instagram.commentLoading
  );
  const replyLoading = useAppSelector((state) => state.instagram.replyLoading);
  const profileError = useAppSelector((state) => state.instagram.profileError);
  const error = useAppSelector((state) => state.instagram.error);
  const nextUrl = useAppSelector((state) => state.instagram.nextUrl);
  const showMoreProfileDetails = useAppSelector(
    (state) => state.instagram.showMoreProfileDetails
  );

  const businessId = profile?.id;

  const fetchProfile = useCallback(async (): Promise<void> => {
    if (!profile?.id) {
      dispatch(fetchInstagramProfile());
    }
  }, [dispatch, profile]);

  const fetchMedia = useCallback(
    async (url: string | null = null): Promise<void> => {
      if (businessId) {
        dispatch(fetchInstagramMedia({ businessId, url }));
      }
    },
    [dispatch, businessId]
  );

  const postReply = useCallback(
    async (commentId: string, mediaId: string): Promise<void> => {
      const text = replyText[commentId]?.trim();
      if (!text) {
        message.warning("Please enter a reply.");
        return;
      }
      if (text.length > 300) {
        message.warning("Reply must be 300 characters or less.");
        return;
      }
      dispatch(postInstagramReply({ commentId, mediaId, text })).then(
        (action: { meta: { requestStatus: string } }) => {
          if (action.meta.requestStatus === "fulfilled") {
            dispatch(fetchInstagramComments(mediaId));
          }
        }
      );
    },
    [dispatch, replyText]
  );

  const setReplyTextHandler = useCallback(
    (commentId: string, text: string): void => {
      dispatch(setReplyText({ commentId, text }));
    },
    [dispatch]
  );

  const setActiveReplyCommentIdHandler = useCallback(
    (commentId: string | null): void => {
      dispatch(setActiveReplyCommentId(commentId));
    },
    [dispatch]
  );

  const setProfileErrorHandler = useCallback(
    (error: string | null): void => {
      dispatch(setProfileError(error));
    },
    [dispatch]
  );

  const setErrorHandler = useCallback(
    (error: string | null): void => {
      dispatch(setError(error));
    },
    [dispatch]
  );

  const toggleCommentsHandler = useCallback(
    (mediaId: string): void => {
      if (showComments[mediaId]) {
        dispatch(toggleComments(mediaId));
      } else if (comments[mediaId]) {
        dispatch(toggleComments(mediaId));
      } else {
        dispatch(fetchInstagramComments(mediaId));
      }
    },
    [dispatch, comments, showComments]
  );

  const toggleShowMoreProfileDetailsHandler = useCallback((): void => {
    dispatch(toggleShowMoreProfileDetails());
  }, [dispatch]);

  useEffect(() => {
    fetchProfile();
    fetchMedia();
  }, [fetchProfile, fetchMedia]);

  const timeAgo = useCallback((givenDate: string | Date): string => {
    const today = new Date();
    const past = new Date(givenDate);

    let years = today.getFullYear() - past.getFullYear();
    let months = today.getMonth() - past.getMonth();
    let days = today.getDate() - past.getDate();

    if (days < 0) {
      months--;
      days += new Date(today.getFullYear(), today.getMonth(), 0).getDate();
    }
    if (months < 0) {
      years--;
      months += 12;
    }

    const result: string[] = [];
    if (years > 0) result.push(`${years} year${years > 1 ? "s" : ""}`);
    if (months > 0 && !result.length)
      result.push(`${months} month${months > 1 ? "s" : ""}`);
    if (days > 0 && !result.length)
      result.push(`${days} day${days > 1 ? "s" : ""}`);

    return result.length > 0 ? result.join(", ") + " ago" : "Today";
  }, []);

  return {
    profile,
    media,
    comments,
    showComments,
    replyText,
    activeReplyCommentId,
    profileLoading,
    mediaLoading,
    commentLoading,
    replyLoading,
    profileError,
    error,
    nextUrl,
    fetchProfile,
    fetchMedia,
    toggleComments: toggleCommentsHandler,
    postReply,
    setReplyText: setReplyTextHandler,
    setActiveReplyCommentId: setActiveReplyCommentIdHandler,
    setProfileError: setProfileErrorHandler,
    setError: setErrorHandler,
    showMoreProfileDetails,
    toggleShowMoreProfileDetails: toggleShowMoreProfileDetailsHandler,
    timeAgo,
  };
};
