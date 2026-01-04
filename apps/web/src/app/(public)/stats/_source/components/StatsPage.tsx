import { routes } from "@clog/libs";

const StatsPage: React.FC = () => {
  return (
    <div>
      <h1>{routes.stats.label}</h1>
      <h1>{routes.stats.url}</h1>
    </div>
  );
};

export default StatsPage;
