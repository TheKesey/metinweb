import type {
  NewsPost, ShopItem, Player, Location, OnlinePlayer,
  Guild, LiveFeedEntry, Character, Order, Transaction, TopupTier,
} from "@/types";

export const news: NewsPost[] = [
  {
    id: "season-4",
    tag: "tag_event",
    tagColor: "tag-accent",
    date: "2026-05-12",
    title_hu: "Season 4 nyitónap — Yu-síkság újra",
    title_en: "Season 4 launch — Yu Plains reborn",
    excerpt_hu: "Új térkép, új bossz-ciklus, frissített kalandnapló. Top 100 játékos egyedi köntöst kap.",
    excerpt_en: "New map, new boss cycle, refreshed adventure log. Top 100 players receive a unique cloak.",
    author: "Kovács László",
    read_min: 4,
    body_hu: [
      "A Season 4-gyel teljesen újragondoltuk az endgame-et. A Yu-síkság már nem statikus zóna — a klánok hetente versenyeznek a kontrollért, és a győztes klán tagjai dupla drop-bónuszt kapnak.",
      "Új bossz: a Hamuvérű Sárkány. 40 fős raid, 12 perces enrage timer. A kihívás komoly, de a loot is.",
      "Top 100 játékos a season végén egyedi animált köntöst kap, ami csak ott szerezhető meg, és sosem lesz az itemshopban.",
      "Goodluck mindenkinek a sezononban — találkozunk a síkságon.",
    ],
    body_en: [
      "Season 4 reimagines endgame. Yu Plains is no longer a static zone — guilds compete weekly for control, and the winning guild's members get a double-drop bonus.",
      "New boss: the Ashblood Dragon. 40-player raid, 12-minute enrage timer. The challenge is real, but so is the loot.",
      "Top 100 players at season end will receive a unique animated cloak, available only here, never sold in the shop.",
      "Good luck everyone — see you on the plains.",
    ],
  },
  {
    id: "patch-4-1-2",
    tag: "tag_patch",
    tagColor: "tag-accent",
    date: "2026-05-08",
    title_hu: "Patch 4.1.2 — balansz és bug fixek",
    title_en: "Patch 4.1.2 — balance & bug fixes",
    excerpt_hu: "Sámán cooldown frissítve, orgyilkos crit-cap megemelve. 14 hibajavítás.",
    excerpt_en: "Shaman cooldowns tweaked, assassin crit cap raised. 14 bug fixes.",
    author: "DevTeam",
    read_min: 2,
    body_hu: [
      "Sámán: gyógyítás cooldown 8 → 6 mp, áldás-hatás 12% → 14%.",
      "Orgyilkos: crit-cap 60% → 65%, mérgek sebzése 8%-kal nőtt.",
      "Harcos: bersek mód idő 30 → 35 mp.",
      "Bug: a piaci kereső nem mutatta a 100M+ ár fölötti tárgyakat. Javítva.",
      "Bug: a klán-háborús szerverlistán dupla bejegyzések jelentek meg. Javítva.",
    ],
    body_en: [
      "Shaman: heal cooldown 8s → 6s, blessing effect 12% → 14%.",
      "Assassin: crit cap 60% → 65%, poison damage up 8%.",
      "Warrior: berserk duration 30s → 35s.",
      "Bug: market search wouldn't show items priced above 100M. Fixed.",
      "Bug: guild-war server list showed duplicate entries. Fixed.",
    ],
  },
  {
    id: "events-may",
    tag: "tag_event",
    tagColor: "tag-accent",
    date: "2026-05-05",
    title_hu: "Májusi eseménynaptár",
    title_en: "May event schedule",
    excerpt_hu: "Hold-fesztivál, dupla EXP hétvégék, vendéghadjáratok. Az egész hónap programja.",
    excerpt_en: "Moon Festival, double-EXP weekends, guest invasions. The full month at a glance.",
    author: "Eventek",
    read_min: 3,
    body_hu: [
      "Május 10–12: Dupla EXP hétvége (összes szint).",
      "Május 17–18: Hold-fesztivál — különleges hold-érmék gyűjthetők.",
      "Május 22: Vendéghadjárat a Tűzhegy környékén.",
      "Május 25–26: Klán-háború kvalifikációs torna.",
      "Május 30: Nagy bossz-éjszaka — minden bossz 50% gyorsabb spawn.",
    ],
    body_en: [
      "May 10–12: Double-EXP weekend (all levels).",
      "May 17–18: Moon Festival — collect special moon coins.",
      "May 22: Guest invasion near Fire Mountain.",
      "May 25–26: Guild-war qualifier tournament.",
      "May 30: Boss Night — all bosses spawn 50% faster.",
    ],
  },
  {
    id: "devblog-economy",
    tag: "tag_devblog",
    tagColor: "tag-red",
    date: "2026-04-29",
    title_hu: "Devblog: gazdaság és inflációkezelés",
    title_en: "Devblog: economy and inflation control",
    excerpt_hu: "Hogyan tartjuk a yangot stabilan? Részletes leírás a gold-sink rendszerről.",
    excerpt_en: "How we keep yang stable. Deep-dive into our gold-sink design.",
    author: "Nagy Bence",
    read_min: 7,
    body_hu: [
      "A pénzügyi rendszer komplex egyensúly. Túl sok yang és inflációt kapsz, túl kevés és a piac megáll.",
      "A legfontosabb mechanika a heti adó: minden tranzakcióból 2% eltűnik a rendszerből.",
      "Ezen kívül kismértékben módosítjuk a NPC-k áldás-üzleteit, hogy a játékosok költsenek el yangot.",
      "Tervezzük, hogy egy következő patch-ben bevezetjük a 'klán-adózást' is a klán-háborúk után.",
    ],
    body_en: [
      "Currency systems are a delicate balance. Too much yang and you get inflation, too little and the market stalls.",
      "The key mechanic is a weekly tax: 2% of every transaction is sunk.",
      "We also fine-tune NPC blessing shop prices to encourage spending.",
      "We plan to introduce 'guild taxation' in a coming patch after guild wars.",
    ],
  },
  {
    id: "anti-cheat",
    tag: "tag_update",
    tagColor: "tag-accent",
    date: "2026-04-22",
    title_hu: "Új anti-cheat rendszer élesben",
    title_en: "New anti-cheat now live",
    excerpt_hu: "Kernel-szintű védelem, ML-alapú anomália detektálás. 1247 bot bannolva az első héten.",
    excerpt_en: "Kernel-level protection, ML-based anomaly detection. 1,247 bots banned in week one.",
    author: "Security",
    read_min: 5,
    body_hu: [
      "Az új anti-cheat rendszer két fronton dolgozik: a kliens-oldalon kernel-szintű ellenőrzéssel, a szerver-oldalon ML-alapú anomália detektálással.",
      "Az első hét eredménye: 1247 bot bannolva, és minden játékos jelentés átlagosan 4 órán belül kezelve.",
      "Ha gyanakodsz, hogy valaki cheatel, jelentsd a /report paranccsal a játékban.",
    ],
    body_en: [
      "The new anti-cheat works on two fronts: kernel-level checks client-side, ML-based anomaly detection server-side.",
      "Week one results: 1,247 bots banned, every player report handled in ~4 hours.",
      "If you suspect cheating, report it in-game with /report.",
    ],
  },
];

