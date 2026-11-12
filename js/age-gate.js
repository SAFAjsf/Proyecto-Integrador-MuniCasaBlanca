/* =====================================
   CONFIRMACIÓN DE MAYORÍA DE EDAD
   Módulo compartido:
   Valle y viñas / Ruta del Vino
===================================== */

(() => {
  "use strict";

  const ageGate = document.getElementById("age-gate");
  const confirmButton = document.getElementById("age-confirm");
  const denyButton = document.getElementById("age-deny");

  // Si la página no contiene el diálogo, no hacer nada.
  if (!ageGate || !confirmButton || !denyButton) {
    return;
  }

  const STORAGE_KEY = "casablanca_mayor_edad";

  // Comprobar si ya se confirmó la mayoría de edad.
  try {
    if (sessionStorage.getItem(STORAGE_KEY) === "true") {
      return;
    }
  } catch (error) {
    console.warn(
      "No fue posible consultar la confirmación de edad.",
      error
    );
  }

  // Mostrar el diálogo.
  if (typeof ageGate.showModal === "function") {
    ageGate.showModal();
  } else {
    ageGate.setAttribute("open", "");
  }

  // Confirmar mayoría de edad.
  confirmButton.addEventListener("click", () => {
    try {
      sessionStorage.setItem(STORAGE_KEY, "true");
    } catch (error) {
      console.warn(
        "No fue posible guardar la confirmación de edad.",
        error
      );
    }

    if (typeof ageGate.close === "function") {
      ageGate.close();
    } else {
      ageGate.removeAttribute("open");
    }
  });

  // Rechazar el acceso.
  denyButton.addEventListener("click", () => {
    window.location.href = "../index.html";
  });

  // Impedir el cierre mediante Escape.
  ageGate.addEventListener("cancel", (event) => {
    event.preventDefault();
  });

})();