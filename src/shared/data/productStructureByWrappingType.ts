/**
 * ESTRUCTURAS VÁLIDAS POR TIPO DE ENVOLTURA Y CANTIDAD DE CAPAS
 *
 * LA: LÁMINA
 * BL: BOLSA
 * ET: ETIQUETA
 * PO: POUCH
 *
 * Tip: Cantidad de capas (1=Monocapa, 2=Bilaminado, 3=Trilaminado, 4=Tetralaminado)
 */

export type WrappingType = "LA" | "BL" | "ET" | "PO";
export type StructureType = 1 | 2 | 3 | 4;
export type ProductStructureTypeName = "Monocapa" | "Bilaminado" | "Trilaminado" | "Tetralaminado";

/**
 * Mapeo de nombres de tipo de estructura a números de Tip
 */
const STRUCTURE_TYPE_TO_TIP: Record<ProductStructureTypeName, StructureType> = {
  "Monocapa": 1,
  "Bilaminado": 2,
  "Trilaminado": 3,
  "Tetralaminado": 4,
};

interface StructureDatabase {
  [wrapping: string]: {
    [tip: number]: string[];
  };
}

/**
 * Base de datos completa de estructuras válidas
 * Organizada por: Envoltura -> Tip -> Lista de Materiales
 */
