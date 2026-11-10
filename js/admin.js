
import { supabase } from "./supabase.js";

const messagesBody = document.getElementById("messages-body");
const adminStatus = document.getElementById("admin-status");
const logoutBtn = document.getElementById("logout-btn");

async function cargarMensajes() {

    // Comprobar si existe una sesión
    const { data: sessionData, error: sessionError } =
        await supabase.auth.getSession();

    if (sessionError || !sessionData.session) {
        window.location.href = "index.html";
        return;
    }

    // Comprobar si el usuario es administrador
    const { data: admin, error: adminError } = await supabase
        .from("admin_users")
        .select("user_id")
        .eq("user_id", sessionData.session.user.id)
        .maybeSingle();

    if (adminError || !admin) {
        adminStatus.textContent =
            "No tienes permisos para acceder al panel administrativo.";
        return;
    }

    // Obtener mensajes de los clientes
    const { data, error } = await supabase
        .from("contact_messages")
        .select("name, email, message, created_at")
        .order("created_at", { ascending: false });

    if (error) {
        console.error(error);
        adminStatus.textContent = "Error al cargar los mensajes.";
        return;
    }

    messagesBody.replaceChildren();

    if (!data || data.length === 0) {
        adminStatus.textContent = "Todavía no hay mensajes recibidos.";
        return;
    }

    adminStatus.textContent =
        `Se encontraron ${data.length} mensajes.`;

    data.forEach((mensaje) => {

        const fila = document.createElement("tr");

        const valores = [
            mensaje.name,
            mensaje.email,
            mensaje.message,
            new Date(mensaje.created_at).toLocaleString("es-PE")
        ];

        valores.forEach((valor) => {
            const celda = document.createElement("td");
            celda.textContent = valor || "";
            fila.appendChild(celda);
        });

        messagesBody.appendChild(fila);
    });
}

// Cerrar sesión
logoutBtn.addEventListener("click", async () => {

    const { error } = await supabase.auth.signOut();

    if (error) {
        alert("No se pudo cerrar la sesión.");
        return;
    }

    window.location.href = "index.html";
});

cargarMensajes();
