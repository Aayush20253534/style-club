export type Category = "women" | "men" | "kids" | "accessories";

export type Product = {
  id: string;
  name: string;
  category: Category;
  /** Unsplash photo ID or a local path in public/. */
  image: string;
  alt: string;
  /** object-position for the card crop */
  pos?: string;
  colors: string[];
  /** Lowest listed price for this style category, not the price of the pictured item. */
  fromPrice?: number;
  groupId?: string;
};

export const CATEGORY_LABEL: Record<Category, string> = {
  women: "Women",
  men: "Men",
  kids: "Kids",
  accessories: "Accessories",
};

export const newArrivals: Product[] = [
  {
    id: "w-indigo-coord",
    name: "Indigo Block-Print Co-ord Set",
    category: "women",
    image: "photo-1768651925875-d1523ed07cb6",
    alt: "Woman wearing an indigo block-print tunic and trousers",
    pos: "50% 30%",
    colors: ["#1d2742", "#9c3b2a"],
  },
  {
    id: "m-denim-trucker",
    name: "Classic Denim Trucker Jacket",
    category: "men",
    image: "photo-1555583743-991174c11425",
    alt: "Man wearing a mid-wash denim trucker jacket over a white tee",
    pos: "50% 30%",
    colors: ["#2c4a7a", "#1b2438"],
  },
  {
    id: "k-tracksuit",
    name: "Colour-Block Tracksuit",
    category: "kids",
    image: "photo-1632232963035-bc14755747c9",
    alt: "Two kids in matching navy and green colour-block tracksuits",
    pos: "50% 35%",
    colors: ["#1c2748", "#0f8a6b"],
  },
  {
    id: "a-court-sneakers",
    name: "Clean Court Sneakers",
    category: "accessories",
    image: "photo-1656164753657-8ff832063a71",
    alt: "Pair of white leather court sneakers on a dark backdrop",
    colors: ["#f2f2ee", "#111111"],
  },
  {
    id: "w-leaf-set",
    name: "Blue Leaf-Print Shirt Set",
    category: "women",
    image: "photo-1766043071222-b71e52ddcc8f",
    alt: "Woman in a blue and white leaf-print shirt and trouser set on stairs",
    pos: "50% 30%",
    colors: ["#2b4ea2", "#f1efe9"],
  },
  {
    id: "m-pathani",
    name: "Cobalt Pathani Kurta Set",
    category: "men",
    image: "photo-1770359993283-a2c2f386584e",
    alt: "Man in a cobalt blue pathani kurta and trousers",
    pos: "50% 25%",
    colors: ["#1f3f95", "#f4f1ea"],
  },
  {
    id: "w-terracotta-dress",
    name: "Terracotta Belted Shirt Dress",
    category: "women",
    image: "photo-1789110853872-f416085557fa",
    alt: "Terracotta short-sleeve shirt dress with a tie belt",
    pos: "50% 35%",
    colors: ["#c4583f", "#e9ddc9"],
  },
  {
    id: "m-overshirt",
    name: "Chocolate Twill Overshirt",
    category: "men",
    image: "photo-1786540610338-0fec664e7db4",
    alt: "Man wearing a chocolate brown twill overshirt over a white shirt",
    pos: "50% 25%",
    colors: ["#5a3a26", "#20232b"],
  },
  {
    id: "k-party-shirt",
    name: "Boys' Printed Party Shirt",
    category: "kids",
    image: "photo-1529776292731-c2246c65df5a",
    alt: "Boy in a black printed short-sleeve shirt",
    pos: "50% 30%",
    colors: ["#15171d", "#c9a55a"],
  },
  {
    id: "w-rose-kurta",
    name: "Rose Floral Kurta Set",
    category: "women",
    image: "photo-1763971922545-c0ffa1c09cc0",
    alt: "Woman in a rose pink floral kurta set seated on an ottoman",
    pos: "50% 30%",
    colors: ["#d98a8f", "#f3e6dd"],
  },
  {
    id: "a-club-sunglasses",
    name: "Club Frame Sunglasses",
    category: "accessories",
    image: "photo-1584036553516-bf83210aa16c",
    alt: "Black club-frame sunglasses on a white surface",
    colors: ["#111111", "#6b4b2e"],
  },
  {
    id: "m-turtleneck",
    name: "Ribbed Turtleneck Knit",
    category: "men",
    image: "photo-1712425718085-cdd2b2298669",
    alt: "Man wearing an ivory ribbed turtleneck sweater",
    pos: "50% 25%",
    colors: ["#f1ede4", "#1b1b1b"],
  },
  {
    id: "k-sweatshirt",
    name: "Girls' Everyday Sweatshirt",
    category: "kids",
    image: "photo-1628083519454-8d0c2a3c20f1",
    alt: "Smiling girl in a soft grey crew-neck sweatshirt and jeans",
    pos: "50% 35%",
    colors: ["#b9bcc2", "#f0c9cf"],
  },
  {
    id: "a-navy-backpack",
    name: "Navy Everyday Backpack",
    category: "accessories",
    image: "photo-1553062407-98eeb64c6a62",
    alt: "Navy blue everyday backpack standing on a white floor",
    colors: ["#1b2748", "#111111"],
  },
];

