"use client";

import { useEffect, useMemo, useState } from "react";
import {
  CalendarDays, PawPrint, PencilLine, Gift, Clock3, Settings, Star, Volume2,
  CheckCircle2, Sparkles, LockKeyhole, Plus, Trash2, Heart, Trophy, ShoppingBag,
  BarChart3, X, Save, RotateCcw, Smile, Crown, ChevronRight, Dog, Cat
} from "lucide-react";

type Task = { id: string; title: string; icon: string; stars: number; done: boolean; group: "morning"|"evening"|"any" };
type Reward = { id: string; title: string; emoji: string; cost: number };
type Sticker = { id: string; emoji: string; title: string; earned: boolean };
type Log = { date: string; stars: number; completed: number };

const initialTasks: Task[] = [
  {id:"t1",title:"Tự đánh răng buổi sáng",icon:"🪥",stars:1,done:false,group:"morning"},
  {id:"t2",title:"Gấp chăn gọn gàng",icon:"🛏️",stars:1,done:false,group:"morning"},
  {id:"t3",title:"Tự thay quần áo",icon:"👗",stars:1,done:false,group:"morning"},
  {id:"t4",title:"Ăn sáng ngoan",icon:"🥣",stars:1,done:false,group:"morning"},
  {id:"t5",title:"Đi học đúng giờ",icon:"🎒",stars:2,done:false,group:"morning"},
  {id:"t6",title:"Chào ông bà lễ phép",icon:"🙋‍♀️",stars:1,done:false,group:"any"},
  {id:"t7",title:"Cất đồ chơi sau khi chơi",icon:"🧸",stars:1,done:false,group:"evening"},
  {id:"t8",title:"Tắm rửa sạch sẽ",icon:"🛁",stars:1,done:false,group:"evening"},
  {id:"t9",title:"Đọc sách trước khi ngủ",icon:"📚",stars:2,done:false,group:"evening"},
];
const initialRewards: Reward[] = [
  {id:"r1",title:"Chọn truyện trước giờ ngủ",emoji:"📖",cost:5},
  {id:"r2",title:"Chơi cùng ba mẹ 20 phút",emoji:"🧩",cost:8},
  {id:"r3",title:"Đi công viên cuối tuần",emoji:"🎡",cost:20},
  {id:"r4",title:"Một món đồ chơi nhỏ",emoji:"🧸",cost:30},
];
const initialStickers: Sticker[] = [
  {id:"s1",emoji:"🌸",title:"Bông hoa ngoan",earned:false},
  {id:"s2",emoji:"🦄",title:"Nàng tiên nhỏ",earned:false},
  {id:"s3",emoji:"🌈",title:"Cầu vồng vui vẻ",earned:false},
  {id:"s4",emoji:"🏆",title:"Siêu chăm ngoan",earned:false},
  {id:"s5",emoji:"🐰",title:"Bạn thỏ đáng yêu",earned:false},
  {id:"s6",emoji:"👑",title:"Công chúa chăm ngoan",earned:false},
];
const todayKey = () => new Date().toLocaleDateString("sv-SE");
const read = <T,>(key:string, fallback:T):T => {
  if (typeof window === "undefined") return fallback;
  try { const v=localStorage.getItem(key); return v ? JSON.parse(v) as T : fallback; } catch { return fallback; }
};

