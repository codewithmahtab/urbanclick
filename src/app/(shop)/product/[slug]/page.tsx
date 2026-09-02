import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProductDetails from "@/features/products/components/product/product-details";
import { getProductBySlug } from "@/features/products/services/product/get-product";
import { getCurrentUser } from "@/features/auth/lib/dal";
import { prisma } from "@/lib/prisma";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const products = await prisma.product.findMany({
    where: { isPublished: true, isDeleted: false, seller: { status: "APPROVED" } },
    select: { slug: true },
  });
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) return { title: "Product Not Found" };

  const priceFormatted = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(product.priceInPaise / 100);

  const description = product.description
    ? product.description.slice(0, 155)
    : `Buy ${product.name} at ${priceFormatted} on Next Shop. ${product.stock > 0 ? "In stock, ships fast." : ""}`;

  return {
    title: product.name,
    description,
    openGraph: {
      title: `${product.name} — ${priceFormatted}`,
      description,
      images: product.imageUrl
        ? [{ url: product.imageUrl, width: 800, height: 800, alt: product.name }]
        : undefined,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: product.name,
      description,
      images: product.imageUrl ? [product.imageUrl] : undefined,
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;

  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const user = await getCurrentUser();
  let isWishlisted = false;

  if (user) {
    const wishlistItem = await prisma.wishlistItem.findFirst({
      where: {
        productId: product.id,
        wishlist: { userId: user.id },
      },
    });
    isWishlisted = !!wishlistItem;
  }

  return <ProductDetails product={product} isWishlisted={isWishlisted} />;
}
