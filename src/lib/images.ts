/**
 * Responsive image helpers.
 *
 * Photography is served from `static/images/`, pre-resized to the widths below
 * by `scripts/fetch-images.mjs`. Image *names* describe what the image is
 * ('projects/ikoyi-residence/hero'), not where it came from, so swapping a
 * placeholder for real JBC photography means dropping files into
 * `static/images/<name>-<width>.webp` — no code change.
 *
 * Cropping is deliberately not done here. Every <img> on the site sits in a
 * frame with an explicit `aspect-ratio` and `object-fit: cover`, so the browser
 * crops. Generating a file per ratio as well as per width would multiply the
 * asset count several times over for no visible difference.
 */

const BASE = '/images/';

/** Must stay in sync with WIDTHS in scripts/fetch-images.mjs. */
export const DEFAULT_WIDTHS = [480, 768, 1024, 1440, 1920] as const;

interface ImageOptions {
	/**
	 * width ÷ height, e.g. 1.5 for 3:2.
	 *
	 * Retained because call sites use it to compute the `height` attribute that
	 * reserves layout space. It no longer affects which file is requested — see
	 * the note on cropping above.
	 */
	ratio?: number;
}

/** Snap to the nearest generated width so we never request a file that isn't there. */
function nearestWidth(width: number) {
	return DEFAULT_WIDTHS.reduce((best, w) =>
		Math.abs(w - width) < Math.abs(best - width) ? w : best
	);
}

export function img(name: string, width: number, _options: ImageOptions = {}) {
	return `${BASE}${name}-${nearestWidth(width)}.webp`;
}

export function srcset(
	name: string,
	_options: ImageOptions = {},
	widths: readonly number[] = DEFAULT_WIDTHS
) {
	return widths.map((w) => `${BASE}${name}-${w}.webp ${w}w`).join(', ');
}
