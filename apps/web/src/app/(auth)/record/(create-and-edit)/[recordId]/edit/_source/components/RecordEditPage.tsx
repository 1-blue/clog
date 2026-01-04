import { routes } from "@clog/libs";

interface IProps {
  recordId: string;
}

const RecordEditPage: React.FC<IProps> = ({ recordId }) => {
  return (
    <div className="flex flex-col gap-4">
      <h1>{routes.record.edit.label}</h1>
      <h1>{routes.record.edit.url(recordId)}</h1>
    </div>
  );
};

export default RecordEditPage;