export const items: ShopItem[] = [
  { id: "i1",  name_hu: "Ametiszt köntös",          name_en: "Amethyst Cloak",        cat: "costumes",   rarity: "epic",   price: 850,  oldPrice: 1100, popular: 92, new: false, desc_hu: "Egyedi animációval, csak Season 4 alatt elérhető.", desc_en: "Unique animation, Season 4 exclusive." },
  { id: "i2",  name_hu: "Vasláb mén",               name_en: "Ironfoot Steed",        cat: "mounts",     rarity: "legend", price: 2400, oldPrice: null, popular: 78, new: true,  desc_hu: "30% sebességbónusz, kétüléses.",                   desc_en: "30% speed bonus, two-seater." },
  { id: "i3",  name_hu: "Hold-rókakölyök",           name_en: "Moonkit Fox",           cat: "pets",       rarity: "rare",   price: 600,  oldPrice: null, popular: 85, new: false, desc_hu: "Automatikus loot-gyűjtés 12 mp körönként.",        desc_en: "Auto-loot every 12 seconds." },
  { id: "i4",  name_hu: "Tartalék mána főzet (×100)",name_en: "Mana Tonic ×100",       cat: "consumable", rarity: "common", price: 120,  oldPrice: null, popular: 70, new: false, desc_hu: "Tömeges csomag, 5 mp cooldown.",                   desc_en: "Bulk pack, 5s cooldown after use." },
  { id: "i5",  name_hu: "Pluszláda — kicsi",         name_en: "Storage Vault — small", cat: "storage",    rarity: "magic",  price: 320,  oldPrice: null, popular: 64, new: false, desc_hu: "+20 inventory slot a banki tárolóra.",             desc_en: "+20 inventory slots in your vault." },
  { id: "i6",  name_hu: "Pluszláda — közepes",       name_en: "Storage Vault — medium",cat: "storage",    rarity: "rare",   price: 580,  oldPrice: null, popular: 55, new: false, desc_hu: "+50 inventory slot a banki tárolóra.",             desc_en: "+50 inventory slots in your vault." },
  { id: "i7",  name_hu: "Bronzkupa csomag",          name_en: "Bronze Bundle",         cat: "bundle",     rarity: "rare",   price: 1500, oldPrice: 2000, popular: 88, new: false, desc_hu: "Costume + pet + 1 hetes EXP boost.",               desc_en: "Costume + pet + 1 week EXP boost." },
  { id: "i8",  name_hu: "Aranykupa csomag",          name_en: "Gold Bundle",           cat: "bundle",     rarity: "legend", price: 4200, oldPrice: 5500, popular: 91, new: true,  desc_hu: "Mind a 4 osztály egy-egy köntöse + mount.",        desc_en: "One costume per class + mount." },
  { id: "i9",  name_hu: "Bíbor páncél",             name_en: "Crimson Armor",         cat: "costumes",   rarity: "rare",   price: 480,  oldPrice: null, popular: 60, new: false, desc_hu: "Pirosló fémhatás, közelharc fókusz.",              desc_en: "Glowing crimson finish, melee-themed." },
  { id: "i10", name_hu: "Smaragd köntös",            name_en: "Emerald Robe",          cat: "costumes",   rarity: "magic",  price: 290,  oldPrice: null, popular: 48, new: false, desc_hu: "Erdei sámánok klasszikusa.",                       desc_en: "Forest shaman classic." },
  { id: "i11", name_hu: "Pikkelyes farkas",          name_en: "Scale Wolf",            cat: "pets",       rarity: "epic",   price: 1100, oldPrice: null, popular: 73, new: true,  desc_hu: "Harcsegítő, +5% sebzés bossz ellen.",             desc_en: "Combat pet, +5% damage vs bosses." },
  { id: "i12", name_hu: "EXP főzet ×50",            name_en: "EXP Tonic ×50",         cat: "consumable", rarity: "common", price: 180,  oldPrice: null, popular: 90, new: false, desc_hu: "1 óra +20% EXP, cooldownnal.",                    desc_en: "1 hour +20% EXP, has cooldown." },
];

