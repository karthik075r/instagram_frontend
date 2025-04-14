import React from "react";
import { List, Button, Space, Alert, Row } from "antd";
import { useInstagram } from "../../hooks/useInstagram";
import { InstagramMedia } from "../../types/instagram";
import ProfileCard from "../../components/dashboard/profileCard/ProfileCard";
import PostCard from "../../components/dashboard/postCard/PostCard";
import { eString } from "../../utils/constants";

const Dashboard: React.FC = () => {
  const {
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
    fetchMedia,
    toggleComments,
    postReply,
    setReplyText,
    setActiveReplyCommentId,
    setError,
    setProfileError,
    showMoreProfileDetails,
    toggleShowMoreProfileDetails,
    timeAgo,
  } = useInstagram();

  return (
    <div style={{ padding: "24px", display: "flex", justifyContent: "center" }}>
      <Row
        style={{
          padding: "24px",
          minHeight: "100vh",
          borderRadius: "10px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          maxWidth: "600px",
          textAlign: "center",
        }}
        justify={"center"}
        align={"middle"}
      >
        <Space
          direction="vertical"
          size="large"
          style={{
            width: "600px",
            maxWidth: "100%",
            margin: "0 auto",
          }}
        >
          <ProfileCard
            profile={profile}
            loading={profileLoading}
            error={profileError}
            onCloseError={() => setProfileError(null)}
            showMoreProfileDetails={showMoreProfileDetails}
            toggleShowMoreProfileDetails={toggleShowMoreProfileDetails}
          />

          {error && (
            <Alert
              message="Error"
              description={error}
              type="error"
              showIcon
              closable
              onClose={() => setError(null)}
            />
          )}

          <List
            dataSource={media}
            renderItem={(post: InstagramMedia) => (
              <PostCard
                post={post}
                comments={comments[post.id] || []}
                showComments={showComments[post.id] || false}
                commentLoading={commentLoading[post.id] || false}
                activeReplyCommentId={activeReplyCommentId}
                replyText={replyText}
                replyLoading={replyLoading}
                onToggleComments={() => toggleComments(post.id)}
                onToggleReply={setActiveReplyCommentId}
                onReplyTextChange={setReplyText}
                onReplySubmit={(commentId: string) =>
                  postReply(commentId, post.id)
                }
                timeAgo={timeAgo}
              />
            )}
            loading={mediaLoading}
            locale={{ emptyText: eString.noPosts }}
          />

          {nextUrl && (
            <Button
              type="primary"
              onClick={() => fetchMedia(nextUrl)}
              loading={mediaLoading}
              style={{ display: "block", width: "200px", margin: "0 auto" }}
            >
              Load More
            </Button>
          )}
        </Space>
      </Row>
    </div>
  );
};

export default Dashboard;