const VALID_STRUCTURES: StructureDatabase = {
  LA: {
    1: [
      "BARVAL", "BOPP", "PEBD FM", "PEAD/LLDPE 3:1", "PEBD", "PEBD FM/LLDPE 2:1",
      "PEBD/LLDPE 2:1", "PAPEL", "COEX 03 capas", "PEBD FM/LLDPE 1:1", "COEX 07 capas",
      "BOPP PERLADO", "PEBD COEX UHT", "PVC TC", "PEBD FM/LLDPE 3:1", "PEBD R",
      "PEBD/LLDPE 3:1", "BARLON", "PET", "PEBD/LLDPE 1:2", "PEAD/LLDPE 1:1",
      "BARMAX", "PEAD ALPEM", "POLIPROPILENO HOMO/COPOLIM", "PEBD COEX LAMINADO",
      "PEBD COEX TC 03 capas", "PEAD/LLDPE 2:1", "COEX 02 capas", "PET recubierto HB",
      "ALUMINIO", "PEBD/LMDPE", "LAMINA TRANSF.", "BOPP MET", "PP CAST", "LLDPE puro",
      "PEBD / PEAD (1:1)", "PEAD/PEBD", "PAPEL COTEADO", "PEBD FM/LLDPE 1:2", "PET MET",
      "PEAD NATURAL_de make to stock", "PEBD TC BLANCO_make to stock", "PEAD COEX DETERGENTE",
      "PEBD FM/PEAD(2:1)", "PEBD FM/LLDPE 4:1", "BOPP BLANCO", "PEBD/LLDPE 3:2",
      "PEBD COEX 03 capas", "PET MET COTEADO", "LAMINA PARA TERMOFORMADO", "BARLON EVOH",
      "POLIAMIDA CAST", "PP BF", "BARVAL PA", "PABO", "BOPP Desmoldante", "PEBD/LLDPE 4:1",
      "PEBD TC CRISTAL_make to stock", "COEX PE PC", "PEBD/LLDPE 1:1", "BOPP MATE",
      "PET/ALU/NY/PE", "PEBD FM/PEAD(3:1)", "CELULOSA CRISTAL", "BIOPOLIMERO CRISTAL",
      "CELULOSA METALIZADA", "PELETIZADO", "COEX HB/PET", "OPET/ALU/mLLDPE (USA)",
      "AMPRIMA", "LAMINA RESINEX", "PEAD/LLDPE 4:1", "PEAD MAKE TO STOCK",
      "PEAD/LLDPE 3:2", "PET/COEX EVOH", "LAMINADOS GENERICOS PBN PLANT", "PEAD BCO_de make to stock"
    ],
    2: [
      "BOPP/BOPP", "BOPP/BOPP MET", "BOPP/CS", "PET/BARLON", "PET/BARVAL", "BOPP/BOPP MET",
      "PEBD/CS", "BOPP/CS", "PET/CS", "BOPP MATE/CS", "BOPP/BOPP", "PET/BARLON", "PET/BARVAL",
      "PET/CS", "BOPP/CPP", "PET/BARVAL", "BOPP/CS", "BOPP MATE/BOPP BLANCO", "BOPP/CS",
      "BOPP/BOPP MET", "BOPP/CS", "BOPP/BOPP", "PEBD/CS", "BOPP/BOPP PERLADO", "PET/CS",
      "BOPP/BOPP PERLADO", "PAPEL/ALU", "BOPP MATE/BOPP MET", "PEBD/CS", "PAPEL/ALU",
      "BOPP MATE/BOPP PERLADO", "BOPP/CS", "PET/BARLON", "PET/BARVAL", "BOPP/BOPP", "BOPP/CS",
      "BOPP/BOPP MET", "PET/BOPP MET", "BOPP/BOPP", "PET/CS", "BOPP MATE/BOPP PERLADO",
      "BOPP/CS", "PABO/CS", "PET/BARVAL", "BOPP/BOPP", "PET/CS", "BOPP/CS", "BOPP/BOPP MET",
      "PEBD/CS", "BOPP/CPP", "BOPP/CS", "BOPP MATE/BOPP MET", "PAPEL/ALU", "BOPP MATE/BOPP PERLADO",
      "BOPP/CS", "PET/BARLON", "PET/BARVAL", "BOPP/CS", "PET/CS", "BOPP/BOPP", "PEBD/CS",
      "BOPP/BOPP", "BOPP/CS", "PET/CS", "BOPP MATE/CS", "BOPP/CS", "PET/BARLON", "PET/BARVAL",
      "PET MET/CS", "BOPP/BOPP", "BOPP/BOPP PERLADO", "PET/CS", "BOPP/CPP", "BOPP/BOPP",
      "PET/BARVAL", "BOPP/BOPP PERLADO", "PET/CS", "BOPP/CPP", "BOPP/BOPP", "PET/CS",
      "BOPP/BOPP MET", "PEBD/CS", "PAPEL/ALU", "BOPP/CS", "BOPP/BOPP MET", "BOPP/CS",
      "BOPP/BOPP", "PEBD/BARVAL", "BOPP MATE/BOPP", "BOPP MATE/CPP", "ALU/PET TS", "PET/CPP",
      "PET/BOPP", "PET/BARLON", "BOPP MATE/BOPP", "BOPP MATE/BOPP MET", "ALU/BOPP", "PET/BARVAL",
      "PET/BOPP MET", "BOPP MATE/BOPP MET", "PET/BARLON", "PET/BARVAL", "PET/CS", "BOPP/BOPP",
      "BOPP MATE/BOPP", "PET MET/BOPP MET", "ALU/CS", "BOPP MATE/BOPP MET", "PET/BOPP MET",
      "BOPP/BOPP MET", "BOPP/BOPP", "PEBD/CS", "PEBD/BARVAL", "BOPP/BOPP PERLADO", "PET/BARVAL",
      "BOPP/CS", "BOPP/BOPP MET", "BOPP/BOPP", "BOPP/BOPP MET", "PET/BARVAL", "BOPP/BOPP MET",
      "BOPP/BOPP PERLADO", "PET/CS", "BOPP MATE/BOPP PERLADO", "PAPEL/ALU", "PET/BARVAL",
      "PEBD/BARVAL", "BOPP MATE/BOPP MET", "BOPP/CPP", "PET/CS", "BOPP/CPP", "BOPP/BOPP",
      "BOPP MET/CS", "BOPP MATE/BOPP", "BOPP/CS", "BOPP/BOPP MET", "BOPP/CPP", "PEBD/CS",
      "PET/BOPP MET", "BOPP MATE/CS", "BOPP MATE/BOPP MET", "BOPP/CS", "PAPEL/CS", "PAPEL/ALU",
      "BOPP MATE/CS", "BOPP/BOPP", "BOPP/CS", "BOPP MATE/BOPP MET", "BOPP/BOPP", "PET/CS",
      "BOPP MATE/BOPP", "BOPP MATE/BOPP PERLADO", "BOPP/CS", "PEBD/CS", "PET MET/CS", "PET/BARVAL",
      "BOPP MATE/BOPP PERLADO", "BOPP/CS", "BOPP/CPP", "PEBD/CS", "PEBD/CS", "PAPEL/ALU",
      "PET/BOPP MET", "BOPP MATE/BOPP", "BOPP MATE/CPP", "PET/BARVAL", "ALU/BOPP", "BOPP/BOPP PERLADO",
      "PET/BARVAL", "BOPP/CS", "BOPP/CPP", "PET/CS", "BOPP MATE/BOPP MET", "PAPEL/ALU",
      "BOPP/BOPP", "PEBD/CS", "BOPP/CPP", "BOPP MATE/CS", "PET/BARVAL", "PET/BARLON",
      "BOPP MATE/CS", "BOPP / BOPP BLANCO", "BOPP/CPP", "BOPP/BOPP", "PET/BARLON", "BOPP/BOPP",
      "BOPP/CS", "BOPP MATE/BOPP PERLADO", "BOPP MATE/BOPP", "PET/BARVAL", "BOPP/BOPP PERLADO",
      "BOPP/CS", "BOPP / PAPEL", "BOPP/BOPP", "PET/BOPP MET", "BOPP/CPP", "PAPER/ALU",
      "BOPP MATE/BOPP MET", "BOPP/BOPP", "BOPP MET / BOPP PERLADO", "BOPP MATE/BOPP PERLADO",
      "BOPP/BOPP", "PEBD/CS", "BOPP MATE/BOPP PERLADO", "PET/BOPP MET", "BOPP/BOPP",
      "BOPP / BOPP BLANCO", "BOPP MATE/BOPP MET", "BOPP/CS", "PET/BOPP", "PEBD/PAPEL",
      "PEBD/PEBD_de make stock", "BOPP / PPQF", "PPQF / PEBD", "BOPP / PPBF", "PET / PP BF",
      "BOPP / PPBF", "BOPP BLANCO/PET MET", "HDPE / PP NON WOVEN", "PPBF / PEBD", "HDPE / PP NON WOVEN",
      "BOPP M/BOPP MET", "BOPP MATE/BOPP MET", "PET/BARVAL", "PET/BARLON", "BOPP MATE/BOPP MET",
      "BOPP / BOPP BLANCO", "BOPP/CPP", "PET/BARVAL", "BOPP / BOPP BLANCO", "BOPP MATE/BOPP PERLADO",
      "BOPP / BOPP BLANCO", "BOPP / PAPEL", "PAPER / ALU", "BOPP / PPBF", "PET / PP BF",
      "BOPP MATE/BOPP PERLADO", "BOPP / PPQF", "ALU/CS", "PPQF / PEBD", "BOPP / PPBF",
      "PAPER/CS", "PP/CS", "BOPP MATE/BOPP", "BOPP/BOPP", "BOPP MATE/BOPP", "BOPP/BOPP MET",
      "PET/BOPP MET", "BOPP/BOPP", "CPP/CPP", "BOPP MATE/BOPP MET", "BOPP/CS", "BOPP MATE/BOPP",
      "BOPP/BOPP PERLADO", "BOPP MATE/BOPP MET", "BOPP/BOPP PERLADO", "BOPP MATE/BOPP",
      "PAPER MET/PEBD_de make stock", "BOPP/CS", "BOPP/BOPP PERLADO", "PET/BARLON", "PET/BARVAL",
      "BOPP MATE/BOPP MET", "BOPP/BOPP", "PEBD/CS", "BOPP MATE/BOPP", "PEBD/BARVAL",
      "BOPP/BOPP", "BOPP/CS", "BOPP/CPP", "PAPER/ALU", "PET/BARVAL", "BOPP / BOPP BLANCO",
      "BOPP / PPBF", "BOPP/BOPP", "BOPP/BOPP", "PET / PP BF", "BOPP/BOPP MET", "PPBF / PEBD",
      "BOPP/BOPP", "BOPP / PPBF", "PET/BARVAL", "BOPP/BOPP MET", "PET/BOPP MET", "BOPP MATE/BOPP MET",
      "BOPP / BOPP BLANCO", "BOPP MATE/BOPP PERLADO", "PEBD/PAPEL", "BOPP/BOPP", "BOPP/BOPP MET",
      "PPCAST / PP CAST MET", "BOPP MATE/BOPP MET", "BOPP/BOPP", "PAPER/ALU", "BOPP/CPP",
      "BOPP MET / BOPP MET", "BOPP MATE/BOPP MET", "PET/BARVAL", "BOPP/CPP", "PET/BARLON",
      "BOPP/BOPP", "BOPP/BOPP PERLADO", "PET/BARVAL", "BOPP MATE/CPP", "BOPP/BOPP MET",
      "BOPP/CS", "ALU/BOPP", "BOPP/BOPP", "PET/BARVAL", "PEBD/CS", "PET/BOPP MET",
      "BOPP MATE/BOPP", "BOPP/BOPP MET", "BOPP/BOPP", "BOPP/BOPP PERLADO", "PET/BARVAL",
      "BOPP / BOPP BLANCO", "BOPP/CPP", "PET/BARVAL", "BOPP/CPP", "BOPP / BOPP BLANCO",
      "BOPP/CPP", "BOPP MATE/CS", "BOPP/CS", "BOPP MATE/BOPP", "BOPP/BOPP", "BOPP/CPP",
      "BOPP MATE/CS", "BOPP / BOPP BLANCO", "BOPP MATE/BOPP", "BOPP/BOPP MET", "PET/BARLON",
      "PET/BARVAL", "BOPP MATE/BOPP", "BOPP/BOPP PERLADO", "BOPP/CS", "BOPP/CPP", "PET/BOPP MET",
      "BOPP MATE/BOPP MET", "BOPP / PPBF", "PET / PP BF", "BOPP/BOPP", "PET MET/PEBD_de make stock",
      "BOPP/BOPP", "BOPP MATE/BOPP MET", "PET/BARVAL", "ALU/CS", "BOPP/BOPP", "BOPP/BOPP PERLADO",
      "BOPP MATE/BOPP PERLADO", "PET/BOPP MET", "BOPP/CS", "PET/BARVAL", "BOPP MATE/BOPP PERLADO",
      "BOPP/CS", "BOPP MATE/CS", "BOPP/BOPP", "BOPP/BOPP MET", "PAPER/ALU", "BOPP/CPP",
      "BOPP MATE/BOPP", "BOPP/BOPP", "BOPP/CPP", "BOPP/BOPP MET", "BOPP MATE/BOPP MET",
      "BOPP/BOPP", "BOPP/BOPP MET", "PET/CS", "BOPP MATE/BOPP MET", "BOPP/BOPP PERLADO",
      "BOPP MATE/CS", "PET/CS", "PET/CPP", "BOPP/BOPP", "BOPP MATE/BOPP MET", "BOPP/BOPP MET",
      "BOPP/BOPP PERLADO", "BOPP MATE/BOPP MET", "BOPP/CS", "PET/BARVAL", "PET/BARLON",
      "BOPP/BOPP", "BOPP/BOPP MET", "BOPP MATE/BOPP", "PAPER/ALU", "PET/BARVAL", "BOPP/BOPP",
      "BOPP/BOPP MET", "BOPP MATE/CS", "BOPP/BOPP PERLADO", "PET/BARVAL", "BOPP/CS",
      "BOPP/BOPP", "PET/CS", "BOPP/BOPP MET", "BOPP/BOPP", "BOPP MATE/BOPP MET", "PET/BARLON",
      "BOPP/BOPP PERLADO", "PET/BARVAL", "BOPP/BOPP", "BOPP/BOPP MET", "BOPP MATE/BOPP PERLADO",
      "BOPP/BOPP PERLADO", "BOPP/CS", "PAPER/ALU", "BOPP MATE/BOPP", "BOPP MATE/BOPP MET",
      "PET/BARVAL", "PAPER/CS", "BOPP/BOPP", "BOPP/CPP", "BOPP MATE/BOPP", "PAPER/ALU",
      "BOPP MATE/BOPP PERLADO", "BOPP/BOPP", "BOPP/BOPP PERLADO", "PET/BARLON", "BOPP/BOPP MET",
      "BOPP MATE/BOPP", "PET/BARVAL", "BOPP/CS", "BOPP/BOPP", "BOPP/BOPP MET", "BOPP/BOPP MET",
      "BOPP/BOPP", "BOPP/BOPP MET", "BOPP MATE/BOPP MET", "BOPP/BOPP", "BOPP/CS", "ALU/PET TS",
      "BOPP MATE/BOPP MET", "PET/BARVAL", "PET/BOPP MET", "BOPP/BOPP", "PET/BOPP MET",
      "BOPP MATE/BOPP MET", "BOPP MATE/BOPP", "PET/BARVAL", "BOPP/CS", "PET/CS", "BOPP/CS",
      "BOPP MATE/BOPP", "BOPP/BOPP", "BOPP/BOPP", "BOPP/CS", "PET/BARLON", "BOPP/BOPP MET",
      "BOPP/BOPP", "BOPP MATE/BOPP MET", "PAPER/ALU", "BOPP/BOPP MET", "BOPP/CS", "PET/BOPP MET",
      "BOPP/BOPP", "PEBD/BARVAL", "BOPP MATE/BOPP", "BOPP/BOPP PERLADO", "BOPP MATE/BOPP PERLADO",
      "PET/BARVAL", "BOPP/BOPP", "BOPP MATE/BOPP PERLADO", "BOPP/BOPP", "BOPP/BOPP MET",
      "BOPP MATE/BOPP", "PET/BARVAL", "PAPER/ALU", "BOPP/BOPP", "BOPP MATE/BOPP PERLADO",
      "BOPP/BOPP", "BOPP/CPP", "BOPP/BOPP MET", "PET/BARVAL", "PET/BARLON", "BOPP/BOPP MET",
      "BOPP MATE/BOPP", "BOPP/BOPP PERLADO", "BOPP/CS", "PET/BARLON", "BOPP MATE/BOPP MET",
      "BOPP/BOPP", "PET/BARVAL", "PET/CPP", "BOPP/BOPP", "BOPP MATE/BOPP MET", "BOPP/CS",
      "BOPP/BOPP", "BOPP/BOPP MET", "BOPP MATE/BOPP MET", "BOPP MATE/BOPP PERLADO", "PET/BARVAL",
      "BOPP/BOPP", "BOPP MATE/BOPP", "PET/BOPP", "PET/BOPP MET", "BOPP MATE/BOPP MET", "PET/CPP"
    ],
    3: [
      "PET/ALU/CS", "PET/PET MET/CS", "PAPEL/ALU/CS", "PET/BOPP MET/CS", "BOPP/ALU/CS", "PET/ALU/BARLON",
      "BOPP MATE/ALU/CS", "PET/ALU/BARLON", "BOPP MATE/BOPP MET/CS", "BOPP/PET MET/CS", "BOPP/BOPP MET/CS",
      "BOPP MATE/BOPP MET/BOPP", "BOPP MATE/BOPP MET/CS", "PET/MOPP/CPP", "PEBD/BOPP MET/CS", "BOPP/PET MET/CS",
      "BOPP/BOPP MET/CS", "PET/ALU/CPP", "BOPP/BOPP MET/BOPP", "BOPP MATE/PET MET/CS", "BOPP MATE/ALU/CS",
      "PET/PET MET/CS", "BOPP/BOPP MET/CPP", "BOPP MATE/BOPP MET/BOPP", "BOPP mate/PET/MOPP", "PET/ALU/BARMAX",
      "PET/BOPP/CS", "BOPP/BOPP MET/BOPP", "PEBD/PET MET/PEBD", "BOPP/PAPEL/BOPP", "BOPP MATE/PET MET/CS",
      "PET/PET MET/BARLON", "BOPP/PET MET/CPP", "PET/PEBD/PEBD", "BOPP/PET MET/BARVAL", "PEBD/ALU/PEBD",
      "BOPP/PAPERMATCH/BOPP", "PET HS/PAPEL/PET HS", "PEBD/PET HOLOG/CS", "PLASTIPEL / ALU / CS", "PEAD/PET/PEAD",
      "BOPP MATE/PEBD/MOPP", "ALU/PE/PAPEL", "PAPEL/PET MET/PEBD", "PLASTIPEL / MPET / CS", "BOPP/BOPP MET/CPP",
      "BOPP/PEBD/BOPP", "BOPP MATE/MOPP/PPCAST", "BOPP/PET/BOPP", "BOPP MATE/PAPEL/BOPP", "PET/ALU/BARVAL",
      "BOPP/BOPP PERLADO/BOPP", "BOPP/PET/MOPP", "BOPP/BOPP/BOPP", "PEBD / PET / PEBD", "ALU/PET/CS",
      "BOPP/PAPEL/MOPP", "BOPP/PET CRISTAL/PEBD", "PABO/PET MET/PEBD", "PET/PABO/CPP", "PET/PABO/PEBD",
      "PET/BOPP MET/CS", "PET/PET/CPP MET", "PEBD/BOPP MET/BARVAL", "BOPP MATE/BOPP MET/BOPP MET",
      "TRILAMINADO PET/ALU/BOPP", "PET/MOPP/PPBF", "PET / MPET / PPBF", "PET/PET MET/BARVAL",
      "PET/PET MET/PP CAST", "PET TS /ALU / CS", "PENTALAMINADO", "PET/BOPP/BARLON", "PET/PET/BARVAL",
      "BOPP/ALU/PPCAST", "BOPP MATE/PET MET/CPP", "PET/POPP MET/CS", "LAMINADO COMPOSTABLE", "BOPP/BOPP/CS",
      "BOPP PLANO/BOPP MET HB /CS", "BOPP/PETMET/BOPP MET", "PET/PABO/PEBD", "PET/ALU/PEBD MAKE TO STOCK",
      "AMPRIMA/BOPP MET UHB/PEBD", "CPP/PET MET/CPP", "CPP/PET ALOX/CPP", "PAPEL/BOPPMET HB/CS",
      "BOPP/BOPP MET HB/CS", "BOPP/BOPP MET HB/PPCAST", "ALU/PAPEL/CS", "PET/PET/CPP", "BOPP/ALU/BARLON",
      "BOPP MATE/BOPP MET HB/CPP", "BOPP/BOPP AlOx/PEBD", "PET/MOPPHB/CPP", "PET/PET/ALU",
      "PET/PET/PET TS", "PABO/ALU/CS", "BOPP PLANO/BOPP MET HB/CPP", "BOPP/BOPP MET UHB/PPB",
      "BOPP/BOPP MET/BOPP MET", "PET/PET/LÁMINA RESELLABLE", "PET/PAPEL/CS", "PEAD/PABO/PEAD",
      "PET/BOPPMET/BARVAL", "PET/PET/BARLON", "LAMINADOS GENERICOS PBN SCRAP", "BOPP PLANO/BOPP MET UHB/PEBD",
      "PET/PET AlOx/CS", "BOPP/BOPP MET/CS", "PET/ALU/CS", "PEBD/BOPP MET/CS", "PET/MOPP/CPP",
      "PET/ALU/BARLON", "BOPP/ALU/CS", "PET/BOPP MET/CS", "BOPP MATE/ALU/CS", "PET/PET MET/CS",
      "PET/ALU/CPP", "PAPEL/ALU/CS", "PET/BOPP/CS", "PET/MOPP/PPQF", "PET/MOPP/CPP", "PLASTIPEL / MPET / CS",
      "PLASTIPEL / ALU / CS", "BOPP/BOPP MET/CS", "BOPP MATE/BOPP MET/CS", "PET/MOPP/PPBF"
    ],
    4: [
      "PET/ALU/PET/CS", "PET/ALU/PABO/CS", "PET/PEBD/ALU/BARLON", "PET/ALU/PABO/CPP", "PET/PETMET/BOPP/PPCAST",
      "PET/MPETHB/PABO/CS", "PET/PAPEL/ALU/CS", "BOPP MATE/PAPEL/ALU/PEBD", "PEBD/PET/ALU/PEBD",
      "BOPP/PABO/MOPPHB/PEBD"
    ]
  },
  BL: {
    1: [
      "PEBD/LLDPE 2:1", "PEBD", "PP COPOLIMERO", "PEBD FM/LLDPE 2:1", "PEAD ALPEM", "PEBD R", "PEBD FM",
      "PEAD/LLDPE 2:1", "POLIPROPILENO HOMO/COPOLIM", "PEBD FM/LLDPE 1:1", "PP CAST", "PEBD COEX UHT",
      "PEBD FM/LLDPE 3:1", "PEAD/LLDPE 1:2", "COEX 07 capas", "BARVAL", "COEX 02 capas", "BOPP",
      "COEX 03 capas", "PEBD FM/LLDPE 1:2", "PEBD/LLDPE 3:1", "BARLON", "PEAD/POP", "PEBD COEX DETERGENTE",
      "PEBD COEX 03 capas", "PEAD NATURAL_de make to stock", "PAPEL", "PEAD/PEBD", "PEBD/LMDPE", "CLEAR TITE",
      "MARAFLEX", "PEAD/LLDPE 1:1", "PEBD/LLDPE 1:1", "PEBD/LLDPE 1:2", "PEAD/LLDPE 4:1",
      "PEAD/LLDPE 3:2", "PP BF", "LAMINA TRANSF.", "PEBD FM/LLDPE 4:1", "BOPP", "PP COPOLIMERO",
      "PEAD ALPEM", "PEBD FM/LLDPE 2:1", "PEBD", "PP COPOLIMERO", "PEAD/LLDPE 2:1", "PEBD R", "PEBD",
      "PEBD FM/LLDPE 1:1", "PEAD/LLDPE 1:2", "PEBD FM", "BOPP", "PEBD FM/LLDPE 2:1", "PEAD ALPEM",
      "PEBD FM/LLDPE 1:1", "PEAD/LLDPE 2:1", "PP CAST", "BARLON", "PEAD/LLDPE 1:1", "PEBD/LLDPE 1:1",
      "PEBD/LLDPE 1:2", "PEAD/LLDPE 4:1", "PEAD/LLDPE 3:2", "PP BF", "LAMINA TRANSF.", "PEBD FM/LLDPE 4:1"
    ],
    2: [
      "BOPP/CPP", "PP/CS", "PEBD/CS", "BOPP/CPP", "PEBD/CS", "BOPP/CS", "PEBD/BARLON", "PP/CS",
      "HDPE / PP NON WOVEN", "PP NT / PEBD", "PEBD/BARLON", "PEBD/CS"
    ],
    3: [],
    4: []
  },
  ET: {
    1: [
      "BOPP", "PVC TC", "BOPP PERLADO", "PEBD/LLDPE 1:1"
    ],
    2: [
      "PEBD/CS", "BOPP/BOPP MET", "BOPP/BOPP MET", "PEBD/CS", "BOPP/BOPP", "PEBD/CS", "BOPP/BOPP MET",
      "BOPP/BOPP PERLADO", "BOPP/BOPP", "BOPP/BOPP MET", "BOPP/BOPP PERLADO", "BOPP/BOPP", "BOPP/POPP MET"
    ],
    3: [],
    4: []
  },
  PO: {
    1: [
      "PEBD FM/LLDPE 2:1", "BARLON", "BOPP", "PEBD/LLDPE 1:1", "COEX 07 capas", "PEBD R", "POLIPROPILENO HOMO/COPOLIM",
      "LAMINA TRANSF.", "BARVAL", "COEX 03 capas", "PEAD ALPEM", "PEBD COEX UHT", "PEBD", "PAPEL", "PEBD COEX 03 capas"
    ],
    2: [
      "PET/CS", "BOPP/BOPP", "PET/BARLON", "PEBD/CS", "PET/CS", "BOPP/CS", "PET/BARVAL", "PET/BARVAL",
      "PET/CS", "BOPP/CS", "BOPP MATE/CS", "PEBD/CS", "BOPP/BOPP", "BOPP MATE/CS", "PEBD/BARLON",
      "PET/CS", "BOPP MATE/BOPP MET", "PET/CPP MET", "PET/BOPP MET", "BOPP/CPP", "PEBD/BARLON",
      "PET/BARVAL", "PET/CS", "BOPP/BOPP", "PPQF / PPCAST", "PET MET/BARLON", "BOPP MATE/BOPP",
      "PET/BARLON", "LATRANS / PEBD", "LATRANS A/LATRANS B", "PET/CS", "BOPP/BOPP", "PET MET/BARLON",
      "BOPP/BOPP MET", "PET MET/CS", "BOPP/CS", "PPQF / PEBD", "BOPP/BOPP", "PET/PPQF", "PET/CPP",
      "PET/CPP MET", "BOPP/CS", "PEBD/BARLON", "PET/CS", "BOPP/BOPP", "PET/CS", "BOPP / BARLON",
      "BOPP MATE/CS", "PEBD/CS", "PET/BARVAL", "PET/CS", "PET / PP BF", "PET/BARLON", "PEBD/CS",
      "BOPP/BOPP", "BOPP/BOPP MET", "BOPP MATE/BOPP MET", "PET/BARVAL", "PET/CS", "BOPP/CPP",
      "PET/BARVAL", "BOPP/BOPP", "PET/BARLON", "PET/BARVAL", "BOPP / BARLON", "BOPP / BARLON",
      "BOPP/CPP", "PET/BARLON", "BOPP/CPP", "PP CAST/BARLON", "PEBD/BARLON", "BOPP/CS", "PPQF / PPCAST",
      "PET/PPQF", "BOPP/CS", "BOPP/BOPP", "BOPP/BOPP", "PET/CPP", "BOPP/CS", "BOPP/BOPP MET",
      "BOPP/BOPP", "PEBD/BARLON", "PET/BARVAL", "BOPP MATE/BOPP MET", "BOPP/BOPP", "PET/CS",
      "BOPP/CPP", "BOPP/BOPP", "PPQF / PEBD", "PET/BARLON", "PET/BARVAL", "BOPP/BOPP MET",
      "PET/PPQF", "BOPP MATE/BOPP", "PET/BARVAL", "BOPP/BOPP", "PET/CS", "BOPP / BARLON", "PPQF / PPCAST",
      "PPQF / PEBD", "BOPP/BOPP", "PET/CPP", "PET/CPP MET", "PEBD/BARLON", "BOPP/BOPP", "PPQF / PEBD",
      "BOPP MATE/BOPP", "PET/BARLON", "BOPP/BOPP MET"
    ],
    3: [
      "BOPP MATE/BOPP MET/CS", "BOPP/PET MET/CS", "PET/BOPP MET/CS", "PET/ALU/CS", "PET/ALU/BARLON",
      "BOPP MATE/ALU/CS", "BOPP MATE/PET MET/CS", "PAPEL/ALU/CS", "BOPP MATE/BOPP MET/CS", "BOPP/BOPP MET/CS",
      "BOPP/ALU/CS", "PET/PET MET/CS", "PET/MOPP/PPQF", "PET/PET/CS", "PET/MOPP/CPP", "PLASTIPEL / MPET / CS",
      "PLASTIPEL / ALU / CS", "PET/ALU/BARVAL", "BOPP MATE/PET MET/CS", "BOPP/BOPP MET/CS", "BOPP/BOPP MET/CPP",
      "PET/ALU/CS", "PET/MOPPHB/PEBD", "AMPRIMA/BOPP MET UHB/PEBD", "BOPP PLANO/BOPP MET UHB/CPP",
      "PET/ALU/BARLON", "BOPP MATE/BOPP MET/CS", "BOPP PLANO/BOPP MET HB /CS", "PET/BOPP MET/CS",
      "PET/PET MET/BARLON", "PEBD/PET MET/PEBD", "PET/PABO/PEBD", "PABO/PET MET/PEBD", "BOPP/BOPP MET/CS",
      "BOPP/ALU/CS", "PET/PABO/CPP", "PET/BOPP MET/CS", "BOPP MATE/BOPP MET/CS", "PET/ALU/BARMAX",
      "PET/PET MET/CS", "PAPEL/ALU/CS", "PET/MOPP/CPP", "PET/PET/CS", "BOPP MATE/BOPP MET/CS"
    ],
    4: [
      "PET/ALU/PABO/CPP", "PET/ALU/PABO/CS"
    ]
  }
};

