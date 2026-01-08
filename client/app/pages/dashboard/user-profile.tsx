import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useMatches, useParams } from "react-router";

import { getUserProfileInfo } from "../../api/UserApi";
import {
  confirmFriendship,
  createFriendship,
  declineFriendship, deleteFriendship,
  getFriendshipRequests,
  getRelationshipStatus,
} from "../../api/FriendshipApi";

import type { UserProfileInfo } from "../../models/User";
import type { FriendshipRequest, FriendshipStatus } from "../../models/Friendship";

import { UiAvatar } from "../../components/ui/UiAvatar";
import { userContext } from "../../context";

import type { Route } from "./+types/profile";

type LoaderData = {
  userId: number;
};

export async function clientLoader({ context }: Route.ClientLoaderArgs) {
  const user = context.get(userContext);
  return { userId: user?.id ?? 0 } satisfies LoaderData;
}

function pickUserIdFromMatches(matches: any[]): number {
  for (let i = matches.length - 1; i >= 0; i--) {
    const d = matches[i]?.data;
    if (!d) continue;

    if (typeof d.userId === "number" && d.userId > 0) return d.userId;
    if (typeof d?.user?.id === "number" && d.user.id > 0) return d.user.id;
  }
  return 0;
}

const UserProfilePage: React.FC<Route.ComponentProps> = ({ loaderData }) => {
  const { id } = useParams<{ id: string }>();
  const matches = useMatches();

  const [profile, setProfile] = useState<UserProfileInfo | null>(null);
  const [loading, setLoading] = useState(true);

  const [relationshipLoading, setRelationshipLoading] = useState(false);
  const [relationshipStatus, setRelationshipStatus] = useState<FriendshipStatus | null>(null);

  const [inviteSending, setInviteSending] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [incomingRequestId, setIncomingRequestId] = useState<number | null>(null);
  const [decisionLoading, setDecisionLoading] = useState(false);

  const [friendshipId, setFriendshipId] = useState<number | null>(null);
  const [unfriending, setUnfriending] = useState(false);

  const myUserId = useMemo(() => {
    const fromMatches = pickUserIdFromMatches(matches as any[]);
    if (fromMatches > 0) return fromMatches;
    return (loaderData as LoaderData | undefined)?.userId ?? 0;
  }, [matches, loaderData]);

  const profileUserId = useMemo(() => (id ? Number(id) : 0), [id]);

  const canShowFriendActions = myUserId > 0 && profileUserId > 0 && myUserId !== profileUserId;

  useEffect(() => {
    if (!profileUserId) return;

    const fetchProfile = async () => {
      setLoading(true);
      try {
        const data = await getUserProfileInfo(profileUserId);
        setProfile(data);
      } catch (error) {
        console.error(error);
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [profileUserId]);

  // Resolve the newest incoming request id for THIS profile user
  const resolveIncomingRequestId = useCallback(async (): Promise<number | null> => {
    if (!myUserId || !profileUserId) return null;

    const requests: FriendshipRequest[] = await getFriendshipRequests(myUserId);

    const candidates = requests
      .filter((r) => r.friendId === profileUserId)
      .sort(
        (a, b) =>
          new Date(b.requestDateTime).getTime() - new Date(a.requestDateTime).getTime(),
      );

    return candidates[0]?.friendshipId ?? null;
  }, [myUserId, profileUserId]);

  const refreshRelationship = useCallback(async () => {
    setErrorMsg(null);

    if (!myUserId || !profileUserId || myUserId === profileUserId) {
      setRelationshipStatus(null);
      setIncomingRequestId(null);
      setFriendshipId(null);
      return;
    }

    setRelationshipLoading(true);
    try {
      const dto = await getRelationshipStatus(myUserId, profileUserId);
      setRelationshipStatus(dto.friendshipStatus);
      setFriendshipId(dto.friendshipId);

      if (dto.friendshipStatus === "NOT_CONFIRMED") {
        try {
          const latestId = await resolveIncomingRequestId();
          setIncomingRequestId(latestId);
        } catch (e) {
          console.error(e);
          setIncomingRequestId(null);
        }
      } else {
        setIncomingRequestId(null);
      }
    } catch (e) {
      console.error(e);
      setRelationshipStatus((prev) => prev ?? null);
      setIncomingRequestId((prev) => prev ?? null);
      setFriendshipId((prev) => prev ?? null);
    } finally {
      setRelationshipLoading(false);
    }
  }, [myUserId, profileUserId, resolveIncomingRequestId]);

  useEffect(() => {
    refreshRelationship();
  }, [refreshRelationship]);

  useEffect(() => {
    const onFocus = () => refreshRelationship();
    const onVisibility = () => {
      if (document.visibilityState === "visible") refreshRelationship();
    };

    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      window.removeEventListener("focus", onFocus);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [refreshRelationship]);

  const onInvite = async () => {
    if (!myUserId || !profileUserId) return;

    setInviteSending(true);
    setErrorMsg(null);

    try {
      await createFriendship({ userId: myUserId, friendId: profileUserId });
      setRelationshipStatus("REQUESTED"); // optimistic
      await refreshRelationship();
    } catch (e) {
      console.error(e);
      setErrorMsg("Nepavyko išsiųsti pakvietimo. Bandykite dar kartą.");
    } finally {
      setInviteSending(false);
    }
  };

  // IMPORTANT: confirm/decline may require the paired row id (REQUESTED vs NOT_CONFIRMED).
  // After decline+re-invite, multiple pairs exist, so we try id, then id-1, then id+1.
  const runWithIdFallback = useCallback(
    async (baseId: number, fn: (id: number) => Promise<void>) => {
      const candidates = [baseId, baseId - 1, baseId + 1].filter((x) => x > 0);

      let lastErr: unknown = null;
      for (const cid of candidates) {
        try {
          await fn(cid);
          return; // success
        } catch (e) {
          lastErr = e;
        }
      }
      throw lastErr;
    },
    [],
  );

  const onAccept = async () => {
    setDecisionLoading(true);
    setErrorMsg(null);

    try {
      const baseId = (await resolveIncomingRequestId()) ?? incomingRequestId;

      if (!baseId) {
        setErrorMsg("Nepavyko rasti pakvietimo. Pabandykite dar kartą.");
        return;
      }

      await runWithIdFallback(baseId, confirmFriendship);

      setRelationshipStatus("CONFIRMED"); // optimistic
      await refreshRelationship();
    } catch (e) {
      console.error(e);
      setErrorMsg("Nepavyko priimti pakvietimo. Bandykite dar kartą.");
    } finally {
      setDecisionLoading(false);
    }
  };

  const onDecline = async () => {
    setDecisionLoading(true);
    setErrorMsg(null);

    try {
      const baseId = (await resolveIncomingRequestId()) ?? incomingRequestId;

      if (!baseId) {
        setErrorMsg("Nepavyko rasti pakvietimo. Pabandykite dar kartą.");
        return;
      }

      await runWithIdFallback(baseId, declineFriendship);

      setRelationshipStatus("DECLINED"); // optimistic
      await refreshRelationship();
    } catch (e) {
      console.error(e);
      setErrorMsg("Nepavyko atmesti pakvietimo. Bandykite dar kartą.");
    } finally {
      setDecisionLoading(false);
    }
  };

  const onUnfriend = async () => {
    if (!window.confirm("Ar tikrai norite pašalinti šį draugą?")) return;

    if (!friendshipId) {
      setErrorMsg("Nepavyko rasti draugystės įrašo.");
      return;
    }

    setUnfriending(true);
    setErrorMsg(null);

    try {
      await deleteFriendship(friendshipId);
      setRelationshipStatus("NOT_FOUND");
      await refreshRelationship();
    } catch (e) {
      console.error(e);
      setErrorMsg("Nepavyko pašalinti draugo. Bandykite dar kartą.");
    } finally {
      setUnfriending(false);
    }
  }

  const rightSide = useMemo(() => {
    console.log("Current relationship status:", relationshipStatus); // Add this debug line

    if (!canShowFriendActions) return null;

    if (relationshipLoading) {
      return <div className="text-sm text-gray-500 whitespace-nowrap">Tikrinama...</div>;
    }

    if (relationshipStatus === "NOT_CONFIRMED") {
      return (
        <div className="flex flex-col items-end gap-2">
          <div className="text-sm text-gray-600">Jūs esate pakviestas</div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onAccept}
              disabled={decisionLoading}
              className="px-4 py-2 rounded-xl border border-green-300 bg-green-50 text-green-700 hover:bg-green-100 disabled:opacity-50 disabled:cursor-not-allowed transition font-medium"
            >
              {decisionLoading ? "Vykdoma..." : "Priimti"}
            </button>

            <button
              type="button"
              onClick={onDecline}
              disabled={decisionLoading}
              className="px-4 py-2 rounded-xl border border-red-300 bg-red-50 text-red-700 hover:bg-red-100 disabled:opacity-50 disabled:cursor-not-allowed transition font-medium"
            >
              {decisionLoading ? "Vykdoma..." : "Atmesti"}
            </button>
          </div>
        </div>
      );
    }

   if (relationshipStatus === "CONFIRMED") {
      return (
          <button
              type="button"
              onClick={onUnfriend}
              disabled={unfriending}
              className="px-4 py-2 rounded-xl border border-red-300 bg-red-50 text-red-700 hover:bg-red-100 disabled:opacity-50 disabled:cursor-not-allowed transform font-medium text-sm"
              >
              {unfriending ? "Šalinama..." : "Pašalinti draugą"}
            </button>
      );
    }

    const disabled = inviteSending || relationshipStatus === "REQUESTED";

    const label =
        relationshipStatus === "REQUESTED"
          ? "Pakvietimas išsiųstas"
          : relationshipStatus === "DECLINED"
            ? "Pakviesti iš naujo"
            : "Pakviesti į draugus";

    return (
      <div className="flex flex-col items-end gap-2">
        <button
          type="button"
          onClick={onInvite}
          disabled={disabled}
          className={[
            "px-4 py-2 rounded-xl border transition font-medium whitespace-nowrap",
            disabled
              ? "border-gray-200 bg-gray-50 text-gray-500 cursor-not-allowed"
              : "border-blue-300 bg-blue-50 text-blue-600 hover:bg-blue-100",
          ].join(" ")}
        >
          {inviteSending ? "Siunčiama..." : label}
        </button>
      </div>
    );
  }, [
    canShowFriendActions,
    relationshipLoading,
    relationshipStatus,
    inviteSending,
    decisionLoading,
    unfriending,
    onAccept,
    onDecline,
    onUnfriend,
    onInvite,
  ]);

  if (loading) {
    return <div className="text-center py-10 text-gray-500">Kraunama...</div>;
  }

  if (!profile) {
    return <div className="text-center py-10 text-red-500">Vartotojas nerastas</div>;
  }

  return (
    <main className="w-full max-w-8xl mx-auto py-10 px-8">
      <section className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 flex flex-row items-center justify-between gap-6">
        <div className="flex flex-row items-center gap-6">
          <UiAvatar firstName={profile.firstName} lastName={profile.lastName} size="lg" />
          <h1 className="text-2xl font-semibold text-gray-800 inline-block">
            {profile.firstName} {profile.lastName}
          </h1>
        </div>

        <div className="flex flex-col items-end gap-2">
          {rightSide}
          {errorMsg && <div className="text-sm text-red-500">{errorMsg}</div>}
        </div>
      </section>
    </main>
  );
};

export default UserProfilePage;
