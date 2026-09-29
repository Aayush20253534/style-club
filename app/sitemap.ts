import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site";
import { stores, departments } from "@/lib/data";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getSiteUrl();
  const pages: MetadataRoute.Sitemap = [
    {
      url: base,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${base}/allahabad`,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    ...stores.filter((store) => !store.comingSoon).map((store) => ({
      url: `${base}/stores/${store.id}`,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...departments.map((department) => ({
      url: `${base}/collections/${department.id}`,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
  ];
  return pages;
}
