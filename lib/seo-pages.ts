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
    description: "Explore women's clothing at Style Club in Prayagraj (Allahabad): co-ords, kurta sets, dresses and everyday styles. Visit your nearest store.",
    lead: "Co-ords, kurta sets, dresses and everyday pieces for the way you move.",
    detail: "From printed sets to occasion-ready looks, explore the women's edit here and try your favourites at a Style Club store in Prayagraj (Allahabad) or Bharwari. Styles shown online are an inspiration; check availability with the store.",
  },
  men: {
    title: "Men's Clothing in Prayagraj | Style Club",
    description: "Explore men's clothing at Style Club in Prayagraj (Allahabad): denim, overshirts, kurtas and casual styles. Find a nearby store.",
    lead: "Denim, overshirts, ethnic styles and easy everyday layers.",
    detail: "Build a look for everyday wear or an occasion with the men's edit. Browse featured styles, then visit a Style Club branch in Prayagraj (Allahabad) or Bharwari to see current options and find the right fit.",
  },
  kids: {
    title: "Kidswear in Prayagraj | Style Club",
    description: "Explore kids' clothing at Style Club in Prayagraj (Allahabad), from everyday outfits to occasion styles. Visit your nearest store.",
    lead: "Made for every little plan, from play days to celebrations.",
    detail: "Explore the kidswear edit for everyday outfits and occasion looks. Visit a Style Club store in Prayagraj (Allahabad) or Bharwari to see available sizes and styles in person.",
  },
};
