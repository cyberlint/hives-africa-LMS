import { submissionApproved } from "./submission-approved";

type TemplateFn = (payload: any, name: string) => {
  subject: string;
  html: string;
};

export const templates: Record<string, TemplateFn> = {
  submission_approved: submissionApproved,
};