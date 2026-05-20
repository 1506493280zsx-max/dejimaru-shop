"use client";
import Image from "next/image";

export default function PaymentMethods() {
  return (
    <div>
      <div style={{ fontSize: 10, fontWeight: 700, color: "#CCEEEE", letterSpacing: 1.5, marginBottom: 12 }}>
        安心のお支払い方法&ensp;/&ensp;PAYMENT METHODS
      </div>
      <Image
        src="/payment/payment-methods-transparent.png"
        alt="Payment Methods"
        width={480}
        height={220}
        style={{
          width: "100%",
          maxWidth: "480px",
          height: "auto",
          objectFit: "contain",
          display: "block",
        }}
        unoptimized
      />
    </div>
  );
}
