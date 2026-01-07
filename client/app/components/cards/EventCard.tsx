import {UiAvatar} from "../ui/UiAvatar.tsx";
import {UiButton} from "../ui/UiButton.tsx";

export default function EventCard({
  title,
  subtitle,
  startDateTime,
  endDateTime,
  users,
  onClick,
  onButtonClick,
  inviteSent = false,
}: {
  title: string;
  subtitle?: string;
  startDateTime: string;
  endDateTime: string;
  users: { firstName: string; lastName:string; avatar?: string | null }[];
  onClick?: () => void;
  onButtonClick? : () => void;
  inviteSent?: boolean;
}) {
  const inviter = users[0];

  return (
      <div className="px-4 py-3 w-64 rounded-xl shadow flex flex-col gap-3 border bg-white border-gray-200 hover:shadow-lg transition">
    <button
      type="button"
      onClick={onClick}
      onKeyDown={(e) => e.key === "Enter" && onClick?.()}
      className="flex gap-4 text-left cursor-pointer"
    >
      <div className="flex flex-col items-center w-16">
        <UiAvatar
            firstName={inviter.firstName}
            lastName={inviter.lastName}
            size="sm"
            className="mb-1"
        />
        <span className="text-xs text-gray-600 text-center">
          {inviter.firstName} {inviter.lastName}
        </span>
      </div>

      <div className="flex flex-col flex-1">
        <span className="font-semibold text-base">{title}</span>
        {subtitle && <span className="text-sm text-gray-500">{subtitle}</span>}
        <span className="font-semibold text-lg mt-1">
          {startDateTime.slice(11, 16)}–{endDateTime.slice(11, 16)}
        </span>
      </div>
    </button>
        {onButtonClick && (
          inviteSent ? (
            <div className="text-center text-sm text-green-600 font-medium py-2">
              Kvietimas išsiųstas
            </div>
        ) : (
          <UiButton onClick={onButtonClick} >
            Susitikti
          </UiButton>
          )
        )}
      </div>
  );
}
