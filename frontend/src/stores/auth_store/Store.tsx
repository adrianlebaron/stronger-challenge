import { create } from "zustand";
import { persist } from "zustand/middleware";

type UserProfile = {
  age: number | null;
  height: number | null;
  formatted_height: string;
  weight: number | null;
  roles: string;
  shirt_size: string;
  language: string;
  registration: boolean;
  isJunior: boolean;
}

type User= {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  profile: UserProfile;
  date_joined: string;
}

type Store = {
  token: string;
  user: User | null;
}

type Actions = {
  setToken: (token: string) => void;
  setUser: (user: User | null) => void;
}

export const authStore = create<Store & Actions>()(
  persist((set) => ({
    token: '',
    user: null,
    setToken: (token) => set((state) => ({...state, token: token })),
    setUser: (user) => set((state) => ({ ...state, user: user })),
  }),
    {
      name: 'auth',
    }
  )
)