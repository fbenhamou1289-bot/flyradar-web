import React from 'react';

export default function MentionsLegales() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] py-20 px-4 md:px-8">
      <div className="max-w-4xl mx-auto bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-slate-200">
        
        <h1 className="text-3xl font-black text-slate-900 mb-8 border-b border-slate-100 pb-4">Mentions Légales</h1>
        
        <div className="space-y-8 text-slate-600 leading-relaxed">
          
          {/* SECTION 1 */}
          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">1. Éditeur du site</h2>
            <p>
              Le site <strong>FlyRadar</strong> est édité par :<br />
              <strong>[FlyRadar SAS]</strong><br />
              Statut : [SAS]<br />
              Adresse : [92400 Courbevoie]<br />
              Email de contact : <strong>[hello@flyradar.fr]</strong>
            </p>
          </section>

          {/* SECTION 2 */}
          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">2. Directeur de la publication</h2>
            <p>
              Le directeur de la publication est <strong>[F. Benhamou]</strong>.
            </p>
          </section>

          {/* SECTION 3 */}
          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">3. Hébergement du site</h2>
            <p>
              Le site FlyRadar est hébergé par :<br />
              <strong>[Vercel Inc.]</strong><br />
            </p>
          </section>

          {/* SECTION 4 */}
          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">4. Propriété intellectuelle</h2>
            <p>
              L'ensemble de ce site relève de la législation française et internationale sur le droit d'auteur et la propriété intellectuelle. Tous les droits de reproduction sont réservés, y compris pour les documents téléchargeables et les représentations iconographiques et photographiques.
              La reproduction de tout ou partie de ce site sur un support électronique ou papier quel qu'il soit est formellement interdite sauf autorisation expresse du directeur de la publication.
            </p>
          </section>

          {/* SECTION 5 */}
          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">5. Données personnelles</h2>
            <p>
              Conformément à la loi "Informatique et Libertés" et au RGPD, vous disposez d'un droit d'accès, de rectification et de suppression des données vous concernant. Pour exercer ce droit, vous pouvez nous contacter à l'adresse email mentionnée ci-dessus.
              Pour plus de détails, veuillez consulter notre <a href="/confidentialite" className="text-blue-600 hover:underline font-medium">Politique de Confidentialité</a>.
            </p>
          </section>

        </div>

        <div className="mt-12 pt-6 border-t border-slate-100">
          <button 
            onClick={() => window.history.back()} 
            className="text-blue-600 font-bold hover:text-blue-800 transition-colors flex items-center gap-2"
          >
            &larr; Retourner sur FlyRadar
          </button>
        </div>

      </div>
    </div>
  );
}