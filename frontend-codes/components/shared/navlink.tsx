
"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { forwardRef, type ComponentPropsWithoutRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface NavLinkProps extends Omit<ComponentPropsWithoutRef<typeof Link>, "className"> {
  children: ReactNode;
  activeClassName?: string;
  className?: string; // allow string
}

const NavLink = forwardRef<HTMLAnchorElement, NavLinkProps>(({
  href,
  children,
  activeClassName,
  className,
  ...props
}, ref) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      ref={ref}
      href={href}
      className={cn(className, isActive && activeClassName)}
      {...props}
    >
      {children}
    </Link>
  );
});

NavLink.displayName = "NavLink";

export default NavLink;