# Dag 7 · async och await

*Modul 5, UI/UX & Frontendutveckling (JavaScript), Lexicon IT-Proffs*

## Vad du ska göra idag

Du skriver **asynkron kod** som ser ut som vanlig kod med `async` och `await`. Du hanterar fel med `try/catch`, kör anrop parallellt med `Promise.all`, provar igen när något misslyckas och bygger funktionen `laddaMeny` som ger tillstånden *laddar*, *klar*, *tomt* och *fel*.

## Bakgrund

Igår läste du asynkron kod. Idag skriver du den. `async` och `await` är bara ett trevligare sätt att skriva promises: koden läses uppifrån och ned, och fel hanteras med samma `try/catch` som du redan känner till. Du får en låtsasserver (`fordrojning.js`) som svarar efter en liten väntan, så att du kan öva utan riktiga nätanrop. Imorgon byter vi ut den mot riktiga anrop med `fetch`.

## Så arbetar du (samma som alltid)

1. **Forka** dagens repo på GitHub (*Fork → Create fork*).
2. **Klona din fork:** *Code → HTTPS → kopiera adressen*. I terminalen (Ctrl+ö i VS Code): `git clone <adressen>`. Öppna den nya mappen i VS Code och starta *Live Server*.
3. **Gör uppgiften.** Spara och kontrollera i webbläsaren och Console (F12) efter varje steg. Gör en commit efter varje avslutat steg: `git add .` och `git commit -m "Beskriv vad du gjorde"`.
4. **Skicka upp** när du är klar: `git push`.
5. **Lämna in i Microsoft Forms.**

Fastnar du: skriv ner exakt var och vad du försökt (och vilket felmeddelande du fick), och ta det först i nästa handledda pass.

Filer som använder `import` fungerar bara när sidan öppnas med *Live Server*. Dubbelklickar du på en HTML-fil hamnar du på `file://` och får ett CORS-fel i Console.

## Uppgiften steg för steg

### Steg 1. Klona, öppna och kör testerna

Forka repot, kör `git clone`, öppna mappen i VS Code och starta Live Server på `tests.html` (modulerna kräver Live Server). Alla tester är röda utom några. Testerna är asynkrona, så resultatet kommer efter någon sekund. Öppna `fordrojning.js` och läs den, men ändra den inte.

### Steg 2. Del 1: skriv om kedjorna i kedjor.js

Fyra funktioner använder `.then()`. Skriv om var och en till en `async function` med `await`. Beteendet ska vara exakt detsamma. Gör en funktion i taget och kör testerna efter varje. Commit när alla fyra är gröna.

### Steg 3. Del 2: hamtaMeny, hamtaRattNamn och hamtaRattEllerNull

Öppna `api.js`. Skriv de tre första funktionerna. Den första väntar på menyn. Den andra låter felet följa med. Den tredje fångar felet med `try/catch` och returnerar `null`. Skillnaden mellan två och tre är dagens viktigaste poäng: vem ska hantera felet?

### Steg 4. Efter varandra eller samtidigt

Skriv `hamtaTvaRatterEfterVarandra` med två `await` i rad, och `hamtaTvaRatterParallellt` med `Promise.all`. Två tester mäter tiden. Skriv i `docs/async-anteckningar.md` (eller i en kommentar) varför den parallella är snabbare.

### Steg 5. Försök igen och tidsgräns

Skriv `hamtaMedForsok` (en loop med `try/catch` som försöker upp till `maxForsok` gånger) och `medTimeout` (`Promise.race` mellan din promise och en timer som avvisar). Börja med att skriva på papper vad som ska hända vid försök 1, 2 och 3.

### Steg 6. Tillståndsmaskinen laddaMeny

Skriv `laddaMeny(hamtaFn, vidTillstand)`. Först `laddar`, sedan antingen `klar`, `tomt` eller `fel`. Alla fyra tillstånd har varsitt test. Det här mönstret använder du imorgon med riktig data.

### Steg 7. Se det på sidan

Öppna `index.html` med Live Server. Tryck på *Ladda menyn*. Prova rutorna *Simulera fel* och *Simulera tom lista*. Öppna Console och DevTools. Ser du de fyra tillstånden? Du behöver inte ändra `demo.js`.

### Steg 8. Fördjupning (frivillig): allSettled

Skriv `hamtaAllaForsiktigt(idLista)` som hämtar många rätter parallellt med `Promise.allSettled` och returnerar `{ lyckade, misslyckade }`. Skriv egna tester i en ny fil `extra-tests.js`.

## Kontrollista: så vet du att du är klar

- [ ] Alla tester på `tests.html` är gröna.
- [ ] Alla fyra funktioner i `kedjor.js` är `async` och saknar `.then()`.
- [ ] Du kan förklara skillnaden på att fånga ett fel i funktionen och att låta det följa med.
- [ ] Du kan förklara varför `Promise.all` är snabbare än två `await` i rad.
- [ ] `index.html` visar alla fyra tillstånden.
- [ ] Du har gjort minst fem commits med beskrivande meddelanden.

## Tips om du fastnar

- Glömmer du `await` får du en *promise* istället för värdet. Det syns som `Promise { <pending> }` i Console.
- `await` fungerar bara inuti en `async function` (och i moduler på toppnivå). Får du ett syntaxfel, titta på funktionens första rad.
- Vill du köra två anrop samtidigt: starta båda först, vänta sedan. `await Promise.all([a(), b()])`.
- `return await` inuti `try` behövs om du vill att `catch` ska fånga felet. Utan `await` slipper felet förbi.
- Testerna körs i modul-läge och kräver Live Server. Öppnar du filen direkt (`file://`) blockeras modulerna.
- Fastnar du: skriv `console.log` före och efter varje `await` och se i vilken ordning det kommer.

## Inlämning

**Deadline: imorgon klockan 09.00.** Allt lämnas in i Microsoft Forms. Du behöver inte redovisa något muntligt.

I formuläret fyller du i:

1. Länk till din fork av det här repot.
2. Reflektion: Vad är skillnaden mellan att fånga ett fel i funktionen (`hamtaRattEllerNull`) och att låta det följa med (`hamtaRattNamn`)? När är respektive sätt rätt?

## Vill du mer? (frivilligt)

- Skriv `medTimeoutOchForsok` som kombinerar `hamtaMedForsok` och `medTimeout`.
- Lägg till en fördröjning mellan försöken i `hamtaMedForsok` (vänta 200 ms, sedan 400 ms: *exponentiell backoff*).
- Skriv en `AbortController`-version av `medTimeout` som faktiskt avbryter anropet (vi ser det på dag 10).
