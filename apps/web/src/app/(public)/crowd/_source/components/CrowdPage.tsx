import { routes } from "@clog/libs";

const CrowdPage: React.FC = () => {
  return (
    <div>
      <h1>{routes.crowd.label}</h1>
      <h1>{routes.crowd.url}</h1>
    </div>
  );
};

export default CrowdPage;
