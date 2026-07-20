/**
 * handleApiError.js
 * Rôle : Centralise la logique de récupération des messages d'erreur de l'API.
 */

export function extractApiErrorMessage(error) {
  if (!error.response) {
    // Erreur réseau ou serveur inaccessible
    return "Erreur réseau : Impossible de contacter le serveur.";
  }

  const { data, status } = error.response;

  // Si le backend renvoie un objet avec "detail" (typique de FastAPI)
  if (data?.detail) {
    // Dans le cas de validation Pydantic, "detail" peut être un tableau
    if (Array.isArray(data.detail)) {
      return data.detail.map(err => `${err.loc.join('.')} : ${err.msg}`).join(', ');
    }
    return data.detail;
  }

  // Autres formats possibles
  if (data?.message) return data.message;
  if (data?.error) return data.error;

  // Gestion selon le statut HTTP si pas de message clair
  switch (status) {
    case 400: return "Requête invalide.";
    case 401: return "Non autorisé. Veuillez vous reconnecter.";
    case 403: return "Accès refusé.";
    case 404: return "Ressource introuvable.";
    case 409: return "Conflit de données (ex: email déjà utilisé).";
    case 422: return "Données invalides.";
    case 500: return "Erreur interne du serveur.";
    default: return "Une erreur inattendue est survenue.";
  }
}

export function handleApiError(error) {
  const message = extractApiErrorMessage(error);
  // Ici on pourrait aussi envoyer l'erreur vers un service de monitoring
  return new Error(message);
}
