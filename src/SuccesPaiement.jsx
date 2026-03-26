import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Crown, CheckCircle2, ArrowRight, PlaneTakeoff } from 'lucide-react';

export default function SuccesPaiement() {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(5);

 // Un petit compte à rebours pour rediriger automatiquement le membre vers le radar
 useEffect(() => {
  // 1. On glisse les badges d'accès dans la mémoire du navigateur
  localStorage.setItem('flyradar_free_access', 'true');
  localStorage.setItem('flyradar_auth', 'true');

  // 2. Le compte à rebours tourne
  const timer = setInterval(() => {
    setCountdown((prev) => prev - 1);
  }, 1000);

  if (countdown === 0) {
    navigate('/vols-pas-chers', { state: { openVipModal: true } });
  }

  return () => clearInterval(timer);
}, [countdown, navigate]);

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Effet d'arrière-plan stylé */}
      <div className="absolute inset-0 z-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-amber-500 via-slate-900 to-slate-900"></div>
      
      <div className="relative z-10 bg-white p-10 md:p-14 rounded-[2.5rem] shadow-2xl max-w-lg w-full text-center border-t-8 border-amber-500 animate-in fade-in zoom-in duration-500">
        
        {/* L'icône de succès */}
        <div className="w-24 h-24 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-6 relative">
          <div className="absolute inset-0 bg-amber-400 rounded-full animate-ping opacity-20"></div>
          <Crown size={48} className="text-amber-500 relative z-10" />
          <CheckCircle2 size={32} className="text-green-500 absolute -bottom-2 -right-2 bg-white rounded-full p-1 shadow-sm z-20" />
        </div>

        <h1 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">Bienvenue au club.</h1>
        
        <p className="text-slate-600 mb-8 font-medium leading-relaxed">
          Votre paiement a été validé avec succès. Vous êtes officiellement membre <strong className="text-amber-600">FlyRadar Gold</strong>. Préparez vos valises.
        </p>

        <div className="bg-slate-50 rounded-2xl p-6 mb-8 border border-slate-100 text-left">
          <h3 className="font-bold text-slate-900 text-sm mb-3 uppercase tracking-widest flex items-center gap-2">
            <PlaneTakeoff size={16} className="text-blue-500"/> Prochaines étapes :
          </h3>
          <ul className="text-sm text-slate-600 space-y-3 font-medium">
            <li className="flex items-start gap-2">
              <span className="text-amber-500 font-bold">1.</span> Configurez vos aéroports de départ favoris.
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-500 font-bold">2.</span> Laissez nos agents scanner le web 24/7.
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-500 font-bold">3.</span> Recevez les erreurs de prix en avant-première.
            </li>
          </ul>
        </div>

        <button 
          onClick={() => navigate('/vols-pas-chers', { state: { openVipModal: true } })}
          className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl shadow-lg hover:bg-blue-700 transition-colors uppercase tracking-widest text-xs flex items-center justify-center gap-2 group"
        >
          Accéder à mon Radar <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
        </button>
        
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-6">
          Redirection automatique dans {countdown}s...
        </p>
      </div>
    </div>
  );
}