export default function Home() {
  const [tab,setTab] = useState("home");
  const [tasks,setTasks] = useState<Task[]>(initialTasks);
  const [stars,setStars] = useState(0);
  const [totalStars,setTotalStars] = useState(0);
  const [rewards,setRewards] = useState<Reward[]>(initialRewards);
  const [stickers,setStickers] = useState<Sticker[]>(initialStickers);
  const [pet,setPet] = useState("🐰");
  const [petName,setPetName] = useState("Bông");
  const [logs,setLogs] = useState<Log[]>([]);
  const [parentOpen,setParentOpen] = useState(false);
  const [pin,setPin] = useState("");
  const [parentUnlocked,setParentUnlocked] = useState(false);
  const [newTask,setNewTask] = useState("");
  const [newStars,setNewStars] = useState("1");
  const [newReward,setNewReward] = useState("");
  const [newCost,setNewCost] = useState("10");
  const [message,setMessage] = useState("Hôm nay đi học chăm ngoan, chiều về nhớ khoanh tay chào ông bà thật lễ phép nhé bé Milk!");
  const [toast,setToast] = useState("");
  const [history,setHistory] = useState<string[]>([]);
  const [loaded,setLoaded] = useState(false);

  useEffect(() => {
    setTasks(read("milk_tasks",initialTasks)); setStars(read("milk_stars",0));
    setTotalStars(read("milk_total",0)); setRewards(read("milk_rewards",initialRewards));
    setStickers(read("milk_stickers",initialStickers)); setPet(read("milk_pet","🐰"));
    setPetName(read("milk_petname","Bông")); setLogs(read("milk_logs",[]));
    setMessage(read("milk_message","Hôm nay đi học chăm ngoan, chiều về nhớ khoanh tay chào ông bà thật lễ phép nhé bé Milk!"));
    setHistory(read("milk_history",[])); setLoaded(true);
  },[]);
  useEffect(() => { if(!loaded)return;
    localStorage.setItem("milk_tasks",JSON.stringify(tasks)); localStorage.setItem("milk_stars",JSON.stringify(stars));
    localStorage.setItem("milk_total",JSON.stringify(totalStars)); localStorage.setItem("milk_rewards",JSON.stringify(rewards));
    localStorage.setItem("milk_stickers",JSON.stringify(stickers)); localStorage.setItem("milk_pet",JSON.stringify(pet));
    localStorage.setItem("milk_petname",JSON.stringify(petName)); localStorage.setItem("milk_logs",JSON.stringify(logs));
    localStorage.setItem("milk_message",JSON.stringify(message)); localStorage.setItem("milk_history",JSON.stringify(history));
  },[loaded,tasks,stars,totalStars,rewards,stickers,pet,petName,logs,message,history]);

  const doneCount = tasks.filter(t=>t.done).length;
  const progress = tasks.length ? Math.round(doneCount/tasks.length*100) : 0;
  const today = new Date();
  const dateText = today.toLocaleDateString("vi-VN",{weekday:"long",day:"2-digit",month:"2-digit",year:"numeric"});
  const streak = useMemo(() => {
    const dates = [...new Set(logs.filter(l=>l.completed>0).map(l=>l.date))].sort().reverse();
    if(!dates.length)return 0;
    let count=0; const cursor=new Date();
    for(let i=0;i<365;i++){const key=cursor.toLocaleDateString("sv-SE"); if(dates.includes(key)){count++;cursor.setDate(cursor.getDate()-1);}else if(i===0){cursor.setDate(cursor.getDate()-1);}else break;}
    return count;
  },[logs]);

  function notify(text:string){setToast(text);window.setTimeout(()=>setToast(""),2400);}
  function speak(text:string){if(typeof window==="undefined" || !("speechSynthesis" in window)){notify("Thiết bị chưa hỗ trợ đọc giọng nói.");return;}
    window.speechSynthesis.cancel(); const u=new SpeechSynthesisUtterance(text);u.lang="vi-VN";u.rate=.88;u.pitch=1.12;window.speechSynthesis.speak(u);}
  function completeTask(id:string){const task=tasks.find(t=>t.id===id);if(!task||task.done)return;
    setTasks(old=>old.map(t=>t.id===id?{...t,done:true}:t));setStars(s=>s+task.stars);setTotalStars(s=>s+task.stars);
    setHistory(h=>[...h,`${todayKey()}|${task.title}|+${task.stars}`]);
    setLogs(old=>{const current=old.find(l=>l.date===todayKey());return current?old.map(l=>l.date===todayKey()?{...l,stars:l.stars+task.stars,completed:l.completed+1}:l):[...old,{date:todayKey(),stars:task.stars,completed:1}];});
    if(doneCount+1===tasks.length){setStickers(old=>old.map((s,i)=>i===0?{...s,earned:true}:s));speak("Tuyệt vời! Bé Milk đã hoàn thành tất cả nhiệm vụ hôm nay. Ba mẹ tự hào về con!");}
    else speak(`Giỏi quá! Bé Milk đã hoàn thành: ${task.title}. Con nhận được ${task.stars} sao.`);
  }
  function resetDay(){setTasks(old=>old.map(t=>({...t,done:false})));notify("Đã làm mới nhiệm vụ cho ngày mới.");}
  function redeem(r:Reward){if(stars<r.cost){notify("Bé chưa đủ sao để đổi món quà này.");return;}
    setStars(s=>s-r.cost);setHistory(h=>[...h,`${todayKey()}|Đổi quà: ${r.title}|-${r.cost}`]);notify(`Đã đổi ${r.title}. Ba mẹ xác nhận phần quà nhé!`);speak("Chúc mừng bé Milk đổi được phần quà yêu thích!");}
  function unlockParent(){if(pin==="1234"){setParentUnlocked(true);setPin("");}else notify("Mã PIN chưa đúng. PIN mặc định là 1234.");}
  function addTask(){if(!newTask.trim())return;setTasks(old=>[...old,{id:`t${Date.now()}`,title:newTask.trim(),icon:"✨",stars:Math.max(1,Number(newStars)||1),done:false,group:"any"}]);setNewTask("");}
  function addReward(){if(!newReward.trim())return;setRewards(old=>[...old,{id:`r${Date.now()}`,title:newReward.trim(),emoji:"🎁",cost:Math.max(1,Number(newCost)||1)}]);setNewReward("");}
  const nav=[{id:"home",label:"Lịch Bé",icon:CalendarDays},{id:"pet",label:"Thú Cưng",icon:PawPrint},{id:"tasks",label:"Làm Bài",icon:PencilLine},{id:"rewards",label:"Sticker",icon:Gift},{id:"stats",label:"Thống Kê",icon:BarChart3}];

  return <main className="app-shell">
    <header className="topbar">
      <div className="avatar">👧🏻</div>
      <div className="identity"><div className="name">👑 Bé Milk • Lê Đan Nhiên</div><div className="sub">5 Tuổi • Chăm Ngoan</div></div>
      <div className="star-pill"><Star size={20} fill="#ffc928"/> {stars} sao</div>
      <button className="sound-mini" aria-label="Đọc lời khen" onClick={()=>speak(message)}><Volume2 size={20}/></button>
    </header>

    {tab==="home" && <section className="content">
      <div className="hero-card">
        <div className="hero-photo">
          <div className="hero-art"><div className="sparkle">✦</div><div className="girl">👧🏻</div><div className="pet-float">{pet}</div><div className="cloud">🌸 🌼 🌸</div></div>
          <div className="name-ribbon">🌸 Bé Milk • Lê Đan Nhiên 👑</div>
        </div>
        <div className="daily-message"><div className="pig">🐷</div><div className="quote">🎒 “{message}”</div></div>
        <div className="hero-actions"><button className="pink-button" onClick={()=>speak(message)}><Volume2 size={20}/> Nghe lời khen yêu thương</button><div className="count-pill">{doneCount}/{tasks.length} việc</div></div>
        <div className="progress-wrap"><div className="progress-label"><span>Hành trình chăm ngoan</span><b>{progress}%</b></div><div className="progress"><span style={{width:`${progress}%`}}/></div></div>
      </div>
      <div className="section-heading"><div><span className="eyebrow">MỖI NGÀY MỘT NIỀM VUI</span><h2>Việc tốt hôm nay 🌷</h2></div><button className="text-button" onClick={()=>setTab("tasks")}>Xem tất cả <ChevronRight size={16}/></button></div>
      <div className="task-list">{tasks.slice(0,4).map(t=><TaskRow key={t.id} task={t} onComplete={()=>completeTask(t.id)}/>)}</div>
      <div className="two-cards"><div className="mini-card pet-mini" onClick={()=>setTab("pet")}><span className="mini-emoji">{pet}</span><b>{petName} đang chờ bé!</b><small>Ghé thăm thú cưng <ChevronRight size={13}/></small></div><div className="mini-card reward-mini" onClick={()=>setTab("rewards")}><span className="mini-emoji">🎁</span><b>{stars} sao đang có</b><small>Khám phá phần thưởng <ChevronRight size={13}/></small></div></div>
    </section>}

    {tab==="tasks" && <section className="content"><PageTitle kicker="THỬ THÁCH MỖI NGÀY" title="Bé làm việc tốt 🌟" desc="Mỗi việc tốt là một ngôi sao đang chờ bé!"/><div className="progress-card"><div><b>{doneCount}/{tasks.length} việc hoàn thành</b><small>Tiến độ hôm nay</small></div><strong>{progress}%</strong><div className="progress full"><span style={{width:`${progress}%`}}/></div></div><div className="task-list">{tasks.map(t=><TaskRow key={t.id} task={t} onComplete={()=>completeTask(t.id)}/>)}</div><button className="outline-button" onClick={resetDay}><RotateCcw size={16}/> Làm mới nhiệm vụ</button></section>}

    {tab==="pet" && <section className="content"><PageTitle kicker="NGƯỜI BẠN NHỎ" title="Thú cưng của Milk 🐾" desc="Chăm sóc bạn nhỏ bằng những việc tốt mỗi ngày."/><div className="pet-stage"><div className="pet-sun">☀️</div><div className="pet-big">{pet}</div><div className="pet-hearts">💗 ✨ 💗</div><h2>{petName}</h2><p>{stars>=10?"Bạn ấy rất vui vì bé chăm ngoan!":"Bạn ấy đang mong bé làm thêm việc tốt."}</p><div className="pet-meter"><span style={{width:`${Math.min(100,stars*5)}%`}}/></div><small>Niềm vui của {petName}: {Math.min(100,stars*5)}%</small></div><h3 className="subheading">Chọn người bạn đồng hành</h3><div className="pet-choices">{["🐰","🐱","🐶","🦄","🐼","🐻"].map(p=><button className={pet===p?"pet-choice selected":"pet-choice"} key={p} onClick={()=>setPet(p)}>{p}</button>)}</div><div className="field"><label>Tên thú cưng</label><input value={petName} onChange={e=>setPetName(e.target.value)} maxLength={18}/></div></section>}

    {tab==="rewards" && <section className="content"><PageTitle kicker="KHO BÁU CỦA BÉ" title="Đổi sao lấy quà 🎁" desc="Bé tích lũy sao và nhờ ba mẹ đổi phần thưởng nhé!"/><div className="wallet"><Star fill="#ffd04a" color="#e5a900" size={28}/><div><small>Số sao hiện có</small><b>{stars} sao</b></div></div><div className="reward-grid">{rewards.map(r=><div className="reward-card" key={r.id}><div className="reward-emoji">{r.emoji}</div><b>{r.title}</b><div className="cost">⭐ {r.cost} sao</div><button className="small-pink" onClick={()=>redeem(r)} disabled={stars<r.cost}>Đổi quà</button></div>)}</div><h3 className="subheading">Bộ sưu tập sticker</h3><div className="sticker-grid">{stickers.map(s=><div className={s.earned?"sticker earned":"sticker locked"} key={s.id}><span>{s.emoji}</span><small>{s.title}</small>{s.earned&&<b>Đã nhận</b>}</div>)}</div></section>}

    {tab==="stats" && <section className="content"><PageTitle kicker="NHỮNG ĐIỀU TUYỆT VỜI" title="Milk đã lớn khôn 🌈" desc="Cùng nhìn lại hành trình cố gắng của bé."/><div className="stat-grid"><Stat icon="⭐" value={totalStars} label="Tổng sao đã nhận"/><Stat icon="🔥" value={streak} label="Ngày chăm ngoan liên tiếp"/><Stat icon="✅" value={logs.reduce((a,l)=>a+l.completed,0)} label="Việc tốt đã hoàn thành"/><Stat icon="🎁" value={history.filter(h=>h.includes("Đổi quà")).length} label="Lần đổi quà"/></div><div className="panel"><h3>7 ngày gần đây</h3>{Array.from({length:7},(_,i)=>{const d=new Date();d.setDate(d.getDate()-6+i);const key=d.toLocaleDateString("sv-SE");const log=logs.find(l=>l.date===key);return <div className="week-row" key={key}><span>{d.toLocaleDateString("vi-VN",{weekday:"short",day:"2-digit"})}</span><div className="week-bar"><i style={{width:`${Math.min(100,(log?.completed||0)/Math.max(1,tasks.length)*100)}%`}}/></div><b>{log?.stars||0} ⭐</b></div>})}</div><div className="panel"><h3>Nhật ký gần đây</h3>{history.length?history.slice(-8).reverse().map((h,i)=><p className="history-row" key={i}>🌷 {h.split("|")[1]} <b>{h.split("|")[2]}</b></p>):<p className="muted">Bé hãy hoàn thành nhiệm vụ để bắt đầu nhật ký nhé!</p>}</div></section>}

    <nav className="bottom-nav">{nav.map(n=><button key={n.id} className={tab===n.id?"nav-item active":"nav-item"} onClick={()=>setTab(n.id)}><n.icon size={23}/><span>{n.label}</span></button>)}<button className="nav-item parent-nav" onClick={()=>{setParentOpen(true);setParentUnlocked(false);}}><Settings size={23}/><span>Ba Mẹ</span></button></nav>

    {parentOpen && <div className="modal-backdrop" onClick={()=>setParentOpen(false)}><div className="modal" onClick={e=>e.stopPropagation()}><button className="close" onClick={()=>setParentOpen(false)}><X/></button>{!parentUnlocked?<><div className="modal-icon"><LockKeyhole/></div><h2>Khu vực ba mẹ</h2><p className="muted">Nhập mã PIN để quản lý nhiệm vụ và phần thưởng.</p><input className="pin-input" type="password" inputMode="numeric" maxLength={4} placeholder="Nhập PIN 4 số" value={pin} onChange={e=>setPin(e.target.value)}/><button className="pink-button wide" onClick={unlockParent}>Mở khóa</button><small className="hint">PIN mặc định: 1234 (hãy đổi trước khi sử dụng thật)</small></>:<><div className="modal-heading"><div className="modal-icon"><Crown/></div><div><h2>Ba mẹ quản lý</h2><p className="muted">Thiết lập hành trình của bé Milk</p></div></div><div className="admin-section"><h3>Lời nhắn mỗi ngày</h3><textarea value={message} onChange={e=>setMessage(e.target.value)} rows={3}/><button className="small-pink" onClick={()=>{speak(message);notify("Đang đọc lời nhắn.");}}>▶ Nghe thử</button></div><div className="admin-section"><h3>Thêm nhiệm vụ</h3><input placeholder="Ví dụ: Tự cất dép ngay ngắn" value={newTask} onChange={e=>setNewTask(e.target.value)}/><div className="inline-fields"><input type="number" min="1" max="10" value={newStars} onChange={e=>setNewStars(e.target.value)}/><button className="small-pink" onClick={addTask}><Plus size={15}/> Thêm việc</button></div>{tasks.map(t=><div className="manage-row" key={t.id}><span>{t.icon} {t.title} · {t.stars}⭐</span><button onClick={()=>setTasks(old=>old.filter(x=>x.id!==t.id))}><Trash2 size={16}/></button></div>)}</div><div className="admin-section"><h3>Thêm phần thưởng</h3><input placeholder="Tên phần thưởng" value={newReward} onChange={e=>setNewReward(e.target.value)}/><div className="inline-fields"><input type="number" min="1" value={newCost} onChange={e=>setNewCost(e.target.value)}/><button className="small-pink" onClick={addReward}><Plus size={15}/> Thêm quà</button></div>{rewards.map(r=><div className="manage-row" key={r.id}><span>{r.emoji} {r.title} · {r.cost}⭐</span><button onClick={()=>setRewards(old=>old.filter(x=>x.id!==r.id))}><Trash2 size={16}/></button></div>)}</div><div className="admin-section"><h3>Điều chỉnh sao</h3><div className="inline-fields"><button className="outline-button" onClick={()=>setStars(s=>s+1)}>+1 sao</button><button className="outline-button" onClick={()=>setStars(s=>Math.max(0,s-1))}>−1 sao</button></div></div><button className="pink-button wide" onClick={()=>{setParentOpen(false);notify("Đã lưu thiết lập.");}}><Save size={17}/> Lưu và đóng</button></>}</div></div>}
    {toast&&<div className="toast">✨ {toast}</div>}
    <footer>Made with 💗 for Bé Milk • Lê Đan Nhiên</footer>
  </main>;
}

function TaskRow({task,onComplete}:{task:Task;onComplete:()=>void}){return <div className={task.done?"task-row completed":"task-row"}><div className="task-icon">{task.icon}</div><div className="task-info"><b>{task.title}</b><small>Phần thưởng: ⭐ {task.stars}</small></div><button className={task.done?"check-button done":"check-button"} onClick={onComplete} disabled={task.done}>{task.done?<CheckCircle2 size={21}/>:<span>+{task.stars} ⭐</span>}</button></div>}
function PageTitle({kicker,title,desc}:{kicker:string;title:string;desc:string}){return <div className="page-title"><span className="eyebrow">{kicker}</span><h1>{title}</h1><p>{desc}</p></div>}
function Stat({icon,value,label}:{icon:string;value:number;label:string}){return <div className="stat-card"><span>{icon}</span><b>{value}</b><small>{label}</small></div>}
