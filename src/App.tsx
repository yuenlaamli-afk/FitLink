import React, { useState, useEffect } from 'react';
import { 
  Heart, 
  Target, 
  Calendar, 
  Box, 
  MapPin, 
  Wrench, 
  Home,
  ChevronRight,
  Plus,
  QrCode,
  Search,
  Filter,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { TabType, Venue, Equipment, Goal } from './types';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [points, setPoints] = useState(1250);
  const [donatedBreakfasts, setDonatedBreakfasts] = useState(12);
  const [goals, setGoals] = useState<Goal[]>([
    { id: '1', title: '每日步行 10,000 步', points: 50, completed: false, icon: 'Footprints' },
    { id: '2', title: '晨間跑步 30 分鐘', points: 100, completed: true, icon: 'Timer' },
    { id: '3', title: '力量訓練 20 分鐘', points: 80, completed: false, icon: 'Dumbbell' },
  ]);

  const pointsToBreakfast = 500;
  const progressToNextBreakfast = (points % pointsToBreakfast) / pointsToBreakfast * 100;

  const renderContent = () => {
    switch (activeTab) {
      case 'home': return <HomeSection setActiveTab={setActiveTab} points={points} donatedBreakfasts={donatedBreakfasts} progress={progressToNextBreakfast} />;
      case 'charity': return <CharitySection points={points} donatedBreakfasts={donatedBreakfasts} progress={progressToNextBreakfast} />;
      case 'goals': return <GoalsSection goals={goals} setGoals={setGoals} setPoints={setPoints} />;
      case 'booking': return <BookingSection />;
      case 'pods': return <PodsSection />;
      case 'nearby': return <NearbySection />;
      case 'equipment': return <EquipmentSection />;
      default: return <HomeSection setActiveTab={setActiveTab} points={points} donatedBreakfasts={donatedBreakfasts} progress={progressToNextBreakfast} />;
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-slate-50 overflow-hidden shadow-2xl relative">
      {/* Header */}
      <header className="px-6 pt-8 pb-4 bg-white border-b border-slate-100 flex justify-between items-center shrink-0">
        <div>
          <h1 className="text-2xl font-display font-bold text-slate-900">FitLink</h1>
          <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">運動共享與愛心平台</p>
        </div>
        <div className="flex items-center gap-2 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
          <span className="text-sm font-bold text-emerald-700">{points} 積分</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pb-24">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="p-6"
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white/80 backdrop-blur-lg border-t border-slate-100 px-4 py-3 flex justify-between items-center z-50">
        <NavButton active={activeTab === 'home'} onClick={() => setActiveTab('home')} icon={<Home size={20} />} label="首頁" />
        <NavButton active={activeTab === 'charity'} onClick={() => setActiveTab('charity')} icon={<Heart size={20} />} label="愛心" />
        <NavButton active={activeTab === 'goals'} onClick={() => setActiveTab('goals')} icon={<Target size={20} />} label="目標" />
        <NavButton active={activeTab === 'booking'} onClick={() => setActiveTab('booking')} icon={<Calendar size={20} />} label="預約" />
        <NavButton active={activeTab === 'nearby'} onClick={() => setActiveTab('nearby')} icon={<MapPin size={20} />} label="附近" />
      </nav>
    </div>
  );
}

function NavButton({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "flex flex-col items-center gap-1 transition-all duration-200",
        active ? "text-emerald-600 scale-110" : "text-slate-400 hover:text-slate-600"
      )}
    >
      <div className={cn(
        "p-1.5 rounded-xl transition-colors",
        active ? "bg-emerald-50" : "bg-transparent"
      )}>
        {icon}
      </div>
      <span className="text-[10px] font-bold uppercase tracking-tighter">{label}</span>
    </button>
  );
}

// --- Sections ---

