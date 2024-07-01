import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { Icon } from "@/components/shared/icon"
import React from "react";
import { useState, useEffect } from "react";


export interface HeaderBreadcrumbLink {
  name: string;
  href: string;
}


export const HeaderHeight = 65


export function Header({ 
  links 
} : { 
  links: HeaderBreadcrumbLink[] 
}) {

  const [isScrolled, setIsScrolled] = useState(false)

  // Add a shadow when the user scrolls
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
    <header className={`flex z-50 bg-white items-center sticky top-0 py-5 px-5 h-[${HeaderHeight}px] transition-shadow ${isScrolled ? 'shadow' : ''}`}>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">
              <div className="flex gap-x-1 items-center">
                <Icon width={25} height={25} />
                <span className="font-medium">Open Tutor</span>
              </div>
            </BreadcrumbLink>
          </BreadcrumbItem>
          { 
            links.map(link =>
              <React.Fragment key={link.href}>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink href={link.href}>
                    { link.name }
                  </BreadcrumbLink>
                </BreadcrumbItem>
              </React.Fragment>
            )
          }
        </BreadcrumbList>
      </Breadcrumb>
    </header>
  )
}