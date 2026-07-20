/**
 * paymentSchema.js
 * Rôle : Validation du formulaire d'initiation de paiement avec Zod.
 */
import { z } from 'zod';

export const paymentSchema = z.object({
  objet_paiement: z.enum(['frais_inscription', 'frais_pension', 'frais_examen'], {
    errorMap: () => ({ message: "Veuillez sélectionner un objet de paiement valide." })
  }),
  moyen_paiement: z.enum(['orange_money', 'mtn_momo', 'carte_bancaire'], {
    errorMap: () => ({ message: "Veuillez sélectionner un moyen de paiement valide." })
  }),
  // Le montant est purement indicatif côté front, mais on peut le requérir pour l'envoi
  montant: z.coerce.number().min(1, "Le montant doit être supérieur à 0."),
});
