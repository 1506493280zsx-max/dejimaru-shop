"use client";
import { useRouter } from "next/navigation";

const C = {
  primary: "#0ABAB5", primaryDeep: "#007A76",
  primaryBg: "#E8F8F8", primaryBorder: "#B0E0DE",
  red: "#CC2200", text: "#333", textSub: "#666",
  border: "#DDD", white: "#FFF",
};

const GRADE_STYLE: Record<string, { label: string }> = {
  NEW: { label: "新品" }, S: { label: "S品" },
  A:   { label: "A品" }, B: { label: "B品" }, C: { label: "C品" },
};

function SH({ title, icon }: { title: string; icon?: string }) {
  return (
    <div style={{ background: C.primary, color: "#fff", padding: "8px 14px", fontSize: 13, fontWeight: 700, borderRadius: "2px 2px 0 0", display: "flex", alignItems: "center", gap: 6, marginTop: 20 }}>
      {icon && <span>{icon}</span>}<span>{title}</span>
    </div>
  );
}
function Panel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ background: C.white, border: `1px solid ${C.border}`, borderTop: "none", borderRadius: "0 0 2px 2px", padding: 16, lineHeight: 1.9, fontSize: 13, color: C.textSub }}>
      {children}
    </div>
  );
}

export default function DetailSections({ product }: { product: any }) {
  const router = useRouter();

  const specs = [
    product.cpu          && { key: "CPU",         value: product.cpu },
    product.os           && { key: "OS",           value: product.os },
    product.memory       && { key: "メモリ",       value: product.memory },
    product.storage      && { key: "ストレージ",   value: product.storage },
    product.display_size && { key: "ディスプレイ", value: product.display_size },
    product.condition    && { key: "状態",         value: product.condition === "used" ? "中古品" : product.condition === "new" ? "新品" : "リファービッシュ" },
    product.grade        && { key: "グレード",     value: (GRADE_STYLE[product.grade] || GRADE_STYLE.C).label },
  ].filter(Boolean) as { key: string; value: string }[];

  const gradeLabel = (GRADE_STYLE[product.grade] || GRADE_STYLE.C).label;
  const recommendedPoints: string[] = Array.isArray(product.product_features) && product.product_features.length > 0
    ? product.product_features
    : [
        `グレード${gradeLabel}の高品質な商品です`,
        "発送前に動作確認・初期化済みでお届けします",
        "商品到着後30日間の初期不良保証付き",
        "平日14時までのご注文は当日出荷対応",
      ];

  return (
    <div style={{ marginTop: 16 }}>
      {/* 1. Recommended Points */}
      <SH title="おすすめポイント" icon="✨" />
      <Panel>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 10 }}>
          {recommendedPoints.map((pt, i) => (
            <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
              <span style={{ color: C.primary, fontWeight: 900, flexShrink: 0 }}>✓</span>
              <span>{pt}</span>
            </div>
          ))}
        </div>
      </Panel>

      {/* 2. Specs Table */}
      {specs.length > 0 && (
        <>
          <SH title="商品スペック" icon="📋" />
          <div style={{ background: C.white, border: `1px solid ${C.border}`, borderTop: "none", borderRadius: "0 0 2px 2px", overflow: "hidden" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <tbody>
                {specs.map((s, i) => (
                  <tr key={i} style={{ background: i % 2 === 0 ? C.white : C.primaryBg }}>
                    <td style={{ padding: "8px 14px", fontSize: 12, fontWeight: 700, color: C.textSub, width: "35%", borderBottom: `1px solid ${C.border}`, borderRight: `1px solid ${C.border}` }}>{s.key}</td>
                    <td style={{ padding: "8px 14px", fontSize: 12, color: C.text, borderBottom: `1px solid ${C.border}` }}>{s.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* 3. Product Features / Description */}
      {product.description && (
        <>
          <SH title="商品特長・詳細説明" icon="📝" />
          <Panel>
            <div dangerouslySetInnerHTML={{ __html: product.description }} style={{ lineHeight: 1.8 }} />
          </Panel>
        </>
      )}

      {/* 4. Warranty */}
      <SH title="保証について" icon="🛡️" />
      <Panel>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 12 }}>
          {[
            { t: "初期不良保証", d: "商品到着後30日間の初期不良保証が付いています。" },
            { t: "動作確認済み", d: "発送前に全商品の動作確認・初期化を実施しています。" },
            { t: "保証対象外",   d: "お客様の過失・改造・水没による故障は対象外です。" },
            { t: "延長保証",     d: "オプションで最長1年の延長保証プランもご用意しています。" },
          ].map((item, i) => (
            <div key={i} style={{ background: C.primaryBg, border: `1px solid ${C.primaryBorder}`, borderRadius: 2, padding: 12 }}>
              <div style={{ fontWeight: 700, color: C.text, marginBottom: 4 }}>{item.t}</div>
              <div style={{ fontSize: 12 }}>{item.d}</div>
            </div>
          ))}
        </div>
      </Panel>

      {/* 5. Image Notes */}
      <SH title="画像についての注意事項" icon="📷" />
      <Panel>
        <ul style={{ paddingLeft: 18, margin: 0 }}>
          <li>掲載画像はモニターの設定により実物と色味が異なる場合がございます。</li>
          <li>中古品のため、画像に写っていない細かな傷・使用感がある場合があります。</li>
          <li>付属品は商品ページに記載のものに限ります。画像内の小物類は含まれません。</li>
          <li>ご不明な点はご購入前にお問い合わせフォームよりご確認ください。</li>
        </ul>
      </Panel>

      {/* 6. Payment */}
      <SH title="お支払い方法" icon="💳" />
      <Panel>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 10 }}>
          {["クレジットカード（VISA/MC/JCB/AMEX）","PayPay","楽天ペイ","au PAY","Apple Pay","Google Pay","銀行振込","代金引換"].map(p => (
            <span key={p} style={{ background: "#F5F5F5", border: `1px solid ${C.border}`, borderRadius: 2, padding: "4px 10px", fontSize: 12, fontWeight: 700 }}>{p}</span>
          ))}
        </div>
        <p style={{ margin: 0, fontSize: 12 }}>※ 銀行振込の場合は振込手数料はお客様負担です。代金引換は30万円以上ではご利用いただけません。</p>
      </Panel>

      {/* 7. Shipping */}
      <SH title="配送について" icon="🚚" />
      <Panel>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10, marginBottom: 8 }}>
          {[
            { t: "配送業者", d: "ヤマト運輸 / 日本郵便" },
            { t: "出荷日",   d: "平日14時までは当日出荷" },
            { t: "送料",     d: "全国一律無料（離島除く）" },
          ].map((item, i) => (
            <div key={i} style={{ background: C.primaryBg, border: `1px solid ${C.primaryBorder}`, borderRadius: 2, padding: 10, textAlign: "center" }}>
              <div style={{ fontSize: 11, color: C.textSub, marginBottom: 4 }}>{item.t}</div>
              <div style={{ fontWeight: 700, color: C.text, fontSize: 12 }}>{item.d}</div>
            </div>
          ))}
        </div>
        <p style={{ margin: 0, fontSize: 12 }}>お届け目安：出荷翌日〜3営業日程度。時間帯指定も承ります。</p>
      </Panel>

      {/* 8. Return Policy */}
      <SH title="返品・交換ポリシー" icon="↩️" />
      <Panel>
        <div style={{ marginBottom: 10, padding: "10px 14px", background: "#FFF8E8", border: "1px solid #F0D080", borderRadius: 2, fontSize: 12 }}>
          <strong>返品受付期間：</strong>商品到着後7日以内にご連絡ください
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 }}>
          <div>
            <div style={{ fontWeight: 700, color: "#227700", marginBottom: 6, fontSize: 12 }}>返品可能な場合</div>
            <ul style={{ paddingLeft: 16, margin: 0, fontSize: 12 }}>
              <li>初期不良・動作不良</li>
              <li>商品説明と著しく異なる場合</li>
              <li>配送中の破損</li>
            </ul>
          </div>
          <div>
            <div style={{ fontWeight: 700, color: C.red, marginBottom: 6, fontSize: 12 }}>返品不可な場合</div>
            <ul style={{ paddingLeft: 16, margin: 0, fontSize: 12 }}>
              <li>お客様都合による返品</li>
              <li>到着後8日以降のご連絡</li>
              <li>お客様による破損・改造</li>
            </ul>
          </div>
        </div>
        <div style={{ textAlign: "center" }}>
          <button onClick={() => router.push("/contact")} style={{ background: C.primary, color: "#fff", border: "none", padding: "8px 20px", borderRadius: 2, fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
            返品・交換のお申込みはこちら →
          </button>
        </div>
      </Panel>
    </div>
  );
}
