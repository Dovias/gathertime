import type React from "react";
import type { Friendship } from "../../models/Friendship";

interface FriendCardProps {
  friend: Friendship;
}

const FriendCard: React.FC<FriendCardProps> = ({ friend }) => {
  return (
    <div className="bg-white rounded-2xl p-6 flex items-center space-x-4 hover:bg-gray-100 transition-shadow">
      <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center text-2xl text-gray-600">
        {friend.firstName[0]}
        {friend.lastName[0]}
      </div>
      <div className="flex-1">
        <h3 className="text-lg font-semibold text-gray-800">
          {friend.firstName} {friend.lastName}
        </h3>
      </div>
      <div className="flex space-x-2">
        <button
          type="button"
          className="bg-blue-500 text-white px-4 py-2 rounded-xl hover:bg-blue-600 transition"
        >
          Message
        </button>
        <button
          type="button"
          className="bg-gray-200 text-gray-700 px-4 py-2 rounded-xl hover:bg-gray-300 transition"
        >
          View
        </button>
      </div>
    </div>
  );
};

export default FriendCard;
