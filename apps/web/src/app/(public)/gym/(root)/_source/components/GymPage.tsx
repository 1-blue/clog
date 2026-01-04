import { routes } from "@clog/libs";

const GymPage: React.FC = () => {
  return (
    <div>
      <h1>{routes.gym.label}</h1>
      <h1>{routes.gym.url}</h1>
    </div>
  );
};

export default GymPage;
