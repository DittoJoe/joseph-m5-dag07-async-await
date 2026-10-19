// Tester för dag 7. Ändra inte den här filen.
// Testerna körs asynkront, så resultatet dyker upp efter någon sekund.
import { testAsync, assertEqual, assertTrue, visaResultat } from "./testlib.js";
import { meny } from "./data.js";
import { vanta, opalitligtAnrop } from "./fordrojning.js";
import {
  hamtaRattPris, hamtaRattPrisEllerNoll, hamtaOchFormatera, hamtaTvaPriser,
} from "./kedjor.js";
import {
  hamtaMeny, hamtaRattNamn, hamtaRattEllerNull, hamtaTvaRatterEfterVarandra,
  hamtaTvaRatterParallellt, hamtaMedForsok, medTimeout, laddaMeny,
} from "./api.js";

async function fangaFel(promise) {
  try {
    await promise;
  } catch (fel) {
    return fel;
  }
  return null;
}
const aeAsync = (fn) => Object.prototype.toString.call(fn) === "[object AsyncFunction]";

// ---- kedjor.js: omskrivna till async/await ----
testAsync("kedjor: hamtaRattPris ger priset", async () => {
  assertEqual(await hamtaRattPris(1), 35);
});
testAsync("kedjor: hamtaRattPris är en async-funktion", async () => {
  assertTrue(aeAsync(hamtaRattPris), "skriv om funktionen med async/await");
});
testAsync("kedjor: hamtaRattPrisEllerNoll ger 0 för okänt id", async () => {
  assertEqual(await hamtaRattPrisEllerNoll(99), 0);
  assertEqual(await hamtaRattPrisEllerNoll(2), 32);
});
testAsync("kedjor: hamtaRattPrisEllerNoll är en async-funktion", async () => {
  assertTrue(aeAsync(hamtaRattPrisEllerNoll), "skriv om funktionen med async/await");
});
testAsync("kedjor: hamtaOchFormatera ger namn och pris", async () => {
  assertEqual(await hamtaOchFormatera(2), "Bryggkaffe: 32 kr");
});
testAsync("kedjor: hamtaOchFormatera är en async-funktion", async () => {
  assertTrue(aeAsync(hamtaOchFormatera), "skriv om funktionen med async/await");
});
testAsync("kedjor: hamtaTvaPriser summerar", async () => {
  assertEqual(await hamtaTvaPriser(1, 2), 67);
});
testAsync("kedjor: hamtaTvaPriser är en async-funktion", async () => {
  assertTrue(aeAsync(hamtaTvaPriser), "skriv om funktionen med async/await");
});

// ---- api.js ----
testAsync("hamtaMeny: ger hela menyn", async () => {
  const ratter = await hamtaMeny();
  assertEqual(ratter.length, meny.length);
});
testAsync("hamtaMeny: returnerar en promise", async () => {
  assertTrue(hamtaMeny() instanceof Promise, "en async-funktion returnerar alltid en promise");
});
testAsync("hamtaRattNamn: ger namnet", async () => {
  assertEqual(await hamtaRattNamn(5), "Latte");
});
testAsync("hamtaRattNamn: okänt id ger ett fel med rätt meddelande", async () => {
  const fel = await fangaFel(hamtaRattNamn(99));
  assertTrue(fel !== null, "förväntade att ett fel skulle kastas");
  assertEqual(fel.message, "Hittade ingen rätt med id 99");
});
testAsync("hamtaRattEllerNull: ger rätten", async () => {
  assertEqual((await hamtaRattEllerNull(1)).namn, "Kardemummabulle");
});
testAsync("hamtaRattEllerNull: okänt id ger null, inget fel", async () => {
  assertEqual(await hamtaRattEllerNull(99), null);
});
testAsync("hamtaTvaRatterEfterVarandra: ger båda rätterna", async () => {
  const [a, b] = await hamtaTvaRatterEfterVarandra(1, 2, 10);
  assertEqual([a.id, b.id], [1, 2]);
});
testAsync("hamtaTvaRatterParallellt: ger båda rätterna", async () => {
  const [a, b] = await hamtaTvaRatterParallellt(3, 4, 10);
  assertEqual([a.id, b.id], [3, 4]);
});
testAsync("hamtaTvaRatterParallellt: går nästan dubbelt så fort som efter varandra", async () => {
  const start = Date.now();
  await hamtaTvaRatterParallellt(1, 2, 200);
  const tid = Date.now() - start;
  assertTrue(tid < 350, `tog ${tid} ms, förväntade under 350 (två anrop på 200 ms ska ske samtidigt)`);
});
testAsync("hamtaTvaRatterEfterVarandra: tar två gånger så lång tid", async () => {
  const start = Date.now();
  await hamtaTvaRatterEfterVarandra(1, 2, 200);
  const tid = Date.now() - start;
  assertTrue(tid >= 380, `tog ${tid} ms, förväntade minst 380 (två anrop efter varandra)`);
});
testAsync("hamtaMedForsok: lyckas på tredje försöket", async () => {
  assertEqual(await hamtaMedForsok(opalitligtAnrop(3), 3), "Lyckades på försök 3");
});
testAsync("hamtaMedForsok: ger upp och kastar sista felet", async () => {
  const fel = await fangaFel(hamtaMedForsok(opalitligtAnrop(3), 2));
  assertTrue(fel !== null, "förväntade att ett fel skulle kastas");
  assertEqual(fel.message, "Misslyckades (försök 2)");
});
testAsync("hamtaMedForsok: lyckas direkt vid första försöket", async () => {
  assertEqual(await hamtaMedForsok(opalitligtAnrop(1), 3), "Lyckades på försök 1");
});
testAsync("medTimeout: snabb promise går igenom", async () => {
  assertEqual(await medTimeout(vanta(10).then(() => "klart"), 200), "klart");
});
testAsync("medTimeout: långsam promise avvisas", async () => {
  const fel = await fangaFel(medTimeout(vanta(300), 50));
  assertTrue(fel !== null, "förväntade att ett fel skulle kastas");
  assertEqual(fel.message, "Tidsgränsen överskreds");
});
testAsync("laddaMeny: laddar, sedan klar", async () => {
  const steg = [];
  await laddaMeny(async () => [{ id: 1 }], (t) => steg.push(t.typ));
  assertEqual(steg, ["laddar", "klar"]);
});
testAsync("laddaMeny: klar skickar med rätterna", async () => {
  let senaste;
  await laddaMeny(async () => [{ id: 1 }], (t) => { senaste = t; });
  assertEqual(senaste.ratter, [{ id: 1 }]);
});
testAsync("laddaMeny: tom lista ger tomt", async () => {
  const steg = [];
  await laddaMeny(async () => [], (t) => steg.push(t.typ));
  assertEqual(steg, ["laddar", "tomt"]);
});
testAsync("laddaMeny: fel ger fel med meddelande", async () => {
  const steg = [];
  await laddaMeny(async () => { throw new Error("Servern svarar inte"); }, (t) => steg.push(t));
  assertEqual(steg, [{ typ: "laddar" }, { typ: "fel", meddelande: "Servern svarar inte" }]);
});

visaResultat();
