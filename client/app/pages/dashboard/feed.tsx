import React, { useLayoutEffect, useState } from "react";
import { getInvitationsForUser } from "../../api/InvitationApi";
import { confirmInvitation, declineInvitation, getMeeting } from "../../api/MeetingApi";
import { getFriendships } from "../../api/FriendshipApi";
import { getFreeTimes } from "../../api/FreeTimeApi";
import EventCard from "../../components/cards/EventCard";
import EventDetails from "../../components/cards/EventDetails";
import { userContext } from "../../context";
import type { Meeting } from "../../models/Meeting";
import type { FreeTimeDTO } from "../../models/FreeTimeDTO";
import { getFormattedDate } from "../../utilities/date";
import type { Route } from "./+types/feed";

type InvitationItem = { invitationId: number; meeting: Meeting };

type FriendLite = {
  friendId: number;
  firstName: string;
  lastName: string;
};

type FriendFreeTimeCard = {
  key: string;
  title: string;
  subtitle: string;
  startDateTime: string;
  endDateTime: string;
  users: { name: string }[];
};

type LoaderData = {
  userId: number;
  invitations: InvitationItem[];
  friendFreeTimes: FriendFreeTimeCard[];
  overlappingFreeTimes: FriendFreeTimeCard[];
  joinableMeetings: Meeting[];
};

const pad = (n: number) => String(n).padStart(2, "0");

