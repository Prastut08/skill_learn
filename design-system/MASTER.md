# SkillEarn Design System — MASTER

Style: Modern Glassmorphism (premium, energetic, confident)
Primary use: Campus micro-gig marketplace and student dashboard (SaaS / Marketplace)

Palette
- Primary: Teal / Aqua gradient — `#14B8A6` → `#7C3AED`
- Accent: Purple: `#7C3AED`
- Success: Emerald: `#10B981`
- Warning: Amber: `#F59E0B`
- Neutral dark: `#0F1724` (text)
- Neutral muted: `#475569`
- Card BG light: `#FFFFFF` (glass overlay uses alpha)

Typography
- Heading: Poppins, weight 700/800 — large, tight tracking
- Body: Poppins / system sans, 16px base on mobile, 18px desktop
- Line-height: 1.5 for body, 1.2–1.4 for headings

Spacing & Layout
- Container max-width: `max-w-4xl` for main content
- Gutter: 1rem (mobile) → 2rem (desktop)
- Border radius: 12–20px for cards, 28–32px for modals / main chrome

Shadows & Elevation
- Soft glass shadow: `0 8px 30px rgba(12,15,25,0.12)` (used as `shadow-glass-lg`)

Interaction & Accessibility Rules (priority)
- All interactive items: min target 44x44px, `cursor-pointer`, and `:focus-visible` ring
- Contrast: body text >= 4.5:1 against background — use `#0F1724` for text on light backgrounds
- Motion: respect `prefers-reduced-motion` — reduce animations

Components (patterns)
- Buttons: `.btn` base, `.btn-primary` gradient, `.btn-ghost` subtle
- Cards: `.card` uses glass gradient overlay with subtle border and `shadow-glass-lg`
- Inputs: `.input` with 12px radius, clear focus outline, accessible labels
- Nav: floating glass nav with rounded corners and soft blur
- Modal: max-width `max-w-lg`, rounded corners, `backdrop-blur` overlay

Iconography
- Use Lucide/Heroicons set, consistent 24x24 viewbox, `aria-hidden` on decorative icons

Motion
- Micro interactions: 150–220ms, ease-out for entrance, ease-in-out for hover

Anti-patterns
- No emojis as primary icons
- Avoid heavy drop shadows with large offsets
- Avoid too low-contrast gray body text

File structure notes
- `src/styles/index.css` — imports tokens and component utilities
- `design-system/MASTER.md` — master rules (this file)
