// Hjälpfunktioner som låtsas vara en server. Ändra INTE den här filen.
// Riktiga anrop (fetch) kommer imorgon. Idag övar vi på att vänta.
import { meny } from "./data";
import type { Ratt } from "./typer";

// En promise som blir klar efter ms millisekunder.
export const vanta = (ms: number): Promise<void> => new Promise<void>((resolve) => setTimeout(resolve, ms));

// "Hämtar" hela menyn efter ms millisekunder.
export function hamtaMenyFranServer(ms: number = 100): Promise<Ratt[]> {
  return vanta(ms).then(() => meny);
}

// "Hämtar" en rätt via id. Finns den inte avvisas promisen med ett fel.
export function hamtaRattFranServer(id: number, ms: number = 100): Promise<Ratt> {
  return vanta(ms).then(() => {
    const ratt = meny.find((r) => r.id === id);
    if (!ratt) {
      throw new Error(`Hittade ingen rätt med id ${id}`);
    }
    return ratt;
  });
}

// Skapar ett anrop som misslyckas tills det blir försök nummer lyckasPaForsok.
// const anrop = opalitligtAnrop(3);
// anrop() misslyckas, anrop() misslyckas, anrop() lyckas.
export function opalitligtAnrop(lyckasPaForsok: number): () => Promise<string> {
  let forsok = 0;
  return () => {
    forsok++;
    if (forsok < lyckasPaForsok) {
      return Promise.reject(new Error(`Misslyckades (försök ${forsok})`));
    }
    return Promise.resolve(`Lyckades på försök ${forsok}`);
  };
}
