import React from "react";
import { Card, Button, Typography } from "antd";
import { CommentOutlined } from "@ant-design/icons";
import { InstagramMedia, InstagramComment } from "../../../types/instagram";
import CommentList from "../commentList/CommentList";
import "./PostCard.css"; // Import the CSS file

const { Text } = Typography;

interface PostCardProps {
  post: InstagramMedia;
  comments: InstagramComment[];
  showComments: boolean;
  commentLoading: boolean;
  activeReplyCommentId: string | null;
  replyText: Record<string, string>;
  replyLoading: Record<string, boolean>;
  onToggleComments: () => void;
  onToggleReply: (commentId: string) => void;
  onReplyTextChange: (commentId: string, text: string) => void;
  onReplySubmit: (commentId: string) => void;
  timeAgo: (givenDate: Date | string) => void;
}

const PostCard: React.FC<PostCardProps> = ({
  post,
  comments,
  showComments,
  commentLoading,
  activeReplyCommentId,
  replyText,
  replyLoading,
  onToggleComments,
  onToggleReply,
  onReplyTextChange,
  onReplySubmit,
  timeAgo,
}) => {
  const isVideo = post.media_type === "VIDEO";
  const mediaSource = isVideo ? post.thumbnail_url : post.media_url;

  return (
    <Card
      hoverable
      className={showComments ? "post-card" : "post-card no-padding-card"}
      cover={
        isVideo ? (
          <video
            src={post.media_url}
            poster={post.thumbnail_url}
            controls
            className="post-media"
          />
        ) : (
          <img
            alt={post.caption || "Instagram post"}
            src={mediaSource}
            className="post-media"
          />
        )
      }
      actions={[
        <Text type="secondary" className="post-timestamp">
          {timeAgo(post.timestamp) ?? ""}
        </Text>,
        <Button
          type="link"
          icon={<CommentOutlined />}
          onClick={onToggleComments}
          loading={commentLoading}
          className="post-comment-button custom-button"
        >
          {showComments
            ? "Hide Comments"
            : comments.length
            ? `${comments.length} Comments`
            : "Comments"}
        </Button>,
      ]}
    >
      <CommentList
        comments={comments}
        show={showComments}
        activeReplyCommentId={activeReplyCommentId}
        replyText={replyText}
        replyLoading={replyLoading}
        onToggleReply={onToggleReply}
        onReplyTextChange={onReplyTextChange}
        onReplySubmit={onReplySubmit}
      />
    </Card>
  );
};

export default PostCard;
