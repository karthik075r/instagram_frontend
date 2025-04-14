import React, { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Spin } from "antd";
import { eRoutes, eString } from "../../utils/constants";
import { handleInstagramCallback } from "../../services/auth.service";
import { setAccessToken } from "../../utils/helpers";

const Callback: React.FC = () => {
  const { search } = useLocation();
  const navigate = useNavigate();

  const code = new URLSearchParams(search).get("code");
  const hasRun = useRef(false);

  useEffect(() => {
    const fetchInstagramData = async () => {
      try {
        const data = await handleInstagramCallback(code as string);

        if (!data) {
          return;
        }
        setAccessToken(data.accessToken);
        navigate(eRoutes.feed);
      } catch (error) {
        console.error(error);
      }
    };

    if (code && !hasRun.current) {
      hasRun.current = true;
      fetchInstagramData();
    }
  }, [code, navigate]);

  return (
    <div style={{ textAlign: "center", padding: "50px" }}>
      <Spin size="large" />
      <p>{eString?.processingLogin}</p>
    </div>
  );
};

export default Callback;
