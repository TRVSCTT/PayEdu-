/**
 * learnerSchema.js
 * Rôle : Validation du formulaire de création d'un apprenant avec Zod.
 */
import { z } from 'zod';

export const learnerSchema = z.object({
  matricule: z.string().min(2, "Le matricule est requis."),
  nom: z.string().min(2, "Le nom est requis."),
  prenom: z.string().min(2, "Le prénom est requis."),
  email: z.string()
    .min(1, "L'e-mail est requis.")
    .email("Adresse e-mail invalide."),
  telephone: z.string().optional().or(z.literal('')),
  filiere: z.string().optional().or(z.literal('')),
  niveau: z.string().optional().or(z.literal('')),
  mot_de_passe: z.string().min(8, "Min. 8 caractères"),
  confirm_mot_de_passe: z.string().min(8, "Min. 8 caractères"),
}).refine((data) => data.mot_de_passe === data.confirm_mot_de_passe, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirm_mot_de_passe"],
});
