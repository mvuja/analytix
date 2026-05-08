export type User = {
  id: number;
  name: string;
  email: string;
};

export type AuthPayload = {
  email: string;
  password: string;
};

export type RegisterPayload = AuthPayload & {
  name: string;
};
