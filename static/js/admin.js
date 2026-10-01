// =========================================================
// MEDICARE - REPORTES ADMINISTRATIVOS
// =========================================================


// =========================================================
// OBTENER DATOS DE FLASK
// =========================================================

let medicareReportesData = {
    pacientes: [],
    resumen: {
        pacientes: 0,
        diagnosticos: 0,
        ordenes: 0
    }
};


document.addEventListener("DOMContentLoaded", function () {

    const datosElemento =
        document.getElementById(
            "medicare-reportes-data"
        );


    if (datosElemento) {

        try {

            medicareReportesData =
                JSON.parse(
                    datosElemento.textContent
                );

        } catch (error) {

            console.error(
                "Error al cargar los datos de reportes:",
                error
            );

        }

    }

});


// =========================================================
// ESCAPAR HTML
// =========================================================

function escaparHTML(valor) {

    if (
        valor === null ||
        valor === undefined
    ) {

        return "";

    }


    return String(valor)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


// =========================================================
// MOSTRAR RESULTADO
// =========================================================

function mostrarResultado(contenido) {

    const resultado =
        document.getElementById(
            "reporteResultado"
        );


    if (!resultado) {

        console.error(
            "No se encontró #reporteResultado"
        );

        return;

    }


    resultado.innerHTML = contenido;

    resultado.style.display = "block";


    resultado.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });

}


// =========================================================
// REPORTE DE PACIENTES
// =========================================================

function mostrarPacientes() {

    const pacientes =
        medicareReportesData.pacientes || [];


    let contenido = `

        <div class="admin-report-result-header">

            <div>

                <span>
                    REPORTE
                </span>

                <h2>
                    Pacientes registrados
                </h2>

                <p>
                    Listado actual de pacientes
                    registrados en MediCare.
                </p>

            </div>


            <button
                type="button"
                class="admin-report-export"
                onclick="imprimirReporte()"
            >
                🖨️ Imprimir
            </button>

        </div>

    `;


    // -----------------------------------------------------
    // SIN PACIENTES
    // -----------------------------------------------------

    if (pacientes.length === 0) {

        contenido += `

            <div class="admin-report-empty">

                <div class="admin-report-empty-icon">
                    👥
                </div>

                <h3>
                    No hay pacientes registrados
                </h3>

                <p>
                    Actualmente no existen pacientes
                    registrados en el sistema.
                </p>

            </div>

        `;


        mostrarResultado(contenido);

        return;

    }


    // -----------------------------------------------------
    // TABLA
    // -----------------------------------------------------

    contenido += `

        <div class="admin-report-table-wrapper">

            <table class="admin-report-table">

                <thead>

                    <tr>

                        <th>
                            ID
                        </th>

                        <th>
                            Paciente
                        </th>

                        <th>
                            Documento
                        </th>

                        <th>
                            Fecha de nacimiento
                        </th>

                        <th>
                            Sexo
                        </th>

                        <th>
                            Teléfono
                        </th>

                    </tr>

                </thead>

                <tbody>

    `;


    pacientes.forEach(function (paciente) {

        contenido += `

            <tr>

                <td>
                    ${escaparHTML(
                        paciente.id_paciente
                    )}
                </td>


                <td>
                    ${escaparHTML(
                        paciente.nombre
                    )}

                    ${escaparHTML(
                        paciente.apellido
                    )}
                </td>


                <td>
                    ${escaparHTML(
                        paciente.documento
                    )}
                </td>


                <td>
                    ${escaparHTML(
                        paciente.fecha_nacimiento
                    ) || "No registrada"}
                </td>


                <td>
                    ${escaparHTML(
                        paciente.sexo
                    ) || "No registrado"}
                </td>


                <td>
                    ${escaparHTML(
                        paciente.telefono
                    ) || "No registrado"}
                </td>

            </tr>

        `;

    });


    contenido += `

                </tbody>

            </table>

        </div>

    `;


    mostrarResultado(contenido);

}


// =========================================================
// SELECTOR DE HISTORIA CLÍNICA
// =========================================================

