# Design Tokens — CSS Custom Properties Reference

All design tokens are defined as CSS custom properties on `:root` in `base.css`.
Dark theme values are defined as `--dark-*` variants and mapped automatically
via `[data-theme='dark']` and `@media (prefers-color-scheme: dark)`.

## Colors

| Token               | Light Value | Purpose                                        |
| ------------------- | ----------- | ---------------------------------------------- |
| `--primary-color`   | `#0f2b5c`   | Primary brand color (deep navy accents, links) |
| `--primary-hover`   | `#1e40af`   | Hover state for primary elements               |
| `--primary-light`   | `#3b82f6`   | Lighter primary for subtle highlights          |
| `--secondary-color` | `#1e293b`   | Secondary brand color (skip-link bg, headings) |

## Text

| Token              | Light Value | Purpose                         |
| ------------------ | ----------- | ------------------------------- |
| `--text-primary`   | `#0f172a`   | Main body text (deep slate)     |
| `--text-secondary` | `#334155`   | Muted/supporting text           |
| `--text-tertiary`  | `#64748b`   | Tertiary text (dates, metadata) |

## Backgrounds

| Token            | Light Value | Purpose                 |
| ---------------- | ----------- | ----------------------- |
| `--bg-primary`   | `#ffffff`   | Main content background |
| `--bg-secondary` | `#f8fafc`   | Page/body background    |
| `--bg-hover`     | `#f1f5f9`   | Hover state backgrounds |

## Borders

| Token            | Light Value | Purpose               |
| ---------------- | ----------- | --------------------- |
| `--border-color` | `#e2e8f0`   | Default border color  |
| `--border-hover` | `#cbd5e1`   | Border color on hover |

## Shadows

| Token                 | Light Value           | Purpose                             |
| --------------------- | --------------------- | ----------------------------------- |
| `--shadow-color`      | `rgba(15,23,42,0.06)` | General box shadows                 |
| `--shadow-primary`    | `rgba(15,43,92,0.2)`  | Primary-colored shadow (avatar/btn) |
| `--shadow-primary-lg` | `rgba(15,43,92,0.3)`  | Larger primary shadow               |
| `--shadow-primary-sm` | `rgba(15,43,92,0.08)` | Subtle primary shadow               |

## Typography

| Token         | Value                                            | Purpose                       |
| ------------- | ------------------------------------------------ | ----------------------------- |
| `--font-sans` | `'Plus Jakarta Sans', -apple-system, sans-serif` | Headings, body text, UI       |
| `--font-mono` | `'JetBrains Mono', ui-monospace, monospace`      | Tech tags, dates, credentials |

## Gradients

| Token                        | Light Value | Purpose                       |
| ---------------------------- | ----------- | ----------------------------- |
| `--gradient-primary-color`   | `#acd68b`   | Skill bar gradient start      |
| `--gradient-secondary-color` | `#6db56d`   | Skill bar gradient end        |
| `--language-gradient-start`  | `#1e3a8a`   | Language badge gradient start |
| `--language-gradient-end`    | `#0f2b5c`   | Language badge gradient end   |

## Dark Theme Overrides

All dark values are defined as `--dark-*` properties on `:root` and mapped
to the active tokens when dark mode is active.

| Token                       | Dark Value              |
| --------------------------- | ----------------------- |
| `--dark-primary-color`      | `#60a5fa`               |
| `--dark-primary-hover`      | `#93c5fd`               |
| `--dark-primary-light`      | `#bfdbfe`               |
| `--dark-secondary-color`    | `#93c5fd`               |
| `--dark-text-primary`       | `#f8fafc`               |
| `--dark-text-secondary`     | `#cbd5e1`               |
| `--dark-text-tertiary`      | `#94a3b8`               |
| `--dark-gradient-primary`   | `#86efac`               |
| `--dark-gradient-secondary` | `#4ade80`               |
| `--dark-bg-primary`         | `#0f172a`               |
| `--dark-bg-secondary`       | `#0b0f19`               |
| `--dark-bg-hover`           | `#1e293b`               |
| `--dark-border-color`       | `#1e293b`               |
| `--dark-border-hover`       | `#334155`               |
| `--dark-shadow-color`       | `rgba(0,0,0,0.5)`       |
| `--dark-shadow-primary`     | `rgba(96,165,250,0.25)` |
| `--dark-shadow-primary-lg`  | `rgba(96,165,250,0.35)` |
| `--dark-shadow-primary-sm`  | `rgba(96,165,250,0.15)` |
