import { contact, stores } from "@/lib/data";

const PAGE_NAME = "Style Club Prayagraj | Clothing for Men, Women & Kids";
const PAGE_DESCRIPTION =
  "Explore men’s, women’s and kids’ fashion at Style Club, with stores in Katra, Naini and Phaphamau in Prayagraj, plus Bharwari in Kaushambi. Civil Lines is coming soon.";

const phone = (href: string) => href.replace(/^tel:/, "");

type PostalAddressInput = {
  streetAddress: string;
  addressLocality: string;
  addressRegion: string;
  postalCode?: string;
};

const STORE_ADDRESSES: Record<string, PostalAddressInput> = {
  katra: {
    streetAddress: "Netram Chauraha, Old Katra",
    addressLocality: "Prayagraj",
    addressRegion: "Uttar Pradesh",
    postalCode: "211002",
  },
  "civil-lines": {
    streetAddress: "Civil Lines",
    addressLocality: "Prayagraj",
    addressRegion: "Uttar Pradesh",
  },
  naini: {
    streetAddress: "Mewalal Ki Bagiya, Naini",
    addressLocality: "Prayagraj",
    addressRegion: "Uttar Pradesh",
  },
  phaphamau: {
    streetAddress: "Banaras Road, near Phaphamau Bazar",
    addressLocality: "Prayagraj",
    addressRegion: "Uttar Pradesh",
    postalCode: "211013",
  },
  bharwari: {
    streetAddress: "Bharwari",
    addressLocality: "Bharwari",
    addressRegion: "Uttar Pradesh",
  },
};

export function buildSiteJsonLd(siteUrl: string) {
  const organizationId = `${siteUrl}/#organization`;
  const websiteId = `${siteUrl}/#website`;
  const webpageId = `${siteUrl}/#webpage`;

  const openStores = stores.filter((store) => !store.comingSoon);
  const storeRefs = openStores.map((store) => ({
    "@id": `${siteUrl}/#store-${store.id}`,
  }));

  const storeNodes = openStores.map((store) => {
    const knownAddress = STORE_ADDRESSES[store.id];
    const address = knownAddress ?? {
      streetAddress: store.address,
      addressLocality: store.area,
      addressRegion: "Uttar Pradesh",
    };

    const node: Record<string, unknown> = {
      "@type": "ClothingStore",
      "@id": `${siteUrl}/#store-${store.id}`,
      name: `Style Club ${store.name}`,
      url: `${siteUrl}/#stores`,
      parentOrganization: { "@id": organizationId },
      hasMap: store.mapUrl,
      address: {
        "@type": "PostalAddress",
        ...address,
        addressCountry: "IN",
      },
    };

    if (store.flagship) {
      node.image = `${siteUrl}/brand/storefront.jpg`;
      node.telephone = phone(contact.phones[0].href);
    }

    return node;
  });

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": organizationId,
        name: "Style Club",
        url: siteUrl,
        telephone: phone(contact.phones[0].href),
        sameAs: [contact.instagram.url],
        subOrganization: storeRefs,
      },
      {
        "@type": "WebSite",
        "@id": websiteId,
        url: siteUrl,
        name: "Style Club",
        publisher: { "@id": organizationId },
      },
      {
        "@type": "WebPage",
        "@id": webpageId,
        url: siteUrl,
        name: PAGE_NAME,
        description: PAGE_DESCRIPTION,
        isPartOf: { "@id": websiteId },
        about: { "@id": organizationId },
        mainEntity: storeRefs,
      },
      ...storeNodes,
    ],
  };
}

/**
 * JSON-LD is embedded in a script element. Escape characters that could alter
 * HTML parsing if store/business data ever becomes CMS or client controlled.
 */
export function serializeJsonLd(value: unknown) {
  return JSON.stringify(value)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
}