/**
 * Obtiene las estructuras válidas para una combinación de envoltura y tipo de estructura
 * @param wrappingType - Tipo de envoltura (LA, BL, ET, PO)
 * @param structureType - Tipo de estructura (1, 2, 3, 4)
 * @returns Array de descripciones de materiales válidas
 */
export function getValidStructuresByWrappingAndType(
  wrappingType: string,
  structureType: number,
): string[] {
  const normalized = (wrappingType || "").toUpperCase().trim();

  if (!["LA", "BL", "ET", "PO"].includes(normalized)) {
    return [];
  }

  const wrapping = VALID_STRUCTURES[normalized];
  if (!wrapping || !wrapping[structureType]) {
    return [];
  }

  return wrapping[structureType];
}

/**
 * Verifica si una estructura es válida para una envoltura y tipo
 * @param wrappingType - Tipo de envoltura
 * @param structureType - Tipo de estructura (cantidad de capas)
 * @param materialDescription - Descripción del material
 * @returns true si es válida
 */
export function isValidStructure(
  wrappingType: string,
  structureType: number,
  materialDescription: string,
): boolean {
  const valid = getValidStructuresByWrappingAndType(wrappingType, structureType);
  return valid.includes(materialDescription);
}

/**
 * Mapeo de nombres/descripciones de envoltura a códigos de tipo
 */
