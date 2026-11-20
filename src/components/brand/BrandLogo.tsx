import Image from "next/image";

/**
 * CERTIFENCE branding, defined once and used on every page.
 *
 * To replace the logo, overwrite public/brand/certifence-logo.png with the
 * new artwork (ideally a wide, tightly cropped wordmark on a dark or
 * transparent background — the black of the current JPEG-derived artwork is
 * blended away against the dark theme), and update LOGO_WIDTH / LOGO_HEIGHT below to the
 * new file's pixel size so the aspect ratio stays correct. The browser-tab
 * icon is src/app/icon.png.
 */
export const COMPANY_NAME = "CERTIFENCE Pvt. Ltd.";
export const PLATFORM_NAME = "Cybersecurity Quiz Platform";
export const TAGLINE = "Beyond the Vigilance";

const LOGO_SRC = "/brand/certifence-logo.png";
const LOGO_WIDTH = 1360;
const LOGO_HEIGHT = 290;

interface Props {
  /** Rendered height in pixels; width follows the logo's aspect ratio. */
  height?: number;
  priority?: boolean;
  className?: string;
}

export default function BrandLogo({ height = 40, priority = false, className = "" }: Props) {
  const width = Math.round((LOGO_WIDTH / LOGO_HEIGHT) * height);
  return (
    <Image
      src={LOGO_SRC}
      alt={`${COMPANY_NAME} — ${TAGLINE}`}
      width={width}
      height={height}
      priority={priority}
      className={`h-auto max-w-full mix-blend-lighten ${className}`}
      style={{ width, maxWidth: "100%" }}
    />
  );
}
