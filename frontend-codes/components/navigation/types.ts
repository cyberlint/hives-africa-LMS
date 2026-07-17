import { megaMenuConfig } from './mega-menu.config';

export type NavigationItem =
  | {
      title: string;
      type: "link";
      href: string;
    }
  | {
      title: string;
      type: "mega";
      key: keyof typeof megaMenuConfig;
    };