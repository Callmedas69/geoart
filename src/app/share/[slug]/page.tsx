// Share Route with OpenGraph Meta Tags - Phase 1.1
import { Metadata } from "next";
import { redirect, notFound } from "next/navigation";
import { cache } from "react";
import { getCollectionBySlug } from "@/services/collections";

const getCachedCollection = cache(getCollectionBySlug);
const REFERRAL_CODE =
  process.env.NEXT_PUBLIC_VIBEMARKET_REFERRAL || "C8475MDMBEAM";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const collection = await getCachedCollection(slug);

  if (!collection) {
    notFound();
  }

  const shareUrl = `https://vibechain.com/market/${slug}?ref=${REFERRAL_CODE}`;

  return {
    title: `${collection.name}`,
    description: collection.description
      ? `${collection.description} - packed by GeoPack Manager`
      : `Just launch on @vibedotmarket packed by GeopAck Manager`,
    openGraph: {
      title: `${collection.name} 🎨`,
      description: collection.description
        ? `${collection.description} - packed by GeoPack Manager`
        : `Just launch on @vibedotmarket packed by GeopAck Manager`,
      url: shareUrl,
      type: "website",
    },
    twitter: {
      card: "summary",
      title: `${collection.name}`,
      description: collection.description
        ? `${collection.description} - packed by GeoPack Manager`
        : `Just launch on @vibedotmarket packed by GeopAck Manager`,
    },
  };
}

export default async function SharePage({ params }: Props) {
  // Auto-redirect to actual collection with referral
  const { slug } = await params;
  redirect(`https://vibechain.com/market/${slug}?ref=${REFERRAL_CODE}`);
}
