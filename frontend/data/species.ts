export interface SnakeSpecies {
  name: string
  scientificName: string
  status: "Venomous" | "Non-venomous"
  image: string
  description: string
  family: string
  resembles?: string // Only for non-venomous species
}

/**
 * Data for venomous snake species.
 */
export const VENOMOUS_SPECIES: SnakeSpecies[] = [
  {
    name: "Philippine Cobra",
    scientificName: "Naja philippinensis",
    status: "Venomous",
    image: "/img/snakes/philippine_cobra.png?height=200&width=300",
    description:
      "Belongs to the genus Naja (family Elapidae). Characterized by dorsal scales arranged in 21-23 longitudinal rows at midbody with black or dark brown dorsal coloration.",
    family: "Elapidae",
  },
  {
    name: "Samar Cobra",
    scientificName: "Naja samarensis",
    status: "Venomous",
    image: "/img/snakes/samar_cobra.png?height=200&width=300",
    description:
      "Features light-yellow ventral scales anteriorly followed by a black band that fades posteriorly. Belongs to genus Naja (family Elapidae).",
    family: "Elapidae",
  },
  {
    name: "Equatorial Cobra",
    scientificName: "Naja sumatrana",
    status: "Venomous",
    image: "/img/snakes/equatorial_cobra.png?height=200&width=300",
    description:
      "Dorsal scales in 17–25 longitudinal rows at midbody. Postnasal scale vertically elongate, separated/narrowly contacting prefrontal scale. Lacks anterior black ventral band.",
    family: "Elapidae",
  },
  {
    name: "Philippine Pit Viper",
    scientificName: "Trimeresurus flavomaculatus",
    status: "Venomous",
    image: "/img/snakes/philippine_pit_viper.png?height=200&width=300",
    description:
      "A venomous pit viper species endemic to the Philippines, characterized by its green coloration with yellow or white spots along the body.",
    family: "Viperidae",
  },
  {
    name: "North Philippine Temple Pit Viper",
    scientificName: "Tropidolaemus subannulatus",
    status: "Venomous",
    image: "/img/snakes/north_philippine_temple_pit_viper.png?height=200&width=300",
    description:
      "A venomous pit viper found in the northern regions of the Philippines, typically with distinctive banded patterns.",
    family: "Viperidae",
  },
  {
    name: "South Philippine Temple Pit Viper",
    status: "Venomous",
    scientificName: "Tropidolaemus philippensis",
    image: "/img/snakes/south_philippine_temple_pit_viper.png?height=200&width=300",
    description:
      "Endemic to southern Philippines, this pit viper has a triangular head and heat-sensing pits between the eyes and nostrils.",
    family: "Viperidae",
  },
]

/**
 * Data for non-venomous snake species.
 */
export const NON_VENOMOUS_SPECIES: SnakeSpecies[] = [
  {
    name: "Philippine Rat Snake",
    scientificName: "Coelognathus erythrurus",
    status: "Non-venomous",
    image: "/img/snakes/philippine_rat_snake.png?height=200&width=300",
    description:
      "Often visually confused with the Philippine Cobra due to similarities in coloration and body shape. Adults have a tail lighter than the posterior body.",
    family: "Colubridae",
    resembles: "Philippine Cobra",
  },
  {
    name: "Variable Reed Snake",
    scientificName: "Calamaria lumbricoidea",
    status: "Non-venomous",
    image: "/img/snakes/variable_reed_snake.png?height=200&width=300",
    description:
      "A small, slender snake with smooth scales and a blunt head, often confused with young venomous snakes.",
    family: "Colubridae",
    resembles: "Samar Cobra",
  },
  {
    name: "Common Wolf Snake",
    scientificName: "Lycodon capucinus",
    status: "Non-venomous",
    image: "/img/snakes/common_wolf_snake.png?height=200&width=300",
    description:
      "Distinguished by its enlarged anterior maxillary teeth and often displays a pattern that may be confused with cobras.",
    family: "Colubridae",
    resembles: "Samar Cobra",
  },
  {
    name: "Philippine Shrub Snake",
    scientificName: "Oxyrhabdium modestum",
    status: "Non-venomous",
    image: "/img/snakes/philippine_shrub_snake.png?height=200&width=300",
    description:
      "An endemic snake species with a slender body and uniform coloration, often mistaken for young cobras.",
    family: "Colubridae",
    resembles: "Samar Cobra",
  },
  {
    name: "Keel-scaled Rat Snake",
    scientificName: "Ptyas carinata",
    status: "Non-venomous",
    image: "/img/snakes/keel-scaled_rat_snake.png?height=200&width=300",
    description:
      "Features distinctive keeled scales and can grow to significant lengths, sometimes confused with cobras when threatened.",
    family: "Colubridae",
    resembles: "Equatorial Cobra",
  },
  {
    name: "Asian Sunbeam Snake",
    scientificName: "Xenopeltis unicolor",
    status: "Non-venomous",
    image: "/img/snakes/asian_sunbeam_snake.png?height=200&width=300",
    description:
      "Known for its iridescent scales that reflect rainbow colors in sunlight, with a smooth, glossy appearance.",
    family: "Xenopeltidae",
    resembles: "Equatorial Cobra",
  },
  {
    name: "Red-tailed Green Ratsnake",
    scientificName: "Gonyosoma oxycephalum",
    status: "Non-venomous",
    image: "/img/snakes/red-tailed_green_ratsnake.png?height=200&width=300",
    description: "A bright green snake with a distinctive reddish tail, sometimes mistaken for the green pit vipers.",
    family: "Colubridae",
    resembles: "Pit Vipers",
  },
  {
    name: "Maren's Bronzeback",
    scientificName: "Dendrelaphis marenae",
    status: "Non-venomous",
    image: "/img/snakes/marens_bronzeback.png?height=200&width=300",
    description:
      "A slender tree snake with a bronze-colored back and bluish flanks, sometimes confused with pit vipers due to its coloration.",
    family: "Colubridae",
    resembles: "Pit Vipers",
  },
]
