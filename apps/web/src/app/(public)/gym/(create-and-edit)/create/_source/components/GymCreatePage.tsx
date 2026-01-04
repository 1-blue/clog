import { routes } from "@clog/libs";

const GymCreatePage: React.FC = () => {
  return (
    <div>
      <h1>{routes.gym.create.label}</h1>
      <h1>{routes.gym.create.url}</h1>
    </div>
  );
};

export default GymCreatePage;
