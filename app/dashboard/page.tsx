"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import type { DashboardData, CommissionLine } from "@/lib/fetchDashboard";

// ── Format helpers ─────────────────────────────────────────────────────────────
const fmt$ = (n: number) =>
  "$" + n.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
const fmtPct = (n: number) => n + "%";

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

// ── Date range picker ─────────────────────────────────────────────────────────

const SHORT_MONTHS = ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];
const DOW_LABELS   = ["S","M","T","W","T","F","S"];

const RANGE_PRESETS = [
  { label: "Today",             fn: (): {start:Date;end:Date} => { const d=new Date(); d.setHours(0,0,0,0); const e=new Date(); e.setHours(23,59,59,999); return {start:d,end:e}; } },
  { label: "This week",         fn: (): {start:Date;end:Date} => { const n=new Date(); const d=new Date(n); d.setDate(n.getDate()-n.getDay()); d.setHours(0,0,0,0); const e=new Date(); e.setHours(23,59,59,999); return {start:d,end:e}; } },
  { label: "This month",        fn: (): {start:Date;end:Date} => { const n=new Date(); const e=new Date(); e.setHours(23,59,59,999); return {start:new Date(n.getFullYear(),n.getMonth(),1),end:e}; } },
  { label: "Last month",        fn: (): {start:Date;end:Date} => { const n=new Date(); const m=n.getMonth()-1<0?11:n.getMonth()-1; const y=n.getMonth()-1<0?n.getFullYear()-1:n.getFullYear(); return {start:new Date(y,m,1),end:new Date(y,m+1,0,23,59,59)}; } },
  { label: "This quarter",      fn: (): {start:Date;end:Date} => { const n=new Date(); const q=Math.floor(n.getMonth()/3); const e=new Date(); e.setHours(23,59,59,999); return {start:new Date(n.getFullYear(),q*3,1),end:e}; } },
  { label: "This year to date", fn: (): {start:Date;end:Date} => { const n=new Date(); const e=new Date(); e.setHours(23,59,59,999); return {start:new Date(n.getFullYear(),0,1),end:e}; } },
  { label: "Last year",         fn: (): {start:Date;end:Date} => { const y=new Date().getFullYear()-1; return {start:new Date(y,0,1),end:new Date(y,11,31,23,59,59)}; } },
  { label: "All time",          fn: (): {start:Date;end:Date} => { const e=new Date(); e.setHours(23,59,59,999); return {start:new Date("2020-01-01"),end:e}; } },
];

function sameDay(a: Date, b: Date) {
  return a.getFullYear()===b.getFullYear() && a.getMonth()===b.getMonth() && a.getDate()===b.getDate();
}
function fmtRangeLabel(start: Date, end: Date) {
  const o: Intl.DateTimeFormatOptions = { month:"short", day:"numeric", year:"numeric" };
  return `${start.toLocaleDateString("en-US",o)} - ${end.toLocaleDateString("en-US",o)}`;
}

function CalGrid({
  year, month, label, rStart, rEnd, hover,
  onClick, onHover, onPrev, onNext,
}: {
  year:number; month:number; label:string;
  rStart:Date|null; rEnd:Date|null; hover:Date|null;
  onClick:(d:Date)=>void; onHover:(d:Date|null)=>void;
  onPrev:()=>void; onNext:()=>void;
}) {
  const today = new Date();
  const daysInMonth = new Date(year,month+1,0).getDate();
  const firstDow    = new Date(year,month,1).getDay();
  const cells: (Date|null)[] = Array(firstDow).fill(null);
  for (let d=1; d<=daysInMonth; d++) cells.push(new Date(year,month,d));

  const effEnd = rStart && !rEnd && hover ? hover : rEnd;

  return (
    <div style={{minWidth:204}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8}}>
        <button onClick={onPrev} style={{background:"none",border:"none",color:"#666",cursor:"pointer",fontSize:18,lineHeight:1,padding:"0 6px"}}>‹</button>
        <span style={{fontFamily:"var(--font-body)",fontSize:13,fontWeight:600,color:"#F2EDE6"}}>{SHORT_MONTHS[month]} {year}</span>
        <button onClick={onNext} style={{background:"none",border:"none",color:"#666",cursor:"pointer",fontSize:18,lineHeight:1,padding:"0 6px"}}>›</button>
      </div>
      <p style={{fontFamily:"var(--font-body)",fontSize:9,letterSpacing:"0.12em",textTransform:"uppercase",color:"#444",textAlign:"center",marginBottom:6}}>{label}</p>
      <div style={{display:"grid",gridTemplateColumns:"repeat(7,28px)",gap:1,marginBottom:3}}>
        {DOW_LABELS.map((d,i)=><span key={i} style={{fontFamily:"var(--font-body)",fontSize:10,color:"#444",textAlign:"center",display:"block",height:20,lineHeight:"20px"}}>{d}</span>)}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(7,28px)",gap:1}}>
        {cells.map((d,i)=>{
          if(!d) return <div key={i} style={{width:28,height:28}}/>;
          const isToday = sameDay(d,today);
          const isSt = rStart && sameDay(d,rStart);
          const isEn = effEnd && sameDay(d,effEnd);
          const inR  = rStart && effEnd && d>rStart && d<effEnd;
          const sel  = isSt||isEn;
          return (
            <button key={i} onClick={()=>onClick(d)} onMouseEnter={()=>onHover(d)} onMouseLeave={()=>onHover(null)}
              style={{
                width:28,height:28,
                borderRadius: sel?"50%":inR?"0":"50%",
                background: sel?"#1976D2":inR?"rgba(25,118,210,0.18)":"transparent",
                color: sel?"white":isToday?"#1976D2":"#CCC",
                fontWeight: isToday?700:400,
                border:"none",cursor:"pointer",
                fontFamily:"var(--font-body)",fontSize:12,
                outline:"none",
              }}
            >{d.getDate()}</button>
          );
        })}
      </div>
    </div>
  );
}

