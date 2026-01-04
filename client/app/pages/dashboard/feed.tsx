import React, { useEffect, useLayoutEffect, useState } from "react";
import { getInvitationsForUser } from "../../api/InvitationApi";
import { confirmInvitation, declineInvitation, getMeeting, initMeeting } from "../../api/MeetingApi";
import { getFriendships } from "../../api/FriendshipApi";
import { getFreeTimes } from "../../api/FreeTimeApi";
import EventCard from "../../components/cards/EventCard";
import EventDetails from "../../components/cards/EventDetails";
import { userContext } from "../../context";
import type { Meeting } from "../../models/Meeting";
import type { FreeTimeDTO } from "../../models/FreeTimeDTO";
import type { Route } from "./+types/feed";
import { FiCalendar } from "react-icons/fi";
import { useNavigate, useSearchParams, useRevalidator } from "react-router";
import {
  endOfWeek,
  formatDateForInput, isSameDay, overlaps,
  parseLocalDateTime,
  startOfWeek,
  toBackendLocalDateTime
} from "../../utilities/date.ts";
import { getFriendForInvitation, getFriendForMeeting, InvitationItem } from "../../utilities/feedHelpers.ts";

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
  freeTimeId: number;
  users: { firstName: string; lastName: string, friendId: number }[];
  invitationSent?: boolean;
};

type LoaderData = {
  userId: number;
  invitations: InvitationItem[];
  friendFreeTimes: FriendFreeTimeCard[];
  overlappingFreeTimes: FriendFreeTimeCard[];
  joinableMeetings: Meeting[];
  selectedDateStr: string;
};

export async function clientLoader({ context, request }: Route.ClientLoaderArgs) {
  const user = context.get(userContext);
  if (!user?.id) {
    return {
      userId: 0,
      invitations: [],
      friendFreeTimes: [],
      overlappingFreeTimes: [],
      joinableMeetings: [],
      selectedDateStr: formatDateForInput(new Date()),
    } satisfies LoaderData;
  }

  const userId = user.id;

  const url = new URL(request.url);
  const dateParam = url.searchParams.get('date');
  const selectedDate = dateParam ? new Date(dateParam) : new Date();
  selectedDate.setHours(0, 0, 0, 0);

  const invites = await getInvitationsForUser(userId);
  const validInvites = Array.isArray(invites) ? invites : [];

  const invitations: InvitationItem[] = await Promise.all(
    validInvites.map(async (inv) => ({
      invitation: inv,
      meeting: await getMeeting(inv.meetingId),
    })),
  );

  const sentFreeTimeIds = new Set<number>();
  invitations.forEach(({ invitation, meeting }) => {
    if (invitation.inviterId === userId &&
        invitation.status === "SENT" &&
        meeting.freeTimeId) {
      sentFreeTimeIds.add(meeting.freeTimeId);
    }
  });

  const friendships = await getFriendships(userId);
  const friends: FriendLite[] = (Array.isArray(friendships) ? friendships : []).map((f: any) => ({
    friendId: f.friendId,
    firstName: f.firstName ?? "",
    lastName: f.lastName ?? "",
  }));

  const weekStart = startOfWeek(selectedDate);
  const weekEnd = endOfWeek(selectedDate);

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
        freeTimeId: ft.id,
        users: [{ firstName: friend.firstName, lastName: friend.lastName, friendId: friend.friendId }],
        invitationSent: sentFreeTimeIds.has(ft.id),
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
            freeTimeId: f.id,
            users: [{ firstName: friend.firstName, lastName: friend.lastName, friendId: friend.friendId }],
            invitationSent: sentFreeTimeIds.has(f.id),
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
    selectedDateStr: formatDateForInput(selectedDate),
  } satisfies LoaderData;
}

