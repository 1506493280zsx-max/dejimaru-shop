"use client";
import { useRouter } from "next/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import { getImageUrl } from "@/lib/directus";

export default function CategoryBannerSwiper({ ads }: { ads: any[] }) {
  const router = useRouter();

  if (ads.length === 0) return null;

  return (
    <>
      <style>{`
        .cat-swiper-slide {
          cursor: pointer;
          background: #078b83;
        }

        .cat-swiper-media {
          transition: transform 0.5s ease;
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: contain;
          display: block;
        }

        .cat-swiper-slide:hover .cat-swiper-media {
          transform: scale(1.02);
        }

        /* Swiper初期化前のチラつき防止：JS実行前からslide幅を確定させる */
        .cat-swiper-wrap .swiper-wrapper {
          display: flex;
        }
        .cat-swiper-wrap .swiper-slide {
          flex-shrink: 0;
          width: 100%;
        }
        @media (min-width: 640px) {
          .cat-swiper-wrap .swiper-slide {
            width: calc(100% / 2);
          }
        }
        @media (min-width: 1024px) {
          .cat-swiper-wrap .swiper-slide {
            width: calc(100% / 3);
          }
        }
      `}</style>

      <div className="cat-swiper-wrap" style={{ marginBottom: 0, margin: 0, overflow: "hidden" }}>
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
          {ads.map((ad, i) => {
            const imgUrl = ad.image_desktop ? getImageUrl(ad.image_desktop, 1200, 900) : null;

            return (
              <SwiperSlide key={ad.id ?? i}>
                <div
                  className="cat-swiper-slide"
                  onClick={() => router.push(ad.link_url || "/")}
                  style={{
                    borderRadius: 0,
                    overflow: "hidden",
                    width: "100%",
                    aspectRatio: "4 / 3",
                    height: "auto",
                    position: "relative",
                    background: "#078b83",
                  }}
                >
                  {imgUrl ? (
                    <img
                      src={imgUrl}
                      alt={ad.title || ""}
                      className="cat-swiper-media"
                    />
                  ) : (
                    <>
                      <div
                        className="cat-swiper-media"
                        style={{ background: "linear-gradient(135deg, #007a76 0%, #0abab5 100%)" }}
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
                          {ad.title}
                        </div>

                        {ad.subtitle && (
                          <div
                            style={{
                              fontSize: 12,
                              color: "rgba(255,255,255,0.88)",
                              textShadow: "0 1px 3px rgba(0,0,0,0.5)",
                            }}
                          >
                            {ad.subtitle}
                          </div>
                        )}

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
                    </>
                  )}
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    </>
  );
}
