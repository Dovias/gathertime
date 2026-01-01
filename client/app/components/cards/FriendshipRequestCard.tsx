import type React from "react";
import type { FriendshipRequest } from "../../models/Friendship";
import { TimeAgo } from "../ui/TimeAgo";

interface FriendshipRequestCardProps {
  request: FriendshipRequest;
}

const FriendshipRequestCard: React.FC<FriendshipRequestCardProps> = ({
  request,
}) => {
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
          className="bg-blue-500 text-white px-4 py-2 rounded-xl hover:bg-blue-600 transition"
        >
          Accept
        </button>
        <button
          type="button"
          className="bg-gray-200 text-red-700 px-4 py-2 rounded-xl hover:bg-gray-300 transition"
        >
          Decline
        </button>
      </div>
    </div>
  );
};

export default FriendshipRequestCard;
