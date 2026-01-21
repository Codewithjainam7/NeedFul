'use client'

import * as React from 'react'
import { Check, ChevronsUpDown, MapPin, Search } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { mumbaiLocations } from '@/data/mumbai-locations'

interface LocationAutocompleteProps {
    value: string
    onChange: (value: string) => void
    className?: string
    placeholder?: string
}

export function LocationAutocomplete({
    value,
    onChange,
    className,
    placeholder = "Select area..."
}: LocationAutocompleteProps) {
    const [open, setOpen] = React.useState(false)
    const [inputValue, setInputValue] = React.useState("")
    const dropdownRef = React.useRef<HTMLDivElement>(null)

    const filteredLocations = mumbaiLocations.filter((loc) =>
        loc.toLowerCase().includes(inputValue.toLowerCase())
    )

    // Close click outside
    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setOpen(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    return (
        <div className="relative w-full" ref={dropdownRef}>
            <Button
                type="button"
                variant="outline"
                role="combobox"
                aria-expanded={open}
                onClick={() => setOpen(!open)}
                className={cn("w-full justify-between h-12 rounded-xl bg-gray-50 border-gray-200 hover:bg-white hover:border-orange-500 transition-all text-left font-normal", !value && "text-muted-foreground", className)}
            >
                {value ? value : placeholder}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>

            {open && (
                <div className="absolute top-full mt-2 left-0 w-full z-50 rounded-md border bg-white shadow-xl max-h-[350px] overflow-hidden flex flex-col animate-in fade-in-0 zoom-in-95">
                    <div className="flex items-center border-b px-3 py-2">
                        <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                        <input
                            className="flex h-9 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
                            placeholder="Search area..."
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            autoFocus
                        />
                    </div>
                    <div className="flex-1 overflow-y-auto p-1 max-h-[300px]">
                        {filteredLocations.length === 0 && (
                            <div className="py-6 text-center text-sm">
                                <p className="text-gray-500 mb-2">No area found.</p>
                                <button
                                    type="button"
                                    className="text-orange-600 hover:underline font-medium bg-orange-50 px-3 py-1.5 rounded-md text-xs"
                                    onClick={() => {
                                        onChange(inputValue)
                                        setOpen(false)
                                    }}
                                >
                                    Use "{inputValue}"
                                </button>
                            </div>
                        )}
                        {filteredLocations.map((location) => (
                            <div
                                key={location}
                                className={cn(
                                    "relative flex cursor-pointer select-none items-center rounded-sm px-2 py-2 text-sm outline-none hover:bg-orange-50 hover:text-orange-900 transition-colors",
                                    value === location ? "bg-orange-50 text-orange-900" : ""
                                )}
                                onClick={() => {
                                    onChange(location)
                                    setOpen(false)
                                }}
                            >
                                <MapPin className="mr-2 h-4 w-4 text-orange-500" />
                                {location}
                                {value === location && (
                                    <Check className="ml-auto h-4 w-4 text-orange-600" />
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}
