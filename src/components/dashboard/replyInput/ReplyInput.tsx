import React from "react";
import { Input, Button, Space } from "antd";
import { SendOutlined } from "@ant-design/icons";
import "./ReplyInput.css";

interface ReplyInputProps {
  commentId: string;
  value: string;
  loading: boolean;
  onChange: (value: string) => void;
  onSubmit: () => void;
}

const ReplyInput: React.FC<ReplyInputProps> = ({
  commentId,
  value,
  loading,
  onChange,
  onSubmit,
}) => {
  return (
    <Space.Compact style={{ width: "100%", marginTop: 8 }}>
      <Input
        id={`reply-input-${commentId}`}
        placeholder="Write a reply..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onPressEnter={onSubmit}
        className="custom-button"
      />
      <Button
        type="primary"
        className="send-button"
        loading={loading}
        onClick={onSubmit}
        icon={<SendOutlined />}
      ></Button>
    </Space.Compact>
  );
};

export default ReplyInput;
