fetch("https://directus-production-2cfe.up.railway.app/fields/orders/shipping_carrier", {
  method: "PATCH",
  headers: {
    "Authorization": "Bearer Ef4hSkvM64d8rm7wC3WvQdjbZLJxu7nP",
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    meta: {
      interface: "select-dropdown",
      options: {
        choices: [
          { text: "ヤマト運輸", value: "yamato" },
          { text: "佐川急便", value: "sagawa" },
          { text: "日本郵便", value: "japanpost" },
          { text: "FedEx", value: "fedex" },
          { text: "DHL", value: "dhl" },
          { text: "その他", value: "other" }
        ]
      }
    }
  })
})
.then(r => r.json())
.then(d => console.log("Done:", d.data?.meta?.options?.choices?.map(c => c.text)))
.catch(e => console.error("Error:", e));
