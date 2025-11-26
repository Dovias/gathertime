import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getInvitationsForUser } from "../../api/InvitationApi";
import { getMeeting } from "../../api/MeetingApi";
import type { Meeting } from "../../models/Meeting";
import { AppRoutes } from "../../utilities/Routes";
import EventCard from "../cards/EventCard";
import Navigation from "./Navigation";

export default function Events() {
  const navigate = useNavigate();

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      localStorage.removeItem("user");
      navigate(AppRoutes.LOG_IN);
    }
  };

  const user = JSON.parse(localStorage.getItem("user") || "null");
  const [meetings, setMeetings] = useState<Meeting[]>([]);

  useEffect(() => {
    if (!user) return;

    async function load() {
      try {
        const invites = await getInvitationsForUser(user.id);

        // Fetch meeting info for each invitation
        const meetingCalls = invites.map((inv) => getMeeting(inv.meetingId));
        const meetingData = await Promise.all(meetingCalls);

        setMeetings(meetingData);
      } catch (e) {
        console.error("Failed loading meetings from invitations:", e);
      }
    }

    load();
  }, [user]);

  return (
    <div className="min-h-screen flex bg-gray-50">
      <Navigation onLogout={handleLogout} />

      <main className="flex-grow p-10">
        <h1 className="text-2xl font-semibold mb-6">
          Lapkričio 9 d., Sekmadienis
        </h1>

        {/* ========== INVITATIONS SECTION ========== */}
        <h2 className="text-lg font-semibold mb-3">Kvietimai į susitikimus</h2>
        <div className="flex gap-4 flex-wrap mb-10">
          {meetings.map((m) => (
            <EventCard
              key={m.id}
              title={m.summary || "Susitikimas"}
              subtitle=""
              time={`${m.startDateTime.slice(11, 16)}–${m.endDateTime.slice(11, 16)}`}
              users={[
                { name: `Kvietėjas ${m.owner.firstName} ${m.owner.lastName}` },
              ]}
            />
          ))}
        </div>
      </main>
    </div>
  );
}
