"use client";
import cookie from "js-cookie";



const useCurrentUser = () => {
  const userData = cookie.get("user");
  if (userData) {
    try {
      const user = JSON.parse(userData);
      return user;
    } catch (error) {
      console.error("Error parsing user data:", error);
      return {};
    }
  } else {
    return {};
  }
};

export default useCurrentUser;