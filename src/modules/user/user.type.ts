export interface IUser {
  id: number;
  name: string;
  email: string;
  password: string;
  city: string;
  state: string;
  phone: string;
  newEmail: string | null;
  emailToken: string | null;
  emailTokenExpires: Date | null;
  status: 0 | 1;
}
