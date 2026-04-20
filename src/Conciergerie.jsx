/**
 * FLYRADAR — LE VRAI SNIPER DE CONCIERGERIE
 * Connecté à la table 'missions_conciergerie'
 */

const axios = require('axios');
const { createClient } = require('@supabase/supabase-js');
const { Resend } = require('resend');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
const resend = new Resend(process.env.RESEND_API_KEY);
const TOKEN    = process.env.TRAVELPAYOUTS_TOKEN;
const PARTNER  = '710622';

// Calcule la différence en jours entre deux dates (format YYYY-MM-DD)
function diffDays(date1, date2) {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  return Math.abs(Math.round((d2 - d1) / (1000 * 60 * 60 * 24)));
}

async function huntTarget(mission) {
  console.log(`\n🎯 MISSION [${mission.client_email}] : ${mission.origine} -> ${mission.destination} (${mission.date_depart})`);
  
  // 1. CALCUL DU BUDGET CIBLE PAR BILLET (Mathématiques FlyRadar)
  const fraisFlyRadar = 38.90;
  const provisionBagage = mission.bagage_soute ? 120 : 0;
  
  const budgetApresFrais = mission.budget_max - fraisFlyRadar;
  const budgetParPassager = budgetApresFrais / mission.passagers;
  const prixCibleApi = Math.floor(budgetParPassager - provisionBagage);

  console.log(`   💰 Budget Client: ${mission.budget_max}€ | Cible API brute exigée: <= ${prixCibleApi}€`);

  try {
    // 2. RECHERCHE API (La 'week-matrix' renvoie les vols +/- 3 jours !)
    const res = await axios.get('https://api.travelpayouts.com/v2/prices/week-matrix', {
      headers: { 'x-access-token': TOKEN },
      params: { 
        origin: mission.origine, 
        destination: mission.destination, 
        depart_date: mission.date_depart,
        return_date: mission.date_retour,
        currency: 'eur',
        show_to_affiliates: true 
      }
    });

    const flights = res.data.data;
    if (!flights || flights.length === 0) {
      console.log(`   ⚠️ Aucun vol trouvé dans la base pour ces dates.`);
      return;
    }

    // 3. APPLICATION DES FILTRES DU CLIENT
    const validFlights = flights.filter(f => {
      // A. Filtre Escales
      if (mission.preferences_escales === 'Vol direct uniquement' && f.number_of_changes > 0) return false;
      if (mission.preferences_escales === '1 escale maximum' && f.number_of_changes > 1) return false;

      // B. Filtre Flexibilité Dates
      const diffAller = diffDays(mission.date_depart, f.depart_date);
      const diffRetour = diffDays(mission.date_retour, f.return_date);
      const maxDiff = Math.max(diffAller, diffRetour);

      if (mission.flexibilite.includes('Aucune') && maxDiff > 0) return false;
      if (mission.flexibilite.includes('1 jour') && maxDiff > 1) return false;
      if (mission.flexibilite.includes('3 jours') && maxDiff > 3) return false;

      return true;
    });

    if (validFlights.length === 0) {
      console.log(`   ❌ Des vols existent, mais aucun ne respecte les filtres (Escales/Flexibilité).`);
      return;
    }

    // Prendre le moins cher
    validFlights.sort((a, b) => a.value - b.value);
    const bestFlight = validFlights[0];
    
    // Mettre à jour le "meilleur prix vu" pour rassurer le client sur son espace membre
    await supabase.from('missions_conciergerie').update({
      meilleur_prix_vu: bestFlight.value,
      date_meilleur_prix: new Date().toISOString()
    }).eq('id', mission.id);

    // 4. LE VERDICT
    if (bestFlight.value <= prixCibleApi) {
      console.log(`   ✅ CIBLE ABATTUE ! Vol trouvé à ${bestFlight.value}€. Envoi de l'email...`);
      
      const departParam = `${bestFlight.depart_date.split('-')[2]}${bestFlight.depart_date.split('-')[1]}`;
      const returnParam = `${bestFlight.return_date.split('-')[2]}${bestFlight.return_date.split('-')[1]}`;
      const bookingUrl = `https://www.aviasales.fr/search/${mission.origine}${departParam}${mission.destination}${returnParam}1?marker=${PARTNER}`;

      await sendSuccessEmail(mission, bestFlight, bookingUrl);
      
      // On clôture la mission
      await supabase.from('missions_conciergerie').update({ 
        statut: 'trouve',
        prix_trouve: bestFlight.value,
        lien_reservation: bookingUrl,
        fin_traque: new Date().toISOString()
      }).eq('id', mission.id);

    } else {
      console.log(`   ❌ Trop cher. Meilleur prix : ${bestFlight.value}€. On continue la traque.`);
    }

  } catch (e) {
    console.log(`   ⚠️ Erreur de connexion API.`);
  }
}

