"use client";

import { useEffect, useState, useCallback, useRef, createContext, useContext } from "react";
import type { DashboardData, CommissionLine } from "@/lib/fetchDashboard";

// ── Mobile context ────────────────────────────────────────────────────────────
const MobileCtx = createContext(false);
const useMobile  = () => useContext(MobileCtx);

// ── Format helpers ─────────────────────────────────────────────────────────────
const fmt$ = (n: number) =>
  "$" + n.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
const fmt$Exact = (n: number) =>
  "$" + n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const fmtPct = (n: number) => n + "%";

function fmtCallTime(iso: string): { when: string; fromNow: string; isToday: boolean; isSoon: boolean } {
  const d   = new Date(iso);
  const now = new Date();
  const diff = d.getTime() - now.getTime();
  const diffH = Math.floor(diff / 3_600_000);
  const diffD = Math.floor(diff / 86_400_000);

  const timeStr = d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
  const todayStart    = new Date(); todayStart.setHours(0, 0, 0, 0);
  const tomorrowStart = new Date(todayStart); tomorrowStart.setDate(todayStart.getDate() + 1);
  const dayAfterStart = new Date(todayStart); dayAfterStart.setDate(todayStart.getDate() + 2);

  const isToday    = d >= todayStart && d < tomorrowStart;
  const isTomorrow = d >= tomorrowStart && d < dayAfterStart;
  const isSoon     = diff > 0 && diff < 2 * 3_600_000; // within 2 hours

  let when: string;
  if (isToday)    when = `Today · ${timeStr}`;
  else if (isTomorrow) when = `Tomorrow · ${timeStr}`;
  else            when = d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }) + ` · ${timeStr}`;

  let fromNow: string;
  if (diff <= 0)       fromNow = "now";
  else if (diffH < 1)  fromNow = "< 1h";
  else if (diffH < 24) fromNow = `in ${diffH}h`;
  else                 fromNow = `in ${diffD}d`;

  return { when, fromNow, isToday, isSoon };
}

// ── Page types ────────────────────────────────────────────────────────────────
type PageKey = "dashboard" | "revenue" | "funnel" | "commissions" | "eod" | "overhead";

const NAV: { key: PageKey; label: string }[] = [
  { key: "dashboard",   label: "Dashboard"   },
  { key: "revenue",     label: "Revenue"     },
  { key: "funnel",      label: "Funnel"      },
  { key: "commissions", label: "Commissions" },
  { key: "eod",         label: "EOD Reports" },
  { key: "overhead",    label: "Overhead"    },
];

