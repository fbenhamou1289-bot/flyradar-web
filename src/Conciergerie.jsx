import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Target, Search, MapPin, Calendar, ArrowLeft, Check, ShieldCheck, UserCheck, Clock, Send, CalendarDays, Luggage, AlertCircle, Loader2 } from 'lucide-react';
import { supabase } from './VolsPasChers'; 

// 🌍 MÉGA-LISTE ENRICHIE AVEC DES SEUILS DE PRIX RÉALISTES
const DESTINATIONS_LIST = [
  // Europe & Proche (Seuil très bas)
  { ville: "Paris - Tous aéroports", code: "PAR", budget_mini: 40 },
  { ville: "Londres - Tous aéroports", code: "LON", budget_mini: 40 },
  { ville: "Milan - Tous aéroports", code: "MIL", budget_mini: 40 },
  { ville: "Rome - Tous aéroports", code: "ROM", budget_mini: 40 },
  { ville: "Berlin - Tous aéroports", code: "BER", budget_mini: 40 },
  { ville: "Madrid (Espagne)", code: "MAD", budget_mini: 40 },
  { ville: "Barcelone (Espagne)", code: "BCN", budget_mini: 40 },
  { ville: "Malaga (Espagne)", code: "AGP", budget_mini: 40 },
  { ville: "Palma de Majorque (Espagne)", code: "PMI", budget_mini: 40 },
  { ville: "Ibiza (Espagne)", code: "IBZ", budget_mini: 50 },
  { ville: "Lisbonne (Portugal)", code: "LIS", budget_mini: 40 },
  { ville: "Porto (Portugal)", code: "OPO", budget_mini: 40 },
  { ville: "Faro (Algarve, Portugal)", code: "FAO", budget_mini: 40 },
  { ville: "Amsterdam (Pays-Bas)", code: "AMS", budget_mini: 50 },
  { ville: "Bruxelles (Belgique)", code: "BRU", budget_mini: 40 },
  { ville: "Genève (Suisse)", code: "GVA", budget_mini: 50 },
  { ville: "Zurich (Suisse)", code: "ZRH", budget_mini: 60 },
  { ville: "Vienne (Autriche)", code: "VIE", budget_mini: 50 },
  { ville: "Prague (Rép. Tchèque)", code: "PRG", budget_mini: 50 },
  { ville: "Budapest (Hongrie)", code: "BUD", budget_mini: 40 },
  { ville: "Varsovie (Pologne)", code: "WAW", budget_mini: 40 },
  { ville: "Copenhague (Danemark)", code: "CPH", budget_mini: 50 },
  { ville: "Stockholm (Suède)", code: "ARN", budget_mini: 50 },
  { ville: "Oslo (Norvège)", code: "OSL", budget_mini: 50 },
  { ville: "Athènes (Grèce)", code: "ATH", budget_mini: 60 },
  { ville: "Santorin (Grèce)", code: "JTR", budget_mini: 80 },
  { ville: "Mykonos (Grèce)", code: "JMK", budget_mini: 80 },
  { ville: "Héraklion (Crète, Grèce)", code: "HER", budget_mini: 60 },
  { ville: "Dubrovnik (Croatie)", code: "DBV", budget_mini: 60 },
  { ville: "Split (Croatie)", code: "SPU", budget_mini: 50 },
  { ville: "Malte", code: "MLA", budget_mini: 40 },
  { ville: "Larnaca (Chypre)", code: "LCA", budget_mini: 60 },
  { ville: "Dublin (Irlande)", code: "DUB", budget_mini: 40 },
  { ville: "Reykjavik (Islande)", code: "KEF", budget_mini: 100 },
  
  // France
  { ville: "Paris - Orly", code: "ORY", budget_mini: 40 },
  { ville: "Paris - Charles de Gaulle", code: "CDG", budget_mini: 40 },
  { ville: "Paris - Beauvais", code: "BVA", budget_mini: 20 },
  { ville: "Lyon - Saint-Exupéry", code: "LYS", budget_mini: 40 },
  { ville: "Marseille - Provence", code: "MRS", budget_mini: 40 },
  { ville: "Nice - Côte d'Azur", code: "NCE", budget_mini: 40 },
  { ville: "Toulouse - Blagnac", code: "TLS", budget_mini: 40 },
  { ville: "Bordeaux - Mérignac", code: "BOD", budget_mini: 40 },
  { ville: "Nantes - Atlantique", code: "NTE", budget_mini: 40 },
  { ville: "Lille - Lesquin", code: "LIL", budget_mini: 40 },
  { ville: "Strasbourg", code: "SXB", budget_mini: 40 },
  { ville: "Montpellier", code: "MPL", budget_mini: 40 },
  { ville: "Biarritz", code: "BIQ", budget_mini: 40 },
  { ville: "Ajaccio", code: "AJA", budget_mini: 60 },
  { ville: "Bastia", code: "BIA", budget_mini: 60 },

  // Maghreb & Canaries
  { ville: "Marrakech (Maroc)", code: "RAK", budget_mini: 50 },
  { ville: "Casablanca (Maroc)", code: "CMN", budget_mini: 80 },
  { ville: "Agadir (Maroc)", code: "AGA", budget_mini: 50 },
  { ville: "Alger (Algérie)", code: "ALG", budget_mini: 60 },
  { ville: "Oran (Algérie)", code: "ORN", budget_mini: 60 },
  { ville: "Tunis (Tunisie)", code: "TUN", budget_mini: 60 },
  { ville: "Djerba (Tunisie)", code: "DJE", budget_mini: 80 },
  { ville: "Tenerife (Îles Canaries)", code: "TFS", budget_mini: 100 },
  { ville: "Lanzarote (Îles Canaries)", code: "ACE", budget_mini: 100 },
  { ville: "Fuerteventura (Îles Canaries)", code: "FUE", budget_mini: 100 },
  { ville: "Gran Canaria (Îles Canaries)", code: "LPA", budget_mini: 100 },
  { ville: "Madère (Portugal)", code: "FNC", budget_mini: 100 },

  // Moyen-Orient & Egypte
  { ville: "Istanbul - Tous aéroports", code: "IST", budget_mini: 100 },
  { ville: "Hurghada (Égypte)", code: "HRG", budget_mini: 150 },
  { ville: "Charm el-Cheikh (Égypte)", code: "SSH", budget_mini: 150 },
  { ville: "Le Caire (Égypte)", code: "CAI", budget_mini: 180 },
  { ville: "Dubaï (Emirats)", code: "DXB", budget_mini: 250 },

  // Afrique (Moyen & Long Courrier)
  { ville: "Dakar (Sénégal)", code: "DSS", budget_mini: 300 },
  { ville: "Sal (Cap-Vert)", code: "SID", budget_mini: 250 },
  { ville: "Boa Vista (Cap-Vert)", code: "BVC", budget_mini: 250 },
  { ville: "Abidjan (Côte d'Ivoire)", code: "ABJ", budget_mini: 350 },
  { ville: "Zanzibar (Tanzanie)", code: "ZNZ", budget_mini: 450 },
  { ville: "Johannesburg (Afr. du Sud)", code: "JNB", budget_mini: 450 },
  { ville: "Le Cap (Afr. du Sud)", code: "CPT", budget_mini: 450 },
  { ville: "Saint-Denis (La Réunion)", code: "RUN", budget_mini: 450 },
  { ville: "Port-Louis (Île Maurice)", code: "MRU", budget_mini: 500 },
  { ville: "Mahé (Seychelles)", code: "SEZ", budget_mini: 500 },

  // Amériques & Caraïbes
  { ville: "New York - Tous aéroports", code: "NYC", budget_mini: 300 },
  { ville: "New York - JFK (USA)", code: "JFK", budget_mini: 300 },
  { ville: "Miami (USA)", code: "MIA", budget_mini: 350 },
  { ville: "Los Angeles (USA)", code: "LAX", budget_mini: 400 },
  { ville: "San Francisco (USA)", code: "SFO", budget_mini: 400 },
  { ville: "Las Vegas (USA)", code: "LAS", budget_mini: 400 },
  { ville: "Washington - Tous aéroports", code: "WAS", budget_mini: 350 },
  { ville: "Montréal - Tous aéroports", code: "YMQ", budget_mini: 300 },
  { ville: "Toronto (Canada)", code: "YYZ", budget_mini: 350 },
  { ville: "Cancún (Mexique)", code: "CUN", budget_mini: 400 },
  { ville: "Pointe-à-Pitre (Guadeloupe)", code: "PTP", budget_mini: 350 },
  { ville: "Fort-de-France (Martinique)", code: "FDF", budget_mini: 350 },
  { ville: "Punta Cana (Rép. Dom)", code: "PUJ", budget_mini: 450 },
  { ville: "La Havane (Cuba)", code: "HAV", budget_mini: 450 },
  { ville: "Bogota (Colombie)", code: "BOG", budget_mini: 500 },
  { ville: "Sao Paulo - Tous aéroports", code: "SAO", budget_mini: 500 },
  { ville: "Rio de Janeiro (Brésil)", code: "GIG", budget_mini: 500 },
  { ville: "Buenos Aires - Tous aéroports", code: "BUE", budget_mini: 600 },

  // Asie & Océanie
  { ville: "Bangkok - Tous aéroports", code: "BKK", budget_mini: 400 },
  { ville: "Phuket (Thaïlande)", code: "HKT", budget_mini: 450 },
  { ville: "Koh Samui (Thaïlande)", code: "USM", budget_mini: 500 },
  { ville: "Tokyo - Tous aéroports", code: "TYO", budget_mini: 500 },
  { ville: "Tokyo - Haneda (Japon)", code: "HND", budget_mini: 500 },
  { ville: "Tokyo - Narita (Japon)", code: "NRT", budget_mini: 500 },
  { ville: "Malé (Maldives)", code: "MLE", budget_mini: 450 },
  { ville: "Hong Kong (Chine)", code: "HKG", budget_mini: 450 },
  { ville: "Pékin (Chine)", code: "PEK", budget_mini: 450 },
  { ville: "Shanghai (Chine)", code: "PVG", budget_mini: 450 },
  { ville: "Singapour", code: "SIN", budget_mini: 450 },
  { ville: "Bali - Denpasar (Indonésie)", code: "DPS", budget_mini: 500 },
  { ville: "Séoul (Corée du Sud)", code: "ICN", budget_mini: 450 },
  { ville: "Hô Chi Minh-Ville (Vietnam)", code: "SGN", budget_mini: 450 },
  { ville: "Kuala Lumpur (Malaisie)", code: "KUL", budget_mini: 400 },
  { ville: "Sydney (Australie)", code: "SYD", budget_mini: 700 },
  { ville: "Melbourne (Australie)", code: "MEL", budget_mini: 700 },
  { ville: "Auckland (Nouv. Zélande)", code: "AKL", budget_mini: 800 },
  { ville: "Papeete (Tahiti)", code: "PPT", budget_mini: 1000 },
  { ville: "Nouméa (Nouv. Calédonie)", code: "NOU", budget_mini: 1000 }
];

