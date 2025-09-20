import { useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Eye, RotateCcw, Trash2, ImageIcon } from "lucide-react"

import { useTranslation } from 'react-i18next';


export default function CaptureGallery({ photos, selectedPhoto, onPhotoSelect, onPhotosUploaded, onRetakePhoto, onRemovePhoto }) {
    const { t } = useTranslation();

    const fileInputRef = useRef(null);

    // Trigger hidden file input click
    const handleAddMoreClick = () => {
        fileInputRef.current?.click();
    };

    // Convert files to base64 and send to parent handler
    const handleFilesSelected = async (event) => {
        const files = event.target.files;
        if (!files || files.length === 0) return;

        // Convert files to photo objects with base64 strings
        const photosWithBase64 = await Promise.all(
            Array.from(files).map(async (file, index) => {
                const base64 = await toBase64(file);
                return {
                    id: `p${Date.now()}_${index}`,
                    file,
                    url: URL.createObjectURL(file),
                    name: file.name,
                    size: file.size,
                    base64,
                };
            })
        );

        // Pass new photos up to parent (AttendancePage)
        onPhotosUploaded(photosWithBase64);

        // Reset file input to allow re-upload of same files if needed
        event.target.value = null;
    };



    if (!photos || photos.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Uploaded Photos</CardTitle>
                </CardHeader>
                <CardContent>
                    No photos uploaded yet
                    <div className="mt-4">
                        <Button onClick={handleAddMoreClick} variant="outline" size="sm">
                            <ImageIcon className="mr-2 h-4 w-4" /> Add Photos
                        </Button>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleFilesSelected}
                            style={{ display: "none" }}
                        />
                    </div>
                </CardContent>
            </Card>
        );
    }


    return (
        <Card>
            <CardHeader>
                <CardTitle>Uploaded Photos ({photos.length})</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex flex-wrap gap-4">
                    {photos.map((photo) => (
                        <div
                            key={photo.id}
                            className={`relative cursor-pointer rounded border p-1 ${selectedPhoto?.id === photo.id ? "border-purple-500" : "border-gray-300"
                                }`}
                            onClick={() => onPhotoSelect(photo)}
                            title={photo.name}
                        >
                            {/* Thumbnail */}
                            <img
                                src={photo.url}
                                alt={photo.name}
                                className="h-24 w-24 object-cover rounded-sm"
                            />

                            {/* Overlay with action buttons */}
                            <div className="absolute top-1 right-1 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onPhotoSelect(photo);
                                    }}
                                    title="View Photo"
                                >
                                    <Eye className="h-4 w-4" />
                                </Button>
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onRetakePhoto(photo.id);
                                    }}
                                    title="Retake Photo"
                                >
                                    <RotateCcw className="h-4 w-4" />
                                </Button>
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onRemovePhoto(photo.id);
                                    }}
                                    title="Remove Photo"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>

                            {/* Selected indicator */}
                            {selectedPhoto?.id === photo.id && (
                                <div className="absolute top-1 left-1 h-3 w-3 rounded-full bg-purple-600" />
                            )}

                            {/* Photo info */}
                            <div className="mt-1 text-center text-sm text-gray-600">
                                {photo.name}
                                <br />
                                {(photo.size / 1024 / 1024).toFixed(1)} MB
                            </div>
                        </div>
                    ))}
                </div>

                {/* Gallery Actions */}
                <div className="mt-4 flex space-x-2">
                    <Button onClick={handleAddMoreClick} variant="outline" size="sm" className="flex items-center">
                        <ImageIcon className="mr-2 h-4 w-4" /> Add More Photos
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                            if (confirm("Remove all photos? This will reset the session.")) {
                                photos.forEach((photo) => onRemovePhoto(photo.id));
                            }
                        }}
                    >
                        Clear All
                    </Button>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleFilesSelected}
                        style={{ display: "none" }}
                    />
                </div>

                {/* Tips */}
                <p className="mt-4 text-sm text-gray-700">
                    Tip: Click on a photo to view it with face detection overlays. Use the action buttons to retake or remove individual photos.
                </p>
            </CardContent>
        </Card>
    );
}

// Utility: convert file to base64 string
function toBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });
}