function mostrarSelectorHistoria() {

    const pacientes =
        medicareReportesData.pacientes || [];


    let opciones = "";


    pacientes.forEach(function (paciente) {

        opciones += `

            <option
                value="${escaparHTML(
                    paciente.id_paciente
                )}"
            >

                ${escaparHTML(
                    paciente.nombre
                )}

                ${escaparHTML(
                    paciente.apellido
                )}

                -

                ${escaparHTML(
                    paciente.documento
                )}

            </option>

        `;

    });


    let contenido = `

        <div class="admin-report-result-header">

            <div>

                <span>
                    HISTORIA CLÍNICA
                </span>

                <h2>
                    Consultar paciente
                </h2>

                <p>
                    Selecciona un paciente para consultar
                    su información clínica.
                </p>

            </div>

        </div>


        <div class="admin-report-form">

            <label for="pacienteHistoria">

                Seleccionar paciente

            </label>


            <select
                id="pacienteHistoria"
            >

                <option value="">

                    -- Selecciona un paciente --

                </option>

                ${opciones}

            </select>


            <button
                type="button"
                class="admin-report-main-button"
                onclick="consultarHistoria()"
            >

                Consultar historia

            </button>

        </div>

    `;


    mostrarResultado(contenido);

}


// =========================================================
// CONSULTAR HISTORIA
// =========================================================

async function consultarHistoria() {

    const selector =
        document.getElementById(
            "pacienteHistoria"
        );


    if (!selector) {

        return;

    }


    const paciente =
        selector.value;


    if (!paciente) {

        alert(
            "Selecciona un paciente."
        );

        return;

    }


    try {

        const respuesta =
            await fetch(
                `/admin/reportes/historia/${paciente}`
            );


        const datos =
            await respuesta.json();


        if (!respuesta.ok) {

            throw new Error(
                datos.error ||
                "No se pudo obtener la historia clínica."
            );

        }


        mostrarHistoria(datos);

    }


    catch (error) {

        console.error(
            "Error:",
            error
        );


        mostrarResultado(`

            <div class="admin-report-empty">

                <div class="admin-report-empty-icon">
                    ⚠️
                </div>

                <h3>
                    No se pudo cargar la historia
                </h3>

                <p>
                    ${escaparHTML(
                        error.message
                    )}
                </p>

            </div>

        `);

    }

}


// =========================================================
// MOSTRAR HISTORIA CLÍNICA
// =========================================================

function mostrarHistoria(datos) {

    const paciente = datos.paciente;
    const diagnosticos = datos.diagnosticos || [];
    const ordenes = datos.ordenes || [];

    let contenido = `

        <div class="admin-history-report">

            <div class="admin-history-header">

                <div>
                    <span class="admin-label">
                        HISTORIA CLÍNICA
                    </span>

                    <h2>
                        ${escaparHTML(paciente.nombre)}
                        ${escaparHTML(paciente.apellido)}
                    </h2>

                    <p>
                        Documento:
                        ${escaparHTML(paciente.documento)}
                    </p>
                </div>

                <button
                    type="button"
                    class="admin-report-export"
                    onclick="imprimirReporte()"
                >
                    🖨️ Imprimir
                </button>

            </div>


            <!-- INFORMACIÓN PERSONAL -->

            <div class="admin-history-section">

                <div class="admin-history-section-title">
                    <span>INFORMACIÓN PERSONAL</span>
                    <h3>Datos del paciente</h3>
                </div>

                <div class="admin-history-grid">

                    <div>
                        <strong>Nombre completo</strong>
                        <p>
                            ${escaparHTML(paciente.nombre)}
                            ${escaparHTML(paciente.apellido)}
                        </p>
                    </div>

                    <div>
                        <strong>Documento</strong>
                        <p>
                            ${escaparHTML(paciente.documento)}
                        </p>
                    </div>

                    <div>
                        <strong>Fecha de nacimiento</strong>
                        <p>
                            ${escaparHTML(paciente.fecha_nacimiento) || "No registrada"}
                        </p>
                    </div>

                    <div>
                        <strong>Sexo</strong>
                        <p>
                            ${escaparHTML(paciente.sexo) || "No registrado"}
                        </p>
                    </div>

                    <div>
                        <strong>Teléfono</strong>
                        <p>
                            ${escaparHTML(paciente.telefono) || "No registrado"}
                        </p>
                    </div>

                    <div>
                        <strong>Dirección</strong>
                        <p>
                            ${escaparHTML(paciente.direccion) || "No registrada"}
                        </p>
                    </div>

                    <div>
                        <strong>Contacto de emergencia</strong>
                        <p>
                            ${escaparHTML(paciente.contacto_emergencia) || "No registrado"}
                        </p>
                    </div>

                    <div>
                        <strong>Teléfono de emergencia</strong>
                        <p>
                            ${escaparHTML(paciente.telefono_emergencia) || "No registrado"}
                        </p>
                    </div>

                </div>

            </div>


            <!-- INFORMACIÓN CLÍNICA -->

            <div class="admin-history-section">

                <div class="admin-history-section-title">
                    <span>INFORMACIÓN CLÍNICA</span>
                    <h3>Antecedentes y alergias</h3>
                </div>

                <div class="admin-history-clinical">

                    <div>
                        <strong>Alergias</strong>
                        <p>
                            ${escaparHTML(paciente.alergias) || "No registradas"}
                        </p>
                    </div>

                    <div>
                        <strong>Antecedentes</strong>
                        <p>
                            ${escaparHTML(paciente.antecedentes) || "No registrados"}
                        </p>
                    </div>

                </div>

            </div>


            <!-- DIAGNÓSTICOS -->

            <div class="admin-history-section">

                <div class="admin-history-section-title">
                    <span>REGISTRO CLÍNICO</span>
                    <h3>Diagnósticos</h3>
                </div>

                ${
                    diagnosticos.length === 0
                    ? `
                        <div class="admin-history-empty">
                            No hay diagnósticos registrados.
                        </div>
                    `
                    : `
                        <div class="admin-history-records">

                            ${diagnosticos.map(d => `

                                <div class="admin-history-record">

                                    <div>
                                        <strong>Diagnóstico</strong>
                                        <p>
                                            ${escaparHTML(d.diagnostico)}
                                        </p>
                                    </div>

                                    <div>
                                        <strong>Fecha</strong>
                                        <p>
                                            ${escaparHTML(d.fecha)}
                                        </p>
                                    </div>

                                    <div class="admin-history-full">
                                        <strong>Observaciones</strong>
                                        <p>
                                            ${escaparHTML(d.observaciones) || "Sin observaciones"}
                                        </p>
                                    </div>

                                </div>

                            `).join("")}

                        </div>
                    `
                }

            </div>


            <!-- ÓRDENES -->

            <div class="admin-history-section">

                <div class="admin-history-section-title">
                    <span>REGISTRO CLÍNICO</span>
                    <h3>Órdenes</h3>
                </div>

                ${
                    ordenes.length === 0
                    ? `
                        <div class="admin-history-empty">
                            No hay órdenes registradas.
                        </div>
                    `
                    : `
                        <div class="admin-history-records">

                            ${ordenes.map(o => `

                                <div class="admin-history-record">

                                    <div>
                                        <strong>Tipo</strong>
                                        <p>
                                            ${escaparHTML(o.tipo)}
                                        </p>
                                    </div>

                                    <div>
                                        <strong>Estado</strong>
                                        <p>
                                            ${escaparHTML(o.estado)}
                                        </p>
                                    </div>

                                    <div>
                                        <strong>Fecha</strong>
                                        <p>
                                            ${escaparHTML(o.fecha)}
                                        </p>
                                    </div>

                                    <div class="admin-history-full">
                                        <strong>Descripción</strong>
                                        <p>
                                            ${escaparHTML(o.descripcion)}
                                        </p>
                                    </div>

                                </div>

                            `).join("")}

                        </div>
                    `
                }

            </div>

        </div>

    `;

    mostrarResultado(contenido);
}


