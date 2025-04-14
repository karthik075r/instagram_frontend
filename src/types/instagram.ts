export interface InstagramMedia {
  id: string;
  media_type: "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM";
  media_url: string;
  permalink: string;
  thumbnail_url?: string;
  caption?: string;
  timestamp: string;
}

export interface InstagramComment {
  id: string;
  username: string;
  text: string;
  replies?: { data: InstagramComment[] };
}

export interface InstagramMediaResponse {
  data: InstagramMedia[];
  paging?: {
    cursors: { before: string; after: string };
    next?: string;
  };
}

export interface InstagramCommentsResponse {
  data: InstagramComment[];
}

export interface InstagramProfile {
  id: string;
  username: string;
  name?: string;
  biography?: string;
  followers_count?: number;
  follows_count?: number;
  media_count?: number;
  profile_picture_url?: string;
  website?: string;
}

export interface InstagramError {
  message: string;
}

export type InstagramUser = {
  id: string;
  username: string;
  name: string;
  account_type: string;
  profile_picture_url: string;
  followers_count: number;
  media_count: number;
};

export type MediaItem = {
  id: string;
  media_type: string;
  media_url: string;
  permalink: string;
  timestamp: string;
};

export interface UseInstagramReturn {
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
  fetchProfile: () => Promise<void>;
  fetchMedia: (url?: string | null) => Promise<void>;
  toggleComments: (mediaId: string) => void;
  postReply: (commentId: string, mediaId: string) => Promise<void>;
  setReplyText: (commentId: string, text: string) => void;
  setActiveReplyCommentId: (commentId: string | null) => void;
  setProfileError: (error: string | null) => void;
  setError: (error: string | null) => void;
  showMoreProfileDetails: boolean;
  toggleShowMoreProfileDetails: () => void;
  timeAgo: (givenDate: string | Date) => void;
}
