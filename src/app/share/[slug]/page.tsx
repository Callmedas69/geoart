// Share Route with OpenGraph Meta Tags - Phase 1.1
import { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCollectionBySlug } from "@/services/collections";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const collection = await getCollectionBySlug(slug);

  if (!collection) {
    return { title: "Collection Not Found" };
  }

  const ogImageUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/og/${slug}`;
  const referralCode =
    process.env.NEXT_PUBLIC_VIBEMARKET_REFERRAL || "C8475MDMBEAM";
  const shareUrl = `https://vibechain.com/market/${slug}?ref=${referralCode}`;

  return {
    title: `${collection.name}`,
    description: collection.description
      ? `${collection.description} - deployed by GeoPack Manager`
      : `Pack your collection made simple with GeoPack Manager`,
    openGraph: {
      title: `${collection.name} 🎨`,
      description: collection.description
        ? `${collection.description} - deployed by GeoPack Manager`
        : `✅ Deployed by GeoPack Manager - Launch your pack at @vibedotmarket`,
      url: shareUrl,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `${collection.name} deployed by GeoPack Manager`,
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${collection.name}`,
      description: collection.description
        ? `${collection.description} - deployed by GeoPack Manager`
        : `Launch your pack @vibedotmarket with GeoPack Manager`,
      images: [ogImageUrl],
    },
  };
}

export default async function SharePage({ params }: Props) {
  // Auto-redirect to actual collection with referral
  const { slug } = await params;
  const referralCode =
    process.env.NEXT_PUBLIC_VIBEMARKET_REFERRAL || "C8475MDMBEAM";
  redirect(`https://vibechain.com/market/${slug}?ref=${referralCode}`);
}