export const players: Player[] = [
  { rank: 1,  name: "Sárkányölő",    level: 105, class: "warrior",  realm: "red",    score: 14820320, guild: "Vasárnyak" },
  { rank: 2,  name: "Hamuhajnal",    level: 105, class: "shaman",   realm: "blue",   score: 14502100, guild: "Holdlovagok" },
  { rank: 3,  name: "Tűzpenge",      level: 104, class: "assassin", realm: "yellow", score: 13980540, guild: "Vasárnyak" },
  { rank: 4,  name: "Szélfutó",      level: 104, class: "archer",   realm: "blue",   score: 13720980, guild: "Pengevirágok" },
  { rank: 5,  name: "Vasszív",       level: 103, class: "warrior",  realm: "red",    score: 13201450, guild: "Vasárnyak" },
  { rank: 6,  name: "Csillagláng",   level: 103, class: "shaman",   realm: "yellow", score: 12890670, guild: "Hajnalvér" },
  { rank: 7,  name: "Éjjárókőlő",   level: 103, class: "assassin", realm: "red",    score: 12640220, guild: "Csendgyerekek" },
  { rank: 8,  name: "Aranynyíl",     level: 102, class: "archer",   realm: "yellow", score: 12108800, guild: "Pengevirágok" },
  { rank: 9,  name: "Viharkalapács", level: 102, class: "warrior",  realm: "blue",   score: 11920140, guild: "Holdlovagok" },
  { rank: 10, name: "Mohás úr",      level: 101, class: "shaman",   realm: "red",    score: 11643090, guild: "Hajnalvér" },
  { rank: 11, name: "Borotvanyelv",  level: 101, class: "assassin", realm: "blue",   score: 11380250, guild: "Csendgyerekek" },
  { rank: 12, name: "Sólyomszem",    level: 101, class: "archer",   realm: "red",    score: 11108740, guild: "Vasárnyak" },
  { rank: 13, name: "Vasfog",        level: 100, class: "warrior",  realm: "yellow", score: 10803010, guild: "Pengevirágok" },
  { rank: 14, name: "Hajnalcsepp",   level: 100, class: "shaman",   realm: "blue",   score: 10560660, guild: "Holdlovagok" },
  { rank: 15, name: "Árnyékhang",    level: 100, class: "assassin", realm: "yellow", score: 10290400, guild: "Hajnalvér" },
  { rank: 16, name: "Hosszúíj",      level: 99,  class: "archer",   realm: "blue",   score: 10082180, guild: "Pengevirágok" },
  { rank: 17, name: "Faragott Bárd", level: 99,  class: "warrior",  realm: "red",    score: 9870030,  guild: "Vasárnyak" },
  { rank: 18, name: "Tűzlélek",      level: 99,  class: "shaman",   realm: "yellow", score: 9612420,  guild: "Hajnalvér" },
  { rank: 19, name: "Csendcsuklyás", level: 98,  class: "assassin", realm: "blue",   score: 9320150,  guild: "Csendgyerekek" },
  { rank: 20, name: "Tollavas",      level: 98,  class: "archer",   realm: "red",    score: 9081330,  guild: "Pengevirágok" },
];

