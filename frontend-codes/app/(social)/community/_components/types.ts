export type PulseItem = {
  id: string;
  type: "REPUTATION" | "EVENT" | "PORTFOLIO";
  user: { 
    name: string; 
    image?: string | null 
  };
  title: string;
  subtitle: string;
  timestamp: string;
};