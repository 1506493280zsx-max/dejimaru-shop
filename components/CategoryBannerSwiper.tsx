"use client";
import { useRouter } from "next/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";

const BANNERS = [
  {
    text: "MacBook特集",
    sub: "中古Mac 厳選入荷",
    url: "/category/laptops-used-mac",
    bg: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
  },
  {
    text: "iPhone中古",
    sub: "最新モデル在庫あり",
    url: "/category/smartphones-iphone-used",
    bg: "linear-gradient(135deg, #2d2d2d 0%, #555 50%, #888 100%)",
  },
  {
    text: "Surface特集",
    sub: "Microsoft正規品",
    url: "/search?brand=microsoft",
    bg: "linear-gradient(135deg, #0078d4 0%, #005a9e 100%)",
  },
  {
    text: "ThinkPad特集",
    sub: "ビジネス定番モデル",
    url: "/search?brand=lenovo",
    bg: "linear-gradient(135deg, #1e1e1e 0%, #c8102e 100%)",
  },
  {
    text: "SSD大特集",
    sub: "高速・大容量ストレージ",
    url: "/category/storage-ssd-internal",
    bg: "linear-gradient(135deg, #007a76 0%, #0abab5 100%)",
  },
  {
    text: "Android中古",
    sub: "Galaxy・AQUOS 他",
    url: "/category/smartphones-android-used",
    bg: "linear-gradient(135deg, #3d5a80 0%, #293241 100%)",
  },
  {
    text: "ゲーミングPC",
    sub: "RTX搭載機 多数在庫",
    url: "/category/desktops-gaming",
    bg: "linear-gradient(135deg, #0d0d0d 0%, #1a0030 50%, #6a0080 100%)",
  },
  {
    text: "周辺機器特集",
    sub: "マウス・キーボード他",
    url: "/category/peripherals",
    bg: "linear-gradient(135deg, #2b4162 0%, #12100e 100%)",
  },
];

export default function CategoryBannerSwiper() {
  const router = useRouter();

  return (
    <>
      <style>{`
        .cat-swiper-slide { cursor: pointer; }
        .cat-swiper-bg {
          transition: transform 0.5s ease;
          position: absolute;
          inset: 0;
        }
        .cat-swiper-slide:hover .cat-swiper-bg {
          transform: scale(1.06);
        }
      `}</style>
      <div style={{ marginBottom: 0, margin: 0, overflow: "hidden" }}>
        <Swiper
          modules={[Autoplay]}
          slidesPerView={1}
          spaceBetween={0}
          loop={true}
          speed={6000}
          autoplay={{ delay: 0, disableOnInteraction: false, pauseOnMouseEnter: true }}
          allowTouchMove={true}
          breakpoints={{
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          style={{ padding: 0, margin: 0 }}
        >
          {BANNERS.map((b, i) => (
            <SwiperSlide key={i}>
              <div
                className="cat-swiper-slide"
                onClick={() => router.push(b.url)}
                style={{
                  borderRadius: 0,
                  overflow: "hidden",
                  width: "100%",
                  height: "300px",
                  position: "relative",
                }}
              >
                <div
                  className="cat-swiper-bg"
                  style={{ background: b.bg }}
                />
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: "rgba(0,0,0,0.22)",
                    zIndex: 1,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 6,
                    padding: "0 16px",
                    textAlign: "center",
                  }}
                >
                  <div
                    style={{
                      fontSize: 20,
                      fontWeight: 900,
                      color: "#fff",
                      lineHeight: 1.3,
                      textShadow: "0 1px 6px rgba(0,0,0,0.6)",
                    }}
                  >
                    {b.text}
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      color: "rgba(255,255,255,0.88)",
                      textShadow: "0 1px 3px rgba(0,0,0,0.5)",
                    }}
                  >
                    {b.sub}
                  </div>
                  <div
                    style={{
                      marginTop: 4,
                      fontSize: 11,
                      color: "rgba(255,255,255,0.8)",
                      border: "1px solid rgba(255,255,255,0.5)",
                      padding: "3px 12px",
                      borderRadius: 20,
                    }}
                  >
                    特集を見る →
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </>
  );
}
