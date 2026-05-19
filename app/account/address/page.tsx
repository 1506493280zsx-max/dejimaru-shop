"use client";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/auth-store";
import { useState, useEffect } from "react";

const C = {
  primary:"#0ABAB5", primaryDark:"#089490", primaryBg:"#E8F8F8",
  primaryBorder:"#B0E0DE", border:"#DDD", bg:"#F0F5F5", white:"#FFF",
  red:"#CC2200", text:"#333", textSub:"#666", textLight:"#999",
};

const DIRECTUS = "https://directus-production-2cfe.up.railway.app";
const TOKEN = "a5RnKIXFibE5JV_50ir42Hk84JnMZVMb";

const PREFS = ["北海道","青森県","岩手県","宮城県","秋田県","山形県","福島県","茨城県","栃木県","群馬県","埼玉県","千葉県","東京都","神奈川県","新潟県","富山県","石川県","福井県","山梨県","長野県","岐阜県","静岡県","愛知県","三重県","滋賀県","京都府","大阪府","兵庫県","奈良県","和歌山県","鳥取県","島根県","岡山県","広島県","山口県","徳島県","香川県","愛媛県","高知県","福岡県","佐賀県","長崎県","熊本県","大分県","宮崎県","鹿児島県","沖縄県"];

const emptyForm = {name_last:"",name_first:"",postal_code:"",prefecture:"東京都",city:"",address1:"",address2:"",phone:"",is_default:false};

