import React from 'react';

// Toujours nos icônes
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

export default function CGV() {
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
              Conditions Générales (CGU & CGV)
            </h1>
            
            <p className="text-slate-500 text-base max-w-xl leading-relaxed">
              Dernière mise à jour : Avril 2026. Veuillez lire attentivement ces conditions avant de souscrire à nos services.
            </p>
          </div>

          {/* Corps du texte */}
          <div className="space-y-12">
            
            <section>
              <h2 className="text-xl font-semibold text-slate-900 mb-3 tracking-tight">1. Objet du service (CGU)</h2>
              <p className="text-slate-700 leading-relaxed">
                FlyRadar est un service de veille tarifaire et de recherche personnalisée pour les billets d'avion. Nous scrutons le web pour trouver des baisses de prix, des erreurs tarifaires ou des vols répondant à vos critères spécifiques. 
                <strong> FlyRadar n'est pas une agence de voyage.</strong> Les réservations de vols s'effectuent toujours directement sur les sites des compagnies aériennes ou des agences tierces via les liens que nous fournissons.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900 mb-3 tracking-tight">2. Accès et Services (CGV)</h2>
              <p className="text-slate-700 leading-relaxed mb-4">
                FlyRadar propose plusieurs niveaux de service :
              </p>
              <ul className="list-disc pl-5 space-y-3 text-slate-700">
                <li><strong>Le Radar Gratuit :</strong> Accès aux bons plans standards, limité à une alerte active.</li>
                <li><strong>FlyRadar Gold (Premium) :</strong> Abonnement payant pour des alertes instantanées et illimitées.</li>
                <li><strong>Service Conciergerie (Agent Sniper) :</strong> Un service de recherche sur-mesure sur 72 heures pour une destination et des dates précises, facturé à la performance.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900 mb-3 tracking-tight">3. Tarifs, Paiement et Facturation</h2>
              
              <h3 className="text-lg font-medium text-slate-800 mt-6 mb-2">3.1. Abonnements (FlyRadar Gold)</h3>
              <p className="text-slate-700 leading-relaxed">
                L'abonnement Gold est facturé 9,99€/mois ou 89,90€/an. Il est sans engagement et se renouvelle tacitement sauf résiliation avant la date anniversaire.
              </p>

              <h3 className="text-lg font-medium text-slate-800 mt-6 mb-2">3.2. Service Conciergerie (Agent Sniper)</h3>
              <p className="text-slate-700 leading-relaxed">
                Le service de recherche sur-mesure fonctionne sur un modèle de paiement en deux étapes :
              </p>
              <ul className="list-disc pl-5 mt-2 space-y-2 text-slate-700">
                <li><strong>Frais d'activation :</strong> Un acompte de 9,90€ (TTC) est requis pour lancer la recherche personnalisée pendant 72 heures. Ces frais couvrent les coûts de recherche et sont <strong>strictement non remboursables</strong>, quel que soit le résultat.</li>
                <li><strong>Frais de succès :</strong> Si un vol correspondant à vos critères est trouvé, une facture de succès de 29,00€ (TTC) vous est envoyée. Le paiement de cette somme débloque instantanément le lien de réservation du vol.</li>
                <li><strong>En cas d'échec :</strong> Si aucun vol n'est trouvé dans les 72h, aucun frais supplémentaire n'est facturé. Le client a alors la possibilité de relancer la recherche gratuitement ou d'obtenir un crédit de recherche pour une demande future.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900 mb-3 tracking-tight">4. Résiliation et Rétractation</h2>
              <p className="text-slate-700 leading-relaxed">
                Conformément aux dispositions de l'article L221-28 du Code de la consommation concernant la fourniture de services pleinement exécutés avant la fin du délai de rétractation :
                <br/><br/>
                En souscrivant à l'abonnement Gold ou en activant une recherche Conciergerie (Agent Sniper), vous demandez expressément que l'exécution du service commence immédiatement. Par conséquent, <strong>vous renoncez expressément à votre droit de rétractation de 14 jours</strong> pour les frais d'abonnement ou les frais d'activation de 9,90€ liés à la recherche.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900 mb-3 tracking-tight">5. Limitation de responsabilité</h2>
              <p className="text-slate-700 leading-relaxed">
                FlyRadar s'efforce de fournir des informations exactes en temps réel. Toutefois, les prix des billets d'avion sont soumis à une forte volatilité (Yield Management). Nous ne pouvons garantir que le tarif indiqué dans l'alerte ou la Conciergerie sera indéfiniment disponible. Il appartient au client de finaliser sa réservation dans les plus brefs délais après réception du lien.
                <br/><br/>
                Les honoraires de succès (29€) rémunèrent exclusivement le <strong>service de recherche</strong> et sont dus dès la fourniture du lien. FlyRadar décline toute responsabilité en cas de hausse de prix due à un paiement tardif du client, d'annulation par la compagnie aérienne, ou de tout litige lié au voyage lui-même.
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
