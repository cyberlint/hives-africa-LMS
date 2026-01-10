"use client";

import { useCallback, useState } from "react";
import { useDropzone, FileRejection } from "react-dropzone";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { RenderEmptyState, RenderErrorState, RenderUploadingState } from "./render-state";
import { toast } from "sonner";
import { useConstructUrl } from "@/hooks/use-construct-url";
import { Button } from "@/components/ui/button";
import { Loader2, XIcon } from "lucide-react";

interface iAppProps {
    value?: string;
    onChange?: (value: string) => void;
    onDurationChange?: (duration: number) => void;
}

export function VideoUploader({onChange, value, onDurationChange}: iAppProps) {
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);
    const [error, setError] = useState(false);
    const initialUrl = useConstructUrl(value || "");
    const [preview, setPreview] = useState<string | null>(value ? initialUrl : null);

    const cleanupPreview = useCallback(() => {
        if (preview && preview.startsWith("blob:")) {
            URL.revokeObjectURL(preview);
        }
    }, [preview]);

    const handleUploadError = useCallback(() => {
         cleanupPreview();
         setPreview(null);
         setFile(null);
         setError(true);
         setUploading(false);
         setProgress(0);
    }, [cleanupPreview]);

    const uploadFile = useCallback(async (file: File) => {
        setUploading(true);
        setProgress(0);
        setError(false);

        const contentType = file.type || "application/octet-stream";

        try {
            // 1. Get presigned URL
            const presignedResponse = await fetch("/api/s3/upload", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    fileName: file.name,
                    contentType: contentType,
                    size: file.size,
                    isImage: false, 
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
                        toast.success("Video uploaded successfully");
                        resolve();
                    } else {
                        reject(new Error("Upload failed"));
                    }
                };

                xhr.onerror = () => {
                    reject(new Error("Upload failed"));
                };

                xhr.open("PUT", presignedUrl);
                xhr.setRequestHeader("Content-Type", contentType);
                xhr.send(file);
            });

        } catch (error) {
            console.error(error);
            toast.error('Something went wrong during upload');
            handleUploadError();
        }
    }, [handleUploadError, onChange]);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
            const selectedFile = acceptedFiles[0];
            
            cleanupPreview();
            
            const objectUrl = URL.createObjectURL(selectedFile);
            setFile(selectedFile);
            setPreview(objectUrl);
            setError(false);

            // Extract duration
            const video = document.createElement('video');
            video.preload = 'metadata';
            video.onloadedmetadata = function() {
                const duration = video.duration;
                if (onDurationChange && !isNaN(duration)) {
                     onDurationChange(duration);
                }
            }
            video.onerror = function() {
                 console.error("Failed to load video metadata");
            }
            video.src = objectUrl;
            
            uploadFile(selectedFile);
        }
    }, [preview, onDurationChange, uploadFile]); 

    async function handleRemoveFile() {
        if (!value) {
             if(preview) {
                 cleanupPreview();
                 setPreview(null);
             }
             return;
        }

        try {
            setIsDeleting(true);
            const response = await fetch(`/api/s3/delete?key=${encodeURIComponent(value)}`, {
                method: "DELETE",
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
            if(onDurationChange) onDurationChange(0);
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
                toast.error("File size limit exceeded (Max 512MB)");
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
                <div className="relative w-full h-full flex items-center justify-center bg-black/5 rounded-md overflow-hidden">
                     <video 
                        src={preview} 
                        controls 
                        className="max-h-full max-w-full rounded-md object-contain"
                     />
                    <Button
                        variant="destructive"
                        size="icon"
                        type="button"
                        className={cn("absolute top-2 right-2 z-10")}
                            onClick={handleRemoveFile}
                            disabled={isDeleting}
                    >
                        {isDeleting ? (
                            <Loader2 className="size-4 animate-spin" />
                        ) : (
                            <XIcon className="size-4" />
                        )}
                    </Button>
                </div>
            );
        }

        return <RenderEmptyState isDragActive={isDragActive} />;
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { "video/*": [] }, // Video specific
        maxFiles: 1,
        multiple: false,
        maxSize: 512 * 1024 * 1024, // 512MB
        onDropRejected: rejectedFiles,
        disabled: uploading || (!!preview && !error), 
    });

    return (
        <Card {...getRootProps()} className={cn(
            "relative border-2 border-dashed transition-colors duration-200 ease-in-out w-full h-64 cursor-pointer",
            isDragActive
                ? 'border-primary bg-primary/10 border-solid'
                : 'border-border hover:border-primary',
            (uploading || (preview && !error)) && "cursor-default"
        )}>
            <CardContent className="flex items-center justify-center h-full w-full p-4">
                <input {...getInputProps()} />
                {renderContent()}
            </CardContent>
        </Card>
    );
}
