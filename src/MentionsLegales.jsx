import React from 'react';

// Icône Cible (Target) telle que définie dans votre inspecteur
const TargetIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-target text-blue-600">
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="6" />
    <circle cx="12" cy="12" r="2" />
  </svg>
);

// Icône Flèche vers la gauche (ArrowLeft) pour le bouton de retour
const ArrowLeftIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-left">
    <line x1="19" y1="12" x2="5" y2="12" />
    <polyline points="12" y1="19" x2="5" y2="12" <polyline points="12" y1="5" x2="5" y2="12" />
  </svg>
);

export default function MentionsLegales() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-700">
      
      {/* Container Principal pour le centrage et le padding */}
      <div className="py-16 md:py-24 px-4">
        
        {/* La Carte Centrale (style FlyRadar pro, épurée) */}
        <div className="max-w-4xl mx-auto bg-white p-10 md:p-14 rounded-3xl shadow-xl shadow-slate-100 border border-slate-100">
          
          {/* En-tête de la page avec VOTRE LOGO EXACT */}
          <div className="border-b border-slate-100 pb-10 mb-12">
            <div className="flex items-center gap-2 cursor-pointer mb-6">
              <TargetIcon />
              <span className="text-xl md:text-2xl tracking-tight text-slate-900">
                <span className="font-bold">Fly</span><span className="font-bold text-blue-600">Radar</span>
              </span>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-950 mb-6 tracking-tight">
              Informations Légales & Transparence
            </h1>
            
            <p className="text-slate-500 text-base max-w-xl leading-relaxed">
              Dernière mise à jour : 29 Mars 2026. Conformément à l'article 6 de la loi n° 2004-575 du 21 juin 2004 pour la confiance dans l'économie numérique.
            </p>
          </div>

          {/* Corps du texte juridique */}
          <div className="space-y-12">
            
            {/* SECTION 1 - L'Éditeur */}
            <section>
              <h2 className="text-xl font-semibold text-slate-900 mb-3 tracking-tight">1. Éditeur du site</h2>
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
            <section>
              <h2 className="text-xl font-semibold text-slate-900 mb-3 tracking-tight">2. Directeur de la publication</h2>
              <p className="text-slate-700 leading-relaxed">
                Le directeur de la publication du site FlyRadar est <strong>F. Benhamou</strong>.
              </p>
            </section>

            {/* SECTION 3 - L'Hébergement */}
            <section>
              <h2 className="text-xl font-semibold text-slate-900 mb-3 tracking-tight">3. Hébergement du site</h2>
              <p className="text-slate-700 leading-relaxed">
                Le site FlyRadar est hébergé en France et dans l'Union Européenne par :
                <strong className="text-slate-900 ml-1">Vercel Inc.</strong>
              </p>
            </section>

            {/* SECTION 4 - Propriété Intellectuelle */}
            <section>
              <h2 className="text-xl font-semibold text-slate-900 mb-3 tracking-tight">4. Propriété intellectuelle</h2>
              <p className="text-slate-700 leading-relaxed">
                L'ensemble du contenu de ce site, incluant, de façon non limitative, les graphismes, images, textes, vidéos, animations, sons, logos, gifs et icônes ainsi que leur mise en forme sont la propriété exclusive de FlyRadar, à l'exception des marques, logos ou contenus appartenant à d'autres sociétés partenaires ou auteurs.
                Toute reproduction, distribution, modification, adaptation, retransmission ou publication, même partielle, de ces différents éléments est strictement interdite sans l'accord exprès par écrit de FlyRadar SAS.
              </p>
            </section>

            {/* SECTION 5 - Données Personnelles */}
            <section>
              <h2 className="text-xl font-semibold text-slate-900 mb-3 tracking-tight">5. Données personnelles & RGPD</h2>
              <p className="text-slate-700 leading-relaxed">
                Conformément à la loi "Informatique et Libertés" et au Règlement Général sur la Protection des Données (RGPD), vous disposez d'un droit d'accès, de rectification, de suppression et d'opposition aux données personnelles vous concernant.
                Pour exercer ce droit, vous pouvez nous contacter à l'adresse email mentionnée ci-dessus.
                Pour plus de détails, veuillez consulter notre <a href="/confidentialite" className="text-blue-600 hover:text-blue-800 transition-colors font-medium">Politique de Confidentialité</a>.
              </p>
            </section>

          </div>

          {/* Pied de page de la carte avec bouton de retour épuré */}
          <div className="mt-16 md:mt-20 pt-10 border-t border-slate-100">
            <button 
              onClick={() => window.history.back()} 
              className="text-blue-600 font-medium hover:text-blue-800 transition-colors flex items-center gap-2"
            >
              <ArrowLeftIcon /> Retourner sur FlyRadar
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}