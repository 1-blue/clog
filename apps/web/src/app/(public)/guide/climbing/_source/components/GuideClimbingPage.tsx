import { routes } from "@clog/libs";

const GuideClimbingPage: React.FC = () => {
  return (
    <div>
      <h1>{routes.guide.climbing.label}</h1>
      <h1>{routes.guide.climbing.url}</h1>
    </div>
  );
};

export default GuideClimbingPage;
