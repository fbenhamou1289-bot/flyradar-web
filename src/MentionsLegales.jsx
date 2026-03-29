import React from 'react';

export default function MentionsLegales() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] py-20 px-4 md:px-8">
      <div className="max-w-3xl mx-auto bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-slate-200">
        <h1 className="text-3xl font-black text-slate-900 mb-6">Mentions Légales</h1>
        <p className="text-slate-600 mb-4">
          Bienvenue sur la page des mentions légales de FlyRadar. Le contenu juridique détaillé sera bientôt disponible ici !
        </p>
        <button 
          onClick={() => window.history.back()} 
          className="mt-8 text-blue-600 font-bold hover:text-blue-800 transition-colors"
        >
          &larr; Retour à l'accueil
        </button>
      </div>
    </div>
  );
}