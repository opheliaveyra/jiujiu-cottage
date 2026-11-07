# 玖玖の小屋 · Source-based 3D Room Preview

**Work branch:** `feature/jiujiu-room-folio` (does not replace `main/index.html`).

This is a real **Three.js source adaptation** of [Andrew Woan's Sooah's Room Folio](https://github.com/andrewwoan/sooahs-room-folio), not a screenshot, iframe, or a new CSS recreation.

## What the build does

1. GitHub Actions checks out the original source (Vite + Three.js + GSAP + Blender GLB model).
2. `room-lab/build.mjs` adapts its scene presentation and existing in-world **Work / About / Contact** modal panels to Jiujiu's projects.
3. Original camera orbit controls, day/night visual scene, responsive camera framing, GLTF model and raycast interactions are retained.
4. UI overlays and typography are replaced by `jiujiu.css`. The old site's Miorune, Cistella and AI-room project pages and the mini-games remain linked rather than copied.
5. Original music and sound effects, profile images and custom fonts are excluded; they have distinct third-party licensing and may not be transferable. Audio events are intentionally silent in this prototype.
6. Vite builds an isolated static site into `room-preview/`, which is committed to **this branch only**. The production home page is unchanged.

## Preview after the workflow succeeds

`https://raw.githack.com/opheliaveyra/jiujiu-cottage/feature/jiujiu-room-folio/room-preview/index.html`

GitHub Actions: `https://github.com/opheliaveyra/jiujiu-cottage/actions`

This preview URL will not work until `room-preview/index.html` is actually generated. Do not assume the CI job is green without checking. The preview is a prototype: existing model textures and decorative imagery need separate rights review or original replacement before the site is formally published.

## Rebuild locally

```bash
git clone https://github.com/opheliaveyra/jiujiu-cottage.git
cd jiujiu-cottage
git checkout feature/jiujiu-room-folio
git clone --depth 1 https://github.com/andrewwoan/sooahs-room-folio.git .room-upstream
node room-lab/build.mjs
cd .room-upstream
npm ci
npm run dev
```

## Attribution

The upstream software is copyright © 2025 Andrew Woan, MIT licensed. Preserve the original LICENSE.md in the built preview and the source. Original creator and third-party artwork credit remains required as appropriate. No claim is made that the upstream creator endorses this adaptation.