function Section({
  title,
  itemsCount,
  availableUsers,
  selectedUser,
  onUserChange,
  children,
}: {
  title: string;
  itemsCount: number;
  availableUsers?: { id: number; name: string }[];
  selectedUser?: number | null;
  onUserChange?: (userId: number | null) => void;
  children: () => React.ReactNode;
}) {
  const VISIBLE = 4;
  const [page, setPage] = useState(0);

  const nodes = React.Children.toArray(children());
  const totalPages = Math.max(1, Math.ceil(itemsCount / VISIBLE));
  const clampedPage = Math.min(page, totalPages - 1);

  useLayoutEffect(() => {
    if (page !== clampedPage) setPage(clampedPage);
  }, [page, clampedPage]);

  return (
    <section className="mb-6">
      <div className="flex items-center justify-between mb-2">
      <h2 className="text-lg font-semibold mb-2">{title}</h2>
        {availableUsers && availableUsers.length > 0 && onUserChange && (
            <select
              value={selectedUser ?? ''}
              onChange={(e) => onUserChange(e.target.value ? Number(e.target.value) : null)}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Visi vartotojai</option>
              {availableUsers.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name}
                  </option>
              ))}
            </select>
        )}
      </div>

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
                <div key={pageIndex} className="grid grid-cols-4 min-w-0">
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
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const revalidator = useRevalidator();

  const [selectedDate, setSelectedDate] = useState(() => {
    const dateParam = searchParams.get('date');
    if (dateParam) {
      const date = new Date(dateParam);
      date.setHours(0, 0, 0, 0);
      return date;
    }
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
  });
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);
  const [selectedInvitationId, setSelectedInvitationId] = useState<number | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const [invitationsUserFilter, setInvitationsUserFilter] = useState<number | null>(null);
  const [overlappingUserFilter, setOverlappingUserFilter] = useState<number | null>(null);
  const [joinableUserFilter, setJoinableUserFilter] = useState<number | null>(null);
  const [friendFreeTimesUserFilter, setFriendFreeTimesUserFilter] = useState<number | null>(null);

  useEffect(() => {
    const dateParam = searchParams.get('date');
    if (dateParam) {
      const urlDate = new Date(dateParam);
      urlDate.setHours(0, 0, 0, 0);
      if (urlDate.getTime() !== selectedDate.getTime()) {
        setSelectedDate(urlDate);
      }
    }
  }, [searchParams]);

  const data = (loaderData ?? {}) as LoaderData;

  const allInvitations = Array.isArray(data.invitations) ? data.invitations : [];
  const allOverlappingFreeTimes = Array.isArray(data.overlappingFreeTimes) ? data.overlappingFreeTimes : [];
  const allFriendFreeTimes = Array.isArray(data.friendFreeTimes) ? data.friendFreeTimes : [];
  const allJoinableMeetings = Array.isArray(data.joinableMeetings) ? data.joinableMeetings : [];

  const filterByDate = <T extends { startDateTime: string }>(items: T[]): T[] => {
    return items.filter(item => {
      const itemDate = parseLocalDateTime(item.startDateTime);
      return isSameDay(itemDate, selectedDate);
    })
  }

  const getUniqueUsers = (items : { users: { firstName: string; lastName: string; friendId?: number }[] } []) => {
    const usersMap = new Map<number, string>();
    items.forEach(item => {
      item.users.forEach(user => {
        const id = user.friendId ?? 0;
        if (id && !usersMap.has(id)) {
          usersMap.set(id, `${user.firstName} ${user.lastName}`);
        }
      });
    });
    return Array.from(usersMap.entries()).map(([id, name]) => ({ id, name }));
  }

  const dateFilteredInvitations = filterByDate(allInvitations.map(item => ({
    ...item,
    startDateTime: item.meeting.startDateTime
  }))).map(item => {
    const { startDateTime, ...rest } = item;
    return rest;
  });

  const invitationUsers = getUniqueUsers(
      dateFilteredInvitations.map(item => {
        const friend = getFriendForInvitation(item);
        return {
          users: friend ? [{ ...friend, friendId: Number(friend.id) }] : []
        };
      })
  );

  const invitations = filterByDate(allInvitations.map(item => ({
    ...item,
    startDateTime: item.meeting.startDateTime
  }))).map(item => {
    const { startDateTime, ...rest } = item;
    return rest;
  })

  const dateFilteredOverlapping = filterByDate(allOverlappingFreeTimes);
  const overlappingUsers = getUniqueUsers(dateFilteredOverlapping);
  const overlappingFreeTimes = overlappingUserFilter
        ? dateFilteredOverlapping.filter(item =>
          item.users.some(u => u.friendId === overlappingUserFilter)
      )
      : dateFilteredOverlapping;

  const dateFilteredFriendFreeTimes = filterByDate(allFriendFreeTimes)
  const friendFreeTimesUsers = getUniqueUsers(dateFilteredFriendFreeTimes);
  const friendFreeTimes = friendFreeTimesUserFilter
        ? dateFilteredFriendFreeTimes.filter(item =>
          item.users.some(u => u.friendId === friendFreeTimesUserFilter)
      )
      : dateFilteredFriendFreeTimes;

  const dateFilteredJoinable = filterByDate(allJoinableMeetings);
  const joinableUsers = getUniqueUsers(
      dateFilteredJoinable.map(m => {
        const friend = getFriendForMeeting(m, data.userId);
        return {
          users: friend ? [{ ...friend, friendId: Number(friend.id) }] : []
        };
      })
  );
  const joinableMeetings = joinableUserFilter
        ? dateFilteredJoinable.filter(m => {
          const friend = getFriendForMeeting(m, data.userId);
          return friend && Number(friend.id) === joinableUserFilter;
      })
      : dateFilteredJoinable;

  const handleSendInvite = async (cardKey: string, friendId: number, freeTimeId: number) => {
    try {
      await initMeeting({
        userId: friendId,
        freeTimeId: freeTimeId,
      });

      revalidator.revalidate();
    } catch (error) {
        console.error("Failed to send invite:", error);
    }
  }

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value) {
      const [year, month, day] = value.split('-').map(Number);
      const newDate = new Date(year, month - 1, day);
      newDate.setHours(0, 0, 0, 0);
      setSelectedDate(newDate);

      navigate(`?date=${value}`, { replace: true });

      revalidator.revalidate();
    }
  };

  const formattedDate = selectedDate.toLocaleDateString("lt-LT", {
    month: "long",
    day: "numeric",
    weekday: "long",
  });
  const capitalizedDate = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);

  return (
    <main className="p-10 min-w-0 max-w-full overflow-x-hidden">
      <div className="flex items-center gap-3 mb-4">
        <h1 className="text-2xl font-semibold">{capitalizedDate}</h1>
        <label className="relative cursor-pointer inline-block group">
          <FiCalendar className="text-gray-600 group-hover:text-blue-500 transition" size={24}/>
          <input
            type="date"
            value={formatDateForInput(selectedDate)}
            onChange={handleDateChange}
            className="absolute inset-0 opacity-0 cursor-pointer"
          />
        </label>
      </div>

      <Section
          title="Kvietimai į susitikimus"
          itemsCount={invitations.length}
          availableUsers={invitationUsers}
          selectedUser={invitationsUserFilter}
          onUserChange={setInvitationsUserFilter}
      >
        {() =>
          invitations.map((item) => {
            const friend = getFriendForInvitation(item);

            if (!friend) return null;

            return (
              <EventCard
                key={item.meeting.id}
                title={item.meeting.summary || "Susitikimas"}
                subtitle=""
                startDateTime={item.meeting.startDateTime}
                endDateTime={item.meeting.endDateTime}
                users={[{ firstName: friend.firstName, lastName: friend.lastName }]}
                onClick={() => {
                  setSelectedMeeting(item.meeting);
                  setSelectedInvitationId(item.invitation.id);
                  setIsOpen(true);
                }}
              />
            );
          })
        }
      </Section>

      <Section
          title="Laisvų laikų sutapimai"
          itemsCount={overlappingFreeTimes.length}
          availableUsers={overlappingUsers}
          selectedUser={overlappingUserFilter}
          onUserChange={setOverlappingUserFilter}
      >
        {() => overlappingFreeTimes.map((c) => (
            <EventCard
                key={c.key}
                {...c}
                onClick={() => {}}
                onButtonClick={() => handleSendInvite(c.key, c.users[0].friendId, c.freeTimeId)}
                inviteSent={c.invitationSent}
            />
        ))}
      </Section>

      <Section
        title="Susitikimai, prie kurių galima prisijungti"
        itemsCount={joinableMeetings.length}
        availableUsers={joinableUsers}
        selectedUser={joinableUserFilter}
        onUserChange={setJoinableUserFilter}
      >
        {() =>
          joinableMeetings.map((m) => {
            const friend = getFriendForMeeting(m, data.userId);

            return (
              <EventCard
                key={m.id}
                title={m.summary || "Susitikimas"}
                subtitle=""
                startDateTime={m.startDateTime}
                endDateTime={m.endDateTime}
                users={[{ firstName: friend.firstName, lastName: friend.lastName }]}
                onClick={() => {}}
              />
            );
          })
        }
      </Section>

      <Section
          title="Draugų laisvi laikai"
          itemsCount={friendFreeTimes.length}
          availableUsers={friendFreeTimesUsers}
          selectedUser={friendFreeTimesUserFilter}
          onUserChange={setFriendFreeTimesUserFilter}
      >
        {() => friendFreeTimes.map((c) => (
            <EventCard
                key={c.key}
                {...c}
                onClick={() => {}}
                onButtonClick={() => handleSendInvite(c.key, c.users[0].friendId, c.freeTimeId)}
                inviteSent={c.invitationSent}
            />
        ))}
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
