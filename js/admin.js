import { supabase } from "./supabase.js";

const messagesBody = document.getElementById("messages-body");
const adminStatus = document.getElementById("admin-status");
const ordersBody = document.getElementById("orders-body");
const ordersStatus = document.getElementById("orders-status");
const logoutBtn = document.getElementById("logout-btn");

// Elementos de Productos
const addProductForm = document.getElementById("add-product-form");
const saveProdBtn = document.getElementById("save-prod-btn");
const adminProductsBody = document.getElementById("admin-products-body");
const productsStatus = document.getElementById("products-status");

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
        adminStatus.textContent = "No tienes permisos para acceder al panel administrativo.";
        ordersStatus.textContent = "No tienes permisos para acceder al panel administrativo.";
        return;
    }

    await Promise.all([cargarProductosAdmin(), cargarPedidos(), cargarMensajes()]);
}

// ======================================
// 1. GESTIÓN DE PRODUCTOS Y OFERTAS
// ======================================
async function cargarProductosAdmin() {
    const { data, error } = await supabase
        .from("productos")
        .select("*")
        .order("id", { ascending: false });

    if (error) {
        console.error("Error al cargar productos:", error);
        productsStatus.textContent = "Error al cargar catálogo.";
        return;
    }

    adminProductsBody.replaceChildren();

    if (!data || data.length === 0) {
        productsStatus.textContent = "0 equipos extra agregados (mostrando catálogo base).";
        return;
    }

    productsStatus.textContent = `${data.length} equipos publicados desde Admin.`;

    data.forEach((prod) => {
        const fila = document.createElement("tr");

        // Imagen
        const tdImg = document.createElement("td");
        tdImg.innerHTML = `<img src="${prod.img}" alt="${prod.name}" style="width:48px;height:48px;object-fit:contain;border-radius:8px;background:#f1f5f9;padding:4px;" />`;
        fila.appendChild(tdImg);

        // Nombre
        const tdNombre = document.createElement("td");
        tdNombre.innerHTML = `<strong>${prod.name}</strong>`;
        fila.appendChild(tdNombre);

        // Precio
        const tdPrecio = document.createElement("td");
        const oldText = prod.old ? ` <span style="text-decoration:line-through;color:#94a3b8;font-size:12px;">S/ ${Number(prod.old).toFixed(2)}</span>` : "";
        tdPrecio.innerHTML = `<strong>S/ ${Number(prod.price).toFixed(2)}</strong>${oldText}`;
        fila.appendChild(tdPrecio);

        // Tipo (Oferta / Normal)
        const tdTipo = document.createElement("td");
        tdTipo.innerHTML = prod.offer
            ? `<span style="background:#fef3c7;color:#b45309;padding:4px 8px;border-radius:6px;font-size:12px;font-weight:700;">🔥 En Oferta</span>`
            : `<span style="background:#f1f5f9;color:#475569;padding:4px 8px;border-radius:6px;font-size:12px;font-weight:600;">Catálogo</span>`;
        fila.appendChild(tdTipo);

        // Eliminar
        const tdDel = document.createElement("td");
        const btnDel = document.createElement("button");
        btnDel.textContent = "Eliminar";
        btnDel.className = "admin-btn-logout";
        btnDel.style.padding = "6px 12px";
        btnDel.style.fontSize = "12px";

        btnDel.addEventListener("click", async () => {
            if (!confirm(`¿Seguro que deseas eliminar "${prod.name}"?`)) return;
            btnDel.disabled = true;
            const { error: delError } = await supabase
                .from("productos")
                .delete()
                .eq("id", prod.id);

            if (delError) {
                alert("No se pudo eliminar el producto.");
                btnDel.disabled = false;
                return;
            }
            await cargarProductosAdmin();
        });

        tdDel.appendChild(btnDel);
        fila.appendChild(tdDel);

        adminProductsBody.appendChild(fila);
    });
}

