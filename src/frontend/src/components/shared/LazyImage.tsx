import { cn } from "@/lib/utils";
import { ImageIcon, type LucideIcon } from "lucide-react";

interface LazyImageProps {
  /** Kept for call-site compatibility; no image is rendered. */
  src?: string;
  /** Kept for call-site compatibility; used as the accessible label. */
  alt?: string;
  className?: string;
  imgClassName?: string;
  width?: number;
  height?: number;
  /** Decorative icon shown in the color block. */
  icon?: LucideIcon;
  /** Optional short label shown beneath the icon. */
  label?: string;
}

/**
 * LazyImage — a decorative visual placeholder that replaces photos with a
 * clean gradient color block, an icon, and optional label. No <img> or
 * background-image is rendered, so pages stay professional without images.
 */
export function LazyImage({
  alt,
  className,
  imgClassName,
  icon: Icon = ImageIcon,
  label,
}: LazyImageProps) {
  return (
    <div
      role="img"
      aria-label={alt ?? label}
      className={cn(
        "relative flex items-center justify-center overflow-hidden bg-gradient-subtle",
        className,
      )}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-accent/20 via-transparent to-primary/10" />
      <div
        className={cn(
          "relative flex flex-col items-center justify-center gap-3 p-6 text-center",
          imgClassName,
        )}
      >
        <span className="flex size-14 items-center justify-center rounded-2xl bg-accent/15 text-accent shadow-subtle">
          <Icon className="size-7" aria-hidden="true" />
        </span>
        {label ? (
          <span className="max-w-[16rem] text-sm font-medium text-muted-foreground">
            {label}
          </span>
        ) : null}
      </div>
    </div>
  );
}
