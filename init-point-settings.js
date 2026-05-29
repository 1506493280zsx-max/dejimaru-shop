const BASE = "https://directus-production-2cfe.up.railway.app";
const TOKEN = "Ef4hSkvM64d8rm7wC3WvQdjbZLJxu7nP";
const H = { Authorization: `Bearer ${TOKEN}`, "Content-Type": "application/json" };

fetch(`${BASE}/items/point_settings`, {
  method: "POST",
  headers: H,
  body: JSON.stringify({
    rate: 100,
    label: "通常レート",
    is_active: true
  })
})
.then(r => r.json())
.then(d => console.log("初期設定作成:", d.data?.id, "rate:", d.data?.rate))
.catch(e => console.error("Error:", e));
