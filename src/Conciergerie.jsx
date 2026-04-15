import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Target, Search, MapPin, Calendar, ArrowLeft, Check, ShieldCheck, UserCheck, Clock, Send, CalendarDays, Luggage, AlertCircle, Loader2 } from 'lucide-react';
import { supabase } from './VolsPasChers'; 

// 🌍 MÉGA-LISTE DES DESTINATIONS (150+)
const TOUTES_DESTINATIONS = [
  // --- MULTI-AÉROPORTS (Le choix pro) ---
  { ville: "Paris - Tous aéroports", code: "PAR" },
  { ville: "Londres - Tous aéroports", code: "LON" },
  { ville: "New York - Tous aéroports", code: "NYC" },
  { ville: "Tokyo - Tous aéroports", code: "TYO" },
  { ville: "Istanbul - Tous aéroports", code: "IST" },
  { ville: "Bangkok - Tous aéroports", code: "BKK" },
  { ville: "Milan - Tous aéroports", code: "MIL" },
  { ville: "Rome - Tous aéroports", code: "ROM" },
  { ville: "Berlin - Tous aéroports", code: "BER" },

  // --- FRANCE ---
  { ville: "Paris - Orly", code: "ORY" },
  { ville: "Paris - Charles de Gaulle", code: "CDG" },
  { ville: "Paris - Beauvais", code: "BVA" },
  { ville: "Lyon - Saint-Exupéry", code: "LYS" },
  { ville: "Marseille - Provence", code: "MRS" },
  { ville: "Nice - Côte d'Azur", code: "NCE" },
  { ville: "Toulouse - Blagnac", code: "TLS" },
  { ville: "Bordeaux - Mérignac", code: "BOD" },
  { ville: "Nantes - Atlantique", code: "NTE" },
  { ville: "Lille - Lesquin", code: "LIL" },
  { ville: "Strasbourg", code: "SXB" },
  { ville: "Montpellier", code: "MPL" },
  { ville: "Biarritz", code: "BIQ" },
  { ville: "Ajaccio", code: "AJA" },
  { ville: "Bastia", code: "BIA" },
  { ville: "Figari", code: "FSC" },

  // --- MAGHREB ---
  { ville: "Marrakech - Menara (Maroc)", code: "RAK" },
  { ville: "Casablanca (Maroc)", code: "CMN" },
  { ville: "Agadir (Maroc)", code: "AGA" },
  { ville: "Fès (Maroc)", code: "FEZ" },
  { ville: "Rabat (Maroc)", code: "RBA" },
  { ville: "Tanger (Maroc)", code: "TNG" },
  { ville: "Oujda (Maroc)", code: "OUD" },
  { ville: "Nador (Maroc)", code: "NDR" },
  { ville: "Alger (Algérie)", code: "ALG" },
  { ville: "Oran (Algérie)", code: "ORN" },
  { ville: "Tlemcen (Algérie)", code: "TLM" },
  { ville: "Constantine (Algérie)", code: "CZL" },
  { ville: "Annaba (Algérie)", code: "AAE" },
  { ville: "Tunis (Tunisie)", code: "TUN" },
  { ville: "Djerba (Tunisie)", code: "DJE" },
  { ville: "Monastir (Tunisie)", code: "MIR" },

  // --- EUROPE ---
  { ville: "Madrid (Espagne)", code: "MAD" },
  { ville: "Barcelone (Espagne)", code: "BCN" },
  { ville: "Malaga (Espagne)", code: "AGP" },
  { ville: "Séville (Espagne)", code: "SVQ" },
  { ville: "Palma de Majorque (Espagne)", code: "PMI" },
  { ville: "Ibiza (Espagne)", code: "IBZ" },
  { ville: "Lisbonne (Portugal)", code: "LIS" },
  { ville: "Porto (Portugal)", code: "OPO" },
  { ville: "Faro (Portugal)", code: "FAO" },
  { ville: "Amsterdam (Pays-Bas)", code: "AMS" },
  { ville: "Bruxelles (Belgique)", code: "BRU" },
  { ville: "Genève (Suisse)", code: "GVA" },
  { ville: "Zurich (Suisse)", code: "ZRH" },
  { ville: "Vienne (Autriche)", code: "VIE" },
  { ville: "Prague (Rép. Tchèque)", code: "PRG" },
  { ville: "Budapest (Hongrie)", code: "BUD" },
  { ville: "Varsovie (Pologne)", code: "WAW" },
  { ville: "Copenhague (Danemark)", code: "CPH" },
  { ville: "Stockholm (Suède)", code: "ARN" },
  { ville: "Oslo (Norvège)", code: "OSL" },
  { ville: "Athènes (Grèce)", code: "ATH" },
  { ville: "Héraklion - Crète", code: "HER" },
  { ville: "Santorin", code: "JTR" },
  { ville: "Mykonos", code: "JMK" },

  // --- ASIE & OCÉANIE ---
  { ville: "Hong Kong (Chine)", code: "HKG" },
  { ville: "Phuket (Thaïlande)", code: "HKT" },
  { ville: "Bangkok - Suvarnabhumi", code: "BKK" },
  { ville: "Singapour", code: "SIN" },
  { ville: "Bali - Denpasar (Indonésie)", code: "DPS" },
  { ville: "Tokyo - Haneda (Japon)", code: "HND" },
  { ville: "Tokyo - Narita (Japon)", code: "NRT" },
  { ville: "Séoul (Corée du Sud)", code: "ICN" },
  { ville: "Hô Chi Minh-Ville (Vietnam)", code: "SGN" },
  { ville: "Kuala Lumpur (Malaisie)", code: "KUL" },
  { ville: "Sydney (Australie)", code: "SYD" },
  { ville: "Melbourne (Australie)", code: "MEL" },

  // --- AMÉRIQUES ---
  { ville: "New York - JFK", code: "JFK" },
  { ville: "Miami (USA)", code: "MIA" },
  { ville: "Los Angeles (USA)", code: "LAX" },
  { ville: "San Francisco (USA)", code: "SFO" },
  { ville: "Las Vegas (USA)", code: "LAS" },
  { ville: "Montréal (Canada)", code: "YUL" },
  { ville: "Toronto (Canada)", code: "YYZ" },
  { ville: "Cancún (Mexique)", code: "CUN" },
  { ville: "Pointe-à-Pitre (Guadeloupe)", code: "PTP" },
  { ville: "Fort-de-France (Martinique)", code: "FDF" },
  { ville: "Punta Cana (Rép. Dom)", code: "PUJ" },
  { ville: "Saint-Denis (La Réunion)", code: "RUN" }
];

