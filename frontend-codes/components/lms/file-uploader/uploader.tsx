"use client";

import { useCallback, useState } from "react";
import { useDropzone, FileRejection } from "react-dropzone";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { RenderEmptyState, RenderErrorState, RenderUploadedState, RenderUploadingState } from "./render-state";
import { toast } from "sonner";
import { useConstructUrl } from "@/hooks/use-construct-url";

interface iAppProps {
    value?: string;
    onChange?: (value: string) => void;
    apiEndpoint?: string;
}

export function Uploader({onChange, value, apiEndpoint}: iAppProps) {
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);
    const [error, setError] = useState(false);
    const initialUrl = useConstructUrl(value || "");
    const [preview, setPreview] = useState<string | null>(value ? initialUrl : null);
    const uploadApiUrl = apiEndpoint || "/api/s3/upload";       // use "/api/s3/upload-public" if admin is not required (but one must be authenticated) 

    const cleanupPreview = () => {
        if (preview && preview.startsWith("blob:")) {
            URL.revokeObjectURL(preview);
        }
    };

    const handleUploadError = () => {
         cleanupPreview();
         setPreview(null);
         setFile(null);
         setError(true);
         setUploading(false);
         setProgress(0);
    };

    async function uploadFile(file: File) {
        setUploading(true);
        setProgress(0);
        setError(false);

        try {
            // 1. Get presigned URL
            const presignedResponse = await fetch(uploadApiUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    fileName: file.name,
                    contentType: file.type,
                    size: file.size,
                    isImage: true,
                }),
            });

            if (!presignedResponse.ok) {
                toast.error('Failed to get presigned URL');
                handleUploadError();
                return;
            }

            const { presignedUrl, key } = await presignedResponse.json();

            await new Promise<void>((resolve, reject) => {
                const xhr = new XMLHttpRequest();

                xhr.upload.onprogress = (event) => {
                    if (event.lengthComputable) {
                        const percentageCompleted = (event.loaded / event.total) * 100;
                        setProgress(Math.round(percentageCompleted));
                    }
                };

                xhr.onload = () => {
                    if (xhr.status >= 200 && xhr.status < 300) {
                        setUploading(false);
                        setProgress(100);
                        onChange?.(key);
                        toast.success("File uploaded successfully");
                        resolve();
                    } else {
                        reject(new Error("Upload failed"));
                    }
                };

                xhr.onerror = () => {
                    reject(new Error("Upload failed"));
                };

                xhr.open("PUT", presignedUrl);
                xhr.setRequestHeader("Content-Type", file.type);
                xhr.send(file);
            });

        } catch (error) {
            console.error(error);
            toast.error('Something went wrong during upload');
            handleUploadError();
        }
    }

    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
            const selectedFile = acceptedFiles[0];
            
            // Cleanup previous preview if it exists
            cleanupPreview();
            
            const objectUrl = URL.createObjectURL(selectedFile);
            setFile(selectedFile);
            setPreview(objectUrl);
            setError(false);
            
            uploadFile(selectedFile);
        }
    }, [preview]); // Depend on preview to clean it up

    async function handleRemoveFile() {
        if (!value) {
            // If just a local preview/error state without value (shouldn't happen for uploaded state but good safety)
             if(preview) {
                 cleanupPreview();
                 setPreview(null);
             }
             return;
        }

        try {
            setIsDeleting(true);

            // Here we assume 'value' is the key. 
            // Note: In strict React flow, we should probably use the prop 'value' directly if we trust parent updates it.
            // But we can also use 'value' from props closure.
            
            const response = await fetch('/api/s3/delete', {
                method: "DELETE",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({ key: value }),
            });

            if(!response.ok) {
                toast.error("Failed to remove file");
                setIsDeleting(false);
                return;
            }

            cleanupPreview();
            setPreview(null);
            setFile(null);
            onChange?.("");
            setIsDeleting(false);
            toast.success("File removed successfully");

        } catch (err) {
            toast.error("Error removing file");
            console.error(err);
            setIsDeleting(false);
        }
    }

    function rejectedFiles(fileRejection: FileRejection[]) {
        if (fileRejection.length > 0) {
            const errors = fileRejection[0].errors;
            if (errors.some(e => e.code === 'file-too-large')) {
                toast.error("File size limit exceeded (Max 5MB)");
            } else if (errors.some(e => e.code === 'too-many-files')) {
                toast.error("You can only upload one file");
            } else {
                 toast.error("Invalid file type");
            }
        }
    }

    const renderContent = () => {
        if (uploading && file) {
            return <RenderUploadingState file={file} progress={progress}/>;
        }

        if (error) {
            return <RenderErrorState />;
        }

        if (preview) {
            return (
                <RenderUploadedState 
                    previewUrl={preview} 
                    isDeleting={isDeleting} 
                    handleRemoveFile={handleRemoveFile} 
                />
            );
        }

        return <RenderEmptyState isDragActive={isDragActive} />;
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { "image/*": [] },
        maxFiles: 1,
        multiple: false,
        maxSize: 5 * 1024 * 1024,
        onDropRejected: rejectedFiles,
        // Disable only when uploading or when a valid file is present (and not in error state)
        disabled: uploading || (!!preview && !error), 
    });

    return (
        <Card {...getRootProps()} className={cn(
            "relative border-2 border-dashed transition-colors duration-200 ease-in-out w-full h-64 cursor-pointer",
            isDragActive
                ? 'border-primary bg-primary/10 border-solid'
                : 'border-border hover:border-primary',
            (uploading || (preview && !error)) && "cursor-default" // Change cursor if disabled
        )}>
            <CardContent className="flex items-center justify-center h-full w-full p-4">
                <input {...getInputProps()} />
                {renderContent()}
            </CardContent>
        </Card>
    );
}