if (addProductForm) {
    addProductForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const name = document.getElementById("prod-name").value.trim();
        const price = parseFloat(document.getElementById("prod-price").value);
        const oldVal = document.getElementById("prod-old").value;
        const old = oldVal ? parseFloat(oldVal) : null;
        const offer = document.getElementById("prod-offer").checked;
        const file = document.getElementById("prod-img").files[0];

        if (!name || isNaN(price) || !file) {
            alert("Completa el nombre, precio e imagen del equipo.");
            return;
        }

        saveProdBtn.disabled = true;
        saveProdBtn.textContent = "Subiendo foto...";

        try {
            const ext = file.name.split(".").pop() || "webp";
            const fileName = `equipo-${Date.now()}.${ext}`;

            const { error: uploadErr } = await supabase.storage
                .from("productos")
                .upload(fileName, file);

            if (uploadErr) {
                console.error("Error subiendo imagen:", uploadErr);
                alert("No se pudo subir la imagen del equipo.");
                return;
            }

            const { data: urlData } = supabase.storage
                .from("productos")
                .getPublicUrl(fileName);

            const { error: insertErr } = await supabase
                .from("productos")
                .insert([{
                    name,
                    price,
                    old,
                    offer,
                    img: urlData.publicUrl
                }]);

            if (insertErr) {
                console.error("Error guardando producto:", insertErr);
                alert("No se pudo guardar el producto en la base de datos.");
                return;
            }

            addProductForm.reset();
            await cargarProductosAdmin();
            alert(`¡"${name}" publicado correctamente en la tienda!`);
        } finally {
            saveProdBtn.disabled = false;
            saveProdBtn.textContent = "+ Publicar producto";
        }
    });
}

// ======================================
// 2. GESTIÓN DE PEDIDOS
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

        const tdCodigo = document.createElement("td");
        tdCodigo.innerHTML = `<strong>${pedido.codigo_seguimiento}</strong>`;
        fila.appendChild(tdCodigo);

        const tdCorreo = document.createElement("td");
        tdCorreo.textContent = pedido.cliente_correo || "";
        fila.appendChild(tdCorreo);

        const tdProductos = document.createElement("td");
        let voucherUrl = "";

        if (Array.isArray(pedido.productos)) {
            const textos = [];
            pedido.productos.forEach((p) => {
                if (p.voucher_url) voucherUrl = p.voucher_url;
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
            linkVoucher.style.cssText = "display:inline-block;margin-top:6px;padding:4px 10px;background:#0077ff;color:#fff;border-radius:6px;font-size:12px;font-weight:600;text-decoration:none;";
            tdProductos.appendChild(document.createElement("br"));
            tdProductos.appendChild(linkVoucher);
        }

        fila.appendChild(tdProductos);

        const tdTotal = document.createElement("td");
        tdTotal.textContent = `S/ ${Number(pedido.total).toFixed(2)}`;
        fila.appendChild(tdTotal);

        const tdEstado = document.createElement("td");
        const badge = document.createElement("span");
        badge.textContent = pedido.estado;
        badge.style.cssText = "padding:4px 8px;border-radius:6px;font-weight:bold;font-size:13px;";
        badge.style.background = pedido.estado === "Entregado" || pedido.estado === "Pago validado" ? "#e8f5e9" : "#e0f7fa";
        badge.style.color = pedido.estado === "Entregado" || pedido.estado === "Pago validado" ? "#2e7d32" : "#006064";
        tdEstado.appendChild(badge);
        fila.appendChild(tdEstado);

        const tdAccion = document.createElement("td");
        const select = document.createElement("select");

        ESTADOS_PEDIDO.forEach((estadoOpcion) => {
            const option = document.createElement("option");
            option.value = estadoOpcion;
            option.textContent = estadoOpcion;
            if (pedido.estado === estadoOpcion) option.selected = true;
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
// 3. MENSAJES DE CONTACTO
// ======================================
async function cargarMensajes() {
    const { data, error } = await supabase
        .from("contact_messages")
        .select("name, email, message, created_at")
        .order("created_at", { ascending: false });

    if (error) {
        adminStatus.textContent = "Error al cargar los mensajes.";
        return;
    }

    messagesBody.replaceChildren();

    if (!data || data.length === 0) {
        adminStatus.textContent = "Todavía no hay mensajes recibidos.";
        return;
    }

    adminStatus.textContent = `Se encontraron ${data.length} mensajes.`;

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

logoutBtn.addEventListener("click", async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
        alert("No se pudo cerrar la sesión.");
        return;
    }
    window.location.href = "index.html";
});

inicializarPanel();