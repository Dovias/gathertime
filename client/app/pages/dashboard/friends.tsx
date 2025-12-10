import { useState } from "react";
import { getFriendships, getFriendshipRequests } from "../../api/FriendshipApi";
import type { Friendship, FriendshipRequest } from "../../models/Friendship";
import FriendshipRequestsSection from "../../components/cards/FriendRequestsSection";
import { userContext } from "../../context";
import FriendsSection from "../../components/cards/FriendsSection";
import type { Route } from "./+types/friends";

export async function clientLoader({ context }: Route.ClientLoaderArgs) {
  const user = context.get(userContext);

  const [friends, requests] = await Promise.all([
    getFriendships(user.id),
    getFriendshipRequests(user.id),
  ]);

  return { friends, requests };
}

export default function Friends({ loaderData }: Route.ComponentProps) {
  const safeData = loaderData || { friends: [], requests: [] };

  const [friends] = useState<Friendship[]>(safeData.friends);
  const [requests] = useState<FriendshipRequest[]>(
    safeData.requests,
  );
  const [loading] = useState(false);

  if (loading) return <div>Loading...</div>;

  return (
    <main className="m-6 flex flex-col gap-8">
      {requests.length > 0 && <FriendshipRequestsSection requests={requests} />}
      <FriendsSection friends={friends} />
    </main>
  );
}