const WRAPPING_TYPE_MAPPING: Record<string, WrappingType> = {
  "lamina": "LA",
  "lámina": "LA",
  "bolsa": "BL",
  "etiqueta": "ET",
  "etiquetа": "ET",
  "pouch": "PO",
  "la": "LA",
  "bl": "BL",
  "et": "ET",
  "po": "PO",
};

/**
 * Extrae el código de tipo de envoltura desde una descripción
 * @param wrappingDescription - Descripción de envoltura del portafolio
 * @returns Código de envoltura (LA, BL, ET, PO) o null si no se encuentra
 */
export function extractWrappingTypeCode(wrappingDescription: string): WrappingType | null {
  if (!wrappingDescription) return null;

  const normalized = wrappingDescription.toLowerCase().trim();

  // Búsqueda directa en el mapeo
  if (WRAPPING_TYPE_MAPPING[normalized]) {
    return WRAPPING_TYPE_MAPPING[normalized];
  }

  // Búsqueda parcial (contiene)
  for (const [key, value] of Object.entries(WRAPPING_TYPE_MAPPING)) {
    if (normalized.includes(key)) {
      return value;
    }
  }

  return null;
}

/**
 * Convierte un nombre de tipo de estructura a su número de Tip
 * @param structureTypeName - Nombre del tipo de estructura
 * @returns Número de Tip (1-4) o 0 si no se encuentra
 */
export function getStructureTypeTip(structureTypeName: string): StructureType | 0 {
  const tip = STRUCTURE_TYPE_TO_TIP[structureTypeName as ProductStructureTypeName];
  return tip || 0;
}

/**
 * Obtiene solo los tipos de estructura válidos para una envoltura
 * @param wrappingType - Tipo de envoltura (LA, BL, ET, PO)
 * @param allStructureTypes - Array de todos los tipos de estructura disponibles
 * @returns Array filtrado solo con los tipos que tengan datos válidos para esa envoltura
 */
export function getValidStructureTypesForWrapping(
  wrappingType: string,
  allStructureTypes: ProductStructureTypeName[],
): ProductStructureTypeName[] {
  const normalized = (wrappingType || "").toUpperCase().trim();

  if (!["LA", "BL", "ET", "PO"].includes(normalized)) {
    return [];
  }

  return allStructureTypes.filter((structureTypeName) => {
    const tip = STRUCTURE_TYPE_TO_TIP[structureTypeName];
    const structures = getValidStructuresByWrappingAndType(normalized, tip);
    return structures.length > 0;
  });
}
