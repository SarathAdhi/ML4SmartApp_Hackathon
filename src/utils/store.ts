import { filterDoc } from "@backend/lib";
import { where } from "firebase/firestore";
import { User } from "types/user";
import { create } from "zustand";

type UseStoreProps = {
  user: User | null;
  isAdmin: boolean;
  logout: () => void;
  getProfile: () => void;
};

export const useStore = create<UseStoreProps>((set) => ({
  user: null,

  isAdmin: false,

  logout: () => {
    localStorage.removeItem("token");
    set({ user: null, isAdmin: false });
  },

  getProfile: async () => {
    const token = localStorage.getItem("token")!;

    if (!token) return;

    try {
      const res = await filterDoc("user", where("uuid", "==", token));

      if (res.length === 0) return;

      const user = res[0];
      delete user["password"];

      localStorage.setItem("token", user.uuid);

      console.log({ user });

      set({ user, isAdmin: user.isAdmin });
    } catch ({ error }) {
      localStorage.removeItem("token");
    }
  },
}));
