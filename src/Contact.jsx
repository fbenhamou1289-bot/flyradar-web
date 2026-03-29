import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Target, Crown, User, ArrowLeft, Send, CheckCircle2, MessageSquare } from 'lucide-react';
import { supabase } from './VolsPasChers'; // On importe ton Supabase existant !

export default function Contact() {
  const navigate = useNavigate();
  const [isSent, setIsSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // 1. On récupère ce que le client a tapé dans les cases
    const nom = e.target.nom.value;
    const email = e.target.email.value;
    const sujet = e.target.sujet.value;
    const message = e.target.message.value;

    try {
      // 2. On envoie tout ça direct dans ta table 'Contact' sur Supabase
      const { error } = await supabase
        .from('Contact')
        .insert([{ nom, email, sujet, message }]);

      if (error) throw error;

      // 3. Si ça marche, on affiche le message vert de succès
      setIsSent(true);
    } catch (error) {
      console.error("Erreur d'envoi du message:", error);
      alert("Une erreur est survenue lors de l'envoi. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans selection:bg-blue-100 selection:text-blue-900">
      
      {/* HEADER */}
      <header className="h-16 md:h-20 px-4 md:px-8 flex items-center justify-between bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
            <Target className="text-blue-600" size={24} strokeWidth={2.5} />
            <span className="text-xl md:text-2xl tracking-tight text-slate-900">
              <span className="font-bold">Fly</span><span className="font-bold text-blue-600">Radar</span>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 md:gap-4 lg:gap-5">
          <button onClick={() => navigate('/connexion')} className="hidden sm:flex items-center gap-1.5 text-sm font-bold text-slate-600 hover:text-slate-900 transition-colors">
            <User size={16} /> Connexion
          </button>
          
          <button onClick={() => navigate('/aide')} className="hidden md:flex items-center gap-1.5 text-sm font-bold text-slate-700 hover:text-slate-900 transition-colors border border-slate-300 px-4 py-2 rounded-full hover:bg-slate-50">
            <ArrowLeft size={16} /> Retour à l'Aide
          </button>
          
          <button onClick={() => navigate('/inscription-gold')} className="text-xs md:text-sm font-bold text-white bg-amber-500 hover:bg-amber-400 transition-colors border border-amber-600/20 px-4 py-2 rounded-full flex items-center gap-1.5 shadow-sm">
            <Crown size={16} /> Go Gold
          </button>
        </div>
      </header>

      {/* CONTENU PRINCIPAL */}
      <main className="flex-grow w-full max-w-2xl mx-auto px-4 py-12 md:py-20">
        
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <MessageSquare size={32} strokeWidth={2.5} />
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">Contactez-nous</h1>
          <p className="text-base md:text-lg text-slate-500 font-medium px-4">
            Une question sur l'abonnement Gold ou un problème avec votre profil ? Notre équipe vous répond sous 24h.
          </p>
        </div>

        {/* FORMULAIRE DE CONTACT */}
        {!isSent ? (
          <div className="bg-white rounded-[2rem] p-8 md:p-10 shadow-xl border border-slate-100">
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-slate-700">Votre nom</label>
                  {/* Remarque le name="nom" ici */}
                  <input required name="nom" type="text" placeholder="Alexandre Dumas" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100 transition-all font-medium text-slate-800" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-slate-700">Votre adresse email</label>
                  {/* Remarque le name="email" ici */}
                  <input required name="email" type="email" placeholder="alex@exemple.com" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100 transition-all font-medium text-slate-800" />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-slate-700">Sujet de votre demande</label>
                {/* Remarque le name="sujet" ici */}
                <select required name="sujet" defaultValue="" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100 transition-all font-medium text-slate-800 cursor-pointer appearance-none">
                  <option value="" disabled>Choisissez une option...</option>
                  <option value="gold">Question sur l'abonnement Gold</option>
                  <option value="profil">Mise à jour de mon aéroport / profil</option>
                  <option value="alerte">Question sur une alerte reçue</option>
                  <option value="autre">Autre demande</option>
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-slate-700">Votre message</label>
                {/* Remarque le name="message" ici */}
                <textarea required name="message" rows="5" placeholder="Comment pouvons-nous vous aider ?" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100 transition-all font-medium text-slate-800 resize-none"></textarea>
              </div>

              <button disabled={isLoading} type="submit" className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-black py-4 rounded-xl flex items-center justify-center gap-2 uppercase tracking-widest text-sm shadow-lg shadow-blue-600/20 transition-all mt-2">
                {isLoading ? 'Envoi en cours...' : <><Send size={18} /> Envoyer le message</>}
              </button>

            </form>
          </div>
        ) : (
          /* MESSAGE DE SUCCÈS APRÈS ENVOI */
          <div className="bg-white rounded-[2rem] p-10 shadow-xl border border-slate-100 text-center animate-in fade-in zoom-in duration-500">
            <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="text-green-500" size={40} />
            </div>
            <h2 className="text-3xl font-black text-slate-900 mb-3">Message envoyé !</h2>
            <p className="text-slate-500 font-medium mb-8">
              Notre équipe a bien reçu votre demande. Nous vous répondrons sur votre adresse email dans les plus brefs délais.
            </p>
            <button onClick={() => navigate('/')} className="bg-slate-100 text-slate-800 font-black py-4 px-8 rounded-xl hover:bg-slate-200 transition-colors uppercase tracking-widest text-xs">
              Retour à l'accueil
            </button>
          </div>
        )}

      </main>

      {/* FOOTER */}
      <footer className="py-12 text-center border-t border-slate-200 bg-white flex flex-col items-center justify-center mt-auto">
        <p className="text-slate-400 text-xs font-black uppercase tracking-[0.3em] mb-4">© 2026 FlyRadar aviation • No limits</p>
        <div className="flex flex-wrap justify-center gap-4 text-xs font-medium text-slate-400">
          <button onClick={() => navigate('/aide')} className="hover:text-slate-700 transition-colors">Aide / FAQ</button>
          <span>|</span>
          <button onClick={() => navigate('/mentions-legales')} className="hover:text-slate-700 transition-colors">Mentions Légales</button>
          <span>|</span>
          <button onClick={() => navigate('/confidentialite')} className="hover:text-slate-700 transition-colors">Politique de Confidentialité</button>
          <span>|</span>
          <button onClick={() => navigate('/cgv')} className="hover:text-slate-700 transition-colors">CGV & CGU</button>
        </div>
      </footer>

    </div>
  );
}