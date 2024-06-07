import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import React from "react"


export default function StyledTooltip({ 
  text, children
} : {
  text: string,
  children: React.ReactNode
}) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          { children }
        </TooltipTrigger>
        <TooltipContent className="mb-1">
          <p>{ text }</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}