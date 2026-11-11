// Typerna för kaféets meny. Ändra INTE den här filen.
// En "interface" beskriver hur ett objekt ser ut: vilka egenskaper det har och vilken typ varje egenskap har.

// En union av exakta texter: bara dessa tre värden är tillåtna.
export type Kategori = "bakverk" | "dryck" | "lunch";

export interface Ratt {
  id: number;
  namn: string;
  pris: number;
  kategori: Kategori;
  vegetarisk: boolean;
  bild?: string;          // frågetecknet betyder att egenskapen är valfri
  beskrivning?: string;
}

// En rad i en order: vilken rätt (id) och hur många.
export interface OrderRad {
  id: number;
  antal: number;
}

// Filtret på menyn: alla rätter, bara vegetariska, eller en kategori.
export type Filter = "alla" | "vegetarisk" | Kategori;

// Tillståndet för en laddning. "typ" avgör vilka övriga egenskaper som finns.
// Det här kallas en discriminated union: TypeScript vet vilka fält som finns när du har kollat typ.
export type Tillstand =
  | { typ: "laddar" }
  | { typ: "tomt" }
  | { typ: "klar"; ratter: Ratt[] }
  | { typ: "fel"; meddelande: string };
