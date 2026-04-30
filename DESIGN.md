# FreshAlert – Design Brief

**Purpose:** Mobile-first Android app for smart expiry tracking. Reduces food waste through vibrant status hierarchy and neumorphic Material Design 3 interactions.

**Tone & Aesthetic:** Playful yet functional. Bold color coding (green safe → orange warning → red expired) with smooth animations, neumorphic depth (24dp rounded corners, 4–12dp shadows), and haptic-inspired motion feedback.

**Target:** Portrait mobile (375–428px width), dark/light modes, all ages.

---

## Color Palette

| Role | OKLCH | Use Case |
|------|-------|----------|
| Safe/Fresh | L0.65 C0.22 H142 (Green) | Primary safe products, success actions |
| Soon/Warning | L0.70 C0.24 H68 (Orange) | Expiry soon (1–3 days) |
| Expired/Danger | L0.55 C0.24 H22 (Red) | Expired products, urgent alerts |
| Neutral Background | L0.98 C0.01 H270 | Light mode surface, low-emphasis zones |
| Card Surface | L1.0 C0 H0 | White card backgrounds, elevated content |
| Foreground Text | L0.12 C0.05 H258 | High-contrast body text |
| Border/Divider | L0.88 C0.03 H268 | Subtle structure, accessibility |
| Muted | L0.92 C0.03 H268 | Disabled states, secondary labels |

**Dark Mode:** Invert lightness (L 0.12 bg, L 0.95 fg), maintain chroma and hue for color identity. Primary L0.72, Secondary L0.78, Danger L0.62 for readability.

---

## Typography

| Tier | Font | Size | Weight | Use |
|------|------|------|--------|-----|
| Display | Figtree | 32px | 700–900 | Screen titles, hero stats |
| Heading MD | Figtree | 24px | 700 | Section headers |
| Heading SM | Figtree | 20px | 700 | Card titles, subsections |
| Body Large | GeneralSans | 16px | 400 | Primary body text |
| Body Medium | GeneralSans | 14px | 400 | Secondary labels, descriptions |
| Body Small | GeneralSans | 12px | 500 | Captions, metadata |
| Mono | Geist Mono | 12px | 400 | Expiry dates, codes, timestamps |

**Spacing:** 24px (1.5rem) base radius. Type scale: 32→24→20→16→14→12px.

---

## Elevation & Shadow Hierarchy

| Level | Shadow | Use |
|-------|--------|-----|
| Flat (0dp) | None | Inactive, background elements |
| Raised (4dp) | `shadow-md` | Card body, static content |
| Elevated (8dp) | `shadow-lg` | Interactive cards, hover state |
| Modal (12dp) | `shadow-xl` | Floating action button, modals, popovers |
| Glow | `shadow-glow` | Success highlights, safe product indicator |

Shadows adjust in dark mode (increased opacity). Inner glows on hover (subtle, 2–4px inset) for neumorphic feel.

---

## Structural Zones

| Zone | Background | Border | Purpose |
|------|------------|--------|---------|
| Header/AppBar | `bg-card` + `border-b` | `border-border` | Search + voice icon, profile access |
| Hero Stats | `gradient-hero` overlay | None | 3-stat cards (Fresh/Soon/Expired count) |
| Product List | `bg-background` | None | Scrollable expiry product cards |
| Floating Action | `bg-primary` + `shadow-xl` | None | Circular FAB (+) with pulse animation |
| Bottom Nav | `bg-card` + `border-t` | `border-border` | Categories, stats, settings tabs (if used) |
| Modals/Overlays | `bg-popover` + `shadow-xl` | None | Date picker, quick-add, notifications |

---

## Component Patterns

**Buttons:**
- Primary: `.btn-primary` (full-width at mobile, rounded-full 48px height)
- Secondary: `.btn-secondary` (outline or muted bg)
- Icon buttons: 44px touchable target, `transition-smooth`

**Cards:**
- Product Card: `.card-elevated`, photo top, name/expiry badge, days-to-expire label
- Stats Card: `.gradient-safe/warning/danger`, large number, small label
- Neumorphic: `rounded-2xl border shadow-md`, hover `.card-interactive` for `shadow-lg`

**Input:**
- `.input-field` (rounded-xl, 44px min height for touch, focus ring)
- Date picker: Material Design wheel, month/day/year separate rows
- Slider: 12px thumb, gradient track (safe→warning→danger), 44px clickable area

**Badges:**
- `.badge-safe`, `.badge-warning`, `.badge-danger` (20px height, rounded-full, 20% bg opacity)

---

## Motion & Interaction

| Trigger | Animation | Duration | Curve |
|---------|-----------|----------|-------|
| Card tap | `scale-in` | 0.3s | cubic-bezier(0.4, 0, 0.2, 1) |
| List swipe | `slide-in-up` / `slide-in-down` | 0.4s | ease-out |
| FAB expand | `fade-in` + scale | 0.3s | smooth cubic |
| Delete animation | Slide out + `fade-out` | 0.3s | ease-in |
| Success (save/add) | Confetti + `scale-in` | 2s | ease-out |
| FAB idle | `pulse-glow` | 2s | ease-in-out infinite |
| Notification in | `slide-in-down` | 0.4s | smooth cubic |

**Haptic Equivalent:** Visual pulsing on primary actions (FAB), color flash on success, smooth shadows for depth feedback.

---

## Typography Hierarchy & Spacing

**Density:**
- Compact (mobile): 8px/16px grid, 12px gutters
- Loose (desktop/tablets): 16px grid, 24px gutters

**Line Heights:**
- Display: 1.1 (tight)
- Headings: 1.3 (snug)
- Body: 1.5 (relaxed)

**Letter Spacing:**
- Display: -0.02em (tight tracking)
- Body: 0em (normal)

---

## Differentiation & Signature Detail

- **Gradient overlays on hero sections** (subtle, 10–5% opacity) create depth and visual interest without clutter
- **Color-coded product cards** (left border or top gradient) instantly communicate expiry status
- **Neumorphic depth** via consistent 24dp radius + layered shadows (not flat Material Design)
- **Confetti burst on successful add/save** reinforces positive action (uses confetti keyframe)
- **Pulsing FAB** signals engagement without animation overload

---

## Responsive Breakpoints

- **Mobile (< 375px):** Full-width, single column, 12px spacing
- **Mobile Standard (375–428px):** Max-width 375px container, primary design canvas
- **Tablet (768px+):** 2-column product grid, sidebar navigation (if included)

---

## Constraints & Anti-Patterns

✗ No flat, uniform surfaces without borders or shadows  
✗ No oversaturated gradients or neon glows  
✗ No animation without choreography (all motion tied to interaction)  
✗ No generic Material Design 3 defaults unmodified  
✓ Always use semantic color tokens (--success, --warning, --danger)  
✓ Maintain 4.5:1 contrast on all text  
✓ Touch targets minimum 44px  
✓ Animations max 0.4s for UI, 2s for entrance/confetti

---

## Dark Mode Tuning

Light Mode foreground: L0.12 C0.05 H258 (near-black blue)  
Dark Mode foreground: L0.95 C0.02 H270 (near-white cool gray)  
Both maintain L0.65 primary, L0.70 secondary, L0.55 danger for consistent brand feel.  
Borders & shadows increase opacity in dark (0.3→0.5 alpha) for readability.

---

**Token Files:** `src/frontend/src/index.css` (OKLCH palette, @font-face, gradients, shadows, utilities)  
**Config:** `src/frontend/tailwind.config.js` (boxShadow, keyframes, animations, fontFamily via CSS vars)