export const locations: Location[] = [
  { id: "yu",       name_hu: "Yu-síkság",    name_en: "Yu Plains" },
  { id: "fire",     name_hu: "Tűzhegy",      name_en: "Fire Mountain" },
  { id: "icetomb",  name_hu: "Jégsír",       name_en: "Ice Tomb" },
  { id: "redforest",name_hu: "Vörös-erdő",   name_en: "Red Forest" },
  { id: "town",     name_hu: "Főváros",      name_en: "Capital" },
  { id: "dock",     name_hu: "Kikötő",       name_en: "Docks" },
  { id: "dungeon",  name_hu: "Sárkány-mélysír", name_en: "Dragon Crypt" },
];

const _onlineNames = ["Vasszív","Borotvanyelv","Sólyomszem","Mohás úr","Tűzpenge","Csillagláng","Hajnalcsepp","Árnyékhang","Faragott Bárd","Pengevirág","Tollkard","Holdvér","Vasláb","Ezüstkürt","Acélhang","Patakőr","Hamukezű","Vértollas","Csontujj","Csendsuhanó","Hévér","Aranyláb","Vasakarat","Sápadtszem","Tűzgyermek","Holdfutó","Vasujj","Vargakard","Csendszem","Ezüstvér","Tölgyláb","Vörössörény","Aranybőr","Vasláng","Hajnalfény","Csendkürt","Pengeláb","Sólyomtoll","Vasérc","Tűzkard","Csendpenge","Holdkard","Vaserdő","Aranymag","Sápadthold","Vasvér","Tűzkalapács","Csendszív","Holdsuhanó","Aranyhal","Vasmag","Tűzfény","Csendkard","Holdfény","Aranyláng","Vasfog","Sápadtkard","Tűzhang","Csendvér","Holdjelző"];
const _classes: Array<"warrior"|"assassin"|"shaman"|"archer"> = ["warrior","assassin","shaman","archer"];
const _realms: Array<"red"|"blue"|"yellow"> = ["red","blue","yellow"];
export const online: OnlinePlayer[] = _onlineNames.map((n, i) => ({
  id: "p" + i,
  name: n + (i > 0 && i % 7 === 0 ? "#" + (i + 12) : ""),
  level: 60 + ((i * 7) % 46),
  class: _classes[i % 4],
  realm: _realms[i % 3],
  loc: locations[i % locations.length].id,
  ms: 18 + ((i * 13) % 60),
}));

