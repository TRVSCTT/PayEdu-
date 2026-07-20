/**
 * adminSchema.js
 * Rôle : Validation du formulaire d'inscription administrateur avec Zod.
 */
import { z } from 'zod';

export const adminSchema = z.object({
  nom: z.string().min(2, "Le nom doit contenir au moins 2 caractères."),
  prenom: z.string().min(2, "Le prénom doit contenir au moins 2 caractères."),
  email: z.string().email("Adresse e-mail invalide."),
  mot_de_passe: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères."),
});
