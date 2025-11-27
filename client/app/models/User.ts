export type User = {
  id: number;
  username: string;
  password: string;
  firstName: string;
  lastName: string;
};

export type AuthenticationResponse = {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  token: string;
};