async function sendSuccessEmail(mission, flight, bookingUrl) {
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden;">
      <div style="background-color: #0f172a; padding: 25px; text-align: center;">
        <h2 style="color: #3b82f6; margin: 0; font-size: 24px;">FlyRadar <span style="color: white;">Conciergerie</span></h2>
      </div>
      <div style="padding: 30px; background-color: #ffffff;">
        <p style="font-size: 16px; color: #334155; margin-top: 0;">Bonjour,</p>
        <p style="font-size: 16px; color: #334155;">Bonne nouvelle ! Notre Agent Sniper vient de verrouiller un vol correspondant exactement à votre demande.</p>
        
        <div style="background-color: #f8fafc; padding: 20px; border-radius: 12px; border-left: 4px solid #3b82f6; margin: 25px 0;">
          <h3 style="margin: 0 0 10px 0; font-size: 20px; color: #0f172a;">${mission.origine} ✈️ ${mission.destination}</h3>
          <p style="margin: 0 0 5px 0; color: #475569;">Départ : <strong>${flight.depart_date}</strong></p>
          <p style="margin: 0 0 15px 0; color: #475569;">Retour : <strong>${flight.return_date}</strong></p>
          
          <div style="background-color: #10B981; color: white; display: inline-block; padding: 5px 10px; border-radius: 6px; font-weight: bold; font-size: 14px;">
            DANS VOTRE BUDGET !
          </div>
        </div>

        <p style="font-size: 14px; color: #64748b; margin-bottom: 25px;">Vos préférences ont été respectées : ${mission.passagers} passager(s) | Bagage soute : ${mission.bagage_soute ? 'Oui' : 'Non'} | ${mission.preferences_escales}</p>

        <a href="${bookingUrl}" style="display: block; text-align: center; background-color: #0f172a; color: #ffffff; text-decoration: none; padding: 18px; border-radius: 12px; font-weight: 900; font-size: 16px; letter-spacing: 1px;">
          VOIR LE VOL & RÉSERVER
        </a>
        
        <p style="font-size: 12px; color: #94a3b8; text-align: center; margin-top: 20px;">
          Les prix des compagnies aériennes fluctuent très vite. Ne tardez pas à réserver.
        </p>
      </div>
    </div>
  `;

  await resend.emails.send({
    from: 'FlyRadar Conciergerie <hello@flyradar.fr>',
    to: mission.client_email,
    subject: `🎯 Votre vol pour ${mission.destination} a été trouvé !`,
    html: htmlContent
  });
}

async function runSniper() {
  console.log("Démarrage du Sniper de Conciergerie...");
  
  // On cible uniquement les missions payées ("en_cours") ou passées avec crédit ("en_attente")
  const { data: missions, error } = await supabase
    .from('missions_conciergerie')
    .select('*')
    .in('statut', ['en_attente', 'en_cours']);

  if (error || !missions || missions.length === 0) {
    console.log("Aucune cible en cours. Le Sniper retourne dormir.");
    return;
  }

  console.log(`${missions.length} mission(s) à traiter.`);

  for (const mission of missions) {
    await huntTarget(mission);
    await new Promise(r => setTimeout(r, 1000)); // Pause pour ne pas brusquer l'API
  }

  console.log("Patrouille terminée.");
}

runSniper();
