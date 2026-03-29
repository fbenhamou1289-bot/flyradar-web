import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Search, MapPin, Target, Crown, X, Calendar, Radar, Plane, Star, CheckCircle2, Zap, HelpCircle } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

const AIRLINE_MAP = {
  'AF': 'Air France', 'MU': 'China Eastern', 'CA': 'Air China', 'QR': 'Qatar Airways',
  'EK': 'Emirates', 'EY': 'Etihad Airways', 'LH': 'Lufthansa', 'BA': 'British Airways',
  'LX': 'Swiss International', 'OS': 'Austrian Airlines', 'TK': 'Turkish Airlines',
  'TP': 'TAP Air Portugal', 'IB': 'Iberia', 'AZ': 'ITA Airways', 'UX': 'Air Europa',
  'AC': 'Air Canada', 'TS': 'Air Transat', 'DL': 'Delta Airlines', 'KL': 'KLM',
  'LO': 'LOT Polish Airlines', 'SN': 'Brussels Airlines', 'SK': 'SAS Scandinavian',
  'AY': 'Finnair', 'EI': 'Aer Lingus', 'A3': 'Aegean Airlines', 'MF': 'Xiamen Airlines', 'AV': 'Avianca',
  'SV': 'Saudia', 'VF': 'AJet', 'FZ': 'flydubai', 'WY': 'Oman Air', 'GF': 'Gulf Air', 'RJ': 'Royal Jordanian',
  'TR': 'Scoot', 'PC': 'Pegasus', 'SQ': 'Singapore Airlines', 'VN': 'Vietnam Airlines', 'AI': 'Air India', 
  'TG': 'Thai Airways', 'CX': 'Cathay Pacific', 'JL': 'Japan Airlines', 'NH': 'ANA', 'KE': 'Korean Air',
  'BF': 'French Bee', 'UU': 'Air Austral', 'SS': 'Corsair', 'TX': 'Air Caraïbes', 'DE': 'Condor', 
  'VR': 'Cabo Verde Airlines', 'TB': 'TUI fly Belgium', 'OR': 'TUI fly Netherlands', 'X3': 'TUI fly Deutschland', 'BY': 'TUI Airways UK',
  'VY': 'Vueling', 'U2': 'easyJet', 'FR': 'Ryanair', 'W6': 'Wizz Air', 'TO': 'Transavia', 'V7': 'Volotea', 
  'N0': 'Norse Atlantic', 'MW': 'Malta Air (Ryanair)', 'RK': 'Ryanair UK', 'W4': 'Wizz Air Malta',
  'RR': 'Ryanair Sun (Buzz)', 'LW': 'Lauda Europe', 'UA': 'United Airlines', 'AA': 'American Airlines',
  'F9': 'Frontier Airlines', 'NK': 'Spirit Airlines', 'HO': 'Juneyao Airlines'
};

