import type React from "react";
import type { Friendship } from "../../models/Friendship";
import FriendCard from "./FriendCard";

interface FriendsSectionProps {
  friends: Friendship[];
}

const FriendsSection: React.FC<FriendsSectionProps> = ({ friends }) => {
  return (
    <section className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
      <h2 className="text-2xl font-semibold pb-4 mb-6 text-gray-700 border-b border-gray-300">
        Draugai
      </h2>
      {friends.length === 0 ? (
        <p className="text-gray-500">Dar neturi draugų.</p>
      ) : (
        <ul>
          {friends.map((friend) => (
            <FriendCard key={friend.friendshipId} friend={friend} />
          ))}
        </ul>
      )}
    </section>
  );
};

export default FriendsSection;
