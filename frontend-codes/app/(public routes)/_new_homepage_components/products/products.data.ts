export interface Product {
  id: string;
  name: string;
  href: string;
  image: string;
  alt: string;
}

export const products: Product[] = [
  {
    id: "learning",
    name: "Learning",
    href: "/learning",
    image: "/assets/products/dummy.jpg",
    alt: "NextHive Learning interface",
  },
  {
    id: "hives",
    name: "Hives",
    href: "/hives",
    image: "/assets/products/dummy.jpg",
    alt: "NextHive Hives interface",
  },
  {
    id: "signal-graph",
    name: "Signal Graph",
    href: "/signal-graph",
    image: "/assets/products/dummy.jpg",
    alt: "NextHive Signal Graph interface",
  },
  {
    id: "arena",
    name: "Arena",
    href: "/arena",
    image: "/assets/products/dummy.jpg",
    alt: "NextHive Arena interface",
  },
  {
    id: "events",
    name: "Events",
    href: "/events",
    image: "/assets/products/dummy.jpg",
    alt: "NextHive Events interface",
  },
  {
    id: "organizations",
    name: "Organizations",
    href: "/organizations",
    image: "/assets/products/dummy.jpg",
    alt: "NextHive Organizations interface",
  },
];