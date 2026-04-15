import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Check, Loader2, Target, ShieldCheck, AlertCircle, ArrowLeft } from 'lucide-react';
import { supabase } from './VolsPasChers'; // Assure-toi que le chemin d'import est le bon !

export default function ChoixClient() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('loading'); // loading, success-relancer, success-credit, error

  useEffect(() => {
    async function processChoice() {
      const dossierId = searchParams.get('dossier');
      const action = searchParams.get('action');

      if (!dossierId || !action) {
        setStatus('error');
        return;
      }

      try {
        if (action === 'relancer') {
          // 1. On remet la mission en attente et on réinitialise le chrono (created_at) à aujourd'hui
          await supabase.from('missions_conciergerie')
            .update({ statut: 'en_attente', created_at: new Date().toISOString() })
            .eq('id', dossierId);
            
          setStatus('success-relancer');
        } 
        else if (action === 'credit') {
          // 1. On récupère l'email lié à cette mission
          const { data: mission } = await supabase.from('missions_conciergerie')
            .select('client_email')
            .eq('id', dossierId)
            .single();
          
          if (mission && mission.client_email) {
            // 2. On ajoute un crédit au client dans la table Users
            const { data: userData } = await supabase.from('Users')
              .select('credits_conciergerie')
              .eq('email', mission.client_email)
              .maybeSingle();
              
            const currentCredits = userData?.credits_conciergerie || 0;
            await supabase.from('Users').upsert({ 
                email: mission.client_email, 
                credits_conciergerie: currentCredits + 1 
            }, { onConflict: 'email' });
            
            // 3. On clôture la mission
            await supabase.from('missions_conciergerie')
              .update({ statut: 'clos_credit' })
              .eq('id', dossierId);
              
            setStatus('success-credit');
          } else {
            setStatus('error');
          }
        }
      } catch (err) {
        console.error(err);
        setStatus('error');
      }
    }

    processChoice();
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex flex-col">
      <header className="h-16 px-6 flex items-center justify-between bg-white border-b border-slate-200">
        <div className="flex items-center gap-1.5 cursor-pointer" onClick={() => navigate('/')}>
          <Target className="text-blue-600" size={20} strokeWidth={2.5} />
          <span className="font-black text-lg tracking-tight">Fly<span className="text-blue-600">Radar</span></span>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-6">
        <div className="bg-white p-10 rounded-[2rem] shadow-xl max-w-md w-full text-center border border-slate-100">
          
          {status === 'loading' && (
            <div className="py-8">
              <Loader2 className="animate-spin text-blue-600 mx-auto mb-4" size={40} />
              <h2 className="text-xl font-black text-slate-900">Mise à jour en cours...</h2>
              <p className="text-sm text-slate-500 mt-2">Veuillez patienter quelques instants.</p>
            </div>
          )}

          {status === 'success-relancer' && (
            <div className="animate-in fade-in zoom-in duration-500">
              <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Target size={40} strokeWidth={2.5} />
              </div>
              <h2 className="text-2xl font-black text-slate-900 mb-3">La traque reprend ! 🎯</h2>
              <p className="text-slate-500 mb-8 leading-relaxed">
                Le chronomètre a été réinitialisé. Notre Agent Sniper repart immédiatement en chasse pour 72 heures supplémentaires.
              </p>
              <button onClick={() => navigate('/')} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-xl uppercase tracking-widest text-xs transition-colors shadow-lg">
                Retour à l'accueil
              </button>
            </div>
          )}

          {status === 'success-credit' && (
            <div className="animate-in fade-in zoom-in duration-500">
              <div className="w-20 h-20 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Check size={40} strokeWidth={3} />
              </div>
              <h2 className="text-2xl font-black text-slate-900 mb-3">Crédit activé ! 🎁</h2>
              <p className="text-slate-500 mb-8 leading-relaxed">
                Votre dossier est clos. Une recherche gratuite a été ajoutée à votre profil. Lors de votre prochaine demande, l'acompte de 9,90€ sera automatiquement offert.
              </p>
              <button onClick={() => navigate('/')} className="w-full bg-slate-900 hover:bg-slate-800 text-white font-black py-4 rounded-xl uppercase tracking-widest text-xs transition-colors shadow-lg">
                Faire une nouvelle recherche
              </button>
            </div>
          )}

          {status === 'error' && (
            <div className="animate-in fade-in zoom-in duration-500">
              <div className="w-20 h-20 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertCircle size={40} strokeWidth={2.5} />
              </div>
              <h2 className="text-2xl font-black text-slate-900 mb-3">Lien expiré ou invalide</h2>
              <p className="text-slate-500 mb-8 leading-relaxed">
                Il semble que ce lien ne soit plus valide ou que l'action ait déjà été effectuée.
              </p>
              <button onClick={() => navigate('/conciergerie')} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-xl uppercase tracking-widest text-xs transition-colors shadow-lg">
                Contacter le support
              </button>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
