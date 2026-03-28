import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Target, Mail, Lock, ArrowLeft, Crown, ShieldCheck, AlertCircle } from 'lucide-react';
import { supabase } from './VolsPasChers'; 

export default function InscriptionGold() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [plan, setPlan] = useState('monthly'); // 'monthly' ou 'annual'
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // --- LOGIQUE DE CRÉATION DE COMPTE & REDIRECTION STRIPE ---
  const handleRegisterAndPay = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!email || !password) {
        setError("Veuillez remplir votre email et choisir un mot de passe.");
        setIsLoading(false);
        return;
    }

    try {
      // 1. On crée le compte dans Supabase (ou on vérifie s'il existe)
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: email,
        password: password,
      });

      // Si l'erreur n'est pas "l'utilisateur existe déjà", on bloque
      if (signUpError && !signUpError.message.includes('already registered')) {
        throw signUpError;
      }

      // 2. On prépare l'adresse de retour (ton site actuel)
      const siteUrl = window.location.origin;

      // 3. Choix du bon lien Stripe selon le plan sélectionné
      let baseStripeUrl = '';
      if (plan === 'monthly') {
        baseStripeUrl = 'https://buy.stripe.com/aFa28q4TC4VA9aN0D6eQM00'; 
      } else {
        // 👇 C'EST ICI QU'IL FAUT METTRE TON LIEN ANNUEL 👇
        baseStripeUrl = 'https://buy.stripe.com/bJe7sK5XGafU5YBgC4eQM01'; 
      }

      // 4. On ajoute l'email et l'adresse de retour au lien
      const params = new URLSearchParams({
        prefilled_email: email,
        return_url: siteUrl
      });

      // 5. Téléportation vers la caisse Stripe !
      window.location.href = `${baseStripeUrl}?${params.toString()}`;
      
    } catch (err) {
      console.error("Erreur d'inscription:", err);
      setError(err.message || "Une erreur est survenue.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans selection:bg-amber-100 selection:text-amber-900 p-4 md:p-8">
      
      {/* HEADER DE LA PAGE */}
      <header className="flex items-center justify-between mb-12 md:mb-20">
        <button onClick={() => navigate('/')} className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors">
          <ArrowLeft size={16} /> Retour
        </button>
        <div className="flex justify-center items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
          <Target className="text-blue-600" size={28} strokeWidth={2.5} />
          <span className="text-2xl tracking-tight text-slate-900">
            <span className="font-bold">Fly</span><span className="font-bold text-blue-600">Radar</span>
          </span>
        </div>
        <div className="w-16"></div> {/* Équilibreur visuel */}
      </header>

      <main className="flex-grow flex items-center justify-center">
        <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-20 items-start">
          
          {/* COLONNE GAUCHE : RÉCAPITULATIF PREMIUM DYNAMIQUE */}
          <div className="md:col-span-5 flex flex-col gap-6 bg-slate-950 p-8 rounded-3xl border border-slate-800 shadow-2xl transition-all duration-300">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-amber-500 rounded-2xl flex items-center justify-center text-slate-950 border-2 border-amber-400">
                <Crown size={24} />
              </div>
              <div>
                <h1 className="text-2xl font-black text-white tracking-tight">Activer FlyRadar Gold</h1>
                <p className="text-amber-400 text-sm font-bold">Economisez jusqu'à 400€ sur votre prochain vol</p>
              </div>
            </div>
            
            <div className="border-y border-slate-800 py-6 my-2 transition-all">
                <div className="flex justify-between items-end mb-1">
                    <span className="text-slate-300 font-medium">
                      Abonnement Gold {plan === 'monthly' ? 'Mensuel' : 'Annuel'}
                    </span>
                    <span className="text-white font-black text-3xl transition-all">
                      {plan === 'monthly' ? '9,99€' : '89,90€'}
                    </span>
                </div>
                <p className="text-slate-500 text-xs text-right">
                  {plan === 'monthly' ? 'TVA incluse. Sans engagement.' : 'TVA incluse. Facturé annuellement.'}
                </p>
            </div>

            <ul className="space-y-4 text-sm font-semibold text-slate-300">
              <li className="flex items-center gap-3"><ShieldCheck size={18} className="text-amber-500 shrink-0" /> Instantané : Alerte à la seconde (vs 4h de retard)</li>
              <li className="flex items-center gap-3"><ShieldCheck size={18} className="text-amber-500 shrink-0" /> Vols Business et Première classe</li>
              <li className="flex items-center gap-3"><ShieldCheck size={18} className="text-amber-500 shrink-0" /> Alertes illimitées</li>
              <li className="flex items-center gap-3"><ShieldCheck size={18} className="text-amber-500 shrink-0" /> Remises jusqu'à 90%</li>
            </ul>
          </div>

          {/* COLONNE DROITE : LE FORMULAIRE DE CRÉATION DE COMPTE */}
          <form onSubmit={handleRegisterAndPay} className="md:col-span-7 bg-white rounded-3xl p-8 md:p-10 shadow-xl border border-slate-100 flex flex-col gap-8">
            
            {/* SECTION 1 : CRÉATION DU COMPTE */}
            <div>
              <h2 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-2">
                <span className="w-7 h-7 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 text-sm font-bold">1</span>
                Créez vos identifiants d'accès
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="alex@exemple.com" className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 pl-12 pr-4 outline-none focus:border-amber-400 focus:ring-4 focus:ring-amber-100 transition-all font-medium text-slate-800 placeholder:text-slate-400" />
                </div>
                <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="Choisissez un mot de passe" className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 pl-12 pr-4 outline-none focus:border-amber-400 focus:ring-4 focus:ring-amber-100 transition-all font-medium text-slate-800 placeholder:text-slate-400" />
                </div>
              </div>
            </div>

            {/* SECTION 2 : CHOIX DE L'ABONNEMENT */}
            <div className="border-t border-slate-100 pt-8">
              <h2 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-2">
                <span className="w-7 h-7 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 text-sm font-bold">2</span>
                Choisissez votre facturation
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Option Mensuelle */}
                <div 
                  onClick={() => setPlan('monthly')}
                  className={`cursor-pointer border-2 rounded-xl p-4 transition-all ${plan === 'monthly' ? 'border-amber-500 bg-amber-50' : 'border-slate-200 hover:border-amber-200 bg-white'}`}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-slate-900">Mensuel</span>
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center ${plan === 'monthly' ? 'bg-amber-500' : 'border-2 border-slate-300'}`}>
                      {plan === 'monthly' && <div className="w-2 h-2 bg-white rounded-full"></div>}
                    </div>
                  </div>
                  <div className="font-black text-2xl text-slate-900 mt-2">9,99€<span className="text-xs text-slate-500 font-medium">/mois</span></div>
                </div>

                {/* Option Annuelle */}
                <div 
                  onClick={() => setPlan('annual')}
                  className={`cursor-pointer border-2 rounded-xl p-4 transition-all relative ${plan === 'annual' ? 'border-amber-500 bg-amber-50' : 'border-slate-200 hover:border-amber-200 bg-white'}`}
                >
                  <div className="absolute -top-3 right-4 bg-green-500 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-sm">
                    3 mois offerts
                  </div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-slate-900">Annuel</span>
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center ${plan === 'annual' ? 'bg-amber-500' : 'border-2 border-slate-300'}`}>
                      {plan === 'annual' && <div className="w-2 h-2 bg-white rounded-full"></div>}
                    </div>
                  </div>
                  <div className="font-black text-2xl text-slate-900 mt-2">89,90€<span className="text-xs text-slate-500 font-medium">/an</span></div>
                </div>

              </div>
            </div>

            {/* Affichage de l'erreur */}
            {error && (
              <div className="text-red-500 text-sm font-bold flex items-center justify-center gap-2 bg-red-50 p-4 rounded-xl animate-in fade-in">
                <AlertCircle size={18} /> {error}
              </div>
            )}

            {/* BOUTON DE PAIEMENT FINAL */}
            <div className="pt-4">
              <p className="text-center text-sm font-bold text-slate-500 mb-4">
                Vous allez être redirigé vers notre plateforme de paiement sécurisée Stripe.
              </p>
              <button 
                disabled={isLoading} 
                type="submit" 
                className="w-full bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 text-white font-black py-5 rounded-xl flex items-center justify-center gap-3 uppercase tracking-widest text-xs shadow-lg transition-all hover:scale-[1.01] active:scale-[0.99]"
              >
                {isLoading ? (
                    <>Redirection en cours...</>
                ) : (
                    <><Crown size={18} className="text-amber-500" /> Payer {plan === 'monthly' ? '9,99€' : '89,90€'} en toute sécurité</>
                )}
              </button>
              
              <p className="text-center text-xs font-medium text-slate-400 flex items-center justify-center gap-2 mt-4">
                  <ShieldCheck size={14} className="text-green-500" /> Paiement 100% sécurisé et crypté par Stripe
              </p>
            </div>

          </form>
        </div>
      </main>

      <footer className="py-10 text-center text-xs font-medium text-slate-400 mt-12 border-t border-slate-100">
        FlyRadar © 2026 • Paiement sécurisé • CGV et Politique de confidentialité
      </footer>

    </div>
  );
}