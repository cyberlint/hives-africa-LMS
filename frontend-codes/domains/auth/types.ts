export type AuthUser = {
  id: string;
  role: "user" | "admin";
  name?: string;
  image?: string;
  banned?: boolean;
};