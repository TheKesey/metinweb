export type Locale = "hu" | "en";
export type Realm = "red" | "blue" | "yellow";
export type CharClass = "warrior" | "assassin" | "shaman" | "archer";
export type Rarity = "common" | "magic" | "rare" | "epic" | "legend";
export type ItemCategory = "costumes" | "mounts" | "pets" | "consumable" | "storage" | "bundle";

export interface NewsPost {
  id: string;
  tag: string;
  tagColor: string;
  date: string;
  title_hu: string;
  title_en: string;
  excerpt_hu: string;
  excerpt_en: string;
  author: string;
  read_min: number;
  body_hu: string[];
  body_en: string[];
}

export interface ShopItem {
  id: string;
  name_hu: string;
  name_en: string;
  cat: ItemCategory;
  rarity: Rarity;
  price: number;
  oldPrice: number | null;
  popular: number;
  new: boolean;
  desc_hu: string;
  desc_en: string;
}

export interface Player {
  rank: number;
  name: string;
  level: number;
  class: CharClass;
  realm: Realm;
  score: number;
  guild: string;
}

export interface Location {
  id: string;
  name_hu: string;
  name_en: string;
}

export interface OnlinePlayer {
  id: string;
  name: string;
  level: number;
  class: CharClass;
  realm: Realm;
  loc: string;
  ms: number;
}

export interface Guild {
  name: string;
  members: number;
  score: number;
  leader: string;
}

export interface LiveFeedEntry {
  who: string;
  what_hu: string;
  what_en: string;
  t: string;
}

export interface Character {
  name: string;
  level: number;
  class: CharClass;
  realm: Realm;
  playtime: number;
  last: string;
  loc: string;
}

export interface Order {
  id: string;
  date: string;
  item: string;
  item_en: string;
  coins: number;
  status: string;
}

export interface Transaction {
  id: string;
  date: string;
  amount: number;
  method: string;
  status: string;
}

export interface TopupTier {
  coins: number;
  eur: number;
  bonus: number;
  popular?: boolean;
}

export interface CartItem {
  id: string;
  name_hu: string;
  name_en: string;
  price: number;
  qty: number;
  rarity: Rarity;
}

export interface User {
  id: string;
  username: string;
  email: string;
  coins: number;
  vip_tier: number;
  member_since: string;
}
