import { promises as fs } from "fs";
import path from "path";
import matter from "gray-matter";
import Link from "next/link";

interface ThemeData {
  title: string;
  subtitle: string;
  description: string;
  colors: {
    light: Record<string, string>;
    dark: Record<string, string>;
  };
  radius: string;
}

async function checkForConflict(): Promise<boolean> {
  try {
    const themeFolderPath = path.join(process.cwd(), "content", "theme");
    await fs.access(themeFolderPath);
    return true; // Folder exists - conflict detected
  } catch {
    return false; // Folder doesn't exist - no conflict
  }
}

async function getThemeData(): Promise<ThemeData> {
  const configPath = path.join(process.cwd(), "config", "theme.md");
  const fallbackPath = path.join(process.cwd(), "content", "theme.md");
  let filePath = configPath;
  try {
    await fs.access(configPath);
  } catch {
    filePath = fallbackPath;
  }
  const fileContents = await fs.readFile(filePath, "utf8");
  const { data } = matter(fileContents);
  return data as ThemeData;
}

function ConflictError() {
  return (
    <main id="main-content" className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="bg-destructive/10 border-2 border-destructive rounded-lg p-8">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <svg
                className="w-8 h-8 text-destructive"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-destructive mb-4">
                Route Conflict Detected
              </h1>
              <div className="space-y-4 text-foreground">
                <p>
                  The{" "}
                  <code className="bg-muted px-2 py-1 rounded text-sm">
                    /theme
                  </code>{" "}
                  route cannot be displayed because there is a conflict between:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>
                    <strong>Theme Settings Page:</strong>{" "}
                    <code className="bg-muted px-2 py-1 rounded text-sm">
                      src/app/theme/page.tsx
                    </code>
                  </li>
                  <li>
                    <strong>Theme Content Category:</strong>{" "}
                    <code className="bg-muted px-2 py-1 rounded text-sm">
                      content/theme/
                    </code>
                  </li>
                </ul>
                <div className="bg-muted border border-border rounded-lg p-4 mt-6">
                  <h2 className="font-semibold mb-2">How to Fix This:</h2>
                  <p className="text-sm text-muted-foreground mb-3">
                    Choose one of these solutions:
                  </p>
                  <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                    <li>
                      <strong>Rename the content folder:</strong> Change{" "}
                      <code className="bg-background px-1.5 py-0.5 rounded">
                        content/theme/
                      </code>{" "}
                      to something else like{" "}
                      <code className="bg-background px-1.5 py-0.5 rounded">
                        content/themes/
                      </code>{" "}
                      or{" "}
                      <code className="bg-background px-1.5 py-0.5 rounded">
                        content/styling/
                      </code>
                    </li>
                    <li>
                      <strong>Move the theme settings:</strong> Rename{" "}
                      <code className="bg-background px-1.5 py-0.5 rounded">
                        src/app/theme/
                      </code>{" "}
                      to{" "}
                      <code className="bg-background px-1.5 py-0.5 rounded">
                        src/app/customize/
                      </code>{" "}
                      and update references in the code
                    </li>
                  </ol>
                </div>
                <div className="flex gap-4 mt-6">
                  <Link
                    href="/"
                    className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    Go to Homepage
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default async function ThemePage() {
  // Check for route conflict
  const hasConflict = await checkForConflict();

  if (hasConflict) {
    return <ConflictError />;
  }

  const theme = await getThemeData();

  const colorLabels: Record<string, string> = {
    background: "Background",
    foreground: "Foreground",
    primary: "Primary",
    primaryForeground: "Primary Foreground",
    secondary: "Secondary",
    secondaryForeground: "Secondary Foreground",
    accent: "Accent",
    accentForeground: "Accent Foreground",
    muted: "Muted",
    mutedForeground: "Muted Foreground",
    destructive: "Destructive",
    border: "Border",
    input: "Input",
    ring: "Ring",
  };

  return (
    <main id="main-content" className="min-h-screen">
      {/* Light Mode Preview */}
      <div
        className="border-b-4"
        style={{
          backgroundColor: theme.colors.light.background,
          color: theme.colors.light.foreground,
          borderColor: theme.colors.light.border,
        }}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="mb-8">
            <div
              className="inline-block px-3 py-1 mb-4 text-xs font-semibold rounded"
              style={{
                backgroundColor: theme.colors.light.muted,
                color: theme.colors.light.mutedForeground,
              }}
            >
              Light Mode Preview
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">
              {theme.title}
            </h1>
            <p
              className="text-xl mb-6"
              style={{ color: theme.colors.light.mutedForeground }}
            >
              {theme.subtitle}
            </p>
            <p
              className="text-base"
              style={{ color: theme.colors.light.mutedForeground }}
            >
              {theme.description}
            </p>
          </div>

          <div className="space-y-6">
            {/* Demo Components */}
            <div className="grid gap-4 sm:grid-cols-2">
              <button
                className="w-full px-4 py-2 font-medium transition-opacity hover:opacity-90"
                style={{
                  backgroundColor: theme.colors.light.primary,
                  color: theme.colors.light.primaryForeground,
                  borderRadius: theme.radius,
                }}
              >
                Primary Button
              </button>

              <button
                className="w-full px-4 py-2 font-medium transition-opacity hover:opacity-90"
                style={{
                  backgroundColor: theme.colors.light.secondary,
                  color: theme.colors.light.secondaryForeground,
                  borderRadius: theme.radius,
                }}
              >
                Secondary Button
              </button>

              <button
                className="w-full px-4 py-2 font-medium transition-opacity hover:opacity-90"
                style={{
                  backgroundColor: theme.colors.light.accent,
                  color: theme.colors.light.accentForeground,
                  borderRadius: theme.radius,
                }}
              >
                Accent Button
              </button>

              <button
                className="w-full px-4 py-2 font-medium transition-opacity hover:opacity-90"
                style={{
                  backgroundColor: theme.colors.light.destructive,
                  color: theme.colors.light.primaryForeground,
                  borderRadius: theme.radius,
                }}
              >
                Destructive Button
              </button>
            </div>

            <div
              className="p-6 border"
              style={{
                backgroundColor: theme.colors.light.background,
                borderColor: theme.colors.light.border,
                borderRadius: theme.radius,
              }}
            >
              <h3 className="text-lg font-semibold mb-2">Card Component</h3>
              <p style={{ color: theme.colors.light.mutedForeground }}>
                This is an example card using the background and border colors.
              </p>
            </div>

            <div
              className="p-6"
              style={{
                backgroundColor: theme.colors.light.muted,
                color: theme.colors.light.mutedForeground,
                borderRadius: theme.radius,
              }}
            >
              <p className="text-sm">
                This is a muted section showing muted background and foreground
                colors.
              </p>
            </div>

            <input
              type="text"
              placeholder="Input field example"
              className="w-full px-4 py-2 border outline-none focus:ring-2"
              style={{
                borderColor: theme.colors.light.input,
                borderRadius: theme.radius,
                backgroundColor: theme.colors.light.background,
                color: theme.colors.light.foreground,
              }}
            />
          </div>
        </div>
      </div>

      {/* Dark Mode Preview */}
      <div
        style={{
          backgroundColor: theme.colors.dark.background,
          color: theme.colors.dark.foreground,
        }}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="mb-8">
            <div
              className="inline-block px-3 py-1 mb-4 text-xs font-semibold rounded"
              style={{
                backgroundColor: theme.colors.dark.muted,
                color: theme.colors.dark.mutedForeground,
              }}
            >
              Dark Mode Preview
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">
              {theme.title}
            </h1>
            <p
              className="text-xl mb-6"
              style={{ color: theme.colors.dark.mutedForeground }}
            >
              {theme.subtitle}
            </p>
            <p
              className="text-base"
              style={{ color: theme.colors.dark.mutedForeground }}
            >
              {theme.description}
            </p>
          </div>

          <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <button
                className="w-full px-4 py-2 font-medium transition-opacity hover:opacity-90"
                style={{
                  backgroundColor: theme.colors.dark.primary,
                  color: theme.colors.dark.primaryForeground,
                  borderRadius: theme.radius,
                }}
              >
                Primary Button
              </button>

              <button
                className="w-full px-4 py-2 font-medium transition-opacity hover:opacity-90"
                style={{
                  backgroundColor: theme.colors.dark.secondary,
                  color: theme.colors.dark.secondaryForeground,
                  borderRadius: theme.radius,
                }}
              >
                Secondary Button
              </button>

              <button
                className="w-full px-4 py-2 font-medium transition-opacity hover:opacity-90"
                style={{
                  backgroundColor: theme.colors.dark.accent,
                  color: theme.colors.dark.accentForeground,
                  borderRadius: theme.radius,
                }}
              >
                Accent Button
              </button>

              <button
                className="w-full px-4 py-2 font-medium transition-opacity hover:opacity-90"
                style={{
                  backgroundColor: theme.colors.dark.destructive,
                  color: theme.colors.dark.primaryForeground,
                  borderRadius: theme.radius,
                }}
              >
                Destructive Button
              </button>
            </div>

            <div
              className="p-6 border"
              style={{
                backgroundColor: theme.colors.dark.background,
                borderColor: theme.colors.dark.border,
                borderRadius: theme.radius,
              }}
            >
              <h3 className="text-lg font-semibold mb-2">Card Component</h3>
              <p style={{ color: theme.colors.dark.mutedForeground }}>
                This is an example card using the background and border colors.
              </p>
            </div>

            <div
              className="p-6"
              style={{
                backgroundColor: theme.colors.dark.muted,
                color: theme.colors.dark.mutedForeground,
                borderRadius: theme.radius,
              }}
            >
              <p className="text-sm">
                This is a muted section showing muted background and foreground
                colors.
              </p>
            </div>

            <input
              type="text"
              placeholder="Input field example"
              className="w-full px-4 py-2 border outline-none focus:ring-2"
              style={{
                borderColor: theme.colors.dark.input,
                borderRadius: theme.radius,
                backgroundColor: theme.colors.dark.background,
                color: theme.colors.dark.foreground,
              }}
            />
          </div>
        </div>
      </div>

      {/* Color Reference */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="space-y-12">
          {/* Light Mode Colors */}
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              Light Mode Colors
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {Object.entries(theme.colors.light).map(([key, value]) => (
                <div
                  key={key}
                  className="bg-card border border-border rounded-lg p-4"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div
                      className="w-10 h-10 rounded border border-border"
                      style={{ backgroundColor: value }}
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">
                        {colorLabels[key] || key}
                      </p>
                      <code className="text-xs text-muted-foreground">
                        {value}
                      </code>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Dark Mode Colors */}
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              Dark Mode Colors
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {Object.entries(theme.colors.dark).map(([key, value]) => (
                <div
                  key={key}
                  className="bg-card border border-border rounded-lg p-4"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div
                      className="w-10 h-10 rounded border border-border"
                      style={{ backgroundColor: value }}
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">
                        {colorLabels[key] || key}
                      </p>
                      <code className="text-xs text-muted-foreground">
                        {value}
                      </code>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Border Radius */}
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              Border Radius
            </h2>
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">
                  Current Value
                </span>
                <code className="text-sm bg-muted px-3 py-1 rounded">
                  {theme.radius}
                </code>
              </div>
            </div>
          </section>

          {/* Instructions */}
          <section className="bg-muted border border-border rounded-lg p-6">
            <h3 className="text-lg font-semibold text-foreground mb-3">
              How to Update Colors
            </h3>
            <ol className="space-y-2 text-sm text-muted-foreground">
              <li>
                1. Edit the <code>config/theme.md</code> file with your desired
                hex color values
              </li>
              <li>
                2. Save the file and refresh to see the updated colors applied automatically
              </li>
              <li>
                4. Use tools like{" "}
                <a
                  href="https://oklch.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline"
                >
                  oklch.com
                </a>{" "}
                to convert hex to OKLCH format
              </li>
            </ol>
          </section>

          <div className="flex justify-center">
            <Link
              href="/"
              className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
