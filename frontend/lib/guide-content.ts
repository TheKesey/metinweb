export type BlockType = "p" | "h" | "list" | "table" | "callout" | "kbd" | "divider";
export type CalloutKind = "info" | "warn" | "tip" | "lore";

export interface Block {
  type: BlockType;
  text?: string;
  items?: string[];
  numbered?: boolean;
  cols?: string[];
  rows?: string[][];
  kind?: CalloutKind;
  title?: string;
}

export interface Section {
  heading: string;
  blocks: Block[];
}

export interface GuidePage {
  id: string;
  chapter: string;
  title: string;
  summary: string;
  sections: Section[];
}

export const GUIDE_PAGES: GuidePage[] = [
  {
    id: "welcome",
    chapter: "Bevezető",
    title: "Üdvözlünk a Kesey-n",
    summary: "Mi ez a szerver, mit kapsz itt, és hogyan kezdj neki 10 perc alatt.",
    sections: [
      {
        heading: "Mi a Kesey?",
        blocks: [
          { type: "p", text: "A Kesey egy 2021-ben indított, közösség által üzemeltetett MMO-szerver. Frankfurti adatközpontból fut, 99.97%-os éves üzemidővel és DDoS-védelemmel. A célunk a klasszikus, hardcore érzés — modern szerver-stabilitás és anti-cheat mellett." },
          { type: "p", text: "Nincs pay-to-win. Az itemshop kizárólag kozmetikus tárgyakat, kényelmi (QoL) funkciókat és időtakarékos tételeket árul. Minden statisztikai előny játékon belül érhető el." },
          { type: "callout", kind: "info", title: "Független projekt", text: "A Kesey egy nem-profit közösségi szerver. Nem áll kapcsolatban semmilyen kiadóval vagy márkával." },
        ],
      },
      {
        heading: "Mit kapsz itt?",
        blocks: [
          { type: "list", items: [
            "Klasszikus mechanikák — nincs auto-loot, nincs auto-attack pad, nincs vásárolható szint.",
            "90 napos season-rendszer egyedi jutalmakkal (Top 100 = animált köntös).",
            "Aktív dev-csapat, kéthetente patch, havonta esemény.",
            "Magyar és angol közösség, magyar GM-ek, 24/7 chat-moderálás.",
          ]},
          { type: "table", cols: ["Tulajdonság", "Érték"], rows: [
            ["Verzió", "4.1.2 (Season 4)"],
            ["Max szint", "105"],
            ["EXP rate", "×3 (alap), ×5 hétvégén"],
            ["Drop rate", "×2"],
            ["Yang rate", "×2"],
            ["Birodalmak", "3 (Vörös, Kék, Sárga)"],
            ["Karakterszlot", "8"],
          ]},
        ],
      },
      {
        heading: "Hogyan kezdj neki?",
        blocks: [
          { type: "p", text: "Négy lépés, kb. 30 perc telepítéssel együtt:" },
          { type: "list", numbered: true, items: [
            "Töltsd le a klienst a Letöltés oldalról (8,4 GB).",
            "Regisztrálj 30 másodperc alatt — nincs e-mail megerősítés.",
            "Hozz létre egy karaktert. Válassz osztályt és birodalmat.",
            "Indítsd el a játékot és kövesd az első küldetést a városban.",
          ]},
          { type: "callout", kind: "tip", title: "Gyors tipp", text: "Az első óra a legfontosabb. Ne hagyd ki a kezdő küldetéseket — több ingyenes felszerelést és aranyat adnak, mint a legtöbb endgame farm." },
        ],
      },
    ],
  },

  {
    id: "first-steps",
    chapter: "Bevezető",
    title: "Első lépések",
    summary: "Letöltés, regisztráció, karakter és az első óra a játékban.",
    sections: [
      {
        heading: "Telepítés",
        blocks: [
          { type: "p", text: "A teljes telepítő 8,4 GB. Letöltéshez stabil internet és ~12 GB szabad lemezhely kell. A telepítő egyetlen futtatható fájl — futtasd és kövesd a varázslót. Patcher első indításkor automatikusan ellenőrzi a verziót." },
          { type: "callout", kind: "warn", title: "Antivírus", text: "Egyes vírusirtók false-positive-ot adnak a Kesey patcher-re. Ha kell, engedélyezd a telepítő mappát a kivételek között. A teljes forráskód auditálva, a klienst hash-csel ellenőrizzük." },
        ],
      },
      {
        heading: "Regisztráció",
        blocks: [
          { type: "p", text: "Egy fiók akár 8 karaktert tárolhat, és minden karakter ugyanazt a Kesey érme-egyenleget használja. Nincs e-mail megerősítés — a regisztráció azonnal él." },
          { type: "table", cols: ["Mező", "Szabály"], rows: [
            ["Felhasználónév", "4–16 karakter, csak betűk és számok"],
            ["E-mail", "Érvényes formátum (csak jelszó-visszaállításra)"],
            ["Jelszó", "Minimum 8 karakter, legalább 1 szám"],
            ["Kétfaktoros", "Opcionális, később bekapcsolható"],
          ]},
        ],
      },
      {
        heading: "Karakter létrehozása",
        blocks: [
          { type: "p", text: "Karakter létrehozásakor három dolgot választasz: nevet, osztályt és birodalmat. A nevet és az osztályt nem lehet később megváltoztatni — a birodalomváltáshoz 2000 Kesey érme kell és 7 napos cooldown." },
          { type: "callout", kind: "lore", title: "Yu-síkság világa", text: "A Kesey-univerzum három nagy birodalomra oszlik a Yu-síkságon. A birodalmak közt évszázados rivalizálás zajlik — minden bejelentkezés egy újabb fejezet ebben a háborúban." },
        ],
      },
      {
        heading: "Az első óra",
        blocks: [
          { type: "list", numbered: true, items: [
            "Beszélj a Kapuőrrel a város bejáratánál — megkapod a kezdő küldetéseket.",
            "Levelezz fel 5-ös szintre az állatokon a Tölgyligetben (kb. 8 perc).",
            "Térj vissza a városba és vegyél át 1 starter csomagot a Postásnál — ingyenes felszerelés.",
            "10-es szintnél nyílik a Sárkány-mélysír mini-instance — első kötelező dungeon.",
            "20-as szintnél válaszd meg az al-osztályodat (pl. Harcos → Test/Lélek).",
          ]},
          { type: "callout", kind: "tip", title: "Csatlakozz egy klánhoz!", text: "10-es szint felett már bárki felvehet egy klánba. Mentor-rendszerünkben minden új játékot adoptál egy veterán — küldj /mentorkeres parancsot a globális chatben." },
        ],
      },
    ],
  },

  {
    id: "classes",
    chapter: "Játék alapok",
    title: "Osztályok",
    summary: "Négy osztály, mindegyik két al-osztállyal. Melyiket válaszd?",
    sections: [
      {
        heading: "Áttekintés",
        blocks: [
          { type: "p", text: "Négy alaposztály van: Harcos, Orgyilkos, Sámán, Íjász. 20-as szinten mindegyik két ágra szakad. Az al-osztály végleges, de érdemes előre tervezni — meghatározza az endgame-szerepet." },
          { type: "table", cols: ["Osztály", "Stílus", "Al-osztály", "Erősség"], rows: [
            ["Harcos", "Közelharc", "Test / Lélek", "Magas HP, csoportos sebzés"],
            ["Orgyilkos", "Közelharc / Távolharc", "Penge / Mérgek", "Burst sebzés, kritikus"],
            ["Sámán", "Mágia / Támogatás", "Sárkány / Gyógyítás", "Csoport-buff, gyógyítás"],
            ["Íjász", "Távolharc", "Tűz / Jég", "Konzisztens DPS, kiting"],
          ]},
        ],
      },
      {
        heading: "Harcos",
        blocks: [
          { type: "p", text: "Az alap tank-DPS hibrid. Test-ágon kettős fegyverrel pörögő penge, magas védekezés. Lélek-ágon kétkezes karddal nagy egyszeri sebzés és AoE." },
          { type: "list", items: [
            "Solo: kiváló — sok HP, jó tisztító képesség.",
            "Csoport: kötelező tag minden raidben (Test-ág).",
            "PvP: erős a vörös birodalomban, ahol a klán-háborúk nagyok.",
          ]},
        ],
      },
      {
        heading: "Orgyilkos",
        blocks: [
          { type: "p", text: "A leg-burst-osabb osztály. Penge-ág közelharc, magas crit. Mérgek-ág távolharc shuriken + mérgek alapú DoT." },
          { type: "list", items: [
            "Solo: közepes — kevés HP, de gyors clear.",
            "Csoport: a fő DPS pozíció bosszokban.",
            "PvP: 1v1 király, csapatban érzékeny.",
          ]},
          { type: "callout", kind: "warn", title: "Tanulási görbe", text: "Az Orgyilkos a leg-komplexebb osztály. Ha most kezded, érdemes először Harcost vagy Íjászt játszani." },
        ],
      },
      {
        heading: "Sámán",
        blocks: [
          { type: "p", text: "A támogató osztály. Sárkány-ágon ofenzív (villámok, AoE varázslatok). Gyógyítás-ágon dedikált healer — minden raid hozza." },
          { type: "list", items: [
            "Solo: lassú, de stabil.",
            "Csoport: gyógyító Sámán nélkül a magasabb dungeonok nem teljesíthetők.",
            "PvP: kontroll és túlélés.",
          ]},
        ],
      },
      {
        heading: "Íjász",
        blocks: [
          { type: "p", text: "A távolharcos osztály. Tűz-ágon AoE-sebzés, jég-ágon single-target lassítás-kontroll. Az új játékosoknak legjobban ajánlott osztály — egyszerű mechanika, mégis effektív." },
          { type: "callout", kind: "tip", title: "Új játékos? Próbáld először az Íjászt.", text: "Az Íjász a leg-megbocsátóbb osztály. Távoli sebzés, könnyű kitelni, stabil DPS a tanulási görbe alatt is." },
        ],
      },
    ],
  },

  {
    id: "realms",
    chapter: "Játék alapok",
    title: "Birodalmak",
    summary: "Vörös, Kék, Sárga — három birodalom, három különböző élmény.",
    sections: [
      {
        heading: "Miért fontos a birodalomválasztás?",
        blocks: [
          { type: "p", text: "A birodalom meghatározza a kezdő várost, a kezdő küldetéseidet és — ami legfontosabb — kikkel állsz szemben a klán-háborúk és a Yu-síkság ellenőrzéséért folyó hetente megújuló harcokban." },
          { type: "callout", kind: "info", title: "Mindenki választhat", text: "Az új játékosoknak a rendszer felajánlja a kiegyensúlyozottabb birodalmat (jelenleg: Kék). Ez ajánlás — nyugodtan választhatsz más birodalmat is." },
        ],
      },
      {
        heading: "A három birodalom",
        blocks: [
          { type: "table", cols: ["Birod.", "Lakosság", "Stílus", "Erősség"], rows: [
            ["Vörös", "32% (legnagyobb)", "Agresszív, PvP-fókuszú", "Klán-háborúkban dominál"],
            ["Kék", "37% (vezető)", "Kiegyensúlyozott, kereskedelmi", "Stabil gazdaság, top guildek"],
            ["Sárga", "31% (legkisebb)", "Hardcore, hagyományőrző", "Magas skill-szint, defenzív"],
          ]},
        ],
      },
      {
        heading: "Mit válassz?",
        blocks: [
          { type: "list", items: [
            "Akciót szeretsz? → Vörös. Aktív PvP, állandó pengeváltás.",
            "Inkább kereskedsz / farm-olsz? → Kék. A piac itt a legnagyobb.",
            "Kihívás kell? → Sárga. Kisebb létszám, de keményebb meccsek.",
          ]},
          { type: "callout", kind: "lore", title: "A három népből", text: "A legendák szerint mindhárom birodalmat egy-egy elveszett herceg alapította a Hamuvérű Sárkány halála után. Vörös tűzből, Kék vízből, Sárga földből — a tartós béke kérdéses." },
        ],
      },
    ],
  },

  {
    id: "leveling",
    chapter: "Játék alapok",
    title: "Szintezés 1–105",
    summary: "Optimális útvonal a maximum szint felé, fázisonként.",
    sections: [
      {
        heading: "Áttekintés",
        blocks: [
          { type: "p", text: "A teljes 1→105 út átlagosan 18–25 óra aktív játékot vesz igénybe (×3 EXP-rate mellett). Hétvégén ×5 rate aktív — ekkor a teljes út lerövidülhet 12 órára." },
          { type: "table", cols: ["Fázis", "Helyszín", "Becsült idő"], rows: [
            ["1–30", "Tölgyliget → Patakőr", "1,5 óra"],
            ["30–60", "Tűzhegy lankái", "3 óra"],
            ["60–90", "Jégsír mélysíkságok", "6 óra"],
            ["90–105", "Yu-síkság + dungeon-roundok", "10–15 óra"],
          ]},
        ],
      },
      {
        heading: "1–30: A városon kívül",
        blocks: [
          { type: "p", text: "Kövesd a kezdő küldetéseket. A Tölgyligetben tanulj meg minden alapot — célzás, skill-rotáció, loot-szabályok. 25-ös szintnél kapsz egy ingyenes lovat (60% sebesség)." },
          { type: "callout", kind: "tip", title: "Ne ugord át a sztorit!", text: "A 30-as szintű befejező küldetés egyedi gyűrűt ad +20 erő bónusszal. Csak így megszerezhető." },
        ],
      },
      {
        heading: "30–60: Tűzhegy",
        blocks: [
          { type: "p", text: "Itt kezdődik a komoly farm. Csoportban gyorsabb — 3-4 fős party-ban 2× EXP a magányosan érhetőhez képest. A Hamulángúak a leghatékonyabb spot 45-ig." },
          { type: "list", items: [
            "Spot: Hamulángúak — 30-tól 45-ig",
            "Dungeon: Lángkígyók fészke (3-fős, 35+) — egyedi loot",
            "Heti küldetés: Vulkáni vér — 50% boost EXP-szerző küldetésekre",
          ]},
        ],
      },
      {
        heading: "60–90: Jégsír",
        blocks: [
          { type: "p", text: "Itt kell csapathoz csatlakoznod. A Jégsír 8-fős instance-okat kínál, és a metinkövek nehezebbek. Itt érdemes klánba lépni — a klán-bónusz +15% EXP." },
        ],
      },
      {
        heading: "90–105: Endgame",
        blocks: [
          { type: "p", text: "A Yu-síkság a végcél. Itt érhetők el a season-küldetések és a bossz-raidek. 100-as szinten nyílik a Sárkány-mélysír heroic mód — a legjobb felszerelés forrása." },
          { type: "callout", kind: "warn", title: "P2W nincs", text: "Senki nem előzhet meg téged szintben pénzért. A 105-ös szint mindenki számára ugyanannyi időt és munkát igényel." },
        ],
      },
    ],
  },

  {
    id: "pvp",
    chapter: "Endgame",
    title: "PvP és klán-háborúk",
    summary: "Szabad PvP, aréna és heti klán-háborúk a Yu-síkság ellenőrzéséért.",
    sections: [
      {
        heading: "A három PvP-forma",
        blocks: [
          { type: "table", cols: ["Mód", "Leírás", "Mikor"], rows: [
            ["Szabad PvP", "Bárki támadhat bárkit jelölt zónákban", "Folyamatos"],
            ["Aréna 1v1 / 3v3", "Ranked queue, season-ranking", "24/7"],
            ["Klán-háború", "20v20 zóna-irányítás", "Hetente, vasárnap 20:00"],
          ]},
        ],
      },
      {
        heading: "Szabad PvP szabályok",
        blocks: [
          { type: "p", text: "A városokban és kezdő zónákban nincs PvP. A Tűzhegyen kívül minden zóna PvP-engedélyezett — ott meg lehet támadni más birodalom karaktereit. Saját birodalmon belül csak ranked aréna van." },
          { type: "callout", kind: "info", title: "Karma rendszer", text: "Ha alacsonyabb szintű saját-birodalmi karaktert ölsz meg, karma-pontokat kapsz. 100 fölött piros névvel jelenik meg a karaktered, és a városok őrei támadnak." },
        ],
      },
      {
        heading: "Aréna",
        blocks: [
          { type: "p", text: "Heti reset, season-end jutalmak. 1v1 és 3v3 mód. Az aréna-rang független a karakter szintjétől — 80-as szintű is játszhatja a 100-as ranglistát (sebzés-skálázás aktív)." },
          { type: "list", items: [
            "Bronz → Ezüst → Arany → Smaragd → Gyémánt → Sárkány",
            "Top 100 Sárkány = egyedi PvP-köntös season végén",
            "Tournament: havi torna, díjak Kesey érmében",
          ]},
        ],
      },
      {
        heading: "Klán-háború",
        blocks: [
          { type: "p", text: "A Kesey legfontosabb endgame-tartalma. 20v20 vagy 40v40 forma. Minden klán a hét során toborzott pontokat költ el a vasárnapi nagy ütközetre. A győztes klán egy hétig kontrollálja a Yu-síkság egy zónáját, és +50% drop-bónuszt kap." },
          { type: "callout", kind: "tip", title: "Belépés a klán-háborúba", text: "Legalább 30 napos klán-tagság és 80-as szint kell. A klán-vezérlet jelöli ki a 20 főt a hadrendben." },
        ],
      },
    ],
  },

  {
    id: "bosses",
    chapter: "Endgame",
    title: "Bosszok és raidek",
    summary: "A világbosszok, instance-bosszok és a season-raidek.",
    sections: [
      {
        heading: "Bossz-típusok",
        blocks: [
          { type: "table", cols: ["Típus", "Hely", "Csoport", "Reset"], rows: [
            ["Mini-bossz", "Nyílt világ", "1–3 fő", "30 perc"],
            ["Field-bossz", "Nyílt világ, ütemezett", "10–15 fő", "4 óra"],
            ["Dungeon-bossz", "Instance végén", "5–8 fő", "Napi"],
            ["Raid-bossz", "Külön zóna", "20–40 fő", "Heti"],
          ]},
        ],
      },
      {
        heading: "Hamuvérű Sárkány",
        blocks: [
          { type: "p", text: "A Season 4 főbosza. 40-fős raid, 12 perces enrage-timer, három fázis. A legjobb csapatok ~9 percben teljesítik." },
          { type: "list", items: [
            "1. fázis (100–75% HP): tank-and-spank, kerüld a tűzlélegzetét",
            "2. fázis (75–35% HP): kis sárkányok jönnek, AoE szükséges",
            "3. fázis (35–0% HP): Sárkány felszáll, távolharcosok kapnak hangsúlyt",
          ]},
          { type: "callout", kind: "lore", title: "A sárkány legendája", text: "A Hamuvérű Sárkány a Yu-síkság eredeti őrzője. A legendák szerint csak egyszer halt meg — most pedig évszázados haraggal tér vissza." },
        ],
      },
      {
        heading: "Heti bossz-naptár",
        blocks: [
          { type: "table", cols: ["Nap", "Bossz", "Időpont"], rows: [
            ["Hétfő", "Tűzkígyó királya", "20:00"],
            ["Szerda", "Jégrém", "20:00"],
            ["Péntek", "Sárkánykölyök", "20:00"],
            ["Szombat", "Hamuvérű Sárkány", "21:00"],
            ["Vasárnap", "Klán-háború bossz", "22:00 (csak győztes klán)"],
          ]},
        ],
      },
    ],
  },

  {
    id: "metins",
    chapter: "Endgame",
    title: "Metinkövek",
    summary: "Mik a metinkövek, hogyan törd be őket, és mit kapsz értük.",
    sections: [
      {
        heading: "Mi a metinkő?",
        blocks: [
          { type: "p", text: "A metinkövek álló, hatalmas kristályok, amelyek a térkép különböző zónáiban jelennek meg. Letörésük (megsemmisítésük) megnyit különleges loot-táblákat — ritka tárgyakat, fejlesztési anyagokat és season-érmét." },
          { type: "callout", kind: "lore", title: "A kövek eredete", text: "A legendák szerint a metinkövek a Hamuvérű Sárkány vérébe száradt kristályok. Minden letört kő egy darab a haragból." },
        ],
      },
      {
        heading: "Hogyan törd be?",
        blocks: [
          { type: "p", text: "Egyszerűen üsd. A metinkövek nem támadnak vissza, de minden szintnek megvan a maga rangja — egy 60-as szintű karakter nem üthet le egy 9-es rang metinkövet." },
          { type: "table", cols: ["Rang", "Szint", "Drop minőség"], rows: [
            ["1–3", "20–40", "Alap fejlesztő"],
            ["4–6", "50–70", "Közepes drop"],
            ["7–8", "75–90", "Ritka drop"],
            ["9", "95+", "Epikus drop"],
            ["10 (raid)", "100+", "Legendás drop, csak raid-csoportban"],
          ]},
        ],
      },
      {
        heading: "Hatékony farm",
        blocks: [
          { type: "list", items: [
            "Egy karakteren naponta legfeljebb 50 metinkövet érdemes törni — utána csökken a drop-szám.",
            "A klán-bónusz +10% drop-rate metinkövekre.",
            "Az itemshop-os köntös NEM ad drop-bónuszt — csak a kozmetika.",
          ]},
          { type: "callout", kind: "tip", title: "Társítsd csoportba", text: "3-4 fős csoportban a metinkövek 40%-kal gyorsabban dőlnek le. A loot-elosztás körkörös — mindenki egyformán kap." },
        ],
      },
    ],
  },

  {
    id: "itemshop",
    chapter: "Gazdaság",
    title: "Itemshop és Kesey érme",
    summary: "Mi vehető, mi nem, és hogyan szerzel érmét fizetés nélkül is.",
    sections: [
      {
        heading: "Hogyan szerzel Kesey érmét?",
        blocks: [
          { type: "list", items: [
            "Befizetés: 5,000 érme = ~€10. Bónusz nagyobb csomagoknál.",
            "Heti küldetés: 100 érme a teljes heti rotáció elvégzéséért.",
            "Aréna season-end: 1000–5000 érme rangtól függően.",
            "Bossz-drop: a Hamuvérű Sárkányból 5% eséllyel hullik 50 érme.",
            "Klán-háború győzelem: 200 érme a győztes klán minden tagjának.",
          ]},
        ],
      },
      {
        heading: "Mit érdemes venni?",
        blocks: [
          { type: "callout", kind: "info", title: "Mi NINCS az itemshopban", text: "Nincs erő-növelő tárgy, statisztika-fejlesztő bónusz, scroll-os szintugró, EXP-szorzó-fizetős verzió, vagy semmi, ami statisztikai előnyt ad. A P2W szigorúan tiltva." },
          { type: "table", cols: ["Kategória", "Példa", "Hatás"], rows: [
            ["Costume", "Ametiszt köntös", "Kozmetika, animációval"],
            ["Hátas", "Vasláb mén", "+30% sebesség (mint az ingyenes ló)"],
            ["Pet", "Hold-rókakölyök", "Auto-loot 12 mp-enként"],
            ["Tároló", "Pluszláda", "+20 inventory slot"],
            ["Fogyó", "EXP-tonik", "Időmegtakarító, NEM exkluzív"],
          ]},
        ],
      },
      {
        heading: "Kereskedelmi piac",
        blocks: [
          { type: "p", text: "A játékos-piac (Bazaar) yangban működik — ez a játékon belül szerzett pénz. A Kesey érmét NEM lehet közvetlenül yangra váltani. Cserébe nem lehet pénzért megvenni a piacon a legjobb tárgyakat sem." },
        ],
      },
    ],
  },

  {
    id: "guilds",
    chapter: "Közösség",
    title: "Klánok",
    summary: "Csatlakozz vagy alapíts klánt — a Kesey igazi szíve.",
    sections: [
      {
        heading: "Miért érdemes klánba lépni?",
        blocks: [
          { type: "list", items: [
            "+15% EXP bónusz minden klán-tagnak.",
            "+10% drop-rate metinkövekre.",
            "Hozzáférés a klán-raktárhoz (max 200 slot).",
            "Klán-házak vásárlása klán-háború győzelemmel.",
            "Heti klán-háborúk a Yu-síkság ellenőrzéséért.",
          ]},
        ],
      },
      {
        heading: "Klán-szintek",
        blocks: [
          { type: "table", cols: ["Szint", "Max tag", "Funkció"], rows: [
            ["1 (alapítás)", "10", "Klán-chat"],
            ["3", "25", "Klán-raktár"],
            ["5", "40", "Klán-bossz hozzáférés"],
            ["7", "50", "Klán-háború részvétel"],
            ["10 (max)", "60", "Saját klán-ház"],
          ]},
        ],
      },
      {
        heading: "Saját klán alapítása",
        blocks: [
          { type: "p", text: "Klán alapításához 75-ös szint és 500,000 yang kell. Az alapítás örökre összeköti a karaktert a klán-vezetéssel — átruházható, de feloszlatás után 30 napos cooldown." },
          { type: "callout", kind: "warn", title: "Tipp első klánvezérnek", text: "Ne alapíts klánt 80-as szint alatt. Sokkal könnyebb csatlakozni egy működő klánhoz, megtanulni a folyamatokat, és csak utána saját vállalkozást indítani." },
        ],
      },
    ],
  },

  {
    id: "events",
    chapter: "Közösség",
    title: "Események és season",
    summary: "Heti rotáció, havi nagyesemények, 90-napos season-ciklus.",
    sections: [
      {
        heading: "Season-ciklus",
        blocks: [
          { type: "p", text: "A Kesey 90 napos season-ciklusban fut. Minden season hoz egy új zónát, új bosszt, új season-küldetést és egyedi season-end jutalmakat. A season végén a Top 100 játékos animált köntöst kap, ami soha nem kerül az itemshopba." },
        ],
      },
      {
        heading: "Heti rotáció",
        blocks: [
          { type: "table", cols: ["Nap", "Esemény"], rows: [
            ["Hétfő", "Heti küldetés reset"],
            ["Kedd", "Tűz-bossz csata (20:00)"],
            ["Szerda", "Dupla EXP délután (16:00–22:00)"],
            ["Csütörtök", "Klán-toborzás napja, +50% klán-XP"],
            ["Péntek", "PvP-éjszaka, aréna ×2 jutalom"],
            ["Szombat", "Raid-est, Hamuvérű Sárkány"],
            ["Vasárnap", "Klán-háború, 20:00–23:00"],
          ]},
        ],
      },
      {
        heading: "Nagyesemények",
        blocks: [
          { type: "list", items: [
            "Hold-fesztivál (havonta) — különleges hold-érmék gyűjthetők",
            "Vendéghadjárat — időszakos térkép-invázió, ritka drop",
            "Season-end torna — 1000-1500 érme díjazás",
            "Karácsony / Húsvét / Halloween — egyedi köntösök, ideiglenes",
          ]},
        ],
      },
    ],
  },

  {
    id: "commands",
    chapter: "Referencia",
    title: "Játékon belüli parancsok",
    summary: "A leghasznosabb / parancsok listája.",
    sections: [
      {
        heading: "Alapok",
        blocks: [
          { type: "table", cols: ["Parancs", "Hatás"], rows: [
            ["/help", "Az összes parancs listája"],
            ["/ping", "Aktuális latency mutatása"],
            ["/fps", "FPS-számláló be/ki"],
            ["/clear", "Chat törlése"],
            ["/logout", "Kilépés karakter-választóhoz"],
          ]},
        ],
      },
      {
        heading: "Társas",
        blocks: [
          { type: "table", cols: ["Parancs", "Hatás"], rows: [
            ["/whisper [név] [üzenet]", "Privát üzenet"],
            ["/party invite [név]", "Meghívás csoportba"],
            ["/guild invite [név]", "Meghívás klánba"],
            ["/friend add [név]", "Hozzáadás a barátlistához"],
            ["/ignore [név]", "Felhasználó letiltása"],
            ["/mentorkeres", "Mentor-kérés a globális chat-en"],
          ]},
        ],
      },
      {
        heading: "Moderáció",
        blocks: [
          { type: "table", cols: ["Parancs", "Hatás"], rows: [
            ["/report [név] [ok]", "Bejelentés moderátornak"],
            ["/gm", "GM hívása (csak vészhelyzetben)"],
            ["/bug [leírás]", "Hibajelentés"],
          ]},
          { type: "callout", kind: "warn", title: "A /report szent", text: "Hamis bejelentés 24 órás chat-mute-tal jár. Csak valódi szabálysértésekért használd." },
        ],
      },
    ],
  },

  {
    id: "rules",
    chapter: "Referencia",
    title: "Szabályzat",
    summary: "Mi a tiltott, és mi van engedve.",
    sections: [
      {
        heading: "Mi szigorúan tiltott",
        blocks: [
          { type: "list", items: [
            "Bot, makró, cheat — bármilyen automatizálás. Permanens ban.",
            "Account-megosztás idegennel.",
            "Real-money trading (RMT). Yang vagy tárgyak eladása valós pénzért.",
            "Bug-abuse. Ismert hibák kihasználása — ha találtál egyet, jelentsd a /bug paranccsal.",
            "Rasszista, szexista, gyűlöletkeltő nyelv. Azonnali tiltás.",
            "Spam, scam, phishing.",
            "Karakter-név sértő, megtévesztő vagy védjegy-szempontból problémás.",
          ]},
        ],
      },
      {
        heading: "Mi van engedve",
        blocks: [
          { type: "list", items: [
            "Multi-account ugyanazon fiókkal, max 3 egyidejű karakter.",
            "Klán-háborús stratégia, ami szabályosan kihasználja a szabályrendszert.",
            "Trading játékosok között yangban.",
            "Stream / videó-felvétel — sőt, biztatjuk! Discord-csatornán kérj kiemelést.",
          ]},
        ],
      },
      {
        heading: "Mi történik ban esetén?",
        blocks: [
          { type: "p", text: "A bant minden esetben felülvizsgálja egy ember (nem csak automatika). 24–48 órán belül kapsz választ a /report-ot követően. Téves ban esetén — bocs, megtörténhet — automatikusan kompenzációt kapsz (1000 érme + a season-progress visszaállítva)." },
          { type: "callout", kind: "info", title: "Fellebbezés", text: "Ban-fellebbezést a forum.kesey.gg/appeal címen lehet beküldeni. Részletes indoklással, képernyőképekkel." },
        ],
      },
    ],
  },
];

export const CHAPTERS = [...new Set(GUIDE_PAGES.map((p) => p.chapter))];
