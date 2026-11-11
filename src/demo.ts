// Visar dina tillstånd på sidan. Du behöver inte ändra den här filen.
import { laddaMeny } from "./api";
import { hamtaMenyFranServer, vanta } from "./fordrojning";
import { hamta } from "./dom";
import type { Tillstand } from "./typer";

const status = hamta("#status");
const knapp = hamta<HTMLButtonElement>("#ladda");
const simuleraFel = hamta<HTMLInputElement>("#simulera-fel");
const simuleraTomt = hamta<HTMLInputElement>("#simulera-tomt");

function visaTillstand(tillstand: Tillstand): void {
  status.className = tillstand.typ;
  knapp.disabled = tillstand.typ === "laddar";
  if (tillstand.typ === "laddar") {
    status.textContent = "Laddar menyn...";
  } else if (tillstand.typ === "tomt") {
    status.textContent = "Inga rätter hittades.";
  } else if (tillstand.typ === "fel") {
    status.textContent = `Något gick fel: ${tillstand.meddelande}. Försök igen.`;
  } else {
    status.textContent = `Hämtade ${tillstand.ratter.length} rätter: ${tillstand.ratter.map((r) => r.namn).join(", ")}`;
  }
}

knapp.addEventListener("click", () => {
  const hamtaFn = async () => {
    await vanta(1500);
    if (simuleraFel.checked) {
      throw new Error("Servern svarar inte");
    }
    if (simuleraTomt.checked) {
      return [];
    }
    return hamtaMenyFranServer(0);
  };
  laddaMeny(hamtaFn, visaTillstand);
});