function HomeSection({ setActiveTab, points, donatedBreakfasts, progress }: { setActiveTab: (t: TabType) => void, points: number, donatedBreakfasts: number, progress: number }) {
  return (
    <div className="space-y-6">
      {/* Hero Card - Charity Progress */}
      <div 
        onClick={() => setActiveTab('charity')}
        className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl p-6 text-white shadow-lg shadow-emerald-200 cursor-pointer overflow-hidden relative"
      >
        <div className="relative z-10">
          <div className="flex justify-between items-start mb-4">
            <div className="bg-white/20 backdrop-blur-md p-2 rounded-xl">
              <Heart className="fill-white" size={24} />
            </div>
            <span className="text-xs font-bold bg-white/20 px-2 py-1 rounded-lg uppercase tracking-widest">愛心傳遞中</span>
          </div>
          <h3 className="text-xl font-bold mb-1">已累計送出 {donatedBreakfasts} 份早餐</h3>
          <p className="text-emerald-50 text-sm mb-6">再獲得 {500 - (points % 500)} 積分即可送出下一份</p>
          
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold">
              <span>當前進度</span>
              <span>{Math.floor(progress)}%</span>
            </div>
            <div className="h-2 bg-white/20 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                className="h-full bg-white"
              />
            </div>
          </div>
        </div>
        {/* Decorative Circles */}
        <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute -left-10 -top-10 w-40 h-40 bg-emerald-400/20 rounded-full blur-3xl" />
      </div>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-2 gap-4">
        <QuickActionCard 
          icon={<Box className="text-blue-500" />} 
          title="智能健身艙" 
          desc="掃碼即用 靈活健身"
          onClick={() => setActiveTab('pods')}
          color="bg-blue-50"
        />
        <QuickActionCard 
          icon={<Wrench className="text-orange-500" />} 
          title="設備服務" 
          desc="租借、回收與維修"
          onClick={() => setActiveTab('equipment')}
          color="bg-orange-50"
        />
      </div>

      {/* Recent Activity / Recommendations */}
      <div className="space-y-4">
        <div className="flex justify-between items-end">
          <h4 className="font-display font-bold text-lg">推薦場地</h4>
          <button onClick={() => setActiveTab('booking')} className="text-emerald-600 text-xs font-bold flex items-center gap-1">
            查看全部 <ChevronRight size={14} />
          </button>
        </div>
        <div className="space-y-3">
          {[
            { id: 1, name: '活力健身中心', seed: 'fitness', dist: '0.8km', time: '10分鐘', price: 35 },
            { id: 2, name: '奧林匹克游泳館', seed: 'swimming', dist: '1.2km', time: '15分鐘', price: 45 }
          ].map((item) => (
            <div key={item.id} className="bg-white border border-slate-100 rounded-2xl p-4 flex gap-4 items-center">
              <div className="w-16 h-16 bg-slate-100 rounded-xl overflow-hidden shrink-0">
                <img src={`https://picsum.photos/seed/${item.seed}/200`} alt={item.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
              <div className="flex-1">
                <h5 className="font-bold text-sm">{item.name}</h5>
                <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                  <MapPin size={12} /> 距離 {item.dist} · {item.time}步行
                </p>
              </div>
              <div className="text-right">
                <span className="text-emerald-600 font-bold text-sm">${item.price}</span>
                <p className="text-[10px] text-slate-400">/小時</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function QuickActionCard({ icon, title, desc, onClick, color }: { icon: React.ReactNode, title: string, desc: string, onClick: () => void, color: string }) {
  return (
    <button 
      onClick={onClick}
      className={cn("p-5 rounded-3xl text-left transition-transform active:scale-95 border border-slate-100 shadow-sm", color)}
    >
      <div className="mb-3">{icon}</div>
      <h4 className="font-bold text-sm mb-1">{title}</h4>
      <p className="text-[10px] text-slate-500 leading-tight">{desc}</p>
    </button>
  );
}

function CharitySection({ points, donatedBreakfasts, progress }: { points: number, donatedBreakfasts: number, progress: number }) {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2 mb-8">
        <h2 className="text-2xl font-display font-bold">愛心傳遞</h2>
        <p className="text-slate-500 text-sm">您的每一分汗水，都在溫暖他人的清晨</p>
      </div>

      <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-xl shadow-slate-200/50 relative overflow-hidden">
        <div className="flex flex-col items-center text-center relative z-10">
          <div className="w-24 h-24 bg-rose-50 rounded-full flex items-center justify-center mb-6 border-4 border-rose-100">
            <Heart className="text-rose-500 fill-rose-500" size={40} />
          </div>
          <div className="text-4xl font-display font-bold text-slate-900 mb-2">{donatedBreakfasts}</div>
          <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-8">累計送出早餐份數</div>
          
          <div className="w-full space-y-4">
            <div className="flex justify-between text-sm font-bold">
              <span className="text-slate-600">下一份進度</span>
              <span className="text-emerald-600">{Math.floor(progress)}%</span>
            </div>
            <div className="h-4 bg-slate-100 rounded-full overflow-hidden p-1">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full"
              />
            </div>
            <p className="text-xs text-slate-400 italic">每 500 積分可自動轉化為一份愛心早餐</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="font-bold text-slate-900">捐贈記錄</h4>
        {[
          { date: '2024-05-20', type: '愛心早餐', status: '已送達' },
          { date: '2024-05-15', type: '愛心早餐', status: '已送達' },
          { date: '2024-05-10', type: '愛心早餐', status: '已送達' },
        ].map((log, i) => (
          <div key={i} className="flex justify-between items-center p-4 bg-white border border-slate-100 rounded-2xl">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-50 rounded-lg">
                <CheckCircle2 className="text-emerald-500" size={16} />
              </div>
              <div>
                <div className="text-sm font-bold">{log.type}</div>
                <div className="text-[10px] text-slate-400">{log.date}</div>
              </div>
            </div>
            <span className="text-xs font-bold text-emerald-600">{log.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function GoalsSection({ goals, setGoals, setPoints }: { goals: Goal[], setGoals: React.Dispatch<React.SetStateAction<Goal[]>>, setPoints: React.Dispatch<React.SetStateAction<number>> }) {
  const toggleGoal = (id: string) => {
    setGoals(prev => prev.map(g => {
      if (g.id === id && !g.completed) {
        setPoints(p => p + g.points);
        return { ...g, completed: true };
      }
      return g;
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-2xl font-display font-bold">每日目標</h2>
        <div className="text-xs font-bold text-slate-400">今日完成: {goals.filter(g => g.completed).length}/{goals.length}</div>
      </div>

      <div className="space-y-4">
        {goals.map((goal) => (
          <div 
            key={goal.id}
            className={cn(
              "p-5 rounded-3xl border transition-all duration-300 flex items-center justify-between",
              goal.completed ? "bg-emerald-50 border-emerald-100" : "bg-white border-slate-100 shadow-sm"
            )}
          >
            <div className="flex items-center gap-4">
              <div className={cn(
                "w-12 h-12 rounded-2xl flex items-center justify-center",
                goal.completed ? "bg-emerald-500 text-white" : "bg-slate-100 text-slate-400"
              )}>
                <CheckCircle2 size={24} />
              </div>
              <div>
                <h4 className={cn("font-bold text-sm", goal.completed && "text-emerald-900")}>{goal.title}</h4>
                <div className="flex items-center gap-1 mt-1">
                  <span className="text-xs font-bold text-emerald-600">+{goal.points} 積分</span>
                </div>
              </div>
            </div>
            {!goal.completed ? (
              <button 
                onClick={() => toggleGoal(goal.id)}
                className="bg-slate-900 text-white text-xs font-bold px-4 py-2 rounded-xl active:scale-95 transition-transform"
              >
                打卡
              </button>
            ) : (
              <div className="text-emerald-500">
                <CheckCircle2 size={24} />
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="bg-slate-900 rounded-3xl p-6 text-white overflow-hidden relative">
        <div className="relative z-10">
          <h4 className="font-bold mb-2">連續打卡獎勵</h4>
          <p className="text-xs text-slate-400 mb-4">再堅持 3 天，解鎖「運動達人」徽章與 500 額外積分</p>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5, 6, 7].map(d => (
              <div key={d} className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold border",
                d <= 4 ? "bg-emerald-500 border-emerald-400 text-white" : "bg-white/10 border-white/20 text-white/40"
              )}>
                {d}
              </div>
            ))}
          </div>
        </div>
        <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-emerald-500/20 rounded-full blur-2xl" />
      </div>
    </div>
  );
}

function BookingSection() {
  const [filter, setFilter] = useState('全部');
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h2 className="text-2xl font-display font-bold">場地預訂</h2>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="搜尋運動場地..." 
            className="w-full bg-white border border-slate-100 rounded-2xl py-3.5 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {['全部', '羽毛球', '籃球', '游泳', '健身房', '網球'].map(cat => (
            <button 
              key={cat}
              onClick={() => setFilter(cat)}
              className={cn(
                "px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors",
                filter === cat ? "bg-emerald-500 text-white" : "bg-white text-slate-500 border border-slate-100"
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {[
          { name: '中心體育公園羽毛球場', type: '公共', price: 30, rating: 4.8, img: 'badminton-court' },
          { name: '威爾士頂級健身會所', type: '私人', price: 120, rating: 4.9, img: 'luxury-gym' },
          { name: '奧體中心標準游泳館', type: '公共', price: 45, rating: 4.7, img: 'pool-indoor' },
          { name: '紅土網球俱樂部', type: '私人', price: 150, rating: 4.6, img: 'tennis-court' },
        ].map((venue, i) => (
          <div key={i} className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm group">
            <div className="h-40 bg-slate-200 relative">
              <img src={`https://picsum.photos/seed/${venue.img}/400/200`} alt={venue.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" referrerPolicy="no-referrer" />
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider text-slate-900">
                {venue.type}
              </div>
              <div className="absolute bottom-4 right-4 bg-emerald-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                ★ {venue.rating}
              </div>
            </div>
            <div className="p-5">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-bold text-slate-900">{venue.name}</h4>
                <div className="text-right">
                  <span className="text-emerald-600 font-bold text-lg">${venue.price}</span>
                  <span className="text-[10px] text-slate-400 ml-1">起</span>
                </div>
              </div>
              <p className="text-xs text-slate-500 mb-4">需支付 $20 訂金 · 隨時退改</p>
              <button className="w-full bg-slate-900 text-white font-bold py-3 rounded-2xl active:scale-95 transition-transform">
                立即預約
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PodsSection() {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2 mb-8">
        <h2 className="text-2xl font-display font-bold">共享智能健身艙</h2>
        <p className="text-slate-500 text-sm">打破限制，隨時隨地開啟私人健身空間</p>
      </div>

      <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden mb-8">
        <div className="relative z-10 flex flex-col items-center text-center">
          <div className="w-20 h-20 bg-emerald-500 rounded-3xl flex items-center justify-center mb-6 shadow-lg shadow-emerald-500/30 rotate-3">
            <QrCode size={40} />
          </div>
          <h3 className="text-xl font-bold mb-2">掃碼開啟健身艙</h3>
          <p className="text-slate-400 text-xs mb-8">當前計費：$0.5 / 分鐘</p>
          
          <button className="bg-white text-slate-900 font-bold px-8 py-4 rounded-2xl flex items-center gap-2 active:scale-95 transition-transform">
            <QrCode size={20} /> 立即掃碼支付
          </button>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-10 right-10 w-32 h-32 border border-white rounded-full" />
          <div className="absolute bottom-10 left-10 w-24 h-24 border border-white rounded-full" />
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="font-bold text-slate-900">附近健身艙</h4>
        {[
          { name: '萬象城 B1 區', status: '空閒', distance: '200m' },
          { name: '來福士廣場 3F', status: '使用中', distance: '450m' },
          { name: '中心城南門', status: '空閒', distance: '800m' },
        ].map((pod, i) => (
          <div key={i} className="flex justify-between items-center p-5 bg-white border border-slate-100 rounded-3xl shadow-sm">
            <div className="flex items-center gap-4">
              <div className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center",
                pod.status === '空閒' ? "bg-emerald-50 text-emerald-500" : "bg-slate-50 text-slate-400"
              )}>
                <Box size={20} />
              </div>
              <div>
                <div className="text-sm font-bold">{pod.name}</div>
                <div className="text-[10px] text-slate-400">距離您 {pod.distance}</div>
              </div>
            </div>
            <div className="text-right">
              <div className={cn(
                "text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-lg mb-1",
                pod.status === '空閒' ? "bg-emerald-50 text-emerald-600" : "bg-slate-50 text-slate-400"
              )}>
                {pod.status}
              </div>
              {pod.status === '空閒' && <button className="text-emerald-600 text-xs font-bold">預約</button>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function NearbySection() {
  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="space-y-2">
        <h2 className="text-2xl font-display font-bold">15 分鐘運動圈</h2>
        <p className="text-slate-500 text-sm">快速尋找身邊的運動場地</p>
      </div>

      <div className="flex-1 bg-slate-200 rounded-3xl relative overflow-hidden min-h-[300px]">
        {/* Mock Map Background */}
        <img 
          src="https://picsum.photos/seed/map/800/600" 
          alt="Map" 
          className="w-full h-full object-cover opacity-50 grayscale" 
          referrerPolicy="no-referrer"
        />
        
        {/* Mock Map Markers */}
        <div className="absolute top-1/4 left-1/3 -translate-x-1/2 -translate-y-1/2">
          <div className="relative">
            <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center text-white shadow-lg border-2 border-white animate-bounce">
              <MapPin size={16} />
            </div>
            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-white px-2 py-1 rounded-lg shadow-md whitespace-nowrap text-[10px] font-bold">
              您的位置
            </div>
          </div>
        </div>

        {[
          { top: '40%', left: '60%', name: '羽毛球館' },
          { top: '20%', left: '80%', name: '健身艙' },
          { top: '70%', left: '20%', name: '游泳池' },
        ].map((m, i) => (
          <div key={i} className="absolute" style={{ top: m.top, left: m.left }}>
            <div className="w-6 h-6 bg-slate-900 rounded-full flex items-center justify-center text-white shadow-lg border-2 border-white">
              <MapPin size={12} />
            </div>
          </div>
        ))}

        {/* Floating Controls */}
        <div className="absolute bottom-6 left-6 right-6 flex justify-between items-center">
          <button className="bg-white p-3 rounded-2xl shadow-lg text-slate-900">
            <Filter size={20} />
          </button>
          <div className="bg-white px-4 py-3 rounded-2xl shadow-lg flex items-center gap-3">
            <div className="w-2 h-2 bg-emerald-500 rounded-full" />
            <span className="text-xs font-bold">發現 8 個運動場所</span>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <h4 className="font-bold text-sm">最近的場所</h4>
        <div className="bg-white p-4 rounded-2xl border border-slate-100 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-500">
              <MapPin size={24} />
            </div>
            <div>
              <div className="text-sm font-bold">社區健身中心</div>
              <div className="text-[10px] text-slate-400">步行 5 分鐘 · 400m</div>
            </div>
          </div>
          <button className="bg-emerald-500 text-white p-2 rounded-xl">
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}

function EquipmentSection() {
  const [activeSubTab, setActiveSubTab] = useState<'rent' | 'recycle' | 'repair'>('rent');

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h2 className="text-2xl font-display font-bold">健身設備服務</h2>
        <div className="flex bg-slate-100 p-1 rounded-2xl">
          {(['rent', 'recycle', 'repair'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveSubTab(tab)}
              className={cn(
                "flex-1 py-2 rounded-xl text-xs font-bold transition-all",
                activeSubTab === tab ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"
              )}
            >
              {tab === 'rent' ? '租借' : tab === 'recycle' ? '回收' : '維修'}
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeSubTab}
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -10 }}
          transition={{ duration: 0.2 }}
        >
          {activeSubTab === 'rent' && (
            <div className="grid grid-cols-2 gap-4">
              {[
                { name: '專業家用跑步機', price: 15, img: 'treadmill-pro' },
                { name: '可調節啞鈴套裝', price: 5, img: 'dumbbells-set' },
                { name: '智能動感單車', price: 12, img: 'spinning-bike' },
                { name: '水阻划船機', price: 18, img: 'rowing-machine' },
              ].map((item, i) => (
                <div key={i} className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm">
                  <div className="h-32 bg-slate-100">
                    <img src={`https://picsum.photos/seed/${item.img}/300/200`} alt={item.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                  <div className="p-4">
                    <h5 className="font-bold text-xs mb-1 truncate">{item.name}</h5>
                    <div className="flex justify-between items-center">
                      <span className="text-emerald-600 font-bold text-sm">${item.price}<span className="text-[10px] text-slate-400 font-normal">/天</span></span>
                      <button className="bg-slate-900 text-white p-1.5 rounded-lg">
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeSubTab === 'recycle' && (
            <div className="space-y-6">
              <div className="bg-emerald-50 border border-emerald-100 rounded-3xl p-6 text-center">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                  <Heart className="text-emerald-500" size={32} />
                </div>
                <h4 className="font-bold text-emerald-900 mb-2">讓設備循環使用</h4>
                <p className="text-xs text-emerald-700 leading-relaxed">
                  回收您的二手健身設備，我們將進行專業翻新後再次投入市場，減少資源浪費。
                </p>
              </div>
              <div className="space-y-4">
                <h5 className="font-bold text-sm">回收流程</h5>
                <div className="space-y-3">
                  {[
                    { step: '1', title: '在線估價', desc: '上傳照片並填寫設備信息' },
                    { step: '2', title: '上門取件', desc: '專業人員免費上門檢測取貨' },
                    { step: '3', title: '獲得積分/現金', desc: '確認回收後立即發放獎勵' },
                  ].map((s, i) => (
                    <div key={i} className="flex gap-4 items-start">
                      <div className="w-6 h-6 bg-slate-900 text-white rounded-full flex items-center justify-center text-[10px] font-bold shrink-0">
                        {s.step}
                      </div>
                      <div>
                        <div className="text-sm font-bold">{s.title}</div>
                        <div className="text-xs text-slate-500">{s.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <button className="w-full bg-slate-900 text-white font-bold py-4 rounded-2xl mt-4">
                  立即預約回收
                </button>
              </div>
            </div>
          )}

          {activeSubTab === 'repair' && (
            <div className="space-y-6">
              <div className="bg-orange-50 border border-orange-100 rounded-3xl p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                    <Wrench className="text-orange-500" size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-orange-900">專業維修服務</h4>
                    <p className="text-[10px] text-orange-700">延長您的健身產品使用壽命</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {['跑步機維修', '橢圓機保養', '動感單車調試', '綜合器械維修'].map(s => (
                    <div key={s} className="bg-white/50 p-2 rounded-xl text-[10px] font-bold text-orange-800 border border-orange-200/50">
                      • {s}
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-4">
                <h5 className="font-bold text-sm">預約維修</h5>
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">設備類型</label>
                    <select className="w-full bg-white border border-slate-100 rounded-xl p-3 text-sm focus:outline-none">
                      <option>請選擇設備類型</option>
                      <option>跑步機</option>
                      <option>動感單車</option>
                      <option>其他</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">故障描述</label>
                    <textarea 
                      placeholder="請簡單描述故障情況..." 
                      className="w-full bg-white border border-slate-100 rounded-xl p-3 text-sm h-24 focus:outline-none"
                    />
                  </div>
                  <button className="w-full bg-slate-900 text-white font-bold py-4 rounded-2xl">
                    提交維修申請
                  </button>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
