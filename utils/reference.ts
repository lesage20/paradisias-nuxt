/**
 * Génère une référence unique pour les réservations
 * Format: BK-XXXXX (où X est un caractère alphanumérique)
 */
export function generateReference(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let reference = 'BK-'
  
  for (let i = 0; i < 5; i++) {
    reference += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  
  return reference
}
