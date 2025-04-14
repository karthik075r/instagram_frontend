import api from "./api";

export const handleInstagramCallback = async (code: string) => {
  try {
    const response = await api.get(`/auth/instagram/callback?code=${code}`);
    return response.data;
  } catch (error) {
    console.error("Error during Instagram callback:", error);
    throw error;
  }
};

export const handleInstagramLogin = async () => {
  try {
    window.location.href = await api.get(`/auth/instagram`);
  } catch (error) {
    console.error("Error during Instagram login:", error);
    throw error;
  }
};