const toBackendLocalDateTime = (d: Date) =>
  `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
    d.getHours(),
  )}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;

const startOfWeek = (base: Date) => {
  const start = new Date(base);
  start.setDate(start.getDate() - start.getDay() + 1);
  start.setHours(0, 0, 0, 0);
  return start;
};

const endOfWeek = (base: Date) => {
  const start = startOfWeek(base);
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  end.setHours(23, 59, 59, 0);
  return end;
};

const parseLocalDateTime = (value: string): Date => {
  const normalized = value.trim().replace(" ", "T");
  const [datePart, timePart = "00:00:00"] = normalized.split("T");
  const [y, m, d] = datePart.split("-").map(Number);
  const [hh = "0", mm = "0", ssRaw = "0"] = timePart.split(":");
  const [ss = "0", ms = "0"] = ssRaw.split(".");
  return new Date(y, m - 1, d, Number(hh), Number(mm), Number(ss), Number(ms));
};

const overlaps = (aStart: Date, aEnd: Date, bStart: Date, bEnd: Date) =>
  aStart <= bEnd && aEnd >= bStart;

export async function clientLoader({ context }: Route.ClientLoaderArgs) {
  const user = context.get(userContext);
  if (!user?.id) {
    return {
      userId: 0,
      invitations: [],
      friendFreeTimes: [],
      overlappingFreeTimes: [],
      joinableMeetings: [],
    } satisfies LoaderData;
  }

  const userId = user.id;

  const invites = await getInvitationsForUser(userId);
  const validInvites = Array.isArray(invites) ? invites : [];

  const invitations: InvitationItem[] = await Promise.all(
    validInvites.map(async (inv) => ({
      invitationId: inv.id,
      meeting: await getMeeting(inv.meetingId),
    })),
  );

  const friendships = await getFriendships(userId);
  const friends: FriendLite[] = (Array.isArray(friendships) ? friendships : []).map((f: any) => ({
    friendId: f.friendId,
    firstName: f.firstName ?? "",
    lastName: f.lastName ?? "",
  }));

  const now = new Date();
  const weekStart = startOfWeek(now);
  const weekEnd = endOfWeek(now);

  const friendFreeTimesRaw = await Promise.all(
    friends.map(async (fr) => ({
      friend: fr,
      freeTimes: (await getFreeTimes(
        fr.friendId,
        toBackendLocalDateTime(weekStart),
        toBackendLocalDateTime(weekEnd),
      )) as FreeTimeDTO[],
    })),
  );

  const friendFreeTimes: FriendFreeTimeCard[] = friendFreeTimesRaw.flatMap(
    ({ friend, freeTimes }) =>
      freeTimes.map((ft) => ({
        key: `friend-${friend.friendId}-${ft.id}`,
        title: "Laisvas laikas",
        subtitle: ft.pastimeType ?? "",
        startDateTime: ft.startDateTime,
        endDateTime: ft.endDateTime,
        users: [{ name: `${friend.firstName} ${friend.lastName}`.trim() }],
      })),
  );

  const myFreeTimes = (await getFreeTimes(
    userId,
    toBackendLocalDateTime(weekStart),
    toBackendLocalDateTime(weekEnd),
  )) as FreeTimeDTO[];

  const overlappingFreeTimes: FriendFreeTimeCard[] = [];
  const seen = new Set<string>();

  for (const { friend, freeTimes } of friendFreeTimesRaw) {
    for (const f of freeTimes) {
      const fStart = parseLocalDateTime(f.startDateTime);
      const fEnd = parseLocalDateTime(f.endDateTime);

      if (
        myFreeTimes.some((me) =>
          overlaps(
            fStart,
            fEnd,
            parseLocalDateTime(me.startDateTime),
            parseLocalDateTime(me.endDateTime),
          ),
        )
      ) {
        const uniq = `${friend.friendId}-${f.id}`;
        if (!seen.has(uniq)) {
          seen.add(uniq);
          overlappingFreeTimes.push({
            key: `overlap-${uniq}`,
            title: "Laisvų laikų sutapimas",
            subtitle: f.pastimeType ?? "",
            startDateTime: f.startDateTime,
            endDateTime: f.endDateTime,
            users: [{ name: `${friend.firstName} ${friend.lastName}`.trim() }],
          });
        }
      }
    }
  }

  return {
    userId,
    invitations,
    friendFreeTimes,
    overlappingFreeTimes,
    joinableMeetings: [],
  } satisfies LoaderData;
}


function Section({
  title,
  itemsCount,
  children,
}: {
  title: string;
  itemsCount: number;
  children: () => React.ReactNode;
}) {
  const VISIBLE = 3;
  const [page, setPage] = useState(0);

  const nodes = React.Children.toArray(children());
  const totalPages = Math.max(1, Math.ceil(itemsCount / VISIBLE));
  const clampedPage = Math.min(page, totalPages - 1);

  useLayoutEffect(() => {
    if (page !== clampedPage) setPage(clampedPage);
  }, [page, clampedPage]);

  return (
    <section className="mb-6">
      <h2 className="text-lg font-semibold mb-2">{title}</h2>

      {itemsCount === 0 ? (
        <div className="text-sm text-gray-500">Nėra duomenų</div>
      ) : (
        <>
          <div className="w-full overflow-hidden">
            <div
              className="grid grid-flow-col auto-cols-[100%] transition-transform duration-300 ease-out"
              style={{ transform: `translateX(-${clampedPage * 100}%)` }}
            >
              {Array.from({ length: totalPages }).map((_, pageIndex) => (
                <div key={pageIndex} className="grid grid-cols-3 gap-2 min-w-0">
                  {nodes
                    .slice(pageIndex * VISIBLE, pageIndex * VISIBLE + VISIBLE)
                    .map((node, i) => (
                      <div key={(node as any)?.key ?? i} className="min-w-0 overflow-hidden">
                        {node}
                      </div>
                    ))}
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-center gap-2 mt-2">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={clampedPage === 0}
              className="w-8 h-8 rounded-md border border-blue-300 bg-blue-50 text-blue-500 hover:bg-blue-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
              aria-label="Previous"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={clampedPage === totalPages - 1}
              className="w-8 h-8 rounded-md border border-blue-300 bg-blue-50 text-blue-500 hover:bg-blue-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
              aria-label="Next"
            >
              ›
            </button>
          </div>
        </>
      )}
    </section>
  );
}

export default function Feed({ loaderData }: Route.ComponentProps) {
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);
  const [selectedInvitationId, setSelectedInvitationId] = useState<number | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const data = (loaderData ?? {}) as LoaderData;

  const invitations = Array.isArray(data.invitations) ? data.invitations : [];
  const overlappingFreeTimes = Array.isArray(data.overlappingFreeTimes) ? data.overlappingFreeTimes : [];
  const friendFreeTimes = Array.isArray(data.friendFreeTimes) ? data.friendFreeTimes : [];
  const joinableMeetings = Array.isArray(data.joinableMeetings) ? data.joinableMeetings : [];

  const getFriendForMeeting = (meeting: Meeting) =>
    (meeting as any)?.owner?.id === data.userId
      ? (meeting as any)?.users?.find((u: any) => u.id !== data.userId)
      : (meeting as any)?.owner;

  return (
    <main className="p-10 min-w-0 max-w-full overflow-x-hidden">
      <h1 className="text-2xl font-semibold mb-4">{getFormattedDate()}</h1>

      <Section title="Kvietimai į susitikimus" itemsCount={invitations.length}>
        {() =>
          invitations.map((item) => {
            const friend = getFriendForMeeting(item.meeting);
            const friendFullName = friend ? `${friend.firstName} ${friend.lastName}` : "Draugas";

            return (
              <EventCard
                key={item.meeting.id}
                title={item.meeting.summary || "Susitikimas"}
                subtitle=""
                startDateTime={item.meeting.startDateTime}
                endDateTime={item.meeting.endDateTime}
                users={[{ name: friendFullName }]}
                onClick={() => {
                  setSelectedMeeting(item.meeting);
                  setSelectedInvitationId(item.invitationId);
                  setIsOpen(true);
                }}
              />
            );
          })
        }
      </Section>

      <Section title="Laisvų laikų sutapimai" itemsCount={overlappingFreeTimes.length}>
        {() => overlappingFreeTimes.map((c) => <EventCard key={c.key} {...c} onClick={() => {}} />)}
      </Section>

      <Section
        title="Susitikimai, prie kurių galima prisijungti"
        itemsCount={joinableMeetings.length}
      >
        {() =>
          joinableMeetings.map((m) => {
            const friend = getFriendForMeeting(m);
            const friendFullName = friend ? `${friend.firstName} ${friend.lastName}` : "Draugas";

            return (
              <EventCard
                key={m.id}
                title={m.summary || "Susitikimas"}
                subtitle=""
                startDateTime={m.startDateTime}
                endDateTime={m.endDateTime}
                users={[{ name: friendFullName }]}
                onClick={() => {}}
              />
            );
          })
        }
      </Section>

      <Section title="Draugų laisvi laikai" itemsCount={friendFreeTimes.length}>
        {() => friendFreeTimes.map((c) => <EventCard key={c.key} {...c} onClick={() => {}} />)}
      </Section>

      {isOpen && selectedMeeting && (
        <button
          type="button"
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/40 backdrop-blur flex items-center justify-center z-50"
        >
          <div onClick={(e) => e.stopPropagation()}>
            <EventDetails
              meeting={selectedMeeting}
              onClose={() => setIsOpen(false)}
              onConfirm={async () => {
                if (selectedInvitationId != null) {
                  await confirmInvitation(selectedInvitationId);
                  location.reload();
                }
              }}
              onDecline={async () => {
                if (selectedInvitationId != null) {
                  await declineInvitation(selectedInvitationId);
                  location.reload();
                }
              }}
            />
          </div>
        </button>
      )}
    </main>
  );
}
