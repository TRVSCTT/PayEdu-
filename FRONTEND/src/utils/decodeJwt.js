/**
 * decodeJwt.js
 * Rôle : Décoder un token JWT sans vérifier sa signature (qui est faite côté backend).
 */
import { jwtDecode } from "jwt-decode";

export function extractAuthenticationData(token) {
  try {
    const decoded = jwtDecode(token);
    
    // Le backend de FastAPI avec datetime.utcnow() renvoie généralement un champ "exp"
    // "sub" est souvent utilisé pour l'identifiant
    // et notre backend insère "role" (ou on l'obtient depuis la réponse)
    
    return {
      isValid: decoded.exp * 1000 > Date.now(),
      payload: decoded,
    };
  } catch (error) {
    return {
      isValid: false,
      payload: null,
    };
  }
}
