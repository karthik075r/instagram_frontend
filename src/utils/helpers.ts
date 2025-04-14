import { eLocalStorage } from "./constants";

export const setAccessToken = (accessToken: string) => {
  localStorage.setItem(eLocalStorage?.ACCESS_TOKEN, accessToken);
};
