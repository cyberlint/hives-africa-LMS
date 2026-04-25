export type CommunicationUserContext = {
  id: string;
  name: string;
  email: string;

  // future-ready fields (safe to include now as optional)
  firstName: string;
  lastName?: string;

  locale?: string;
  timezone?: string;

  // future: preferences (we will plug this in later)
  preferences?: {
    email?: boolean;
    push?: boolean;
    inApp?: boolean;
  };
};