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
              Dernière mise à jour : 29 Mars 2026. Veuillez lire attentivement ces conditions avant de souscrire à nos services.
            </p>
          </div>

          {/* Corps du texte */}
          <div className="space-y-12">
            
            <section>
              <h2 className="text-xl font-semibold text-slate-900 mb-3 tracking-tight">1. Objet du service (CGU)</h2>
              <p className="text-slate-700 leading-relaxed">
                FlyRadar est un service de veille et d'alerte tarifaire pour les billets d'avion. Nous scrutons le web pour trouver des baisses de prix, des erreurs tarifaires ou des promotions, et nous envoyons ces alertes à nos utilisateurs par email. 
                <strong> FlyRadar n'est pas une agence de voyage.</strong> Les réservations de vols s'effectuent toujours directement sur les sites des compagnies aériennes ou des agences tierces.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900 mb-3 tracking-tight">2. Accès et Abonnements (CGV)</h2>
              <p className="text-slate-700 leading-relaxed mb-4">
                FlyRadar propose deux niveaux de service :
              </p>
              <ul className="list-disc pl-5 space-y-3 text-slate-700">
                <li><strong>Le Radar Gratuit :</strong> Accès aux bons plans standards en classe Éco, avec un différé d'envoi par rapport aux membres Gold, limité à une alerte active.</li>
                <li><strong>FlyRadar Gold (Premium) :</strong> Un abonnement payant permettant de recevoir les alertes instantanément (avant la correction des prix), incluant les classes Business/Première et des alertes illimitées.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900 mb-3 tracking-tight">3. Tarifs, Paiement et Renouvellement</h2>
              <p className="text-slate-700 leading-relaxed">
                L'abonnement FlyRadar Gold est proposé au tarif de 9,99€ / mois ou 89,90€ / an (prix TTC). Les paiements sont sécurisés et traités par notre partenaire Stripe. L'abonnement est <strong>sans engagement</strong> et se renouvelle tacitement par périodes successives équivalentes à la période initiale, sauf résiliation de votre part avant la date de renouvellement.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900 mb-3 tracking-tight">4. Résiliation et Rétractation</h2>
              <p className="text-slate-700 leading-relaxed">
                Vous pouvez résilier votre abonnement Gold à tout moment depuis votre espace client ou via le lien de désabonnement. La résiliation prendra effet à la fin de la période de facturation en cours. 
                Conformément à la loi, s'agissant d'un contenu numérique fourni sur un support immatériel et dont l'exécution a commencé avec votre accord préalable, <strong>vous renoncez expressément à votre droit de rétractation de 14 jours</strong> dès l'activation de votre compte Gold et la réception de la première alerte.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900 mb-3 tracking-tight">5. Limitation de responsabilité</h2>
              <p className="text-slate-700 leading-relaxed">
                FlyRadar s'efforce de fournir des informations exactes en temps réel. Toutefois, les prix des billets d'avion sont extrêmement volatiles. Nous ne pouvons garantir que le tarif indiqué dans l'alerte sera toujours disponible au moment où vous cliquerez sur le lien de réservation.
                <br/><br/>
                FlyRadar décline toute responsabilité en cas d'annulation de votre billet par la compagnie aérienne (notamment en cas de "Error Fare" / Tarif erroné non honoré par la compagnie), de modification de vol, ou de tout litige vous opposant au site de réservation final.
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