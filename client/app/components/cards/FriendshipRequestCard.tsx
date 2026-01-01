import type React from "react";
import { useState } from "react";
import { confirmFriendship } from "../../api/FriendshipApi";
import type { FriendshipRequest } from "../../models/Friendship";
import { TimeAgo } from "../ui/TimeAgo";

interface FriendshipRequestCardProps {
  request: FriendshipRequest;
}

const FriendshipRequestCard: React.FC<FriendshipRequestCardProps> = ({
  request,
}) => {
  const [loading, setLoading] = useState(false);

  const handleAccept = async () => {
    try {
      setLoading(true);
      await confirmFriendship(request.friendshipId);
    } catch (error) {
      console.error("Failed to confirm friendship", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 flex items-center space-x-4 hover:bg-gray-100 transition-shadow">
      <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center text-2xl text-gray-600">
        {request.firstName[0]}
        {request.lastName[0]}
      </div>
      <div className="flex-1">
        <h3 className="text-lg font-semibold text-gray-800">
          {request.firstName} {request.lastName}
        </h3>
        <TimeAgo date={request.requestDateTime} />
      </div>
      <div className="flex space-x-2">
        <button
          type="button"
          onClick={handleAccept}
          disabled={loading}
          className={`px-4 py-2 rounded-xl transition 
            ${loading 
              ? "bg-gray-400 text-gray-200 cursor-not-allowed" 
              : "bg-blue-500 text-white hover:bg-blue-600"}`}
        >
          Patvirtinti
        </button>
        <button
          type="button"
          className="bg-gray-200 text-red-700 px-4 py-2 rounded-xl hover:bg-gray-300 transition"
        >
          Atmesti
        </button>
      </div>
    </div>
  );
};

export default FriendshipRequestCard;
