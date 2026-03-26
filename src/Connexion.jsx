import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Target, Mail, Lock, ArrowRight, AlertCircle, ArrowLeft, Crown } from 'lucide-react';
import { supabase } from './VolsPasChers'; // Import de ta connexion Supabase

export default function Connexion() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Connexion classique avec Email ET Mot de passe pour les Gold
      const { error: authError } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (authError) throw authError;

      // Si le mot de passe est bon, on l'envoie vers les offres
      navigate('/vols-pas-chers');
      
    } catch (err) {
      console.error("Erreur de connexion:", err);
      setError("Email ou mot de passe incorrect.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans selection:bg-blue-100 selection:text-blue-900 items-center justify-center p-4">
      
      {/* Bouton de retour discret */}
      <div className="absolute top-6 left-6 md:top-10 md:left-10">
        <button onClick={() => navigate('/')} className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors">
          <ArrowLeft size={16} /> Retour
        </button>
      </div>

      <div className="w-full max-w-md">
        {/* LOGO CENTRÉ */}
        <div className="flex justify-center items-center gap-2 mb-8 cursor-pointer" onClick={() => navigate('/')}>
          <Target className="text-blue-600" size={32} strokeWidth={2.5} />
          <span className="text-3xl tracking-tight text-slate-900">
            <span className="font-bold">Fly</span><span className="font-bold text-blue-600">Radar</span>
          </span>
        </div>

        {/* CARTE DE CONNEXION */}
        <div className="bg-white rounded-[2rem] p-8 md:p-10 shadow-xl border border-slate-100">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-black text-slate-900 mb-2 flex items-center justify-center gap-2">
              Accès Membre Gold <Crown className="text-amber-500" size={24} />
            </h1>
            <p className="text-slate-500 text-sm font-medium">Connectez-vous pour accéder à vos alertes exclusives.</p>
          </div>

          <form onSubmit={handleLogin} className="flex flex-col gap-5">
            
            {/* Champ Email */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-widest">Adresse email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                  <Mail size={18} />
                </div>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="alex@exemple.com" 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-11 pr-4 outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100 transition-all font-medium text-slate-800" 
                />
              </div>
            </div>

            {/* Champ Mot de passe */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-widest">Mot de passe</label>
                {/* Petit lien mot de passe oublié visuel */}
                <button type="button" className="text-xs font-bold text-blue-600 hover:text-blue-700">Oublié ?</button>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                  <Lock size={18} />
                </div>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••" 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-11 pr-4 outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100 transition-all font-medium text-slate-800" 
                />
              </div>
            </div>

            {/* Affichage de l'erreur */}
            {error && (
              <div className="text-red-500 text-sm font-bold flex items-center justify-center gap-2 bg-red-50 p-3 rounded-lg animate-in fade-in">
                <AlertCircle size={16} /> {error}
              </div>
            )}

            {/* Bouton de Connexion */}
            <button 
              disabled={isLoading} 
              type="submit" 
              className="w-full bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 text-white font-black py-4 rounded-xl flex items-center justify-center gap-2 uppercase tracking-widest text-xs shadow-lg transition-all mt-2"
            >
              {isLoading ? 'Vérification...' : <>Se connecter <ArrowRight size={16} /></>}
            </button>

          </form>
        </div>

        {/* Lien vers le pricing pour les non-inscrits */}
        <p className="text-center text-sm font-medium text-slate-500 mt-8">
          Pas encore membre Gold ? <br className="md:hidden"/>
          <button onClick={() => navigate('/inscription-gold')} className="text-amber-500 font-bold hover:text-amber-600 transition-colors uppercase tracking-wider text-xs ml-1">Go Gold</button>
        </p>
      </div>

    </div>
  );
}