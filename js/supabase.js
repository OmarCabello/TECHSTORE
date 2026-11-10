
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

// ======================================
// 1. CONEXIÓN CON SUPABASE
// ======================================

const SUPABASE_URL = "https://yujugfgeunfvppzugres.supabase.co";

// Conserva aquí tu misma clave pública sb_publishable
const SUPABASE_KEY = "sb_publishable_wUHqIrPHloeCcBqVVtDWkQ_PC6pABvr";

// IMPORTANTE: exportamos el cliente para utilizarlo
// también desde admin.js
export const supabase = createClient(
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

            if (error) {
                throw error;
            }

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
// 3. FORMULARIO DE INICIO DE SESIÓN
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

            // 1. Comprobar correo y contraseña
            const { data, error } = await supabase.auth.signInWithPassword({
                email: email,
                password: password
            });

            if (error) {
                throw error;
            }

            // 2. Comprobar si el usuario está registrado
            // como administrador
            const { data: admin, error: adminError } = await supabase
                .from("admin_users")
                .select("user_id")
                .eq("user_id", data.user.id)
                .maybeSingle();

            if (adminError) {
                throw adminError;
            }

            // 3. Si no es administrador, impedir el acceso
            if (!admin) {

                await supabase.auth.signOut();

                loginOk.textContent =
                    "No tienes permisos para acceder al panel administrativo.";

                loginOk.style.color = "red";
                loginOk.hidden = false;

                return;
            }

            // 4. Si es administrador, ingresar al panel
            loginOk.textContent =
                "¡Bienvenido a TECHSTORE! Redirigiendo al panel...";

            loginOk.style.color = "green";
            loginOk.hidden = false;

            console.log("Administrador autenticado:", data.user.email);

            setTimeout(() => {
                window.location.href = "admin.html";
            }, 1000);

        } catch (error) {

            console.error("Error de inicio de sesión:", error);

            loginOk.textContent =
                "No se pudo iniciar sesión. Verifica tus credenciales y permisos.";

            loginOk.style.color = "red";
            loginOk.hidden = false;

        } finally {

            button.disabled = false;
            button.textContent = "Ingresar";

        }

    });

}
