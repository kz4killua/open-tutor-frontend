import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { Icon } from "@/components/shared/icon"
import React from "react";
import { useState, useEffect } from "react";
import clsx from "clsx";
import Link from "next/link";
import Container from "./container";


export interface HeaderBreadcrumbLink {
  name: string;
  href: string;
}


export function Header({ 
  links, className
} : { 
  links: HeaderBreadcrumbLink[],
  className?: string
}) {

  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40)
    }
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    }
  }, [])

  return (
    <header 
      className={clsx(
        `z-50 bg-background sticky top-0 transition-shadow`,
        isScrolled && 'shadow',
        className
      )}
    >
      <Container className="flex h-20 items-center">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <Link href="/" className="text-foreground">
                <div className="flex gap-x-1 items-center">
                  <Icon width={25} height={25} />
                  <span className="font-medium">Open Tutor</span>
                </div>
              </Link>
            </BreadcrumbItem>
            { 
              links.map(link =>
                <React.Fragment key={link.href}>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <Link href={link.href} className="transition-colors hover:text-foreground">
                      { link.name }
                    </Link>
                  </BreadcrumbItem>
                </React.Fragment>
              )
            }
          </BreadcrumbList>
        </Breadcrumb>
      </Container>
    </header>
  )
}