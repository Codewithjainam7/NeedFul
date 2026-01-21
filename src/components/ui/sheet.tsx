"use client"

import * as React from "react"
import * as SheetPrimitive from "@radix-ui/react-dialog"
import { XIcon } from "lucide-react"


import { cn } from "@/lib/utils"

function Sheet({ ...props }: React.ComponentProps<typeof SheetPrimitive.Root>) {
  return <SheetPrimitive.Root data-slot="sheet" {...props} />
}


function SheetTrigger({
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Trigger>) {
  return <SheetPrimitive.Trigger data-slot="sheet-trigger" {...props} />
}

function SheetClose({
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Close>) {
  return <SheetPrimitive.Close data-slot="sheet-close" {...props} />
}

function SheetPortal({
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Portal>) {
  return <SheetPrimitive.Portal data-slot="sheet-portal" {...props} />
}

function SheetOverlay({
  className,
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Overlay>) {
  return (
    <SheetPrimitive.Overlay
      data-slot="sheet-overlay"
      className={cn(
        "fixed inset-0 z-50 bg-black/40 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=open]:duration-200 data-[state=closed]:duration-150",
        className
      )}
      {...props}
    />
  )
}


function SheetContent({
  className,
  children,
  side = "right",
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Content> & {
  side?: "top" | "right" | "bottom" | "left"
}) {

  return (
    <SheetPortal>
      <SheetOverlay />
      <SheetPrimitive.Content
        data-slot="sheet-content"
        className={cn(
          "bg-white fixed z-50 flex flex-col shadow-2xl will-change-transform",

          // Right Side (Mobile Navbar)
          side === "right" && [
            "inset-y-0 right-0 h-full w-3/4 sm:max-w-sm",
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right",
            "data-[state=open]:duration-200 data-[state=closed]:duration-150",
            "data-[state=open]:ease-[cubic-bezier(0.16,1,0.3,1)]"
          ],

          // Left Side (Mobile Filter)
          side === "left" && [
            "inset-y-0 left-0 h-full w-[85%] sm:max-w-[320px]",
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left",
            "data-[state=open]:duration-200 data-[state=closed]:duration-150",
            "data-[state=open]:ease-[cubic-bezier(0.16,1,0.3,1)]"
          ],

          // Top/Bottom (Standard)
          (side === "top" || side === "bottom") && "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:duration-300 data-[state=closed]:duration-300",

          side === "top" &&
          "data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top inset-x-0 top-0 h-auto border-b",

          side === "bottom" &&
          "data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom inset-x-0 bottom-0 h-auto border-t",

          className
        )}
        {...props}
      >
        {/* Orange gradient border - connects to outside */}
        {side === 'right' && (
          <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b from-[#FF5200] via-orange-400 to-[#FF5200] shadow-[0_0_10px_rgba(255,82,0,0.5)]"></div>
        )}
        {side === 'left' && (
          <div className="absolute right-0 top-0 bottom-0 w-[3px] bg-gradient-to-b from-[#FF5200] via-orange-400 to-[#FF5200] shadow-[0_0_10px_rgba(255,82,0,0.5)]"></div>
        )}
        {children}
        <SheetPrimitive.Close className="absolute top-4 right-4 rounded-full p-2 opacity-70 transition-all hover:opacity-100 hover:bg-orange-50 focus:outline-none focus:ring-2 focus:ring-[#FF5200] focus:ring-offset-2 z-[60] border-2 border-[#FF5200]">
          <XIcon className="size-5 text-[#FF5200]" />
          <span className="sr-only">Close</span>
        </SheetPrimitive.Close>
      </SheetPrimitive.Content>
    </SheetPortal>
  )
}

function SheetHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sheet-header"
      className={cn("flex flex-col gap-1.5 p-4", className)}
      {...props}
    />
  )
}

function SheetFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sheet-footer"
      className={cn("mt-auto flex flex-col gap-2 p-4", className)}
      {...props}
    />
  )
}

function SheetTitle({
  className,
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Title>) {
  return (
    <SheetPrimitive.Title
      data-slot="sheet-title"
      className={cn("text-foreground font-semibold", className)}
      {...props}
    />
  )
}

function SheetDescription({
  className,
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Description>) {
  return (
    <SheetPrimitive.Description
      data-slot="sheet-description"
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  )
}

export {
  Sheet,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
}
