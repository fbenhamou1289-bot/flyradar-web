import { createClient } from '@supabase/supabase-js';

// On utilise les mêmes clés Supabase que ton site web
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req, res) {
  // Petite sécurité : on exige un mot de passe secret dans l'URL
  if (req.query.secret !== 'FLYRADAR2026_PRO') {
    return res.status(401).send('Accès refusé');
  }

  if (req.method === 'POST') {
    try {
      const event = req.body;

      // On écoute uniquement le signal "Paiement réussi" de Stripe
      if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        const missionId = session.client_reference_id; // Le fameux ticket secret !

        if (missionId) {
          // 🚀 MAGIE : On réveille le dossier dans la base de données
          await supabase
            .from('missions_conciergerie')
            .update({ statut: 'en_attente' })
            .eq('id', missionId);
            
          console.log(`✅ Paiement validé. Dossier ${missionId} passé en_attente.`);
        }
      }

      // On répond à Stripe que tout s'est bien passé
      res.status(200).json({ received: true });
    } catch (error) {
      console.error("Erreur du Webhook:", error);
      res.status(500).json({ error: "Erreur interne" });
    }
  } else {
    res.status(405).send('Méthode non autorisée');
  }
}
