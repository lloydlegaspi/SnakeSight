/**
 * Defines the structure for a limitation item.
 */
export interface Limitation {
  id: number
  text: string
}

/**
 * Data for the limitations section.
 */
export const LIMITATIONS: Limitation[] = [
  {
    id: 1,
    text: "Limited Species: The system can only identify the fourteen snake species included in this study. It cannot accurately classify other Philippine snake species or snakes from other regions.",
  },
  {
    id: 2,
    text: "Not for Marine Snakes: The system does not include aquatic or marine snake species in its classification scope.",
  },
]
