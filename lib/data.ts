export type Category = "women" | "men" | "kids" | "accessories";

export type Product = {
  id: string;
  name: string;
  category: Category;
  /** Unsplash photo path, e.g. "photo-1555583743-991174c11425" */
  image: string;
  alt: string;
  /** object-position for the card crop */
  pos?: string;
  colors: string[];
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
  mapUrl: string;
  flagship?: boolean;
  hours?: string;
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
    mapUrl: mapsSearch("Style Club Civil Lines Prayagraj"),
  },
  {
    id: "naini",
    name: "Naini",
    area: "Prayagraj",
    address: "Mewalal Ki Bagiya, Naini, Prayagraj",
    mapUrl: mapsSearch("Style Club Mewalal Ki Bagiya Naini Prayagraj"),
  },
  {
    id: "phaphamau",
    name: "Phaphamau",
    area: "Prayagraj",
    address: "Banaras Road, near Phaphamau Bazar, UP 211013",
    mapUrl: "https://maps.app.goo.gl/zvzU9fui7HKzYyfL9",
  },
  {
    id: "bharwari",
    name: "Bharwari",
    area: "Kaushambi",
    address: "Bharwari, Uttar Pradesh",
    mapUrl: mapsSearch("Style Club Bharwari"),
  },
];

export const contact = {
  phones: [
    { label: "Katra store", display: "098380 70333", href: "tel:+919838070333" },
    { label: "Customer line", display: "+91 89573 79512", href: "tel:+918957379512" },
  ],
  instagram: {
    handle: "@style_club_prayagraj",
    url: "https://www.instagram.com/style_club_prayagraj",
  },
};

export const allProducts: Product[] = [
  ...newArrivals,
  ...trending.filter((t) => !newArrivals.some((n) => n.id === t.id)),
];


