// Dag 7, del 1: Skriv om från then-kedjor till async/await.
// De här funktionerna fungerar redan, men använder .then(). Skriv om VARJE funktion till
// en async function med await (och try/catch där det behövs). Beteendet ska bli exakt
// detsamma, så testerna ska fortsätta vara gröna. Testerna kontrollerar också att
// funktionerna är async.
import { hamtaRattFranServer } from "./fordrojning.js";
import { formateraPris } from "./pris.js";

export function hamtaRattPris(id) {
  return hamtaRattFranServer(id, 10).then((ratt) => ratt.pris);
}

export function hamtaRattPrisEllerNoll(id) {
  return hamtaRattFranServer(id, 10)
    .then((ratt) => ratt.pris)
    .catch(() => 0);
}

export function hamtaOchFormatera(id) {
  return hamtaRattFranServer(id, 10).then((ratt) => `${ratt.namn}: ${formateraPris(ratt.pris)}`);
}

export function hamtaTvaPriser(id1, id2) {
  return hamtaRattFranServer(id1, 10).then((ratt1) =>
    hamtaRattFranServer(id2, 10).then((ratt2) => ratt1.pris + ratt2.pris)
  );
}
