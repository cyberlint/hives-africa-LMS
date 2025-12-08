import { cn } from "@/lib/utils";
import { CloudUpload, ImageIcon, Loader2, XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export function RenderEmptyState({ isDragActive }: { isDragActive: boolean }) {
    return (
        <div className="text-center">
            <div className="flex items-center mx-auto justify-center size-12 rounded-full bg-muted mb-4">
                <CloudUpload
                    className={
                        cn(
                            "size-6 text-muted-foreground",
                            isDragActive && "text-primary"
                        )}
                />
            </div>
            <p className="text-base text-foreground">
                Drag and drop or click to <span className="text-primary font-bold cursor-pointer">
                    browse </span>file
            </p>
            <Button type="button" className="mt-4">Select files</Button>
        </div>
    )
}

export function RenderErrorState() {
    return (
        <div className="text-center">
            <div className="flex items-center mx-auto justify-center size-12 rounded-full bg-destructive/30 mb-4">
                <ImageIcon
                    className={
                        cn(
                            "size-6 text-destructive",
                        )}
                />
            </div>
            <p className="text-base font-semibold">Upload Failed</p>
            <p className="text-xs mt-1 text-muted-foreground">Some went wrong. Please try again</p>
            <Button className="mt-4" type="button">Select files</Button>
        </div>
    )
}

export function RenderUploadedState({ 
    previewUrl, 
    isDeleting, 
    handleRemoveFile 
}: { 
    previewUrl: string;
    isDeleting: boolean;
    handleRemoveFile: () => void;
}) {
    return (
        <div>
            <Image
                src={previewUrl}
                alt="Uploaded file"
                fill
                className="object-contain p-2"
            />
            <Button
                variant="destructive"
                size="icon"
                type="button"
                className={cn("absolute top-4 right-4")}
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


export function RenderUploadingState({
    progress, file 
}: { 
    progress: number; file: File; 
}) {
return(
    <div className="text-center flex justify-center items-center flex-col">
        <p>{progress}%</p>
        <p className="mt-2 text-sm font-medium text-foreground">Uploading...</p>
        <p className="mt-1 text-xs text-muted-foreground truncate max-w-xs"></p>
    </div>
)

}
