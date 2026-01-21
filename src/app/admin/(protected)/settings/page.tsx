'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { toast } from 'sonner'
import { Loader2, Save, Globe, Lock, Bell, Mail } from 'lucide-react'

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
        <div className="max-w-4xl space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
                <p className="text-muted-foreground">Manage your admin preferences and platform configurations.</p>
            </div>

            <div className="bg-white rounded-xl border shadow-sm divide-y">
                {/* General Settings */}
                <div className="p-6 space-y-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-orange-100 rounded-lg text-primary">
                            <Globe className="h-5 w-5" />
                        </div>
                        <h2 className="text-lg font-semibold">General</h2>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="site-name">Platform Name</Label>
                        <Input id="site-name" defaultValue="NeedFul" />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="support-email">Support Email</Label>
                        <Input id="support-email" defaultValue="support@needful.com" />
                    </div>
                </div>

                {/* Notifications */}
                <div className="p-6 space-y-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                            <Bell className="h-5 w-5" />
                        </div>
                        <h2 className="text-lg font-semibold">Notifications</h2>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label className="text-base">Email Alerts</Label>
                            <p className="text-sm text-gray-500">Receive emails about new business registrations</p>
                        </div>
                        <Switch defaultChecked />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label className="text-base">Review Notifications</Label>
                            <p className="text-sm text-gray-500">Get notified when negative reviews are posted</p>
                        </div>
                        <Switch />
                    </div>
                </div>

                {/* Security */}
                <div className="p-6 space-y-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-green-100 rounded-lg text-green-600">
                            <Lock className="h-5 w-5" />
                        </div>
                        <h2 className="text-lg font-semibold">Security</h2>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label className="text-base">Maintenance Mode</Label>
                            <p className="text-sm text-gray-500">Disable safe mode to prevent user access during updates</p>
                        </div>
                        <Switch />
                    </div>
                </div>

                <div className="p-6 bg-gray-50 rounded-b-xl flex justify-end">
                    <Button onClick={handleSave} disabled={loading} className="min-w-[120px]">
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
    )
}
