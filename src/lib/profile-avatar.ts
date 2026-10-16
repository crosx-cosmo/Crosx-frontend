import { getSupabase } from "./supabase-external";
import { createSignedFileUrl, removeFiles, uploadFile } from "./supabase-storage";

export const AVATAR_BUCKET = "avatars";
export const AVATAR_MAX_BYTES = 5 * 1024 * 1024; // 5 MB
export const AVATAR_TYPES = ["image/jpeg", "image/png", "image/webp"];

/** Human validation for a picked file. Returns an error message or null. */
export function validateAvatarFile(file: File): string | null {
  if (!AVATAR_TYPES.includes(file.type)) {
    return "Unsupported format. Use a JPG, PNG or WEBP image.";
  }
  if (file.size > AVATAR_MAX_BYTES) {
    return "Image is too large. Please choose a file under 5 MB.";
  }
  return null;
}

/** Stored avatar path for the signed-in user (kept in profiles.avatar_url). */
export async function fetchAvatarPath(userId: string) {
  const { data, error } = await getSupabase()
    .from("profiles")
    .select("avatar_url")
    .eq("id", userId)
    .maybeSingle();
  if (error) throw error;
  return data?.avatar_url ?? null;
}

/** Time-limited readable URL for a private avatar object. */
export async function signAvatarUrl(path: string) {
  return createSignedFileUrl(AVATAR_BUCKET, path, 60 * 60 * 24 * 7);
}

/** Upload a cropped avatar blob, persist its path and return a viewable URL. */
export async function saveAvatar(userId: string, blob: Blob, previousPath?: string | null) {
  const path = `${userId}/avatar-${Date.now()}.jpg`;
  await uploadFile(AVATAR_BUCKET, path, blob, { upsert: true, contentType: "image/jpeg" });

  const { error } = await getSupabase()
    .from("profiles")
    .update({ avatar_url: path })
    .eq("id", userId);
  if (error) throw error;

  if (previousPath && previousPath !== path) {
    await removeFiles(AVATAR_BUCKET, [previousPath]).catch(() => undefined);
  }
  return { path, url: await signAvatarUrl(path) };
}

/** Clear the stored avatar and delete the underlying object. */
export async function deleteAvatar(userId: string, path?: string | null) {
  const { error } = await getSupabase()
    .from("profiles")
    .update({ avatar_url: null })
    .eq("id", userId);
  if (error) throw error;
  if (path) await removeFiles(AVATAR_BUCKET, [path]).catch(() => undefined);
}
