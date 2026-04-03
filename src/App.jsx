import React, { useState, useEffect } from 'react';
import { 
  Star, 
  MessageSquare, 
  TrendingUp, 
  AlertCircle, 
  Send, 
  Users, 
  CheckCircle, 
  Settings,
  BarChart2,
  Zap,
  Loader2,
  Mail,
  Smartphone,
  DollarSign,
  Lock,
  Unlock,
  UserPlus,
  Facebook,
  RefreshCw,
  CreditCard
} from 'lucide-react';

// ==========================================
// CEO CONFIGURATION VAULT
// ==========================================
const API_CONFIG = {
  automationWebhook: import.meta.env.VITE_AUTOMATION_WEBHOOK || "",
  sentimentWebhook: import.meta.env.VITE_SENTIMENT_WEBHOOK || "",
  googleSheetsDataUrl: import.meta.env.VITE_SHEETS_URL || "https://script.google.com/macros/s/AKfycbzBb4TMzdu_L90o9mNm3pKUxFZUMbFZJIx0MQG0_IbDGxT4ieCMly-6RvHInP2OZtLj/exec",
  nurtureWebhook: import.meta.env.VITE_NURTURE_WEBHOOK || "",
  fbScraperWebhook: import.meta.env.VITE_FB_SCRAPER_WEBHOOK || "",
  paymentLink: "https://gumroad.com/l/your-product-id",
  accessCode: import.meta.env.VITE_ACCESS_CODE || "LEGACY2024"
};

