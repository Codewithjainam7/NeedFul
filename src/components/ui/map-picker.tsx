'use client'

import React, { useState, useEffect, useRef, useMemo } from 'react'
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet'
import L from 'leaflet'
import { Button } from '@/components/ui/button'
import { MapPin, Loader2 } from 'lucide-react'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog'

// Fix for default marker icon in Leaflet with Next.js
const iconUrl = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png';
const iconRetinaUrl = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png';
const shadowUrl = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png';

const customIcon = new L.Icon({
    iconUrl: iconUrl,
    iconRetinaUrl: iconRetinaUrl,
    shadowUrl: shadowUrl,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

interface MapPickerProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: (location: { address: string, lat: number, lng: number }) => void
    initialLat?: number
    initialLng?: number
}

// Center component to update map view when props change
function ChangeView({ center }: { center: [number, number] }) {
    const map = useMapEvents({});
    useEffect(() => {
        map.setView(center, map.getZoom());
    }, [center, map]);
    return null;
}

function DraggableMarker({ position, setPosition, setAddress, setIsLoadingAddress }: any) {
    const markerRef = useRef<L.Marker>(null)

    const eventHandlers = useMemo(
        () => ({
            dragend() {
                const marker = markerRef.current
                if (marker) {
                    const newPos = marker.getLatLng()
                    setPosition(newPos)
                    fetchAddress(newPos.lat, newPos.lng)
                }
            },
        }),
        [setPosition, setAddress, setIsLoadingAddress],
    )

    const fetchAddress = async (lat: number, lng: number) => {
        setIsLoadingAddress(true)
        try {
            const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`)
            const data = await response.json()
            if (data && data.display_name) {
                setAddress(data.display_name)
            }
        } catch (error) {
            console.error("Failed to fetch address:", error)
        } finally {
            setIsLoadingAddress(false)
        }
    }

    return (
        <Marker
            draggable={true}
            eventHandlers={eventHandlers}
            position={position}
            ref={markerRef}
            icon={customIcon}
        >
        </Marker>
    )
}

export default function MapPicker({ isOpen, onClose, onConfirm, initialLat = 19.0760, initialLng = 72.8777 }: MapPickerProps) {
    const [position, setPosition] = useState<L.LatLng>(new L.LatLng(initialLat, initialLng))
    const [address, setAddress] = useState<string>('')
    const [isLoadingAddress, setIsLoadingAddress] = useState(false)

    // Reset position when modal opens
    useEffect(() => {
        if (isOpen) {
            setPosition(new L.LatLng(initialLat, initialLng))
        }
    }, [isOpen, initialLat, initialLng])

    const handleConfirm = () => {
        onConfirm({
            address,
            lat: position.lat,
            lng: position.lng
        })
        onClose()
    }

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-[800px] h-[90vh] sm:h-[600px] flex flex-col p-0 gap-0 overflow-hidden">
                <DialogHeader className="p-4 bg-white border-b z-10">
                    <DialogTitle className="flex items-center gap-2">
                        <MapPin className="text-orange-500 w-5 h-5" />
                        Pick Location
                    </DialogTitle>
                    <p className="text-sm text-gray-500">
                        Drag the marker to pinpoint your exact business location.
                    </p>
                </DialogHeader>

                <div className="flex-1 relative bg-gray-100">
                    {/* Map */}
                    <MapContainer
                        center={[initialLat, initialLng]}
                        zoom={13}
                        scrollWheelZoom={true}
                        style={{ height: "100%", width: "100%" }}
                    >
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <DraggableMarker
                            position={position}
                            setPosition={setPosition}
                            setAddress={setAddress}
                            setIsLoadingAddress={setIsLoadingAddress}
                        />
                        <ChangeView center={[position.lat, position.lng]} />
                    </MapContainer>

                    {/* Address Overlay */}
                    <div className="absolute top-4 left-4 right-4 z-[400] bg-white/90 backdrop-blur-md p-3 rounded-lg shadow-lg border border-orange-100">
                        <div className="text-xs font-bold text-gray-500 uppercase mb-1">Selected Location</div>
                        {isLoadingAddress ? (
                            <div className="flex items-center gap-2 text-orange-600 font-medium">
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Fetching address...
                            </div>
                        ) : (
                            <div className="text-gray-900 font-medium text-sm line-clamp-2">
                                {address || "Drag marker to select address"}
                            </div>
                        )}
                        <div className="text-xs text-gray-400 mt-1 font-mono">
                            {position.lat.toFixed(6)}, {position.lng.toFixed(6)}
                        </div>
                    </div>
                </div>

                <DialogFooter className="p-4 bg-white border-t z-10">
                    <Button variant="outline" onClick={onClose} className="border-gray-200">Cancel</Button>
                    <Button
                        onClick={handleConfirm}
                        className="bg-[#FF5200] hover:bg-[#ff6a22] text-white"
                        disabled={!address && !isLoadingAddress} // Still allow confirm if address fetch fails but lat/lng is there? Maybe better to warn.
                    >
                        Confirm Location
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
