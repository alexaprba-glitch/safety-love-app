// Indicadores de juegos (Jugadas / Estrellas / Perfectas).
//
// Reglas:
// - Jugadas: +1 cada vez que un estudiante juega Y completa un juego.
// - Estrellas: +2 por cada juego completado (juegue bien o mal).
// - Perfectas: +1 solo si responde más de 9 correctas
//   (Quiz y Green/Red Flag: 10/10; Memoria: completar con 10 movimientos o menos).

import { awardPetStarsForPlay } from './petStars';

const STATS_KEY = 'safetyLove_gameStats';
// Migración única: deja todos los indicadores en ceros.
const RESET_FLAG = 'safetyLove_gameStats_reset_v2';

export const ZERO_STATS = { played: 0, won: 0, stars: 0 };

function readStats() {
  try {
    const saved = JSON.parse(localStorage.getItem(STATS_KEY));
    if (saved && typeof saved === 'object') {
      return {
        played: saved.played || 0,
        won: saved.won || 0,
        stars: saved.stars || 0,
      };
    }
  } catch {}
  return { ...ZERO_STATS };
}

function writeStats(stats) {
  try {
    localStorage.setItem(STATS_KEY, JSON.stringify(stats));
  } catch {}
}

export function loadGameStats() {
  try {
    // Reinicio único: todos los indicadores arrancan en ceros.
    if (!localStorage.getItem(RESET_FLAG)) {
      writeStats({ ...ZERO_STATS });
      try {
        localStorage.setItem(RESET_FLAG, '1');
      } catch {}
      return { ...ZERO_STATS };
    }
  } catch {}
  return readStats();
}

// Llamar al COMPLETAR un juego. `perfect` = más de 9 correctas.
export function recordGameCompleted(perfect) {
  const stats = readStats();
  stats.played = (stats.played || 0) + 1;
  stats.stars = (stats.stars || 0) + 2;
  if (perfect) stats.won = (stats.won || 0) + 1;
  writeStats(stats);
  // +2 estrellas del mercado por jugar, aunque se juegue mal
  awardPetStarsForPlay();
  return stats;
}
