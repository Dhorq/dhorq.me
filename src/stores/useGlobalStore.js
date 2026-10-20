import { create } from "zustand";

const useGlobalStore = create((set) => ({
  darkMode: true,
  selectedNavbar: null,
  introDone: false,
  toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),
  setSelectedNavbar: (name) => {
    set({ selectedNavbar: name });
  },
  setIntroDone: (value = true) => set({ introDone: value }),
}));

export default useGlobalStore;
