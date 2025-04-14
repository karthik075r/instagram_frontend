import React from "react";
import { Card, Spin, Alert, Avatar, Typography, Space, Statistic } from "antd";
import { InfoCircleOutlined, UserOutlined } from "@ant-design/icons";
import { InstagramProfile } from "../../../types/instagram";
import { eString } from "../../../utils/constants";
import "./ProfileCard.css"; // Import the CSS file

const { Title } = Typography;

interface ProfileCardProps {
  profile: InstagramProfile | null;
  loading: boolean;
  error: string | null;
  onCloseError: () => void;
  showMoreProfileDetails: boolean;
  toggleShowMoreProfileDetails: () => void;
}

const ProfileCard: React.FC<ProfileCardProps> = ({
  profile,
  loading,
  error,
  onCloseError,
  showMoreProfileDetails,
  toggleShowMoreProfileDetails,
}) => {
  if (loading) {
    return <Spin tip={eString.loadingProfile} />;
  }

  if (error) {
    return (
      <Alert
        message="Profile Error"
        description={error}
        type="error"
        showIcon
        closable
        onClose={onCloseError}
      />
    );
  }

  if (!profile) {
    return null;
  }

  return (
    <Card className="profile-card">
      <Space direction="vertical" size="middle" className="profile-container">
        <Space
          className="profile-header"
          onClick={toggleShowMoreProfileDetails}
        >
          <Space>
            <Avatar src={profile.profile_picture_url} size={64} />
            <Title level={4} className="profile-username">
              {profile.username}
            </Title>
          </Space>
          <Space className="profile-stats">
            <Statistic
              title="Posts"
              value={profile.media_count}
              className="profile-stat"
            />
            <Statistic
              title="Followed"
              value={profile.followers_count}
              className="profile-stat"
            />
            <Statistic
              title="Follows"
              value={profile.follows_count}
              className="profile-stat"
            />
          </Space>
        </Space>
        {showMoreProfileDetails && (
          <div className="profile-details">
            <Space direction="vertical" className="profile-info">
              {profile.name && (
                <Space className="profile-info-item">
                  <UserOutlined />
                  <Typography.Text className="profile-text">
                    {profile.name}
                  </Typography.Text>
                </Space>
              )}
              {profile.biography && (
                <Space className="profile-info-item">
                  <InfoCircleOutlined />
                  <Typography.Text className="profile-text">
                    {profile.biography}
                  </Typography.Text>
                </Space>
              )}
            </Space>
          </div>
        )}
      </Space>
    </Card>
  );
};

export default ProfileCard;
