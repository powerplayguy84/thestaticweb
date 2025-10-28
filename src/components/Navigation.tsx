import Link from "next/link";
import { getCategories } from "@/lib/markdown";

export default function Navigation() {
  const categories = getCategories();

  return (
    <nav className="flex items-center gap-8 px-6 py-4 border-b border-slate-200">
      <Link href="/" className="text-xl font-bold text-slate-900">
        The Static Web
      </Link>
      <div className="flex items-center gap-6">
        {categories.map((category) => (
          <Link
            key={category}
            href={`/${category}`}
            className="text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors capitalize"
          >
            {category}
          </Link>
        ))}
      </div>
    </nav>
  );
}
