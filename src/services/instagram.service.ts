import axios, { AxiosError } from "axios";
import {
  InstagramProfile,
  InstagramMediaResponse,
  InstagramCommentsResponse,
} from "../types/instagram";

interface RefreshTokenResponse {
  access_token: string;
  expires_in: number;
}

/**
 *
 * @param currentAccessToken
 * @returns
 */
export const refreshAccessToken = async (
  currentAccessToken: string
): Promise<string> => {
  const url = `https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token&access_token=${currentAccessToken}`;
  try {
    const response = await axios.get<RefreshTokenResponse>(url);
    return response.data.access_token;
  } catch (error: unknown) {
    throw error ?? new Error("Failed to refresh access token");
  }
};

/**
 *
 * @param apiCall
 * @param accessToken
 * @param setAccessToken
 * @returns
 */
const apiCallWithRefresh = async <T>(
  apiCall: (token: string) => Promise<T>,
  accessToken: string,
  setAccessToken: (token: string) => void
): Promise<T> => {
  try {
    return await apiCall(accessToken);
  } catch (error) {
    const axiosError = error as AxiosError<{ error: { code: number } }>;
    if (
      axiosError.response?.status === 400 &&
      axiosError.response?.data?.error?.code === 190
    ) {
      // Token expired, attempt to refresh
      const newToken = await refreshAccessToken(accessToken);
      setAccessToken(newToken); // Update token in your app
      return await apiCall(newToken); // Retry with new token
    }
    throw error;
  }
};

/**
 *
 * @param accessToken
 * @param setAccessToken
 * @returns
 */
export const getInstagramProfile = async (
  accessToken: string,
  setAccessToken: (token: string) => void
): Promise<InstagramProfile> => {
  const url = `https://graph.instagram.com/v20.0/me?fields=id,username,name,biography,followers_count,follows_count,media_count,profile_picture_url,website&access_token=${accessToken}`;
  return apiCallWithRefresh(
    async (token) => {
      const response = await axios.get<InstagramProfile>(
        url.replace(accessToken, token)
      );
      return response.data;
    },
    accessToken,
    setAccessToken
  );
};

/**
 *
 * @param accessToken
 * @param businessId
 * @param setAccessToken
 * @returns
 */
export const getInstagramMedia = async (
  accessToken: string,
  businessId: string,
  setAccessToken: (token: string) => void
): Promise<InstagramMediaResponse> => {
  const apiUrl = `https://graph.instagram.com/v20.0/${businessId}/media?fields=id,media_type,media_url,permalink,caption,timestamp&access_token=${accessToken}`;
  return apiCallWithRefresh(
    async (token) => {
      const response = await axios.get<InstagramMediaResponse>(
        apiUrl.replace(accessToken, token)
      );
      return response.data;
    },
    accessToken,
    setAccessToken
  );
};

/**
 *
 * @param accessToken
 * @param mediaId
 * @param setAccessToken
 * @returns
 */
export const getComments = async (
  accessToken: string,
  mediaId: string,
  setAccessToken: (token: string) => void
): Promise<InstagramCommentsResponse> => {
  const url = `https://graph.instagram.com/v20.0/${mediaId}/comments?fields=id,username,text,replies{username,text}&access_token=${accessToken}`;
  return apiCallWithRefresh(
    async (token) => {
      const response = await axios.get<InstagramCommentsResponse>(
        url.replace(accessToken, token)
      );
      return response.data;
    },
    accessToken,
    setAccessToken
  );
};

/**
 *
 * @param accessToken
 * @param mediaId
 * @param text
 * @param setAccessToken
 * @returns
 */
export const postComment = async (
  accessToken: string,
  mediaId: string,
  text: string,
  setAccessToken: (token: string) => void
): Promise<void> => {
  const url = `XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX${mediaId}/comments?message=${encodeURIComponent(
    text
  )}&access_token=${accessToken}`;
  return apiCallWithRefresh(
    async (token) => {
      await axios.post(url.replace(accessToken, token));
    },
    accessToken,
    setAccessToken
  );
};

/**
 *
 * @param accessToken
 * @param commentId
 * @param text
 * @param setAccessToken
 * @returns
 */
export const postCommentReply = async (
  accessToken: string,
  commentId: string,
  text: string,
  setAccessToken: (token: string) => void
): Promise<void> => {
  const url = `https://graph.instagram.com/v20.0/${commentId}/replies?message=${encodeURIComponent(
    text
  )}&access_token=${accessToken}`;
  return apiCallWithRefresh(
    async (token) => {
      await axios.post(url.replace(accessToken, token));
    },
    accessToken,
    setAccessToken
  );
};
