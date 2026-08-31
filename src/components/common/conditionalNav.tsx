"use client";

import { usePathname } from "next/navigation";
import {Navbar} from "@/components/common/navbar";
import {Footer} from "@/components/common/footer";

export function ConditionalNavigation({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const isAdmin = pathname.startsWith("/admin");

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      <Navbar />

      {children}

      <Footer />
    </>
  );
}