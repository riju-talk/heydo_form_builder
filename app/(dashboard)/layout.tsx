import Logo from "@/components/Logo";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import { Button } from "@/components/ui/button";
import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import React, { ReactNode } from "react";
// import { useRouter } from "next/navigation";

function Layout({ children }: { children: ReactNode }) {
  // const router = useRouter();
  return (
    <div className="flex flex-col min-h-screen min-w-full bg-background max-h-screen">
      <nav className="flex justify-between items-center border-b border-border h-[60px] px-4 py-2">
        <Logo />
        <div className="flex gap-4 items-center justify-between lg:w-1/3">
          <Button   asChild className="w-full  text-sm ">
            <Link href={`/portalCreds`}>Set Portal Credentials</Link>
          </Button>
          
          <Button asChild className="w-full  text-sm">
            <Link href={`/appIdpass`}>Set App Credentials</Link>
          </Button>
          <ThemeSwitcher />
          <UserButton afterSignOutUrl="/sign-in" />
        </div>
      </nav>
      <main className="flex w-full flex-grow">{children}</main>
    </div>
  );
}

export default Layout;
