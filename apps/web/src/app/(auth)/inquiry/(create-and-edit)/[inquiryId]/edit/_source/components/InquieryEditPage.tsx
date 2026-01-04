import { routes } from "@clog/libs";

interface IProps {
  inquiryId: string;
}

const InquiryEditPage: React.FC<IProps> = ({ inquiryId }) => {
  return (
    <div>
      <h1>{routes.inquiry.edit.label}</h1>
      <h1>{routes.inquiry.edit.url(inquiryId)}</h1>
    </div>
  );
};

export default InquiryEditPage;
