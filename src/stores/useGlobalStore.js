import { create } from "zustand";

const useGlobalStore = create((set) => ({
  darkMode: true,
  selectedNavbar: null,
  toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),
  setSelectedNavbar: (name) => {
    set({ selectedNavbar: name });
  },
}));

export default useGlobalStore;
