import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { message } from "antd";
import { AxiosError } from "axios";
import {
  getComments,
  getInstagramMedia,
  getInstagramProfile,
  postCommentReply,
} from "../services/instagram.service";
import { setAccessToken } from "../utils/helpers";
import {
  InstagramProfile,
  InstagramMedia,
  InstagramComment,
  InstagramError,
} from "../types/instagram";
import { eLocalStorage } from "../utils/constants";

interface InstagramState {
  profile: InstagramProfile | null;
  media: InstagramMedia[];
  comments: Record<string, InstagramComment[]>;
  showComments: Record<string, boolean>;
  replyText: Record<string, string>;
  activeReplyCommentId: string | null;
  profileLoading: boolean;
  mediaLoading: boolean;
  commentLoading: Record<string, boolean>;
  replyLoading: Record<string, boolean>;
  profileError: string | null;
  error: string | null;
  nextUrl: string | null;
  showMoreProfileDetails: boolean;
}

const initialState: InstagramState = {
  profile: null,
  media: [],
  comments: {},
  showComments: {},
  replyText: {},
  activeReplyCommentId: null,
  profileLoading: false,
  mediaLoading: false,
  commentLoading: {},
  replyLoading: {},
  profileError: null,
  error: null,
  nextUrl: null,
  showMoreProfileDetails: false,
};

// Thunks
export const fetchInstagramProfile = createAsyncThunk<
  InstagramProfile,
  void,
  { rejectValue: string }
>("instagram/fetchProfile", async (_, { rejectWithValue }) => {
  try {
    const accessToken = localStorage.getItem(
      eLocalStorage.ACCESS_TOKEN
    ) as string;
    return await getInstagramProfile(accessToken, setAccessToken);
  } catch (err) {
    const error = err as AxiosError<InstagramError>;
    return rejectWithValue(
      error.response?.data?.message || "Failed to fetch profile details"
    );
  }
});

export const fetchInstagramMedia = createAsyncThunk<
  { data: InstagramMedia[]; nextUrl: string | null },
  { businessId: string; url?: string | null },
  { rejectValue: string }
>("instagram/fetchMedia", async ({ businessId }, { rejectWithValue }) => {
  try {
    const accessToken = localStorage.getItem(
      eLocalStorage.ACCESS_TOKEN
    ) as string;
    const response = await getInstagramMedia(
      accessToken,
      businessId,
      setAccessToken
    );
    return { data: response.data, nextUrl: response.paging?.next || null };
  } catch (err) {
    const error = err as AxiosError<InstagramError>;
    return rejectWithValue(
      error.response?.data?.message || "Failed to fetch Instagram media"
    );
  }
});

export const fetchInstagramComments = createAsyncThunk<
  { mediaId: string; data: InstagramComment[] },
  string,
  { rejectValue: string }
>("instagram/fetchComments", async (mediaId, { rejectWithValue }) => {
  try {
    const accessToken = localStorage.getItem(
      eLocalStorage.ACCESS_TOKEN
    ) as string;
    const response = await getComments(accessToken, mediaId, setAccessToken);
    return { mediaId, data: response.data };
  } catch (err) {
    const error = err as AxiosError<InstagramError>;
    return rejectWithValue(
      error.response?.data?.message || "Failed to load comments"
    );
  }
});

export const postInstagramReply = createAsyncThunk<
  { mediaId: string },
  { commentId: string; mediaId: string; text: string },
  { rejectValue: string }
>(
  "instagram/postReply",
  async ({ commentId, mediaId, text }, { rejectWithValue }) => {
    try {
      const accessToken = localStorage.getItem(
        eLocalStorage.ACCESS_TOKEN
      ) as string;
      await postCommentReply(accessToken, commentId, text, setAccessToken);
      return { mediaId };
    } catch (err) {
      const error = err as AxiosError<InstagramError>;
      return rejectWithValue(
        error.response?.data?.message || "Failed to post reply"
      );
    }
  }
);

const instagramSlice = createSlice({
  name: "instagram",
  initialState,
  reducers: {
    toggleComments(state, action: { payload: string }) {
      const mediaId = action.payload;
      if (state.showComments[mediaId]) {
        state.showComments[mediaId] = false;
        state.activeReplyCommentId = null;
      } else {
        state.showComments[mediaId] = true;
      }
    },
    setReplyText(
      state,
      action: { payload: { commentId: string; text: string } }
    ) {
      const { commentId, text } = action.payload;
      state.replyText[commentId] = text;
    },
    setActiveReplyCommentId(state, action: { payload: string | null }) {
      state.activeReplyCommentId = action.payload;
    },
    setProfileError(state, action: { payload: string | null }) {
      state.profileError = action.payload;
    },
    setError(state, action: { payload: string | null }) {
      state.error = action.payload;
    },
    toggleShowMoreProfileDetails(state) {
      state.showMoreProfileDetails = !state.showMoreProfileDetails;
    },
  },
  extraReducers: (builder) => {
    // Fetch Profile
    builder
      .addCase(fetchInstagramProfile.pending, (state) => {
        state.profileLoading = true;
        state.profileError = null;
      })
      .addCase(fetchInstagramProfile.fulfilled, (state, action) => {
        state.profile = action.payload;
        state.profileLoading = false;
      })
      .addCase(fetchInstagramProfile.rejected, (state, action) => {
        state.profileError = action.payload || "Failed to fetch profile";
        state.profileLoading = false;
      });

    // Fetch Media
    builder
      .addCase(fetchInstagramMedia.pending, (state) => {
        state.mediaLoading = true;
        state.error = null;
      })
      .addCase(fetchInstagramMedia.fulfilled, (state, action) => {
        state.media = action.meta.arg.url
          ? [...state.media, ...action.payload.data]
          : action.payload.data;
        state.nextUrl = action.payload.nextUrl;
        state.mediaLoading = false;
      })
      .addCase(fetchInstagramMedia.rejected, (state, action) => {
        state.error = action.payload || "Failed to fetch media";
        state.mediaLoading = false;
      });

    // Fetch Comments
    builder
      .addCase(fetchInstagramComments.pending, (state, action) => {
        state.commentLoading[action.meta.arg] = true;
      })
      .addCase(fetchInstagramComments.fulfilled, (state, action) => {
        state.comments[action.payload.mediaId] = action.payload.data;
        state.showComments[action.payload.mediaId] = true;
        state.commentLoading[action.payload.mediaId] = false;
      })
      .addCase(fetchInstagramComments.rejected, (state, action) => {
        state.commentLoading[action.meta.arg] = false;
        message.error(`Failed to load comments: ${action.payload}`);
      });

    // Post Reply
    builder
      .addCase(postInstagramReply.pending, (state, action) => {
        state.replyLoading[action.meta.arg.commentId] = true;
      })
      .addCase(postInstagramReply.fulfilled, (state, action) => {
        state.replyLoading[action.meta.arg.commentId] = false;
        state.replyText[action.meta.arg.commentId] = "";
        state.activeReplyCommentId = null;
        message.success("Reply posted successfully!");
      })
      .addCase(postInstagramReply.rejected, (state, action) => {
        state.replyLoading[action.meta.arg.commentId] = false;
        message.error(`Failed to post reply: ${action.payload}`);
      });
  },
});

export const {
  toggleComments,
  setReplyText,
  setActiveReplyCommentId,
  setProfileError,
  setError,
  toggleShowMoreProfileDetails,
} = instagramSlice.actions;

export default instagramSlice.reducer;
