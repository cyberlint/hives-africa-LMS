"use client";

import { useDropzone, FileRejection } from "react-dropzone";
import { useCallback, useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { RenderEmptyState, RenderErrorState, RenderUploadingState } from "./render-state"; // Reuse existing
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { FileText, Loader2, XIcon } from "lucide-react";
import { useConstructUrl } from "@/hooks/use-construct-url";

interface iAppProps {
    value?: string;
    onChange?: (value: string) => void;
}

export function DocumentUploader({ onChange, value }: iAppProps) {
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);
    const [error, setError] = useState(false);
    
    // We don't preview docs visually like images, but we check existence
    const [fileKey, setFileKey] = useState<string | null>(value || null);
    

    useEffect(() => {
        if (value !== fileKey) {
            setFileKey(value || null);
        }
    }, [value, fileKey]);

    const handleUploadError = () => {
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
            const presignedResponse = await fetch("/api/s3/upload", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    fileName: file.name,
                    contentType: file.type,
                    size: file.size,
                    isImage: false, // General file
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
                        setFileKey(key);
                        onChange?.(key);
                        toast.success("Document uploaded successfully");
                        resolve();
                    } else {
                        reject(new Error("Upload failed"));
                    }
                };
                xhr.onerror = () => reject(new Error("Upload failed"));
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
            setFile(selectedFile);
            setError(false);
            uploadFile(selectedFile);
        }
    }, []);

    async function handleRemoveFile() {
        if (!value) {
             setFileKey(null);
             return;
        }

        try {
            setIsDeleting(true);
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

            setFileKey(null);
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

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        // Accept PDF, Word, Powerpoint, Text, Jupyter Notebooks
        accept: { 
        "application/pdf": [".pdf"],
        "application/msword": [".doc"],
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
        "text/plain": [".txt"],
        "application/vnd.ms-powerpoint": [".ppt"],
        "application/vnd.openxmlformats-officedocument.presentationml.presentation": [".pptx"],
        "application/x-ipynb+json": [".ipynb"]
        },
        maxFiles: 1,
        maxSize: 15 * 1024 * 1024, // 15MB
        onDropRejected: (fileRejection) => {
             if (fileRejection.length > 0) {
                const errors = fileRejection[0].errors;
                 if (errors.some(e => e.code === 'file-too-large')) {
                    toast.error("File size limit exceeded (Max 15MB)");
                } else {
                     toast.error("Invalid file type. Upload PDF, Docx, PPT, Ipynb or Text.");
                }
            }
        },
        disabled: uploading || (!!fileKey && !error), 
    });

    const renderContent = () => {
        if (uploading && file) {
            return <RenderUploadingState file={file} progress={progress}/>;
        }
        if (error) {
            return <RenderErrorState />;
        }
        if (fileKey) {
            return (
                <div className="flex flex-col items-center justify-center p-4">
                    <FileText className="size-10 text-primary mb-2" />
                    <p className="text-sm font-medium mb-2 break-all">
                        {file?.name || (fileKey ? fileKey.split('-').slice(5).join('-') || fileKey : "Document Uploaded")}
                    </p>
                    <Button
                        variant="destructive"
                        size="sm"
                        type="button"
                        onClick={handleRemoveFile}
                        disabled={isDeleting}
                    >
                        {isDeleting ? <Loader2 className="size-4 animate-spin" /> : "Remove Document"}
                    </Button>
                </div>
            );
        }
        return <RenderEmptyState isDragActive={isDragActive} />;
    };

    return (
        <Card {...getRootProps()} className={cn(
            "relative border-2 border-dashed transition-colors duration-200 ease-in-out w-full h-48 cursor-pointer",
            isDragActive
                ? 'border-primary bg-primary/10 border-solid'
                : 'border-border hover:border-primary',
            (uploading || (fileKey && !error)) && "cursor-default"
        )}>
            <CardContent className="flex items-center justify-center h-full w-full p-4">
                <input {...getInputProps()} />
                {renderContent()}
            </CardContent>
        </Card>
    );
}
