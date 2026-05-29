const BASE = "https://directus-production-2cfe.up.railway.app";
const TOKEN = "Ef4hSkvM64d8rm7wC3WvQdjbZLJxu7nP";
const H = { Authorization: `Bearer ${TOKEN}`, "Content-Type": "application/json" };

async function createCollection(body) {
  const r = await fetch(`${BASE}/collections`, { method: "POST", headers: H, body: JSON.stringify(body) });
  const d = await r.json();
  if (d.error) console.error("Error:", d.error);
  else console.log("Created:", d.data?.collection);
}

async function main() {
  // 1. point_settings
  await createCollection({
    collection: "point_settings",
    meta: { icon: "settings", note: "ポイント付与レート設定" },
    schema: {},
    fields: [
      { field: "id", type: "integer", meta: { hidden: true }, schema: { is_primary_key: true, has_auto_increment: true } },
      { field: "rate", type: "integer", schema: { default_value: 100 }, meta: { interface: "input", note: "何円で1ポイント（デフォルト100円=1pt）" } },
      { field: "label", type: "string", meta: { interface: "input", note: "設定名（例：通常レート、夏セール）" } },
      { field: "is_active", type: "boolean", schema: { default_value: true }, meta: { interface: "boolean" } },
      { field: "created_at", type: "timestamp", schema: { default_value: "now()" }, meta: { hidden: true } }
    ]
  });

  // 2. point_transactions
  await createCollection({
    collection: "point_transactions",
    meta: { icon: "receipt_long", note: "ポイント獲得・使用履歴" },
    schema: {},
    fields: [
      { field: "id", type: "integer", meta: { hidden: true }, schema: { is_primary_key: true, has_auto_increment: true } },
      { field: "customer_id", type: "uuid", meta: { interface: "input" } },
      { field: "order_id", type: "integer", meta: { interface: "input" } },
      { field: "type", type: "string", meta: { interface: "select-dropdown", options: { choices: [{ text: "獲得", value: "earn" }, { text: "使用", value: "use" }] } } },
      { field: "points", type: "integer", meta: { interface: "input", note: "獲得はプラス、使用はマイナス" } },
      { field: "description", type: "string", meta: { interface: "input" } },
      { field: "created_at", type: "timestamp", schema: { default_value: "now()" }, meta: { hidden: true } }
    ]
  });

  // 3. customersテーブルにpointsフィールド追加
  const r = await fetch(`${BASE}/fields/customers`, {
    method: "POST",
    headers: H,
    body: JSON.stringify({
      field: "points",
      type: "integer",
      schema: { default_value: 0 },
      meta: { interface: "input", note: "現在のポイント残高" }
    })
  });
  const d = await r.json();
  console.log("customers.points追加:", d.data?.field || d.error);
}

main().catch(console.error);
