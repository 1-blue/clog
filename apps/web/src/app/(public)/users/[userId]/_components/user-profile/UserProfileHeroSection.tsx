"use client";

import { UserRound } from "lucide-react";

import type { components } from "#web/@types/openapi";

type TUserProfile = components["schemas"]["UserProfile"];

interface IProps {
  user: TUserProfile;
}

const UserProfileHeroSection: React.FC<IProps> = ({ user }) => {
  return (
    <section className="relative">
      <div className="relative h-48 w-full overflow-hidden bg-surface-container-low">
        {user.coverImage ? (
          // eslint-disable-next-line @next/next/no-img-element -- 외부 프로필 커버 URL
          <img
            src={user.coverImage}
            alt=""
            className="size-full object-cover"
          />
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/35 to-surface-container-low" />
      </div>

      <div className="-mt-20 flex flex-col items-center px-6">
        <div className="relative">
          <div className="size-32 overflow-hidden rounded-xl border-4 border-surface bg-surface-container-highest shadow-2xl">
            {user.profileImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={user.profileImage}
                alt=""
                className="size-full object-cover"
              />
            ) : (
              <div className="flex size-full items-center justify-center bg-surface-container-high">
                <UserRound
                  className="size-14 text-on-surface-variant"
                  strokeWidth={1.25}
                />
              </div>
            )}
          </div>
        </div>

        <div className="mt-4 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-on-surface">
            {user.nickname}
          </h2>
        </div>
      </div>
    </section>
  );
};

export default UserProfileHeroSection;
