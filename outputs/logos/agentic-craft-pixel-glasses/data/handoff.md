# Agentic Craft Pixel Glasses Logo Handoff

## Recommended Direction

**Standalone Shades** is the strongest production candidate after the second
pass.

The second pass showed that the glasses can carry the mark without the circular
face container. Removing the circle makes the icon feel less like an avatar and
more like a crisp Agentic Craft symbol.

Use **Proof Corner Brackets** as the secondary editorial lockup when the mark
needs more of the Galley Proof / inspection-frame language.

## Preserve

- Black-and-white pixel-art construction.
- Compact rectangular sunglasses with a straight bridge.
- Anonymous agent signal, not a character portrait.
- Enough negative space for favicon use.

## Avoid

- Matrix-specific branding, green code rain, movie logos, actor likeness, or
  recognizable character copying.
- Text, initials, taglines, or fake marks.
- Soft gradients, glossy 3D, or details that disappear at 16px.
- Overly thin bridge or side-arm details.
- A full circular face container as the default icon.

## Review Notes

- `32px Favicon Grid` is the simplest browser-tab route.
- `Flat Agent Shades` is the strongest pure symbol route.
- `Proof Disc` is the best logo-system route.
- `Standalone Shades` is the strongest circle-free icon route.
- `Proof Corner Brackets` is the best branded circle-free lockup.
- `Terminal Viewport` works as a developer-surface variant, but is less iconic
  than the standalone glasses.
- `Rim Fragments` still reads a bit like a face outline, so treat it as a
  weaker transition route.
- `Negative Bridge` was recovered from the generated-image cache after the
  worker failed to expose a save path; the original failed worker logs remain
  in `workers/negative-bridge/`.

## Implementation

`Standalone Shades` has been vectorized as `app/icon.svg`.

The next optional step is to create a `Proof Corner Brackets` lockup for
site/editorial contexts where the mark needs more Agentic Craft-specific
framing.
