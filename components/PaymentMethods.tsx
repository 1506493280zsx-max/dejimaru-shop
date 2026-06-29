"use client";
import Image from "next/image";

export default function PaymentMethods() {
  return (
    <div>
      <Image
        src="/payment/payment-methods-transparent.png"
        alt="Payment Methods"
        width={201}
        height={44}
        style={{
          width: "100%",
          maxWidth: "160px",
          height: "auto",
          objectFit: "contain",
          display: "block",
        }}
        unoptimized
      />
    </div>
  );
}
