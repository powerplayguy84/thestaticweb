import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRight01Icon, Home01Icon } from "@hugeicons/core-free-icons";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export default function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className={className} data-no-search-highlight>
      <ol className="flex items-center gap-2 text-sm text-muted-foreground list-none ml-0">
        <li className="m-0">
          <Link
            href="/"
            className="hover:text-foreground active:scale-95 transition-all flex items-center gap-1"
            aria-label="Home"
          >
            <HugeiconsIcon icon={Home01Icon} className="w-4 h-4" />
            <span className="sr-only">Home</span>
          </Link>
        </li>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={index} className="flex items-center gap-2 m-0">
              <HugeiconsIcon
                icon={ArrowRight01Icon}
                className="w-3.5 h-3.5 text-muted-foreground/70"
                aria-hidden="true"
              />
              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className="hover:text-foreground transition-colors capitalize truncate max-w-32"
                  title={item.label}
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  className={`capitalize truncate max-w-32 ${
                    isLast ? "text-foreground font-medium" : ""
                  }`}
                  aria-current={isLast ? "page" : undefined}
                  title={item.label}
                >
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
