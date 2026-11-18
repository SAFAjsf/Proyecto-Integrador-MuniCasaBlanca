(() => {
  "use strict";

  let ultimaTarjeta = null;

  document.querySelectorAll("[data-dialog]").forEach((tarjeta) => {
    tarjeta.addEventListener("click", () => {
      const dialogo = document.getElementById(tarjeta.dataset.dialog);

      if (!dialogo) return;

      ultimaTarjeta = tarjeta;
      dialogo.showModal();
      dialogo.querySelector("[data-dialog-close]")?.focus();
    });
  });

  document.querySelectorAll(".attraction-dialog").forEach((dialogo) => {
    const boton = dialogo.querySelector("[data-dialog-close]");

    if (boton) {
      boton.addEventListener("click", () => dialogo.close());
    }

    dialogo.addEventListener("click", (evento) => {
      if (evento.target === dialogo) {
        dialogo.close();
      }
    });

    dialogo.addEventListener("close", () => {
      if (ultimaTarjeta) {
        ultimaTarjeta.focus();
      }
    });
  });
})();