export const MASCOTS = [
  {
    id: 'michi-menta',
    name: 'Michi Menta',
    description: 'Tu compañero tranquilo',
    emoji: '🐱',
    colors: { primary: '#BFEFE2', secondary: '#54BFA8', accent: '#FFEAF2' },
  },
  {
    id: 'nube',
    name: 'Nube',
    description: 'Conejito pastel',
    emoji: '🐰',
    colors: { primary: '#F0E6FF', secondary: '#C4A8E8', accent: '#FFF0FB' },
  },
  {
    id: 'milo',
    name: 'Milo',
    description: 'Osito reconfortante',
    emoji: '🐻',
    colors: { primary: '#FFE8D6', secondary: '#D4A574', accent: '#FFF5EE' },
  },
  {
    id: 'lumi',
    name: 'Lumi',
    description: 'Zorrito luminoso',
    emoji: '🦊',
    colors: { primary: '#FFE0CC', secondary: '#E8945A', accent: '#FFF8F0' },
  },
  {
    id: 'panda',
    name: 'Panda',
    description: 'Panda reconfortante',
    emoji: '🐼',
    colors: { primary: '#E8E8E8', secondary: '#6B6B6B', accent: '#F5F5F5' },
  },
  {
    id: 'koko',
    name: 'Koko',
    description: 'Koala dulce',
    emoji: '🐨',
    colors: { primary: '#D4E8D0', secondary: '#7BAF6E', accent: '#F0FFF0' },
  },
  {
    id: 'pipo',
    name: 'Pipo',
    description: 'Pingüino alegre',
    emoji: '🐧',
    colors: { primary: '#D6E8F0', secondary: '#5A8FA8', accent: '#F0F8FF' },
  },
];

export const DEFAULT_MASCOT_ID = 'michi-menta';

export function getMascotById(id) {
  return MASCOTS.find((m) => m.id === id) || MASCOTS.find((m) => m.id === DEFAULT_MASCOT_ID);
}
