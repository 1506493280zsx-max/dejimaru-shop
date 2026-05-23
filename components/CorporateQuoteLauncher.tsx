"use client";
import { usePathname } from "next/navigation";
import CorporateQuoteWidget from "./CorporateQuoteWidget";
import CorporateQuoteModal from "./CorporateQuoteModal";
import { useCorporateQuote } from "@/components/CorporateQuoteContext";

const SHOW_ON = ["/", "/corporate"];

export default function CorporateQuoteLauncher() {
  const pathname = usePathname();
  const {
    isOpen,
    openModal,
    closeModal,
  } = useCorporateQuote();

  if (!SHOW_ON.includes(pathname)) return null;

  return (
    <>
      <CorporateQuoteWidget onOpen={openModal} />
      <CorporateQuoteModal isOpen={isOpen} onClose={closeModal} />
    </>
  );
}
