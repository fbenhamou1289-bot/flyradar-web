import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import Aide from './Aide';
import SuccesPaiement from './SuccesPaiement';
import ChoixClient from './ChoixClient';
import Merci from './Merci';
import Contact from './Contact';
import Conciergerie from './Conciergerie';
import Connexion from './Connexion';
import InscriptionGold from './InscriptionGold';
import CGV from './CGV';
import Desabonnement from './Desabonnement';
import MentionsLegales from './MentionsLegales';
import PolitiqueConfidentialite from './PolitiqueConfidentialite';
import { Target, ArrowRight, MapPin, Radar, Server, Zap, Crown, Check, Star, AlertCircle, CheckCircle2, User, HelpCircle, Crosshair, Gift } from 'lucide-react';
import VolsPasChers, { supabase } from './VolsPasChers';

// --- LES OFFRES FICTIVES (FOMO) ---
const FOMO_DEALS = [
  { city: "Bali, Indonésie", type: "A/R depuis Paris", price: "380€", code: "DPS" },
  { city: "New York, USA", type: "Vol direct", price: "210€", code: "NYC" },
  { city: "Santorin, Grèce", type: "A/R direct", price: "45€", code: "JTR" },
  { city: "Tokyo, Japon", type: "A/R depuis Lyon", price: "350€", code: "TYO" },
  { city: "Dubaï, EAU", type: "Vol direct hiver", price: "150€", code: "DXB" },
  { city: "Cancún, Mexique", type: "A/R depuis Paris", price: "290€", code: "CUN" },
  { city: "La Réunion", type: "A/R direct", price: "310€", code: "RUN" },
  { city: "Ibiza, Espagne", type: "Aller simple", price: "19€", code: "IBZ" },
  { city: "Montréal, Canada", type: "Vol direct", price: "190€", code: "YUL" },
  { city: "Malé, Maldives", type: "A/R depuis Paris", price: "410€", code: "MLE" }
];

const SUPABASE_IMAGE_URL = "https://jltaldrfjgczgtrtmmrd.supabase.co/storage/v1/object/public/destinations";

