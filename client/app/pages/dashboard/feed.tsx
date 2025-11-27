import { useState } from "react";
import { getInvitationsForUser } from "../../api/InvitationApi";
import {
  confirmInvitation,
  declineInvitation,
  getMeeting,
} from "../../api/MeetingApi";
import EventCard from "../../components/cards/EventCard";
import EventDetails from "../../components/cards/EventDetails";
import type { Route } from "./+types/feed";

export async function clientLoader() {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  if (!user) return [];

  const invites = await getInvitationsForUser(user.id);
  const validInvites = Array.isArray(invites) ? invites : [];

  const meetings = await Promise.all(
    validInvites.map(async (inv) => {
      const meeting = await getMeeting(inv.meetingId);
      return { invitationId: inv.id, meeting };
    }),
  );

  return meetings;
}

export default function Feed({ loaderData }: Route.ComponentProps) {
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [selectedInvitationId, setSelectedInvitationId] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  const today = new Date().toLocaleDateString("lt-LT", {
    month: "long",
    day: "numeric",
    weekday: "long",
  });
  const formattedToday = today.charAt(0).toUpperCase() + today.slice(1);

  const safeData = Array.isArray(loaderData) ? loaderData : [];

  return (
    <main className="p-10">
      <h1 className="text-2xl font-semibold mb-6">{formattedToday}</h1>

      <h2 className="text-lg font-semibold mb-3">Kvietimai į susitikimus</h2>

      <div className="flex gap-4 flex-wrap mb-10">
        {safeData.map((item) => (
          <EventCard
            key={item.meeting.id}
            title={item.meeting.summary || "Susitikimas"}
            subtitle=""
            startDateTime={item.meeting.startDateTime}
            endDateTime={item.meeting.endDateTime}
            users={[
              {
                name: `${item.meeting.owner.firstName} ${item.meeting.owner.lastName}`,
              },
            ]}
            onClick={() => {
              setSelectedMeeting(item.meeting);
              setSelectedInvitationId(item.invitationId);
              setIsOpen(true);
            }}
          />
        ))}
      </div>

      {isOpen && selectedMeeting && (
        <button
          type="button"
          onClick={() => setIsOpen(false)}
          onKeyDown={(e) => e.key === "Enter" && setIsOpen(false)}
          className="fixed inset-0 bg-black/40 backdrop-blur flex justify-center items-center z-50"
        >
          <button
            type="button"
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.stopPropagation()}
            className="outline-none"
          >
            <EventDetails
              meeting={selectedMeeting}
              onClose={() => setIsOpen(false)}
              onConfirm={async () => {
                if (selectedInvitationId != null) {
                  await confirmInvitation(selectedInvitationId);
                  window.location.reload();
                }
              }}
              onDecline={async () => {
                if (selectedInvitationId != null) {
                  await declineInvitation(selectedInvitationId);
                  window.location.reload();
                }
              }}
            />
          </button>
        </button>
      )}
    </main>
  );
}
