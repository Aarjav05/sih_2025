"use client"

import { useState, useCallback } from "react"

export function useUpload() {
    const [uploadedFiles, setUploadedFiles] = useState([])
    const [isUploading, setIsUploading] = useState(false)
    const [uploadError, setUploadError] = useState(null)

    const uploadFiles = useCallback(async (files) => {
        setIsUploading(true)
        setUploadError(null)

        try {
            // Mock upload process - replace with actual API call
            const uploadPromises = Array.from(files).map(async (file, index) => {
                // Simulate upload delay
                await new Promise((resolve) => setTimeout(resolve, 500 + index * 200))

                return {
                    id: `upload_${Date.now()}_${index}`,
                    file,
                    url: URL.createObjectURL(file),
                    name: file.name,
                    size: file.size,
                    uploadedAt: new Date(),
                }
            })

            const uploadedFiles = await Promise.all(uploadPromises)
            setUploadedFiles((prev) => [...prev, ...uploadedFiles])

            return uploadedFiles
        } catch (error) {
            setUploadError(error.message)
            throw error
        } finally {
            setIsUploading(false)
        }
    }, [])

    const removeFile = useCallback((fileId) => {
        setUploadedFiles((prev) => {
            const fileToRemove = prev.find((f) => f.id === fileId)
            if (fileToRemove?.url) {
                URL.revokeObjectURL(fileToRemove.url)
            }
            return prev.filter((f) => f.id !== fileId)
        })
    }, [])

    const clearFiles = useCallback(() => {
        uploadedFiles.forEach((file) => {
            if (file.url) {
                URL.revokeObjectURL(file.url)
            }
        })
        setUploadedFiles([])
    }, [uploadedFiles])

    const retakeFile = useCallback(async (fileId, newFile) => {
        setUploadedFiles((prev) => {
            const oldFile = prev.find((f) => f.id === fileId)
            if (oldFile?.url) {
                URL.revokeObjectURL(oldFile.url)
            }

            return prev.map((file) =>
                file.id === fileId
                    ? {
                        ...file,
                        file: newFile,
                        url: URL.createObjectURL(newFile),
                        name: newFile.name,
                        size: newFile.size,
                        uploadedAt: new Date(),
                    }
                    : file,
            )
        })
    }, [])

    return {
        uploadedFiles,
        isUploading,
        uploadError,
        uploadFiles,
        removeFile,
        clearFiles,
        retakeFile,
    }
}