export const trending: Product[] = [
  {
    id: "t-straight-jeans",
    name: "Mid-Wash Straight Jeans",
    category: "men",
    image: "photo-1754555009601-498e9873197e",
    alt: "Mid-wash straight jeans hanging on a wooden hanger",
    colors: ["#4a6a96", "#1f2b44"],
  },
  {
    id: "t-turquoise-coord",
    name: "Turquoise Print Co-ord",
    category: "women",
    image: "photo-1769063382750-a025d7ad6d5f",
    alt: "Woman in a turquoise and coral printed co-ord set",
    pos: "50% 30%",
    colors: ["#57b8b0", "#e5764f"],
  },
  {
    id: "t-sand-hoodie",
    name: "Sand Relaxed Hoodie",
    category: "men",
    image: "photo-1564557287817-3785e38ec1f5",
    alt: "Man in a sand-coloured relaxed hoodie and sunglasses",
    pos: "50% 30%",
    colors: ["#cbb9a5", "#2b2b2b"],
  },
  {
    id: "t-sage-kurta",
    name: "Sage Chikan Kurta",
    category: "men",
    image: "photo-1727835523545-70ee992b5763",
    alt: "Man in a sage green embroidered kurta standing by a tree",
    pos: "50% 25%",
    colors: ["#a9c3a8", "#f1efe7"],
  },
  {
    id: "t-scarlet-suit",
    name: "Scarlet Floral Suit Set",
    category: "women",
    image: "photo-1768289222413-2ed4528bee86",
    alt: "Woman in a scarlet floral suit set standing indoors",
    pos: "50% 30%",
    colors: ["#c4262e", "#f0d8b8"],
  },
  {
    id: "t-mint-hoodie",
    name: "Mint Oversized Hoodie",
    category: "men",
    image: "photo-1638830531926-6a33cf25c024",
    alt: "Man in a mint green oversized hoodie against an ochre wall",
    pos: "50% 30%",
    colors: ["#8fc9b5", "#1d1d1d"],
  },
  {
    id: "t-linen-dress",
    name: "White Linen Mini Dress",
    category: "women",
    image: "photo-1789110520302-3df8ce0410f0",
    alt: "White linen mini dress with a braided rope belt",
    pos: "50% 35%",
    colors: ["#f4f1ea", "#c9b28a"],
  },
  {
    id: "t-kids-twinset",
    name: "Kids' Occasion Twin Set",
    category: "kids",
    image: "photo-1604303768345-038b79a8c47a",
    alt: "Two young boys in a red plaid shirt and a black occasion blazer",
    pos: "50% 30%",
    colors: ["#b3262c", "#141414"],
  },
];

export const departments = [
  {
    id: "women" as const,
    title: "Women",
    kicker: "Co-ords · Kurta sets · Dresses",
    image: "photo-1766043071333-5d82991da1ea",
    alt: "Woman in a floral print jumpsuit standing in a sunlit room",
    pos: "50% 30%",
  },
  {
    id: "men" as const,
    title: "Men",
    kicker: "Overshirts · Denim · Ethnic",
    image: "photo-1729435613691-c39a931b0c4e",
    alt: "Man in a black overshirt and white tee seated on a studio stool",
    pos: "50% 30%",
  },
  {
    id: "kids" as const,
    title: "Kids",
    kicker: "Everyday · Party · Play",
    image: "photo-1780504863628-1657131dcffb",
    alt: "Smiling young boy in a blue t-shirt",
    pos: "50% 25%",
  },
];

export const look = {
  image: "photo-1605192554106-d549b1b975cd",
  alt: "Man walking down an autumn street in a denim jacket, white tee, blue jeans and white sneakers",
  items: [
    {
      id: "m-denim-trucker",
      name: "Classic Denim Trucker Jacket",
      image: "photo-1555583743-991174c11425",
      spot: { x: 60, y: 41 },
    },
    {
      id: "look-crew-tee",
      name: "Heavyweight Crew Tee",
      image: "photo-1618677603286-0ec56cb6e1b5",
      spot: { x: 46, y: 32 },
    },
    {
      id: "look-skinny-jeans",
      name: "Stretch Skinny Jeans",
      image: "photo-1624378439575-d8705ad7ae80",
      spot: { x: 55, y: 66 },
    },
    {
      id: "a-court-sneakers",
      name: "Clean Court Sneakers",
      image: "photo-1656164753657-8ff832063a71",
      spot: { x: 49, y: 86 },
    },
  ],
};

