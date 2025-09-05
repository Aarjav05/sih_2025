"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ZoomIn, ZoomOut, Maximize2 } from "lucide-react"

export default function PreviewOverlay({ photo, captureResults, onFaceClick }) {
    const [zoom, setZoom] = useState(1)
    const [selectedFaceId, setSelectedFaceId] = useState(null)

    if (!photo) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Photo Preview</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-center p-8 text-gray-500 bg-gray-50 rounded-lg">
                        <p>Select a photo to view with face detection</p>
                    </div>
                </CardContent>
            </Card>
        )
    }

    const handleFaceClick = (faceId) => {
        setSelectedFaceId(faceId)
        onFaceClick?.(faceId)
    }

    const getConfidenceColor = (confidence) => {
        if (confidence >= 0.8) return "border-green-500 bg-green-500"
        if (confidence >= 0.5) return "border-amber-500 bg-amber-500"
        return "border-red-500 bg-red-500"
    }

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Face Detection Preview</CardTitle>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setZoom(Math.max(0.5, zoom - 0.25))}
                            disabled={zoom <= 0.5}
                        >
                            <ZoomOut className="h-4 w-4" />
                        </Button>
                        <span className="text-sm text-gray-600 min-w-[60px] text-center">{Math.round(zoom * 100)}%</span>
                        <Button variant="outline" size="sm" onClick={() => setZoom(Math.min(3, zoom + 0.25))} disabled={zoom >= 3}>
                            <ZoomIn className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => setZoom(1)}>
                            <Maximize2 className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="relative overflow-auto max-h-96 bg-gray-50 rounded-lg">
                    <div
                        className="relative inline-block min-w-full"
                        style={{
                            transform: `scale(${zoom})`,
                            transformOrigin: "top left",
                        }}
                    >
                        {/* Main Photo */}
                        <img
                            src={photo.url || "/placeholder.svg"}
                            alt={photo.name}
                            className="w-full h-auto block"
                            style={{ maxWidth: "none" }}
                        />

                        {/* Face Bounding Boxes */}
                        {captureResults?.map((result) => {
                            const isSelected = selectedFaceId === result.face_id
                            const confidenceColor = getConfidenceColor(result.confidence)

                            return (
                                <div
                                    key={result.face_id}
                                    className={`
                    absolute border-2 cursor-pointer transition-all duration-200
                    ${isSelected ? "border-purple-500 shadow-lg" : confidenceColor}
                    hover:shadow-lg hover:scale-105
                  `}
                                    style={{
                                        left: `${result.bbox.x}px`,
                                        top: `${result.bbox.y}px`,
                                        width: `${result.bbox.w}px`,
                                        height: `${result.bbox.h}px`,
                                    }}
                                    onClick={() => handleFaceClick(result.face_id)}
                                    title={
                                        result.matched_student_name
                                            ? `${result.matched_student_name} (${Math.round(result.confidence * 100)}%)`
                                            : `Unmatched face (${Math.round(result.confidence * 100)}%)`
                                    }
                                >
                                    {/* Confidence Badge */}
                                    <div
                                        className={`
                      absolute -top-6 left-0 px-2 py-1 text-xs text-white rounded-t
                      ${confidenceColor.replace("border-", "bg-")}
                    `}
                                    >
                                        {Math.round(result.confidence * 100)}%
                                    </div>

                                    {/* Student Name Badge */}
                                    {result.matched_student_name && (
                                        <div className="absolute -bottom-6 left-0 right-0 bg-gray-900 text-white text-xs px-2 py-1 rounded-b truncate">
                                            {result.matched_student_name}
                                        </div>
                                    )}

                                    {/* Selection Indicator */}
                                    {isSelected && (
                                        <div className="absolute inset-0 bg-purple-500 bg-opacity-20 flex items-center justify-center">
                                            <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                                        </div>
                                    )}
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* Legend */}
                <div className="mt-4 flex flex-wrap gap-4 text-sm">
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-green-500 rounded"></div>
                        <span>High Confidence (≥80%)</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-amber-500 rounded"></div>
                        <span>Medium Confidence (50-79%)</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-red-500 rounded"></div>
                        <span>Low Confidence (&lt;50%)</span>
                    </div>
                </div>

                {/* Photo Info */}
                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <span className="font-medium">Photo:</span> {photo.name}
                        </div>
                        <div>
                            <span className="font-medium">Faces Detected:</span> {captureResults?.length || 0}
                        </div>
                        <div>
                            <span className="font-medium">Size:</span> {(photo.size / 1024 / 1024).toFixed(1)} MB
                        </div>
                        <div>
                            <span className="font-medium">Matched:</span>{" "}
                            {captureResults?.filter((r) => r.matched_student_id).length || 0}
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}