export default function VolsPasChers() {
  const navigate = useNavigate();
  const location = useLocation(); 

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsGoldUser(false);
    setIsAuthenticated(false);
    localStorage.clear(); 
    navigate('/');
  };

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isGoldUser, setIsGoldUser] = useState(false);
  const [showVipModal, setShowVipModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  
  // -- ÉTAT POUR MOBILE --
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  
  const [vipAirports, setVipAirports] = useState([]);
  
  const availableAirports = [
    { id: 'PAR', name: 'Paris (CDG/ORY)' },
    { id: 'LYS', name: 'Lyon (LYS)' },
    { id: 'NCE', name: 'Nice (NCE)' },
    { id: 'MRS', name: 'Marseille (MRS)' },
    { id: 'TLS', name: 'Toulouse (TLS)' },
    { id: 'BOD', name: 'Bordeaux (BOD)' },
    { id: 'GVA', name: 'Genève (GVA)' },
    { id: 'BRU', name: 'Bruxelles (BRU)' }
  ];

  const toggleAirport = (airportId) => {
    setVipAirports(prev => 
      prev.includes(airportId) ? prev.filter(id => id !== airportId) : [...prev, airportId]
    );
  };

  const saveVipAlerts = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const userEmail = session.user.email.toLowerCase();

      const { error } = await supabase
        .from('Users')
        .upsert({ 
          email: userEmail, 
          selected_airports: vipAirports,
          is_gold: true 
        }, { onConflict: 'email' });

      if (error) throw error;

      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000); 
      setShowVipModal(false);
    } catch (err) {
      console.error("Erreur:", err);
    }
  };

  const [activeDeals, setActiveDeals] = useState([]);
  const [lastUpdateTxt, setLastUpdateTxt] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDeal, setSelectedDeal] = useState(null);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [budget, setBudget] = useState(2000);
  const [departure, setDeparture] = useState('all'); 
  const [activeRegion, setActiveRegion] = useState('all');
  const [dealFilters, setDealFilters] = useState({ good: true, super: true, rare: true });
  const [emailInput, setEmailInput] = useState('');

  const handleSubscribe = async () => {
    if (!emailInput.includes('@')) return alert("Email invalide");
    
    const emailClean = emailInput.toLowerCase().trim();
    const secretPassword = "FlyRadar_User_2026!"; 

    let { error: authError } = await supabase.auth.signUp({
      email: emailClean,
      password: secretPassword,
    });

    if (authError && authError.message.includes('already registered')) {
      await supabase.auth.signInWithPassword({
        email: emailClean,
        password: secretPassword,
      });
    }

    await supabase.from('Users').upsert({ 
      email: emailClean 
    }, { onConflict: 'email' });
    
    setIsAuthenticated(true);
  };

  useEffect(() => {
    if (location.state?.openVipModal) {
      setShowVipModal(true);
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  useEffect(() => {
    async function fetchDeals() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        let isActuallyGold = false; 

        if (session) {
          setIsAuthenticated(true); 

          const { data: userData } = await supabase
            .from('Users')
            .select('selected_airports, is_gold')
            .eq('email', session.user.email)
            .maybeSingle();
          
          if (userData) {
            isActuallyGold = userData.is_gold === true;
            setIsGoldUser(isActuallyGold); 
            
            if (userData.selected_airports) {
              setVipAirports(userData.selected_airports);
            }
          }
        } else {
          setIsAuthenticated(false);
        }

        const { data, error } = await supabase.from('Flights').select('*');
        if (error) throw error;
        
        // CORRECTION 1 : On groupe par Destination ET par Aéroport de départ
        const grouped = data.reduce((acc, flight) => {
          const key = `${flight.destination_code}_${flight.origine_code}`;
          if (!acc[key]) {
            acc[key] = { 
              ...flight, 
              all_origins: [flight.origine_code], 
              all_flights: [flight] 
            };
          } else {
            if (!acc[key].all_origins.includes(flight.origine_code)) {
              acc[key].all_origins.push(flight.origine_code);
            }
            acc[key].all_flights.push(flight); 
            
            if (flight.price < acc[key].price) {
              acc[key].price = flight.price;
              acc[key].discount = flight.discount;
              acc[key].deal_score = flight.deal_score;
              acc[key].image_url = flight.image_url || acc[key].image_url;
              acc[key].airline = flight.airline; 
            }
          }
          return acc;
        }, {});

        const formatted = Object.values(grouped).map(d => {
          const discountVal = Math.round(((d.average_price - d.price) / d.average_price) * 100);
          
          let type = 'good';
          if (discountVal >= 50 || d.trip_class === 1) { 
            type = 'rare'; 
          } else if (discountVal >= 25) { 
            type = 'super'; 
          }

          const dealDate = new Date(d.created_at || d.last_updated);
          const ageInHours = (new Date() - dealDate) / (1000 * 60 * 60);
          
          const isRareLocked = type === 'rare' && !isActuallyGold;
          const isTimeLocked = type === 'super' && ageInHours < 4 && !isActuallyGold;
          const isLocked = isRareLocked || isTimeLocked;

          return {
            ...d,
            destination: isLocked ? "Destination Secrète" : d.destination,
            price: isLocked ? "---" : d.price,
            image: isLocked ? "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=800&q=80" : (d.image_url || 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=800&q=80'),
            discount: discountVal,
            dealType: type,
            ageInHours: ageInHours,
            isTimeLocked: isTimeLocked, 
            isGold: type === 'rare',
            fullAirlineName: AIRLINE_MAP[d.airline] || d.airline,
            count_dates: d.all_flights.length 
          };
        });

        if (data.length > 0) {
          const latest = new Date(Math.max(...data.map(e => new Date(e.last_updated || e.created_at))));
          const diff = Math.floor((new Date() - latest) / 60000);
          const displayDiff = Math.min(diff, 9); 
          setLastUpdateTxt(displayDiff > 0 ? `Vérifié il y a ${displayDiff} min` : 'Vérifié à l\'instant');
        }

        setActiveDeals(formatted
          .filter(d => !d.is_expired) 
          .sort((a, b) => b.deal_score - a.deal_score)
        );

      } catch (err) { console.error(err); } finally { setIsLoading(false); }
    }
    fetchDeals();
  }, [isGoldUser]);

  const filteredDeals = activeDeals.filter(deal => {
    const matchesSearch = deal.destination.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDeparture = departure === 'all' || deal.all_origins.includes(departure);
    const matchesRegion = activeRegion === 'all' || deal.region === activeRegion; 
    const matchesQuality = dealFilters[deal.dealType];
    const matchesBudget = deal.price === "---" || deal.price <= budget;
    return matchesSearch && matchesDeparture && matchesRegion && matchesQuality && matchesBudget;
  });

  const getBadgeStyle = (type) => {
    if (type === 'rare') return 'bg-orange-600 text-white';
    if (type === 'super') return 'bg-green-600 text-white';
    return 'bg-yellow-400 text-white';
  };

  const getBadgeLabel = (type) => {
    if (type === 'rare') return 'Erreur de Prix';
    if (type === 'super') return 'Super Deal';
    return 'Bon Plan';
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 relative font-sans">
        <div className="absolute inset-0 z-0 bg-cover bg-center opacity-40 blur-sm" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1920&q=80')" }}></div>
        <div className="relative z-10 bg-white p-12 rounded-[2.5rem] shadow-2xl max-w-md w-full text-center">
          <Radar className="text-blue-600 mx-auto mb-6" size={42} />
          <h2 className="text-2xl font-black text-slate-900 mb-2 tracking-tight">Accès Radar</h2>
          <p className="text-slate-500 mb-8 text-sm font-medium">Débloquez les erreurs de prix en temps réel.</p>
          <input 
            type="email" 
            value={emailInput}
            onChange={(e) => setEmailInput(e.target.value)}
            placeholder="votre@email.com" 
            className="w-full border-2 border-slate-100 rounded-xl px-5 py-4 mb-4 outline-none focus:border-blue-600 font-bold" 
          />
          <button 
            onClick={handleSubscribe} 
            className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl shadow-lg hover:bg-blue-700 transition-all uppercase tracking-widest text-xs"
          >
            Entrer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] font-sans antialiased text-slate-900 overflow-x-hidden">
      
      {/* HEADER CORRIGÉ */}
      <header className="fixed top-0 left-0 right-0 h-20 px-4 md:px-8 flex items-center justify-between z-50 bg-white/90 backdrop-blur-xl border-b border-slate-100">
        
        {/* LOGO ET INDICATEUR LIVE (Harmonisé avec l'Accueil) */}
        <div className="flex items-center gap-4 shrink-0">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
            <Target className="text-blue-600" size={24} strokeWidth={2.5} />
            <span className="text-xl md:text-2xl tracking-tight text-slate-900 whitespace-nowrap">
              <span className="font-bold">Fly</span><span className="font-bold text-blue-600">Radar</span>
            </span>
          </div>
          
          <div className="hidden md:flex items-center gap-2">
            <div className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-green-600">Live</span>
          </div>
        </div>
        
        {/* BOUTONS DE DROITE */}
        <div className="flex items-center gap-3 lg:gap-6 shrink-0">
          <button onClick={() => navigate('/aide')} className="hidden lg:flex items-center gap-1.5 text-[10px] font-black text-slate-400 hover:text-slate-600 transition-colors uppercase tracking-[0.2em] border-b border-transparent hover:border-slate-200 pb-1">
            <HelpCircle size={14} className="text-slate-300" /> Aide
          </button>

          <button 
            onClick={handleLogout} 
            className="text-[10px] font-black text-slate-400 hover:text-red-500 transition-colors uppercase tracking-[0.2em] border-b border-transparent hover:border-red-200 pb-1 whitespace-nowrap"
          >
            {isGoldUser ? "Déconnexion" : "Quitter"}
          </button>
          
          {!isGoldUser ? (
            <button 
              onClick={() => navigate('/inscription-gold')} 
              className="bg-amber-500 text-white font-bold px-3 py-2 rounded-full flex items-center gap-1.5 text-[11px] shadow-sm hover:bg-amber-400 transition-colors whitespace-nowrap"
            >
              <Crown size={14} /> Go Gold
            </button>
          ) : (
            <button 
            onClick={() => setShowVipModal(true)}
              className="bg-slate-900 text-amber-400 font-bold px-3 py-2 rounded-full flex items-center gap-1.5 text-[11px] shadow-sm hover:bg-slate-800 transition-colors border border-amber-500/30 whitespace-nowrap"
            >
              <Crown size={14} /> Alertes VIP
            </button>
          )}
        </div>
      </header>

      {/* SIDEBAR (Visible lg+) */}
      <aside className="w-80 fixed left-0 top-20 bottom-0 bg-white border-r border-slate-50 p-10 overflow-y-auto hidden lg:block z-40">
        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-12">Filtres de recherche</h3>
        <div className="space-y-10">
          <div>
            <label className="text-[10px] font-bold text-slate-900 mb-4 block uppercase tracking-widest">Aéroport de départ</label>
            <select value={departure} onChange={(e) => setDeparture(e.target.value)} className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3 text-xs font-bold outline-none focus:border-blue-500">
              <option value="all">Tous les départs FR</option>
              <option value="PAR">Paris</option><option value="LYS">Lyon</option><option value="NCE">Nice</option><option value="MRS">Marseille</option><option value="TLS">Toulouse</option><option value="BOD">Bordeaux</option><option value="GVA">Genève</option><option value="BRU">Bruxelles</option>
            </select>
          </div>
          
          <div>
            <label className="text-[10px] font-bold text-slate-900 mb-4 block uppercase tracking-widest">Région</label>
            <select value={activeRegion} onChange={(e) => setActiveRegion(e.target.value)} className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3 text-xs font-bold outline-none focus:border-blue-500">
              <option value="all">Monde Entier</option>
              <option value="asie">Asie & Océanie</option><option value="ameriques">Amériques</option><option value="afrique">Afrique & Océan Indien</option><option value="europe_sud">Europe du Sud</option><option value="europe_nord">Europe du Nord</option>
            </select>
          </div>

          <div>
             <div className="flex justify-between mb-4"><label className="text-[10px] font-bold text-slate-900 uppercase tracking-widest">Budget Max</label><span className="text-blue-600 font-black text-sm">{budget}€</span></div>
             <input type="range" min="100" max="2000" step="50" value={budget} onChange={(e) => setBudget(Number(e.target.value))} className="w-full h-1 bg-slate-100 rounded-lg appearance-none accent-blue-600 cursor-pointer" />
          </div>

          <div>
            <label className="text-[10px] font-bold text-slate-900 mb-6 block uppercase tracking-widest">Deal</label>
            <div className="space-y-5">
              {[['good', 'Bon Plan (Dès -15%)', 'bg-yellow-400'], ['super', 'Super Deal (Dès -25%)', 'bg-green-500'], ['rare', 'Erreur de Prix (Dès -50%)', 'bg-orange-600']].map(([key, label, color]) => (
                <label key={key} className="flex items-center justify-between cursor-pointer group">
                  <div className="flex items-center gap-3">
                    <input type="checkbox" checked={dealFilters[key]} onChange={() => setDealFilters({...dealFilters, [key]: !dealFilters[key]})} className="w-4 h-4 rounded border-slate-200 text-blue-600 focus:ring-0 cursor-pointer" />
                    <span className="text-xs font-bold text-slate-500 group-hover:text-slate-900 transition-colors">{label}</span>
                  </div>
                  <div className={`w-2 h-2 rounded-full shrink-0 ${color}`}></div>
                </label>
              ))}
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 lg:ml-80 mt-20 p-6 md:p-16">
        <div className="max-w-6xl mx-auto">
          
          <div className="mb-12 text-left">
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight mb-4">Les dernières <span className="text-blue-600">pépites</span> détectées par nos agents.</h1>
            <div className="flex items-center gap-2 text-green-600 font-bold text-[10px] uppercase tracking-[0.2em] mb-8">{lastUpdateTxt}</div>
            
            <div className="relative max-w-xl">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Où souhaitez-vous aller ?" 
                className="w-full bg-white border-2 border-slate-100 rounded-2xl py-4 pl-12 pr-4 font-bold text-slate-900 focus:border-blue-600 outline-none shadow-sm transition-all"
              />
            </div>
          </div>
          
          {/* BOUTON FILTRES MOBILE (Visible <lg) */}
          <div className="lg:hidden mb-10 flex justify-end">
            <button 
              onClick={() => setShowMobileFilters(true)}
              className="bg-slate-900 text-white px-6 py-3.5 rounded-xl text-[12px] font-black uppercase tracking-widest flex items-center gap-2 shadow-lg hover:bg-slate-800 transition-colors"
            >
              <Zap size={16} className="text-blue-500 shrink-0" /> Filtres {departure !== 'all' || activeRegion !== 'all' || budget < 2000 || Object.values(dealFilters).includes(false) ? '(Actifs)' : ''}
            </button>
          </div>

          {/* AFFICHAGE DES DEALS OU MESSAGE VIDE */}
          {filteredDeals.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredDeals.map((deal) => {
                const isRareLocked = deal.dealType === 'rare' && !isGoldUser; 
                const isTimeLocked = deal.isTimeLocked && !isGoldUser;
                const isLocked = isRareLocked || isTimeLocked;
                
                // CORRECTION 2 : Vérification du nombre de dates
                const isSingleDate = deal.count_dates === 1;
                const singleFlight = deal.all_flights[0];

                return (
                  <div key={deal.id} className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm flex flex-col h-full group hover:shadow-md transition-all relative">
                    
                    {isLocked && (
                      <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 text-center">
                        
                        {isRareLocked ? (
                          <div className="border-[3px] border-red-500 text-red-500 font-black text-2xl px-5 py-1.5 rotate-[-12deg] uppercase rounded-xl bg-white shadow-2xl mb-5">ERREUR</div>
                        ) : (
                          <div className="border-[3px] border-blue-500 text-blue-500 font-black text-xl px-5 py-1.5 rotate-[-5deg] uppercase rounded-xl bg-white shadow-2xl mb-5 text-center leading-tight">
                            Dispo dans<br/>{Math.max(1, Math.ceil(4 - deal.ageInHours))}H
                          </div>
                        )}
                        
                        <button onClick={() => navigate('/inscription-gold')} className="bg-amber-500 hover:bg-amber-400 text-white font-black px-6 py-3.5 rounded-xl flex items-center gap-2 text-xs shadow-xl uppercase tracking-widest transition-transform hover:scale-105 active:scale-95">
                          <Crown size={18} /> Débloquer
                        </button>
                      </div>
                    )}

                    <div className={`flex flex-col h-full ${isLocked ? 'blur-md select-none opacity-40 grayscale-[30%]' : ''}`}>
                      <div className="relative h-48 overflow-hidden bg-slate-100 shrink-0">
                        <div className={`absolute top-4 left-4 px-3 py-1.5 rounded-lg font-black text-[8px] uppercase tracking-widest shadow-md z-10 ${getBadgeStyle(deal.dealType)}`}>{getBadgeLabel(deal.dealType)}</div>
                        <div className={`absolute top-4 right-4 px-3 py-1.5 rounded-lg font-black text-[10px] shadow-md z-10 ${getBadgeStyle(deal.dealType)}`}>-{deal.discount}%</div>
                        
                        <img 
                          src={deal.image} 
                          onError={(e) => { e.target.onerror = null; e.target.src = 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=800&q=80'; }}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                          alt={deal.destination} 
                        />
                      </div>
                      
                      <div className="p-6 md:p-8 flex flex-col flex-1">
                        <div className="mb-4">
                          <h3 className="font-extrabold text-slate-900 text-2xl md:text-2xl tracking-tight mb-1">{deal.destination}</h3>
                          <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1">
                            <span>{deal.origine_code}</span>
                            <div className="w-6 h-[1px] bg-slate-200 shrink-0"></div>
                            <span>{deal.destination_code}</span>
                          </div>
                        </div>
                        
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em] mb-4">
                          {deal.fullAirlineName} {(deal.stops > 0 && deal.stops !== null) ? '+ AUTRES' : ''}
                        </p>
                        
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-5 text-[9px] font-bold text-slate-500 uppercase tracking-widest">
                          <div className="flex items-center gap-1.5 whitespace-nowrap">
                            <Calendar size={12} className="text-blue-500 shrink-0"/> 
                            {isSingleDate && singleFlight ? (
                              singleFlight.return_date 
                                ? `${new Date(singleFlight.dates).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })} - ${new Date(singleFlight.return_date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}`
                                : `${new Date(singleFlight.dates).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}`
                            ) : (
                              `${deal.count_dates} dates dispos`
                            )}
                          </div>
                          <div className="flex items-center gap-1.5 whitespace-nowrap">
                            {deal.stops === null ? '' : (deal.stops == 0 || deal.stops === '0' ? 'Vol Direct' : `${deal.stops} Escale(s)`)}
                          </div>
                        </div>
                        
                        <div className="flex flex-col mb-6 mt-auto">
                          <div className="flex items-baseline gap-2">
                            <span className="font-black text-slate-900 text-3xl md:text-4xl tracking-tighter">{deal.price}€</span>
                            <span className="text-[10px] text-slate-400 font-bold whitespace-nowrap">vs <span className="line-through text-slate-700">{deal.average_price}€</span></span>
                          </div>
                          <div className="mt-2.5 flex justify-end items-center gap-1.5 text-[9px] font-bold uppercase tracking-widest w-full">
                            <Target size={12} className="text-blue-600 shrink-0" />
                            <span className="text-slate-500">Score :</span>
                            <span className="text-slate-900 font-black">{deal.deal_score}<span className="text-slate-400 font-normal">/10</span></span>
                          </div>
                        </div>

                        <div className="mt-auto pt-5 border-t border-slate-100">
                          {isSingleDate && singleFlight ? (
                            <button onClick={() => window.open(singleFlight.booking_url, '_blank')} className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg font-bold py-3.5 md:py-4 rounded-xl transition-all text-[10px] uppercase tracking-widest hover:-translate-y-0.5">Réserver</button>
                          ) : (
                            <button onClick={() => setSelectedDeal(deal)} className="w-full bg-slate-900 hover:bg-blue-700 text-white shadow-lg font-bold py-3.5 md:py-4 rounded-xl transition-all text-[10px] uppercase tracking-widest hover:-translate-y-0.5">Voir les dates</button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* MESSAGE QUAND AUCUN VOL N'EST TROUVÉ */
            <div className="flex flex-col items-center justify-center bg-white rounded-[2rem] border border-slate-100 p-12 text-center shadow-sm w-full py-20 mt-4">
              <div className="w-24 h-24 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-6">
                <Radar size={48} className="animate-[spin_4s_linear_infinite]" />
              </div>
              <h3 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">Le radar est calme sur cette zone.</h3>
              <p className="text-slate-500 font-medium max-w-md text-lg leading-relaxed">
                Nos agents n'ont détecté aucune pépite correspondant à vos critères pour le moment.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setBudget(2000);
                  setDeparture('all');
                  setActiveRegion('all');
                  setDealFilters({ good: true, super: true, rare: true });
                }}
                className="mt-8 bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 px-8 rounded-xl transition-colors text-xs uppercase tracking-widest shadow-lg active:scale-95"
              >
                Réinitialiser les filtres
              </button>
            </div>
          )}
        </div>
      </main>

      {/* MODALE DÉTAILS OFFRE */}
      {selectedDeal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-4 animate-in fade-in duration-300">
          <div className="w-full max-w-2xl bg-slate-50 rounded-[2rem] overflow-hidden flex flex-col relative shadow-2xl animate-in zoom-in-95 duration-300 max-h-[90vh]">
            <button onClick={() => setSelectedDeal(null)} className="absolute top-4 right-4 z-20 bg-black/40 text-white rounded-full p-2 hover:bg-black transition-colors">
              <X size={20} />
            </button>
            <div className="h-40 md:h-48 relative shrink-0">
              <img src={selectedDeal.image} className="w-full h-full object-cover" alt={selectedDeal.destination} />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 to-transparent"></div>
              <div className="absolute bottom-5 left-6 md:bottom-6 md:left-8">
                <h3 className="font-black text-white text-2xl md:text-3xl tracking-tight mb-1">{selectedDeal.destination}</h3>
                <p className="text-blue-300 text-xs font-bold uppercase tracking-widest">Toutes les dates disponibles</p>
              </div>
            </div>
            <div className="p-6 md:p-8 overflow-y-auto custom-scrollbar">
              <div className="space-y-4">
                {selectedDeal.all_flights.sort((a, b) => a.price - b.price).map((flight, idx) => (
                  <div key={flight.id || idx} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-blue-200 transition-colors group">
                    <div className="flex flex-col">
                    <span className="font-bold text-slate-900 text-[14px] sm:text-lg block">
                      {flight.return_date ? (
                        <>Du <span className="text-blue-600">{new Date(flight.dates).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}</span> au <span className="text-blue-600">{new Date(flight.return_date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}</span></>
                      ) : (
                        <>Aller Simple ➔ <span className="text-blue-600">{new Date(flight.dates).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</span></>
                      )}
                    </span>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 mt-2">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2 py-0.5 bg-slate-50 rounded-md whitespace-nowrap">
                        {AIRLINE_MAP[flight.airline] || flight.airline} {(flight.stops > 0 && flight.stops !== null) ? '+ autres' : ''}
                      </span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">
                          {flight.stops === null ? '' : (flight.stops == 0 || flight.stops === '0' ? 'Vol Direct' : `${flight.stops} escale(s)`)}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-5 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 border-slate-100 pt-4 sm:pt-0">
                      <div className="flex flex-col text-right">
                        <span className="font-black text-2xl text-blue-600">{flight.price}€</span>
                      </div>
                      <button 
                        onClick={() => window.open(flight.booking_url, '_blank')} 
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-6 rounded-xl transition-all text-[10px] uppercase tracking-widest shadow-md hover:-translate-y-0.5 hover:shadow-xl"
                      >
                        Réserver
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODALE VIP ALERTES */}
      {showVipModal && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-[150] flex items-center justify-center p-4">
          <div className="bg-white rounded-[2.5rem] w-full max-w-md overflow-hidden shadow-2xl relative animate-in zoom-in-95 duration-300">
            <button 
              onClick={() => setShowVipModal(false)}
              className="absolute top-5 right-5 p-2 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors z-10"
            >
              <X size={20} className="text-slate-600" />
            </button>
            <div className="bg-slate-900 p-8 text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500"></div>
              <Crown size={32} className="text-amber-400 mx-auto mb-3" />
              <h2 className="text-2xl font-black text-white mb-1 tracking-tight">Centre de Contrôle</h2>
              <p className="text-amber-200/80 text-sm font-medium">Gérez vos alertes aéroports en illimité</p>
            </div>
            <div className="p-8">
              <p className="text-slate-600 text-sm mb-7 text-center font-medium leading-relaxed px-2">
                Cochez les aéroports pour lesquels vous souhaitez recevoir des alertes d'erreurs de prix en temps réel.
              </p>
              <div className="space-y-3 max-h-72 overflow-y-auto pr-2 custom-scrollbar">
                {availableAirports.map((airport) => (
                  <label 
                    key={airport.id} 
                    className={`flex items-center justify-between p-4 border rounded-2xl cursor-pointer transition-all ${
                      vipAirports.includes(airport.id) 
                        ? 'border-amber-500 bg-amber-50 shadow-sm' 
                        : 'border-slate-100 hover:border-slate-200 bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-2.5 h-2.5 rounded-full ${vipAirports.includes(airport.id) ? 'bg-amber-500 animate-pulse' : 'bg-slate-200'} shrink-0`}></div>
                      <span className={`font-bold text-[14px] ${vipAirports.includes(airport.id) ? 'text-amber-950' : 'text-slate-700'}`}>
                        {airport.name}
                      </span>
                    </div>
                    <input 
                      type="checkbox" 
                      className="w-5 h-5 accent-amber-500 cursor-pointer rounded-lg shrink-0" 
                      checked={vipAirports.includes(airport.id)}
                      onChange={() => toggleAirport(airport.id)}
                    />
                  </label>
                ))}
              </div>
              <button 
                onClick={saveVipAlerts}
                className="w-full mt-7 bg-amber-500 text-white font-black py-4.5 rounded-xl shadow-lg shadow-amber-500/30 hover:bg-amber-400 transition-colors uppercase tracking-widest text-xs"
              >
                Sauvegarder mes alertes
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* TOAST NOTIFICATION PREMIUM */}
      {showToast && (
        <div className="fixed top-24 right-4 md:right-8 z-[200] flex items-center gap-4 bg-slate-900 border border-amber-500/50 text-white px-5 py-4 rounded-2xl shadow-2xl animate-in slide-in-from-right duration-500">
          <div className="bg-amber-500 p-2 rounded-full shrink-0">
            <CheckCircle2 size={18} className="text-slate-900" />
          </div>
          <div>
            <p className="font-black text-[9px] uppercase tracking-widest text-amber-500">Système</p>
            <p className="text-[13px] font-bold text-slate-100">Configuration VIP mise à jour ! 🎉</p>
          </div>
        </div>
      )}
      
      {/* --- MODALE FILTRES MOBILE (BOTTOM SHEET) --- */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-[120] bg-slate-900/80 backdrop-blur-sm lg:hidden animate-in fade-in duration-300">
          
          {/* Le "Tiroir" collé en bas (Bottom Sheet) */}
          <div className="absolute bottom-0 left-0 right-0 w-full bg-white rounded-t-[2rem] flex flex-col shadow-2xl animate-in slide-in-from-bottom-8 duration-300" style={{ height: '85vh' }}>
            
            {/* Header (Fixé en haut du tiroir) */}
            <div className="bg-slate-50 p-6 text-center relative border-b border-slate-100 shrink-0 rounded-t-[2rem]">
              <button 
                onClick={() => setShowMobileFilters(false)}
                className="absolute top-4 right-4 z-20 bg-slate-200 text-slate-600 rounded-full p-2 hover:bg-slate-300"
              >
                <X size={20} />
              </button>
              <Zap size={24} className="text-blue-600 mx-auto mb-2" />
              <h2 className="text-lg font-black text-slate-900 tracking-tight">Filtres du Radar</h2>
            </div>

            {/* Contenu Scrollable */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar pb-32">
              <div>
                <label className="text-[10px] font-bold text-slate-900 mb-3 block uppercase tracking-widest">Aéroport de départ</label>
                <select value={departure} onChange={(e) => setDeparture(e.target.value)} className="w-full bg-slate-50 border border-slate-100 rounded-xl p-4 text-xs font-bold outline-none focus:border-blue-500 appearance-none">
                  <option value="all">Tous les départs FR</option>
                  <option value="PAR">Paris</option><option value="LYS">Lyon</option><option value="NCE">Nice</option><option value="MRS">Marseille</option><option value="TLS">Toulouse</option><option value="BOD">Bordeaux</option><option value="GVA">Genève</option><option value="BRU">Bruxelles</option>
                </select>
              </div>
              
              <div>
                <label className="text-[10px] font-bold text-slate-900 mb-3 block uppercase tracking-widest">Région</label>
                <select value={activeRegion} onChange={(e) => setActiveRegion(e.target.value)} className="w-full bg-slate-50 border border-slate-100 rounded-xl p-4 text-xs font-bold outline-none focus:border-blue-500 appearance-none">
                  <option value="all">Monde Entier</option>
                  <option value="asie">Asie & Océanie</option><option value="ameriques">Amériques</option><option value="afrique">Afrique & Océan Indien</option><option value="europe_sud">Europe du Sud</option><option value="europe_nord">Europe du Nord</option>
                </select>
              </div>

              <div>
                 <div className="flex justify-between items-center mb-3">
                  <label className="text-[10px] font-bold text-slate-900 uppercase tracking-widest">Budget Max</label>
                  <span className="text-blue-600 font-black text-lg">{budget}€</span>
                 </div>
                 <input type="range" min="100" max="2000" step="50" value={budget} onChange={(e) => setBudget(Number(e.target.value))} className="w-full h-2 bg-slate-100 rounded-lg appearance-none accent-blue-600 cursor-pointer" />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-900 mb-4 block uppercase tracking-widest">Type de Deal</label>
                <div className="space-y-5">
                  {[['good', 'Bon Plan (Dès -15%)', 'bg-yellow-400'], ['super', 'Super Deal (Dès -25%)', 'bg-green-500'], ['rare', 'Erreur de Prix (Dès -50%)', 'bg-orange-600']].map(([key, label, color]) => (
                    <label key={key} className="flex items-center justify-between cursor-pointer group">
                      <div className="flex items-center gap-3">
                        <input type="checkbox" checked={dealFilters[key]} onChange={() => setDealFilters({...dealFilters, [key]: !dealFilters[key]})} className="w-5 h-5 rounded-md border-slate-300 text-blue-600 focus:ring-0 cursor-pointer" />
                        <span className="text-sm font-bold text-slate-600">{label}</span>
                      </div>
                      <div className={`w-3 h-3 rounded-full shrink-0 ml-4 ${color}`}></div>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Bouton Appliquer (Cloué en bas) */}
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-white border-t border-slate-100 shadow-[0_-10px_20px_-10px_rgba(0,0,0,0.05)] z-10">
              <button 
                onClick={() => setShowMobileFilters(false)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-xl uppercase tracking-widest text-xs shadow-lg shadow-blue-600/20"
              >
                Appliquer les filtres
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}