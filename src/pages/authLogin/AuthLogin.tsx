import React, { useState, useEffect } from "react";
import { Button } from "antd";
import { InstagramOutlined } from "@ant-design/icons";
import "./authLogin.css";
import { eRoutes, eString } from "../../utils/constants";

const Login: React.FC = () => {
  const [typedText, setTypedText] = useState("");
  const fullText = eString.clickToContinue;

  useEffect(() => {
    let index = 0;
    const typingInterval = setInterval(() => {
      if (index < fullText.length) {
        setTypedText((prev) => prev + fullText.charAt(index));
        index++;
      } else {
        clearInterval(typingInterval);
      }
    }, 50);

    return () => clearInterval(typingInterval);
  }, []);

  const handleInstagramLoginClickHandler = async () => {
    window.location.href = `${import.meta.env.VITE_API_BASE_URL}${
      eRoutes.authInstagram
    }`;
  };

  return (
    <div className="login-container">
      <div className="left-panel">
        <p className="query" data-testid="typing-text">
          {typedText}
          <span className="cursor">|</span>
        </p>
      </div>
      <div className="right-panel">
        <h2>Get proceed</h2>
        <div className="buttons">
          <Button
            icon={<InstagramOutlined />}
            shape="round"
            size="large"
            onClick={handleInstagramLoginClickHandler}
            className="instagram-btn"
          >
            Continue with Instagram
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Login;