export type Store = {
  id: string;
  name: string;
  area: string;
  address: string;
  mapUrl?: string;
  flagship?: boolean;
  hours?: string;
  comingSoon?: boolean;
};

const mapsSearch = (q: string) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;

export const stores: Store[] = [
  {
    id: "katra",
    name: "Katra",
    area: "Flagship",
    address: "Netram Chauraha, Old Katra, Prayagraj, UP 211002",
    mapUrl: "https://maps.app.goo.gl/cAkjLE6NmmEWQ88j9",
    flagship: true,
    hours: "Open daily · until 10:30 PM",
  },
  {
    id: "civil-lines",
    name: "Civil Lines",
    area: "Prayagraj",
    address: "Civil Lines, Prayagraj, Uttar Pradesh",
    comingSoon: true,
  },
  {
    id: "naini",
    name: "Naini",
    area: "Prayagraj",
    address: "Mewa Lal Baghiya, Mirzapur Road, Naini, Prayagraj, UP 211008",
    mapUrl: mapsSearch("Style Club Mewalal Ki Bagiya Naini Prayagraj"),
    hours: "Open daily · until 10:30 PM",
  },
  {
    id: "phaphamau",
    name: "Phaphamau",
    area: "Prayagraj",
    address: "Banaras Road, near Phaphamau Bazar, UP 211013",
    mapUrl: "https://maps.app.goo.gl/zvzU9fui7HKzYyfL9",
    hours: "Open daily · until 10:30 PM",
  },
  {
    id: "bharwari",
    name: "Bharwari",
    area: "Kaushambi",
    address: "Bharwari, Uttar Pradesh",
    mapUrl: mapsSearch("Style Club Bharwari"),
    hours: "Open daily · until 10:30 PM",
  },
];

export const contact = {
  phones: [{ label: "Contact", display: "+919198903333", href: "tel:+919198903333" }],
  instagram: {
    handle: "@style_club_prayagraj",
    url: "https://www.instagram.com/style_club_prayagraj",
  },
};

type CatalogGroup = {
  id: string;
  title: string;
  summary: string;
  category: Exclude<Category, "accessories">;
  products: Product[];
};

type CatalogEntry = [id: string, name: string, file: string, alt: string, fromPrice: number, color: string];

function catalogGroup(
  id: string,
  title: string,
  summary: string,
  category: CatalogGroup["category"],
  folder: string,
  entries: CatalogEntry[],
): CatalogGroup {
  return {
    id,
    title,
    summary,
    category,
    products: entries.map(([productId, name, file, alt, fromPrice, color]) => ({
      id: productId,
      name,
      category,
      image: `/${folder}/${file}`,
      alt,
      colors: [color],
      fromPrice,
      groupId: id,
    })),
  };
}

