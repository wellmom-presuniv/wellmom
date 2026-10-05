// Isi Piringku untuk Ibu Hamil.
// Sumber: Kementerian Kesehatan RI - sehatnegeriku.kemkes.go.id
import { Ionicons } from "@expo/vector-icons";

export type Lang = "id" | "en";
export type Bilingual = Record<Lang, string>;

export const ISI_PIRINGKU_SOURCE = "Kementerian Kesehatan RI - sehatnegeriku.kemkes.go.id";

export interface IsiPiringkuItem {
  key: "staple" | "animal" | "plant" | "vegetable" | "fruit" | "ttd" | "water";
  icon: keyof typeof Ionicons.glyphMap;
  name: Bilingual;
  // Jumlah per hari. Untuk makanan pokok berbeda per trimester; selain itu sama.
  amount: { byTrimester?: Record<1 | 2 | 3, number>; fixed?: number | string };
  unit: Bilingual; // "porsi/hari", "tablet/hari", "gelas/hari"
  portions: Bilingual[]; // takaran 1 porsi
}

export const ISI_PIRINGKU_ITEMS: IsiPiringkuItem[] = [
  {
    key: "staple",
    icon: "restaurant",
    name: { id: "Nasi / makanan pokok", en: "Rice / staple food" },
    amount: { byTrimester: { 1: 5, 2: 6, 3: 6 } },
    unit: { id: "porsi/hari", en: "portions/day" },
    portions: [{ id: "1 porsi = 100 gr atau 3/4 gelas nasi", en: "1 portion = 100 g or 3/4 glass of rice" }],
  },
  {
    key: "animal",
    icon: "fish",
    name: { id: "Protein hewani", en: "Animal protein" },
    amount: { fixed: 4 },
    unit: { id: "porsi/hari", en: "portions/day" },
    portions: [
      { id: "1 porsi = 50 gr atau 1 potong sedang ikan", en: "1 portion = 50 g or 1 medium piece of fish" },
      { id: "1 porsi = 55 gr atau 1 butir telur ayam", en: "1 portion = 55 g or 1 chicken egg" },
    ],
  },
  {
    key: "plant",
    icon: "nutrition",
    name: { id: "Protein nabati", en: "Plant protein" },
    amount: { fixed: 4 },
    unit: { id: "porsi/hari", en: "portions/day" },
    portions: [
      { id: "1 porsi = 50 gr atau 1 potong sedang tempe", en: "1 portion = 50 g or 1 medium piece of tempeh" },
      { id: "1 porsi = 100 gr atau 2 potong sedang tahu", en: "1 portion = 100 g or 2 medium pieces of tofu" },
    ],
  },
  {
    key: "vegetable",
    icon: "leaf",
    name: { id: "Sayur", en: "Vegetables" },
    amount: { fixed: 4 },
    unit: { id: "porsi/hari", en: "portions/day" },
    portions: [
      {
        id: "1 porsi = 100 gr atau 1 mangkuk sayur matang tanpa kuah",
        en: "1 portion = 100 g or 1 bowl of cooked vegetables without broth",
      },
    ],
  },
  {
    key: "fruit",
    icon: "nutrition-outline",
    name: { id: "Buah", en: "Fruit" },
    amount: { fixed: 4 },
    unit: { id: "porsi/hari", en: "portions/day" },
    portions: [
      { id: "1 porsi = 100 gr atau 1 buah jeruk", en: "1 portion = 100 g or 1 orange" },
      { id: "1 porsi = 100 gr atau 1 potong sedang pisang", en: "1 portion = 100 g or 1 medium piece of banana" },
    ],
  },
  {
    key: "ttd",
    icon: "medical",
    name: { id: "Tablet Tambah Darah (TTD)", en: "Iron-folic acid tablet (TTD)" },
    amount: { fixed: 1 },
    unit: { id: "tablet setiap hari", en: "tablet every day" },
    portions: [],
  },
  {
    key: "water",
    icon: "water",
    name: { id: "Air putih", en: "Water" },
    amount: { fixed: "8-12" },
    unit: { id: "gelas per hari", en: "glasses per day" },
    portions: [],
  },
];

export const ISI_PIRINGKU_NOTES: Bilingual[] = [
  {
    id: "Jenis makanan perlu bervariasi, termasuk yang kaya protein hewani untuk tumbuh kembang janin.",
    en: "Eat a variety of foods, including foods rich in animal protein for the baby's growth and development.",
  },
  {
    id: "Porsi makan lebih banyak, dikonsumsi sedikit tapi sering.",
    en: "Eat larger overall portions, taken in small amounts but frequently.",
  },
  {
    id: "Konsumsi TTD satu butir setiap hari selama kehamilan.",
    en: "Take one iron-folic acid tablet every day throughout pregnancy.",
  },
  {
    id: "Air putih 8-12 gelas per hari mencegah dehidrasi dan melancarkan pencernaan.",
    en: "Drinking 8-12 glasses of water a day prevents dehydration and helps digestion.",
  },
];
