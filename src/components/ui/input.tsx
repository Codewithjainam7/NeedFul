import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-muted-foreground/70 selection:bg-orange-100 selection:text-orange-900 dark:bg-input/30 border-gray-200 h-11 w-full min-w-0 rounded-xl border-2 bg-gray-50/50 px-4 py-2 text-base shadow-sm transition-all duration-300 ease-out outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        "focus:border-[#FF5200] focus:bg-white focus:ring-4 focus:ring-orange-100 focus:-translate-y-0.5 focus:shadow-md",
        "hover:border-orange-200 hover:bg-white",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        className
      )}
      {...props}
    />
  )
}

export { Input }
