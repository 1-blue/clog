import { routes } from "@clog/libs";

const GuideGradePage: React.FC = () => {
  return (
    <div>
      <h1>{routes.guide.grade.label}</h1>
      <h1>{routes.guide.grade.url}</h1>
    </div>
  );
};

export default GuideGradePage;