export default function AddressPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [mounted, setMounted] = useState(false);
  const [addresses, setAddresses] = useState<any[]>([]);
  const [customerId, setCustomerId] = useState<string|null>(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState<number|null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(()=>{ setMounted(true); },[]);
  useEffect(()=>{ if(mounted&&!user) router.push("/login"); else if(mounted&&user) fetchData(); },[mounted,user]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const cusRes = await fetch(`${DIRECTUS}/items/customers?filter[email][_eq]=${encodeURIComponent(user!.email)}&fields=id&limit=1`,{headers:{Authorization:`Bearer ${TOKEN}`}});
      const cusData = await cusRes.json();
      const cus = cusData.data?.[0];
      if (!cus) { setLoading(false); return; }
      setCustomerId(cus.id);
      const addrRes = await fetch(`${DIRECTUS}/items/addresses?filter[customer_id][_eq]=${cus.id}&sort=-is_default,created_at`,{headers:{Authorization:`Bearer ${TOKEN}`}});
      const addrData = await addrRes.json();
      setAddresses(addrData.data||[]);
    } catch(e){ console.error(e); }
    setLoading(false);
  };

  const handleSave = async () => {
    if(!form.name_last||!form.name_first||!form.postal_code||!form.prefecture||!form.city||!form.address1){
      setError("必須項目を入力してください"); return;
    }
    setSaving(true); setError("");
    try {
      const body = {...form, customer_id: customerId};
      let res;
      if (editId) {
        res = await fetch(`${DIRECTUS}/items/addresses/${editId}`,{method:"PATCH",headers:{"Content-Type":"application/json",Authorization:`Bearer ${TOKEN}`},body:JSON.stringify(body)});
      } else {
        res = await fetch(`${DIRECTUS}/items/addresses`,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${TOKEN}`},body:JSON.stringify(body)});
      }
      if(!res.ok) throw new Error("保存に失敗しました");
      setShowForm(false); setForm(emptyForm); setEditId(null);
      await fetchData();
    } catch(e:any){ setError(e.message||"保存に失敗しました"); }
    setSaving(false);
  };

  const handleDelete = async (id:number) => {
    if(!confirm("この住所を削除しますか？")) return;
    await fetch(`${DIRECTUS}/items/addresses/${id}`,{method:"DELETE",headers:{Authorization:`Bearer ${TOKEN}`}});
    await fetchData();
  };

  const handleEdit = (addr:any) => {
    setForm({name_last:addr.name_last||"",name_first:addr.name_first||"",postal_code:addr.postal_code||"",prefecture:addr.prefecture||"東京都",city:addr.city||"",address1:addr.address1||"",address2:addr.address2||"",phone:addr.phone||"",is_default:addr.is_default||false});
    setEditId(addr.id); setShowForm(true);
  };

  const F = ({label,value,onChange,placeholder,required=false}:{label:string,value:string,onChange:(v:string)=>void,placeholder?:string,required?:boolean}) => (
    <div>
      <div style={{fontSize:12,fontWeight:700,color:C.textSub,marginBottom:4}}>{label}{required&&<span style={{color:C.red,fontSize:10,marginLeft:4}}>※</span>}</div>
      <input value={value} onChange={e=>onChange(e.target.value)} onCompositionEnd={e=>onChange((e.target as HTMLInputElement).value)}
        style={{width:"100%",border:`1px solid ${C.border}`,borderRadius:2,padding:"8px 12px",fontSize:13,outline:"none",fontFamily:"inherit",boxSizing:"border-box" as any}}/>
    </div>
  );

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
          <button onClick={()=>{setShowForm(true);setEditId(null);setForm(emptyForm);}}
            style={{marginLeft:"auto",background:C.primary,color:"#fff",border:"none",padding:"8px 16px",borderRadius:2,fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>
            ＋ 新しい住所を追加
          </button>
        </div>

        {error&&<div style={{background:"#FFF0F0",border:"1px solid #FFAAAA",borderRadius:2,padding:"10px 14px",fontSize:12,color:C.red,marginBottom:14}}>{error}</div>}

        {/* 新規/編集フォーム */}
        {showForm&&(
          <div style={{background:C.white,border:`2px solid ${C.primary}`,borderRadius:2,padding:20,marginBottom:16}}>
            <div style={{fontSize:14,fontWeight:700,color:C.primary,marginBottom:14,paddingBottom:8,borderBottom:`1px solid ${C.border}`}}>
              {editId?"住所を編集":"新しいお届け先を追加"}
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:12}}>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                <F label="姓" value={form.name_last} onChange={v=>setForm(p=>({...p,name_last:v}))} placeholder="山田" required/>
                <F label="名" value={form.name_first} onChange={v=>setForm(p=>({...p,name_first:v}))} placeholder="太郎" required/>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 2fr",gap:10}}>
                <F label="郵便番号" value={form.postal_code} onChange={v=>setForm(p=>({...p,postal_code:v}))} placeholder="123-4567" required/>
                <div>
                  <div style={{fontSize:12,fontWeight:700,color:C.textSub,marginBottom:4}}>都道府県<span style={{color:C.red,fontSize:10,marginLeft:4}}>※</span></div>
                  <select value={form.prefecture} onChange={e=>setForm(p=>({...p,prefecture:e.target.value}))}
                    style={{width:"100%",border:`1px solid ${C.border}`,borderRadius:2,padding:"8px 12px",fontSize:13,outline:"none",fontFamily:"inherit",boxSizing:"border-box" as any,background:C.white}}>
                    {PREFS.map(p=><option key={p}>{p}</option>)}
                  </select>
                </div>
              </div>
              <F label="市区町村" value={form.city} onChange={v=>setForm(p=>({...p,city:v}))} placeholder="渋谷区" required/>
              <F label="番地・建物名" value={form.address1} onChange={v=>setForm(p=>({...p,address1:v}))} placeholder="渋谷1-1-1" required/>
              <F label="マンション名・部屋番号（任意）" value={form.address2} onChange={v=>setForm(p=>({...p,address2:v}))} placeholder="渋谷マンション101"/>
              <F label="電話番号" value={form.phone} onChange={v=>setForm(p=>({...p,phone:v}))} placeholder="090-1234-5678"/>
              <div style={{display:"flex",alignItems:"center",gap:8,cursor:"pointer"}} onClick={()=>setForm(p=>({...p,is_default:!p.is_default}))}>
                <div style={{width:18,height:18,border:`2px solid ${form.is_default?C.primary:C.border}`,borderRadius:2,background:form.is_default?C.primary:"#fff",display:"flex",alignItems:"center",justifyContent:"center"}}>
                  {form.is_default&&<span style={{color:"#fff",fontSize:12}}>✓</span>}
                </div>
                <span style={{fontSize:12,color:C.text}}>デフォルトの配送先として設定する</span>
              </div>
              <div style={{display:"flex",gap:10}}>
                <button onClick={handleSave} disabled={saving}
                  style={{flex:1,background:saving?"#AAA":C.primary,color:"#fff",border:"none",borderRadius:2,padding:"10px",fontSize:13,fontWeight:700,cursor:saving?"not-allowed":"pointer",fontFamily:"inherit"}}>
                  {saving?"保存中...":"保存する"}
                </button>
                <button onClick={()=>{setShowForm(false);setEditId(null);setForm(emptyForm);setError("");}}
                  style={{background:"#fff",color:C.textSub,border:`1px solid ${C.border}`,borderRadius:2,padding:"10px 20px",fontSize:13,cursor:"pointer",fontFamily:"inherit"}}>
                  キャンセル
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 住所リスト */}
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
