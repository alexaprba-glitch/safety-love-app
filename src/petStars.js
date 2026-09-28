// Estrellas de mascota (moneda del mercado).
// Cada partida jugada —aunque se juegue mal— otorga 2 estrellas.

export const STARS_PER_PLAY = 2;

export function getPetStars() {
  try {
    return parseInt(localStorage.getItem('pet_stars')) || 0;
  } catch {
    return 0;
  }
}

export function addPetStars(amount) {
  try {
    localStorage.setItem('pet_stars', String(getPetStars() + amount));
  } catch {}
  try {
    window.dispatchEvent(new CustomEvent('pet-stars-changed'));
  } catch {}
}

// Llamar al terminar una partida: suma +2 estrellas al mercado
// y avisa para que la sección de juegos muestre la notificación al salir.
export function awardPetStarsForPlay(amount = STARS_PER_PLAY) {
  addPetStars(amount);
  try {
    window.dispatchEvent(new CustomEvent('pet-stars-earned', { detail: amount }));
  } catch {}
}