export default function Conciergerie() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [seuils, setSeuils] = useState({}); 
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

  // État pour les suggestions filtrées
  const [suggestionsOrigine, setSuggestionsOrigine] = useState([]);
  const [suggestionsDest, setSuggestionsDest] = useState([]);

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

  const extraireIATA = (texte) => {
    const match = texte.match(/\(([A-Z]{3})\)/);
    return match ? match[1] : texte.trim().toUpperCase(); 
  };

  const gererSaisieOrigine = (val) => {
    setFormData({...formData, origine: val});
    if (val.length > 1) {
      const filtres = TOUTES_DESTINATIONS.filter(d => 
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
    if (val.length > 1) {
      const filtres = TOUTES_DESTINATIONS.filter(d => 
        d.ville.toLowerCase().includes(val.toLowerCase()) || 
        d.code.toLowerCase().includes(val.toLowerCase())
      ).slice(0, 6);
      setSuggestionsDest(filtres);
    } else {
      setSuggestionsDest([]);
    }
  };

  const validerMission = (destCode, budgetTotal, passagers, aBagage) => {
    if (!seuils[destCode]) return "Destination non reconnue. Sélectionnez un choix dans la liste.";
    const fraisFlyRadar = 38.90; 
    const provisionBagage = aBagage ? 120 : 0; 
    const budgetRestantParPers = (budgetTotal / passagers) - fraisFlyRadar - provisionBagage;
    const prixMiniRequis = seuils[destCode]; 
    if (budgetRestantParPers < prixMiniRequis) {
        return `Budget trop faible. Après déduction de nos frais et du bagage A/R (120€), il ne reste que ${Math.floor(budgetRestantParPers)}€ pour le vol, alors que le minimum pour ${destCode} est de ${prixMiniRequis}€.`;
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    const codeOrigine = extraireIATA(formData.origine);
    const codeDest = extraireIATA(formData.destination);
    const erreur = validerMission(codeDest, parseInt(formData.budget_max), formData.passagers, formData.bagage_soute);
    if (erreur) { setErrorMessage(erreur); return; }

    setIsSubmitting(true);
    try {
      const { error } = await supabase.from('missions_conciergerie').insert([{
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
        statut: 'en_attente'
      }]);
      if (error) throw error;
      setSuccess(true);
    } catch (error) {
      setErrorMessage("Erreur lors de l'envoi. Réessayez.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white p-10 rounded-[2rem] shadow-xl max-w-sm text-center border border-slate-100">
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-5">
            <Check size={32} strokeWidth={3} />
          </div>
          <h2 className="text-xl font-black text-slate-900 mb-3">Dossier pré-validé !</h2>
          <p className="text-sm text-slate-500 mb-6">Vos critères sont réalistes. Réglez l'acompte de 9,90€ pour lancer la traque.</p>
          <button onClick={() => navigate('/')} className="bg-blue-600 text-white text-sm font-bold py-3 px-6 rounded-xl w-full">Payer 9,90€</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <header className="h-16 px-6 flex items-center justify-between bg-white border-b border-slate-200 sticky top-0 z-50">
        <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-xs font-bold text-slate-400">
          <ArrowLeft size={16} /> Retour
        </button>
        <div className="flex items-center gap-1.5">
          <Target className="text-blue-600" size={20} />
          <span className="font-black text-lg">Fly<span className="text-blue-600">Radar</span></span>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        
        <div className="lg:sticky lg:top-24">
          <div className="inline-flex items-center gap-1.5 bg-blue-100 text-blue-800 font-bold text-[10px] uppercase tracking-widest px-3 py-1.5 rounded-full mb-5">
            <Target size={12} /> Service Conciergerie
          </div>
          <h1 className="text-3xl lg:text-4xl font-black mb-6">Ne cherchez plus.<br/><span className="text-blue-600">Nos agents le font pour vous.</span></h1>
          <p className="text-base text-slate-500 mb-10">Déléguez votre recherche à nos experts. Nous utilisons des algorithmes pour dénicher les meilleures failles tarifaires.</p>
          
          <div className="grid grid-cols-1 gap-4">
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex gap-4 transition-all hover:shadow-md">
              <div className="text-blue-600"><UserCheck size={22} /></div>
              <div><h4 className="font-bold">1. Lancement (9,90€)</h4><p className="text-slate-600 text-xs">Activation immédiate du robot traqueur.</p></div>
            </div>
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex gap-4 transition-all hover:shadow-md">
              <div className="text-blue-600"><Clock size={22} /></div>
              <div><h4 className="font-bold">2. La Traque (72h max)</h4><p className="text-slate-600 text-xs">Scan continu des prix pour battre votre budget.</p></div>
            </div>
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex gap-4 transition-all hover:shadow-md">
              <div className="text-blue-600"><Check size={22} /></div>
              <div><h4 className="font-bold">3. Succès (29€)</h4><p className="text-slate-600 text-xs">Facturé uniquement si nous trouvons votre vol.</p></div>
            </div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2rem] shadow-lg border border-slate-100">
          <h3 className="text-lg font-black mb-8 text-center">Briefez votre Agent Expert</h3>
          {errorMessage && <div className="mb-6 bg-red-50 text-red-700 p-4 rounded-xl flex gap-3 text-sm border border-red-100"><AlertCircle size={20} />{errorMessage}</div>}
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
                <div className="relative">
                  <label className="text-[10px] font-bold text-slate-400 uppercase mb-1.5 block">Départ</label>
                  <div className="relative">
                    <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input type="text" autoComplete="off" value={formData.origine} onChange={(e) => gererSaisieOrigine(e.target.value)} required placeholder="Ex: Paris" className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 text-sm font-bold focus:bg-white outline-none" />
                  </div>
                  {suggestionsOrigine.length > 0 && (
                    <div className="absolute z-50 w-full bg-white border border-slate-200 rounded-xl mt-1 shadow-xl overflow-hidden">
                      {suggestionsOrigine.map((s, i) => (
                        <div key={i} onClick={() => { setFormData({...formData, origine: `${s.ville} (${s.code})`}); setSuggestionsOrigine([]); }} className="p-3 text-sm hover:bg-slate-50 cursor-pointer font-bold border-b border-slate-50 last:border-0">{s.ville} <span className="text-blue-600">({s.code})</span></div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="relative">
                  <label className="text-[10px] font-bold text-slate-400 uppercase mb-1.5 block">Arrivée</label>
                  <div className="relative">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input type="text" autoComplete="off" value={formData.destination} onChange={(e) => gererSaisieDest(e.target.value)} required placeholder="Ex: Phuket" className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 text-sm font-bold focus:bg-white outline-none" />
                  </div>
                  {suggestionsDest.length > 0 && (
                    <div className="absolute z-50 w-full bg-white border border-slate-200 rounded-xl mt-1 shadow-xl overflow-hidden">
                      {suggestionsDest.map((s, i) => (
                        <div key={i} onClick={() => { setFormData({...formData, destination: `${s.ville} (${s.code})`}); setSuggestionsDest([]); }} className="p-3 text-sm hover:bg-slate-50 cursor-pointer font-bold border-b border-slate-50 last:border-0">{s.ville} <span className="text-blue-600">({s.code})</span></div>
                      ))}
                    </div>
                  )}
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase mb-1.5 block">Aller</label>
                <div className="relative">
                  <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input type="date" required className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 text-sm font-bold outline-none" 
                    onChange={e => {
                      const val = e.target.value; setFormData({...formData, date_depart: val});
                      if (val.startsWith('202') && dateRetourRef.current) { dateRetourRef.current.focus(); try { dateRetourRef.current.showPicker(); } catch (err) {} }
                    }} 
                  />
                </div>
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase mb-1.5 block">Retour</label>
                <div className="relative">
                  <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input type="date" required ref={dateRetourRef} className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 text-sm font-bold outline-none" onChange={e => setFormData({...formData, date_retour: e.target.value})} />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase mb-1.5 block">Passagers</label>
                  <select className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm font-bold outline-none cursor-pointer" onChange={e => setFormData({...formData, passagers: parseInt(e.target.value)})}>
                    {[1,2,3,4,5].map(n => <option key={n} value={n}>{n} Personne{n>1?'s':''}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase mb-1.5 block">Flexibilité</label>
                  <select className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm font-bold outline-none cursor-pointer" onChange={e => setFormData({...formData, flexibilite: e.target.value})}>
                    <option>Dates exactes</option>
                    <option>± 1 jour</option>
                    <option>± 3 jours</option>
                  </select>
                </div>
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase mb-1.5 block">Budget Max TOTAL (Pour tous)</label>
              <input type="number" required placeholder="Ex: 1200" className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm font-bold focus:bg-white outline-none" onChange={e => setFormData({...formData, budget_max: e.target.value})} />
            </div>

            <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl flex items-center justify-between cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => setFormData({...formData, bagage_soute: !formData.bagage_soute})}>
              <div className="flex items-center gap-3">
                <Luggage size={20} className={formData.bagage_soute ? "text-blue-600" : "text-slate-400"} />
                <div className="text-sm font-bold">Bagage en soute inclus (120€ A/R)</div>
              </div>
              <div className={`w-5 h-5 rounded border ${formData.bagage_soute ? 'bg-blue-600 border-blue-600' : 'bg-white border-slate-300'}`}>
                {formData.bagage_soute && <Check size={14} className="text-white mx-auto mt-0.5" />}
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase mb-1.5 block">Email</label>
              <input type="email" required placeholder="votre@email.com" className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm font-bold outline-none" onChange={e => setFormData({...formData, client_email: e.target.value})} />
            </div>

            <button disabled={isSubmitting} type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold py-4 rounded-xl shadow-lg transition-all disabled:opacity-50">
              {isSubmitting ? <Loader2 className="animate-spin mx-auto" /> : "Lancer l'analyse du dossier"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
