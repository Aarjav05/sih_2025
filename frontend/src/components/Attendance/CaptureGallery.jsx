"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Eye, RotateCcw, Trash2, ImageIcon } from "lucide-react"

export default function CaptureGallery({ photos, selectedPhoto, onPhotoSelect, onRetakePhoto, onRemovePhoto }) {
    if (!photos || photos.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Uploaded Photos</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-center p-8 text-gray-500">
                        <div className="text-center">
                            <ImageIcon className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                            <p>No photos uploaded yet</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-lg">Uploaded Photos ({photos.length})</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {photos.map((photo) => (
                        <div
                            key={photo.id}
                            className={`
                relative group cursor-pointer rounded-lg overflow-hidden border-2 transition-all
                ${selectedPhoto?.id === photo.id ? "border-purple-500 ring-2 ring-purple-200" : "border-gray-200 hover:border-purple-300"}
              `}
                            onClick={() => onPhotoSelect(photo)}
                        >
                            {/* Photo Thumbnail */}
                            <div className="aspect-square bg-gray-100">
                                <img
                                    src={photo.url || "/placeholder.svg"}
                                    alt={photo.name}
                                    className="w-full h-full object-cover"
                                    loading="lazy"
                                />
                            </div>

                            {/* Overlay with Actions */}
                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center">
                                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-1">
                                    <Button
                                        size="sm"
                                        variant="secondary"
                                        className="h-8 w-8 p-0 bg-white hover:bg-gray-100"
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            onPhotoSelect(photo)
                                        }}
                                        title="View Photo"
                                    >
                                        <Eye className="h-3 w-3" />
                                    </Button>

                                    <Button
                                        size="sm"
                                        variant="secondary"
                                        className="h-8 w-8 p-0 bg-white hover:bg-gray-100"
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            onRetakePhoto(photo.id)
                                        }}
                                        title="Retake Photo"
                                    >
                                        <RotateCcw className="h-3 w-3" />
                                    </Button>

                                    <Button
                                        size="sm"
                                        variant="destructive"
                                        className="h-8 w-8 p-0"
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            onRemovePhoto(photo.id)
                                        }}
                                        title="Remove Photo"
                                    >
                                        <Trash2 className="h-3 w-3" />
                                    </Button>
                                </div>
                            </div>

                            {/* Selected Indicator */}
                            {selectedPhoto?.id === photo.id && (
                                <div className="absolute top-2 right-2 w-4 h-4 bg-purple-500 rounded-full flex items-center justify-center">
                                    <div className="w-2 h-2 bg-white rounded-full"></div>
                                </div>
                            )}

                            {/* Photo Info */}
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-2">
                                <p className="text-white text-xs truncate">{photo.name}</p>
                                <p className="text-white text-xs opacity-75">{(photo.size / 1024 / 1024).toFixed(1)} MB</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Gallery Actions */}
                <div className="mt-4 flex flex-wrap gap-2 justify-center">
                    <Button
                        variant="outline"
                        size="sm"
                        className="bg-transparent"
                        onClick={() => {
                            // Mock functionality - would trigger file picker for additional photos
                            console.log("[v0] Adding more photos...")
                        }}
                    >
                        Add More Photos
                    </Button>

                    <Button
                        variant="outline"
                        size="sm"
                        className="bg-transparent"
                        onClick={() => {
                            // Mock functionality - would clear all photos
                            if (confirm("Remove all photos? This will reset the session.")) {
                                photos.forEach((photo) => onRemovePhoto(photo.id))
                            }
                        }}
                    >
                        Clear All
                    </Button>
                </div>

                {/* Tips */}
                <div className="mt-4 p-3 bg-purple-50 rounded-lg">
                    <p className="text-sm text-purple-800">
                        <strong>Tip:</strong> Click on a photo to view it with face detection overlays. Use the action buttons to
                        retake or remove individual photos.
                    </p>
                </div>
            </CardContent>
        </Card>
    )
}