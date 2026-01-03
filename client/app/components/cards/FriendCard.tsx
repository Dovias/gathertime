import type React from "react";
import type { Friendship } from "../../models/Friendship";
import { useNavigate } from "react-router";
import { UiButton } from "../ui/UiButton";

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
      <div
        onClick={handleGoToProfile}
        className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center text-2xl text-gray-600 cursor-pointer"
      >
        {friend.firstName[0]}
        {friend.lastName[0]}
      </div>
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
