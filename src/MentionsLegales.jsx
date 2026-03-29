import React from 'react';

export default function MentionsLegales() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-700">
      
      {/* Container Principal pour le centrage et le padding */}
      <div className="py-16 md:py-24 px-4">
        
        {/* La Carte Centrale (style FlyRadar pro) */}
        <div className="max-w-3xl mx-auto bg-white p-10 md:p-14 rounded-3xl shadow-xl shadow-slate-100 border border-slate-100">
          
          {/* En-tête de la page */}
          <div className="border-b border-slate-100 pb-10 mb-12">
            <div className="flex items-center gap-2 text-slate-500 mb-2 text-sm font-medium tracking-wide">
              <span>FlyRadar</span> <span className="opacity-40">|</span> <span>Mentions Légales</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-950 mb-4 tracking-tighter">
              Nos informations légales et transparence.
            </h1>
            <div className="h-1.5 w-24 bg-blue-600 rounded-full mb-12"></div>
            <p className="text-slate-500 text-base max-w-xl leading-relaxed">
              Dernière mise à jour : 29 Mars 2026. Conformément à l'article 6 de la loi n° 2004-575 du 21 juin 2004 pour la confiance dans l'économie numérique.
            </p>
          </div>

          {/* Corps du texte juridique */}
          <div className="space-y-12">
            
            {/* SECTION 1 - L'Éditeur */}
            <section className="border-b border-slate-100 pb-10">
              <div className="flex items-center gap-3.5 mb-6">
                <div className="w-1.5 h-8 bg-blue-600 rounded-full"></div>
                <h2 className="text-2xl font-bold text-slate-900 tracking-tight">1. Éditeur du site</h2>
              </div>
              
              <div className="space-y-4 text-slate-700 leading-relaxed text-base">
                <p>Le site <span className="font-semibold text-slate-900">FlyRadar</span> est édité et exploité par :</p>
                <div className="p-5 bg-slate-50 rounded-xl border border-slate-100 text-sm font-medium space-y-1.5">
                  <p><span className="text-slate-500">Raison sociale :</span> FlyRadar SAS</p>
                  <p><span className="text-slate-500">Forme juridique :</span> SAS</p>
                  <p><span className="text-slate-500">Siège social :</span> 92400 Courbevoie</p>
                  <p><span className="text-slate-500">Numéro de SIRET :</span> [À compléter, ex: 123 456 789 00012]</p>
                  <p><span className="text-slate-500">Email de contact :</span> <strong>hello@flyradar.fr</strong></p>
                </div>
              </div>
            </section>

            {/* SECTION 2 - La Publication */}
            <section className="border-b border-slate-100 pb-10">
              <div className="flex items-center gap-3.5 mb-6">
                <div className="w-1.5 h-8 bg-blue-600 rounded-full"></div>
                <h2 className="text-2xl font-bold text-slate-900 tracking-tight">2. Directeur de la publication</h2>
              </div>
              <p className="text-slate-700 leading-relaxed">
                Le directeur de la publication du site FlyRadar est <strong>F. Benhamou</strong>.
              </p>
            </section>

            {/* SECTION 3 - L'Hébergement */}
            <section className="border-b border-slate-100 pb-10">
              <div className="flex items-center gap-3.5 mb-6">
                <div className="w-1.5 h-8 bg-blue-600 rounded-full"></div>
                <h2 className="text-2xl font-bold text-slate-900 tracking-tight">3. Hébergement du site</h2>
              </div>
              <div className="space-y-3 text-slate-700 leading-relaxed">
                <p>Le site FlyRadar est hébergé en France et dans l'Union Européenne par :</p>
                <p className="font-bold text-slate-900">Vercel Inc.</p>
                <p className="text-slate-500 text-sm leading-relaxed">[Adresse Vercel, ex: 440 N Barranca Ave #4133 Covina, CA 91722, États-Unis]</p>
              </div>
            </section>

            {/* SECTION 4 - Propriété Intellectuelle */}
            <section className="border-b border-slate-100 pb-10">
              <div className="flex items-center gap-3.5 mb-6">
                <div className="w-1.5 h-8 bg-blue-600 rounded-full"></div>
                <h2 className="text-2xl font-bold text-slate-900 tracking-tight">4. Propriété intellectuelle</h2>
              </div>
              <p className="text-slate-700 leading-relaxed">
                L'ensemble du contenu de ce site, incluant, de façon non limitative, les graphismes, images, textes, vidéos, animations, sons, logos, gifs et icônes ainsi que leur mise en forme sont la propriété exclusive de FlyRadar, à l'exception des marques, logos ou contenus appartenant à d'autres sociétés partenaires ou auteurs.
                Toute reproduction, distribution, modification, adaptation, retransmission ou publication, même partielle, de ces différents éléments est strictement interdite sans l'accord exprès par écrit de FlyRadar SAS.
              </p>
            </section>

            {/* SECTION 5 - Données Personnelles */}
            <section>
              <div className="flex items-center gap-3.5 mb-6">
                <div className="w-1.5 h-8 bg-blue-600 rounded-full"></div>
                <h2 className="text-2xl font-bold text-slate-900 tracking-tight">5. Données personnelles & RGPD</h2>
              </div>
              <p className="text-slate-700 leading-relaxed mb-6">
                Conformément à la loi "Informatique et Libertés" et au Règlement Général sur la Protection des Données (RGPD), vous disposez d'un droit d'accès, de rectification, de suppression et d'opposition aux données personnelles vous concernant.
                Pour exercer ce droit, vous pouvez nous contacter à l'adresse email mentionnée ci-dessus.
              </p>
              <a 
                href="/confidentialite" 
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-50 text-blue-700 font-semibold rounded-full hover:bg-blue-100 transition-colors shadow-sm"
              >
                Consulter la Politique de Confidentialité &rarr;
              </a>
            </section>

          </div>

          {/* Pied de page de la carte avec bouton de retour */}
          <div className="mt-16 md:mt-20 pt-10 border-t border-slate-100">
            <button 
              onClick={() => window.history.back()} 
              className="inline-flex items-center gap-2.5 px-6 py-3 bg-slate-900 text-slate-50 font-semibold rounded-full hover:bg-slate-800 transition-colors shadow-sm"
            >
              &larr; Retourner sur FlyRadar
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}