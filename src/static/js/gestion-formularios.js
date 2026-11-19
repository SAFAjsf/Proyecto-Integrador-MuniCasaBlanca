(() => {
  "use strict";

  // 1. Si el servidor devolvió errores, el resumen recibe el foco
  //    para que un lector de pantalla lo anuncie de inmediato.
  const resumen = document.getElementById("resumen-errores");

  if (resumen) {
    resumen.focus();
  }

  // 2. Mostrar u ocultar las contraseñas sin enviar nada al servidor.
  document.querySelectorAll("[data-password-toggle]").forEach((boton) => {
    boton.addEventListener("click", () => {
      const ids = (boton.dataset.passwordToggle || "")
        .split(/\s+/)
        .filter(Boolean);

      const mostrar = boton.getAttribute("aria-pressed") !== "true";

      ids.forEach((id) => {
        const input = document.getElementById(id);

        if (input) {
          input.type = mostrar ? "text" : "password";
        }
      });

      boton.setAttribute("aria-pressed", String(mostrar));
      boton.textContent = mostrar ? "Ocultar" : "Mostrar";
    });
  });

  // 3. Resumen del rol resultante mientras se marcan las casillas.
  const resumenRol = document.querySelector("[data-role-summary]");
  const casillaAdmin = document.getElementById("id_es_administrador");
  const casillaEditor = document.getElementById("id_es_funcionario");

  if (resumenRol && casillaAdmin && casillaEditor) {
    const actualizarRol = () => {
      if (casillaAdmin.checked) {
        resumenRol.textContent =
          "Administrador: acceso total al panel municipal, publicación y gestión de usuarios.";
      } else if (casillaEditor.checked) {
        resumenRol.textContent =
          "Editor de contenido: puede crear y editar atractivos, pero no publicarlos ni gestionar usuarios.";
      } else {
        resumenRol.textContent =
          "Sin rol asignado: la cuenta no podrá acceder al panel municipal.";
      }
    };

    [casillaAdmin, casillaEditor].forEach((casilla) => {
      casilla.addEventListener("change", actualizarRol);
    });

    actualizarRol();
  }

  // 4. Mostrar el nombre del archivo elegido junto al campo.
  document.querySelectorAll('input[type="file"]').forEach((input) => {
    input.addEventListener("change", () => {
      const destino = document.querySelector(
        `[data-file-name="${input.id}"]`,
      );

      if (!destino) {
        return;
      }

      destino.textContent =
        input.files && input.files.length
          ? input.files[0].name
          : "Sin archivo seleccionado";
    });
  });
})();
