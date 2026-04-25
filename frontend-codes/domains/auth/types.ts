export type AuthUser = {
  id: string;
  role: "user" | "admin";
  name?: string;
  email?: string;
  image?: string;
  banned?: boolean;
};