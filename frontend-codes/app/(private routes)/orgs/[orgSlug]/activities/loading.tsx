import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function ActivityEditorLoading() {
  return (
    <div className="flex flex-col h-full space-y-6 p-6 animate-pulse">
      
      {/* 1. Skeleton Header */}
      <div className="flex items-center justify-between border-b pb-4">
        <div className="flex items-center gap-4">
          <div className="h-10 w-10 bg-muted rounded-md"></div>
          <div>
            <div className="h-8 w-64 bg-muted rounded mb-2"></div>
            <div className="h-4 w-32 bg-muted rounded"></div>
          </div>
        </div>
        <div className="flex gap-3">
          <div className="h-10 w-24 bg-muted rounded"></div>
          <div className="h-10 w-36 bg-muted rounded"></div>
        </div>
      </div>

      {/* 2. Skeleton Body (Sidebar + Content) */}
      <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] gap-8">
        
        {/* Sidebar Skeleton */}
        <aside className="space-y-2">
          <div className="h-10 w-full bg-muted rounded-md"></div>
          <div className="h-10 w-full bg-muted/50 rounded-md"></div>
          <div className="h-10 w-full bg-muted/50 rounded-md"></div>
          <div className="h-10 w-full bg-muted/50 rounded-md"></div>
        </aside>

        {/* Main Content Form Skeleton */}
        <main className="max-w-3xl">
          <Card>
            <CardHeader className="space-y-3">
              <div className="h-6 w-48 bg-muted rounded"></div>
              <div className="h-4 w-96 bg-muted/50 rounded"></div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="h-4 w-24 bg-muted rounded"></div>
                <div className="h-10 w-full bg-muted rounded"></div>
              </div>
              <div className="space-y-2">
                <div className="h-4 w-32 bg-muted rounded"></div>
                <div className="h-32 w-full bg-muted rounded"></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <div className="h-4 w-24 bg-muted rounded"></div>
                  <div className="h-10 w-full bg-muted rounded"></div>
                </div>
                <div className="space-y-2">
                  <div className="h-4 w-24 bg-muted rounded"></div>
                  <div className="h-10 w-full bg-muted rounded"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </main>
        
      </div>
    </div>
  );
}