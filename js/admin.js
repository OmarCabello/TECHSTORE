import { supabase } from "./supabase.js";

const messagesBody = document.getElementById("messages-body");
const adminStatus = document.getElementById("admin-status");
const ordersBody = document.getElementById("orders-body");
const ordersStatus = document.getElementById("orders-status");
const logoutBtn = document.getElementById("logout-btn");

const ESTADOS_PEDIDO = [
    "Pendiente de validación",
    "Comprobante enviado",
    "Pago validado",
    "En camino",
    "Entregado",
    "Cancelado"
];

async function inicializarPanel() {
    const { data: sessionData, error: sessionError } =
        await supabase.auth.getSession();

    if (sessionError || !sessionData.session) {
        window.location.href = "index.html";
        return;
    }

    const { data: admin, error: adminError } = await supabase
        .from("admin_users")
        .select("user_id")
        .eq("user_id", sessionData.session.user.id)
        .maybeSingle();

    if (adminError || !admin) {
        adminStatus.textContent =
            "No tienes permisos para acceder al panel administrativo.";
        ordersStatus.textContent =
            "No tienes permisos para acceder al panel administrativo.";
        return;
    }

    await Promise.all([cargarPedidos(), cargarMensajes()]);
}

// ======================================
// GESTIÓN DE PEDIDOS
// ======================================
async function cargarPedidos() {
    const { data, error } = await supabase
        .from("pedidos")
        .select("*")
        .order("id", { ascending: false });

    if (error) {
        console.error("Error al cargar pedidos:", error);
        ordersStatus.textContent = "Error al cargar los pedidos.";
        return;
    }

    ordersBody.replaceChildren();

    if (!data || data.length === 0) {
        ordersStatus.textContent = "Todavía no hay pedidos registrados.";
        return;
    }

    ordersStatus.textContent = `Se encontraron ${data.length} pedidos.`;

    data.forEach((pedido) => {
        const fila = document.createElement("tr");

        // Código
        const tdCodigo = document.createElement("td");
        tdCodigo.innerHTML = `<strong>${pedido.codigo_seguimiento}</strong>`;
        fila.appendChild(tdCodigo);

        // Correo
        const tdCorreo = document.createElement("td");
        tdCorreo.textContent = pedido.cliente_correo || "";
        fila.appendChild(tdCorreo);

        // Productos + botón Ver captura si existe
        const tdProductos = document.createElement("td");
        let voucherUrl = "";

        if (Array.isArray(pedido.productos)) {
            const textos = [];
            pedido.productos.forEach((p) => {
                if (p.voucher_url) {
                    voucherUrl = p.voucher_url;
                }
                if (Number(p.price) > 0) {
                    textos.push(`${p.name} (S/ ${Number(p.price).toFixed(2)})`);
                } else {
                    textos.push(`<strong>${p.name}</strong>`);
                }
            });
            tdProductos.innerHTML = textos.join("<br>");
        }

        if (voucherUrl) {
            const linkVoucher = document.createElement("a");
            linkVoucher.href = voucherUrl;
            linkVoucher.target = "_blank";
            linkVoucher.rel = "noopener";
            linkVoucher.textContent = "📎 Ver captura";
            linkVoucher.style.display = "inline-block";
            linkVoucher.style.marginTop = "6px";
            linkVoucher.style.padding = "4px 10px";
            linkVoucher.style.background = "#0077ff";
            linkVoucher.style.color = "#ffffff";
            linkVoucher.style.borderRadius = "6px";
            linkVoucher.style.fontSize = "12px";
            linkVoucher.style.fontWeight = "600";
            linkVoucher.style.textDecoration = "none";
            tdProductos.appendChild(document.createElement("br"));
            tdProductos.appendChild(linkVoucher);
        }

        fila.appendChild(tdProductos);

        // Total
        const tdTotal = document.createElement("td");
        tdTotal.textContent = `S/ ${Number(pedido.total).toFixed(2)}`;
        fila.appendChild(tdTotal);

        // Etiqueta de estado actual
        const tdEstado = document.createElement("td");
        const badge = document.createElement("span");
        badge.textContent = pedido.estado;
        badge.style.padding = "4px 8px";
        badge.style.borderRadius = "6px";
        badge.style.fontWeight = "bold";
        badge.style.fontSize = "13px";
        badge.style.background = pedido.estado === "Entregado" || pedido.estado === "Pago validado" ? "#e8f5e9" : "#e0f7fa";
        badge.style.color = pedido.estado === "Entregado" || pedido.estado === "Pago validado" ? "#2e7d32" : "#006064";
        tdEstado.appendChild(badge);
        fila.appendChild(tdEstado);

        // Selector para cambiar estado
        const tdAccion = document.createElement("td");
        const select = document.createElement("select");

        ESTADOS_PEDIDO.forEach((estadoOpcion) => {
            const option = document.createElement("option");
            option.value = estadoOpcion;
            option.textContent = estadoOpcion;
            if (pedido.estado === estadoOpcion) {
                option.selected = true;
            }
            select.appendChild(option);
        });

        select.addEventListener("change", async () => {
            const nuevoEstado = select.value;
            select.disabled = true;

            const { error: updateError } = await supabase
                .from("pedidos")
                .update({ estado: nuevoEstado })
                .eq("id", pedido.id);

            select.disabled = false;

            if (updateError) {
                console.error("Error al actualizar estado:", updateError);
                alert("No se pudo actualizar el estado.");
                select.value = pedido.estado;
                return;
            }

            pedido.estado = nuevoEstado;
            badge.textContent = nuevoEstado;
            badge.style.background = nuevoEstado === "Entregado" || nuevoEstado === "Pago validado" ? "#e8f5e9" : "#e0f7fa";
            badge.style.color = nuevoEstado === "Entregado" || nuevoEstado === "Pago validado" ? "#2e7d32" : "#006064";
        });

        tdAccion.appendChild(select);
        fila.appendChild(tdAccion);

        ordersBody.appendChild(fila);
    });
}

// ======================================
// MENSAJES DE CONTACTO
// ======================================
async function cargarMensajes() {
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

inicializarPanel();