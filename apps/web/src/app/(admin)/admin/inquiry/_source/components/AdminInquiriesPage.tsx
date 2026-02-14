import * as React from "react";
import { routes } from "@clog/libs";

const AdminInquiryPage: React.FC = () => {
  return (
    <div>
      <h1>{routes.admin.inquiry.label}</h1>
      <h1>{routes.admin.inquiry.url}</h1>
    </div>
  );
};

export default AdminInquiryPage;
