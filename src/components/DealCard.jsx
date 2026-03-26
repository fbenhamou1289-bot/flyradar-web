import React from 'react';
import { MapPin, Calendar, Clock, Plane, ArrowRight, Star, Tag, AlertCircle, Briefcase, Zap, ArrowRightLeft, Lock } from 'lucide-react';

export default function DealCard({ deal, variant = 'hero', onGoldClick, onPremiumClick, currency, t }) {
  // 1. GESTION DE LA COMPAGNIE
  const airlineMap = {
    'U2': 'easyJet', 'FR': 'Ryanair', 'TO': 'Transavia', 'AF': 'Air France',
    'BA': 'British Airways', 'LH': 'Lufthansa', 'EK': 'Emirates', 'QR': 'Qatar Airways',
    'V7': 'Volotea', 'VY': 'Vueling', 'IB': 'Iberia', 'TP': 'TAP Portugal',
    'CA': 'Air China', 'TK': 'Turkish Airlines', 'EY': 'Etihad Airways'
  };
  const displayAirline = airlineMap[deal.airline] || deal.airline || 'Compagnie Régulière';

  // 2. GESTION DE L'IMAGE (Fallback propre)
  const premiumPhotos = {
    'milan': 'https://images.unsplash.com/photo-1513581166391-887a96dde8dd?auto=format&fit=crop&q=80&w=800',
    'dubaï': 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&q=80&w=800',
    'new york': 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&q=80&w=800',
    'tokyo': 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&q=80&w=800',
    'bangkok': 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&q=80&w=800',
    'maldives': 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&q=80&w=800',
    'cancun': 'https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&q=80&w=800',
    'bali': 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&q=80&w=800',
    'londres': 'https://images.unsplash.com/photo-1513635269975-59693e0908c7?auto=format&fit=crop&q=80&w=800',
    'rome': 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&q=80&w=800',
    'lisbonne': 'https://images.unsplash.com/photo-1585218356057-0fc2fcba65cb?auto=format&fit=crop&q=80&w=800',
    'singapour': 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&q=80&w=800'
  };
  const regionPhotos = {
    'Europe': 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?auto=format&fit=crop&q=80&w=800',
    'Asie': 'https://images.unsplash.com/photo-1535139262971-c5184570f70f?auto=format&fit=crop&q=80&w=800',
    'Amériques': 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?auto=format&fit=crop&q=80&w=800',
    'Moyen-Orient': 'https://images.unsplash.com/photo-1582650625105-ce0a6e0eb0c5?auto=format&fit=crop&q=80&w=800',
    'Toutes': 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&q=80&w=800'
  };

  const destKey = deal.destination ? deal.destination.toLowerCase().trim() : '';
  
  // Si l'image de la DB est cassée ou absente, on tape dans notre dictionnaire
  let imageUrl = (deal.image && !deal.image.includes('loremflickr') && !deal.image.includes('1522083165195')) 
                 ? deal.image : (premiumPhotos[destKey] || regionPhotos[deal.region] || regionPhotos['Toutes']);

  // 3. BADGES VISUELS
  let badgeColor = 'bg-slate-800 text-white';
  let badgeText = deal.category || 'DEAL';
  let discountColor = 'text-slate-900';
  let IconBadge = Tag;

  if (deal.discount >= 60 || (deal.category && deal.category.toLowerCase().includes('erreur'))) {
    badgeColor = 'bg-yellow-500 text-white'; badgeText = 'RARE FIND'; discountColor = 'text-yellow-500'; IconBadge = Tag;
  } else if (deal.discount >= 40 || (deal.category && deal.category.toLowerCase().includes('super'))) {
    badgeColor = 'bg-orange-500 text-white'; badgeText = 'SUPER DEAL'; discountColor = 'text-orange-600'; IconBadge = Zap;
  } else {
    // ICI : on met le texte en slate-900 (très foncé) pour que ça soit lisible sur le jaune !
    badgeColor = 'bg-amber-400 text-slate-900'; badgeText = 'BON PLAN'; discountColor = 'text-amber-500'; IconBadge = AlertCircle;
  }

  // 4. FORMATAGE DES DATES ET INFOS
  const formatDate = (dateString) => {
    if (!dateString || dateString.includes('inconnu')) return 'Dates flexibles';
    try {
      // Si c'est juste un mois "YYYY-MM"
      if (dateString.length === 7) {
        const [year, month] = dateString.split('-');
        return new Date(year, parseInt(month) - 1).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
      }
      // Si c'est une date complète "YYYY-MM-DD" ou ISO
      const date = new Date(dateString);
      return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
    } catch (e) {
      return dateString;
    }
  };

  const displayDates = formatDate(deal.dates || deal.flight_month);
  
  // On ne retourne pas de "--", on retourne "null" pour masquer l'élément dans la grille
  const displayDuration = deal.duration ? deal.duration : null;
  const displayStops = deal.stops !== null && deal.stops !== undefined ? (deal.stops === 0 ? 'Vol direct' : `${deal.stops} escale(s)`) : null;
  const displayTrip = deal.tripType || 'Aller-retour';

  // 5. GESTION DES CLICS
  const handleCardClick = (e) => {
    if (deal.isGold) {
      e.preventDefault();
      onGoldClick();
    } else if (deal.isPremium) {
      e.preventDefault();
      onPremiumClick();
    }
  };

  // ----------------------------------------------------
  // VARIANTE 1 : CIMETIÈRE (EXPIRÉ)
  // ----------------------------------------------------
  if (variant === 'expired') {
    return (
      <div className="group relative bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100 opacity-60 grayscale transition-all hover:grayscale-0 hover:opacity-100">
        <div className="absolute top-4 right-4 z-20 bg-slate-900 text-white text-[10px] font-bold px-3 py-1.5 rounded-full tracking-widest uppercase shadow-lg">
          {t.expiredStamp}
        </div>
        <div className="aspect-[4/3] relative overflow-hidden">
          <img src={imageUrl} alt={deal.destination} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent"></div>
        </div>
        <div className="p-6 relative bg-white">
          <div className="flex justify-between items-end mb-2">
            <div>
              <div className="flex items-center gap-2 text-slate-500 text-xs font-bold mb-1 uppercase tracking-widest">
                <span>{deal.origin}</span><Plane size={12} /><span>{deal.destCode}</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900">{deal.destination}</h3>
            </div>
            <div className="text-right">
              <div className="text-2xl font-black text-slate-900">Dès {deal.price}{currency}</div>
              <div className="text-xs text-slate-400 line-through">{deal.avgPrice}{currency}</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // VARIANTE 2 : BANNIÈRE GOLD (L'Embuscade Corrigée)
  // ----------------------------------------------------
  if (variant === 'banner') {
    return (
      <div onClick={onGoldClick} className="group relative w-full h-40 md:h-48 rounded-3xl overflow-hidden shadow-md cursor-pointer transition-all hover:shadow-xl border border-amber-200/50">
        {/* L'image de fond avec le flou "Frosted Glass" et un filtre plus lisible */}
        <div className="absolute inset-0 overflow-hidden bg-slate-900">
          <img src={imageUrl} alt="Destination secrète" className="w-full h-full object-cover opacity-50 blur-[8px] scale-110" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/70 to-transparent"></div>
        </div>
        
        {/* Le Contenu de la bannière */}
        <div className="relative h-full flex items-center justify-between px-6 md:px-10">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/30 shrink-0">
              <Lock size={28} className="text-white" />
            </div>
            <div>
              <div className="text-amber-400 text-xs font-bold uppercase tracking-widest mb-1">DÉTECTION ÉLITE</div>
              <h3 className="text-white text-xl md:text-2xl font-bold tracking-tight">Pépite secrète {deal.region ? `en ${deal.region}` : ''}</h3>
              <div className="flex items-center gap-3 mt-2">
                <span className="bg-white text-slate-900 text-xs font-black px-2 py-0.5 rounded-md">-{deal.discount}%</span>
                <span className="text-slate-300 text-sm font-medium hidden sm:inline">Prix estimé : <span className="text-white font-bold">{deal.price}{currency}</span></span>
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            <button className="bg-amber-500 hover:bg-amber-400 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-lg flex items-center gap-2 text-sm whitespace-nowrap">
              Débloquer avec Gold
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // VARIANTE 3 : MINI-CARTE (Le Flux)
  // ----------------------------------------------------
  if (variant === 'mini') {
    return (
      <a href={deal.bookingUrl} target="_blank" rel="noopener noreferrer" onClick={handleCardClick} className="group relative bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-md hover:border-blue-100 transition-all duration-200 flex h-32 cursor-pointer">
        {/* Photo Carrée à gauche */}
        <div className="w-32 h-full relative overflow-hidden flex-shrink-0">
          <img src={imageUrl} alt={deal.destination} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/20"></div>
          <div className="absolute top-2 left-2">
            <div className={`${badgeColor} text-white text-[9px] font-bold px-2 py-1 rounded-md shadow-md uppercase tracking-widest`}>
              -{deal.discount}%
            </div>
          </div>
        </div>
        
        {/* Infos resserrées à droite */}
        <div className="p-4 flex-1 flex flex-col justify-between overflow-hidden">
          <div>
            <div className="flex items-center justify-between mb-0.5">
              <h3 className="text-lg font-bold text-slate-900 leading-tight truncate pr-2">{deal.destination}</h3>
              <span className="text-xs font-bold text-slate-400 flex items-center gap-1 shrink-0"><Plane size={12}/> {deal.destCode}</span>
            </div>
            <p className="text-slate-500 text-xs font-medium mb-2 flex items-center gap-1 truncate">
              <MapPin size={12} className="opacity-70 shrink-0" /> {deal.region}
            </p>
            <p className="text-slate-600 text-xs font-medium flex items-center gap-1.5 truncate">
              <Calendar size={12} className="text-slate-400 shrink-0" /> <span className="truncate capitalize">{displayDates}</span>
            </p>
          </div>
          <div className="flex items-end justify-between mt-1">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{deal.travelClass === 'Business' ? 'Business' : 'Éco'}</div>
            <div className="text-lg font-black text-blue-600 whitespace-nowrap">Dès {deal.price}{currency}</div>
          </div>
        </div>
      </a>
    );
  }

  // ----------------------------------------------------
  // VARIANTE 4 : HERO (Grand Format - Les 4 Élus)
  // ----------------------------------------------------
  return (
    <div className={`group relative bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-lg transition-all duration-300 flex flex-col h-full`}>
      <div className="aspect-[16/10] relative overflow-hidden bg-slate-100">
        <img src={imageUrl} alt={deal.destination} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent"></div>
        
        <div className="absolute top-4 left-4 z-20">
          <div className={`${badgeColor} text-white text-[10px] font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 uppercase tracking-widest shadow-lg`}>
            <IconBadge size={12} className="fill-white" /> {badgeText}
          </div>
        </div>
        <div className="absolute top-4 right-4 z-20">
          <div className={`bg-white ${discountColor} text-sm font-black px-3 py-1.5 rounded-xl shadow-lg border border-white/20`}>
            -{deal.discount}%
          </div>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 p-5">
          <div className="flex justify-between items-end">
            <div className="text-white">
              <div className="flex items-center gap-2 text-white/80 text-xs font-bold mb-1.5 uppercase tracking-widest">
                <span>{deal.origin}</span><Plane size={12} className="opacity-60" /><span>{deal.destCode}</span>
              </div>
              <h3 className="text-3xl font-bold tracking-tight mb-1">{deal.destination}</h3>
              <p className="text-white/80 text-sm font-medium flex items-center gap-1.5">
                <MapPin size={14} className="opacity-60" /> {deal.region}
              </p>
            </div>
            {deal.score && (
              <div className="bg-slate-900/80 backdrop-blur-md border border-white/10 rounded-xl p-2.5 text-center min-w-[4rem]">
                <div className="text-amber-400 font-black text-lg flex items-center justify-center gap-1"><Star size={14} className="fill-amber-400" /> {deal.score}</div>
                <div className="text-[9px] text-white/60 uppercase tracking-widest font-bold mt-0.5">Score</div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="p-6 flex-1 flex flex-col">
        <div className="grid grid-cols-2 gap-y-4 gap-x-2 mb-6 text-[13px]">
          <div className="flex items-center gap-2 text-slate-700 font-medium"><Calendar size={16} className="text-slate-400" /> <span className="truncate capitalize">{displayDates}</span></div>
          <div className="flex items-center gap-2 text-slate-700 font-medium"><Plane size={16} className="text-slate-400" /> <span className="truncate">{displayAirline}</span></div>
          
          {/* Grille conditionnelle : si pas de durée ou d'escales, on n'affiche pas la case ! */}
          {displayDuration && <div className="flex items-center gap-2 text-slate-700 font-medium"><Clock size={16} className="text-slate-400" /> <span>{displayDuration}</span></div>}
          {displayStops && <div className="flex items-center gap-2 text-slate-700 font-medium"><MapPin size={16} className="text-slate-400" /> <span>{displayStops}</span></div>}
          
          <div className="flex items-center gap-2 text-slate-700 font-medium"><Briefcase size={16} className="text-slate-400" /> <span>{deal.cabinBag ? 'Bagage inclus' : 'Sans bagage'}</span></div>
          <div className="flex items-center gap-2 text-slate-700 font-medium"><ArrowRightLeft size={16} className="text-slate-400" /> <span>{displayTrip}</span></div>
        </div>

        <div className="w-full h-px bg-slate-100 mb-5"></div>

        <div className="mt-auto flex items-end justify-between">
          <div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">{deal.travelClass}</div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-slate-900 tracking-tight whitespace-nowrap">Dès {deal.price}{currency}</span>
              <span className="text-sm font-bold text-slate-400 line-through">{deal.avgPrice}{currency}</span>
            </div>
          </div>
          
          <a href={deal.bookingUrl || '#'} target="_blank" rel="noopener noreferrer" onClick={handleCardClick} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-md shadow-blue-600/20 flex items-center gap-2 text-sm">
            Voir les dates <ArrowRight size={16} />
          </a>
        </div>
      </div>
    </div>
  );
}