'use client'

import { useState } from 'react'
import { PlusCircle, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { StoryCreator } from './StoryCreator'

interface StoryCreatorButtonProps {
    providerId: string
    providerName: string
}

export function StoryCreatorButton({ providerId, providerName }: StoryCreatorButtonProps) {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <>
            <Button
                onClick={() => setIsOpen(true)}
                className="w-full justify-start gap-2 bg-gradient-to-r from-[#FF5200] to-orange-500 hover:from-[#E04800] hover:to-orange-600 text-white"
            >
                <PlusCircle className="h-4 w-4" />
                <span>Create Story</span>
                <Sparkles className="h-3 w-3 ml-auto" />
            </Button>

            {isOpen && (
                <StoryCreator
                    providerId={providerId}
                    providerName={providerName}
                    onClose={() => setIsOpen(false)}
                    onSuccess={() => setIsOpen(false)}
                />
            )}
        </>
    )
}
