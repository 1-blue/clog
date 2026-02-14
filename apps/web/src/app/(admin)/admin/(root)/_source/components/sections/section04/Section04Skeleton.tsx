import * as React from "react";
import { Skeleton } from "#/src/components/ui/skeleton";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "#/src/components/ui/tabs";

const Section04Skeleton: React.FC = () => {
  return (
    <div className="rounded-lg bg-white p-6 shadow-sm">
      <Skeleton className="mb-4 h-6 w-24 bg-muted/70" />
      <Tabs defaultValue="gym">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="gym" disabled>
            암장
          </TabsTrigger>
          <TabsTrigger value="profile" disabled>
            사용자
          </TabsTrigger>
          <TabsTrigger value="communityPost" disabled>
            게시글
          </TabsTrigger>
          <TabsTrigger value="report" disabled>
            신고
          </TabsTrigger>
        </TabsList>

        <TabsContent value="gym" className="mt-4">
          <div className="flex flex-col gap-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="flex items-start gap-3 rounded-lg bg-blue-100 p-4"
              >
                <Skeleton className="h-10 w-10 rounded-lg bg-muted/70" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-48 bg-muted/70" />
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-4 w-32 bg-muted/70" />
                    <Skeleton className="h-3 w-16 bg-muted/70" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Section04Skeleton;
