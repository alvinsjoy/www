'use client';

import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import ThemeSwitch from '@/components/theme-switch';
import AudioToggle from '@/components/audio-toggle';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  LuChevronDown,
  LuLayoutDashboard,
  LuLogIn,
  LuLogOut,
  LuHouse,
} from 'react-icons/lu';

export default function NavBar() {
  const { data: session, status } = useSession();
  const pathname = usePathname();

  return (
    <div className="relative mb-6 w-full md:mb-8">
      <h1 className="from-primary to-accent-foreground bg-gradient-to-r bg-clip-text text-center text-4xl font-bold text-transparent">
        Traffic Sign Recognition
      </h1>
      <div className="absolute top-1 flex w-full justify-between md:top-0">
        <div className="flex items-center gap-2">
          <ThemeSwitch />
          <AudioToggle />
        </div>

        <div>
          {status === 'authenticated' ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-1"
                >
                  <span>{session.user.name || session.user.email}</span>
                  <LuChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  {pathname === '/dashboard' ? (
                    <Link href="/" className="flex items-center gap-2">
                      <LuHouse className="h-4 w-4" />
                      <span>Home</span>
                    </Link>
                  ) : (
                    <Link href="/dashboard" className="flex items-center gap-2">
                      <LuLayoutDashboard className="h-4 w-4" />
                      <span>Dashboard</span>
                    </Link>
                  )}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="text-destructive flex items-center gap-2"
                >
                  <LuLogOut className="h-4 w-4" />
                  <span>Sign Out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/signin" className="flex items-center gap-1">
                  <LuLogIn className="h-4 w-4" />
                  <span>Sign In</span>
                </Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
