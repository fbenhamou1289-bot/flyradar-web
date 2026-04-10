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
    client_email: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('missions_conciergerie')
        .insert([
          {
            client_email: formData.client_email,
            origine: formData.origine,
            destination: formData.destination,
            dates_flexibles: formData.dates_flexibles,
            budget_max: parseInt(formData.budget_max),
            passagers: formData.passagers,
            statut: 'en_attente'
          }
        ]);

      if (error) throw error;
      setSuccess(true);
      
    } catch (error) {
      console.error("Erreur lors de l'envoi :", error);
      alert("Une erreur est survenue. Veuillez vérifier votre connexion.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans">
        <div className="bg-white p-10 rounded-[2.5rem] shadow-xl max-w-md text-center border border-slate-100">
          <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check size={40} strokeWidth={3} />
          </div>
          <h2 className="text-2xl font-black text-slate-900 mb-4">Mission confiée !</h2>
          <p className="text-slate-500 font-medium mb-8">
            Nos agents ont bien reçu votre dossier. (Simulation : Redirection vers le paiement du dépôt de garantie à venir). 
          </p>
          <button onClick={() => navigate('/')} className="bg-slate-900 text-white font-bold py-4 px-8 rounded-xl uppercase tracking-widest text-xs w-full hover:bg-amber-500 hover:text-slate-900 transition-colors">
            Retour à l'accueil
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-amber-100 selection:text-amber-900">
      {/* HEADER BRANDING */}
      <header className="h-20 px-4 md:px-8 flex items-center justify-between bg-white border-b border-slate-100 sticky top-0 z-50">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors">
          <ArrowLeft size={18} /> Retour
        </button>
        <div className="flex items-center gap-2">
          <Target className="text-amber-500" size={24} strokeWidth={2.5} />
          <span className="font-black text-lg text-slate-900 tracking-tight">Fly<span className="text-amber-500">Radar</span></span>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-12 md:py-20 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        
        {/* COLONNE GAUCHE : LE MESSAGE MARKETING */}
        <div className="flex flex-col">
          <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-800 font-black text-[10px] uppercase tracking-widest px-4 py-2 rounded-full w-max mb-6">
            <Target size={14} /> La Conciergerie
          </div>
          
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight mb-6 tracking-tight">
            Ne passez plus des heures à comparer les vols.
          </h1>
          <p className="text-lg text-slate-600 font-medium leading-relaxed mb-10">
            Nous avons les outils et l'expertise pour le faire à votre place. Déléguez votre recherche à nos agents et gagnez un temps précieux.
          </p>

          <div className="space-y-6 mb-10">
            <div className="flex gap-4 items-start">
              <div className="bg-white p-3 rounded-2xl shadow-sm text-slate-900 shrink-0 border border-slate-100"><UserCheck size={24} /></div>
              <div>
                <h4 className="font-black text-slate-900">1. Dépôt de mission (9,90€)</h4>
                <p className="text-sm text-slate-500 mt-1 leading-relaxed">Un filtre anti-curieux qui active immédiatement l'un de nos agents experts sur votre dossier.</p>
              </div>
            </div>
            
            <div className="flex gap-4 items-start">
              <div className="bg-amber-50 p-3 rounded-2xl shadow-sm text-amber-600 shrink-0 border border-amber-100"><Clock size={24} /></div>
              <div>
                <h4 className="font-black text-slate-900">2. La Traque (72h max)</h4>
                <p className="text-sm text-slate-500 mt-1 leading-relaxed">Pendant que vous vaquez à vos occupations, nous scannons les bases de données privées pour dénicher la faille.</p>
                <div className="mt-3 bg-white p-3 border border-slate-200 rounded-xl flex items-start gap-2">
                  <ShieldCheck size={16} className="text-green-500 shrink-0 mt-0.5" />
                  <p className="text-xs font-medium text-slate-600">
                    <strong className="text-slate-900">Garantie Confiance :</strong> Si nous ne trouvons rien sous votre budget après 72h, nous vous offrons un crédit pour une recherche supplémentaire gratuite.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="bg-white p-3 rounded-2xl shadow-sm text-slate-900 shrink-0 border border-slate-100"><Check size={24} /></div>
              <div>
                <h4 className="font-black text-slate-900">3. Paiement au succès (29€)</h4>
                <p className="text-sm text-slate-500 mt-1 leading-relaxed">Le résultat est garanti. Vous ne réglez le solde que si notre mission est accomplie avec succès.</p>
              </div>
            </div>
          </div>
        </div>

        {/* COLONNE DROITE : LE FORMULAIRE */}
        <div className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-slate-100 relative overflow-hidden">
          {/* Décoration en fond */}
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <Target size={120} />
          </div>

          <div className="relative z-10">
            <h3 className="text-2xl font-black text-slate-900 mb-2">Briefez nos agents</h3>
            <p className="text-sm text-slate-500 mb-8 font-medium">Détaillez vos critères, nous nous occupons du reste.</p>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 block">Aéroport de départ</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input type="text" required placeholder="Ex: Paris CDG" className="w-full bg-slate-50 border border-slate-100 rounded-xl py-3 pl-11 pr-4 font-bold text-slate-900 outline-none focus:border-amber-500 transition-colors" onChange={e => setFormData({...formData, origine: e.target.value})} />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 block">Destination</label>
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input type="text" required placeholder="Ex: Tokyo, Japon" className="w-full bg-slate-50 border border-slate-100 rounded-xl py-3 pl-11 pr-4 font-bold text-slate-900 outline-none focus:border-amber-500 transition-colors" onChange={e => setFormData({...formData, destination: e.target.value})} />
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 block">Dates souhaitées</label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input type="text" required placeholder="Ex: Du 12 au 26 Août (Flexibilité ±2 jours)" className="w-full bg-slate-50 border border-slate-100 rounded-xl py-3 pl-11 pr-4 font-bold text-slate-900 outline-none focus:border-amber-500 transition-colors" onChange={e => setFormData({...formData, dates_flexibles: e.target.value})} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 block">Budget Max / pers</label>
                  <input type="number" required placeholder="Ex: 500€" className="w-full bg-slate-50 border border-slate-100 rounded-xl py-3 px-4 font-bold text-slate-900 outline-none focus:border-amber-500 transition-colors" onChange={e => setFormData({...formData, budget_max: e.target.value})} />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 block">Passagers</label>
                  <select className="w-full bg-slate-50 border border-slate-100 rounded-xl py-3 px-4 font-bold text-slate-900 outline-none focus:border-amber-500 transition-colors cursor-pointer appearance-none" onChange={e => setFormData({...formData, passagers: e.target.value})}>
                    <option>1 Adulte</option>
                    <option>2 Adultes</option>
                    <option>Famille (3+)</option>
                    <option>Groupe (5+)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 block">Email de contact</label>
                <input type="email" required placeholder="Pour recevoir l'alerte de nos agents" className="w-full bg-slate-50 border border-slate-100 rounded-xl py-3 px-4 font-bold text-slate-900 outline-none focus:border-amber-500 transition-colors" onChange={e => setFormData({...formData, client_email: e.target.value})} />
              </div>

              <div className="pt-4 mt-6">
                <button disabled={isSubmitting} type="submit" className="w-full bg-slate-900 hover:bg-amber-500 text-white hover:text-slate-900 shadow-xl font-black py-4 rounded-xl transition-all uppercase tracking-widest text-xs flex items-center justify-center gap-3 disabled:opacity-50">
                  {isSubmitting ? 'Traitement en cours...' : <><Send size={18} /> Confier ma recherche à un agent</>}
                </button>
                <div className="flex items-center justify-center gap-2 mt-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  <ShieldCheck size={14} className="text-amber-500" /> Étape 1 sur 2 (Dépôt sécurisé à venir)
                </div>
              </div>
            </form>
          </div>

        </div>
      </main>
    </div>
  );
}
