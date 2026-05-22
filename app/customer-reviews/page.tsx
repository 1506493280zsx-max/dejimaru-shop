import HomeReviews from "@/components/HomeReviews";

export const metadata = {
  title: "お客様の声 | デジマルショップ",
};

export default function CustomerReviewsPage() {
  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "16px 10px" }}>
      <HomeReviews />
    </div>
  );
}
