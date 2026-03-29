import React from 'react';

// Les mêmes icônes que pour les mentions légales
const TargetIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-target text-blue-600">
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="6" />
    <circle cx="12" cy="12" r="2" />
  </svg>
);

const ArrowLeftIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-left">
    <line x1="19" y1="12" x2="5" y2="12" />
    <polyline points="12 19 5 12 12 5" />
  </svg>
);

export default function PolitiqueConfidentialite() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-700">
      <div className="py-16 md:py-24 px-4">
        <div className="max-w-4xl mx-auto bg-white p-10 md:p-14 rounded-3xl shadow-xl shadow-slate-100 border border-slate-100">
          
          {/* En-tête */}
          <div className="border-b border-slate-100 pb-10 mb-12">
            <div className="flex items-center gap-2 cursor-pointer mb-6" onClick={() => window.history.back()}>
              <TargetIcon />
              <span className="text-xl md:text-2xl tracking-tight text-slate-900">
                <span className="font-bold">Fly</span><span className="font-bold text-blue-600">Radar</span>
              </span>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-950 mb-6 tracking-tight">
              Politique de Confidentialité & RGPD
            </h1>
            
            <p className="text-slate-500 text-base max-w-xl leading-relaxed">
              Dernière mise à jour : 29 Mars 2026. Chez FlyRadar, nous prenons la protection de vos données personnelles très au sérieux.
            </p>
          </div>

          {/* Corps du texte */}
          <div className="space-y-12">
            
            <section>
              <h2 className="text-xl font-semibold text-slate-900 mb-3 tracking-tight">1. Données collectées</h2>
              <p className="text-slate-700 leading-relaxed mb-4">
                Dans le cadre de l'utilisation de FlyRadar, nous sommes amenés à collecter les données suivantes :
              </p>
              <ul className="list-disc pl-5 space-y-2 text-slate-700">
                <li><strong>Adresse email :</strong> pour vous envoyer nos alertes de vols pas chers et gérer votre compte.</li>
                <li><strong>Aéroport de départ :</strong> pour personnaliser les offres que nous vous envoyons.</li>
                <li><strong>Données de navigation :</strong> cookies techniques essentiels au fonctionnement du site et de votre session (ex: statut Gold).</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900 mb-3 tracking-tight">2. Utilisation des données</h2>
              <p className="text-slate-700 leading-relaxed">
                Vos données sont exclusivement utilisées pour :<br/>
                - Vous fournir le service d'alerte de vols (version gratuite ou Gold).<br/>
                - Gérer votre authentification sécurisée sur notre plateforme.<br/>
                - Vous contacter concernant votre abonnement ou des mises à jour importantes de FlyRadar.<br/>
                <strong>Nous ne revendons en aucun cas vos adresses emails à des tiers.</strong>
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900 mb-3 tracking-tight">3. Stockage et Sécurité</h2>
              <p className="text-slate-700 leading-relaxed">
                Vos données sont stockées de manière sécurisée via notre prestataire d'infrastructure de base de données <strong>Supabase</strong>. Les mots de passe sont cryptés et nous mettons en œuvre des mesures de sécurité strictes pour empêcher tout accès non autorisé à vos informations.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900 mb-3 tracking-tight">4. Durée de conservation</h2>
              <p className="text-slate-700 leading-relaxed">
                Nous conservons vos données tant que votre compte est actif. Si vous décidez de vous désabonner de nos alertes et de supprimer votre compte, vos données seront effacées de nos bases de données actives dans un délai maximum de 30 jours.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900 mb-3 tracking-tight">5. Vos droits (RGPD)</h2>
              <p className="text-slate-700 leading-relaxed">
                Conformément au Règlement Général sur la Protection des Données (RGPD), vous disposez des droits suivants :
              </p>
              <ul className="list-disc pl-5 space-y-2 text-slate-700 mt-3 mb-4">
                <li>Droit d'accès et de rectification de vos données.</li>
                <li>Droit à l'effacement (droit à l'oubli).</li>
                <li>Droit à la limitation du traitement.</li>
                <li>Droit à la portabilité de vos données.</li>
              </ul>
              <p className="text-slate-700 leading-relaxed">
                Pour exercer ces droits, il vous suffit de nous contacter à l'adresse suivante : <strong>hello@flyradar.fr</strong>. Vous pouvez également vous désabonner à tout moment via le lien présent en bas de chacun de nos emails.
              </p>
            </section>

          </div>

          {/* Pied de page */}
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