// ── Atoms ─────────────────────────────────────────────────────────────────────
function GoldDivider(){return <div style={{height:1,background:"linear-gradient(90deg,rgba(201,168,76,0.3),transparent)",margin:"0 0 28px"}}/>;}
function SectionLabel({children}:{children:React.ReactNode}){return <p style={{fontFamily:"var(--font-body)",fontSize:10,letterSpacing:"0.14em",textTransform:"uppercase",color:"#444",marginBottom:14}}>{children}</p>;}
function Card({children,style}:{children:React.ReactNode;style?:React.CSSProperties}){return <div style={{background:"rgba(255,255,255,0.025)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:10,padding:"18px 20px",...style}}>{children}</div>;}

function KpiCard({label,value,sub,accent,warn,green}:{label:string;value:string|number;sub?:string;accent?:boolean;warn?:boolean;green?:boolean;}){
  const col=warn?"#E05252":green?"#C9A84C":accent?"#C9A84C":"#F2EDE6";
  return(
    <Card>
      <p style={{fontFamily:"var(--font-body)",fontSize:10,letterSpacing:"0.13em",textTransform:"uppercase",color:"#555",marginBottom:8}}>{label}</p>
      <p style={{fontFamily:"var(--font-display)",fontSize:"clamp(20px,3vw,30px)",color:col,lineHeight:1}}>{value}</p>
      {sub&&<p style={{fontFamily:"var(--font-body)",fontSize:11,color:"#555",marginTop:6}}>{sub}</p>}
    </Card>
  );
}

function Pill({ok,label}:{ok:boolean;label:string}){
  return(
    <span style={{display:"inline-flex",alignItems:"center",gap:6,padding:"3px 9px",borderRadius:999,fontSize:11,fontWeight:600,fontFamily:"var(--font-body)",background:ok?"rgba(201,168,76,0.12)":"rgba(224,82,82,0.12)",color:ok?"#C9A84C":"#E05252",border:`1px solid ${ok?"rgba(201,168,76,0.25)":"rgba(224,82,82,0.25)"}`}}>
      <span style={{width:6,height:6,borderRadius:"50%",background:ok?"#C9A84C":"#E05252",display:"inline-block"}}/>
      {label}
    </span>
  );
}

function BarRow({label,value,total,color="#C9A84C",sub}:{label:string;value:number;total:number;color?:string;sub?:string;}){
  const pct=total>0?Math.min(Math.round((value/total)*100),100):0;
  return(
    <div style={{display:"flex",alignItems:"center",gap:10}}>
      <p style={{fontFamily:"var(--font-body)",fontSize:12,color:"#888",minWidth:80,flexShrink:0}}>{label}</p>
      <div style={{flex:1,height:5,borderRadius:3,background:"rgba(255,255,255,0.06)",overflow:"hidden"}}>
        <div style={{width:`${pct}%`,height:"100%",background:color,borderRadius:3,transition:"width 0.5s ease"}}/>
      </div>
      <span style={{fontFamily:"var(--font-body)",fontSize:12,fontWeight:600,color:"#F2EDE6",minWidth:24,textAlign:"right"}}>{sub??value}</span>
    </div>
  );
}

function Skeleton({h=110}:{h?:number}){return <div style={{height:h,borderRadius:10,background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.05)",animation:"pulse 2s ease-in-out infinite"}}/>;}
function Spinner(){return <div style={{width:14,height:14,border:"2px solid rgba(201,168,76,0.2)",borderTopColor:"#C9A84C",borderRadius:"50%",animation:"spin 0.7s linear infinite"}}/>;}

// ── Donut chart ───────────────────────────────────────────────────────────────
function DonutChart({segments,size=130}:{segments:{label:string;value:number;color:string}[];size?:number;}){
  const mobile=useMobile();
  const sz=mobile?110:size;
  const total=segments.reduce((s,seg)=>s+seg.value,0);
  if(total===0) return <p style={{color:"#555",fontSize:12}}>No data</p>;
  const cx=sz/2,cy=sz/2,r=sz*0.38,inner=sz*0.22;
  let angle=-Math.PI/2;
  const paths=segments.map(seg=>{
    const slice=(seg.value/total)*2*Math.PI;
    const x1=cx+r*Math.cos(angle),y1=cy+r*Math.sin(angle);
    const x2=cx+r*Math.cos(angle+slice),y2=cy+r*Math.sin(angle+slice);
    const largeArc=slice>Math.PI?1:0;
    const path=`M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z`;
    angle+=slice;
    return {...seg,path,pct:Math.round((seg.value/total)*100)};
  });
  return(
    <div style={{display:"flex",alignItems:"center",gap:16,flexWrap:"wrap"}}>
      <svg width={sz} height={sz} style={{flexShrink:0}}>
        {paths.map(p=><path key={p.label} d={p.path} fill={p.color} stroke="#0A0A0A" strokeWidth={2}/>)}
        <circle cx={cx} cy={cy} r={inner} fill="#0A0A0A"/>
      </svg>
      <div style={{display:"flex",flexDirection:"column",gap:10}}>
        {paths.map(p=>(
          <div key={p.label} style={{display:"flex",alignItems:"center",gap:8}}>
            <span style={{width:10,height:10,borderRadius:2,background:p.color,flexShrink:0}}/>
            <div>
              <p style={{fontFamily:"var(--font-body)",fontSize:13,color:"#F2EDE6",margin:0}}>{p.label}</p>
              <p style={{fontFamily:"var(--font-body)",fontSize:11,color:"#666",margin:0}}>{p.pct}% · {fmt$(p.value)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Monthly bar chart ─────────────────────────────────────────────────────────
function MonthlyBarChart({ data, title }: { data: { month: string; amount: number }[]; title: string }) {
  const [hovered, setHovered] = useState<number | null>(null);
  const max     = Math.max(...data.map(d => d.amount), 1);
  const chartH  = 150;
  const padL    = 44;
  const padB    = 26;
  const padT    = 10;
  // Fixed viewBox width — SVG scales to 100% container width
  const VBW     = 600;
  const svgH    = chartH + padB + padT;
  const gap     = 6;
  const barW    = (VBW - padL - (data.length + 1) * gap) / data.length;
  const niceMax = Math.ceil(max / 1000) * 1000 || 1000;
  const yTicks  = [0, 0.25, 0.5, 0.75, 1].map(f => Math.round(niceMax * f));

  return (
    <Card>
      <p style={{fontFamily:"var(--font-body)",fontSize:12,fontWeight:600,color:"#F2EDE6",marginBottom:14}}>{title}</p>
      <div style={{position:"relative"}}>
        {/* Tooltip — positioned in SVG coordinate space, scaled via % */}
        {hovered !== null && data[hovered].amount > 0 && (()=>{
          const d    = data[hovered];
          const cx   = padL + gap + hovered * (barW + gap) + barW / 2;
          const barH = Math.max((d.amount / niceMax) * chartH, 2);
          const tipY = padT + chartH - barH - 34;
          // Convert SVG coords → % of viewBox for the absolutely positioned div
          const leftPct = (cx / VBW) * 100;
          const topPct  = (tipY / svgH) * 100;
          return(
            <div style={{position:"absolute",left:`${leftPct}%`,top:`${topPct}%`,transform:"translateX(-50%)",background:"rgba(13,13,13,0.97)",border:"1px solid rgba(201,168,76,0.4)",borderRadius:6,padding:"4px 10px",pointerEvents:"none",zIndex:10,whiteSpace:"nowrap"}}>
              <p style={{fontFamily:"var(--font-body)",fontSize:12,color:"#C9A84C",margin:0,fontWeight:700}}>{fmt$(d.amount)}</p>
            </div>
          );
        })()}
        <svg width="100%" viewBox={`0 0 ${VBW} ${svgH}`} preserveAspectRatio="none" style={{display:"block"}}>
          {/* Grid lines + Y labels */}
          {yTicks.map(tick=>{
            const y=padT+chartH-(tick/niceMax)*chartH;
            return(
              <g key={tick}>
                <line x1={padL} x2={VBW} y1={y} y2={y} stroke="rgba(255,255,255,0.05)" strokeWidth={1}/>
                <text x={padL-6} y={y+4} textAnchor="end" fontSize={11} fill="#444" fontFamily="sans-serif">
                  {tick===0?"0":tick>=1000?`${tick/1000}K`:tick}
                </text>
              </g>
            );
          })}
          {/* X axis */}
          <line x1={padL} x2={VBW} y1={padT+chartH} y2={padT+chartH} stroke="rgba(255,255,255,0.1)" strokeWidth={1}/>
          {/* Bars */}
          {data.map((d,i)=>{
            const barH  = d.amount>0?Math.max((d.amount/niceMax)*chartH,2):0;
            const x     = padL+gap+i*(barW+gap);
            const y     = padT+chartH-barH;
            const isHov = hovered===i;
            return(
              <g key={d.month} onMouseEnter={()=>setHovered(i)} onMouseLeave={()=>setHovered(null)} style={{cursor:d.amount>0?"pointer":"default"}}>
                <rect x={x} y={d.amount>0?y:padT+chartH-1} width={barW} height={d.amount>0?barH:1}
                  fill={d.amount>0?(isHov?"#D4AF37":"#C9A84C"):"rgba(255,255,255,0.04)"} rx={2}/>
                <text x={x+barW/2} y={padT+chartH+17} textAnchor="middle" fontSize={11} fill={isHov?"#888":"#444"} fontFamily="sans-serif">{d.month}</text>
              </g>
            );
          })}
        </svg>
      </div>
    </Card>
  );
}

// ── Funnel viz ────────────────────────────────────────────────────────────────
function FunnelViz({steps}:{steps:{label:string;value:number;pct?:number}[]}){
  const max=Math.max(...steps.map(s=>s.value),1);
  return(
    <div style={{display:"flex",flexDirection:"column",gap:10}}>
      {steps.map((step,i)=>(
        <div key={step.label}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
            <span style={{fontFamily:"var(--font-body)",fontSize:12,color:"#888"}}>{step.label}</span>
            <div style={{display:"flex",gap:8,alignItems:"center"}}>
              {step.pct!==undefined&&step.pct>0&&<span style={{fontFamily:"var(--font-body)",fontSize:11,color:"#666"}}>{step.pct}%</span>}
              <span style={{fontFamily:"var(--font-body)",fontSize:13,fontWeight:700,color:"#F2EDE6"}}>{step.value}</span>
            </div>
          </div>
          <div style={{height:8,borderRadius:4,background:"rgba(255,255,255,0.06)",overflow:"hidden"}}>
            <div style={{width:`${Math.max((step.value/max)*100,step.value>0?4:0)}%`,height:"100%",borderRadius:4,background:i===0?"#555":i===1?"#C9A84C":"#A07830",transition:"width 0.6s ease"}}/>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Commission table ──────────────────────────────────────────────────────────
function CommissionTable({title,rows,subRows,accent}:{title:string;rows:CommissionLine[];subRows?:CommissionLine[];accent?:string;}){
  if(!rows.length) return null;
  const paidMap=new Map((subRows??[]).map(r=>[r.name,r.amount]));
  return(
    <div>
      <p style={{fontFamily:"var(--font-body)",fontSize:10,letterSpacing:"0.12em",textTransform:"uppercase",color:"#555",marginBottom:10}}>{title}</p>
      <div style={{border:"1px solid rgba(255,255,255,0.07)",borderRadius:8,overflow:"hidden"}}>
        {rows.map((r,i)=>(
          <div key={r.name} style={{display:"grid",gridTemplateColumns:"1fr auto auto",gap:10,padding:"9px 14px",alignItems:"center",borderBottom:i<rows.length-1?"1px solid rgba(255,255,255,0.05)":"none"}}>
            <span style={{fontFamily:"var(--font-body)",fontSize:13,color:"#CCC"}}>{r.name}</span>
            <span style={{fontFamily:"var(--font-body)",fontSize:11,color:"#555"}}>{paidMap.has(r.name)?`${fmt$(paidMap.get(r.name)!)} paid`:""}</span>
            <span style={{fontFamily:"var(--font-body)",fontSize:13,fontWeight:700,color:accent??"#C9A84C",minWidth:64,textAlign:"right"}}>{fmt$(r.amount)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Revana panel ──────────────────────────────────────────────────────────────
function RevanaPanel({netEarnings,setterTotal,closerTotal}:{netEarnings:number;setterTotal:number;closerTotal:number;}){
  const [rate,setRate]=useState(10);
  const remaining=Math.max(netEarnings-setterTotal-closerTotal,0);
  const revana=Math.round(remaining*(rate/100)*100)/100;
  const hudson=Math.round(Math.max(remaining-revana,0)*100)/100;
  return(
    <Card>
      <p style={{fontFamily:"var(--font-body)",fontSize:10,letterSpacing:"0.13em",textTransform:"uppercase",color:"#555",marginBottom:14}}>Revana Commission</p>
      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:16}}>
        <span style={{fontFamily:"var(--font-body)",fontSize:12,color:"#777"}}>Agency rate:</span>
        <input type="number" min={0} max={100} value={rate} onChange={e=>setRate(Math.max(0,Math.min(100,Number(e.target.value))))}
          style={{width:52,padding:"3px 8px",borderRadius:6,border:"1px solid rgba(201,168,76,0.3)",background:"rgba(201,168,76,0.07)",color:"#F2EDE6",fontFamily:"var(--font-body)",fontSize:13,outline:"none"}}/>
        <span style={{fontFamily:"var(--font-body)",fontSize:12,color:"#777"}}>%</span>
      </div>
      {[
        {label:"Net Earnings (collected)",value:fmt$(netEarnings),col:"#F2EDE6"},
        {label:"Setter commissions paid", value:`-${fmt$(setterTotal)}`,col:"#E05252"},
        {label:"Closer commissions paid", value:`-${fmt$(closerTotal)}`,col:"#E05252"},
      ].map(row=>(
        <div key={row.label} style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
          <span style={{fontFamily:"var(--font-body)",fontSize:12,color:"#777"}}>{row.label}</span>
          <span style={{fontFamily:"var(--font-body)",fontSize:13,color:row.col,fontWeight:600}}>{row.value}</span>
        </div>
      ))}
      <div style={{height:1,background:"rgba(255,255,255,0.07)",margin:"8px 0 10px"}}/>
      <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
        <span style={{fontFamily:"var(--font-body)",fontSize:13,color:"#C9A84C",fontWeight:700}}>Revana ({rate}%)</span>
        <span style={{fontFamily:"var(--font-display)",fontSize:22,color:"#C9A84C",lineHeight:1}}>{fmt$(revana)}</span>
      </div>
      <div style={{display:"flex",justifyContent:"space-between"}}>
        <span style={{fontFamily:"var(--font-body)",fontSize:12,color:"#777"}}>Hudson net</span>
        <span style={{fontFamily:"var(--font-display)",fontSize:22,color:"#F2EDE6",lineHeight:1}}>{fmt$(hudson)}</span>
      </div>
    </Card>
  );
}

// ── EOD table ─────────────────────────────────────────────────────────────────
function EodTable({title,rows,columns,emptyMsg}:{title:string;rows:Record<string,string|number>[];columns:{key:string;label:string}[];emptyMsg?:string;}){
  return(
    <Card>
      <p style={{fontFamily:"var(--font-body)",fontSize:12,fontWeight:600,color:"#F2EDE6",marginBottom:14}}>{title}</p>
      {rows.length===0?(
        <p style={{fontFamily:"var(--font-body)",fontSize:12,color:"#444",fontStyle:"italic"}}>{emptyMsg??"No reports yet"}</p>
      ):(
        <div style={{overflowX:"auto",WebkitOverflowScrolling:"touch"}}>
          <table style={{width:"100%",borderCollapse:"collapse",fontFamily:"var(--font-body)",fontSize:12,minWidth:420}}>
            <thead><tr>{columns.map(col=><th key={col.key} style={{textAlign:"left",color:"#555",fontWeight:600,letterSpacing:"0.1em",textTransform:"uppercase",fontSize:10,padding:"0 10px 8px 0",borderBottom:"1px solid rgba(255,255,255,0.06)"}}>{col.label}</th>)}</tr></thead>
            <tbody>{rows.map((row,i)=><tr key={i}>{columns.map(col=><td key={col.key} style={{padding:"7px 10px 7px 0",color:"#AAA",borderBottom:"1px solid rgba(255,255,255,0.04)",whiteSpace:"nowrap"}}>{String(row[col.key]??"")}</td>)}</tr>)}</tbody>
          </table>
        </div>
      )}
    </Card>
  );
}

// ── Nav icons ─────────────────────────────────────────────────────────────────
function NavIcon({k}:{k:PageKey}){
  const s:React.CSSProperties={width:15,height:15};
  if(k==="dashboard") return <svg style={s} viewBox="0 0 15 15" fill="currentColor"><rect x="1" y="1" width="5" height="5" rx="1"/><rect x="9" y="1" width="5" height="5" rx="1" opacity=".6"/><rect x="1" y="9" width="5" height="5" rx="1" opacity=".6"/><rect x="9" y="9" width="5" height="5" rx="1"/></svg>;
  if(k==="revenue")   return <svg style={s} viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="7.5" cy="7.5" r="6"/><path d="M7.5 4v7M5.5 6c0-1.1.9-2 2-2s2 .9 2 2-1.7 1.5-2 1.5m0 0c-.6.1-2 .7-2 2s.9 2 2 2 2-.9 2-2" strokeLinecap="round"/></svg>;
  if(k==="funnel")    return <svg style={s} viewBox="0 0 15 15" fill="currentColor"><path d="M1 2h13L9.5 7.5V13l-4-2V7.5L1 2z" opacity=".8"/></svg>;
  if(k==="commissions") return <svg style={s} viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="4.5" cy="4.5" r="2"/><circle cx="10.5" cy="10.5" r="2"/><line x1="13" y1="2" x2="2" y2="13"/></svg>;
  if(k==="eod")       return <svg style={s} viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.3"><rect x="3" y="1" width="9" height="13" rx="1"/><line x1="5" y1="5" x2="10" y2="5"/><line x1="5" y1="8" x2="10" y2="8"/><line x1="5" y1="11" x2="8" y2="11"/></svg>;
  return <svg style={s} viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.3"><rect x="1" y="4" width="13" height="9" rx="1"/><path d="M5 4V3a2 2 0 014 0v1"/><line x1="7.5" y1="7" x2="7.5" y2="10"/><line x1="6" y1="8.5" x2="9" y2="8.5"/></svg>;
}

function Logo(){return(<svg width="18" height="18" viewBox="0 0 40 40" fill="none"><rect x="2" y="22" width="6" height="14" rx="1.5" fill="#C9A84C"/><rect x="12" y="14" width="6" height="22" rx="1.5" fill="#D4AF37"/><rect x="22" y="8" width="6" height="28" rx="1.5" fill="#C9A84C"/><rect x="32" y="2" width="6" height="34" rx="1.5" fill="#D4AF37"/></svg>);}

// ── Sidebar (desktop only) ────────────────────────────────────────────────────
function Sidebar({current,onChange,refreshing,onRefresh,updated}:{current:PageKey;onChange:(k:PageKey)=>void;refreshing:boolean;onRefresh:()=>void;updated:string;}){
  return(
    <aside style={{width:200,minHeight:"100vh",background:"#0D0D0D",borderRight:"1px solid rgba(255,255,255,0.06)",display:"flex",flexDirection:"column",position:"sticky",top:0,height:"100vh",flexShrink:0}}>
      <div style={{padding:"22px 16px 16px",borderBottom:"1px solid rgba(255,255,255,0.06)"}}>
        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}><Logo/><span style={{fontFamily:"var(--font-display)",fontSize:9,color:"#F2EDE6",letterSpacing:"0.16em"}}>HUDDYERTRADES</span></div>
        <p style={{fontFamily:"var(--font-display)",fontSize:11,color:"#C9A84C",letterSpacing:"0.12em",margin:0}}>OPS DASHBOARD</p>
      </div>
      <nav style={{padding:"12px 8px",flex:1}}>
        {NAV.map(item=>(
          <button key={item.key} onClick={()=>onChange(item.key)} style={{display:"flex",alignItems:"center",gap:10,width:"100%",padding:"9px 12px",borderRadius:8,marginBottom:2,background:current===item.key?"rgba(201,168,76,0.1)":"transparent",border:`1px solid ${current===item.key?"rgba(201,168,76,0.2)":"transparent"}`,color:current===item.key?"#C9A84C":"#555",fontFamily:"var(--font-body)",fontSize:13,cursor:"pointer",textAlign:"left",transition:"all 0.15s"}}>
            <NavIcon k={item.key}/>{item.label}
          </button>
        ))}
      </nav>
      <div style={{padding:"14px 16px",borderTop:"1px solid rgba(255,255,255,0.06)"}}>
        <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:8}}>
          {refreshing&&<div style={{width:10,height:10,border:"1.5px solid rgba(201,168,76,0.2)",borderTopColor:"#C9A84C",borderRadius:"50%",animation:"spin 0.7s linear infinite"}}/>}
          <span style={{fontFamily:"var(--font-body)",fontSize:10,color:"#333"}}>Updated {updated}</span>
        </div>
        <button onClick={onRefresh} disabled={refreshing} style={{fontFamily:"var(--font-body)",fontSize:11,padding:"5px 0",width:"100%",borderRadius:6,background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.07)",color:"#555",cursor:"pointer",opacity:refreshing?0.4:1}}>↻ Refresh</button>
      </div>
    </aside>
  );
}

// ── Bottom nav (mobile only) ──────────────────────────────────────────────────
function BottomNav({current,onChange}:{current:PageKey;onChange:(k:PageKey)=>void;}){
  return(
    <nav style={{position:"fixed",bottom:0,left:0,right:0,zIndex:200,background:"rgba(13,13,13,0.96)",borderTop:"1px solid rgba(255,255,255,0.08)",display:"flex",alignItems:"stretch",backdropFilter:"blur(12px)"}}>
      {NAV.map(item=>(
        <button key={item.key} onClick={()=>onChange(item.key)}
          style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:4,padding:"8px 2px",background:"transparent",border:"none",color:current===item.key?"#C9A84C":"#444",cursor:"pointer",transition:"color 0.15s",minHeight:54}}>
          <NavIcon k={item.key}/>
          <span style={{fontFamily:"var(--font-body)",fontSize:9,letterSpacing:"0.05em",lineHeight:1}}>{item.label.split(" ")[0]}</span>
          {current===item.key&&<div style={{position:"absolute",bottom:0,width:24,height:2,background:"#C9A84C",borderRadius:1}}/>}
        </button>
      ))}
    </nav>
  );
}

// ── Page views ────────────────────────────────────────────────────────────────
const PROG_COLORS=["#A07830","#C9A84C","#D4AF37","#8B6914","#E8C878","#7A5C1E"];

type LeadInfo = { found: boolean; age?: string|null; budget?: string|null; credit?: string|null };

function DashboardView({data}:{data:DashboardData}){
  const mobile=useMobile();
  const sh=data.sheets.connected?data.sheets:null;
  const whop=data.whop;
  const cal=data.calendly;
  const grid1=mobile?"repeat(2,1fr)":"repeat(4,1fr)";

  const upcoming   = cal?.upcomingCalls ?? [];
  const showRate   = cal?.showRate ?? 0;
  const expectedShows = upcoming.length > 0 && showRate > 0
    ? Math.round(upcoming.length * showRate / 100) : null;

  // Expandable lead info state
  const [openRows,    setOpenRows]    = useState<Set<number>>(new Set());
  const [leadInfoMap, setLeadInfoMap] = useState<Map<number, LeadInfo | "loading">>(new Map());

  function toggleRow(i: number, email: string) {
    setOpenRows(prev => {
      const next = new Set(prev);
      if (next.has(i)) { next.delete(i); return next; }
      next.add(i);
      return next;
    });
    if (!leadInfoMap.has(i)) {
      setLeadInfoMap(prev => new Map(prev).set(i, "loading"));
      fetch(`/api/lead-info?email=${encodeURIComponent(email)}`)
        .then(r => r.json())
        .then((info: LeadInfo) => setLeadInfoMap(prev => new Map(prev).set(i, info)))
        .catch(() => setLeadInfoMap(prev => new Map(prev).set(i, { found: false })));
    }
  }

  return(
    <div style={{display:"flex",flexDirection:"column",gap:28}}>

      {/* ── 4 KPI cards ── */}
      <section>
        <SectionLabel>Overview</SectionLabel>
        <div style={{display:"grid",gridTemplateColumns:grid1,gap:10}}>
          <KpiCard label="Total Contracted" value={sh?fmt$(sh.combinedTotalContracted):"—"} accent/>
          <KpiCard label="Cash Collected"   value={sh?fmt$(sh.combinedCashCollected)  :"—"} green/>
          <KpiCard label="MRR"              value={whop?fmt$Exact(whop.mrr):"—"}/>
          <KpiCard label="Deals Closed"     value={sh?.dealsClosed??"—"}/>
        </div>
      </section>

      <GoldDivider/>

      {/* ── Upcoming calls ── */}
      <section>
        <SectionLabel>Upcoming</SectionLabel>

        {/* Summary header */}
        <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:18,flexWrap:"wrap"}}>
          <span style={{fontFamily:"var(--font-display)",fontSize:36,color:"#C9A84C",lineHeight:1}}>{upcoming.length}</span>
          <div>
            <p style={{fontFamily:"var(--font-body)",fontSize:14,color:"#CCC",margin:0}}>
              call{upcoming.length!==1?"s":""} booked in the next 30 days
            </p>
            {expectedShows!==null?(
              <p style={{fontFamily:"var(--font-body)",fontSize:12,color:"#555",margin:"3px 0 0"}}>
                ~{expectedShows} expected to show&nbsp;&nbsp;·&nbsp;&nbsp;{showRate}% historical show rate
              </p>
            ):showRate>0?(
              <p style={{fontFamily:"var(--font-body)",fontSize:12,color:"#555",margin:"3px 0 0"}}>{showRate}% historical show rate</p>
            ):null}
          </div>
        </div>

        {upcoming.length===0?(
          <Card>
            <p style={{fontFamily:"var(--font-body)",fontSize:13,color:"#444",fontStyle:"italic"}}>No upcoming calls scheduled in the next 30 days</p>
          </Card>
        ):(
          <Card style={{padding:0,overflow:"hidden"}}>
            {upcoming.map((call,i)=>{
              const {when,fromNow,isToday,isSoon}=fmtCallTime(call.startTime);
              const isOpen = openRows.has(i);
              const info   = leadInfoMap.get(i);
              return(
                <div key={i} style={{borderBottom:i<upcoming.length-1?"1px solid rgba(255,255,255,0.05)":"none"}}>
                  {/* Main row */}
                  <div style={{
                    display:"flex",alignItems:"center",gap:14,
                    padding:"13px 20px",
                    background:isToday?"rgba(201,168,76,0.04)":"transparent",
                    cursor:"pointer",
                  }} onClick={()=>call.inviteeEmail&&toggleRow(i,call.inviteeEmail)}>
                    {/* Chevron */}
                    <span style={{flexShrink:0,color:"#444",fontSize:11,transition:"transform 0.2s",display:"inline-block",transform:isOpen?"rotate(90deg)":"rotate(0deg)"}}>▶</span>
                    {/* Left: name + email */}
                    <div style={{flex:1,minWidth:0}}>
                      <p style={{fontFamily:"var(--font-body)",fontSize:14,color:"#F2EDE6",margin:0,fontWeight:600,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{call.inviteeName}</p>
                      {call.inviteeEmail&&(
                        <p style={{fontFamily:"var(--font-body)",fontSize:11,color:"#555",margin:"2px 0 0",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{call.inviteeEmail}</p>
                      )}
                    </div>
                    {/* Right: when + countdown */}
                    <div style={{textAlign:"right",flexShrink:0}}>
                      <p style={{fontFamily:"var(--font-body)",fontSize:12,color:isToday?"#C9A84C":"#AAA",margin:0,fontWeight:isToday?600:400}}>{when}</p>
                      <p style={{fontFamily:"var(--font-body)",fontSize:11,color:isSoon?"#E05252":isToday?"#C9A84C":"#555",margin:"2px 0 0",fontWeight:isSoon?700:400}}>{fromNow}</p>
                    </div>
                  </div>
                  {/* Expanded: Typeform answers */}
                  {isOpen&&(
                    <div style={{padding:"10px 20px 14px 48px",background:"rgba(255,255,255,0.02)",borderTop:"1px solid rgba(255,255,255,0.04)"}}>
                      {info==="loading"?(
                        <p style={{fontFamily:"var(--font-body)",fontSize:12,color:"#444",margin:0,fontStyle:"italic"}}>Loading…</p>
                      ):!info||!info.found?(
                        <p style={{fontFamily:"var(--font-body)",fontSize:12,color:"#333",margin:0,fontStyle:"italic"}}>No Typeform response found in Close</p>
                      ):(
                        <div style={{display:"flex",gap:28,flexWrap:"wrap"}}>
                          {[
                            {label:"Age",    value:info.age},
                            {label:"Budget", value:info.budget},
                            {label:"Credit", value:info.credit},
                          ].map(({label,value})=>(
                            <div key={label}>
                              <p style={{fontFamily:"var(--font-body)",fontSize:10,letterSpacing:"0.1em",textTransform:"uppercase",color:"#555",margin:"0 0 3px"}}>{label}</p>
                              <p style={{fontFamily:"var(--font-body)",fontSize:13,color:"#C9A84C",margin:0,fontWeight:600}}>{value??"—"}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </Card>
        )}
      </section>
    </div>
  );
}

function RevenueView({data}:{data:DashboardData}){
  const mobile=useMobile();
  const sh=data.sheets.connected?data.sheets:null;
  const whop=data.whop;
  const cardGrid=mobile?"1fr":"repeat(auto-fit,minmax(260px,1fr))";
  const kpiGrid=mobile?"repeat(2,1fr)":"repeat(4,1fr)";
  return(
    <div style={{display:"flex",flexDirection:"column",gap:28}}>

      {/* ── HIGH TICKET ── */}
      <section>
        <SectionLabel>High Ticket Revenue</SectionLabel>
        <div style={{display:"grid",gridTemplateColumns:kpiGrid,gap:10,marginBottom:14}}>
          <KpiCard label="Total Contracted"  value={sh?fmt$(sh.totalContracted)   :"—"} accent sub="All planned payments"/>
          <KpiCard label="Cash Collected"    value={sh?fmt$(sh.cashCollected)     :"—"} green sub="Received to date"/>
          <KpiCard label="Uncollected"       value={sh?fmt$(sh.uncollectedRevenue):"—"} sub="Future scheduled"/>
          <KpiCard label="Still Due This Month" value={sh?fmt$(sh.revenueStillDueThisMonth):"—"} sub="Tomorrow → end of month"/>
        </div>
        {sh&&<div style={{marginBottom:14}}><MonthlyBarChart data={sh.htCashCollectedByMonth} title="Cash Collected by Month"/></div>}
        <div style={{display:"grid",gridTemplateColumns:cardGrid,gap:14}}>
          <Card>
            <p style={{fontFamily:"var(--font-body)",fontSize:12,fontWeight:600,color:"#F2EDE6",marginBottom:16}}>PIF vs Financed</p>
            {sh&&(sh.pifContracted>0||sh.financedContracted>0)?(
              <DonutChart segments={[{label:"PIF",value:sh.pifContracted,color:"#A07830"},{label:"Financed",value:sh.financedContracted,color:"#C9A84C"}]}/>
            ):<p style={{color:"#555",fontSize:12}}>No data</p>}
          </Card>
          <Card>
            <p style={{fontFamily:"var(--font-body)",fontSize:12,fontWeight:600,color:"#F2EDE6",marginBottom:16}}>Revenue by Program</p>
            {sh?.revenueByProgram.length?(
              <DonutChart segments={sh.revenueByProgram.map((p,i)=>({label:p.program,value:p.contracted,color:PROG_COLORS[i%PROG_COLORS.length]}))}/>
            ):<p style={{color:"#555",fontSize:12}}>No data</p>}
          </Card>
        </div>
      </section>

      <GoldDivider/>

      {/* ── LOW TICKET (WHOP) ── */}
      <section>
        <SectionLabel>Low Ticket Revenue (Whop)</SectionLabel>
        <div style={{display:"grid",gridTemplateColumns:mobile?"repeat(2,1fr)":"repeat(5,1fr)",gap:10,marginBottom:14}}>
          <KpiCard label="All-Time Revenue" value={sh?fmt$(sh.lowTicketRevenue)      :"—"} accent sub={sh?`${sh.lowTicketPaymentCount} payments`:undefined}/>
          <KpiCard label="This Month"       value={sh?fmt$(sh.lowTicketThisMonth)    :"—"} sub="Payments this month"/>
          <KpiCard label="Today"            value={sh?fmt$Exact(sh.lowTicketToday)   :"—"} sub="Payments today"/>
          <KpiCard label="MRR"              value={whop?fmt$Exact(whop.mrr)          :"—"} accent sub={whop?`${whop.activeMemberCount} active members`:undefined}/>
          <KpiCard label="New This Month"   value={whop?whop.newMembersThisMonth     :"—"} sub="New subscribers"/>
        </div>
        {sh&&<MonthlyBarChart data={sh.ltRevenueByMonth} title="Revenue by Month"/>}
      </section>

      {/* ── CHURNED / VOIDED ── */}
      {sh&&sh.churnedRevenue>0&&(
        <>
          <GoldDivider/>
          <section>
            <SectionLabel>Churned / Voided</SectionLabel>
            <div style={{display:"grid",gridTemplateColumns:cardGrid,gap:14}}>
              <Card>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
                  <p style={{fontFamily:"var(--font-body)",fontSize:12,fontWeight:600,color:"#F2EDE6",margin:0}}>Voided Payments</p>
                  <span style={{fontFamily:"var(--font-display)",fontSize:20,color:"#E05252"}}>{fmt$(sh.churnedRevenue)}</span>
                </div>
                {sh.voidedLeads.length===0?(
                  <p style={{fontFamily:"var(--font-body)",fontSize:12,color:"#444",fontStyle:"italic"}}>No voids recorded</p>
                ):(
                  <div style={{border:"1px solid rgba(255,255,255,0.07)",borderRadius:8,overflow:"hidden"}}>
                    {sh.voidedLeads.map((v,i)=>(
                      <div key={v.leadName} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"9px 14px",borderBottom:i<sh.voidedLeads.length-1?"1px solid rgba(255,255,255,0.05)":"none"}}>
                        <span style={{fontFamily:"var(--font-body)",fontSize:13,color:"#CCC"}}>{v.leadName||"—"}</span>
                        <span style={{fontFamily:"var(--font-body)",fontSize:13,fontWeight:700,color:"#E05252"}}>{fmt$(v.amount)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            </div>
          </section>
        </>
      )}
    </div>
  );
}

function FunnelView({data}:{data:DashboardData}){
  const mobile=useMobile();
  const sh=data.sheets.connected?data.sheets:null;
  const cal=data.calendly;
  const tf=data.typeform;
  const LEAD_SOURCE_KEYS=["youtube","linktree","manychat","meta","instagram"];
  const LEAD_SOURCE_LABEL:Record<string,string>={youtube:"Youtube",linktree:"Linktree",manychat:"Manychat",meta:"Meta",instagram:"Instagram"};
  const srcCountMap=new Map((tf?.trafficSources??[]).map(s=>[s.source.toLowerCase(),s.count]));
  const filteredSources=LEAD_SOURCE_KEYS
    .map(k=>({source:LEAD_SOURCE_LABEL[k],count:srcCountMap.get(k)??0}))
    .filter(s=>s.count>0)
    .sort((a,b)=>b.count-a.count);
  const srcMax=Math.max(...filteredSources.map(s=>s.count),1);
  const cardGrid=mobile?"1fr":"repeat(auto-fit,minmax(260px,1fr))";
  return(
    <div style={{display:"flex",flexDirection:"column",gap:28}}>
      <section>
        <SectionLabel>Funnel</SectionLabel>
        <div style={{display:"grid",gridTemplateColumns:cardGrid,gap:14}}>
          <Card>
            <p style={{fontFamily:"var(--font-body)",fontSize:12,fontWeight:600,color:"#F2EDE6",marginBottom:16}}>Applications → Calls → Deals</p>
            {(()=>{
              const eodBooked=(sh?.setterEod.rows??[]).reduce((s,r)=>s+r.callsBooked,0);
              const apps=tf?.totalInRange??0;
              const deals=sh?.dealsClosed??0;
              const convRate=apps>0?Math.round((eodBooked/apps)*100):0;
              const closeRt=eodBooked>0?Math.round((deals/eodBooked)*100):0;
              return(
                <FunnelViz steps={[
                  {label:"Applications (Typeform)",value:apps},
                  {label:"Calls Booked (EOD)",     value:eodBooked,pct:convRate},
                  {label:"Deals Closed",            value:deals,pct:closeRt},
                ]}/>
              );
            })()}
          </Card>
          <Card>
            <p style={{fontFamily:"var(--font-body)",fontSize:12,fontWeight:600,color:"#F2EDE6",marginBottom:14}}>Key Rates</p>
            {(()=>{
              const eodBooked=(sh?.setterEod.rows??[]).reduce((s,r)=>s+r.callsBooked,0);
              const apps=tf?.totalInRange??0;
              const deals=sh?.dealsClosed??0;
              const convRate=apps>0?Math.round((eodBooked/apps)*100):null;
              const closeRt=eodBooked>0?Math.round((deals/eodBooked)*100):null;
              return [
                {label:"Conversion Rate",value:convRate!==null?fmtPct(convRate):"—",sub:"Applications → Calls"},
                {label:"Close Rate",     value:closeRt!==null?fmtPct(closeRt):"—",sub:"Calls → Deals"},
                {label:"Show Rate",      value:cal?fmtPct(cal.showRate):"—",sub:`${cal?.cancelledInRange??0} cancelled`},
              ].map(r=>(
                <div key={r.label} style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
                  <div><p style={{fontFamily:"var(--font-body)",fontSize:13,color:"#CCC",margin:0}}>{r.label}</p><p style={{fontFamily:"var(--font-body)",fontSize:11,color:"#555",margin:0}}>{r.sub}</p></div>
                  <span style={{fontFamily:"var(--font-display)",fontSize:26,color:"#C9A84C",lineHeight:1}}>{r.value}</span>
                </div>
              ));
            })()}
          </Card>
          <Card>
            <p style={{fontFamily:"var(--font-body)",fontSize:12,fontWeight:600,color:"#F2EDE6",marginBottom:16}}>Lead Sources</p>
            {filteredSources.length?(
              <div style={{display:"flex",flexDirection:"column",gap:10}}>
                {filteredSources.map(s=><BarRow key={s.source} label={s.source} value={s.count} total={srcMax}/>)}
              </div>
            ):<p style={{color:"#555",fontSize:12}}>No data</p>}
          </Card>
        </div>
      </section>
    </div>
  );
}

function CommissionsView({data}:{data:DashboardData}){
  const mobile=useMobile();
  const sh=data.sheets.connected?data.sheets:null;
  const setterTotal=sh?.setterCommPaid.reduce((s,r)=>s+r.amount,0)??0;
  const closerTotal=sh?.closerCommPaid.reduce((s,r)=>s+r.amount,0)??0;
  const cardGrid=mobile?"1fr":"repeat(auto-fit,minmax(260px,1fr))";
  return(
    <div style={{display:"flex",flexDirection:"column",gap:28}}>
      <section>
        <SectionLabel>Commissions</SectionLabel>
        {!sh?(
          <p style={{fontFamily:"var(--font-body)",fontSize:13,color:"#555"}}>Google Sheets not connected.</p>
        ):(
          <div style={{display:"grid",gridTemplateColumns:cardGrid,gap:14}}>
            <Card>
              <CommissionTable title="Setter Commissions (total owed)" rows={sh.setterCommOwed} subRows={sh.setterCommPaid}/>
              <div style={{height:1,background:"rgba(255,255,255,0.06)",margin:"16px 0"}}/>
              <CommissionTable title="Closer Commissions (total owed)" rows={sh.closerCommOwed} subRows={sh.closerCommPaid} accent="#C9A84C"/>
              <p style={{fontFamily:"var(--font-body)",fontSize:10,color:"#3A3A3A",marginTop:12}}>Right = total owed · left = paid to date</p>
            </Card>
            <RevanaPanel netEarnings={sh.totalNetEarnings} setterTotal={setterTotal} closerTotal={closerTotal}/>
          </div>
        )}
      </section>
    </div>
  );
}

function dedupeByName<T extends {name:string}>(rows:T[]):T[]{
  // Sheet appends newest at bottom — iterate in reverse so first-seen = latest
  const seen=new Set<string>();
  const out:T[]=[];
  for(let i=rows.length-1;i>=0;i--){
    const key=rows[i].name.trim().toLowerCase();
    if(!seen.has(key)){seen.add(key);out.unshift(rows[i]);}
  }
  return out;
}

function EodView({data}:{data:DashboardData}){
  const mobile=useMobile();
  const sh=data.sheets.connected?data.sheets:null;
  if(!sh) return <p style={{fontFamily:"var(--font-body)",fontSize:13,color:"#555"}}>Google Sheets not connected.</p>;

  // Deduplicate — one row per person (latest submission wins)
  const setterRows = dedupeByName(sh.setterEod.rows).map(r=>({
    name:      r.name,
    contacted: r.contacted,
    booked:    r.callsBooked,
    bookRate:  r.contacted>0?Math.round((r.callsBooked/r.contacted)*100)+"%":"—",
  }));
  const closerRows = dedupeByName(sh.closerEod.rows).map(r=>({
    name:      r.name,
    scheduled: r.callsScheduled,
    closed:    r.dealsClosed,
    closeRate: r.callsScheduled>0?Math.round((r.dealsClosed/r.callsScheduled)*100)+"%":"—",
  }));

  return(
    <div style={{display:"flex",flexDirection:"column",gap:28}}>
      <section>
        <SectionLabel>EOD Reports</SectionLabel>
        <div style={{display:"grid",gridTemplateColumns:mobile?"1fr":"repeat(auto-fit,minmax(320px,1fr))",gap:14}}>
          <EodTable title="Setter EOD" rows={setterRows as Record<string,string|number>[]} emptyMsg="No setter reports yet"
            columns={[{key:"name",label:"Setter"},{key:"contacted",label:"Contacted"},{key:"booked",label:"Calls Booked"},{key:"bookRate",label:"Book Rate"}]}/>
          <EodTable title="Closer EOD" rows={closerRows as Record<string,string|number>[]} emptyMsg="No closer reports yet"
            columns={[{key:"name",label:"Closer"},{key:"scheduled",label:"Calls Scheduled"},{key:"closed",label:"Calls Closed"},{key:"closeRate",label:"Close Rate"}]}/>
        </div>
      </section>
    </div>
  );
}

function OverheadView({data}:{data:DashboardData}){
  const sh=data.sheets.connected?data.sheets:null;
  if(!sh) return <p style={{fontFamily:"var(--font-body)",fontSize:13,color:"#555"}}>Google Sheets not connected.</p>;
  if(sh.subscriptions.length===0) return <p style={{fontFamily:"var(--font-body)",fontSize:13,color:"#555"}}>No subscription data found.</p>;
  return(
    <div style={{display:"flex",flexDirection:"column",gap:28}}>
      <section>
        <SectionLabel>Monthly Overhead</SectionLabel>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))",gap:14}}>
          <Card>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
              <p style={{fontFamily:"var(--font-body)",fontSize:12,fontWeight:600,color:"#F2EDE6",margin:0}}>Tool Subscriptions</p>
              <span style={{fontFamily:"var(--font-display)",fontSize:20,color:"#C9A84C"}}>{fmt$(sh.totalMonthlyOverhead)}<span style={{fontFamily:"var(--font-body)",fontSize:11,color:"#555"}}>/mo</span></span>
            </div>
            <div style={{border:"1px solid rgba(255,255,255,0.07)",borderRadius:8,overflow:"hidden"}}>
              {sh.subscriptions.map((s,i)=>(
                <div key={s.tool} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"9px 14px",borderBottom:i<sh.subscriptions.length-1?"1px solid rgba(255,255,255,0.05)":"none"}}>
                  <span style={{fontFamily:"var(--font-body)",fontSize:13,color:"#CCC"}}>{s.tool}</span>
                  <span style={{fontFamily:"var(--font-body)",fontSize:13,fontWeight:600,color:"#888"}}>{fmt$(s.monthlyCost)}/mo</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
}

// ── Password Gate ─────────────────────────────────────────────────────────────
const GATE_KEY = "huddyer_dash_auth";

function PasswordGate({ children }: { children: React.ReactNode }) {
  const [unlocked, setUnlocked] = useState<boolean | null>(null);
  const [value, setValue] = useState("");
  const [shake, setShake] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setUnlocked(localStorage.getItem(GATE_KEY) === "1");
  }, []);

  function attempt() {
    if (value.trim().toLowerCase() === "revana") {
      localStorage.setItem(GATE_KEY, "1");
      setUnlocked(true);
    } else {
      setShake(true);
      setValue("");
      setTimeout(() => setShake(false), 600);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }

  // SSR / hydration: render nothing until we know
  if (unlocked === null) return null;
  if (unlocked) return <>{children}</>;

  return (
    <div style={{
      position: "fixed", inset: 0, background: "#0A0A0A",
      display: "flex", alignItems: "center", justifyContent: "center",
      zIndex: 9999, padding: "24px",
    }}>
      <style>{`
        @keyframes gate-shimmer {
          0%   { background-position: 200% center; }
          100% { background-position: -200% center; }
        }
        .gate-password-label {
          font-family: var(--font-display), sans-serif;
          letter-spacing: 0.05em;
          font-size: clamp(42px, 8vw, 72px);
          line-height: 1;
          background: linear-gradient(90deg, #A07830 0%, #D4AF37 30%, #FFF3B0 50%, #D4AF37 70%, #A07830 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: gate-shimmer 4s linear infinite;
        }
        @keyframes gate-shake {
          0%,100% { transform: translateX(0); }
          20%     { transform: translateX(-8px); }
          40%     { transform: translateX(8px); }
          60%     { transform: translateX(-5px); }
          80%     { transform: translateX(5px); }
        }
        .gate-shake { animation: gate-shake 0.5s ease; }
      `}</style>

      <div style={{
        width: "100%", maxWidth: 420,
        display: "flex", flexDirection: "column", alignItems: "center", gap: 32,
      }}>
        {/* Logo mark */}
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
          <rect x="3"  y="20" width="6" height="14" rx="1.5" fill="#C9A84C"/>
          <rect x="17" y="8"  width="6" height="26" rx="1.5" fill="#C9A84C"/>
          <rect x="31" y="14" width="6" height="20" rx="1.5" fill="#C9A84C"/>
        </svg>

        {/* Label */}
        <div style={{ textAlign: "center" }}>
          <div className="gate-password-label">PASSWORD</div>
          <p style={{
            fontFamily: "var(--font-body)", fontSize: 13, color: "#555",
            marginTop: 8, letterSpacing: "0.04em", textTransform: "uppercase",
          }}>
            Internal access only
          </p>
        </div>

        {/* Input + button */}
        <div
          className={shake ? "gate-shake" : ""}
          style={{ width: "100%", display: "flex", flexDirection: "column", gap: 12 }}
        >
          <input
            ref={inputRef}
            type="password"
            value={value}
            onChange={e => setValue(e.target.value)}
            onKeyDown={e => e.key === "Enter" && attempt()}
            autoFocus
            placeholder="Enter password"
            style={{
              width: "100%", padding: "14px 18px",
              background: "rgba(255,255,255,0.04)",
              border: `1px solid ${shake ? "#E05252" : "rgba(201,168,76,0.25)"}`,
              borderRadius: 10,
              color: "#F2EDE6",
              fontFamily: "var(--font-body)", fontSize: 16,
              outline: "none",
              letterSpacing: "0.1em",
              textAlign: "center",
              transition: "border-color 0.2s",
              boxSizing: "border-box",
            }}
          />
          <button
            onClick={attempt}
            style={{
              width: "100%", padding: "14px 0",
              background: "linear-gradient(135deg, #C9A84C 0%, #D4AF37 50%, #C9A84C 100%)",
              border: "none", borderRadius: 10,
              color: "#0A0A0A",
              fontFamily: "var(--font-body)", fontSize: 14, fontWeight: 700,
              letterSpacing: "0.08em", textTransform: "uppercase",
              cursor: "pointer",
            }}
          >
            Unlock
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
const PAGE_TITLES:Record<PageKey,string>={dashboard:"Dashboard",revenue:"Revenue",funnel:"Funnel",commissions:"Commissions",eod:"EOD Reports",overhead:"Overhead"};

function DashboardPage(){
  const [data,       setData]       = useState<DashboardData|null>(null);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [page,       setPage]       = useState<PageKey>("dashboard");
  const [mobile,     setMobile]     = useState(false);
  const timerRef=useRef<ReturnType<typeof setInterval>|null>(null);

  // Detect mobile
  useEffect(()=>{
    const check=()=>setMobile(window.innerWidth<768);
    check();
    window.addEventListener("resize",check);
    return()=>window.removeEventListener("resize",check);
  },[]);

  const load=useCallback(async(silent=false)=>{
    if(!silent)setLoading(true);else setRefreshing(true);
    setError(false);
    try{
      const res=await fetch("/api/dashboard",{cache:"no-store"});
      if(!res.ok) throw new Error();
      setData(await res.json());
    }catch{setError(true);}
    finally{setLoading(false);setRefreshing(false);}
  },[]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(()=>{load();},[]);
  useEffect(()=>{
    if(timerRef.current) clearInterval(timerRef.current);
    timerRef.current=setInterval(()=>load(true),120_000);
    return()=>{if(timerRef.current) clearInterval(timerRef.current);};
  },[load]);

  const updated=data?.lastUpdated?new Date(data.lastUpdated).toLocaleTimeString():"—";

  return(
    <MobileCtx.Provider value={mobile}>
      <div style={{display:"flex",height:"100vh",overflow:"hidden",backgroundColor:"#0A0A0A"}}>
        <style>{`
          @keyframes pulse{0%,100%{opacity:.4}50%{opacity:.75}}
          @keyframes spin{to{transform:rotate(360deg)}}
          input[type=number]::-webkit-inner-spin-button,
          input[type=number]::-webkit-outer-spin-button{-webkit-appearance:none}
          input[type=number]{-moz-appearance:textfield}
          *{box-sizing:border-box}
        `}</style>

        {/* Sidebar — desktop only */}
        {!mobile&&(
          <Sidebar current={page} onChange={setPage} refreshing={refreshing} onRefresh={()=>load(true)} updated={updated}/>
        )}

        {/* Main */}
        <div style={{flex:1,overflowY:"auto",display:"flex",flexDirection:"column",minWidth:0}}>

          {/* Top bar */}
          <div style={{position:"sticky",top:0,zIndex:100,background:"rgba(10,10,10,0.95)",backdropFilter:"blur(12px)",borderBottom:"1px solid rgba(255,255,255,0.06)",padding:mobile?"10px 14px":"14px 28px",display:"flex",justifyContent:"space-between",alignItems:"center",gap:10}}>
            <h2 style={{fontFamily:"var(--font-display)",fontSize:mobile?16:22,color:"#F2EDE6",margin:0,lineHeight:1}}>{PAGE_TITLES[page]}</h2>
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              {refreshing&&<Spinner/>}
              <button onClick={()=>load(true)} disabled={refreshing} style={{padding:"6px 10px",borderRadius:6,background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",color:"#555",fontSize:16,cursor:"pointer",lineHeight:1}}>↻</button>
            </div>
          </div>

          {/* Error pills — broken sources only */}
          {data&&(()=>{
            const errors:string[]=[];
            if(!data.sheets.connected) errors.push(`Sheets: ${(data.sheets as {error:string}).error}`);
            if(!data.calendly) errors.push("Calendly disconnected");
            if(!data.typeform) errors.push("Typeform disconnected");
            if(!data.whop)     errors.push("Whop disconnected");
            if(!errors.length) return null;
            return(
              <div style={{padding:`8px ${mobile?"14px":"28px"} 0`,display:"flex",gap:6,flexWrap:"wrap"}}>
                {errors.map(e=><Pill key={e} ok={false} label={e}/>)}
              </div>
            );
          })()}

          {/* Content */}
          <div style={{flex:1,padding:mobile?"16px 14px 90px":"24px 28px 60px"}}>
            {loading&&<div style={{display:"grid",gridTemplateColumns:mobile?"repeat(2,1fr)":"repeat(auto-fill,minmax(160px,1fr))",gap:10}}>{[...Array(8)].map((_,i)=><Skeleton key={i}/>)}</div>}
            {error&&!loading&&(
              <div style={{textAlign:"center",padding:"60px 0"}}>
                <p style={{color:"#E05252",fontFamily:"var(--font-body)",fontSize:14}}>Failed to load. <button onClick={()=>load()} style={{color:"#C9A84C",textDecoration:"underline",background:"none",border:"none",cursor:"pointer"}}>Retry</button></p>
              </div>
            )}
            {data&&!loading&&(
              <>
                {page==="dashboard"   &&<DashboardView   data={data}/>}
                {page==="revenue"     &&<RevenueView     data={data}/>}
                {page==="funnel"      &&<FunnelView      data={data}/>}
                {page==="commissions" &&<CommissionsView data={data}/>}
                {page==="eod"         &&<EodView         data={data}/>}
                {page==="overhead"    &&<OverheadView    data={data}/>}
              </>
            )}
          </div>
        </div>

        {/* Bottom nav — mobile only */}
        {mobile&&<BottomNav current={page} onChange={setPage}/>}
      </div>
    </MobileCtx.Provider>
  );
}

// Re-export wrapped in password gate
const _DashboardPage = DashboardPage;
export default function Page() {
  return (
    <PasswordGate>
      <_DashboardPage />
    </PasswordGate>
  );
}
