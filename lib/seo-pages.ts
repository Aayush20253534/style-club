import { departments, stores } from "@/lib/data";

export type OpenStoreId = "katra" | "naini" | "phaphamau" | "bharwari";
export type DepartmentId = (typeof departments)[number]["id"];

export const openStoreIds = stores.filter((store) => !store.comingSoon).map((store) => store.id as OpenStoreId);
export const departmentIds = departments.map((department) => department.id);

export const storeCopy: Record<OpenStoreId, {
  area: string;
  title: string;
  description: string;
  lead: string;
  localDetail: string;
}> = {
  katra: {
    area: "Old Katra · Prayagraj",
    title: "Style Club Katra | Clothing Store in Old Katra, Prayagraj",
    description: "Visit Style Club's Katra flagship at Netram Chauraha, Old Katra, Prayagraj (Allahabad). Explore clothing for men, women and kids and get directions.",
    lead: "Find the Style Club flagship at Netram Chauraha in Old Katra, Prayagraj.",
    localDetail: "Our Katra flagship is at Netram Chauraha in Old Katra, Prayagraj, also known as Allahabad. See the storefront and interior below, find the address, or open directions before you visit.",
  },
  naini: {
    area: "Naini · Prayagraj",
    title: "Style Club Naini | Clothing Store on Mirzapur Road",
    description: "Visit Style Club at Mewa Lal Baghiya, Mirzapur Road, Naini, Prayagraj (Allahabad) 211008. Browse men's, women's and kids' fashion.",
    lead: "Style Club in Naini is at Mewa Lal Baghiya on Mirzapur Road.",
    localDetail: "Shopping in Naini, Allahabad? Find our branch at Mewa Lal Baghiya, Mirzapur Road, Prayagraj. Explore the fashion edit online, then come in to see what is available at the store.",
  },
  phaphamau: {
    area: "Phaphamau · Prayagraj",
    title: "Style Club Phaphamau | Clothing Store on Banaras Road",
    description: "Visit Style Club on Banaras Road near Phaphamau Bazar, Prayagraj (Allahabad) 211013. Find men's, women's and kids' clothing and get directions.",
    lead: "Visit Style Club on Banaras Road near Phaphamau Bazar.",
    localDetail: "Our Phaphamau branch serves the Prayagraj (Allahabad) area from Banaras Road, near Phaphamau Bazar. Use the directions link for the store location, or call us before your visit.",
  },
  bharwari: {
    area: "Bharwari · Kaushambi",
    title: "Style Club Bharwari | Clothing Store in Kaushambi",
    description: "Visit Style Club in Bharwari, Kaushambi for men's, women's and kids' clothing. Find the branch and contact Style Club for directions.",
    lead: "Style Club serves families shopping for fashion in Bharwari, Kaushambi.",
    localDetail: "Our Bharwari branch brings the Style Club fashion edit to Kaushambi. Contact the store for precise directions; a full street address is not yet published on this site.",
  },
};

export const departmentCopy: Record<DepartmentId, {
  title: string;
  description: string;
  lead: string;
  detail: string;
}> = {
  women: {
    title: "Women's Clothing in Prayagraj | Style Club",
    description: "Explore women's ethnic, western and winter clothing at Style Club in Prayagraj (Allahabad). Browse styles and starting prices, then visit a store.",
    lead: "Ethnic wear, western staples and winter layers for the way you move.",
    detail: "From kurti sets and dresses to denim and warm layers, explore the women's edit here and try your favourites at a Style Club store in Prayagraj (Allahabad) or Bharwari. Images are illustrative; check current prices and availability with the store.",
  },
  men: {
    title: "Men's Clothing in Prayagraj | Style Club",
    description: "Explore men's shirts, T-shirts, kurtas, denim and winter clothing at Style Club in Prayagraj (Allahabad). See starting prices and store locations.",
    lead: "Denim, overshirts, ethnic styles and easy everyday layers.",
    detail: "Build a look for everyday wear or an occasion with the men's edit. Browse featured styles, then visit a Style Club branch in Prayagraj (Allahabad) or Bharwari to see current options and find the right fit.",
  },
  kids: {
    title: "Kidswear in Prayagraj | Style Club",
    description: "Explore infant, boys' and girls' clothing at Style Club in Prayagraj (Allahabad), including winter styles. Browse starting prices and store locations.",
    lead: "Infant, boys' and girls' styles for play days, celebrations and cooler weather.",
    detail: "Explore the kidswear edit for infant outfits, boys' staples, girls' dresses and winter layers. Visit a Style Club store in Prayagraj (Allahabad) or Bharwari to see current sizes, prices and styles in person.",
  },
};