// =========================================================
// RESUMEN DEL SISTEMA
// =========================================================

function mostrarResumen() {

    const resumen =
        medicareReportesData.resumen || {};


    const totalPacientes =
        resumen.pacientes || 0;


    const totalDiagnosticos =
        resumen.diagnosticos || 0;


    const totalOrdenes =
        resumen.ordenes || 0;


    const contenido = `

        <div class="admin-report-result-header">

            <div>

                <span>
                    ESTADÍSTICAS
                </span>

                <h2>
                    Resumen del sistema
                </h2>

                <p>
                    Información general registrada
                    actualmente en MediCare.
                </p>

            </div>


            <button
                type="button"
                class="admin-report-export"
                onclick="imprimirReporte()"
            >

                🖨️ Imprimir

            </button>

        </div>


        <div class="admin-report-summary">


            <!-- PACIENTES -->

            <div class="admin-summary-card">

                <div class="admin-summary-icon">
                    👥
                </div>

                <div>

                    <span>
                        Pacientes
                    </span>

                    <strong>
                        ${totalPacientes}
                    </strong>

                </div>

            </div>


            <!-- DIAGNÓSTICOS -->

            <div class="admin-summary-card">

                <div class="admin-summary-icon">
                    🩺
                </div>

                <div>

                    <span>
                        Diagnósticos
                    </span>

                    <strong>
                        ${totalDiagnosticos}
                    </strong>

                </div>

            </div>


            <!-- ÓRDENES -->

            <div class="admin-summary-card">

                <div class="admin-summary-icon">
                    📋
                </div>

                <div>

                    <span>
                        Órdenes
                    </span>

                    <strong>
                        ${totalOrdenes}
                    </strong>

                </div>

            </div>


        </div>

    `;


    mostrarResultado(contenido);

}


// =========================================================
// IMPRIMIR REPORTE
// =========================================================

function imprimirReporte() {

    window.print();

}