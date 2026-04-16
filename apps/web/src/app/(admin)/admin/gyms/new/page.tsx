import AdminPageHeader from "#web/components/admin/AdminPageHeader";

import GymCreateForm from "./_source/components/GymCreateForm";

const NewGymPage = () => {
  return (
    <>
      <AdminPageHeader title="암장 추가" description="새 암장을 등록합니다" />
      <GymCreateForm />
    </>
  );
};

export default NewGymPage;
