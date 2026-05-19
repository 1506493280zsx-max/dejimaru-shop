"use client";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/auth-store";
import { useState, useEffect, useRef } from "react";

const C = {
  primary:"#0ABAB5", primaryDark:"#089490", primaryBg:"#E8F8F8",
  primaryBorder:"#B0E0DE", border:"#DDD", bg:"#F0F5F5", white:"#FFF",
  red:"#CC2200", text:"#333", textSub:"#666", textLight:"#999",
};

const PREFS = ["北海道","青森県","岩手県","宮城県","秋田県","山形県","福島県","茨城県","栃木県","群馬県","埼玉県","千葉県","東京都","神奈川県","新潟県","富山県","石川県","福井県","山梨県","長野県","岐阜県","静岡県","愛知県","三重県","滋賀県","京都府","大阪府","兵庫県","奈良県","和歌山県","鳥取県","島根県","岡山県","広島県","山口県","徳島県","香川県","愛媛県","高知県","福岡県","佐賀県","長崎県","熊本県","大分県","宮崎県","鹿児島県","沖縄県"];

export default function AddressPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [mounted, setMounted] = useState(false);
  const [addresses, setAddresses] = useState<any[]>([]);
  const [customerId, setCustomerId] = useState<string|null>(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<number|null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [isDefault, setIsDefault] = useState(false);

  // useRefでinput値を管理（再レンダリングでフォーカスが外れない）
  const refs = {
    name_last: useRef<HTMLInputElement>(null),
    name_first: useRef<HTMLInputElement>(null),
    postal_code: useRef<HTMLInputElement>(null),
    prefecture: useRef<HTMLSelectElement>(null),
    city: useRef<HTMLInputElement>(null),
    address1: useRef<HTMLInputElement>(null),
    address2: useRef<HTMLInputElement>(null),
    phone: useRef<HTMLInputElement>(null),
  };

  useEffect(()=>{ setMounted(true); },[]);
  useEffect(()=>{ if(mounted&&!user) router.push("/login"); else if(mounted&&user) fetchData(); },[mounted,user]);

const fetchData = async () => {
  setLoading(true);

  try {
    const res = await fetch(
      `/api/address?email=${encodeURIComponent(user!.email)}`,
      { cache: "no-store" }
    );

    if (!res.ok) {
      console.error("Address fetch failed:", await res.text());
      setLoading(false);
      return;
    }

    const data = await res.json();
    setCustomerId(data.customerId ?? null);
    setAddresses(data.data || []);

  } catch (e) {
    console.error("Fetch Error:", e);
  }

  setLoading(false);
};

  const getFormValues = () => ({
    name_last: refs.name_last.current?.value||"",
    name_first: refs.name_first.current?.value||"",
    postal_code: refs.postal_code.current?.value||"",
    prefecture: refs.prefecture.current?.value||"東京都",
    city: refs.city.current?.value||"",
    address1: refs.address1.current?.value||"",
    address2: refs.address2.current?.value||"",
    phone: refs.phone.current?.value||"",
    is_default: isDefault,
  });

  const setFormValues = (addr: any) => {
    if(refs.name_last.current) refs.name_last.current.value = addr.name_last||"";
    if(refs.name_first.current) refs.name_first.current.value = addr.name_first||"";
    if(refs.postal_code.current) refs.postal_code.current.value = addr.postal_code||"";
    if(refs.prefecture.current) refs.prefecture.current.value = addr.prefecture||"東京都";
    if(refs.city.current) refs.city.current.value = addr.city||"";
    if(refs.address1.current) refs.address1.current.value = addr.address1||"";
    if(refs.address2.current) refs.address2.current.value = addr.address2||"";
    if(refs.phone.current) refs.phone.current.value = addr.phone||"";
    setIsDefault(addr.is_default||false);
  };

  const clearForm = () => {
    Object.values(refs).forEach(r=>{ if(r.current && r.current.tagName==="INPUT") (r.current as HTMLInputElement).value=""; });
    if(refs.prefecture.current) refs.prefecture.current.value="東京都";
    setIsDefault(false);
  };

  const handleSave = async () => {
    const values = getFormValues();
    if(!values.name_last||!values.name_first||!values.postal_code||!values.city||!values.address1){
      setError("必須項目を入力してください"); return;
    }
    if(!customerId){
      setError("お客様情報が取得できませんでした。ページを再読み込みしてください。"); return;
    }
    setSaving(true); setError("");
    try {
  const body = { ...values, customer_id: customerId };

  let res;

  if (editId) {
    res = await fetch(`/api/address/${editId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
  } else {
    res = await fetch(`/api/address`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
  }

  if (!res.ok) {
    throw new Error("保存に失敗しました");
  }

  setShowForm(false);
  clearForm();
  setEditId(null);

  await fetchData();

} catch (e:any) {
  setError(e.message || "保存に失敗しました");
}

setSaving(false);
};

const handleDelete = async (id:number) => {
  if (!confirm("この住所を削除しますか？")) return;

  try {
    const res = await fetch(`/api/address/${id}`, {
      method: "DELETE"
    });

    if (!res.ok) {
      throw new Error("削除失敗");
    }

    await fetchData();

  } catch(e:any){
    setError(e.message || "削除失敗");
  }
};

  const handleEdit = (addr:any) => {
    setEditId(addr.id);
    setShowForm(true);
    setTimeout(()=>setFormValues(addr), 50);
  };

  const inputStyle = {width:"100%",border:`1px solid ${C.border}`,borderRadius:2,padding:"8px 12px",fontSize:13,outline:"none",fontFamily:"inherit",boxSizing:"border-box" as any};

  return (
    <div style={{background:C.bg,minHeight:"100vh",fontFamily:"'Meiryo','ＭＳ Ｐゴシック',sans-serif",fontSize:13,color:C.text}}>
      <div style={{background:C.white,borderBottom:`2px solid ${C.primary}`}}>
        <div style={{maxWidth:1100,margin:"0 auto",padding:"10px",display:"flex",alignItems:"center"}}>
          <div style={{cursor:"pointer"}} onClick={()=>router.push("/")}>
            <div style={{fontSize:22,fontWeight:900,color:C.primary,letterSpacing:"-1px",fontFamily:"Arial Black,sans-serif"}}>デジマルショップ</div>
          </div>
          <button onClick={()=>router.push("/account")} style={{marginLeft:"auto",background:C.primary,color:"#fff",border:"none",padding:"6px 14px",borderRadius:2,fontSize:11,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>👤 マイページ</button>
        </div>
      </div>
      <div style={{background:C.primary,borderBottom:`2px solid ${C.primaryDark}`}}>
        <div style={{maxWidth:1100,margin:"0 auto",padding:"6px 10px",fontSize:11,color:"#fff",display:"flex",gap:6}}>
          <span style={{cursor:"pointer"}} onClick={()=>router.push("/")}>ホーム</span><span>›</span>
          <span style={{cursor:"pointer"}} onClick={()=>router.push("/account")}>マイページ</span><span>›</span>
          <span style={{fontWeight:700}}>お届け先の管理</span>
        </div>
      </div>

      <div style={{maxWidth:800,margin:"16px auto",padding:"0 10px 40px"}}>
        <div style={{display:"flex",alignItems:"center",marginBottom:16,paddingBottom:8,borderBottom:`2px solid ${C.primary}`}}>
          <h1 style={{fontSize:18,fontWeight:700,color:C.text,margin:0}}>📍 お届け先の管理</h1>
          <button onClick={()=>{clearForm();setEditId(null);setShowForm(true);}}
            style={{marginLeft:"auto",background:C.primary,color:"#fff",border:"none",padding:"8px 16px",borderRadius:2,fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>
            ＋ 新しい住所を追加
          </button>
        </div>

        {error&&<div style={{background:"#FFF0F0",border:"1px solid #FFAAAA",borderRadius:2,padding:"10px 14px",fontSize:12,color:C.red,marginBottom:14}}>{error}</div>}

        {showForm&&(
          <div style={{background:C.white,border:`2px solid ${C.primary}`,borderRadius:2,padding:20,marginBottom:16}}>
            <div style={{fontSize:14,fontWeight:700,color:C.primary,marginBottom:14,paddingBottom:8,borderBottom:`1px solid ${C.border}`}}>
              {editId?"住所を編集":"新しいお届け先を追加"}
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:12}}>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                <div>
                  <div style={{fontSize:12,fontWeight:700,color:C.textSub,marginBottom:4}}>姓<span style={{color:C.red,fontSize:10,marginLeft:4}}>※</span></div>
                  <input ref={refs.name_last} defaultValue="" placeholder="山田" style={inputStyle}/>
                </div>
                <div>
                  <div style={{fontSize:12,fontWeight:700,color:C.textSub,marginBottom:4}}>名<span style={{color:C.red,fontSize:10,marginLeft:4}}>※</span></div>
                  <input ref={refs.name_first} defaultValue="" placeholder="太郎" style={inputStyle}/>
                </div>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 2fr",gap:10}}>
                <div>
                  <div style={{fontSize:12,fontWeight:700,color:C.textSub,marginBottom:4}}>郵便番号<span style={{color:C.red,fontSize:10,marginLeft:4}}>※</span></div>
                  <input ref={refs.postal_code} defaultValue="" placeholder="123-4567" style={inputStyle}/>
                </div>
                <div>
                  <div style={{fontSize:12,fontWeight:700,color:C.textSub,marginBottom:4}}>都道府県<span style={{color:C.red,fontSize:10,marginLeft:4}}>※</span></div>
                  <select ref={refs.prefecture} defaultValue="東京都"
                    style={{width:"100%",border:`1px solid ${C.border}`,borderRadius:2,padding:"8px 12px",fontSize:13,outline:"none",fontFamily:"inherit",boxSizing:"border-box" as any,background:C.white}}>
                    {PREFS.map(p=><option key={p}>{p}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <div style={{fontSize:12,fontWeight:700,color:C.textSub,marginBottom:4}}>市区町村<span style={{color:C.red,fontSize:10,marginLeft:4}}>※</span></div>
                <input ref={refs.city} defaultValue="" placeholder="渋谷区" style={inputStyle}/>
              </div>
              <div>
                <div style={{fontSize:12,fontWeight:700,color:C.textSub,marginBottom:4}}>番地・建物名<span style={{color:C.red,fontSize:10,marginLeft:4}}>※</span></div>
                <input ref={refs.address1} defaultValue="" placeholder="渋谷1-1-1" style={inputStyle}/>
              </div>
              <div>
                <div style={{fontSize:12,fontWeight:700,color:C.textSub,marginBottom:4}}>マンション名・部屋番号（任意）</div>
                <input ref={refs.address2} defaultValue="" placeholder="渋谷マンション101" style={inputStyle}/>
              </div>
              <div>
                <div style={{fontSize:12,fontWeight:700,color:C.textSub,marginBottom:4}}>電話番号</div>
                <input ref={refs.phone} defaultValue="" placeholder="090-1234-5678" style={inputStyle}/>
              </div>
              <div style={{display:"flex",alignItems:"center",gap:8,cursor:"pointer"}} onClick={()=>setIsDefault(p=>!p)}>
                <div style={{width:18,height:18,border:`2px solid ${isDefault?C.primary:C.border}`,borderRadius:2,background:isDefault?C.primary:"#fff",display:"flex",alignItems:"center",justifyContent:"center"}}>
                  {isDefault&&<span style={{color:"#fff",fontSize:12}}>✓</span>}
                </div>
                <span style={{fontSize:12,color:C.text}}>デフォルトの配送先として設定する</span>
              </div>
              <div style={{display:"flex",gap:10}}>
                <button onClick={handleSave} disabled={saving}
                  style={{flex:1,background:saving?"#AAA":C.primary,color:"#fff",border:"none",borderRadius:2,padding:"10px",fontSize:13,fontWeight:700,cursor:saving?"not-allowed":"pointer",fontFamily:"inherit"}}>
                  {saving?"保存中...":"保存する"}
                </button>
                <button onClick={()=>{setShowForm(false);setEditId(null);clearForm();setError("");}}
                  style={{background:"#fff",color:C.textSub,border:`1px solid ${C.border}`,borderRadius:2,padding:"10px 20px",fontSize:13,cursor:"pointer",fontFamily:"inherit"}}>
                  キャンセル
                </button>
              </div>
            </div>
          </div>
        )}

        {loading?(
          <div style={{background:C.white,border:`1px solid ${C.border}`,borderRadius:2,padding:"30px",textAlign:"center",color:C.textSub}}>読み込み中...</div>
        ):addresses.length===0?(
          <div style={{background:C.white,border:`1px solid ${C.border}`,borderRadius:2,padding:"40px",textAlign:"center"}}>
            <div style={{fontSize:32,marginBottom:12}}>📍</div>
            <div style={{fontSize:14,color:C.textSub}}>登録されたお届け先がありません</div>
          </div>
        ):(
          <div style={{display:"flex",flexDirection:"column",gap:10}}>
            {addresses.map(addr=>(
              <div key={addr.id} style={{background:C.white,border:`1px solid ${addr.is_default?C.primary:C.border}`,borderRadius:2,padding:16,position:"relative"}}>
                {addr.is_default&&<span style={{position:"absolute",top:12,right:12,background:C.primary,color:"#fff",borderRadius:2,padding:"2px 8px",fontSize:10,fontWeight:700}}>デフォルト</span>}
                <div style={{fontSize:13,fontWeight:700,color:C.text,marginBottom:6}}>{addr.name_last} {addr.name_first}</div>
                <div style={{fontSize:12,color:C.textSub,lineHeight:1.9}}>
                  〒{addr.postal_code}<br/>
                  {addr.prefecture}{addr.city}{addr.address1}{addr.address2?` ${addr.address2}`:""}<br/>
                  {addr.phone&&`TEL: ${addr.phone}`}
                </div>
                <div style={{display:"flex",gap:8,marginTop:12}}>
                  <button onClick={()=>handleEdit(addr)} style={{background:C.white,color:C.primary,border:`1px solid ${C.primary}`,borderRadius:2,padding:"6px 14px",fontSize:11,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>編集</button>
                  <button onClick={()=>handleDelete(addr.id)} style={{background:C.white,color:C.red,border:`1px solid ${C.red}`,borderRadius:2,padding:"6px 14px",fontSize:11,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>削除</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{background:"#2A4A4A",color:"#AACCCC",padding:"16px 10px"}}>
        <div style={{maxWidth:1100,margin:"0 auto",fontSize:10,color:"#5A8A8A"}}>© 2024 デジマルショップ. All Rights Reserved.</div>
      </div>
    </div>
  );
}
