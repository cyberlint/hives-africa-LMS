// Allow importing global CSS (Next.js root layout)
declare module "*.css" {
  const content: any;
  export default content;
}
