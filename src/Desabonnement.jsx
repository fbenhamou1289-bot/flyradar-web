import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Target } from 'lucide-react';
import { supabase } from './VolsPasChers';

export default function Desabonnement() {
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email');
  const navigate = useNavigate();
  const [status, setStatus] = useState('loading'); 

  useEffect(() => {
    if (!email) {
      setStatus('error');
      return;
    }

    const unsubscribe = async () => {
      try {
        const { error } = await supabase
          .from('Users')
          .update({ unsubscribed: true })
          .eq('email', email);

        if (error) throw error;
        setStatus('success');
      } catch (err) {
        console.error("Erreur de désabonnement:", err);
        setStatus('error');
      }
    };

    unsubscribe();
  }, [email]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 font-sans text-center">
      <div className="bg-white p-10 rounded-[2rem] shadow-xl max-w-md w-full border border-slate-100">
        <Target className="text-blue-600 mx-auto mb-6" size={40} strokeWidth={2.5} />
        
        {status === 'loading' && (
          <h2 className="text-xl font-black text-slate-900 mb-2">Désabonnement en cours...</h2>
        )}

        {status === 'success' && (
          <>
            <h2 className="text-2xl font-black text-slate-900 mb-3 tracking-tight">C'est noté.</h2>
            <p className="text-slate-500 font-medium mb-8 leading-relaxed">
              L'adresse <span className="font-bold text-slate-900">{email}</span> a bien été retirée de notre liste. Vous ne recevrez plus nos alertes.
            </p>
            <button 
              onClick={() => navigate('/')} 
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 rounded-xl transition-all uppercase tracking-widest text-xs"
            >
              Retour à l'accueil
            </button>
          </>
        )}

        {status === 'error' && (
          <>
            <h2 className="text-xl font-black text-red-600 mb-3">Lien invalide</h2>
            <p className="text-slate-500 font-medium mb-8">Nous n'avons pas pu traiter votre demande. Le lien est peut-être expiré.</p>
            <button 
              onClick={() => navigate('/')} 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-all uppercase tracking-widest text-xs"
            >
              Retour à l'accueil
            </button>
          </>
        )}
      </div>
    </div>
  );
}