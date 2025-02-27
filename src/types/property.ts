export interface IUser {
  id: string;
  username: string;
  email: string;
  avatar: string | null;
  no_handphone: string;
  googleId?: number;
  isVerify: boolean;
}

export interface ITenant {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
  no_handphone: string;
  googleId?: number;
  isVerify: boolean;
}

export type UserType = "user" | "tenant" | null;

export interface SessionContext {
  isAuth: boolean;
  type: UserType | null;
  user: IUser | null;
  tenant: ITenant | null;
  checkSession: () => Promise<void>;
  logout: () => void;
  loading: boolean;
}
