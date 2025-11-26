import { getInvitationsForUser } from "../../api/InvitationApi";
import { getMeeting } from "../../api/MeetingApi";
import EventCard from "../../components/cards/EventCard";
import type { Route } from "./+types/feed";

export async function clientLoader() {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  if (!user) return [];

  const invites = await getInvitationsForUser(user.id);

  const meetingCalls = invites.map((inv) => getMeeting(inv.meetingId));
  return Promise.all(meetingCalls);
}

export default function Feed({ loaderData }: Route.ComponentProps) {
  return (
    <main className="p-10">
      <h1 className="text-2xl font-semibold mb-6">
        Lapkričio 9 d., Sekmadienis
      </h1>

      <h2 className="text-lg font-semibold mb-3">Kvietimai į susitikimus</h2>
      <div className="flex gap-4 flex-wrap mb-10">
        {loaderData.map((meeting) => (
          <EventCard
            key={meeting.id}
            title={meeting.summary || "Susitikimas"}
            subtitle=""
            time={`${meeting.startDateTime.slice(11, 16)}–${meeting.endDateTime.slice(11, 16)}`}
            users={[
              {
                name: `Kvietėjas ${meeting.owner.firstName} ${meeting.owner.lastName}`,
              },
            ]}
          />
        ))}
      </div>
    </main>
  );
}
