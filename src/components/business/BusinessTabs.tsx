'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent } from '@/components/ui/card'
import { QuickInfo } from './QuickInfo'
import { ReviewSection } from './ReviewSection'
import { cn } from '@/lib/utils'

interface BusinessTabsProps {
    provider: any
}

// Tabs defined inside component for dynamic labels

export function BusinessTabs({ provider }: BusinessTabsProps) {
    const [activeTab, setActiveTab] = useState('overview')

    const isDining = provider.categories?.name?.toLowerCase().includes('restaurant') ||
        provider.categories?.name?.toLowerCase().includes('food') ||
        provider.categories?.name?.toLowerCase().includes('cafe') ||
        provider.categories?.name?.toLowerCase().includes('dining');

    const menuLabel = isDining ? "Menu" : "Services";
    const menuTitle = isDining ? "Menu & Pricing" : "Services & Offerings";

    const tabs = [
        { id: 'overview', label: 'Overview' },
        { id: 'menu', label: menuLabel },
        { id: 'quick-info', label: 'Quick Info' },
        { id: 'reviews', label: 'Reviews' },
        { id: 'photos', label: 'Photos' }
    ]

    return (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full overflow-visible">
            <div className="sticky top-[72px] md:top-[96px] z-40 bg-white shadow-sm border-b border-gray-100 transition-all duration-300">
                <TabsList className="w-full justify-start h-auto p-0 bg-transparent gap-8 overflow-x-auto scrollbar-hide px-2">
                    {tabs.map((tab) => (
                        <TabsTrigger
                            key={tab.id}
                            value={tab.id}
                            className="relative rounded-none border-b-0 px-2 py-4 font-bold text-gray-500 hover:text-gray-900 data-[state=active]:text-[#FF5200] data-[state=active]:shadow-none transition-colors bg-transparent"
                        >
                            <span className="relative z-10">{tab.label}</span>
                            {activeTab === tab.id && (
                                <motion.div
                                    layoutId="activeTab"
                                    className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#FF5200] rounded-t-full"
                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                />
                            )}
                        </TabsTrigger>
                    ))}
                </TabsList>
            </div>

            <div className="mt-6">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                    >
                        <TabsContent value="overview" className="space-y-8 mt-0 text-left">
                            <Card className="border-orange-100 shadow-sm overflow-hidden">
                                <CardContent className="p-6 sm:p-8">
                                    <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                        About {provider.business_name}
                                    </h2>
                                    <p className="text-gray-700 leading-relaxed text-base">
                                        {provider.description || "No description available for this business."}
                                    </p>
                                </CardContent>
                            </Card>

                            <QuickInfo provider={provider} />

                            <div id="reviews-section" className="scroll-mt-24">
                                <Card className="border-orange-100 shadow-sm overflow-hidden">
                                    <CardContent className="p-6 sm:p-8">
                                        <h2 className="text-xl font-bold text-gray-900 mb-6">Reviews & Ratings</h2>
                                        <ReviewSection providerId={provider.id} />
                                    </CardContent>
                                </Card>
                            </div>
                        </TabsContent>

                        <TabsContent value="menu" className="mt-0">
                            <Card className="border-orange-100 shadow-sm">
                                <CardContent className="p-6 sm:p-8">
                                    <h2 className="text-xl font-bold text-gray-900 mb-6">{menuTitle}</h2>
                                    {provider.services && provider.services.length > 0 ? (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {provider.services.map((service: any) => (
                                                <div key={service.id} className="border border-gray-100 rounded-lg p-4 hover:border-orange-200 transition-colors bg-white hover:shadow-sm">
                                                    <div className="flex justify-between items-start gap-4">
                                                        <div>
                                                            <h4 className="font-bold text-gray-900 text-lg">{service.title}</h4>
                                                            {service.description && (
                                                                <p className="text-sm text-gray-600 mt-1 line-clamp-2">{service.description}</p>
                                                            )}
                                                        </div>
                                                        {service.price && (
                                                            <span className="font-bold text-orange-600 bg-orange-50 px-3 py-1 rounded-md text-sm shrink-0 whitespace-nowrap">
                                                                ₹{service.price}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center text-gray-500 py-12 bg-gray-50 rounded-xl">
                                            <p>No menu items listed for this business.</p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="quick-info" className="mt-0">
                            <QuickInfo provider={provider} />
                        </TabsContent>

                        <TabsContent value="reviews" className="mt-0">
                            <Card className="border-orange-100 shadow-sm">
                                <CardContent className="p-6 sm:p-8">
                                    <ReviewSection providerId={provider.id} />
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="photos" className="mt-0">
                            <Card className="border-orange-100 shadow-sm">
                                <CardContent className="p-6 sm:p-8 text-center text-gray-500">
                                    Photos placeholder
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </motion.div>
                </AnimatePresence>
            </div>
        </Tabs>
    )
}
