import { create } from "zustand";
import apiClient from "../api/client";

interface ChecklistItem {
  item_id: string;
  label: string;
  category: string | null;
  order_index: number;
}

interface ChecklistState {
  items: ChecklistItem[];
  checkedByDate: Record<string, Record<string, boolean>>;
  initialized: boolean;
  isLoading: boolean;
  load: () => Promise<void>;
  toggle: (itemId: string, dateKey: string, todayKey: string) => Promise<void>;
  reset: () => void;
}

export const useChecklistStore = create<ChecklistState>((set, get) => ({
  items: [],
  checkedByDate: {},
  initialized: false,
  isLoading: false,

  load: async () => {
    if (get().initialized) return;
    set({ isLoading: true });
    try {
      const [{ data: todayData }, { data: historyData }] = await Promise.all([
        apiClient.get("/checklist/today"),
        apiClient.get("/checklist/history?limit=30"),
      ]);

      console.log("✅ todayData items:", todayData.items?.map((i: any) => `${i.label}: ${i.is_completed}`));
  
      const newChecked: Record<string, Record<string, boolean>> = {};

      // Today
      const todayKey = new Date().toLocaleDateString("sv-SE");
      console.log("todayKey:", todayKey);
      const todayChecked: Record<string, boolean> = {};
      (todayData.items ?? []).forEach((item: any) => {
        todayChecked[item.item_id] = item.is_completed;
      });
      newChecked[todayKey] = todayChecked;
      console.log("✅ newChecked for today:", JSON.stringify(newChecked[todayKey]));
      console.log("✅ todayKey in newChecked:", todayKey);

      // History
      historyData.forEach((day: any) => {
        const dayChecked: Record<string, boolean> = {};
        (day.items ?? []).forEach((item: any) => {
          dayChecked[item.item_id] = item.is_completed;
        });
        newChecked[day.date] = dayChecked;
      });

      set({
        items: todayData.items ?? [],
        checkedByDate: newChecked,
        initialized: true,
        isLoading: false,
      });
    } catch (err) {
      console.warn("Gagal load checklist:", err);
      set({ isLoading: false });
    }
  },

  toggle: async (itemId: string, dateKey: string, todayKey: string) => {
    if (dateKey > todayKey) return;

    const { checkedByDate } = get();
    const currentVal = !!checkedByDate[dateKey]?.[itemId];

    // Optimistic update
    set((state) => ({
      checkedByDate: {
        ...state.checkedByDate,
        [dateKey]: { ...state.checkedByDate[dateKey], [itemId]: !currentVal },
      },
    }));

    try {
      await apiClient.post(`/checklist/${itemId}/log?date=${dateKey}`);
    } catch (err) {
      console.warn("Gagal toggle:", err);
      // Rollback
      set((state) => ({
        checkedByDate: {
          ...state.checkedByDate,
          [dateKey]: { ...state.checkedByDate[dateKey], [itemId]: currentVal },
        },
      }));
    }
  },

  reset: () => set({ items: [], checkedByDate: {}, initialized: false }),
}));