import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Target, Search, MapPin, Calendar, ArrowLeft, Check, ShieldCheck, UserCheck, Clock, Send } from 'lucide-react';
import { supabase } from './VolsPasChers'; 

export default function Conciergerie() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    origine: '',
    destination: '',
    dates_flexibles: '',
    passagers: '1 Adulte',
    budget_max: '',
    preferences_escales: 'Peu importe',
    client_email: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const { error } = await supabase.from('missions_conciergerie').insert([{
        client_email: formData.client_email,
        origine: formData.origine,
        destination: formData.destination,
        dates_flexibles: formData.dates_flexibles,
        budget_max: parseInt(formData.budget_max),
        passagers: formData.passagers,
        preferences_escales: formData.preferences_escales,
        statut: 'en_attente'
      }]);
      if (error) throw error;
      setSuccess(true);
    } catch (error) {
      console.error("Erreur :", error);
      alert("Une erreur est survenue. Veuillez vérifier votre connexion.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans">
        <div className="bg-white p-10 rounded-[2rem] shadow-xl max-w-sm text-center border border-slate-100">
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-5">
            <Check size={32} strokeWidth={3} />
          </div>
          <h2 className="text-xl font-black text-slate-900 mb-3">Dossier reçu !</h2>
          <p className="text-sm text-slate-500 mb-6">
            Vos critères sont validés. Nos agents prennent le relais. (Simulation : Redirection vers le paiement à venir).
          </p>
          <button onClick={() => navigate('/')} className="bg-blue-600 text-white text-sm font-bold py-3 px-6 rounded-xl w-full hover:bg-blue-700 transition-colors">
            Retour à l'accueil
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-blue-100 selection:text-blue-900">
      
      {/* HEADER ÉPURÉ */}
      <header className="h-16 px-6 flex items-center justify-between bg-white border-b border-slate-200 sticky top-0 z-50">
        <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-slate-900 transition-colors">
          <ArrowLeft size={16} /> Retour
        </button>
        <div className="flex items-center gap-1.5">
          <Target className="text-blue-600" size={20} strokeWidth={2.5} />
          <span className="font-black text-lg tracking-tight">Fly<span className="text-blue-600">Radar</span></span>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
        
        {/* COLONNE GAUCHE */}
        <div className="lg:sticky lg:top-24">
          <div className="inline-flex items-center gap-1.5 bg-blue-100 text-blue-800 font-bold text-[10px] uppercase tracking-widest px-3 py-1.5 rounded-full mb-5">
            <Target size={12} /> Service Conciergerie
          </div>
          
          <h1 className="text-3xl lg:text-4xl font-black leading-tight mb-6">
            <span className="text-blue-600">Ne cherchez plus.</span><br/>
            Nos agents le font pour vous.
          </h1>
          <p className="text-base text-slate-500 mb-10 leading-relaxed">
            Déléguez votre recherche à nos experts. Nous utilisons des outils professionnels pour dénicher les meilleures failles tarifaires et optimiser votre budget.
          </p>

          {/* ENCARTS BLANCS AFFINÉS */}
          <div className="grid grid-cols-1 gap-4 mb-10">
            
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex gap-3.5 items-start transition-all hover:shadow-md">
              <div className="text-blue-600 mt-0.5 shrink-0"><UserCheck size={22} strokeWidth={2.5} /></div>
              <div>
                <h4 className="font-bold text-base text-slate-950">1. Dépôt (9,90€)</h4>
                <p className="text-slate-600 text-xs mt-1 leading-relaxed">Un filtre sécurisé qui active immédiatement un agent sur votre dossier.</p>
              </div>
            </div>
            
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex gap-3.5 items-start transition-all hover:shadow-md">
              <div className="text-blue-600 mt-0.5 shrink-0"><Clock size={22} strokeWidth={2.5} /></div>
              <div>
                <h4 className="font-bold text-base text-slate-950">2. La Traque (72h max)</h4>
                <p className="text-slate-600 text-xs mt-1 leading-relaxed">Nos experts scannent en continu les bases professionnelles pour trouver le vol parfait.</p>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex gap-3.5 items-start transition-all hover:shadow-md">
              <div className="text-blue-600 mt-0.5 shrink-0"><Check size={22} strokeWidth={2.5} /></div>
              <div>
                <h4 className="font-bold text-base text-slate-950">3. Succès (29€)</h4>
                <p className="text-slate-600 text-xs mt-1 leading-relaxed">Garantie de résultat. Vous ne réglez le solde que si notre mission est accomplie.</p>
              </div>
            </div>
            
          </div>

          <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl flex items-start gap-3">
            <ShieldCheck size={20} className="text-blue-600 shrink-0 mt-0.5" />
            <p className="text-xs font-medium text-blue-950 leading-relaxed">
              <strong>Garantie Confiance :</strong> En cas d'échec de nos agents après 72h, nous vous créditons une nouvelle recherche gratuite. Aucun risque.
            </p>
          </div>
        </div>

        {/* COLONNE DROITE : FORMULAIRE AFFINÉ */}
        <div className="bg-white p-8 rounded-[2rem] shadow-lg border border-slate-100">
          <h3 className="text-lg font-black mb-8 text-center text-slate-950">Briefez votre Agent Expert</h3>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 block">D'où partez-vous ?</label>
              <div className="relative">
                <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input type="text" required placeholder="Ex: Paris CDG" className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 text-sm font-bold outline-none focus:border-blue-600 focus:bg-white transition-all shadow-inner" onChange={e => setFormData({...formData, origine: e.target.value})} />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 block">Quelle est votre destination ?</label>
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input type="text" required placeholder="Ex: New York JFK" className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 text-sm font-bold outline-none focus:border-blue-600 focus:bg-white transition-all shadow-inner" onChange={e => setFormData({...formData, destination: e.target.value})} />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 block">Quelles sont vos dates ?</label>
              <div className="relative">
                <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input type="text" required placeholder="Ex: Août (Flexible ±2 jours)" className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 text-sm font-bold outline-none focus:border-blue-600 focus:bg-white transition-all shadow-inner" onChange={e => setFormData({...formData, dates_flexibles: e.target.value})} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 block">Budget Max / personne</label>
                <input type="number" required placeholder="500€" className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm font-bold outline-none focus:border-blue-600 focus:bg-white transition-all shadow-inner" onChange={e => setFormData({...formData, budget_max: e.target.value})} />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 block">Passagers</label>
                <select className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm font-bold outline-none focus:border-blue-600 focus:bg-white transition-all appearance-none cursor-pointer shadow-inner" onChange={e => setFormData({...formData, passagers: e.target.value})}>
                  <option>1 Adulte</option>
                  <option>2 Adultes</option>
                  <option>Famille (3+)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 block">Préférence de trajet</label>
              <select className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm font-bold outline-none focus:border-blue-600 focus:bg-white transition-all appearance-none cursor-pointer shadow-inner" onChange={e => setFormData({...formData, preferences_escales: e.target.value})}>
                <option>Peu importe (Meilleur prix)</option>
                <option>1 escale maximum</option>
                <option>Vol direct uniquement</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 block">Email de contact</label>
              <input type="email" required placeholder="Pour recevoir le résultat" className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm font-bold outline-none focus:border-blue-600 focus:bg-white transition-all shadow-inner" onChange={e => setFormData({...formData, client_email: e.target.value})} />
            </div>

            <button disabled={isSubmitting} type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold py-3.5 rounded-xl mt-4 transition-colors shadow-lg flex items-center justify-center gap-2 disabled:opacity-50">
              {isSubmitting ? 'Dossier en création...' : <><Send size={16} /> Activer mon Agent Expert</>}
            </button>
            <div className="text-center text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-3 flex items-center justify-center gap-1.5">
              <ShieldCheck size={12} className="text-blue-500"/> Étape 1 sur 2 (Paiement sécurisé)
            </div>
          </form>
        </div>

      </main>
    </div>
  );
}
