import type React from "react";
import type { FriendshipRequest } from "../../models/Friendship";

interface FriendshipRequestsSectionProps {
    requests: FriendshipRequest[];
}

const FriendshipRequestsSection: React.FC<FriendshipRequestsSectionProps> = ({ 
    requests,
}) => {
    return (
        <section className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <h2 className="text-2xl font-semibold mb-6 text-gray-700">
                Žmonės, norintys tapti jūsų draugais
            </h2>
            <ul className="divide-y divide-gray-200">
                {requests.map(r => (
                    <li key={r.friendshipId} className="py-1">
                        {r.firstName} {r.lastName} — requested at{" "}
                        {new Date(r.requestDateTime).toLocaleString()}
                    </li>
                ))}
            </ul>
        </section>
    );
};

export default FriendshipRequestsSection;
