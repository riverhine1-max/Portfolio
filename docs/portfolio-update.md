# Portfolio update — September 2026

## Experience

The home page has five sequential Vanguard chapters. Each automatic chapter
remains visible for 5.2 seconds after its video is ready. Wheel bursts cannot
jump between chapters. Explicit chapter buttons, Previous/Next, Pause, Exit,
the skip link, and Escape provide visitor control. Leaving by keyboard focus
also releases the pinned view. Reduced-motion visitors get native scrolling,
all descriptions, and a still image. Short viewports use the unpinned layout.

Slow or failed media leaves a still visible; loading waits are bounded. Videos
pause when the page is hidden or the sequence is outside the viewport. The
opening film has a pause control and respects reduced motion and data saving.

The Lab contains a seeded connected-room generator and a card interaction
study. Future Works clearly distinguishes concepts and plans from shipped work.

## Assets

- `Images/rh-mark.svg`: custom geometric RH identity; raster icons and social
  preview use the same mark.
- `Images/samurai-squirrel-concept.webp`: Higgsfield / GPT Image 2.5 concept art,
  generated for this update; labeled as concept art rather than gameplay.
- `Media/vanguard-{deck,path,fight,rewards,shape}.mp4`: five Higgsfield / Kling 3.0
  motion studies using the existing Vanguard portrait as their reference.
  These are presentation animations, not footage of implemented game mechanics.
- `Media/portal-world-loop.mp4`: existing portal film, edited to rotate its
  starting point and dissolve its last second into the original first second.
  Audio is removed; H.264 fast-start encoding is used throughout.

Existing project screenshots and case studies remain available. About and
Contact retain their content, with shared identity and navigation updates.

## Validation

Run `node --test tests/run-story.test.cjs` for chapter timing, fast wheel input,
slow/failed media, reduced motion, Escape, and manual control checks.

Desktop and 390 × 844 phone previews were checked in a browser, including Lab
controls, navigation, state progression, and the Then → Now timeline. Local
links/assets were checked across ten portfolio pages. All new clips decode;
the opening loop's seam was compared with ordinary adjacent-frame changes.
