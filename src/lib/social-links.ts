/**
 * Central CrosX social profile config. Set `url` to the real profile URL to
 * make the icon clickable; `null` renders a visibly disabled icon.
 */
export type SocialPlatform =
  | "linkedin"
  | "youtube"
  | "facebook"
  | "whatsapp"
  | "telegram"
  | "x"
  | "instagram";

export const SOCIAL_LINKS: { platform: SocialPlatform; label: string; url: string | null }[] = [
  { platform: "linkedin", label: "LinkedIn", url: "https://www.linkedin.com/company/crosxdigital/" },
  { platform: "youtube", label: "YouTube", url: null },
  { platform: "facebook", label: "Facebook", url: "https://www.facebook.com/people/CrosX/61594989674743/" },
  { platform: "whatsapp", label: "WhatsApp", url: "https://whatsapp.com/channel/0029VbAZMYPAYlUCWDG3fW2I" },
  { platform: "telegram", label: "Telegram", url: "https://t.me/+1Y6DYmmowdA5M2Fl" },
  { platform: "x", label: "X (Twitter)", url: "https://x.com/amal_pradh13365" },
  { platform: "instagram", label: "Instagram", url: "https://www.instagram.com/iron_clad99" },
];
