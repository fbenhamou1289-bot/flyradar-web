import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, Target, Mail, ArrowRight } from 'lucide-react';

export default function Merci() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans selection:bg-blue-100 selection:text-blue-900">
      <div className="bg-white p-10 rounded-[2rem] shadow-xl max-w-md text-center border border-slate-100">
        
        <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
          <CheckCircle2 size={40} strokeWidth={2.5} />
        </div>
        
        <h1 className="text-2xl font-black text-slate-900 mb-3">Paiement validé !</h1>
        <p className="text-sm text-slate-500 mb-8 leading-relaxed">
          Votre dossier est désormais actif. L'Agent Sniper a été déployé et commence la traque de vos billets instantanément.
        </p>

        <div className="bg-slate-50 rounded-2xl p-6 mb-8 text-left border border-slate-100 space-y-5">
          <div className="flex items-start gap-3.5">
            <Target className="text-blue-600 shrink-0 mt-0.5" size={20} />
            <div>
              <h4 className="font-bold text-sm text-slate-900">Traque en cours</h4>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">Le robot surveille votre vol jour et nuit pendant 72h maximum.</p>
            </div>
          </div>
          
          <div className="h-px bg-slate-200 w-full"></div>
          
          <div className="flex items-start gap-3.5">
            <Mail className="text-blue-600 shrink-0 mt-0.5" size={20} />
            <div>
              <h4 className="font-bold text-sm text-slate-900">Surveillez vos e-mails</h4>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">Dès que le prix cible est atteint, vous recevrez une alerte avec le lien pour réserver.</p>
            </div>
          </div>
        </div>

        <button onClick={() => navigate('/')} className="flex items-center justify-center gap-2 w-full bg-slate-900 text-white text-sm font-bold py-4 px-6 rounded-xl shadow-lg hover:bg-slate-800 transition-colors">
          Retour à l'accueil <ArrowRight size={16} />
        </button>

      </div>
    </div>
  );
}