const CaptureForm = ({ navigate }) => {
  const [emailInput, setEmailInput] = useState('');
  const [departureInput, setDepartureInput] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubscribe = async () => {
    setError('');
    if (!departureInput) return setError("Veuillez choisir un aéroport de départ.");
    if (!emailInput.includes('@') || !emailInput.includes('.')) return setError("Veuillez entrer une adresse email valide.");
    setIsLoading(true);

    try {
      const emailClean = emailInput.toLowerCase().trim();
      const secretPassword = "FlyRadar_User_2026!";
      let { error: authError } = await supabase.auth.signUp({ email: emailClean, password: secretPassword });
      if (authError && authError.message.includes('already registered')) {
        await supabase.auth.signInWithPassword({ email: emailClean, password: secretPassword });
      }
      await supabase.from('Users').upsert({ email: emailClean, departure: departureInput }, { onConflict: 'email' });
      localStorage.setItem('flyradar_user_email', emailClean);
      localStorage.setItem('flyradar_free_access', 'true');
      setIsSubscribed(true);
    } catch (err) {
      setError("Une erreur est survenue.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubscribed) {
    return (
      <div className="bg-white rounded-3xl p-8 w-full max-w-2xl mx-auto z-20 relative text-center shadow-2xl border border-slate-100 animate-in fade-in zoom-in duration-500">
        <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="text-green-500" size={32} />
        </div>
        <h3 className="text-2xl font-black text-slate-900 mb-2">Radar activé !</h3>
        <button onClick={() => navigate('/vols-pas-chers')} className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-blue-600 text-white font-bold py-4 px-8 rounded-xl uppercase tracking-widest text-xs shadow-lg">
          Voir les offres <ArrowRight size={16} />
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl z-20 relative" id="capture-form">
      <div className={`bg-white rounded-2xl shadow-2xl p-2 pl-6 flex flex-col md:flex-row items-center gap-3 border ${error ? 'border-red-400' : 'border-slate-200'} transition-all text-left`}>
        <div className="flex w-full md:w-1/3 items-center gap-2 border-b md:border-b-0 md:border-r border-slate-200 pb-3 pt-2 md:py-2 pr-4">
          <MapPin className="text-slate-400 shrink-0" size={20} />
          <select value={departureInput} onChange={(e) => setDepartureInput(e.target.value)} className="w-full bg-transparent font-bold outline-none text-sm appearance-none">
            <option value="" disabled>Aéroport de départ ?</option>
            <option value="PAR">Paris (Tous)</option>
            <option value="TLS">Toulouse</option>
            <option value="LYS">Lyon</option>
            <option value="NCE">Nice</option>
            <option value="MRS">Marseille</option>
            <option value="NTE">Nantes</option>
            <option value="BOD">Bordeaux</option>
          </select>
        </div>
        <div className="flex w-full md:flex-1 items-center gap-3 py-2 px-2">
          <input type="email" value={emailInput} onChange={(e) => setEmailInput(e.target.value)} placeholder="Votre adresse email..." className="w-full bg-transparent text-slate-800 font-medium outline-none text-base" />
        </div>
        <button onClick={handleSubscribe} disabled={isLoading} className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-xl transition-all text-sm shadow-lg shadow-blue-600/20">
          {isLoading ? 'Activation...' : 'Activez votre radar'}
        </button>
      </div>
      {error && (
        <div className="mt-4 text-red-500 text-sm font-bold flex items-center justify-center gap-2 animate-in fade-in slide-in-from-top-2">
          <AlertCircle size={16} /> {error}
        </div>
      )}
    </div>
  );
};

function Accueil() {
  const navigate = useNavigate();
  const [isGoldUser, setIsGoldUser] = useState(false);
  const [dailyDeals, setDailyDeals] = useState([]);

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { data: userData } = await supabase.from('Users').select('is_gold').eq('email', session.user.email).maybeSingle();
        if (userData?.is_gold) setIsGoldUser(true);
      }
    };
    checkSession();
    const dayOfYear = Math.floor(Date.now() / 86400000);
    setDailyDeals([FOMO_DEALS[dayOfYear % FOMO_DEALS.length], FOMO_DEALS[(dayOfYear + 1) % FOMO_DEALS.length], FOMO_DEALS[(dayOfYear + 2) % FOMO_DEALS.length]]);
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.clear();
    setIsGoldUser(false);
    window.location.reload(); 
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans overflow-x-hidden">
      
      {/* HEADER AVEC BOUTON CONCIERGERIE */}
      <header className="py-3 px-4 md:h-20 md:px-8 flex items-center justify-between bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
            <Target className="text-blue-600" size={24} strokeWidth={2.5} />
            <span className="text-xl md:text-2xl font-bold tracking-tight text-slate-900">Fly<span className="text-blue-600">Radar</span></span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/conciergerie')} className="hidden lg:flex items-center gap-1.5 text-xs font-black text-blue-600 hover:text-blue-800 transition-colors uppercase tracking-widest px-4">
            <Crosshair size={14} /> Conciergerie
          </button>
          
          <button onClick={() => navigate('/aide')} className="flex items-center gap-1.5 text-[10px] font-black text-slate-500 hover:text-slate-700 transition-colors uppercase tracking-widest">
            Aide
          </button>

          {isGoldUser ? (
            <div className="flex items-center gap-4">
              <button onClick={handleLogout} className="text-[10px] font-black text-slate-500 hover:text-red-500 transition-colors uppercase tracking-widest">Déconnexion</button>
              <button onClick={() => navigate('/vols-pas-chers')} className="bg-slate-900 text-amber-400 font-bold px-5 py-2 rounded-full flex items-center gap-1.5 text-xs">
                <Crown size={14} /> VIP Access
              </button>
            </div>
          ) : (
            <>
              <button onClick={() => navigate('/connexion')} className="text-xs font-bold text-slate-600 px-4">Connexion</button>
              <button onClick={() => navigate('/inscription-gold')} className="text-xs md:text-sm font-bold text-white bg-amber-500 px-5 py-2 rounded-full flex items-center gap-1.5 shadow-sm">
                <Crown size={14} /> Go Gold
              </button>
            </>
          )}
        </div>
      </header>

      {/* HERO */}
      <section className="relative min-h-[70vh] flex flex-col items-center justify-center pt-20 pb-32 px-4 text-center overflow-hidden">
        <div className="absolute inset-0 z-0 bg-slate-900">
          <div className="absolute inset-0 bg-cover bg-center opacity-60 scale-110" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1920&q=80')` }} />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/60 to-[#F8FAFC]" />
        </div>
        <div className="relative z-10 w-full max-w-4xl mx-auto text-white mb-8">
          <h1 className="text-4xl md:text-7xl font-black mb-6 tracking-tight leading-[1.1]">Économisez jusqu'à <span className="text-blue-600">90%</span><br />sur vos vols.</h1>
          <p className="text-slate-100 text-lg md:text-xl mb-10 max-w-2xl mx-auto font-medium leading-relaxed">Nos agents traquent les erreurs de prix en temps réel. Activez votre radar.</p>
          <CaptureForm navigate={navigate} />
        </div>
      </section>

      {/* COMMENT ÇA MARCHE */}
      <section className="relative z-20 -mt-20 px-4 md:px-6 max-w-7xl mx-auto w-full mb-24">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-6 md:p-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="flex flex-col items-center">
              <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-4"><Radar size={28} /></div>
              <h3 className="font-bold text-slate-900 text-lg mb-2">1. Activez votre radar</h3>
              <p className="text-slate-500 text-sm px-4">Indiquez votre aéroport de départ et votre email.</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-4"><Server size={28} /></div>
              <h3 className="font-bold text-slate-900 text-lg mb-2">2. Nous scannons 24/7</h3>
              <p className="text-slate-500 text-sm px-4">Nous traquons les baisses de prix secrètes en temps réel.</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-4"><Zap size={28} /></div>
              <h3 className="font-bold text-slate-900 text-lg mb-2">3. Réservez vite</h3>
              <p className="text-slate-500 text-sm px-4">Recevez l'alerte et réservez avant la correction du prix.</p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION PRICING 3 COLONNES */}
      <section id="pricing-section" className="py-20 md:py-28 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-5xl font-black mb-16 tracking-tight text-slate-900">Choisissez votre puissance de frappe.</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
            
            {/* 1. GRATUIT */}
            <div className="bg-slate-50 rounded-[2.5rem] p-10 flex flex-col text-left border border-slate-200 shadow-sm">
              <h3 className="text-xl font-black mb-2 text-slate-900 uppercase tracking-widest">Radar Gratuit</h3>
              <p className="text-slate-500 text-xs mb-8 font-bold">Pour ne plus rater les bons plans.</p>
              <div className="mb-8 font-black text-5xl text-slate-900">0€<span className="text-slate-400 text-lg">/mois</span></div>
              <ul className="space-y-4 mb-10 text-sm font-bold text-slate-600">
                <li className="flex gap-3"><Check className="text-blue-500 shrink-0" size={18} /> Alertes Éco standards</li>
                <li className="flex gap-3"><Check className="text-blue-500 shrink-0" size={18} /> 1 aéroport surveillé</li>
                <li className="flex gap-3 text-red-500"><AlertCircle className="shrink-0" size={18} /> 4h de retard sur les offres</li>
              </ul>
              <button onClick={() => window.scrollTo({top:0, behavior:'smooth'})} className="mt-auto bg-white border border-slate-200 py-4 rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-slate-100 transition-all">S'inscrire</button>
            </div>

            {/* 2. FLYRADAR GOLD */}
            <div className="bg-amber-500 rounded-[2.5rem] p-1 shadow-2xl transform lg:-translate-y-6 relative">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-900 text-amber-400 text-[10px] font-black px-4 py-2 rounded-full uppercase tracking-[0.2em] border border-amber-500/50">Recommandé</div>
              <div className="bg-slate-950 rounded-[2.3rem] p-10 h-full flex flex-col text-left">
                <h3 className="text-xl font-black mb-1 text-white flex items-center gap-2 uppercase tracking-widest">FlyRadar Gold <Crown size={18} className="text-amber-500" /></h3>
                <p className="text-amber-400 text-xs font-bold mb-8">Rentabilisé dès le 1er voyage.</p>
                <div className="mb-8 font-black text-5xl text-white">9,99€<span className="text-slate-500 text-lg">/mois</span></div>
                <ul className="space-y-4 mb-10 text-sm font-bold text-slate-300">
                  <li className="flex gap-3"><Check className="text-amber-500 shrink-0" size={18} /> <span className="text-white">Instantané :</span> Alertes 24/7</li>
                  <li className="flex gap-3"><Check className="text-amber-500 shrink-0" size={18} /> Business & Première incluses</li>
                  <li className="flex gap-3 bg-blue-600/20 p-3 rounded-2xl border border-blue-500/30 text-white shadow-lg">
                    <Gift className="text-blue-400 shrink-0" size={20} /> 
                    <span><b>1 Mission Sniper OFFERTE</b> / mois <span className="block text-[10px] text-blue-300 font-medium mt-1">Valeur 9,90€ offerte</span></span>
                  </li>
                  <li className="flex gap-3 text-white"><Check className="text-green-500 shrink-0" size={18} /> Erreurs de prix (Error Fares)</li>
                </ul>
                <button onClick={() => navigate('/inscription-gold')} className="mt-auto bg-amber-500 py-5 rounded-xl font-black uppercase text-[10px] tracking-widest text-slate-950 hover:bg-amber-400 transition-all">Devenir membre Gold</button>
              </div>
            </div>

            {/* 3. AGENT SNIPER */}
            <div className="bg-white rounded-[2.5rem] p-10 flex flex-col text-left border-2 border-slate-900 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-5"><Crosshair size={120} /></div>
              <h3 className="text-xl font-black mb-2 text-slate-900 uppercase tracking-widest flex items-center gap-2">Agent Sniper <Crosshair size={18} className="text-blue-600" /></h3>
              <p className="text-slate-500 text-xs mb-8 font-bold">Recherche précise sur-mesure.</p>
              <div className="mb-8 font-black text-5xl text-slate-900">9,90€<span className="text-slate-400 text-lg">/mission</span></div>
              <ul className="space-y-4 mb-10 text-sm font-bold text-slate-600">
                <li className="flex gap-3"><Check className="text-blue-600 shrink-0" size={18} /> Traque sur vos dates & ville</li>
                <li className="flex gap-3"><Check className="text-blue-600 shrink-0" size={18} /> Surveillance active 72h</li>
                <li className="flex gap-3"><Check className="text-blue-600 shrink-0" size={18} /> Relance offerte si échec</li>
                <li className="flex gap-3 text-blue-600 italic font-black"><Zap size={18} /> Frais de succès : +29€ si trouvé</li>
              </ul>
              <button onClick={() => navigate('/conciergerie')} className="mt-auto bg-slate-900 text-white py-4 rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-blue-600 transition-all">Lancer une mission</button>
            </div>
          </div>
        </div>
      </section>

      <footer className="py-12 text-center border-t border-slate-200 bg-white px-4">
        <p className="text-slate-400 text-xs font-black uppercase tracking-[0.3em] mb-4">© 2026 FlyRadar aviation • No limits</p>
        <div className="flex flex-wrap justify-center gap-4 text-xs font-medium text-slate-400">
          <button onClick={() => navigate('/aide')} className="hover:text-slate-700">Aide</button>
          <span>|</span>
          <button onClick={() => navigate('/cgv')} className="hover:text-slate-700">CGV & CGU</button>
          <span>|</span>
          <button onClick={() => navigate('/mentions-legales')} className="hover:text-slate-700">Mentions Légales</button>
        </div>
      </footer>
    </div>
  );
}

// --- NAVIGATION ---
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Accueil />} />
        <Route path="/vols-pas-chers" element={<VolsPasChers />} />
        <Route path="/inscription-gold" element={<InscriptionGold />} />
        <Route path="/aide" element={<Aide />} /> 
        <Route path="/contact" element={<Contact />} />
        <Route path="/connexion" element={<Connexion />} />
        <Route path="/succes" element={<SuccesPaiement />} />
        <Route path="/confidentialite" element={<PolitiqueConfidentialite />} />
        <Route path="/mentions-legales" element={<MentionsLegales />} />
        <Route path="/cgv" element={<CGV />} />
        <Route path="/conciergerie" element={<Conciergerie />} />
        <Route path="/desabonnement" element={<Desabonnement />} />
        <Route path="/choix" element={<ChoixClient />} />
        <Route path="/merci" element={<Merci />} />
      </Routes>
    </BrowserRouter>
  );
}
