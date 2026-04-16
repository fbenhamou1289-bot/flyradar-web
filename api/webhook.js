import { createClient } from '@supabase/supabase-js';
import Stripe from 'stripe';
import { Resend } from 'resend';

// Initialisation des outils
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_SERVICE_ROLE_KEY);
const resend = new Resend(process.env.RESEND_API_KEY); 

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error(`❌ Erreur de signature Webhook: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // 🟢 SCÉNARIO : PAIEMENT UNIQUE (Acompte ou Succès Conciergerie)
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const missionId = session.client_reference_id;
    const montantPaye = session.amount_total; // Le montant en centimes

    if (!missionId) {
        console.log("⚠️ Paiement reçu sans ID de mission, on ignore (peut-être un test ou autre achat).");
    } else if (montantPaye === 990) {
        // ACOMPTE DE 9,90€
        console.log(`🚀 Acompte reçu (9,90€). Activation de la traque pour la mission #${missionId}`);
        await supabase.from('missions_conciergerie').update({ statut: 'en_attente' }).eq('id', missionId);
    } else if (montantPaye === 2900) {
        // SUCCÈS DE 29,00€
        console.log(`💰 Succès payé (29€) pour la mission #${missionId} ! Envoi du billet...`);
        const { data: mission } = await supabase.from('missions_conciergerie').select('*').eq('id', missionId).single();
        
        if (mission && mission.lien_reservation) {
            await resend.emails.send({
                from: 'FlyRadar Conciergerie <onboarding@resend.dev>', // Pense à changer ça quand tu auras validé ton domaine Resend
                to: mission.client_email,
                subject: `✈️ Vos billets d'avion pour ${mission.destination} sont prêts !`,
                html: `<!DOCTYPE html>
<html lang="fr">
<body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: Arial, sans-serif;">
  <table width="100%" bgcolor="#f8fafc" cellpadding="0" cellspacing="0" border="0" style="padding: 30px 10px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 520px; background-color: #ffffff; border-radius: 24px; border: 1px solid #e2e8f0; overflow: hidden;">
          <tr>
            <td style="padding: 40px 30px; text-align: center;">
              <div style="width: 60px; height: 60px; background-color: #10B981; color: white; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 20px;">
                <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
              </div>
              <h1 style="color: #0f172a; font-size: 24px; font-weight: 900; margin: 0 0 10px 0;">Paiement validé !</h1>
              <p style="color: #475569; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
                Merci pour votre confiance. Comme promis, voici le lien direct vers le tarif négocié par notre Agent Sniper pour votre vol vers <b>${mission.destination}</b>.
              </p>
              <table align="center" cellpadding="0" cellspacing="0" border="0" width="100%">
                <tr>
                  <td bgcolor="#2563eb" style="border-radius: 8px;">
                    <a href="${mission.lien_reservation}" style="display: block; padding: 18px; text-decoration: none; color: #ffffff; font-weight: 900; font-size: 14px; letter-spacing: 1px; text-align: center;">
                       ✈️ ACCÉDER À MA RÉSERVATION
                    </a>
                  </td>
                </tr>
              </table>
              <p style="color: #94a3b8; font-size: 12px; margin-top: 25px; line-height: 1.5;">
                Cliquez sur le bouton ci-dessus pour finaliser la transaction directement auprès de la compagnie aérienne sur Google Flights. Bon voyage !
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
            });
            await supabase.from('missions_conciergerie').update({ statut: 'clos_succes' }).eq('id', missionId);
            console.log(`✅ Dossier #${missionId} clôturé avec succès.`);
        } else {
            console.error(`❌ Erreur: Impossible de trouver le lien de réservation pour la mission #${missionId}`);
        }
    }
  }

  // 👑 SCÉNARIO : PAIEMENT ABONNEMENT GOLD (Distribution du crédit mensuel/annuel)
  if (event.type === 'invoice.paid') {
    const invoice = event.data.object;
    const customerEmail = invoice.customer_email;
    const montantPaye = invoice.amount_paid; // Le montant en centimes

    // Vérifie si le paiement correspond à un abonnement Gold (9,99€ ou 89,90€)
    if (customerEmail && (montantPaye === 999 || montantPaye === 8990)) {
        console.log(`👑 Paiement Gold validé pour ${customerEmail} (${montantPaye / 100}€). Attribution du crédit !`);
        
        try {
            // 1. Récupère le nombre de crédits actuels de l'utilisateur
            const { data: userData } = await supabase
                .from('Users')
                .select('credits_conciergerie')
                .eq('email', customerEmail)
                .maybeSingle();
            
            const currentCredits = userData?.credits_conciergerie || 0;
            
            // 2. Ajoute +1 crédit (upsert crée la ligne si l'email n'existe pas encore dans la table)
            await supabase.from('Users').upsert({ 
                email: customerEmail, 
                credits_conciergerie: currentCredits + 1 
            }, { onConflict: 'email' });
            
            console.log(`✅ +1 Crédit Conciergerie ajouté avec succès pour ${customerEmail}.`);
        } catch (err) {
            console.error(`❌ Erreur lors de l'attribution du crédit pour ${customerEmail}:`, err);
        }
    }
  }

  res.status(200).json({ received: true });
}
