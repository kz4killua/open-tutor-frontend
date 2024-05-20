import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { Icon } from "@/components/blocks/icon"
import React from "react";


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
  return (
    <header className={`flex items-center py-5 px-5 h-[${HeaderHeight}px]`}>
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