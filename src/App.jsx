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
import { Target, ArrowRight, MapPin, Radar, Server, Zap, Crown, Check, Star, AlertCircle, CheckCircle2, User, HelpCircle } from 'lucide-react';
import VolsPasChers, { supabase } from './VolsPasChers';

// --- LES OFFRES FICTIVES (FOMO) QUI TOURNENT TOUS LES JOURS ---
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

// --- COMPOSANT : LE FORMULAIRE DE CAPTURE ---
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

      let { error: authError } = await supabase.auth.signUp({
        email: emailClean,
        password: secretPassword,
      });

      if (authError && authError.message.includes('already registered')) {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: emailClean,
          password: secretPassword,
        });
        if (signInError) throw signInError;
      } else if (authError) {
        throw authError;
      }

      const { error: dbError } = await supabase
        .from('Users')
        .upsert(
          { 
            email: emailClean, 
            departure: departureInput
          }, 
          { onConflict: 'email' }
        );
        
      if (dbError) throw dbError;
      
      localStorage.setItem('flyradar_user_email', emailClean);
      localStorage.setItem('flyradar_free_access', 'true');
      
      setIsSubscribed(true);
    } catch (err) {
      console.error("Erreur d'inscription:", err);
      setError("Une erreur est survenue. Vérifiez votre connexion.");
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
        <h3 className="text-2xl font-black text-slate-900 mb-2">Radar activé avec succès !</h3>
        <p className="text-slate-500 text-base font-medium mb-8">
          Surveillance en cours pour les départs de <span className="text-slate-900 font-bold">{departureInput}</span>.
        </p>
        <button 
          onClick={() => navigate('/vols-pas-chers')} 
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-xl transition-all uppercase tracking-widest text-xs shadow-lg shadow-blue-600/20"
        >
          Voir les offres en direct <ArrowRight size={16} />
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl z-20 relative" id="capture-form">
      <div className={`bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] p-2 pl-6 flex flex-col md:flex-row items-center gap-3 border ${error ? 'border-red-400 ring-4 ring-red-100' : 'border-slate-200 focus-within:border-blue-400 focus-within:ring-4 focus-within:ring-blue-100'} transition-all text-left`}>
        <div className="flex w-full md:w-1/3 items-center gap-2 border-b md:border-b-0 md:border-r border-slate-200 pb-3 pt-2 md:py-2 pr-4 text-left">
          <MapPin className={`${error && !departureInput ? 'text-red-400' : 'text-slate-400'} shrink-0`} size={20} />
          <select 
            value={departureInput} 
            onChange={(e) => { setDepartureInput(e.target.value); setError(''); }}
            className={`w-full bg-transparent font-bold outline-none cursor-pointer text-sm appearance-none truncate ${departureInput ? 'text-slate-800' : 'text-slate-400'}`}
          >
            <option value="" disabled>Aéroport de départ ?</option>
            <option value="PAR">Paris (Tous les aéroports)</option>
            <option value="TLS">Toulouse - Blagnac</option>
            <option value="LYS">Lyon - St Exupéry</option>
            <option value="NCE">Nice - Côte d'Azur</option>
            <option value="MRS">Marseille - Provence</option>
            <option value="NTE">Nantes - Atlantique</option>
            <option value="BOD">Bordeaux - Mérignac</option>
            <option value="MLH">Bâle - Mulhouse</option>
            <option value="GVA">Genève</option>
            <option value="BRU">Bruxelles</option>
          </select>
        </div>
        
        <div className="flex w-full md:flex-1 items-center gap-3 py-2 px-2">
          <input 
            id="email-input"
            type="email" 
            value={emailInput}
            onChange={(e) => { setEmailInput(e.target.value); setError(''); }}
            placeholder="Votre adresse email..." 
            className="w-full bg-transparent text-slate-800 font-medium outline-none placeholder:text-slate-400 text-base" 
          />
        </div>
        
        <button 
          onClick={handleSubscribe} 
          disabled={isLoading}
          className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold py-3 px-8 rounded-xl transition-all whitespace-nowrap text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20"
        >
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

// --- LA PAGE D'ACCUEIL ---
function Accueil() {
  const navigate = useNavigate();
  const [isGoldUser, setIsGoldUser] = useState(false);
  const [dailyDeals, setDailyDeals] = useState([]);

  useEffect(() => {
    // Vérification de la session
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        const { data: userData } = await supabase
          .from('Users')
          .select('is_gold')
          .eq('email', session.user.email)
          .maybeSingle();

        if (userData && userData.is_gold === true) {
          setIsGoldUser(true);
        } else {
          setIsGoldUser(false);
        }
      }
    };
    checkSession();

    // Calcul des 3 offres du jour basé sur la date !
    const dayOfYear = Math.floor(Date.now() / 86400000); // Nombre de jours depuis 1970
    setDailyDeals([
      FOMO_DEALS[dayOfYear % FOMO_DEALS.length],
      FOMO_DEALS[(dayOfYear + 1) % FOMO_DEALS.length],
      FOMO_DEALS[(dayOfYear + 2) % FOMO_DEALS.length]
    ]);

  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.clear();
    setIsGoldUser(false);
    window.location.reload(); 
  };

  const scrollToForm = () => {
    const formElement = document.getElementById('capture-form');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setTimeout(() => document.getElementById('email-input')?.focus(), 500);
    }
  };

  const scrollToPricing = () => {
    const pricingElement = document.getElementById('pricing-section');
    if (pricingElement) {
      pricingElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleLiveOffersClick = () => {
    const hasAccess = localStorage.getItem('flyradar_free_access');
    if (hasAccess === 'true') {
      navigate('/vols-pas-chers'); 
    } else {
      scrollToForm(); 
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans overflow-x-hidden selection:bg-blue-100 selection:text-blue-900">
      
      {/* HEADER DYNAMIQUE */}
      <header className="py-3 px-4 md:h-20 md:px-8 flex flex-wrap md:flex-nowrap items-center justify-between bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50 gap-y-3">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
            <Target className="text-blue-600" size={24} strokeWidth={2.5} />
            <span className="text-xl md:text-2xl tracking-tight text-slate-900">
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

        {/* --- LE GROUPE DE BOUTONS --- */}
        <div className="flex items-center gap-3 lg:gap-6 w-full md:w-auto justify-end overflow-x-auto pb-1 md:pb-0 scrollbar-hide">
          
          <button onClick={() => navigate('/aide')} className="flex items-center gap-1.5 text-[10px] font-black text-slate-500 hover:text-slate-700 transition-colors uppercase tracking-[0.1em] md:tracking-[0.2em] whitespace-nowrap">
            <HelpCircle size={14} className="text-slate-400" /> Aide
          </button>

          {isGoldUser ? (
            <div className="flex items-center gap-3 lg:gap-6">
              <button 
                onClick={handleLogout}
                className="text-[10px] font-black text-slate-500 hover:text-red-500 transition-colors uppercase tracking-[0.1em] whitespace-nowrap"
              >
                Déconnexion
              </button>

              <button 
                onClick={() => navigate('/vols-pas-chers')} 
                className="flex text-xs md:text-sm font-bold text-slate-700 hover:text-slate-900 transition-colors border border-slate-300 px-3 md:px-5 py-1.5 md:py-2 rounded-full hover:bg-slate-50 whitespace-nowrap"
              >
                Offres en direct
              </button>

              <button 
                onClick={() => navigate('/vols-pas-chers', { state: { openVipModal: true } })} 
                className="bg-slate-900 text-amber-400 font-bold px-3 md:px-5 py-1.5 md:py-2 rounded-full flex items-center gap-1.5 text-xs shadow-sm hover:bg-slate-800 transition-colors border border-amber-500/30 whitespace-nowrap"
              >
                <Crown size={14} /> VIP
              </button>
            </div>
          ) : (
            <>
              <button onClick={() => navigate('/connexion')} className="flex items-center gap-1.5 text-xs md:text-sm font-bold text-amber-600 hover:text-amber-700 transition-colors border border-amber-500 px-3 md:px-5 py-1.5 md:py-2 rounded-full hover:bg-amber-50 whitespace-nowrap">
                <Crown size={14} className="md:w-4 md:h-4" /> Connexion
              </button>
              
              <button onClick={handleLiveOffersClick} className="flex text-xs md:text-sm font-bold text-slate-700 hover:text-slate-900 transition-colors border border-slate-300 px-3 md:px-5 py-1.5 md:py-2 rounded-full hover:bg-slate-50 whitespace-nowrap">
                Offres en direct
              </button>
              
              <button onClick={() => navigate('/inscription-gold')} className="text-xs md:text-sm font-bold text-white bg-amber-500 hover:bg-amber-400 transition-colors border border-amber-600/20 px-3 md:px-5 py-1.5 md:py-2 rounded-full flex items-center gap-1.5 shadow-sm whitespace-nowrap">
                <Crown size={14} className="md:w-4 md:h-4" /> Go Gold
              </button>
            </>
          )}
        </div>
      </header>

      {/* ACTE 1 : HERO */}
      <section className="relative min-h-[75vh] flex flex-col items-center justify-center pt-20 pb-32 px-4 text-center overflow-hidden">
        <div className="absolute inset-0 z-0 bg-slate-900">
          <div
            className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000 blur-[1px] scale-110"
            style={{ 
              backgroundImage: `url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1920&q=80')`,
              opacity: 0.65, 
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/60 via-slate-900/40 to-[#F8FAFC]" />
        </div>

        <div className="relative z-10 w-full max-w-4xl mx-auto flex flex-col items-center text-white mb-8">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black mb-6 tracking-tight leading-[1.1] drop-shadow-lg text-white">
            Économisez jusqu'à <span className="text-blue-600">90%</span><br />sur vos vols.
          </h1>
          <p className="text-slate-100 text-base md:text-xl mb-10 max-w-2xl font-medium leading-relaxed drop-shadow-md">
            Nos agents traquent les erreurs de prix en temps réel. Activez votre radar, recevez vos alertes et voyagez pas cher.
          </p>
          <CaptureForm navigate={navigate} />
        </div>
      </section>

      {/* ACTE 2 : COMMENT ÇA MARCHE */}
      <section className="relative z-20 -mt-32 px-4 md:px-6 max-w-7xl mx-auto w-full mb-24">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-6 md:p-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 text-center">
            <div className="flex flex-col items-center">
              <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-4 border border-blue-100">
                <Radar size={28} />
              </div>
              <h3 className="font-bold text-slate-900 text-lg mb-2">1. Activez votre radar</h3>
              <p className="text-slate-500 text-sm leading-relaxed px-4">Indiquez votre aéroport de départ et renseignez votre adresse email. Nos agents s'occupent de tout.</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-4 border border-blue-100">
                <Server size={28} />
              </div>
              <h3 className="font-bold text-slate-900 text-lg mb-2">2. Nos agents scannent 24/7</h3>
              <p className="text-slate-500 text-sm leading-relaxed px-4">Nous traquons les baisses de prix secrètes et les erreurs des compagnies en temps réel.</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-4 border border-blue-100">
                <Zap size={28} />
              </div>
              <h3 className="font-bold text-slate-900 text-lg mb-2">3. Réservez vite</h3>
              <p className="text-slate-500 text-sm leading-relaxed px-4">Recevez l'alerte par email et réservez directement avant la correction du prix.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ACTE 3 : FOMO VOLS EXPIRÉS (DYNAMIQUE) */}
      <section className="py-16 md:py-20 bg-slate-50 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-3 tracking-tight">Ce que nos membres ont reçu récemment.</h2>
            <p className="text-slate-500 text-base italic">Ne laissez plus ces opportunités s'envoler sans vous.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {dailyDeals.map((deal, index) => {
              // On crée une petite rotation différente pour l'étiquette "EXPIRED" selon l'index
              const rotations = ['rotate-[-20deg]', 'rotate-[-15deg]', 'rotate-[-25deg]'];
              
              return (
                <div key={index} className="group bg-white rounded-2xl p-4 border border-slate-200 relative shadow-sm transition-all duration-500 hover:shadow-xl hover:-translate-y-1">
                  <div className="absolute inset-0 bg-slate-900/40 z-10 rounded-2xl group-hover:opacity-0 transition-opacity flex items-center justify-center overflow-hidden">
                    <div className={`border-4 border-red-600 text-red-600 font-black text-4xl px-4 py-2 uppercase opacity-90 scale-110 ${rotations[index]}`}>
                      EXPIRED
                    </div>
                  </div>
                  {/* L'image pointe directement vers ta banque Supabase ! */}
                  <img 
                    src={`${SUPABASE_IMAGE_URL}/${deal.code}.jpg`} 
                    className="w-full h-44 object-cover rounded-xl mb-4 grayscale group-hover:grayscale-0 transition-all duration-700" 
                    alt={deal.city} 
                    onError={(e) => { e.target.src = `https://source.unsplash.com/800x450/?${encodeURIComponent(deal.city)},travel` }}
                  />
                  <div className="flex justify-between items-start px-1">
                    <div>
                      <h3 className="font-bold text-slate-900">{deal.city}</h3>
                      <p className="text-xs text-slate-500">{deal.type}</p>
                    </div>
                    <div className="text-right font-black text-slate-900 text-xl">{deal.price}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ACTE 4 : PRICING GOLD */}
      <section id="pricing-section" className="py-20 md:py-28 bg-slate-900 relative">
        <div className="max-w-5xl mx-auto px-4 md:px-6 relative z-10 text-center text-white">
          <h2 className="text-3xl md:text-5xl font-black mb-16 tracking-tight leading-tight">Choisissez votre avantage.</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-14 max-w-4xl mx-auto">
            
            {/* GRATUIT */}
            <div className="bg-white rounded-[2rem] p-10 flex flex-col text-left text-slate-900">
              <h3 className="text-2xl font-black mb-2 text-slate-900">Radar Gratuit</h3>
              <p className="text-slate-500 text-sm mb-8">Testez l'efficacité de nos agents.</p>
              <div className="mb-8 font-black text-5xl">0€<span className="text-slate-400 text-lg">/mois</span></div>
              <ul className="space-y-4 mb-auto text-sm font-semibold">
                <li className="flex gap-3"><Check className="text-blue-500 shrink-0" /> Bons plans Éco (max 50% de réduction)</li>
                <li className="flex gap-3"><Check className="text-blue-500 shrink-0" /> 1 alerte maximum activée</li>
                <li className="flex gap-3 text-amber-600"><AlertCircle className="shrink-0" /> <span className="underline">4h de retard vs Gold</span></li>
              </ul>
              <button onClick={scrollToForm} className="mt-10 bg-slate-100 py-4 rounded-xl font-black uppercase text-xs tracking-widest hover:bg-slate-200 transition-colors text-slate-800">S'inscrire</button>
            </div>

            {/* GOLD */}
            <div className="bg-amber-500 rounded-[2rem] p-1 shadow-2xl transform md:-translate-y-4">
              <div className="bg-slate-950 rounded-[1.8rem] p-10 h-full flex flex-col text-left">
                <h3 className="text-2xl font-black mb-1 flex items-center gap-2 text-white">FlyRadar Gold <Crown size={20} className="text-amber-500" /></h3>
                <p className="text-amber-400 text-sm font-bold mb-4">Économisez 400€+ sur votre prochain vol.</p>
                <div className="mb-4 font-black text-5xl text-white">9,99€<span className="text-slate-500 text-lg">/mois</span></div>
                <p className="text-slate-500 text-xs font-bold mb-8 uppercase tracking-widest">Ou <span className="text-amber-500">89,90€ /an</span> (3 mois offerts)</p>
                <ul className="space-y-4 mb-auto text-sm font-semibold text-slate-300">
                  <li className="flex gap-3"><Check className="text-amber-500 shrink-0" /> <span className="text-white">Instantané :</span> Alerte à la seconde</li>
                  <li className="flex gap-3"><Check className="text-amber-500 shrink-0" /> Business & Première incluses</li>
                  <li className="flex gap-3"><Check className="text-amber-500 shrink-0" /> Alertes illimitées</li>
                  <li className="flex gap-3 text-white"><Check className="text-green-500 shrink-0" /> Remises jusqu'à 90%</li>
                </ul>
                <button onClick={() => navigate('/inscription-gold')} className="mt-10 bg-amber-500 py-4 rounded-xl font-black uppercase text-xs tracking-widest text-slate-950 flex items-center justify-center gap-2 hover:bg-amber-400 transition-colors">
                  <Crown size={16} /> Go Gold
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ACTE 5 : AVIS CLIENTS */}
      <section className="py-24 bg-white px-4 md:px-6 max-w-7xl mx-auto w-full">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-3 tracking-tight">Ils voyagent avec une longueur d'avance.</h2>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 text-xl font-bold text-slate-900">
            <span>Évaluation</span> 
            <div className="flex gap-1 text-green-500">
              <Star size={20} fill="currentColor" /><Star size={20} fill="currentColor" /><Star size={20} fill="currentColor" /><Star size={20} fill="currentColor" /><Star size={20} fill="currentColor" />
            </div>
            <span className="sm:ml-2 text-slate-400 text-sm font-medium">4.9/5 sur Trustpilot</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          <div className="p-8 border-t border-slate-100">
            <p className="text-slate-700 italic mb-6">"Un A/R pour Tokyo à 310€ ! FlyRadar m'a envoyé l'alerte, j'ai réservé 2 minutes plus tard. Nos agents sont redoutables."</p>
            <div className="flex items-center gap-4">
              <img src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=100&q=80" className="w-10 h-10 rounded-full object-cover" alt="Julien" />
              <div><p className="text-sm font-bold">Julien M.</p><p className="text-[10px] text-slate-400">Membre depuis 6 mois</p></div>
            </div>
          </div>
          <div className="p-8 border-t border-slate-100">
            <p className="text-slate-700 italic mb-6">"Le Gold m'a permis de voyager en Business vers NYC pour le prix de l'éco. C'est presque indécent tellement ça marche."</p>
            <div className="flex items-center gap-4">
              <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80" className="w-10 h-10 rounded-full object-cover" alt="Sophie" />
              <div><p className="text-sm font-bold text-amber-600">Sophie L. (Gold)</p><p className="text-[10px] text-slate-400">Membre Gold</p></div>
            </div>
          </div>
          <div className="p-8 border-t border-slate-100">
            <p className="text-slate-700 italic mb-6">"Je ne cherche plus jamais de vols. J'attends que le radar clignote et je décide de ma destination comme ça."</p>
            <div className="flex items-center gap-4">
              <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80" className="w-10 h-10 rounded-full object-cover" alt="Thomas" />
              <div><p className="text-sm font-bold">Thomas R.</p><p className="text-[10px] text-slate-400">Membre depuis 1 an</p></div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER AVEC COMPLIANCE */}
      <footer className="py-12 text-center border-t border-slate-200 bg-white flex flex-col items-center justify-center px-4">
        <p className="text-slate-400 text-xs font-black uppercase tracking-[0.3em] mb-4">© 2026 FlyRadar aviation • No limits</p>
        
        <div className="flex flex-wrap justify-center gap-4 text-xs font-medium text-slate-400 mb-6 leading-loose">
          <button onClick={() => navigate('/aide')} className="hover:text-slate-700 transition-colors">Aide / FAQ</button>
          <span>|</span>
          <button onClick={() => navigate('/mentions-legales')} className="hover:text-slate-700 transition-colors">Mentions Légales</button>
          <span>|</span>
          <button onClick={() => navigate('/confidentialite')} className="hover:text-slate-700 transition-colors">Politique de Confidentialité</button>
          <span>|</span>
          <button onClick={() => navigate('/cgv')} className="hover:text-slate-700 transition-colors">CGV & CGU</button>
        </div>

        <p className="text-[10px] lowercase font-medium text-slate-300 italic max-w-lg">
          Témoignages basés sur les retours d'expérience de nos utilisateurs bêta. Les réductions affichées dépendent des fluctuations des compagnies aériennes.
        </p>
      </footer>

    </div>
  );
}

// --- LE CŒUR DE LA NAVIGATION ---
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
