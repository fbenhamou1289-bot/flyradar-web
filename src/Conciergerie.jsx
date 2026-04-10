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
      alert("Une erreur est survenue. Vérifiez votre connexion.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans">
        <div className="bg-white p-12 rounded-[2rem] shadow-xl max-w-md text-center border border-slate-100">
          <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check size={40} strokeWidth={3} />
          </div>
          <h2 className="text-2xl font-black text-slate-900 mb-4">Dossier reçu !</h2>
          <p className="text-slate-500 mb-8">
            Vos critères sont validés. (Simulation : Redirection vers le paiement à venir).
          </p>
          <button onClick={() => navigate('/')} className="bg-blue-600 text-white font-bold py-4 px-8 rounded-xl w-full hover:bg-blue-700 transition-colors">
            Retour à l'accueil
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-blue-100 selection:text-blue-900">
      
      {/* HEADER ÉPURÉ */}
      <header className="h-20 px-6 flex items-center justify-between bg-white border-b border-slate-200 sticky top-0 z-50">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-slate-900 transition-colors">
          <ArrowLeft size={18} /> Retour
        </button>
        <div className="flex items-center gap-2">
          <Target className="text-blue-600" size={24} strokeWidth={2.5} />
          <span className="font-black text-xl tracking-tight">Fly<span className="text-blue-600">Radar</span></span>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        
        {/* COLONNE GAUCHE : MESSAGE DIRECT */}
        <div>
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 font-bold text-[11px] uppercase tracking-widest px-4 py-2 rounded-full mb-6">
            <Target size={14} /> Service Conciergerie
          </div>
          
          <h1 className="text-4xl lg:text-5xl font-black leading-tight mb-6">
            Ne cherchez plus.<br/>Nos agents le font pour vous.
          </h1>
          <p className="text-lg text-slate-500 mb-10 leading-relaxed">
            Déléguez votre recherche à nos experts. Nous avons les outils professionnels pour dénicher les meilleures failles tarifaires.
          </p>

          <div className="space-y-8">
            <div className="flex gap-4">
              <div className="text-blue-600 mt-1"><UserCheck size={24} /></div>
              <div>
                <h4 className="font-bold text-lg">1. Dépôt (9,90€)</h4>
                <p className="text-slate-500 text-sm mt-1">Active immédiatement un agent sur votre dossier.</p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="text-blue-600 mt-1"><Clock size={24} /></div>
              <div>
                <h4 className="font-bold text-lg">2. La Traque (72h)</h4>
                <p className="text-slate-500 text-sm mt-1">Nous scannons en continu pour trouver le vol parfait.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="text-blue-600 mt-1"><Check size={24} /></div>
              <div>
                <h4 className="font-bold text-lg">3. Succès (29€)</h4>
                <p className="text-slate-500 text-sm mt-1">Ne payez le solde que si nous trouvons votre vol.</p>
              </div>
            </div>
          </div>

          <div className="mt-10 bg-blue-50 border border-blue-100 p-4 rounded-xl flex items-start gap-3">
            <ShieldCheck size={20} className="text-blue-600 shrink-0 mt-0.5" />
            <p className="text-sm font-medium text-blue-900">
              <strong>Garantie Confiance :</strong> En cas d'échec de nos agents après 72h, nous vous créditons une nouvelle recherche gratuite.
            </p>
          </div>
        </div>

        {/* COLONNE DROITE : FORMULAIRE */}
        <div className="bg-white p-8 md:p-10 rounded-[2rem] shadow-lg border border-slate-100">
          <h3 className="text-xl font-black mb-8 text-center">Créez votre dossier</h3>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">Départ</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input type="text" required placeholder="Ex: Paris" className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-12 pr-4 font-bold outline-none focus:border-blue-600 focus:bg-white transition-all" onChange={e => setFormData({...formData, origine: e.target.value})} />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">Destination</label>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input type="text" required placeholder="Ex: Bali" className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-12 pr-4 font-bold outline-none focus:border-blue-600 focus:bg-white transition-all" onChange={e => setFormData({...formData, destination: e.target.value})} />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">Dates</label>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input type="text" required placeholder="Ex: Août (Flexible)" className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-12 pr-4 font-bold outline-none focus:border-blue-600 focus:bg-white transition-all" onChange={e => setFormData({...formData, dates_flexibles: e.target.value})} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">Budget Max / pers</label>
                <input type="number" required placeholder="500€" className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 font-bold outline-none focus:border-blue-600 focus:bg-white transition-all" onChange={e => setFormData({...formData, budget_max: e.target.value})} />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">Passagers</label>
                <select className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 font-bold outline-none focus:border-blue-600 focus:bg-white transition-all appearance-none cursor-pointer" onChange={e => setFormData({...formData, passagers: e.target.value})}>
                  <option>1 Adulte</option>
                  <option>2 Adultes</option>
                  <option>Famille</option>
                </select>
              </div>
            </div>

            {/* NOUVEAU CHAMP : ESCALES */}
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">Préférence d'escales</label>
              <select className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 font-bold outline-none focus:border-blue-600 focus:bg-white transition-all appearance-none cursor-pointer" onChange={e => setFormData({...formData, preferences_escales: e.target.value})}>
                <option>Peu importe (Meilleur prix)</option>
                <option>1 escale maximum</option>
                <option>Vol direct uniquement</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">Email</label>
              <input type="email" required placeholder="Pour recevoir le résultat" className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 font-bold outline-none focus:border-blue-600 focus:bg-white transition-all" onChange={e => setFormData({...formData, client_email: e.target.value})} />
            </div>

            <button disabled={isSubmitting} type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl mt-4 transition-colors flex items-center justify-center gap-2 disabled:opacity-50">
              {isSubmitting ? 'Envoi...' : <><Send size={18} /> Activer un agent</>}
            </button>
          </form>
        </div>

      </main>
    </div>
  );
}
