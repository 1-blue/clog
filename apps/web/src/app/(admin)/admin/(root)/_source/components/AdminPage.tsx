import * as React from "react";
import { Suspense } from "react";
import Section01 from "./sections/Section01";
import Section02 from "./sections/section02/Section02";
import Section02Skeleton from "./sections/section02/Section02Skeleton";
import Section03 from "./sections/Section03";
import Section04 from "./sections/section04/Section04";
import Section04Skeleton from "./sections/section04/Section04Skeleton";

const AdminPage: React.FC = () => {
  return (
    <div className="flex flex-col gap-4">
      <Section01 />

      <Suspense fallback={<Section02Skeleton />}>
        <Section02 />
      </Suspense>
      <Section03 />
      <Suspense fallback={<Section04Skeleton />}>
        <Section04 />
      </Suspense>
    </div>
  );
};

export default AdminPage;
