import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Target, Search, MapPin, Calendar, ArrowLeft, Check, ShieldCheck, UserCheck, Clock, Send, CalendarDays, Luggage, AlertCircle } from 'lucide-react';
import { supabase } from './VolsPasChers'; 

export default function Conciergerie() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  const [formData, setFormData] = useState({
    origine: '',
    destination: '',
    date_depart: '',
    date_retour: '',
    flexibilite: 'Dates exactes',
    passagers: 1, // Transformé en nombre pour faciliter le calcul du robot
    budget_max: '', // Ce sera le budget TOTAL du dossier
    bagage_soute: false, // Nouvelle option
    preferences_escales: 'Peu importe',
    client_email: ''
  });

  // 🛡️ LE BOUCLIER ANTI-CLIENT FOU (Sans consommer d'API)
  const verifierBudgetRealiste = (destination, budgetTotal, passagers) => {
    const dest = destination.toLowerCase();
    const budgetParPersonne = budgetTotal / passagers;

    if ((dest.includes('tokyo') || dest.includes('japon') || dest.includes('asie') || dest.includes('bali') || dest.includes('bangkok')) && budgetParPersonne < 450) {
      return "Budget irréaliste pour l'Asie. Le minimum conseillé est de 450€ / personne.";
    }
    if ((dest.includes('new york') || dest.includes('los angeles') || dest.includes('etats-unis') || dest.includes('usa') || dest.includes('canada')) && budgetParPersonne < 300) {
      return "Budget irréaliste pour l'Amérique du Nord. Le minimum conseillé est de 300€ / personne.";
    }
    if (budgetParPersonne < 50) {
      return "Le budget minimum de recherche est de 50€ par personne.";
    }
    return null; // Tout va bien, on laisse passer
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    
    // Vérification du bouclier
    const alerteBouclier = verifierBudgetRealiste(formData.destination, parseInt(formData.budget_max), formData.passagers);
    if (alerteBouclier) {
        setErrorMessage(alerteBouclier);
        return; // On bloque l'envoi
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase.from('missions_conciergerie').insert([{
        client_email: formData.client_email,
        origine: formData.origine,
        destination: formData.destination,
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
      console.error("Erreur :", error);
      setErrorMessage("Une erreur est survenue lors de la création du dossier. Veuillez réessayer.");
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
          <h2 className="text-xl font-black text-slate-900 mb-3">Dossier pré-validé !</h2>
          <p className="text-sm text-slate-500 mb-6">
            Vos critères sont réalistes. Il ne reste plus qu'à régler l'acompte de 9,90€ pour lancer notre Agent Sniper.
          </p>
          <button onClick={() => navigate('/')} className="bg-blue-600 text-white text-sm font-bold py-3 px-6 rounded-xl w-full hover:bg-blue-700 transition-colors">
            (Simulation) Payer 9,90€
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-blue-100 selection:text-blue-900">
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
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 block">Départ</label>
                  <div className="relative">
                    <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input type="text" required placeholder="Ex: Paris" className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 text-sm font-bold outline-none focus:border-blue-600 focus:bg-white transition-all shadow-inner" onChange={e => setFormData({...formData, origine: e.target.value})} />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 block">Arrivée</label>
                  <div className="relative">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input type="text" required placeholder="Ex: Tokyo" className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 text-sm font-bold outline-none focus:border-blue-600 focus:bg-white transition-all shadow-inner" onChange={e => setFormData({...formData, destination: e.target.value})} />
                  </div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 block">Aller</label>
                <div className="relative">
                  <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input type="date" required className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 text-sm font-bold outline-none focus:border-blue-600 focus:bg-white transition-all shadow-inner" onChange={e => setFormData({...formData, date_depart: e.target.value})} />
                </div>
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 block">Retour</label>
                <div className="relative">
                  <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input type="date" required className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 text-sm font-bold outline-none focus:border-blue-600 focus:bg-white transition-all shadow-inner" onChange={e => setFormData({...formData, date_retour: e.target.value})} />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 block">Passagers</label>
                  <select className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm font-bold outline-none focus:border-blue-600 focus:bg-white transition-all appearance-none cursor-pointer shadow-inner" onChange={e => setFormData({...formData, passagers: e.target.value})}>
                    <option value="1">1 Personne</option>
                    <option value="2">2 Personnes</option>
                    <option value="3">3 Personnes</option>
                    <option value="4">4 Personnes</option>
                    <option value="5">5 Personnes</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 block">Flexibilité des dates</label>
                  <div className="relative">
                    <CalendarDays className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <select className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 text-sm font-bold outline-none focus:border-blue-600 focus:bg-white transition-all appearance-none cursor-pointer shadow-inner" onChange={e => setFormData({...formData, flexibilite: e.target.value})}>
                      <option>Dates exactes (Aucune flexibilité)</option>
                      <option>± 1 jour (Recommandé)</option>
                      <option>± 3 jours (Meilleurs tarifs)</option>
                    </select>
                  </div>
                </div>
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 block">Budget Max TOTAL (Pour tous les passagers)</label>
              <input type="number" required placeholder="Ex: 850€ (Frais FlyRadar inclus)" className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm font-bold outline-none focus:border-blue-600 focus:bg-white transition-all shadow-inner" onChange={e => setFormData({...formData, budget_max: e.target.value})} />
            </div>

            <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl flex items-center justify-between cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => setFormData({...formData, bagage_soute: !formData.bagage_soute})}>
              <div className="flex items-center gap-3">
                <Luggage size={20} className={formData.bagage_soute ? "text-blue-600" : "text-slate-400"} />
                <div>
                  <div className="text-sm font-bold text-slate-900">Inclure un bagage en soute</div>
                  <div className="text-[10px] text-slate-500 font-medium mt-0.5">Notre robot retirera un forfait d'environ 60€/vol pour chercher les prix.</div>
                </div>
              </div>
              <div className={`w-6 h-6 rounded border flex items-center justify-center transition-colors ${formData.bagage_soute ? 'bg-blue-600 border-blue-600' : 'bg-white border-slate-300'}`}>
                {formData.bagage_soute && <Check size={14} className="text-white" />}
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
              <input type="email" required placeholder="Pour recevoir le résultat" className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm font-bold outline-none focus:border-blue-600 focus:bg-white transition-all shadow-inner" onChange={e => setFormData({...formData, client_email: e.target.value})} />
            </div>

            <button disabled={isSubmitting} type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold py-3.5 rounded-xl mt-4 transition-colors shadow-lg flex items-center justify-center gap-2 disabled:opacity-50">
              {isSubmitting ? 'Analyse en cours...' : <><Send size={16} /> Lancer l'analyse du dossier</>}
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
