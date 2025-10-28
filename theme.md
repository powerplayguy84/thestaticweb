# Theme Configuration

Configure the shadcn semantic colors for your application.

## Base Color Scheme

The base color determines the neutral palette used throughout the app. Current options:

- `neutral` (default)
- `slate`
- `stone`
- `gray`
- `zinc`

**Current setting:** `neutral`

## Color Mode

- `light` - Light mode only
- `dark` - Dark mode only
- `system` - Follow system preference (default)

**Current setting:** `system`

## Accent Colors

Override specific semantic colors with oklch values:

### Light Mode

```
--primary: oklch(0.205 0 0)
--primary-foreground: oklch(0.985 0 0)
--secondary: oklch(0.97 0 0)
--secondary-foreground: oklch(0.205 0 0)
--accent: oklch(0.97 0 0)
--accent-foreground: oklch(0.205 0 0)
--destructive: oklch(0.577 0.245 27.325)
--muted: oklch(0.97 0 0)
--muted-foreground: oklch(0.556 0 0)
--border: oklch(0.922 0 0)
--input: oklch(0.922 0 0)
--ring: oklch(0.708 0 0)
```

### Dark Mode

```
--primary: oklch(0.922 0 0)
--primary-foreground: oklch(0.205 0 0)
--secondary: oklch(0.269 0 0)
--secondary-foreground: oklch(0.985 0 0)
--accent: oklch(0.269 0 0)
--accent-foreground: oklch(0.985 0 0)
--destructive: oklch(0.704 0.191 22.216)
--muted: oklch(0.269 0 0)
--muted-foreground: oklch(0.708 0 0)
--border: oklch(1 0 0 / 10%)
--input: oklch(1 0 0 / 15%)
--ring: oklch(0.556 0 0)
```

## Border Radius

Controls the roundness of corners throughout the app.

**Current setting:** `0.625rem` (10px)

Options:

- `0rem` - No rounding (square corners)
- `0.375rem` - Small (6px)
- `0.5rem` - Medium (8px)
- `0.625rem` - Default (10px)
- `0.75rem` - Large (12px)
- `1rem` - Extra large (16px)

## How to Apply Changes

After editing this file, update the corresponding values in `src/app/globals.css`:

1. Find the `:root` selector for light mode colors
2. Find the `.dark` selector for dark mode colors
3. Update the `--radius` variable for border radius changes
4. The changes will be applied when you save the CSS file

## Color Resources

- [OKLCH Color Picker](https://oklch.com/)
- [shadcn/ui Themes](https://ui.shadcn.com/themes)
- [Tailwind CSS Colors](https://tailwindcss.com/docs/customizing-colors)
