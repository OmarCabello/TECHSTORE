
import { createClient } from
  "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

// ======================================
// 1. CONEXION CON SUPABASE
// ======================================

const SUPABASE_URL =
  "https://yujugfgeunfvppzugres.supabase.co";

const SUPABASE_KEY =
  "sb_publishable_wUHqIrPHloeCcBqVVtDWkQ_PC6pABvr";

const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);

console.log("TECHSTORE: cliente Supabase inicializado");

// ======================================
// 2. FORMULARIO DE CONTACTO
// ======================================

const contactForm = document.getElementById("contact-form");

if (contactForm) {

  contactForm.addEventListener("submit", async (e) => {

    e.preventDefault();

    const name = document.getElementById("contact-name").value.trim();
    const email = document.getElementById("contact-email").value.trim();
    const message = document.getElementById("contact-message").value.trim();

    const button = contactForm.querySelector('button[type="submit"]');
    const contactOk = document.getElementById("contact-ok");

    button.disabled = true;
    button.textContent = "Enviando...";

    contactOk.hidden = true;

    try {

      const { error } = await supabase
        .from("contact_messages")
        .insert({
          name: name,
          email: email,
          message: message
        });

      if (error) throw error;

      contactOk.textContent =
        "¡Mensaje enviado correctamente! Gracias por contactarnos.";

      contactOk.style.color = "green";
      contactOk.hidden = false;

      contactForm.reset();

      console.log("Mensaje guardado correctamente");

    } catch (error) {

      console.error("Error al guardar el mensaje:", error);

      contactOk.textContent =
        "No se pudo enviar el mensaje. Inténtalo nuevamente.";

      contactOk.style.color = "red";
      contactOk.hidden = false;

    } finally {

      button.disabled = false;
      button.textContent = "Enviar mensaje";

    }

  });

}

// ======================================
// 3. FORMULARIO DE INICIO DE SESION
// ======================================

const loginForm = document.getElementById("login-form");

if (loginForm) {

  loginForm.addEventListener("submit", async (e) => {

    e.preventDefault();

    const email = document.getElementById("login-email").value.trim();
    const password = document.getElementById("login-password").value;

    const button = loginForm.querySelector('button[type="submit"]');
    const loginOk = document.getElementById("login-ok");

    button.disabled = true;
    button.textContent = "Verificando...";

    loginOk.hidden = true;

    try {

      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password
      });

      if (error) throw error;

      loginOk.textContent =
        "¡Bienvenido a TECHSTORE! Sesión iniciada correctamente.";

      loginOk.style.color = "green";
      loginOk.hidden = false;

      console.log("Usuario autenticado:", data.user.email);

    } catch (error) {

      console.error("Error de inicio de sesión:", error);

      loginOk.textContent =
        "Correo o contraseña incorrectos.";

      loginOk.style.color = "red";
      loginOk.hidden = false;

    } finally {

      button.disabled = false;
      button.textContent = "Ingresar";

    }

  });

}
