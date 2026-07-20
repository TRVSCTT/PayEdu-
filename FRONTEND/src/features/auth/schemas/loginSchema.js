/**
 * loginSchema.js
 * Rôle : Validation des données du formulaire de connexion avec Zod.
 */
import { z } from 'zod';

export const loginSchema = z.object({
  identifiant: z
    .string()
    .min(1, "L'identifiant (e-mail, téléphone ou matricule) est requis."),
  mot_de_passe: z
    .string()
    .min(1, "Le mot de passe est requis.")
});