export default function Conciergerie() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [seuils, setSeuils] = useState({}); 
  
  const [missionId, setMissionId] = useState(null); 
  const [hasCredit, setHasCredit] = useState(false);
  
  const dateRetourRef = useRef(null);
  
  const [formData, setFormData] = useState({
    origine: '',
    destination: '',
    date_depart: '',
    date_retour: '',
    flexibilite: 'Dates exactes',
    passagers: 1, 
    budget_max: '', 
    bagage_soute: false, 
    preferences_escales: 'Peu importe',
    client_email: ''
  });

  const [suggestionsOrigine, setSuggestionsOrigine] = useState([]);
  const [suggestionsDest, setSuggestionsDest] = useState([]);

  // UX Pro : Suivi si la sélection est valide depuis la liste
  const [isValidOrigine, setIsValidOrigine] = useState(false);
  const [isValidDest, setIsValidDest] = useState(false);

  useEffect(() => {
    async function chargerConfig() {
      const { data } = await supabase.from('destinations_config').select('*');
      if (data) {
        const mapping = {};
        data.forEach(item => mapping[item.code_iata] = item.budget_mini);
        setSeuils(mapping);
      }
    }
    chargerConfig();
  }, []);

  const verifierCredit = async (email) => {
    if (!email || !email.includes('@')) return;
    try {
      const { data } = await supabase
        .from('Users')
        .select('credits_conciergerie')
        .eq('email', email.toLowerCase().trim())
        .maybeSingle();

      if (data && data.credits_conciergerie > 0) {
        setHasCredit(true);
      } else {
        setHasCredit(false);
      }
    } catch (e) { console.error("Erreur vérif crédit", e); }
  };

  const extraireIATA = (texte) => {
    const match = texte.trim().match(/\(([A-Z]{3})\)$/);
    return match ? match[1] : texte.trim().toUpperCase(); 
  };

  const gererSaisieOrigine = (val) => {
    setFormData({...formData, origine: val});
    setIsValidOrigine(false); // Dès qu'il tape, on annule la validité
    
    if (val.length > 1) {
      const filtres = DESTINATIONS_LIST.filter(d => 
        d.ville.toLowerCase().includes(val.toLowerCase()) || 
        d.code.toLowerCase().includes(val.toLowerCase())
      ).slice(0, 6);
      setSuggestionsOrigine(filtres);
    } else {
      setSuggestionsOrigine([]);
    }
  };

  const gererSaisieDest = (val) => {
    setFormData({...formData, destination: val});
    setIsValidDest(false); // Dès qu'il tape, on annule la validité
    
    if (val.length > 1) {
      const filtres = DESTINATIONS_LIST.filter(d => 
        d.ville.toLowerCase().includes(val.toLowerCase()) || 
        d.code.toLowerCase().includes(val.toLowerCase())
      ).slice(0, 6);
      setSuggestionsDest(filtres);
    } else {
      setSuggestionsDest([]);
    }
  };

  const validerMission = (destCode, budgetTotal, passagers, aBagage) => {
    const fraisFlyRadar = 38.90; 
    const provisionBagage = aBagage ? 120 : 0; 
    const budgetRestantParPers = (budgetTotal / passagers) - fraisFlyRadar - provisionBagage;
    
    let prixMiniRequis = seuils[destCode];
    
    if (!prixMiniRequis) {
        const destLocale = DESTINATIONS_LIST.find(d => d.code === destCode);
        if (destLocale && destLocale.budget_mini) {
            prixMiniRequis = destLocale.budget_mini;
        } else {
            prixMiniRequis = 150; 
        }
    }
    
    if (budgetRestantParPers < prixMiniRequis) {
        const totalRequis = Math.ceil((prixMiniRequis + fraisFlyRadar + provisionBagage) * passagers);
        return `🚨 Budget trop faible. Pour que la recherche soit réaliste, le budget total minimum doit être d'au moins ${totalRequis}€ (couvrant le vol estimé à ${prixMiniRequis}€/pers + nos frais${aBagage ? ' + les bagages' : ''}).`;
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    
    if (!isValidOrigine || !isValidDest) {
        setErrorMessage("Veuillez sélectionner le départ et l'arrivée depuis la liste proposée.");
        return;
    }
    
    const codeOrigine = extraireIATA(formData.origine);
    const codeDest = extraireIATA(formData.destination);
    
    const erreur = validerMission(codeDest, parseInt(formData.budget_max), formData.passagers, formData.bagage_soute);
    if (erreur) { setErrorMessage(erreur); return; }

    setIsSubmitting(true);
    try {
      const statutDossier = hasCredit ? 'en_attente' : 'attente_paiement';

      const { data, error } = await supabase.from('missions_conciergerie').insert([{
        client_email: formData.client_email,
        origine: codeOrigine,           
        destination: codeDest,   
        date_depart: formData.date_depart,
        date_retour: formData.date_retour,
        flexibilite: formData.flexibilite,
        budget_max: parseInt(formData.budget_max),
        passagers: parseInt(formData.passagers),
        bagage_soute: formData.bagage_soute,
        preferences_escales: formData.preferences_escales,
        statut: statutDossier
      }]).select();

      if (error) throw error;
      
      setMissionId(data[0].id);

      if (hasCredit) {
         const emailClean = formData.client_email.toLowerCase().trim();
         const { data: userData } = await supabase.from('Users').select('credits_conciergerie').eq('email', emailClean).single();
         if (userData) {
             await supabase.from('Users').update({ credits_conciergerie: userData.credits_conciergerie - 1 }).eq('email', emailClean);
         }
      }

      setSuccess(true);
      
    } catch (error) {
      setErrorMessage("Erreur lors de l'envoi. Réessayez.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    const lienPaiementStripe = `https://buy.stripe.com/bJe5kC99SgEi0Eh2LeeQM02?prefilled_email=${encodeURIComponent(formData.client_email)}&client_reference_id=${missionId}`;

    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white p-10 rounded-[2rem] shadow-xl max-w-sm text-center border border-slate-100">
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-5">
            <Check size={32} strokeWidth={3} />
          </div>
          
          {hasCredit ? (
            <>
              <h2 className="text-xl font-black text-slate-900 mb-3">Crédit VIP Appliqué ! 🎁</h2>
              <p className="text-sm text-slate-500 mb-6">
                Votre recherche est 100% gratuite. Votre Agent Sniper est déjà en cours de traque, vous recevrez les résultats par e-mail.
              </p>
              <button onClick={() => navigate('/')} className="block w-full bg-green-600 text-white text-sm font-bold py-4 px-6 rounded-xl shadow-lg hover:bg-green-700 transition-colors">
                Retour à l'accueil
              </button>
            </>
          ) : (
            <>
              <h2 className="text-xl font-black text-slate-900 mb-3">Dossier pré-validé !</h2>
              <p className="text-sm text-slate-500 mb-6">
                Vos critères sont réalistes. Il ne reste plus qu'à régler l'acompte de 9,90€ pour lancer notre Agent Sniper.
              </p>
              <a href={lienPaiementStripe} className="block w-full bg-blue-600 text-white text-sm font-bold py-4 px-6 rounded-xl shadow-lg hover:bg-blue-700 transition-colors">
                Payer 9,90€ par Carte
              </a>
            </>
          )}

          <p className="text-[10px] text-slate-400 mt-4 flex items-center justify-center gap-1">
            <ShieldCheck size={12} /> Paiement 100% sécurisé par Stripe
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <header className="h-16 px-6 flex items-center justify-between bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="flex items-center gap-1.5 cursor-pointer" onClick={() => navigate('/')}>
          <Target className="text-blue-600" size={20} strokeWidth={2.5} />
          <span className="font-black text-lg tracking-tight">Fly<span className="text-blue-600">Radar</span></span>
        </div>
        <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-slate-900 transition-colors">
          Retour <ArrowLeft size={16} className="rotate-180" />
        </button>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
        
        <div className="lg:sticky lg:top-24">
          <div className="inline-flex items-center gap-1.5 bg-blue-100 text-blue-800 font-bold text-[10px] uppercase tracking-widest px-3 py-1.5 rounded-full mb-5">
            <Target size={12} /> Service Conciergerie
          </div>
          
          <h1 className="text-3xl lg:text-4xl font-black leading-tight mb-6">
            <span className="text-blue-600">Ne cherchez plus.</span><br/>
            Nos agents le font pour vous.
          </h1>
          <p className="text-base text-slate-500 mb-10 leading-relaxed">
            Déléguez votre recherche à nos experts. Nous utilisons des algorithmes professionnels pour dénicher les meilleures failles tarifaires. Vous fixez votre budget maximum total, nos frais sont inclus dedans.
          </p>

          <div className="grid grid-cols-1 gap-4 mb-10">
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex gap-3.5 items-start transition-all hover:shadow-md">
              <div className="text-blue-600 mt-0.5 shrink-0"><UserCheck size={22} strokeWidth={2.5} /></div>
              <div>
                <h4 className="font-bold text-base text-slate-950">1. Lancement (9,90€)</h4>
                <p className="text-slate-600 text-xs mt-1 leading-relaxed">Frais de dossier fixes pour activer immédiatement votre robot traqueur surpuissant.</p>
              </div>
            </div>
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex gap-3.5 items-start transition-all hover:shadow-md">
              <div className="text-blue-600 mt-0.5 shrink-0"><Clock size={22} strokeWidth={2.5} /></div>
              <div>
                <h4 className="font-bold text-base text-slate-950">2. La Traque (72h max)</h4>
                <p className="text-slate-600 text-xs mt-1 leading-relaxed">Le robot scanne les prix en continu et ne s'arrête que s'il bat votre budget exigé.</p>
              </div>
            </div>
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex gap-3.5 items-start transition-all hover:shadow-md">
              <div className="text-blue-600 mt-0.5 shrink-0"><Check size={22} strokeWidth={2.5} /></div>
              <div>
                <h4 className="font-bold text-base text-slate-950">3. Succès (29€)</h4>
                <p className="text-slate-600 text-xs mt-1 leading-relaxed">Frais de succès facturés uniquement si nous trouvons un vol rentrant dans votre budget total.</p>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl flex items-start gap-3">
            <ShieldCheck size={20} className="text-blue-600 shrink-0 mt-0.5" />
            <p className="text-xs font-medium text-blue-950 leading-relaxed">
              <strong>Transparence absolue :</strong> Vos frais de recherche et de succès (38,90€) sont <b>inclus</b> dans le budget maximum que vous allez nous indiquer ci-contre.
            </p>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2rem] shadow-lg border border-slate-100">
          <h3 className="text-lg font-black mb-8 text-center text-slate-950">Briefez votre Agent Expert</h3>
          
          {errorMessage && (
            <div className="mb-6 bg-red-50 text-red-700 p-4 rounded-xl flex items-start gap-3 text-sm font-medium border border-red-100">
              <AlertCircle size={20} className="shrink-0 mt-0.5" />
              <p>{errorMessage}</p>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
                <div className="relative">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 block">Départ</label>
                  <div className="relative">
                    <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input type="text" autoComplete="off" value={formData.origine} onChange={(e) => gererSaisieOrigine(e.target.value)} required placeholder="Ex: Paris" className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-10 text-sm font-bold focus:bg-white outline-none" />
                    {isValidOrigine && <Check size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-green-500" />}
                  </div>
                  {suggestionsOrigine.length > 0 && (
                    <div className="absolute z-50 w-full bg-white border border-slate-200 rounded-xl mt-1 shadow-xl overflow-hidden">
                      {suggestionsOrigine.map((s, i) => (
                        <div key={i} onClick={() => { 
                            setFormData({...formData, origine: `${s.ville} (${s.code})`}); 
                            setSuggestionsOrigine([]);
                            setIsValidOrigine(true);
                        }} className="p-3 text-sm hover:bg-slate-50 cursor-pointer font-bold border-b border-slate-50 last:border-0">{s.ville} <span className="text-blue-600">({s.code})</span></div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="relative">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 block">Arrivée</label>
                  <div className="relative">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input type="text" autoComplete="off" value={formData.destination} onChange={(e) => gererSaisieDest(e.target.value)} required placeholder="Ex: Cap Vert" className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-10 text-sm font-bold focus:bg-white outline-none" />
                    {isValidDest && <Check size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-green-500" />}
                  </div>
                  {suggestionsDest.length > 0 && (
                    <div className="absolute z-50 w-full bg-white border border-slate-200 rounded-xl mt-1 shadow-xl overflow-hidden">
                      {suggestionsDest.map((s, i) => (
                        <div key={i} onClick={() => { 
                            setFormData({...formData, destination: `${s.ville} (${s.code})`}); 
                            setSuggestionsDest([]);
                            setIsValidDest(true);
                        }} className="p-3 text-sm hover:bg-slate-50 cursor-pointer font-bold border-b border-slate-50 last:border-0">{s.ville} <span className="text-blue-600">({s.code})</span></div>
                      ))}
                    </div>
                  )}
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 block">Aller</label>
                <div className="relative">
                  <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input type="date" required className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 text-sm font-bold outline-none" 
                    onChange={e => {
                      const val = e.target.value; 
                      setFormData({...formData, date_depart: val});
                      if (val.startsWith('202') && dateRetourRef.current) { 
                        dateRetourRef.current.focus(); 
                      }
                    }} 
                  />
                </div>
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 block">Retour</label>
                <div className="relative">
                  <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input type="date" required ref={dateRetourRef} className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 text-sm font-bold outline-none" onChange={e => setFormData({...formData, date_retour: e.target.value})} />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 block">Passagers</label>
                  <select className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm font-bold outline-none cursor-pointer" onChange={e => setFormData({...formData, passagers: parseInt(e.target.value)})}>
                    {[1,2,3,4,5,6,7,8,9].map(n => <option key={n} value={n}>{n} Personne{n>1?'s':''}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 block">Flexibilité</label>
                  <select className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm font-bold outline-none cursor-pointer" onChange={e => setFormData({...formData, flexibilite: e.target.value})}>
                    <option>Dates exactes (Aucune)</option>
                    <option>± 1 jour (Recommandé)</option>
                    <option>± 3 jours (Meilleurs prix)</option>
                  </select>
                </div>
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 block">Budget Max TOTAL (Pour tous les passagers)</label>
              <input 
                type="number" 
                required 
                placeholder="Ex: 850€ (Frais FlyRadar inclus)" 
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm font-bold focus:bg-white outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" 
                onChange={e => setFormData({...formData, budget_max: e.target.value})} 
              />
            </div>

            <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl flex items-center justify-between cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => setFormData({...formData, bagage_soute: !formData.bagage_soute})}>
              <div className="flex items-center gap-3">
                <Luggage size={20} className={formData.bagage_soute ? "text-blue-600" : "text-slate-400"} />
                <div>
                  <div className="text-sm font-bold text-slate-900">Inclure un bagage en soute</div>
                  <div className="text-[10px] text-slate-500 font-medium mt-0.5">Provision aller-retour (120€) déduite du budget billet.</div>
                </div>
              </div>
              <div className={`w-5 h-5 rounded border flex items-center justify-center ${formData.bagage_soute ? 'bg-blue-600 border-blue-600' : 'bg-white border-slate-300'}`}>
                {formData.bagage_soute && <Check size={14} className="text-white mx-auto mt-0.5" />}
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 block">Préférence de trajet</label>
              <select className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm font-bold outline-none focus:border-blue-600 focus:bg-white transition-all appearance-none cursor-pointer shadow-inner" onChange={e => setFormData({...formData, preferences_escales: e.target.value})}>
                <option>Peu importe (Meilleurs prix)</option>
                <option>1 escale maximum</option>
                <option>Vol direct uniquement</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 block">Email de contact</label>
              <input 
                type="email" 
                required 
                placeholder="Pour recevoir le résultat" 
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm font-bold outline-none" 
                onChange={e => setFormData({...formData, client_email: e.target.value})} 
                onBlur={e => verifierCredit(e.target.value)}
              />
            </div>

            <button disabled={isSubmitting} type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold py-4 rounded-xl shadow-lg transition-all disabled:opacity-50">
              {isSubmitting ? <Loader2 className="animate-spin mx-auto" /> : <><Send size={16} className="inline mr-2"/> {hasCredit ? "Lancer la recherche (Gratuit 🎁)" : "Lancer l'analyse du dossier"}</>}
            </button>
            
            <div className="text-center text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-3 flex items-center justify-center gap-1.5">
              <ShieldCheck size={12} className="text-blue-500"/> Étape 1 sur 2 (Vérification de faisabilité)
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
