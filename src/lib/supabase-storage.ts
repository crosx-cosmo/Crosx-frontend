import { getSupabase } from "./supabase-external";

/**
 * Storage helpers for the external Supabase project.
 *
 * Buckets must exist in that project. For private buckets use
 * `createSignedFileUrl`; for public buckets use `getPublicFileUrl`.
 */
export async function uploadFile(
  bucket: string,
  path: string,
  file: File | Blob,
  options?: { upsert?: boolean; contentType?: string },
) {
  const { data, error } = await getSupabase()
    .storage.from(bucket)
    .upload(path, file, {
      upsert: options?.upsert ?? true,
      ...(options?.contentType ? { contentType: options.contentType } : {}),
    });
  if (error) throw error;
  return data;
}

export function getPublicFileUrl(bucket: string, path: string): string {
  return getSupabase().storage.from(bucket).getPublicUrl(path).data.publicUrl;
}

export async function createSignedFileUrl(bucket: string, path: string, expiresInSeconds = 3600) {
  const { data, error } = await getSupabase()
    .storage.from(bucket)
    .createSignedUrl(path, expiresInSeconds);
  if (error) throw error;
  return data.signedUrl;
}

export async function listFiles(bucket: string, prefix = "") {
  const { data, error } = await getSupabase().storage.from(bucket).list(prefix);
  if (error) throw error;
  return data;
}

export async function removeFiles(bucket: string, paths: string[]) {
  const { error } = await getSupabase().storage.from(bucket).remove(paths);
  if (error) throw error;
}

/**
 * Convenience: upload a user's avatar and return a signed URL.
 * The `avatars` bucket is private, so reads use time-limited signed URLs.
 */
export async function uploadAvatar(userId: string, file: File, bucket = "avatars") {
  const ext = file.name.split(".").pop() ?? "png";
  const path = `${userId}/avatar.${ext}`;
  await uploadFile(bucket, path, file, { upsert: true, contentType: file.type });
  return createSignedFileUrl(bucket, path, 60 * 60 * 24 * 7);
}
