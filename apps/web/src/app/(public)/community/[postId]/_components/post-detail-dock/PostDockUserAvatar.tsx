"use client";

import { User } from "lucide-react";

import { openapi } from "#web/apis/openapi";

const PostDockUserAvatar = () => {
  const { data: me } = openapi.useQuery(
    "get",
    "/api/v1/users/me",
    {},
    { retry: false },
  );

  return (
    <div className="size-8 shrink-0 overflow-hidden rounded-full bg-surface-container-highest">
      {me?.payload.profileImage ? (
        <img
          src={me.payload.profileImage}
          alt=""
          className="size-full object-cover"
        />
      ) : (
        <div className="flex size-full items-center justify-center">
          <User
            className="size-5 text-on-surface-variant"
            strokeWidth={2}
            aria-hidden
          />
        </div>
      )}
    </div>
  );
};

export default PostDockUserAvatar;
