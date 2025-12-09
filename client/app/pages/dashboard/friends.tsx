import { useEffect, useState } from "react";
import { getFriendships, getFriendshipRequests } from "../../api/FriendshipApi";
import type { Friendship, FriendshipRequest } from "../../models/Friendship";
import FriendsSection from "../../components/cards/FriendsSection";
import FriendshipRequestsSection from "../../components/cards/FriendRequestsSection";

export default function Friends() {
  const userId = 2; // replace with auth user
  const [friends, setFriends] = useState<Friendship[]>([]);
  const [requests, setRequests] = useState<FriendshipRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [friendsData, requestsData] = await Promise.all([
          getFriendships(userId),
          getFriendshipRequests(userId)
        ]);
        setFriends(friendsData);
        setRequests(requestsData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [userId]);

  if (loading) return <div>Loading...</div>;

  return (
    <main className="m-6 flex flex-col gap-8">
      {requests.length > 0 && (<FriendshipRequestsSection requests={requests} />)}
      <FriendsSection friends={friends} />
    </main>
  );
}
