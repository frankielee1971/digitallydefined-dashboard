import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, FolderHeart, Settings,
  DollarSign, X, RefreshCw,
  BarChart3, MessageSquare, ShieldCheck, ArrowUpRight, 
  BrainCircuit, Star, ShieldAlert, Users,
  TrendingUp, Magnet
} from 'lucide-react';

const DEFAULT_SHEETS_URL = "https://script.google.com/macros/s/AKfycbwEyg9UPQrxOgNVhkzGWRZAULMkjE4rCQhAKuYUoAoPEG1bCr0xU74X8dRRuyV53ARk/exec";
const googleSheetsDataUrl = import.meta.env.VITE_SHEETS_URL || DEFAULT_SHEETS_URL;
const tabs = [
  { id: 'dashboard', icon: LayoutDashboard, label: 'COMMAND' },
  { id: 'reputation', icon: ShieldCheck, label: 'REPUTATION' },
  { id: 'intel', icon: BarChart3, label: 'INTEL' },
  { id: 'brain', icon: BrainCircuit, label: 'THE BRAIN' },
];

const App = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showSettings, setShowSettings] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSync, setLastSync] = useState(null);
  const [syncError, setSyncError] = useState('');

  // --- DATA STATE (MAPPED TO YOUR SCREENSHOT) ---
  const [rawData, setRawData] = useState({ 
    reviews: [], 
    competitors: [], 
    community: [], 
    leadMagnets: [],
    payments: [],
    campaigns: [] 
  });

  const [stats, setStats] = useState({
    assetValue: "$0",
    activeLeads: "0",
    siteHealth: "100%",
    avgSentiment: "Stable"
  });

  // --- STORAGE ---
  const getStored = (key) => localStorage.getItem(key) || '';
  const [openRouterKey, setOpenRouterKey] = useState(getStored('openRouterKey'));

  const parseCurrencyAmount = (value) => {
    const normalized = String(value ?? '').replace(/[^0-9.-]/g, '');
    return Number.parseFloat(normalized) || 0;
  };

  // --- THE DATA ENGINE ---
  const syncEmpireData = async () => {
    setIsSyncing(true);
    setSyncError('');
    try {
      const response = await fetch(googleSheetsDataUrl);
      if (!response.ok) {
        throw new Error(`Vault sync failed with status ${response.status}`);
      }
      const data = await response.json();
      setRawData(data);
      
      // Calculate real-time stats from the vault
      const totalRev = data.payments?.reduce((acc, curr) => acc + parseCurrencyAmount(curr.amount), 0) || 0;
      const totalLeads = (data.community?.length || 0) + (data.leadMagnets?.length || 0);
      
      setStats({
        assetValue: `$${totalRev.toLocaleString()}`,
        activeLeads: totalLeads.toLocaleString(),
        siteHealth: "100%",
        avgSentiment: data.reviews?.length > 0 ? "Positive" : "Stable"
      });

      setLastSync(new Date().toLocaleTimeString());
    } catch (error) {
      console.error("Vault Connection Failed:", error);
      setSyncError('Sync interrupted. Check the Sheets URL or Apps Script permissions.');
    }
    setIsSyncing(false);
  };

  useEffect(() => { syncEmpireData(); }, []);

  const style = {
    card: "bg-white border-[1px] border-black p-6 md:p-8 rounded-none h-full transition-all hover:bg-[#F18B25]/5",
    input: "border-[1px] border-black p-4 focus:outline-none focus:border-[#F18B25] rounded-none text-lg w-full font-medium bg-white",
    btnPrimary: "bg-[#F18B25] text-white border-[1px] border-black hover:bg-black transition-all font-bold rounded-none text-sm px-6 py-3 uppercase tracking-[0.2em]",
    headline: { fontFamily: "'Inter', sans-serif" }
  };

  // --- SUB-COMPONENT: MARKET INTEL ---
  const MarketIntel = () => (
    <div className="space-y-8 animate-in slide-in-from-bottom duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className={style.card}>
          <h3 className="text-xl font-black uppercase italic mb-8 flex items-center gap-3">
            <TrendingUp size={24} className="text-[#47B7D4]" /> Market Positioning
          </h3>
          <div className="space-y-4">
            {rawData.competitors?.length > 0 ? rawData.competitors.map((comp, i) => (
              <div key={i} className="border-[1px] border-black p-4 flex justify-between items-center">
                <div>
                  <p className="font-bold uppercase text-sm">{comp.businessName || comp.name}</p>
                  <p className="text-[10px] opacity-50 uppercase tracking-widest">{comp.reviewCount || 0} Reviews</p>
                </div>
                <div className="text-right">
                  <p className="font-black text-[#F18B25]">{comp.marketShare || 'N/A'}</p>
                  <p className="text-[9px] font-bold uppercase opacity-30">Share</p>
                </div>
              </div>
            )) : <p className="opacity-40 italic text-sm">No competitor intel logged yet.</p>}
          </div>
        </div>

        <div className={style.card}>
          <h3 className="text-xl font-black uppercase italic mb-8 flex items-center gap-3">
            <Magnet size={24} className="text-[#F18B25]" /> Asset Attraction
          </h3>
          <div className="space-y-4">
            {rawData.leadMagnets?.length > 0 ? rawData.leadMagnets.map((magnet, i) => (
              <div key={i} className="border-[1px] border-black p-4 flex justify-between items-center bg-gray-50">
                <div>
                  <p className="font-bold uppercase text-sm">{magnet.prospectName || magnet.name}</p>
                  <p className="text-[10px] font-medium text-[#47B7D4] uppercase">{magnet.assetDownloaded || magnet.asset}</p>
                </div>
                <span className={`text-[9px] font-bold px-2 py-1 border border-black uppercase ${magnet.nurtureLevel === 'Hot' ? 'bg-red-500 text-white' : 'bg-orange-200'}`}>
                  {magnet.nurtureLevel || 'New'}
                </span>
              </div>
            )) : <p className="opacity-40 italic text-sm">No lead magnet data synced.</p>}
          </div>
        </div>
      </div>
    </div>
  );

  // --- SUB-COMPONENT: REPUTATION MANAGER ---
  const ReputationManager = () => (
    <div className="space-y-8 animate-in slide-in-from-bottom duration-500">
      <div className={style.card}>
        <h3 className="text-xl font-black uppercase italic mb-8 flex items-center gap-3">
          <ShieldAlert size={24} className="text-[#C20F0A]" /> Reputation Triage
        </h3>
        <div className="space-y-4">
          {rawData.reviews?.length > 0 ? rawData.reviews.map((rev, i) => (
            <div key={i} className="border-[1px] border-black p-6 flex flex-col md:flex-row justify-between gap-6 hover:bg-gray-50">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Star size={14} className="text-yellow-500 fill-yellow-500" />
                  <span className="font-bold uppercase text-xs">{rev.name}</span>
                  <span className={`text-[9px] px-2 py-0.5 border border-black uppercase font-bold ${rev.sentiment === 'Negative' ? 'bg-red-500 text-white' : 'bg-green-500 text-white'}`}>
                    {rev.sentiment || 'Analyzing'}
                  </span>
                </div>
                <p className="text-sm italic text-gray-600 mb-4">"{rev.reviewText || rev.text}"</p>
                <div className="bg-gray-100 p-4 border-l-4 border-[#F18B25]">
                  <p className="text-[10px] font-bold uppercase mb-1">AI Strategic Reply:</p>
                  <p className="text-sm font-medium">{rev.aiDraftedResponse || "Awaiting Analysis..."}</p>
                </div>
              </div>
              <button className={style.btnPrimary + " h-fit self-center"}>Deploy Reply</button>
            </div>
          )) : <p className="text-center py-12 opacity-40">No reviews found in your Vault.</p>}
        </div>
      </div>
    </div>
  );

  // --- SUB-COMPONENT: DASHBOARD / COMMAND ---
  const CommandTab = () => (
    <div className="space-y-10 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Asset Value", val: stats.assetValue, icon: DollarSign, color: "bg-green-50" },
          { label: "Community", val: stats.activeLeads, icon: Users, color: "bg-[#47B7D4]/10" },
          { label: "System Health", val: stats.siteHealth, icon: ShieldCheck, color: "bg-[#F18B25]/10" },
          { label: "Sent. Index", val: stats.avgSentiment, icon: MessageSquare, color: "bg-red-50" },
        ].map((s, i) => (
          <div key={i} className={style.card}>
            <div className="flex justify-between items-start mb-6">
              <div className={`p-2 border-[1px] border-black ${s.color}`}>
                <s.icon size={18} />
              </div>
              <ArrowUpRight size={14} className="opacity-30" />
            </div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#2D3748]/50 mb-1">{s.label}</p>
            <p className="font-bold text-4xl text-[#2D3748]" style={style.headline}>{s.val}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className={style.card}>
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-lg font-bold uppercase italic flex items-center gap-3"><FolderHeart size={20} /> Live Community Feed</h3>
              <button onClick={syncEmpireData} className="text-[10px] font-bold border-b-[1px] border-black pb-1 uppercase flex items-center gap-2">
                <RefreshCw size={10} className={isSyncing ? "animate-spin" : ""} />
                {isSyncing ? "Syncing..." : `Last Sync: ${lastSync || 'Now'}`}
              </button>
            </div>
            <div className="space-y-3">
              {rawData.community?.length > 0 ? rawData.community.slice(0, 5).map((member, i) => (
                <div key={i} className="border-[1px] border-black p-4 flex items-center justify-between group hover:bg-[#2D3748] hover:text-white transition-all">
                  <div className="flex items-center gap-4">
                    <span className="text-xs font-bold opacity-30 italic">0{i+1}</span>
                    <div>
                      <p className="font-bold uppercase text-sm">{member.memberName || member.name || "Anonymous"}</p>
                      <p className="text-[10px] opacity-60 uppercase tracking-widest">{member.joinedDate || "Recent Join"}</p>
                    </div>
                  </div>
                  <span className="text-[9px] font-bold px-2 py-1 border-[1px] border-black group-hover:border-white uppercase">{member.status || "Syncing"}</span>
                </div>
              )) : <p className="opacity-40 italic text-sm py-8 text-center uppercase tracking-widest">Awaiting Community Sync...</p>}
            </div>
          </div>
        </div>
        <div className="bg-[#2D3748] text-white p-8 border-[1px] border-black flex flex-col justify-between">
           <h4 className="font-bold uppercase text-[10px] tracking-[0.3em] text-[#F18B25] mb-4">Strategic Intel</h4>
           <div className="mb-8">
              {rawData.campaigns?.length > 0 ? (
                <div>
                  <p className="text-xl font-black italic uppercase text-[#47B7D4]">{rawData.campaigns[0].campaignName}</p>
                  <p className="text-sm opacity-70 mt-2">Conversion: <span className="text-white font-bold">{rawData.campaigns[0].conversionRate}</span></p>
                </div>
              ) : (
                <p className="text-lg font-medium italic">"Your campaigns are being prepared. No excuses. Keep building."</p>
              )}
           </div>
           <button onClick={() => setActiveTab('intel')} className="text-[10px] font-bold border-b border-white/30 uppercase tracking-widest hover:text-[#F18B25] w-fit">Full Intel Briefing →</button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen w-full bg-[#FFFCF9] text-[#2D3748] overflow-hidden font-sans">
      <div className="fixed top-0 inset-x-0 z-30 border-b-[1px] border-black bg-white p-4 md:hidden">
        <div className="flex items-center justify-between gap-4">
          <div className="text-sm font-black tracking-tighter">
            DIGITALLY<span className="text-[#F18B25] italic uppercase">DEFINED</span>
          </div>
          <button
            onClick={() => setShowSettings(true)}
            className="flex items-center gap-2 border-[1px] border-black px-3 py-2 text-[10px] font-bold uppercase tracking-widest"
          >
            <Settings size={14} /> Keys
          </button>
        </div>
        <nav className="mt-4 grid grid-cols-2 gap-2">
          {tabs.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center justify-center gap-2 px-3 py-3 font-bold border-[1px] uppercase text-[10px] tracking-widest ${
                activeTab === item.id ? "bg-[#2D3748] text-white border-black" : "border-black bg-white"
              }`}
            >
              <item.icon size={14} /> {item.label}
            </button>
          ))}
        </nav>
      </div>
      <aside className="w-64 border-r-[1px] border-black flex flex-col justify-between bg-white z-20 hidden md:flex">
        <div className="p-6">
          <div className="text-lg font-black tracking-tighter border-[1px] border-black p-4 bg-white mb-12">
            DIGITALLY<span className="text-[#F18B25] italic uppercase">DEFINED</span>
          </div>
          <nav className="space-y-1">
            {tabs.map((item) => (
              <button key={item.id} onClick={() => setActiveTab(item.id)} className={`w-full flex items-center gap-4 px-5 py-4 font-bold border-[1px] transition-all uppercase text-[10px] tracking-widest ${activeTab === item.id ? "bg-[#2D3748] text-white border-black" : "border-transparent hover:border-black"}`}>
                <item.icon size={16} /> {item.label}
              </button>
            ))}
          </nav>
        </div>
        <div className="p-6 border-t-[1px] border-black">
          <button onClick={() => setShowSettings(true)} className="w-full flex items-center gap-4 px-4 py-3 font-bold border-[1px] border-black hover:bg-black hover:text-white transition-all uppercase text-[10px] tracking-widest">
            <Settings size={14} /> System Keys
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto p-8 pt-44 md:p-12 md:pt-12 lg:p-16">
        <header className="max-w-6xl mx-auto mb-16">
          <p className="text-[9px] font-bold text-[#F18B25] uppercase tracking-[0.4em] mb-2">Proprietary OS v1.5</p>
          <h2 className="text-5xl font-black tracking-tighter uppercase italic text-[#2D3748]">
            {activeTab === 'dashboard' ? 'Own Your Power.' : activeTab.toUpperCase()}
          </h2>
        </header>
        <div className="max-w-6xl mx-auto">
          {syncError && (
            <div className="mb-8 border-[1px] border-[#C20F0A] bg-red-50 px-4 py-3 text-[11px] font-bold uppercase tracking-[0.15em] text-[#C20F0A]">
              {syncError}
            </div>
          )}
          {activeTab === 'dashboard' && <CommandTab />}
          {activeTab === 'reputation' && <ReputationManager />}
          {activeTab === 'intel' && <MarketIntel />}
          {activeTab === 'brain' && (
             <div className="py-20 text-center border-2 border-dashed border-black">
                <p className="uppercase font-black italic text-4xl opacity-10 mb-4">The Brain</p>
                <p className="text-xs uppercase tracking-widest font-bold">Automation Logic Under Construction</p>
             </div>
          )}
        </div>
      </main>

      {showSettings && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-white/90 backdrop-blur-sm">
          <div className="bg-white border-[1px] border-black p-8 md:p-12 max-w-xl w-full relative">
            <button onClick={() => setShowSettings(false)} className="absolute top-6 right-6 hover:rotate-90 transition-all"><X size={24}/></button>
            <h3 className="text-2xl font-black uppercase mb-8 italic">Configuration</h3>
            <label className="text-[9px] font-bold uppercase mb-1 block tracking-widest text-gray-400">OpenRouter AI Key</label>
            <input type="password" value={openRouterKey} onChange={(e) => setOpenRouterKey(e.target.value)} className={style.input} placeholder="sk-..." />
            <button onClick={() => { localStorage.setItem('openRouterKey', openRouterKey); setShowSettings(false); }} className={style.btnPrimary + " w-full mt-6"}>Save System Keys</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
