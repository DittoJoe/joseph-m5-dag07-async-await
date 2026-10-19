// Visar dina tillstånd på sidan. Du behöver inte ändra den här filen.
import { laddaMeny } from "./api.js";
import { hamtaMenyFranServer, vanta } from "./fordrojning.js";

const status = document.querySelector("#status");
const knapp = document.querySelector("#ladda");
const simuleraFel = document.querySelector("#simulera-fel");
const simuleraTomt = document.querySelector("#simulera-tomt");

function visaTillstand(tillstand) {
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
