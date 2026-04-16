import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Target, Crown, User, HelpCircle, ChevronDown, Mail, ArrowLeft } from 'lucide-react';

const faqData = [
  {
    question: "Comment fonctionne FlyRadar ?",
    answer: "FlyRadar propose deux services. 1. La Veille Automatique : nos agents traquent les erreurs de prix et vous envoient les meilleures offres par email (Gratuit ou Gold). 2. La Conciergerie (Agent Sniper) : vous nous confiez une recherche sur-mesure pour vos dates et votre destination, et nous traquons le meilleur tarif pour vous pendant 72h."
  },
  {
    question: "Puis-je demander une destination ou des dates précises ?",
    answer: "Oui ! C'est exactement le rôle de notre service Conciergerie (Agent Sniper). Vous renseignez votre destination, vos dates et votre budget. Nous activons une traque personnalisée de 72 heures pour un acompte de 9,90€. Si nous trouvons votre vol, une commission de succès de 29€ vous sera demandée pour débloquer le lien de réservation secret."
  },
  {
    question: "Que se passe-t-il si l'Agent Sniper ne trouve rien en 72h ?",
    answer: "Si notre algorithme ne trouve aucun vol correspondant à vos critères dans le temps imparti, la mission s'arrête et les 29€ de succès ne vous sont évidemment pas facturés. Vous recevrez un email vous proposant deux choix : relancer la traque gratuitement pour 72h supplémentaires, ou obtenir un 'Crédit' qui vous offrira l'acompte de 9,90€ lors de votre prochaine demande."
  },
  {
    question: "Comment sont calculés les scores des offres (sur 10) ?",
    answer: "Le score FlyRadar est un indicateur de rareté exclusif calculé par notre algorithme. Il prend en compte 4 critères majeurs : l'importance de la réduction par rapport au prix moyen habituel, la qualité du trajet (vol direct ou escales courtes), l'attractivité de la période (haute saison, vacances), et la fiabilité de la compagnie. Un score supérieur à 8,5/10 indique une offre exceptionnelle qui risque d'expirer dans les minutes qui suivent."
  },
  {
    question: "Pourquoi le prix sur le site de réservation est parfois différent de l'alerte ?",
    answer: "C'est la dure loi de l'aérien : les prix changent en temps réel en fonction de l'offre et de la demande (le 'yield management'). Si, en cliquant sur notre lien, le prix a augmenté sur le site de la compagnie, c'est que l'erreur tarifaire a été corrigée ou que les derniers sièges à ce prix ont été vendus. C'est pour cette raison que la réactivité est cruciale, et c'est tout l'intérêt des alertes instantanées de notre abonnement Gold !"
  },
  {
    question: "Proposez-vous des hôtels ou des séjours tout compris ?",
    answer: "Non. Nous sommes spécialisés uniquement dans l'aérien. Nous nous concentrons à 100 % sur les billets d'avion (Éco, Business, Première) pour vous garantir les meilleures alertes du marché."
  },
  {
    question: "Pourquoi passer à FlyRadar Gold si le service est gratuit ?",
    answer: "C'est une question de timing. Une vraie erreur de prix est souvent corrigée par la compagnie aérienne en moins de 2 heures. Les membres gratuits ont accès aux offres avec 4 heures de retard sur le site. Avec Gold, vous recevez les alertes en temps réel, à la seconde où nos agents les trouvent. De plus, vous avez accès aux offres en classe Affaires et Première."
  },
  {
    question: "L'abonnement Gold est-il sans engagement ?",
    answer: "Totalement. Vous pouvez annuler votre abonnement (mensuel ou annuel) à tout moment en un seul clic, sans aucune justification ni frais cachés."
  },
  {
    question: "Le paiement est-il sécurisé ?",
    answer: "Oui, à 100 %. Nous utilisons Stripe, le leader mondial du paiement en ligne sécurisé, que ce soit pour les abonnements ou la Conciergerie. Vos données bancaires sont entièrement cryptées et nous n'y avons jamais accès."
  },
  {
    question: "Je suis inscrit mais je ne reçois pas d'alertes, pourquoi ?",
    answer: "Les membres gratuits reçoivent un seul email par semaine. Si vous ne l'avez pas reçu, pensez à vérifier vos courriers indésirables (Spams) ou l'onglet 'Promotions' sur Gmail. Ajoutez hello@flyradar.fr à vos contacts pour être sûr de ne rien rater."
  },
  {
    question: "Comment me désinscrire ?",
    answer: "Chaque email que nous envoyons contient un lien 'Se désinscrire' tout en bas. Un clic suffit pour arrêter immédiatement la surveillance de nos alertes automatiques."
  }
];

const AccordionItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`border rounded-2xl mb-4 bg-white overflow-hidden transition-all duration-300 ${isOpen ? 'border-blue-400 shadow-md ring-4 ring-blue-50' : 'border-slate-200 hover:border-blue-300 shadow-sm'}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-5 md:p-6 text-left focus:outline-none"
      >
        <span className="font-bold text-slate-900 text-base md:text-lg pr-4">{question}</span>
        <ChevronDown 
          className={`text-blue-500 shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} 
          size={24} 
        />
      </button>
      {isOpen && (
        <div className="px-5 md:px-6 pb-6 text-slate-600 text-sm md:text-base font-medium leading-relaxed animate-in fade-in slide-in-from-top-2 duration-300">
          {answer}
        </div>
      )}
    </div>
  );
};

export default function Aide() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans selection:bg-blue-100 selection:text-blue-900">
      
      {/* HEADER */}
      <header className="h-16 md:h-20 px-4 md:px-8 flex items-center justify-between bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
            <Target className="text-blue-600" size={24} strokeWidth={2.5} />
            <span className="text-xl md:text-2xl tracking-tight text-slate-900">
              <span className="font-bold">Fly</span><span className="font-bold text-blue-600">Radar</span>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 md:gap-4 lg:gap-5">
          <button onClick={() => navigate('/connexion')} className="flex items-center gap-1.5 text-sm font-bold text-slate-600 hover:text-slate-900 transition-colors">
            <User size={16} /> Connexion
          </button>

          <button onClick={() => navigate('/')} className="flex items-center gap-1.5 text-sm font-bold text-slate-700 hover:text-slate-900 transition-colors border border-slate-300 px-4 py-2 rounded-full hover:bg-slate-50 hidden md:flex">
            <ArrowLeft size={16} /> Retour à l'accueil
          </button>
          
          <button onClick={() => navigate('/inscription-gold')} className="text-xs md:text-sm font-bold text-white bg-amber-500 hover:bg-amber-400 transition-colors border border-amber-600/20 px-4 py-2 rounded-full flex items-center gap-1.5 shadow-sm">
            <Crown size={16} /> Go Gold
          </button>
        </div>
      </header>

      {/* CONTENU PRINCIPAL */}
      <main className="flex-grow w-full max-w-3xl mx-auto px-4 py-12 md:py-20">
        
        <div className="text-center mb-12 md:mb-16">
          <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <HelpCircle size={32} strokeWidth={2.5} />
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">Comment pouvons-nous vous aider ?</h1>
          <p className="text-base md:text-lg text-slate-500 font-medium px-4">Retrouvez les réponses aux questions les plus posées par notre communauté.</p>
        </div>

        <div className="mb-16">
          {faqData.map((faq, index) => (
            <AccordionItem key={index} question={faq.question} answer={faq.answer} />
          ))}
        </div>

        {/* Bloc Contact Support */}
        <div className="bg-slate-900 rounded-[2rem] p-8 md:p-10 text-center text-white relative overflow-hidden shadow-2xl">
          <div className="relative z-10 flex flex-col items-center">
            <Mail className="text-amber-400 mb-4" size={40} />
            <h2 className="text-2xl md:text-3xl font-black mb-3">Vous n'avez pas trouvé votre réponse ?</h2>
            <p className="text-slate-300 mb-8 max-w-md font-medium text-sm md:text-base">
              Notre équipe est disponible pour mettre à jour votre profil ou répondre à vos questions concernant l'abonnement Gold ou la Conciergerie.
            </p>
            <button 
              onClick={() => navigate('/contact')}
              className="w-full sm:w-auto bg-white text-slate-900 font-black py-4 px-8 rounded-xl hover:bg-slate-100 transition-all flex items-center justify-center gap-2 uppercase tracking-widest text-xs shadow-lg shadow-white/10 hover:scale-105 active:scale-95 mx-auto"
            >
              Contactez-nous
            </button>
          </div>
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-500 rounded-full blur-[80px] opacity-20 pointer-events-none"></div>
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-amber-500 rounded-full blur-[80px] opacity-20 pointer-events-none"></div>
        </div>

      </main>

      {/* FOOTER */}
      <footer className="py-12 text-center border-t border-slate-200 bg-white flex flex-col items-center justify-center">
        <p className="text-slate-400 text-xs font-black uppercase tracking-[0.3em] mb-4">© 2026 FlyRadar aviation • No limits</p>
        
        <div className="flex flex-wrap justify-center gap-4 text-xs font-medium text-slate-400">
          <button onClick={() => navigate('/aide')} className="text-slate-700 font-bold">Aide / FAQ</button>
          <span>|</span>
          <button onClick={() => navigate('/mentions-legales')} className="hover:text-slate-700 transition-colors">Mentions Légales</button>
          <span>|</span>
          <button onClick={() => navigate('/confidentialite')} className="hover:text-slate-700 transition-colors">Politique de Confidentialité</button>
          <span>|</span>
          <button onClick={() => navigate('/cgv')} className="hover:text-slate-700 transition-colors">CGV & CGU</button>
        </div>
      </footer>

    </div>
  );
}
