"use client";

import React from "react";

import { cn } from "#web/libs/utils";

interface IProps {
  isFollowing: boolean;
  onClick: () => void;
  isLoading?: boolean;
  className?: string;
}

const FollowButton: React.FC<IProps> = ({
  isFollowing,
  onClick,
  isLoading = false,
  className,
}) => {
  return (
    <button
      onClick={onClick}
      disabled={isLoading}
      className={cn(
        "rounded-full px-5 py-2 text-sm font-medium transition-colors",
        isFollowing
          ? "bg-surface-container-high text-on-surface hover:bg-surface-container-highest"
          : "bg-primary text-primary-foreground hover:bg-primary/90",
        className,
      )}
    >
      {isFollowing ? "팔로잉" : "팔로우"}
    </button>
  );
};
export default FollowButton;
