import HomeReviews from "@/components/HomeReviews";
import CustomerReviewsList from "@/components/CustomerReviewsList";
import { getCustomerReviews } from "@/lib/directus";

export const metadata = {
  title: "お客様の声 | AI Across ショップ",
};

export default async function CustomerReviewsPage() {
  const reviews = await getCustomerReviews(20);

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "16px 10px" }}>
      {/* 法人のお客様の声 */}
      <div style={{ marginBottom: 24 }}>
        <HomeReviews />
      </div>

      {/* 一般のお客様の声 */}
      <CustomerReviewsList reviews={reviews} />
    </div>
  );
}
