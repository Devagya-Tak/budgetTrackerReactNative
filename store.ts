import { create } from "zustand";

interface UseAuthState {
  isLoggedIn: boolean;
  email: string | null;
  setIsLoggedIn: (boolVal: boolean) => void;
  setEmail: (emailId: string) => void;
}

export const UseAuthStore = create<UseAuthState>((set) => ({
  isLoggedIn: false,
  email: null,
  setIsLoggedIn: (boolVal: boolean) => set({ isLoggedIn: boolVal }),
  setEmail: (emailId: string) => set({ email: emailId }),
}));


export const useExpenseStore = create((set) => ({
  
}))