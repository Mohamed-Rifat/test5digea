/**
 * Maps a Cloudinary URL to the same file served through our own domain
 * (see the /media/cloudinary rewrite in next.config.ts), so browsers with
 * tracking protection don't treat it as a third-party tracker.
 *
 *   media("https://res.cloudinary.com/demo/video/upload/x.mp4")
 *   // -> "/media/cloudinary/demo/video/upload/x.mp4"
 */
export function media(url: string): string {
  return url.replace(/^https:\/\/res\.cloudinary\.com\//, "/media/cloudinary/");
}