export const guilds: Guild[] = [
  { name: "Vasárnyak",      members: 48, score: 84500000, leader: "Sárkányölő" },
  { name: "Holdlovagok",    members: 42, score: 78200000, leader: "Hamuhajnal" },
  { name: "Pengevirágok",   members: 50, score: 73400000, leader: "Szélfutó" },
  { name: "Hajnalvér",      members: 36, score: 68900000, leader: "Csillagláng" },
  { name: "Csendgyerekek",  members: 31, score: 61200000, leader: "Éjjárókőlő" },
];

export const liveFeed: LiveFeedEntry[] = [
  { who: "Sárkányölő",  what_hu: "Hamuvérű Sárkányt megölte",   what_en: "felled Ashblood Dragon",       t: "3p" },
  { who: "Hajnalcsepp", what_hu: "+9 fokozta a Tüzes Pengét",   what_en: "upgraded Fire Blade to +9",    t: "5p" },
  { who: "Tűzpenge",    what_hu: "új rekord PvP: 31 ölés",       what_en: "new PvP record: 31 kills",    t: "8p" },
  { who: "Mohás úr",    what_hu: "csatlakozott Vasárnyak klánhoz",what_en: "joined Iron Shadows guild",  t: "11p" },
  { who: "Aranynyíl",   what_hu: "elérte a 102. szintet",         what_en: "reached level 102",          t: "14p" },
  { who: "Csendszem",   what_hu: "Metin követ tört (rang 8)",     what_en: "broke Metin stone (rank 8)", t: "17p" },
];

export const characters: Character[] = [
  { name: "Vasszív",    level: 87, class: "warrior", realm: "red",  playtime: 412, last: "2026-05-14", loc: "fire" },
  { name: "Hajnalcsepp",level: 64, class: "shaman",  realm: "blue", playtime: 187, last: "2026-05-10", loc: "town" },
];

export const orders: Order[] = [
  { id: "ORD-4821", date: "2026-05-12", item: "Aranykupa csomag",  item_en: "Gold Bundle",     coins: 4200, status: "delivered" },
  { id: "ORD-4799", date: "2026-05-08", item: "EXP főzet ×50",     item_en: "EXP Tonic ×50",  coins: 180,  status: "delivered" },
  { id: "ORD-4715", date: "2026-04-28", item: "Hold-rókakölyök",    item_en: "Moonkit Fox",     coins: 600,  status: "delivered" },
];

export const transactions: Transaction[] = [
  { id: "TX-9920", date: "2026-05-12", amount: 5000, method: "card",   status: "ok" },
  { id: "TX-9881", date: "2026-04-25", amount: 1500, method: "paypal", status: "ok" },
  { id: "TX-9803", date: "2026-04-02", amount: 2500, method: "card",   status: "ok" },
];

export const topupTiers: TopupTier[] = [
  { coins: 500,   eur: 4.99,  bonus: 0 },
  { coins: 1100,  eur: 9.99,  bonus: 100 },
  { coins: 2400,  eur: 19.99, bonus: 400,  popular: true },
  { coins: 6500,  eur: 49.99, bonus: 1500 },
  { coins: 14000, eur: 99.99, bonus: 4000 },
];

export const SERVER_LAUNCH_DATE = new Date("2021-03-14");
export const ONLINE_BASE = 2847;
export const ONLINE_VARIANCE = 60;
