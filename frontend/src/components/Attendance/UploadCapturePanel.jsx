import { useState, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Upload, Camera, ImageIcon, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

import { useTranslation } from 'react-i18next';


//converting to base64
const toBase64 = (file) =>
    new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => resolve(reader.result)
        reader.onerror = (error) => reject(error)
    })

export default function UploadCapturePanel({ onPhotosUploaded, selectedClass }) {

    const { t } = useTranslation();

    const [isDragging, setIsDragging] = useState(false)
    const [showCameraInfo, setShowCameraInfo] = useState(false)
    const fileInputRef = useRef(null)

    const handleFileSelect = async (files) => {
        if (!selectedClass) {
            alert("Please select a class first")
            return
        }

        const validFiles = Array.from(files).filter((file) => file.type.startsWith("image/"))

        if (validFiles.length === 0) {
            alert("Please select valid image files")
            return
        }

        // Convert all valid files to photo objects with base64 strings
        const photos = await Promise.all(
            validFiles.map(async (file, index) => {
                const base64 = await toBase64(file)
                return {
                    id: `p${Date.now()}_${index}`,
                    file,
                    url: URL.createObjectURL(file), // for preview
                    name: file.name,
                    size: file.size,
                    base64, // base64 image string for API usage
                }
            })
        )


        onPhotosUploaded(photos)
    }

    const handleDrop = (e) => {
        e.preventDefault()
        setIsDragging(false)
        handleFileSelect(e.dataTransfer.files)
    }

    const handleDragOver = (e) => {
        e.preventDefault()
        setIsDragging(true)
    }

    const handleDragLeave = (e) => {
        e.preventDefault()
        setIsDragging(false)
    }

    const handleUploadClick = () => {
        fileInputRef.current?.click()
    }

    const handleCameraClick = () => {
        setShowCameraInfo(true)
        setTimeout(() => setShowCameraInfo(false), 3000)
    }

    return (
        <div className="space-y-6">
            {!selectedClass && (
                <Alert className="shadow-lg">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>Please select a class before uploading photos.</AlertDescription>
                </Alert>
            )}

            {/* Upload Area */}
            <Card className="relative  transition-all ease-in shadow-md hover:shadow-xl">
                <CardHeader>
                    <CardTitle className="text-xl">Capture Attendance</CardTitle>
                </CardHeader>
                <CardContent>
                    <div
                        className={`
              border-2 border-dashed rounded-lg p-8 text-center transition-colors
              ${isDragging ? "border-purple-400 bg-purple-50" : "border-gray-300 hover:border-purple-400"}
              ${!selectedClass ? "opacity-50 pointer-events-none" : ""}
            `}
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                    >
                        <div className="space-y-4">
                            <div className="flex justify-center">
                                <ImageIcon className="h-12 w-12 text-gray-400" />
                            </div>

                            <div>
                                <h3 className="text-lg font-medium text-gray-900 mb-2">Upload Class Photos</h3>
                                <p className="text-sm text-gray-600 mb-4">Drag and drop photos here, or click to select files</p>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                <Button
                                    onClick={handleUploadClick}
                                    className="bg-blue-500 hover:bg-blue-700"
                                    disabled={!selectedClass}
                                >
                                    <Upload className="h-4 w-4 mr-2" />
                                    Upload Photos
                                </Button>

                                {/* <Button
                                    variant="outline"
                                    onClick={handleCameraClick}
                                    disabled={!selectedClass}
                                    className="relative bg-transparent"
                                >
                                    <Camera className="h-4 w-4 mr-2" />
                                    Capture Camera
                                    <span className="ml-1 text-xs text-gray-500">(Coming Soon)</span>
                                </Button> */}
                            </div>

                            <p className="text-xs text-gray-500">Supports JPG, PNG, WEBP. Multiple files allowed.</p>
                        </div>
                    </div>

                    {/* Camera Info Tooltip */}
                    {showCameraInfo && (
                        <div className="absolute top-4 right-4 bg-gray-900 text-white text-sm p-3 rounded-lg shadow-lg max-w-xs">
                            Camera capture will be available in a future update. For now, please use the upload option to select
                            photos from your device.
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Hidden File Input */}
            <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                onChange={(e) => handleFileSelect(e.target.files)}
            />

            {/* Instructions */}
            <Card className="transition-all ease-in shadow-md hover:shadow-xl">
                <CardContent className="p-4">
                    <h4 className="font-medium text-gray-900 mb-2">Tips for Best Results:</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Ensure faces are clearly visible and well-lit</li>
                        <li>• Avoid blurry or low-resolution images</li>
                        <li>• Upload multiple photos if needed for complete coverage</li>
                    </ul>
                </CardContent>
            </Card>
        </div>
    )
}