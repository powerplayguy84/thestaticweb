"use client";

import { usePathname } from "next/navigation";
import { type ReactNode } from "react";

export function NavbarWrapper({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isDiagramPage = pathname.startsWith("/diagram");
  const isPresentationPage = pathname.startsWith("/presentation");
  const isAdminPage = pathname.startsWith("/admin");

  if (isDiagramPage || isPresentationPage || isAdminPage) {
    return null;
  }

  return <>{children}</>;
}
