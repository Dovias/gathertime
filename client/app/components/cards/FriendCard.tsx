import type React from "react";
import type { Friendship } from "../../models/Friendship";
import { useNavigate } from "react-router";
import { UiButton } from "../ui/UiButton";
import { UiAvatar } from "../ui/UiAvatar";

interface FriendCardProps {
  friend: Friendship;
}

const FriendCard: React.FC<FriendCardProps> = ({ friend }) => {
  const navigate = useNavigate();

  const handleGoToProfile = () => {
    navigate(`/dashboard/user-profile/${friend.friendId}`);
  };

  return (
    <div className="bg-white rounded-2xl p-6 flex items-center space-x-4 hover:bg-gray-100 transition-shadow">
      <UiAvatar
        onClick={handleGoToProfile}
        firstName={friend.firstName}
        lastName={friend.lastName}
        className="cursor-pointer"
      />
      <div className="flex-1">
        <h3
          onClick={handleGoToProfile}
          className="inline-block text-lg font-semibold text-gray-800 cursor-pointer hover:underline"
        >
          {friend.firstName} {friend.lastName}
        </h3>
      </div>
      <div className="flex space-x-2">
        <UiButton>
          Message
        </UiButton>
      </div>
    </div>
  );
};

export default FriendCard;
