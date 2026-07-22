import { z } from 'zod';

export const caisseSchema = z.object({
  nom: z.string().min(2, 'Le nom est requis'),
  prenom: z.string().min(2, 'Le prénom est requis'),
  email: z.string().email('Email invalide'),
  mot_de_passe: z.string().min(8, 'Le mot de passe doit contenir au moins 8 caractères'),
});
