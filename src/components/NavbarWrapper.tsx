"use client";

import { usePathname } from "next/navigation";
import { type ReactNode } from "react";

export function NavbarWrapper({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isDiagramPage = pathname.startsWith("/diagram");

  if (isDiagramPage) {
    return null;
  }

  return <>{children}</>;
}
