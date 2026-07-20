/**
 * establishmentSchema.js
 * Rôle : Validation du formulaire de création d'un établissement avec Zod.
 */
import { z } from 'zod';

export const establishmentSchema = z.object({
  nom_etablissement: z.string().min(2, "Le nom de l'établissement est requis."),
  code_etablissement: z.string().min(2, "Le code est requis (ex: IUT-DLA)."),
  ville: z.string().optional(),
  email: z.string().email("Adresse e-mail invalide."),
  mot_de_passe: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères."),
  nom: z.string().min(2, "Le nom du gestionnaire est requis."),
  prenom: z.string().min(2, "Le prénom du gestionnaire est requis."),
});
