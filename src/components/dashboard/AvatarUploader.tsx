import { useCallback, useEffect, useRef, useState } from "react";
import { Camera, Loader2, Trash2, UploadCloud, ZoomIn } from "lucide-react";
import { toast } from "sonner";
import { ActionButton, InlineSpinner, Modal } from "@/components/dashboard/kit";
import { useSupabaseSession } from "@/lib/supabase-auth";
import {
  deleteAvatar,
  fetchAvatarPath,
  saveAvatar,
  signAvatarUrl,
  validateAvatarFile,
} from "@/lib/profile-avatar";
import { cn } from "@/lib/utils";

const EDITOR_SIZE = 256;
const OUTPUT_SIZE = 512;

type Offset = { x: number; y: number };

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

/**
 * Circular profile photo control for the Publisher Identity card.
 * Falls back to the existing initials avatar whenever no photo is stored.
 */
export function AvatarUploader({ initials, className }: { initials: string; className?: string }) {
  const { user } = useSupabaseSession();
  const userId = user?.id ?? null;

  const [loading, setLoading] = useState(true);
  const [path, setPath] = useState<string | null>(null);
  const [url, setUrl] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const [editorSrc, setEditorSrc] = useState<string | null>(null);
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState<Offset>({ x: 0, y: 0 });
  const [error, setError] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const dragRef = useRef<{ px: number; py: number; ox: number; oy: number } | null>(null);

  useEffect(() => {
    let alive = true;
    if (!userId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    (async () => {
      try {
        const stored = await fetchAvatarPath(userId);
        if (!alive) return;
        setPath(stored);
        setUrl(stored ? await signAvatarUrl(stored) : null);
      } catch {
        if (alive) setUrl(null);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [userId]);

  const baseScale = image ? Math.max(EDITOR_SIZE / image.width, EDITOR_SIZE / image.height) : 1;
  const scale = baseScale * zoom;
  const drawW = image ? image.width * scale : 0;
  const drawH = image ? image.height * scale : 0;
  const maxX = Math.max(0, (drawW - EDITOR_SIZE) / 2);
  const maxY = Math.max(0, (drawH - EDITOR_SIZE) / 2);
  const clamped: Offset = { x: clamp(offset.x, -maxX, maxX), y: clamp(offset.y, -maxY, maxY) };

  const closeEditor = useCallback(() => {
    setEditorSrc((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });
    setImage(null);
    setZoom(1);
    setOffset({ x: 0, y: 0 });
    setError(null);
  }, []);

  const onPick = (file?: File | null) => {
    if (!file) return;
    const message = validateAvatarFile(file);
    if (message) {
      setError(message);
      toast.error("Photo not accepted", { description: message });
      return;
    }
    const src = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      setImage(img);
      setZoom(1);
      setOffset({ x: 0, y: 0 });
      setError(null);
      setEditorSrc(src);
    };
    img.onerror = () => {
      URL.revokeObjectURL(src);
      setError("That image could not be read. Try another file.");
    };
    img.src = src;
  };

  const startDrag = (px: number, py: number) => {
    dragRef.current = { px, py, ox: clamped.x, oy: clamped.y };
  };
  const moveDrag = (px: number, py: number) => {
    const d = dragRef.current;
    if (!d) return;
    setOffset({ x: d.ox + (px - d.px), y: d.oy + (py - d.py) });
  };
  const endDrag = () => {
    dragRef.current = null;
  };

  const save = async () => {
    if (!image || !userId) return;
    setBusy(true);
    try {
      const canvas = document.createElement("canvas");
      canvas.width = OUTPUT_SIZE;
      canvas.height = OUTPUT_SIZE;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Canvas unavailable");
      const f = OUTPUT_SIZE / EDITOR_SIZE;
      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, OUTPUT_SIZE, OUTPUT_SIZE);
      ctx.drawImage(
        image,
        ((EDITOR_SIZE - drawW) / 2 + clamped.x) * f,
        ((EDITOR_SIZE - drawH) / 2 + clamped.y) * f,
        drawW * f,
        drawH * f,
      );
      const blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob(resolve, "image/jpeg", 0.9),
      );
      if (!blob) throw new Error("Could not process the image");
      const saved = await saveAvatar(userId, blob, path);
      setPath(saved.path);
      setUrl(saved.url);
      closeEditor();
      toast.success("Profile photo updated", { description: "Your new avatar is live." });
    } catch (e) {
      const message = e instanceof Error ? e.message : "Upload failed. Please try again.";
      setError(message);
      toast.error("Upload failed", { description: message });
    } finally {
      setBusy(false);
    }
  };

  const remove = async () => {
    if (!userId) return;
    setBusy(true);
    try {
      await deleteAvatar(userId, path);
      setPath(null);
      setUrl(null);
      toast.success("Photo removed", { description: "Your initials avatar is back." });
    } catch (e) {
      toast.error("Could not remove photo", {
        description: e instanceof Error ? e.message : "Please try again.",
      });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div className="relative shrink-0">
        <span className="grid size-14 place-items-center overflow-hidden rounded-2xl bg-brand/12 font-display text-lg font-black text-brand">
          {loading ? (
            <Loader2 className="size-4 animate-spin" aria-hidden="true" />
          ) : url ? (
            <img src={url} alt="Profile photo" className="size-full object-cover" />
          ) : (
            initials
          )}
        </span>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={busy || !userId}
          aria-label={url ? "Change profile photo" : "Upload profile photo"}
          className="absolute -bottom-1 -right-1 grid size-7 place-items-center rounded-full border border-hairline bg-surface-2 text-foreground shadow-lux transition-colors duration-300 hover:border-brand/60 hover:text-brand disabled:opacity-50"
        >
          {busy ? (
            <Loader2 className="size-3.5 animate-spin" aria-hidden="true" />
          ) : (
            <Camera className="size-3.5" aria-hidden="true" />
          )}
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          capture={undefined}
          className="sr-only"
          onChange={(e) => {
            onPick(e.target.files?.[0]);
            e.target.value = "";
          }}
        />
      </div>

      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <ActionButton
            icon={UploadCloud}
            onClick={() => inputRef.current?.click()}
            disabled={busy || !userId}
            className="h-9 px-3 text-xs"
          >
            {url ? "Change Photo" : "Upload Photo"}
          </ActionButton>
          {url ? (
            <ActionButton
              variant="subtle"
              icon={Trash2}
              onClick={remove}
              disabled={busy}
              className="h-9 px-2.5 text-xs"
            >
              Remove
            </ActionButton>
          ) : null}
        </div>
        <p className="mt-1.5 text-[11px] leading-relaxed text-muted-foreground">
          JPG, PNG or WEBP · up to 5 MB
        </p>
      </div>

      <Modal
        open={Boolean(editorSrc)}
        onClose={() => (busy ? undefined : closeEditor())}
        title="Adjust your photo"
        description="Drag to position and zoom until your face is centred in the circle."
        footer={
          <>
            <ActionButton onClick={closeEditor} disabled={busy}>
              Cancel
            </ActionButton>
            <ActionButton variant="solid" onClick={save} disabled={busy}>
              {busy ? <InlineSpinner /> : null}
              {busy ? "Uploading..." : "Save Photo"}
            </ActionButton>
          </>
        }
      >
        <div className="grid gap-4">
          <div
            className="mx-auto touch-none select-none overflow-hidden rounded-full border border-hairline bg-surface-2"
            style={{ width: EDITOR_SIZE, height: EDITOR_SIZE, maxWidth: "78vw", maxHeight: "78vw" }}
            onPointerDown={(e) => {
              e.currentTarget.setPointerCapture(e.pointerId);
              startDrag(e.clientX, e.clientY);
            }}
            onPointerMove={(e) => moveDrag(e.clientX, e.clientY)}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
          >
            {editorSrc ? (
              <img
                src={editorSrc}
                alt="Selected photo preview"
                draggable={false}
                className="pointer-events-none origin-center will-change-transform"
                style={{
                  width: drawW,
                  height: drawH,
                  transform: `translate(${(EDITOR_SIZE - drawW) / 2 + clamped.x}px, ${(EDITOR_SIZE - drawH) / 2 + clamped.y}px)`,
                }}
              />
            ) : null}
          </div>

          <label className="grid gap-2">
            <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">
              <ZoomIn className="size-3.5 text-brand" aria-hidden="true" />
              Zoom
            </span>
            <input
              type="range"
              min={1}
              max={3}
              step={0.01}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-surface-2 accent-[var(--brand)]"
            />
          </label>

          {error ? (
            <p className="rounded-xl border border-destructive/40 bg-destructive/10 px-3 py-2 text-xs font-semibold text-destructive">
              {error}
            </p>
          ) : null}
        </div>
      </Modal>
    </div>
  );
}
