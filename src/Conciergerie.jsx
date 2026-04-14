import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Target, Search, MapPin, Calendar, ArrowLeft, Check, ShieldCheck, UserCheck, Clock, Send, CalendarDays, Luggage, AlertCircle, Loader2 } from 'lucide-react';
import { supabase } from './VolsPasChers'; 

// Liste locale pour l'autocomplétion (On garde la même liste pour l'UI)
const DESTINATIONS_LIST = [
  { ville: "Paris - Charles de Gaulle", code: "CDG" },
  { ville: "Paris - Orly", code: "ORY" },
  { ville: "Marrakech - Menara (Maroc)", code: "RAK" },
  { ville: "Tlemcen - Zenata (Algérie)", code: "TLM" },
  { ville: "New York - JFK (USA)", code: "JFK" },
  { ville: "Tokyo - Haneda (Japon)", code: "HND" },
  { ville: "Dubaï (Emirats)", code: "DXB" },
  // ... (Garde ta liste complète de 130+ ici)
];

export default function Conciergerie() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [seuils, setSeuils] = useState({}); // Stockage des prix planchers de Supabase
  
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

  // 📥 1. CHARGEMENT DES SEUILS PRO AU DÉMARRAGE
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

  // ✂️ L'EXTRACTEUR DE CODE IATA
  const extraireIATA = (texte) => {
    const match = texte.match(/\(([A-Z]{3})\)/);
    return match ? match[1] : texte.trim().toUpperCase(); 
  };

  // 🛡️ LE BOUCLIER PRO (Calcul identique au Robot)
  const validerMission = (destCode, budgetTotal, passagers, aBagage) => {
    const fraisFlyRadar = 38.90; // 9.90 + 29
    const provisionBagage = aBagage ? 60 : 0;
    
    // Calcul de ce qu'il reste vraiment pour le billet d'avion par personne
    const budgetRestantParPers = (budgetTotal / passagers) - fraisFlyRadar - provisionBagage;
    
    // On récupère le prix mini pour cette destination (ou 50€ par défaut)
    const prixMiniRequis = seuils[destCode] || 50;

    if (budgetRestantParPers < prixMiniRequis) {
        return `Budget trop faible pour cette destination. Compte tenu des frais et options, il ne reste que ${Math.floor(budgetRestantParPers)}€ pour le billet, alors que le minimum constaté pour ${destCode} est de ${prixMiniRequis}€.`;
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    
    const codeOrigine = extraireIATA(formData.origine);
    const codeDest = extraireIATA(formData.destination);

    // 🛑 VÉRIFICATION AVANT PAIEMENT
    const erreurBudget = validerMission(codeDest, parseInt(formData.budget_max), formData.passagers, formData.bagage_soute);
    
    if (erreurBudget) {
        setErrorMessage(erreurBudget);
        return;
    }

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
      setErrorMessage("Erreur de connexion. Veuillez réessayer.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- RENDU UI (Identique à ton précédent, avec datalist) ---
  if (success) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans">
        <div className="bg-white p-10 rounded-[2rem] shadow-xl max-w-sm text-center border border-slate-100">
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-5">
            <Check size={32} strokeWidth={3} />
          </div>
          <h2 className="text-xl font-black text-slate-900 mb-3">Dossier validé !</h2>
          <p className="text-sm text-slate-500 mb-6">
            Votre budget est réaliste. Notre Agent Sniper est prêt à être activé dès réception de votre acompte.
          </p>
          <button onClick={() => navigate('/')} className="bg-blue-600 text-white text-sm font-bold py-3 px-6 rounded-xl w-full hover:bg-blue-700 transition-colors">
            Payer 9,90€ et lancer la traque
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <datalist id="liste-aeroports">
        {DESTINATIONS_LIST.map((dest, i) => (
          <option key={i} value={`${dest.ville} (${dest.code})`} />
        ))}
      </datalist>

      <header className="h-16 px-6 flex items-center justify-between bg-white border-b border-slate-200 sticky top-0 z-50">
        <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-xs font-bold text-slate-400">
          <ArrowLeft size={16} /> Retour
        </button>
        <div className="flex items-center gap-1.5">
          <Target className="text-blue-600" size={20} strokeWidth={2.5} />
          <span className="font-black text-lg tracking-tight">Fly<span className="text-blue-600">Radar</span></span>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Colonne Gauche : Argumentaire */}
        <div className="lg:sticky lg:top-24">
           {/* ... Ton contenu actuel (Lancement, Traque, Succès) ... */}
           <h1 className="text-3xl lg:text-4xl font-black leading-tight mb-6">Expertise humaine.<br/><span className="text-blue-600">Puissance algorithmique.</span></h1>
           <p className="text-slate-500 mb-10">Nous ne cherchons pas seulement des vols, nous traquons les erreurs de prix pour vous.</p>
        </div>

        {/* Colonne Droite : Formulaire */}
        <div className="bg-white p-8 rounded-[2rem] shadow-lg border border-slate-100">
          <h3 className="text-lg font-black mb-8 text-center">Configurez votre Sniper</h3>
          
          {errorMessage && (
            <div className="mb-6 bg-red-50 text-red-700 p-4 rounded-xl flex items-start gap-3 text-sm font-medium border border-red-100">
              <AlertCircle size={20} className="shrink-0 mt-0.5" />
              <p>{errorMessage}</p>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
                <div className="relative">
                  <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input type="text" list="liste-aeroports" required placeholder="Départ" className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 text-sm font-bold outline-none focus:border-blue-600 focus:bg-white" onChange={e => setFormData({...formData, origine: e.target.value})} />
                </div>
                <div className="relative">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input type="text" list="liste-aeroports" required placeholder="Destination" className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 text-sm font-bold outline-none focus:border-blue-600 focus:bg-white" onChange={e => setFormData({...formData, destination: e.target.value})} />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <input type="date" required className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm font-bold outline-none" onChange={e => setFormData({...formData, date_depart: e.target.value})} />
                <input type="date" required className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm font-bold outline-none" onChange={e => setFormData({...formData, date_retour: e.target.value})} />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <select className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm font-bold" onChange={e => setFormData({...formData, passagers: parseInt(e.target.value)})}>
                  {[1,2,3,4,5].map(n => <option key={n} value={n}>{n} Passager{n>1?'s':''}</option>)}
                </select>
                <select className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm font-bold" onChange={e => setFormData({...formData, flexibilite: e.target.value})}>
                  <option>Dates exactes</option>
                  <option>± 1 jour</option>
                  <option>± 3 jours</option>
                </select>
            </div>

            <input type="number" required placeholder="Budget TOTAL Max (ex: 800€)" className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm font-bold outline-none" onChange={e => setFormData({...formData, budget_max: e.target.value})} />

            <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl flex items-center justify-between cursor-pointer" onClick={() => setFormData({...formData, bagage_soute: !formData.bagage_soute})}>
              <div className="flex items-center gap-3">
                <Luggage size={20} className={formData.bagage_soute ? "text-blue-600" : "text-slate-400"} />
                <div className="text-sm font-bold">Bagage en soute inclus</div>
              </div>
              <div className={`w-5 h-5 rounded border ${formData.bagage_soute ? 'bg-blue-600 border-blue-600' : 'bg-white border-slate-300'}`}>
                {formData.bagage_soute && <Check size={14} className="text-white mx-auto" />}
              </div>
            </div>

            <input type="email" required placeholder="Email de contact" className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm font-bold outline-none" onChange={e => setFormData({...formData, client_email: e.target.value})} />

            <button disabled={isSubmitting} type="submit" className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl shadow-lg flex items-center justify-center gap-2 hover:bg-blue-700 transition-all disabled:opacity-50">
              {isSubmitting ? <Loader2 className="animate-spin" /> : <><Send size={18} /> Valider mon dossier</>}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
