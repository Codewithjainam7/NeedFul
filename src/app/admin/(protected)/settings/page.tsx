'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { toast } from 'sonner'
import { Loader2, Save, Globe, Lock, Bell, Shield, Mail } from 'lucide-react'
import { AdminPageTransition } from '@/components/admin/AdminPageTransition'

export default function SettingsPage() {
    const [loading, setLoading] = useState(false)

    const handleSave = async () => {
        setLoading(true)
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000))
        setLoading(false)
        toast.success('Settings saved successfully')
    }

    return (
        <AdminPageTransition>
            <div className="max-w-4xl space-y-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">Settings</h1>
                    <p className="text-muted-foreground mt-1">Manage your admin preferences and platform configurations.</p>
                </div>

                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm divide-y divide-gray-100 overflow-hidden">
                    {/* General Settings */}
                    <div className="p-8 space-y-6">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="p-3 bg-orange-100 rounded-xl text-[#FF5200]">
                                <Globe className="h-6 w-6" />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-gray-900">General</h2>
                                <p className="text-sm text-gray-500">Basic platform information</p>
                            </div>
                        </div>

                        <div className="grid gap-5 md:grid-cols-2">
                            <div className="grid gap-2">
                                <Label htmlFor="site-name" className="text-gray-700 font-medium">Platform Name</Label>
                                <Input id="site-name" defaultValue="NeedFul" className="border-gray-200 focus:border-[#FF5200] focus:ring-[#FF5200]/30 rounded-xl h-11" />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="support-email" className="text-gray-700 font-medium">Support Email</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <Input id="support-email" defaultValue="support@needful.com" className="pl-9 border-gray-200 focus:border-[#FF5200] focus:ring-[#FF5200]/30 rounded-xl h-11" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Notifications */}
                    <div className="p-8 space-y-6">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="p-3 bg-blue-50 rounded-xl text-blue-600">
                                <Bell className="h-6 w-6" />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-gray-900">Notifications</h2>
                                <p className="text-sm text-gray-500">Control what alerts you receive</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                                <div className="space-y-0.5">
                                    <Label className="text-base font-semibold text-gray-900">Email Alerts</Label>
                                    <p className="text-sm text-gray-500">Receive emails about new business registrations</p>
                                </div>
                                <Switch defaultChecked />
                            </div>
                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                                <div className="space-y-0.5">
                                    <Label className="text-base font-semibold text-gray-900">Review Notifications</Label>
                                    <p className="text-sm text-gray-500">Get notified when negative reviews are posted</p>
                                </div>
                                <Switch />
                            </div>
                        </div>
                    </div>

                    {/* Security */}
                    <div className="p-8 space-y-6">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="p-3 bg-red-50 rounded-xl text-red-600">
                                <Shield className="h-6 w-6" />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-gray-900">Security</h2>
                                <p className="text-sm text-gray-500">Platform protection settings</p>
                            </div>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-red-50/50 border border-red-100 rounded-xl">
                            <div className="space-y-0.5">
                                <Label className="text-base font-semibold text-gray-900">Maintenance Mode</Label>
                                <p className="text-sm text-gray-500">Disable platform access during updates</p>
                            </div>
                            <Switch />
                        </div>
                    </div>

                    <div className="p-6 bg-gray-50 flex justify-end">
                        <Button onClick={handleSave} disabled={loading} className="min-w-[140px] h-11 bg-[#FF5200] hover:bg-[#E04800] text-white font-bold rounded-xl shadow-lg shadow-orange-500/20 transition-all active:scale-95">
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Save className="mr-2 h-4 w-4" />
                                    Save Changes
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </div>
        </AdminPageTransition>
    )
}
