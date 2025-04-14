import React from "react";
import { List, Button, Typography } from "antd";
import { InstagramComment } from "../../../types/instagram";
import ReplyInput from "../replyInput/ReplyInput";

const { Text, Paragraph } = Typography;

interface CommentListProps {
  comments: InstagramComment[];
  show: boolean;
  activeReplyCommentId: string | null;
  replyText: Record<string, string>;
  replyLoading: Record<string, boolean>;
  onToggleReply: (commentId: string) => void;
  onReplyTextChange: (commentId: string, text: string) => void;
  onReplySubmit: (commentId: string) => void;
}

const CommentList: React.FC<CommentListProps> = ({
  comments,
  show,
  activeReplyCommentId,
  replyText,
  replyLoading,
  onToggleReply,
  onReplyTextChange,
  onReplySubmit,
}) => {
  if (!show) {
    return null;
  }
  if (!comments.length) {
    return <Paragraph style={{ textAlign: "left" }}>No comments</Paragraph>;
  }
  return (
    <List
      style={{
        marginTop: 4,
      }}
      dataSource={comments}
      renderItem={(comment: InstagramComment) => (
        <List.Item
          actions={[
            <Button
              type="link"
              onClick={() => {
                if (activeReplyCommentId === comment.id) {
                  onToggleReply("");
                  return;
                }
                onToggleReply(comment.id);
                setTimeout(() => {
                  const input = document.getElementById(
                    `reply-input-${comment.id}`
                  );
                  input?.focus();
                }, 0);
              }}
              className="custom-button"
            >
              {activeReplyCommentId === comment.id ? "Cancel" : "Reply"}
            </Button>,
          ]}
          style={{
            borderBottom: "1px solid #d9d9d9",
            padding: "8px 16px",
            alignItems: "end",
          }}
        >
          <List.Item.Meta
            title={
              <Paragraph strong style={{ textAlign: "left" }}>
                {comment.username}
              </Paragraph>
            }
            description={
              <>
                <Paragraph style={{ marginBottom: 0, textAlign: "left" }}>
                  {comment.text}
                </Paragraph>
                {comment.replies?.data?.map((reply) => (
                  <Paragraph
                    key={reply.id}
                    style={{ marginLeft: 24, color: "#888", textAlign: "left" }}
                  >
                    <Text strong>{reply.username}: </Text>
                    {reply.text}
                  </Paragraph>
                ))}
                {activeReplyCommentId === comment.id && (
                  <ReplyInput
                    commentId={comment.id}
                    value={replyText[comment.id] || ""}
                    loading={replyLoading[comment.id] || false}
                    onChange={(text) => onReplyTextChange(comment.id, text)}
                    onSubmit={() => onReplySubmit(comment.id)}
                  />
                )}
              </>
            }
          />
        </List.Item>
      )}
    />
  );
};

export default CommentList;
