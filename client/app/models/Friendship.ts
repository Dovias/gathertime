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
