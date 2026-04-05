/// <reference types="vite/client" />

// Allow uppercase .JPG imports (camera photos often use uppercase extensions)
declare module "*.JPG" {
  const src: string;
  export default src;
}