/** Illustrative looks. Starting prices are category minima from the supplied price list. */
export const catalogGroups: CatalogGroup[] = [
  catalogGroup("ladies-ethnic", "Ladies Ethnic", "Suits, kurti sets and occasion wear.", "women", "Ladies_ethnic", [
    ["le-salwar", "Salwar Suits", "01_salwar_suit.png", "Model in a teal embroidered salwar suit", 500, "#176074"],
    ["le-palazzo", "Kurti Palazzo Sets", "02_kurti_palazzo_set.png", "Model in a terracotta kurti and ivory palazzo set", 400, "#a95840"],
    ["le-long-kurti", "Long Kurtis", "03_long_kurti.png", "Model in an indigo printed long kurti", 250, "#273f69"],
    ["le-coord", "Ethnic Co-ord Sets", "04_ethnic_coord_set.png", "Model in an olive ethnic co-ord set", 500, "#75805c"],
    ["le-gown", "Ethnic Gowns", "05_ethnic_gown.png", "Model in a plum embroidered gown", 600, "#64314f"],
  ]),
  catalogGroup("ladies-western", "Ladies Western", "Tops, shirts and everyday denim.", "women", "Ladies_western", [
    ["lw-knit-top", "Knitted Tops", "01_knitted_top.png", "Model in a lavender knitted top", 60, "#aa8da7"],
    ["lw-woven-top", "Woven Tops", "02_woven_top.png", "Model in a cobalt woven top", 300, "#2854b0"],
    ["lw-formal-shirt", "Formal Shirts", "03_formal_shirt.png", "Model in a pale blue formal shirt", 350, "#bdd1ed"],
    ["lw-casual-shirt", "Casual Shirts", "04_casual_shirt.png", "Model in a peach striped casual shirt", 250, "#eab4a5"],
    ["lw-jeans", "Jeans", "05_jeans.png", "Model in dark indigo straight-fit jeans", 400, "#31476b"],
  ]),
  catalogGroup("ladies-western-winter", "Ladies Western Winter", "Warm layers for the changing season.", "women", "Ladies_western_winter", [
    ["lww-cardigan", "Long Cardigans", "01_long_cardigan.png", "Model in a camel long cardigan", 500, "#b58e68"],
    ["lww-jacket", "Winter Jackets", "02_winter_jacket.png", "Model in a forest green winter jacket", 500, "#264739"],
    ["lww-sweatshirt", "Heavy Sweatshirts", "03_heavy_sweatshirt.png", "Model in a burgundy heavyweight sweatshirt", 350, "#702839"],
  ]),
  catalogGroup("mens", "Men's", "Shirts, kurtas, tees and everyday staples.", "men", "Mens", [
    ["m-casual-shirt", "Casual Shirts", "01_casual_shirt.png", "Model in a sage casual shirt", 250, "#a3ae8d"],
    ["m-formal-shirt", "Formal Shirts", "02_formal_shirt.png", "Model in a white formal shirt", 250, "#eeeae2"],
    ["m-kurta-set", "Kurta Sets", "03_kurta_set.png", "Model in a teal kurta set", 500, "#4c8390"],
    ["m-oversized-tee", "Oversized T-shirts", "04_oversized_tshirt.png", "Model in a rust oversized T-shirt", 200, "#b66b4d"],
    ["m-jeans", "Regular-fit Jeans", "05_regular_fit_jeans.png", "Model in regular-fit blue jeans", 600, "#334d76"],
    ["m-trousers", "Cotton Trousers", "06_cotton_trousers.png", "Model in sand-coloured cotton trousers", 500, "#cdbba0"],
  ]),
  catalogGroup("mens-winter", "Men's Winter", "Jackets, sweaters and sweatshirts.", "men", "Mens_winter", [
    ["mw-jacket", "Winter Jackets", "01_winter_jacket.png", "Model in a navy winter jacket", 300, "#273554"],
    ["mw-sweater", "Full-sleeve Sweaters", "02_winter_sweater.png", "Model in a brown knit sweater", 250, "#78543d"],
    ["mw-sweatshirt", "Full-sleeve Sweatshirts", "03_winter_sweatshirt.png", "Model in an olive winter sweatshirt", 250, "#616952"],
  ]),
  catalogGroup("infant", "Infant", "Soft outfits and little occasion looks.", "kids", "Infant", [
    ["i-knit-two-piece", "Knitted Two-piece Sets", "01_knitted_two_piece.png", "Infant in a sage knitted two-piece outfit", 250, "#a5b39b"],
    ["i-cotton-frock", "Cotton Frocks", "02_cotton_frock.png", "Infant in a pink floral cotton frock", 80, "#e5b7b4"],
  ]),
  catalogGroup("infant-winter", "Infant Winter", "Cosy layers for little ones.", "kids", "Infant_winter", [
    ["iw-woollen-suit", "Woollen Baba Suits", "01_woollen_baba_suit.png", "Infant in a mustard woollen baba suit", 800, "#c69335"],
    ["iw-jacket", "Infant Winter Jackets", "02_winter_jacket.png", "Infant in a rust padded winter jacket", 300, "#b86b51"],
  ]),
  catalogGroup("boys", "Boys", "Easy shirts, tees and play-ready bottoms.", "kids", "Boys", [
    ["b-shirt", "Long-sleeve Shirts", "01_long_sleeve_shirt.png", "Boy in a pale blue long-sleeve shirt", 250, "#a4c1e6"],
    ["b-hooded-tee", "Hooded T-shirts", "02_hooded_tshirt.png", "Boy in a teal hooded T-shirt", 200, "#196e7b"],
    ["b-cargo", "Cargo Joggers", "03_cargo_joggers.png", "Boy in olive cargo joggers", 500, "#72795a"],
  ]),
  catalogGroup("girls", "Girls", "Frocks, kurti sets and denim.", "kids", "Girls", [
    ["g-frock", "Cotton Frocks", "01_cotton_frock.png", "Girl in a blue cotton frock", 200, "#93b6e6"],
    ["g-kurti", "Kurti Sets", "02_kurti_set.png", "Girl in a coral kurti and palazzo set", 350, "#d77764"],
    ["g-skirt", "Denim Skirts", "03_denim_skirt.png", "Girl in a denim skirt", 300, "#5276a7"],
  ]),
];

export const allProducts: Product[] = [
  ...newArrivals,
  ...trending.filter((t) => !newArrivals.some((n) => n.id === t.id)),
  ...catalogGroups.flatMap((group) => group.products),
];