function DateRangePicker({ value, onChange }: {
  value: {start:Date;end:Date};
  onChange: (r:{start:Date;end:Date})=>void;
}) {
  const [open, setOpen]           = useState(false);
  const [tStart,  setTStart]      = useState<Date|null>(value.start);
  const [tEnd,    setTEnd]        = useState<Date|null>(value.end);
  const [hover,   setHover]       = useState<Date|null>(null);
  const [preset,  setPreset]      = useState("All time");
  const [lYear,   setLYear]       = useState(value.start.getFullYear());
  const [lMonth,  setLMonth]      = useState(value.start.getMonth());
  const wrapRef = useRef<HTMLDivElement>(null);

  const rYear  = lMonth===11 ? lYear+1  : lYear;
  const rMonth = lMonth===11 ? 0        : lMonth+1;

  useEffect(()=>{
    const h=(e:MouseEvent)=>{if(wrapRef.current&&!wrapRef.current.contains(e.target as Node))setOpen(false);};
    if(open) document.addEventListener("mousedown",h);
    return ()=>document.removeEventListener("mousedown",h);
  },[open]);

  const handleClick=(d:Date)=>{
    if(!tStart||(tStart&&tEnd)){setTStart(d);setTEnd(null);}
    else{
      if(d<tStart){setTStart(d);setTEnd(tStart);}
      else{setTEnd(d);}
    }
    setPreset("Custom");
  };

  const handlePreset=(p:typeof RANGE_PRESETS[0])=>{
    const {start,end}=p.fn();
    setTStart(start);setTEnd(end);setPreset(p.label);
    setLYear(start.getFullYear());setLMonth(start.getMonth());
  };

  const prevM=()=>{ if(lMonth===0){setLYear(y=>y-1);setLMonth(11);}else setLMonth(m=>m-1); };
  const nextM=()=>{ if(lMonth===11){setLYear(y=>y+1);setLMonth(0);}else setLMonth(m=>m+1); };

  const handleApply=()=>{
    if(tStart&&tEnd){
      const s=new Date(tStart);s.setHours(0,0,0,0);
      const e=new Date(tEnd);  e.setHours(23,59,59,999);
      onChange({start:s,end:e});
    }
    setOpen(false);
  };

  return (
    <div ref={wrapRef} style={{position:"relative",display:"inline-block"}}>
      <button
        onClick={()=>{setOpen(o=>!o);setTStart(value.start);setTEnd(value.end);}}
        style={{
          display:"inline-flex",alignItems:"center",gap:8,padding:"8px 14px",
          background:"#161616",border:"1px solid rgba(255,255,255,0.1)",borderRadius:8,
          color:"#F2EDE6",fontFamily:"var(--font-body)",fontSize:13,cursor:"pointer",
          outline:"none",whiteSpace:"nowrap",
        }}
      >
        {fmtRangeLabel(value.start,value.end)}
        <span style={{color:"#555",fontSize:9,marginLeft:2}}>▼</span>
      </button>

      {open&&(
        <div style={{
          position:"absolute",top:"calc(100% + 6px)",right:0,zIndex:1000,
          background:"#161616",border:"1px solid rgba(255,255,255,0.1)",borderRadius:12,
          padding:"16px 18px",boxShadow:"0 12px 40px rgba(0,0,0,0.7)",minWidth:500,
        }}>
          {/* Preset chips */}
          <div style={{display:"flex",gap:5,flexWrap:"wrap",marginBottom:14}}>
            {RANGE_PRESETS.map(p=>(
              <button key={p.label} onClick={()=>handlePreset(p)} style={{
                fontFamily:"var(--font-body)",fontSize:11,padding:"3px 10px",borderRadius:6,
                background:preset===p.label?"rgba(201,168,76,0.15)":"rgba(255,255,255,0.04)",
                border:`1px solid ${preset===p.label?"rgba(201,168,76,0.4)":"rgba(255,255,255,0.07)"}`,
                color:preset===p.label?"#C9A84C":"#555",cursor:"pointer",whiteSpace:"nowrap",
              }}>{p.label}</button>
            ))}
          </div>

          {/* Two calendars */}
          <div style={{display:"flex",gap:20,marginBottom:14,alignItems:"flex-start"}}>
            <CalGrid year={lYear} month={lMonth} label="Start Date"
              rStart={tStart} rEnd={tEnd} hover={hover}
              onClick={handleClick} onHover={setHover}
              onPrev={prevM} onNext={nextM} />
            <div style={{width:1,background:"rgba(255,255,255,0.07)",alignSelf:"stretch"}}/>
            <CalGrid year={rYear} month={rMonth} label="End Date"
              rStart={tStart} rEnd={tEnd} hover={hover}
              onClick={handleClick} onHover={setHover}
              onPrev={prevM} onNext={nextM} />
          </div>

          {/* Footer */}
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",borderTop:"1px solid rgba(255,255,255,0.07)",paddingTop:12}}>
            <span style={{fontFamily:"var(--font-body)",fontSize:12,color:"#555"}}>
              {tStart&&tEnd ? fmtRangeLabel(tStart,tEnd) : tStart ? `${tStart.toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"})} → select end` : "Select start date"}
            </span>
            <button onClick={handleApply} disabled={!tStart||!tEnd} style={{
              fontFamily:"var(--font-body)",fontSize:13,fontWeight:600,padding:"6px 18px",borderRadius:7,
              background:tStart&&tEnd?"#161616":"rgba(255,255,255,0.04)",
              border:`1px solid ${tStart&&tEnd?"#C9A84C":"rgba(255,255,255,0.08)"}`,
              color:tStart&&tEnd?"#C9A84C":"#555",cursor:tStart&&tEnd?"pointer":"not-allowed",
            }}>Apply</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Atom components ──────────────────────────────────────────────────────────

function GoldDivider() {
  return <div style={{height:1,background:"linear-gradient(90deg,rgba(201,168,76,0.3),transparent)",margin:"0 0 28px"}}/>;
}

function SectionLabel({children}:{children:React.ReactNode}) {
  return <p style={{fontFamily:"var(--font-body)",fontSize:10,letterSpacing:"0.14em",textTransform:"uppercase",color:"#444",marginBottom:14}}>{children}</p>;
}

function Card({children,style}:{children:React.ReactNode;style?:React.CSSProperties}) {
  return <div style={{background:"rgba(255,255,255,0.025)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:10,padding:"18px 20px",...style}}>{children}</div>;
}

function KpiCard({label,value,sub,accent,warn,green}:{
  label:string;value:string|number;sub?:string;accent?:boolean;warn?:boolean;green?:boolean;
}) {
  const col=warn?"#E05252":green?"#4CAF6E":accent?"#C9A84C":"#F2EDE6";
  return (
    <Card>
      <p style={{fontFamily:"var(--font-body)",fontSize:10,letterSpacing:"0.13em",textTransform:"uppercase",color:"#555",marginBottom:8}}>{label}</p>
      <p style={{fontFamily:"var(--font-display)",fontSize:"clamp(22px,3vw,32px)",color:col,lineHeight:1}}>{value}</p>
      {sub&&<p style={{fontFamily:"var(--font-body)",fontSize:11,color:"#555",marginTop:6}}>{sub}</p>}
    </Card>
  );
}

function Pill({ok,label}:{ok:boolean;label:string}) {
  return (
    <span style={{
      display:"inline-flex",alignItems:"center",gap:6,padding:"3px 9px",borderRadius:999,
      fontSize:11,fontWeight:600,fontFamily:"var(--font-body)",
      background:ok?"rgba(76,175,110,0.12)":"rgba(224,82,82,0.12)",
      color:ok?"#4CAF6E":"#E05252",
      border:`1px solid ${ok?"rgba(76,175,110,0.25)":"rgba(224,82,82,0.25)"}`,
    }}>
      <span style={{width:6,height:6,borderRadius:"50%",background:ok?"#4CAF6E":"#E05252",display:"inline-block"}}/>
      {label}
    </span>
  );
}

function BarRow({label,value,total,color="#C9A84C",sub}:{label:string;value:number;total:number;color?:string;sub?:string;}) {
  const pct=total>0?Math.min(Math.round((value/total)*100),100):0;
  return (
    <div style={{display:"flex",alignItems:"center",gap:10}}>
      <p style={{fontFamily:"var(--font-body)",fontSize:12,color:"#888",minWidth:90,flexShrink:0}}>{label}</p>
      <div style={{flex:1,height:5,borderRadius:3,background:"rgba(255,255,255,0.06)",overflow:"hidden"}}>
        <div style={{width:`${pct}%`,height:"100%",background:color,borderRadius:3,transition:"width 0.5s ease"}}/>
      </div>
      <span style={{fontFamily:"var(--font-body)",fontSize:12,fontWeight:600,color:"#F2EDE6",minWidth:30,textAlign:"right"}}>{sub??value}</span>
    </div>
  );
}

function Skeleton({h=110}:{h?:number}) {
  return <div style={{height:h,borderRadius:10,background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.05)",animation:"pulse 2s ease-in-out infinite"}}/>;
}

function Spinner() {
  return <div style={{width:14,height:14,border:"2px solid rgba(201,168,76,0.2)",borderTopColor:"#C9A84C",borderRadius:"50%",animation:"spin 0.7s linear infinite"}}/>;
}

// ── Donut Chart ───────────────────────────────────────────────────────────────
function DonutChart({segments,size=130}:{segments:{label:string;value:number;color:string}[];size?:number;}) {
  const total=segments.reduce((s,seg)=>s+seg.value,0);
  if(total===0) return <p style={{color:"#555",fontSize:12}}>No data</p>;
  const cx=size/2,cy=size/2,r=size*0.38,inner=size*0.22;
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
  return (
    <div style={{display:"flex",alignItems:"center",gap:20,flexWrap:"wrap"}}>
      <svg width={size} height={size} style={{flexShrink:0}}>
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

// ── Funnel Viz ────────────────────────────────────────────────────────────────
function FunnelViz({steps}:{steps:{label:string;value:number;pct?:number}[]}) {
  const max=Math.max(...steps.map(s=>s.value),1);
  return (
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
            <div style={{
              width:`${Math.max((step.value/max)*100,step.value>0?4:0)}%`,
              height:"100%",borderRadius:4,
              background:i===0?"#555":i===1?"#C9A84C":"#4CAF6E",
              transition:"width 0.6s ease",
            }}/>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Commission Table ──────────────────────────────────────────────────────────
function CommissionTable({title,rows,subRows,accent}:{
  title:string;rows:CommissionLine[];subRows?:CommissionLine[];accent?:string;
}) {
  if(!rows.length) return null;
  const paidMap=new Map((subRows??[]).map(r=>[r.name,r.amount]));
  return (
    <div>
      <p style={{fontFamily:"var(--font-body)",fontSize:10,letterSpacing:"0.12em",textTransform:"uppercase",color:"#555",marginBottom:10}}>{title}</p>
      <div style={{border:"1px solid rgba(255,255,255,0.07)",borderRadius:8,overflow:"hidden"}}>
        {rows.map((r,i)=>(
          <div key={r.name} style={{
            display:"grid",gridTemplateColumns:"1fr auto auto",
            gap:10,padding:"9px 14px",alignItems:"center",
            borderBottom:i<rows.length-1?"1px solid rgba(255,255,255,0.05)":"none",
          }}>
            <span style={{fontFamily:"var(--font-body)",fontSize:13,color:"#CCC"}}>{r.name}</span>
            <span style={{fontFamily:"var(--font-body)",fontSize:11,color:"#555"}}>
              {paidMap.has(r.name)?`${fmt$(paidMap.get(r.name)!)} paid`:""}
            </span>
            <span style={{fontFamily:"var(--font-body)",fontSize:13,fontWeight:700,color:accent??"#C9A84C",minWidth:72,textAlign:"right"}}>{fmt$(r.amount)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Revana Panel ──────────────────────────────────────────────────────────────
function RevanaPanel({netEarnings,setterTotal,closerTotal}:{netEarnings:number;setterTotal:number;closerTotal:number;}) {
  const [rate,setRate]=useState(10);
  const remaining=Math.max(netEarnings-setterTotal-closerTotal,0);
  const revana   =Math.round(remaining*(rate/100)*100)/100;
  const hudson   =Math.round(Math.max(remaining-revana,0)*100)/100;
  return (
    <Card>
      <p style={{fontFamily:"var(--font-body)",fontSize:10,letterSpacing:"0.13em",textTransform:"uppercase",color:"#555",marginBottom:14}}>Revana Commission</p>
      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:16}}>
        <span style={{fontFamily:"var(--font-body)",fontSize:12,color:"#777"}}>Agency rate:</span>
        <input type="number" min={0} max={100} value={rate}
          onChange={e=>setRate(Math.max(0,Math.min(100,Number(e.target.value))))}
          style={{width:52,padding:"3px 8px",borderRadius:6,border:"1px solid rgba(201,168,76,0.3)",background:"rgba(201,168,76,0.07)",color:"#F2EDE6",fontFamily:"var(--font-body)",fontSize:13,outline:"none"}}
        />
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
        <span style={{fontFamily:"var(--font-display)",fontSize:22,color:"#4CAF6E",lineHeight:1}}>{fmt$(hudson)}</span>
      </div>
    </Card>
  );
}

// ── EOD Table ─────────────────────────────────────────────────────────────────
function EodTable({title,rows,columns,emptyMsg}:{
  title:string;
  rows:Record<string,string|number>[];
  columns:{key:string;label:string}[];
  emptyMsg?:string;
}) {
  return (
    <Card>
      <p style={{fontFamily:"var(--font-body)",fontSize:12,fontWeight:600,color:"#F2EDE6",marginBottom:14}}>{title}</p>
      {rows.length===0 ? (
        <p style={{fontFamily:"var(--font-body)",fontSize:12,color:"#444",fontStyle:"italic"}}>{emptyMsg??"No reports yet"}</p>
      ) : (
        <div style={{overflowX:"auto"}}>
          <table style={{width:"100%",borderCollapse:"collapse",fontFamily:"var(--font-body)",fontSize:12}}>
            <thead>
              <tr>
                {columns.map(col=>(
                  <th key={col.key} style={{textAlign:"left",color:"#555",fontWeight:600,letterSpacing:"0.1em",textTransform:"uppercase",fontSize:10,padding:"0 10px 8px 0",borderBottom:"1px solid rgba(255,255,255,0.06)"}}>
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row,i)=>(
                <tr key={i}>
                  {columns.map(col=>(
                    <td key={col.key} style={{padding:"7px 10px 7px 0",color:"#AAA",borderBottom:"1px solid rgba(255,255,255,0.04)",whiteSpace:"nowrap"}}>
                      {String(row[col.key]??"")}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
}

// ── Nav icons ─────────────────────────────────────────────────────────────────
function NavIcon({k}:{k:PageKey}) {
  const s:React.CSSProperties={width:15,height:15};
  if(k==="dashboard") return <svg style={s} viewBox="0 0 15 15" fill="currentColor"><rect x="1" y="1" width="5" height="5" rx="1"/><rect x="9" y="1" width="5" height="5" rx="1" opacity=".6"/><rect x="1" y="9" width="5" height="5" rx="1" opacity=".6"/><rect x="9" y="9" width="5" height="5" rx="1"/></svg>;
  if(k==="revenue")   return <svg style={s} viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="7.5" cy="7.5" r="6"/><path d="M7.5 4v7M5.5 6c0-1.1.9-2 2-2s2 .9 2 2-1.7 1.5-2 1.5m0 0c-.6.1-2 .7-2 2s.9 2 2 2 2-.9 2-2" strokeLinecap="round"/></svg>;
  if(k==="funnel")    return <svg style={s} viewBox="0 0 15 15" fill="currentColor"><path d="M1 2h13L9.5 7.5V13l-4-2V7.5L1 2z" opacity=".8"/></svg>;
  if(k==="commissions") return <svg style={s} viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="4.5" cy="4.5" r="2"/><circle cx="10.5" cy="10.5" r="2"/><line x1="13" y1="2" x2="2" y2="13"/></svg>;
  if(k==="eod")       return <svg style={s} viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.3"><rect x="3" y="1" width="9" height="13" rx="1"/><line x1="5" y1="5" x2="10" y2="5"/><line x1="5" y1="8" x2="10" y2="8"/><line x1="5" y1="11" x2="8" y2="11"/></svg>;
  return <svg style={s} viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.3"><rect x="1" y="4" width="13" height="9" rx="1"/><path d="M5 4V3a2 2 0 014 0v1"/><line x1="7.5" y1="7" x2="7.5" y2="10"/><line x1="6" y1="8.5" x2="9" y2="8.5"/></svg>;
}

// ── Logo ──────────────────────────────────────────────────────────────────────
function Logo() {
  return (
    <svg width="18" height="18" viewBox="0 0 40 40" fill="none">
      <rect x="2"  y="22" width="6" height="14" rx="1.5" fill="#C9A84C"/>
      <rect x="12" y="14" width="6" height="22" rx="1.5" fill="#D4AF37"/>
      <rect x="22" y="8"  width="6" height="28" rx="1.5" fill="#C9A84C"/>
      <rect x="32" y="2"  width="6" height="34" rx="1.5" fill="#D4AF37"/>
    </svg>
  );
}

// ── Sidebar ───────────────────────────────────────────────────────────────────
function Sidebar({current,onChange,refreshing,onRefresh,updated}:{
  current:PageKey;onChange:(k:PageKey)=>void;
  refreshing:boolean;onRefresh:()=>void;updated:string;
}) {
  return (
    <aside style={{
      width:210,minHeight:"100vh",background:"#0D0D0D",
      borderRight:"1px solid rgba(255,255,255,0.06)",
      display:"flex",flexDirection:"column",
      position:"sticky",top:0,height:"100vh",flexShrink:0,
    }}>
      {/* Brand */}
      <div style={{padding:"22px 18px 18px",borderBottom:"1px solid rgba(255,255,255,0.06)"}}>
        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}>
          <Logo/>
          <span style={{fontFamily:"var(--font-display)",fontSize:9,color:"#F2EDE6",letterSpacing:"0.16em"}}>HUDDYERTRADES</span>
        </div>
        <p style={{fontFamily:"var(--font-display)",fontSize:11,color:"#C9A84C",letterSpacing:"0.12em",margin:0}}>OPS DASHBOARD</p>
      </div>

      {/* Nav */}
      <nav style={{padding:"12px 10px",flex:1}}>
        {NAV.map(item=>(
          <button key={item.key} onClick={()=>onChange(item.key)} style={{
            display:"flex",alignItems:"center",gap:10,width:"100%",
            padding:"9px 12px",borderRadius:8,marginBottom:2,
            background:current===item.key?"rgba(201,168,76,0.1)":"transparent",
            border:`1px solid ${current===item.key?"rgba(201,168,76,0.2)":"transparent"}`,
            color:current===item.key?"#C9A84C":"#555",
            fontFamily:"var(--font-body)",fontSize:13,cursor:"pointer",
            textAlign:"left",transition:"all 0.15s",
          }}>
            <NavIcon k={item.key}/>
            {item.label}
          </button>
        ))}
      </nav>

      {/* Footer */}
      <div style={{padding:"14px 16px",borderTop:"1px solid rgba(255,255,255,0.06)"}}>
        <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:8}}>
          {refreshing&&<div style={{width:10,height:10,border:"1.5px solid rgba(201,168,76,0.2)",borderTopColor:"#C9A84C",borderRadius:"50%",animation:"spin 0.7s linear infinite"}}/>}
          <span style={{fontFamily:"var(--font-body)",fontSize:10,color:"#333"}}>Updated {updated}</span>
        </div>
        <button onClick={onRefresh} disabled={refreshing} style={{
          fontFamily:"var(--font-body)",fontSize:11,padding:"5px 0",width:"100%",borderRadius:6,
          background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.07)",
          color:"#555",cursor:"pointer",opacity:refreshing?0.4:1,
        }}>↻ Refresh</button>
      </div>
    </aside>
  );
}

// ── Page views ────────────────────────────────────────────────────────────────

function DashboardView({data}:{data:DashboardData}) {
  const at   = data.airtable.connected  ? data.airtable  : null;
  const sh   = data.sheets.connected    ? data.sheets    : null;
  const whop = data.whop;
  const cal  = data.calendly;
  const tf   = data.typeform;

  return (
    <div style={{display:"flex",flexDirection:"column",gap:32}}>
      <section>
        <SectionLabel>Revenue Overview</SectionLabel>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(155px,1fr))",gap:10}}>
          <KpiCard label="Total Contracted"   value={sh  ?fmt$(sh.totalContracted)        :"—"} accent sub="All planned payments"/>
          <KpiCard label="Cash Collected"     value={sh  ?fmt$(sh.cashCollected)           :"—"} green sub="Received up to today"/>
          <KpiCard label="Uncollected Rev"    value={sh  ?fmt$(sh.uncollectedRevenue)      :"—"} sub="Future scheduled payments"/>
          <KpiCard label="This Month"         value={sh  ?fmt$(sh.revenueThisMonth)        :"—"} sub="Due in current month"/>
          <KpiCard label="High Ticket Rev"    value={sh  ?fmt$(sh.totalContracted)         :"—"} accent sub="Deals sheet (all contracts)"/>
          <KpiCard label="Low Ticket / MRR"   value={whop?fmt$(whop.mrr)                  :"—"} sub={whop?`${whop.activeMemberCount} active members`:undefined}/>
          <KpiCard label="Churned Revenue"    value={sh  ?fmt$(sh.churnedRevenue)          :"—"}
            warn={!!sh&&sh.churnedRevenue>0}
            sub={sh&&sh.voidedLeads.length>0?`${sh.voidedLeads.length} voided deal${sh.voidedLeads.length>1?"s":""}`:undefined}/>
          <KpiCard label="Net Collected"      value={sh  ?fmt$(sh.netCashCollected)        :"—"} green sub="Cash collected − churned"/>
        </div>
      </section>

      <GoldDivider/>

      <section>
        <SectionLabel>Sales Performance</SectionLabel>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(155px,1fr))",gap:10}}>
          <KpiCard label="Deals Closed"    value={sh?.dealsClosed   ??"—"} accent sub="Distinct leads (Sheets)"/>
          <KpiCard label="Avg Deal Value"  value={sh  ?fmt$(sh.avgDealValue):"—"}/>
          <KpiCard label="Applications"    value={tf?.totalInRange  ??"—"} sub="Typeform submissions"/>
          <KpiCard label="Calls Booked"    value={cal?.bookedInRange??"—"} sub="Active Calendly calls"/>
          <KpiCard label="Conversion Rate" value={data.conversionRate!==null?fmtPct(data.conversionRate):"—"}
            sub="Applications → Calls"
            accent={!!data.conversionRate&&data.conversionRate>=15}
            warn={data.conversionRate!==null&&data.conversionRate<8}/>
          <KpiCard label="Close Rate"      value={data.closeRate!==null?fmtPct(data.closeRate):"—"}
            sub="Calls → Deals"
            accent={!!data.closeRate&&data.closeRate>=30}
            warn={data.closeRate!==null&&data.closeRate<15}/>
          <KpiCard label="Show Rate"       value={cal?fmtPct(cal.showRate):"—"}
            sub={cal?`${cal.cancelledInRange} cancelled`:undefined}
            accent={!!cal&&cal.showRate>=70}
            warn={!!cal&&cal.showRate<50}/>
          <KpiCard label="Whop Today"      value={whop?fmt$(whop.revenueToday):"—"}
            warn={!!whop?.failedPayments}
            sub={whop?.failedPayments?`${whop.failedPayments} failed payments`:undefined}/>
        </div>
      </section>

      {at&&(
        <>
          <GoldDivider/>
          <section>
            <SectionLabel>Connection Status</SectionLabel>
            <div style={{display:"flex",gap:7,flexWrap:"wrap"}}>
              <Pill ok={data.airtable.connected}  label={data.airtable.connected  ?"Airtable ✓"    :`Airtable: ${(data.airtable as {error:string}).error}`}/>
              <Pill ok={data.sheets.connected}    label={data.sheets.connected    ?"Google Sheets ✓":`Sheets: ${(data.sheets as {error:string}).error}`}/>
              <Pill ok={!!cal}                    label={cal?"Calendly ✓":"Calendly —"}/>
              <Pill ok={!!tf}                     label={tf?"Typeform ✓":"Typeform —"}/>
              <Pill ok={!!whop}                   label={whop?"Whop ✓":"Whop —"}/>
            </div>
          </section>
        </>
      )}
    </div>
  );
}

function RevenueView({data}:{data:DashboardData}) {
  const at  = data.airtable.connected ? data.airtable : null;
  const sh  = data.sheets.connected   ? data.sheets   : null;
  const tf  = data.typeform;
  const progMax = Math.max(...(at?.revenueByProgram.map(p=>p.contracted)??[1]));
  const srcMax  = Math.max(...(tf?.trafficSources.map(s=>s.count)??[1]));

  return (
    <div style={{display:"flex",flexDirection:"column",gap:32}}>
      <section>
        <SectionLabel>Revenue Breakdown</SectionLabel>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))",gap:14}}>

          <Card>
            <p style={{fontFamily:"var(--font-body)",fontSize:12,fontWeight:600,color:"#F2EDE6",marginBottom:16}}>PIF vs Financed</p>
            {at?<DonutChart segments={[
              {label:"PIF",value:at.pifContracted,color:"#C9A84C"},
              {label:"Financed",value:at.financedContracted,color:"rgba(201,168,76,0.22)"},
            ]}/>:<p style={{color:"#555",fontSize:12}}>No data</p>}
          </Card>

          <Card>
            <p style={{fontFamily:"var(--font-body)",fontSize:12,fontWeight:600,color:"#F2EDE6",marginBottom:16}}>Revenue by Program</p>
            {at?.revenueByProgram.length?(
              <div style={{display:"flex",flexDirection:"column",gap:14}}>
                {at.revenueByProgram.map(p=>(
                  <div key={p.program}>
                    <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
                      <span style={{fontFamily:"var(--font-body)",fontSize:12,color:"#888"}}>{p.program}</span>
                      <span style={{fontFamily:"var(--font-body)",fontSize:12,fontWeight:700,color:"#F2EDE6"}}>{fmt$(p.contracted)}</span>
                    </div>
                    <div style={{height:6,borderRadius:3,background:"rgba(255,255,255,0.06)",overflow:"hidden"}}>
                      <div style={{width:`${Math.round((p.contracted/progMax)*100)}%`,height:"100%",background:"#C9A84C",borderRadius:3,transition:"width 0.5s"}}/>
                    </div>
                  </div>
                ))}
              </div>
            ):<p style={{color:"#555",fontSize:12}}>No data</p>}
          </Card>

          <Card>
            <p style={{fontFamily:"var(--font-body)",fontSize:12,fontWeight:600,color:"#F2EDE6",marginBottom:16}}>Lead Sources (UTM)</p>
            {tf?.trafficSources.length?(
              <div style={{display:"flex",flexDirection:"column",gap:10}}>
                {tf.trafficSources.slice(0,8).map(s=>(
                  <BarRow key={s.source} label={s.source} value={s.count} total={srcMax}/>
                ))}
              </div>
            ):<p style={{color:"#555",fontSize:12}}>No data</p>}
          </Card>

        </div>
      </section>

      {sh&&(sh.churnedRevenue>0||sh.voidedLeads.length>0)&&(
        <>
          <GoldDivider/>
          <section>
            <SectionLabel>Churned / Voided</SectionLabel>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))",gap:14}}>
              <Card>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
                  <p style={{fontFamily:"var(--font-body)",fontSize:12,fontWeight:600,color:"#F2EDE6",margin:0}}>Voided Payments</p>
                  <span style={{fontFamily:"var(--font-display)",fontSize:20,color:"#E05252"}}>{fmt$(sh.churnedRevenue)}</span>
                </div>
                {sh.voidedLeads.length===0?(
                  <p style={{fontFamily:"var(--font-body)",fontSize:12,color:"#444",fontStyle:"italic"}}>No voids in selected range</p>
                ):(
                  <div style={{border:"1px solid rgba(255,255,255,0.07)",borderRadius:8,overflow:"hidden"}}>
                    {sh.voidedLeads.map((v,i)=>(
                      <div key={v.leadName} style={{
                        display:"flex",justifyContent:"space-between",alignItems:"center",padding:"9px 14px",
                        borderBottom:i<sh.voidedLeads.length-1?"1px solid rgba(255,255,255,0.05)":"none",
                      }}>
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

function FunnelView({data}:{data:DashboardData}) {
  const cal=data.calendly;
  const tf =data.typeform;
  const sh =data.sheets.connected?data.sheets:null;

  return (
    <div style={{display:"flex",flexDirection:"column",gap:32}}>
      <section>
        <SectionLabel>Funnel</SectionLabel>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))",gap:14}}>
          <Card>
            <p style={{fontFamily:"var(--font-body)",fontSize:12,fontWeight:600,color:"#F2EDE6",marginBottom:16}}>Applications → Calls → Deals</p>
            <FunnelViz steps={[
              {label:"Applications (Typeform)",value:tf?.totalInRange??0},
              {label:"Calls Booked (active)",  value:cal?.bookedInRange??0,pct:data.conversionRate??0},
              {label:"Deals Closed",           value:sh?.dealsClosed??0,pct:data.closeRate??0},
            ]}/>
          </Card>

          <Card>
            <p style={{fontFamily:"var(--font-body)",fontSize:12,fontWeight:600,color:"#F2EDE6",marginBottom:14}}>Key Rates</p>
            {[
              {label:"Conversion Rate",value:data.conversionRate!==null?fmtPct(data.conversionRate):"—",sub:"Applications → Calls"},
              {label:"Close Rate",     value:data.closeRate!==null?fmtPct(data.closeRate):"—",sub:"Calls → Deals"},
              {label:"Show Rate",      value:cal?fmtPct(cal.showRate):"—",sub:`${cal?.cancelledInRange??0} cancelled`},
            ].map(r=>(
              <div key={r.label} style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
                <div>
                  <p style={{fontFamily:"var(--font-body)",fontSize:13,color:"#CCC",margin:0}}>{r.label}</p>
                  <p style={{fontFamily:"var(--font-body)",fontSize:11,color:"#555",margin:0}}>{r.sub}</p>
                </div>
                <span style={{fontFamily:"var(--font-display)",fontSize:26,color:"#C9A84C",lineHeight:1}}>{r.value}</span>
              </div>
            ))}
          </Card>

          {cal&&cal.cancelReasons.length>0&&(
            <Card>
              <p style={{fontFamily:"var(--font-body)",fontSize:12,fontWeight:600,color:"#F2EDE6",marginBottom:12}}>Cancel Reasons</p>
              <div style={{display:"flex",flexDirection:"column",gap:8}}>
                {cal.cancelReasons.map((r,i)=>(
                  <p key={i} style={{fontFamily:"var(--font-body)",fontSize:12,color:"#777",padding:"8px 12px",borderRadius:7,lineHeight:1.5,background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.06)"}}>
                    &ldquo;{r}&rdquo;
                  </p>
                ))}
              </div>
            </Card>
          )}
        </div>
      </section>
    </div>
  );
}

function CommissionsView({data}:{data:DashboardData}) {
  const at=data.airtable.connected?data.airtable:null;
  const sh=data.sheets.connected  ?data.sheets  :null;
  const setterTotal=sh?.setterCommPaid.reduce((s,r)=>s+r.amount,0)??0;
  const closerTotal=sh?.closerCommPaid.reduce((s,r)=>s+r.amount,0)??0;

  return (
    <div style={{display:"flex",flexDirection:"column",gap:32}}>
      <section>
        <SectionLabel>Commissions</SectionLabel>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))",gap:14}}>
          {at&&(
            <Card>
              <CommissionTable title="Setter Commissions (total owed)" rows={at.setterCommissions} subRows={sh?.setterCommPaid}/>
              <div style={{height:1,background:"rgba(255,255,255,0.06)",margin:"16px 0"}}/>
              <CommissionTable title="Closer Commissions (total owed)" rows={at.closerCommissions} subRows={sh?.closerCommPaid} accent="#4CAF6E"/>
              <p style={{fontFamily:"var(--font-body)",fontSize:10,color:"#3A3A3A",marginTop:12}}>Right = total owed (Airtable) · left = paid to date (Sheets)</p>
            </Card>
          )}
          {sh&&<RevanaPanel netEarnings={sh.totalNetEarnings} setterTotal={setterTotal} closerTotal={closerTotal}/>}
        </div>
      </section>
    </div>
  );
}

function EodView({data}:{data:DashboardData}) {
  const sh=data.sheets.connected?data.sheets:null;

  return (
    <div style={{display:"flex",flexDirection:"column",gap:32}}>
      <section>
        <SectionLabel>EOD Reports</SectionLabel>
        {!sh?(
          <p style={{fontFamily:"var(--font-body)",fontSize:13,color:"#555"}}>Google Sheets not connected.</p>
        ):(
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(320px,1fr))",gap:14}}>
            <EodTable
              title="Setter EOD"
              rows={sh.setterEod.rows as Record<string,string|number>[]}
              emptyMsg="No setter reports submitted yet"
              columns={[
                {key:"timestamp",  label:"Date"},
                {key:"name",       label:"Setter"},
                {key:"contacted",  label:"Contacted"},
                {key:"callsBooked",label:"Booked"},
                {key:"liveCalls",  label:"Live"},
                {key:"noShows",    label:"No-Shows"},
              ]}
            />
            <EodTable
              title="Closer EOD"
              rows={sh.closerEod.rows as Record<string,string|number>[]}
              emptyMsg="No closer reports submitted yet"
              columns={[
                {key:"timestamp",     label:"Date"},
                {key:"name",          label:"Closer"},
                {key:"callsScheduled",label:"Scheduled"},
                {key:"noShows",       label:"No-Shows"},
                {key:"reschedules",   label:"Reschedules"},
                {key:"cancellations", label:"Cancels"},
                {key:"dealsClosed",   label:"Closed"},
              ]}
            />
          </div>
        )}
      </section>
    </div>
  );
}

function OverheadView({data}:{data:DashboardData}) {
  const sh=data.sheets.connected?data.sheets:null;

  return (
    <div style={{display:"flex",flexDirection:"column",gap:32}}>
      <section>
        <SectionLabel>Monthly Overhead</SectionLabel>
        {!sh?(
          <p style={{fontFamily:"var(--font-body)",fontSize:13,color:"#555"}}>Google Sheets not connected.</p>
        ):sh.subscriptions.length===0?(
          <p style={{fontFamily:"var(--font-body)",fontSize:13,color:"#555"}}>No subscription data found in sheet.</p>
        ):(
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))",gap:14}}>
            <Card>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
                <p style={{fontFamily:"var(--font-body)",fontSize:12,fontWeight:600,color:"#F2EDE6",margin:0}}>Tool Subscriptions</p>
                <span style={{fontFamily:"var(--font-display)",fontSize:20,color:"#C9A84C"}}>
                  {fmt$(sh.totalMonthlyOverhead)}<span style={{fontFamily:"var(--font-body)",fontSize:11,color:"#555"}}>/mo</span>
                </span>
              </div>
              <div style={{border:"1px solid rgba(255,255,255,0.07)",borderRadius:8,overflow:"hidden"}}>
                {sh.subscriptions.map((s,i)=>(
                  <div key={s.tool} style={{
                    display:"flex",justifyContent:"space-between",alignItems:"center",padding:"9px 14px",
                    borderBottom:i<sh.subscriptions.length-1?"1px solid rgba(255,255,255,0.05)":"none",
                  }}>
                    <span style={{fontFamily:"var(--font-body)",fontSize:13,color:"#CCC"}}>{s.tool}</span>
                    <span style={{fontFamily:"var(--font-body)",fontSize:13,fontWeight:600,color:"#888"}}>{fmt$(s.monthlyCost)}/mo</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}
      </section>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────

const PAGE_TITLES: Record<PageKey,string> = {
  dashboard:"Dashboard",revenue:"Revenue",funnel:"Funnel",
  commissions:"Commissions",eod:"EOD Reports",overhead:"Overhead",
};

function toIso(d:Date){return d.toISOString().split("T")[0];}

export default function DashboardPage() {
  const [data,       setData]       = useState<DashboardData|null>(null);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [page,       setPage]       = useState<PageKey>("dashboard");
  const [range, setRange] = useState<{start:Date;end:Date}>(()=>{
    const e=new Date(); e.setHours(23,59,59,999);
    return {start:new Date("2020-01-01"),end:e};
  });
  const timerRef=useRef<ReturnType<typeof setInterval>|null>(null);

  const load=useCallback(async(silent=false,r=range)=>{
    if(!silent) setLoading(true); else setRefreshing(true);
    setError(false);
    try{
      const res=await fetch(`/api/dashboard?start=${toIso(r.start)}&end=${toIso(r.end)}`,{cache:"no-store"});
      if(!res.ok) throw new Error();
      setData(await res.json());
    }catch{setError(true);}
    finally{setLoading(false);setRefreshing(false);}
  },[range]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(()=>{load();},[]);

  useEffect(()=>{
    if(timerRef.current) clearInterval(timerRef.current);
    timerRef.current=setInterval(()=>load(true),120_000);
    return()=>{if(timerRef.current) clearInterval(timerRef.current);};
  },[load]);

  const handleRangeChange=(r:{start:Date;end:Date})=>{
    setRange(r);
    load(false,r);
  };

  const updated=data?.lastUpdated?new Date(data.lastUpdated).toLocaleTimeString():"—";

  return (
    <div style={{display:"flex",height:"100vh",overflow:"hidden",backgroundColor:"#0A0A0A"}}>
      <style>{`
        @keyframes pulse{0%,100%{opacity:.4}50%{opacity:.75}}
        @keyframes spin{to{transform:rotate(360deg)}}
        input[type=number]::-webkit-inner-spin-button,
        input[type=number]::-webkit-outer-spin-button{-webkit-appearance:none}
        input[type=number]{-moz-appearance:textfield}
      `}</style>

      {/* Sidebar */}
      <Sidebar current={page} onChange={setPage} refreshing={refreshing} onRefresh={()=>load(true)} updated={updated}/>

      {/* Main */}
      <div style={{flex:1,overflowY:"auto",display:"flex",flexDirection:"column"}}>

        {/* Top bar */}
        <div style={{
          position:"sticky",top:0,zIndex:100,
          background:"rgba(10,10,10,0.92)",backdropFilter:"blur(12px)",
          borderBottom:"1px solid rgba(255,255,255,0.06)",
          padding:"14px 28px",
          display:"flex",justifyContent:"space-between",alignItems:"center",gap:16,flexWrap:"wrap",
        }}>
          <div>
            <h2 style={{fontFamily:"var(--font-display)",fontSize:22,color:"#F2EDE6",margin:0,lineHeight:1}}>
              {PAGE_TITLES[page]}
            </h2>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            {refreshing&&<Spinner/>}
            <DateRangePicker value={range} onChange={handleRangeChange}/>
          </div>
        </div>

        {/* Connection pills */}
        {data&&(
          <div style={{padding:"10px 28px 0",display:"flex",gap:6,flexWrap:"wrap"}}>
            <Pill ok={data.airtable.connected} label={data.airtable.connected?"Airtable ✓":`Airtable ✗`}/>
            <Pill ok={data.sheets.connected}   label={data.sheets.connected  ?"Google Sheets ✓":"Sheets ✗"}/>
            <Pill ok={!!data.calendly}          label={data.calendly?"Calendly ✓":"Calendly —"}/>
            <Pill ok={!!data.typeform}          label={data.typeform?"Typeform ✓":"Typeform —"}/>
            <Pill ok={!!data.whop}              label={data.whop?"Whop ✓":"Whop —"}/>
          </div>
        )}

        {/* Content */}
        <div style={{flex:1,padding:"24px 28px 80px"}}>
          {loading&&(
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(160px,1fr))",gap:10}}>
              {[...Array(8)].map((_,i)=><Skeleton key={i}/>)}
            </div>
          )}

          {error&&!loading&&(
            <div style={{textAlign:"center",padding:"60px 0"}}>
              <p style={{color:"#E05252",fontFamily:"var(--font-body)",fontSize:14}}>
                Failed to load.{" "}
                <button onClick={()=>load()} style={{color:"#C9A84C",textDecoration:"underline",background:"none",border:"none",cursor:"pointer"}}>Retry</button>
              </p>
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
    </div>
  );
}
