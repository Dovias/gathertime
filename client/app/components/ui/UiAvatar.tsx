import { MouseEventHandler } from 'react';

interface UiAvatarProps {
  firstName: string;
  lastName: string;
  size?: "sm" | "md" | "lg";
  className?: string;
  onClick?: MouseEventHandler<HTMLDivElement>;
}

export function UiAvatar({
  firstName,
  lastName,
  size = "md",
  className = "",
  onClick,
}: UiAvatarProps) {
  const initials = `${firstName?.[0] ?? ""}${lastName?.[0] ?? ""}`;

  let sizeClass = '';
  if (size === "sm") sizeClass = "w-10 h-10 text-sm";
  if (size === "md") sizeClass = "w-18 h-18 text-3xl";
  if (size === "lg") sizeClass = "w-32 h-32 text-4xl";

  const avatarClassName = `
    bg-gray-200 rounded-full flex items-center justify-center
    font-semibold text-gray-600 flex-shrink-0
    ${sizeClass} ${className}
  `;

  return (
    <div
      onClick={onClick}
      className={avatarClassName}
    >
      {initials}
    </div>
  );
}
