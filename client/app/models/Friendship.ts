export interface Friendship {
  friendshipId: number;
  friendId: number;
  firstName: string;
  lastName: string;
}

export interface FriendshipRequest {
  friendshipId: number;
  friendId: number;
  firstName: string;
  lastName: string;
  requestDateTime: string;
}

export type FriendshipStatus =
  | "NOT_FOUND"
  | "REQUESTED"
  | "NOT_CONFIRMED"
  | "CONFIRMED"
  | "DECLINED";

export type CreateFriendshipRequestDTO = {
  userId: number;
  friendId: number;
};

export type FriendshipStatusDTO = {
  friendshipStatus: FriendshipStatus;
};