const BrandColors = {
  orange: '#F18B25',
  blue: '#47B7D4',
  red: '#C20F0A',
  bg: '#FFFCF9',
  card: '#FFFFFF',
  text: '#2D3748',
  black: '#000000'
};

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [inputCode, setInputCode] = useState("");
  const [activeTab, setActiveTab] = useState('dashboard');
  const [reviews, setReviews] = useState([]);
  const [leads, setLeads] = useState([]);
  const [fbLeads, setFbLeads] = useState([]);
  const [payments, setPayments] = useState([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [error, setError] = useState(null);

  const handleLogin = (e) => {
    e.preventDefault();
    if (inputCode.toUpperCase() === API_CONFIG.accessCode) {
      setIsAuthenticated(true);
    } else {
      alert("Invalid Access Code. Check your Gumroad receipt.");
    }
  };

  const fetchLiveStats = async () => {
    if (!isAuthenticated || !API_CONFIG.googleSheetsDataUrl) return;
    setIsSyncing(true);
    setError(null);
    try {
      const response = await fetch(API_CONFIG.googleSheetsDataUrl);
      if (!response.ok) throw new Error('Vault unreachable.');
      const data = await response.json();
      if (data.reviews) setReviews(data.reviews);
      if (data.leads) setLeads(data.leads);
      if (data.fbLeads) setFbLeads(data.fbLeads);
      if (data.payments) setPayments(data.payments);
    } catch (error) {
      console.error("Vault Sync Failed", error);
      setError("Sync Interrupted. Ensure the Apps Script is deployed to 'Anyone'.");
    } finally {
      setIsSyncing(false);
    }
  };

  useEffect(() => {
    fetchLiveStats();
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6" style={{ backgroundColor: BrandColors.bg }}>
        <div className="max-w-md w-full border-[1px] border-black p-10 bg-white">
          <h1 className="text-3xl font-bold mb-2 uppercase font-heading tracking-tighter text-black">
            Digitally<span className="italic" style={{ color: BrandColors.orange }}>Defined.</span>
          </h1>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] mb-10 opacity-60 text-black text-center">Private Access: Authorized Personnel Only</p>
          <form onSubmit={handleLogin} className="space-y-8">
            <input 
              type="text" 
              className="w-full border-[1px] border-black p-4 text-sm font-medium uppercase focus:outline-none focus:border-orange-500" 
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value)}
              placeholder="ENTER ACCESS CODE"
            />
            <button type="submit" className="w-full py-4 bg-black text-white font-bold uppercase tracking-widest border-[1px] border-black hover:bg-[#F18B25] transition-colors">
              Unlock Empire
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen font-body flex flex-col md:flex-row" style={{ backgroundColor: BrandColors.bg, color: BrandColors.text }}>
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Inter:wght@700;800&display=swap');
        .font-heading { font-family: 'Inter', sans-serif; font-weight: 800; }
        .font-body { font-family: 'DM Sans', sans-serif; }
        .thin-frame { border: 1px solid #000000; background-color: #FFFFFF; border-radius: 0px; }
        .action-btn { border: 1px solid #000000; transition: all 0.2s ease; font-weight: 700; text-transform: uppercase; cursor: pointer; display: inline-flex; align-items: center; justify-content: center; border-radius: 0px; padding: 0.75rem 1.5rem; font-size: 10px; tracking: 0.1em; }
        .action-btn:hover { background-color: #000; color: #fff; }
        .nav-active { background-color: #000 !important; color: white !important; }
      `}} />

      <aside className="w-full md:w-80 border-r-[1px] border-black p-10 flex flex-col bg-white">
        <div className="mb-16">
          <h1 className="text-2xl font-heading tracking-tighter leading-none uppercase text-black">
            Digitally<span className="italic" style={{ color: BrandColors.orange }}>Defined.</span>
          </h1>
          <div className="mt-6 p-4 border-[1px] border-black bg-gray-50 flex items-center justify-between">
            <div className="flex items-center space-x-2">
               <span className={`h-2 w-2 rounded-full ${isSyncing ? 'bg-orange-500 animate-pulse' : 'bg-green-500'}`}></span>
               <span className="text-[9px] font-bold uppercase tracking-widest">{isSyncing ? 'Syncing' : 'Live'}</span>
            </div>
            <button onClick={fetchLiveStats} className={`transition-transform duration-500 ${isSyncing ? 'animate-spin' : ''}`}>
              <RefreshCw size={12} />
            </button>
          </div>
        </div>

        <nav className="flex-1 space-y-2">
          <NavItem active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} icon={<BarChart2 size={18} />} label="Operational Overview" />
          <NavItem active={activeTab === 'fb-leads'} onClick={() => setActiveTab('fb-leads')} icon={<Facebook size={18} />} label="FB Group Vault" />
          <NavItem active={activeTab === 'leads'} onClick={() => setActiveTab('leads')} icon={<Users size={18} />} label="Sales Pipeline" />
          <NavItem active={activeTab === 'sentiment'} onClick={() => setActiveTab('sentiment')} icon={<MessageSquare size={18} />} label="Reputation" />
          <NavItem active={activeTab === 'revenue'} onClick={() => setActiveTab('revenue')} icon={<CreditCard size={18} />} label="Revenue" />
        </nav>

        <div className="mt-auto pt-10 border-t-[1px] border-black">
          <p className="text-[9px] font-bold uppercase opacity-30 mb-4">Operator: F. LaVigne</p>
          <button onClick={() => setIsAuthenticated(false)} className="w-full py-3 action-btn text-[10px]">Logout</button>
        </div>
      </aside>

      <main className="flex-1 p-8 md:p-20 overflow-y-auto">
        {error && (
          <div className="mb-8 p-4 border-[1px] border-red-600 bg-red-50 text-red-600 text-xs font-bold uppercase flex items-center space-x-3">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}
        {activeTab === 'dashboard' && <DashboardView reviews={reviews} fbLeads={fbLeads} payments={payments} />}
        {activeTab === 'fb-leads' && <FBLeadsView fbLeads={fbLeads} />}
        {activeTab === 'leads' && <LeadsView leads={leads} />}
        {activeTab === 'sentiment' && <SentimentView reviews={reviews} />}
        {activeTab === 'revenue' && <RevenueView payments={payments} />}
      </main>
    </div>
  );
}

function NavItem({ active, icon, label, onClick }) {
  return (
    <button onClick={onClick} className={`w-full flex items-center space-x-4 px-6 py-4 border-[1px] border-transparent font-heading uppercase text-[11px] tracking-[0.15em] transition-all text-left ${active ? 'nav-active' : 'hover:border-black'}`}>
      {icon} <span>{label}</span>
    </button>
  );
}

function DashboardView({ reviews, fbLeads, payments }) {
  const totalRev = payments.reduce((acc, curr) => {
    const val = curr.amount ? String(curr.amount).replace(/[^0-9.]/g, '') : '0';
    return acc + (parseFloat(val) || 0);
  }, 0);

  return (
    <div className="space-y-16 animate-in fade-in duration-700">
      <div className="thin-frame p-12">
        <h2 className="text-6xl font-heading uppercase italic tracking-tighter mb-4 text-black leading-none">Market Assets.</h2>
        <p className="text-xl opacity-70 font-medium">Real-time intelligence for the Digitally Defined legacy.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-black">
        <StatCard label="Community Growth" value={fbLeads.length} sub="Group Members" />
        <StatCard label="Sales Pipeline" value={reviews.length} sub="Customer Reviews" />
        <StatCard label="Managed Revenue" value={`$${totalRev.toLocaleString()}`} sub="Gross Volume" />
      </div>
    </div>
  );
}

function StatCard({ label, value, sub }) {
  return (
    <div className="p-10 thin-frame">
      <h4 className="text-[9px] font-bold uppercase tracking-[0.3em] mb-4 opacity-40">{label}</h4>
      <span className="text-6xl font-heading tracking-tighter leading-none">{value}</span>
      <p className="text-[10px] font-bold uppercase mt-4 opacity-60 tracking-widest">{sub}</p>
    </div>
  );
}

function FBLeadsView({ fbLeads }) {
  return (
    <div className="space-y-12">
      <h2 className="text-4xl font-heading uppercase italic tracking-tighter text-black">FB Group Vault</h2>
      <div className="space-y-4">
        {fbLeads.length === 0 ? <EmptyState text="No community data detected in Master Vault." /> : 
          fbLeads.map((l, i) => (
            <div key={i} className="p-8 thin-frame flex justify-between items-center bg-white hover:bg-gray-50 transition-colors">
              <div>
                <p className="font-heading text-xl uppercase mb-1 text-black">{l.memberName || l.name}</p>
                <p className="text-[10px] font-bold opacity-50 uppercase tracking-widest">{l.email || "No Email Provided"}</p>
                <p className="text-xs italic mt-2 opacity-70">"Struggle: {l.answeredQuestions || 'General'}"</p>
              </div>
              <div className="flex space-x-3">
                <button className="action-btn">Welcome SMS</button>
                <button className="action-btn bg-black text-white px-4"><Zap size={14} /></button>
              </div>
            </div>
          ))
        }
      </div>
    </div>
  );
}

function LeadsView({ leads }) {
  return (
    <div className="space-y-12">
       <h2 className="text-4xl font-heading uppercase italic tracking-tighter text-black">Sales Pipeline</h2>
       <div className="space-y-4">
         {leads.length === 0 ? <EmptyState text="Waiting for Lead Magnet trigger..." /> : 
           leads.map((l, i) => (
           <div key={i} className="p-8 thin-frame flex justify-between items-center hover:bg-gray-50">
             <div>
               <p className="font-heading text-2xl uppercase tracking-tight mb-1 text-black">{l.prospectName || l.name}</p>
               <p className="text-[10px] font-bold opacity-50 uppercase tracking-widest">{l.email}</p>
               <p className="text-[10px] mt-2 font-bold uppercase text-orange-500">{l.assetDownloaded || "Digital Asset Interest"}</p>
             </div>
             <button className="action-btn">Nurture Flow</button>
           </div>
         ))}
       </div>
    </div>
  );
}

function SentimentView({ reviews }) {
  return (
    <div className="space-y-12">
       <h2 className="text-4xl font-heading uppercase italic tracking-tighter text-black">Reputation Intelligence</h2>
       <div className="space-y-8">
         {reviews.length === 0 ? <EmptyState text="No reviews found in vault." /> : 
           reviews.map((r, i) => (
           <div key={i} className="p-10 thin-frame">
             <div className="flex justify-between items-start mb-6">
               <p className="font-heading text-xl uppercase text-black">{r.name}</p>
               <span className="text-[10px] font-bold uppercase tracking-widest border-b-[1px] border-black">Verified {r.rating}/5 Rating</span>
             </div>
             <p className="text-lg italic font-medium border-l-[1px] border-black pl-8 py-2 opacity-80 leading-relaxed text-black">"{r.reviewText || r.text}"</p>
             <button className="action-btn mt-8">Draft AI Sentinel Reply</button>
           </div>
         ))}
       </div>
    </div>
  );
}

function RevenueView({ payments }) {
  return (
    <div className="space-y-12">
      <h2 className="text-4xl font-heading uppercase italic tracking-tighter text-black">Revenue Vault</h2>
      <div className="thin-frame overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-black text-white text-[10px] font-bold uppercase tracking-widest">
            <tr>
              <th className="p-6">Client</th>
              <th className="p-6">Asset</th>
              <th className="p-6">Amount</th>
              <th className="p-6">Status</th>
            </tr>
          </thead>
          <tbody className="text-[11px] font-bold uppercase tracking-tight text-black">
            {payments.length === 0 ? (
                <tr><td colSpan="4" className="p-10 text-center opacity-30">No payments recorded.</td></tr>
            ) : payments.map((p, i) => (
              <tr key={i} className="border-t-[1px] border-black hover:bg-gray-50 transition-colors">
                <td className="p-6 font-bold">{p.customer || "Anonymous"}</td>
                <td className="p-6 opacity-70">{p.product || "Legacy Package"}</td>
                <td className="p-6 text-orange-600 font-bold tracking-tighter">{p.amount}</td>
                <td className="p-6">
                    <span className="px-3 py-1 bg-black text-white text-[9px] font-bold uppercase tracking-widest">
                        {p.status || "PAID"}
                    </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function EmptyState({ text }) {
  return <p className="opacity-30 uppercase text-[11px] font-bold tracking-[0.2em]">{text}</p>;
}
