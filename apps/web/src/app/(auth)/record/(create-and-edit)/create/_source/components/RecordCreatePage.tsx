import { routes } from "@clog/libs";

const RecordCreatePage: React.FC = () => {
  return (
    <div className="flex flex-col gap-4">
      <h1>{routes.record.create.label}</h1>
      <h1>{routes.record.create.url}</h1>
    </div>
  );
};

export default RecordCreatePage;
