import type React from "react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { confirmFriendship, declineFriendship } from "../../api/FriendshipApi";
import type { FriendshipRequest } from "../../models/Friendship";
import { TimeAgo } from "../ui/TimeAgo";
import { UiButton } from "../ui/UiButton";
import { UiAvatar } from "../ui/UiAvatar";

interface FriendshipRequestCardProps {
  request: FriendshipRequest;
}

const FriendshipRequestCard: React.FC<FriendshipRequestCardProps> = ({
  request,
}) => {
  const [status, setStatus] = useState<'PENDING' | 'CONFIRMED' | 'DECLINED'>('PENDING');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleGoToProfile = () => {
    navigate(`/dashboard/user-profile/${request.friendId}`);
  };

  const handleAccept = async () => {
    try {
      setLoading(true);
      await confirmFriendship(request.friendshipId);
      setStatus('CONFIRMED');
    } catch (error) {
      console.error("Failed to confirm friendship", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDecline = async () => {
    try {
      setLoading(true);
      await declineFriendship(request.friendshipId);
      setStatus('DECLINED');
    } catch (error) {
      console.error("Failed to decline friendship", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 flex items-center space-x-4 hover:bg-gray-100 transition-shadow">
      <UiAvatar
        onClick={handleGoToProfile}
        firstName={request.firstName}
        lastName={request.lastName}
        className="cursor-pointer"
      />
      <div className="flex-1">
        <h3
          onClick={handleGoToProfile}
          className="text-lg font-semibold text-gray-800 cursor-pointer hover:underline"
        >
          {request.firstName} {request.lastName}
        </h3>
        <TimeAgo date={request.requestDateTime} />
      </div>
      <div className="flex space-x-2 justify-center items-center">
        {status === 'CONFIRMED' ? (
          <span className="font-bold text-green-700 min-w-40 text-center">Draugystė užmegzta</span>
        ) : status === 'DECLINED' ? (
          <div className="font-bold text-red-600 min-w-40 text-center">Atmesta</div>
        ) : (
          <>
            <UiButton
              onClick={handleAccept}
              disabled={loading}
              className={loading ? "bg-gray-400 text-gray-200 cursor-not-allowed" : ""}
            >
              Sutikti
            </UiButton>
            <UiButton
              onClick={handleDecline}
              disabled={loading}
              className={loading ? "bg-gray-400 text-gray-200 cursor-not-allowed" : ""}
              variant="outline"
            >
              Atmesti
            </UiButton>
          </>
        )}
      </div>
    </div>
  );
};

export default FriendshipRequestCard;
