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

    const paciente =
        datos.paciente || {};


    const diagnosticos =
        datos.diagnosticos || [];


    const ordenes =
        datos.ordenes || [];


    let contenido = `

        <div class="admin-report-result-header">

            <div>

                <span>
                    HISTORIA CLÍNICA
                </span>

                <h2>

                    ${escaparHTML(
                        paciente.nombre
                    )}

                    ${escaparHTML(
                        paciente.apellido
                    )}

                </h2>


                <p>

                    Documento:

                    ${escaparHTML(
                        paciente.documento
                    )}

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


        <!-- ===============================================
             INFORMACIÓN PERSONAL
        ================================================ -->

        <div class="admin-report-section">

            <h3>
                Información personal
            </h3>


            <div class="admin-report-info-grid">


                <div>

                    <strong>
                        Nombre completo
                    </strong>

                    <span>

                        ${escaparHTML(
                            paciente.nombre
                        )}

                        ${escaparHTML(
                            paciente.apellido
                        )}

                    </span>

                </div>


                <div>

                    <strong>
                        Documento
                    </strong>

                    <span>

                        ${escaparHTML(
                            paciente.documento
                        )}

                    </span>

                </div>


                <div>

                    <strong>
                        Fecha de nacimiento
                    </strong>

                    <span>

                        ${escaparHTML(
                            paciente.fecha_nacimiento
                        ) || "No registrada"}

                    </span>

                </div>


                <div>

                    <strong>
                        Sexo
                    </strong>

                    <span>

                        ${escaparHTML(
                            paciente.sexo
                        ) || "No registrado"}

                    </span>

                </div>


                <div>

                    <strong>
                        Teléfono
                    </strong>

                    <span>

                        ${escaparHTML(
                            paciente.telefono
                        ) || "No registrado"}

                    </span>

                </div>


                <div>

                    <strong>
                        Dirección
                    </strong>

                    <span>

                        ${escaparHTML(
                            paciente.direccion
                        ) || "No registrada"}

                    </span>

                </div>


                <div>

                    <strong>
                        Contacto de emergencia
                    </strong>

                    <span>

                        ${escaparHTML(
                            paciente.contacto_emergencia
                        ) || "No registrado"}

                    </span>

                </div>


                <div>

                    <strong>
                        Teléfono de emergencia
                    </strong>

                    <span>

                        ${escaparHTML(
                            paciente.telefono_emergencia
                        ) || "No registrado"}

                    </span>

                </div>


            </div>

        </div>


        <!-- ===============================================
             INFORMACIÓN CLÍNICA
        ================================================ -->

        <div class="admin-report-section">

            <h3>
                Información clínica
            </h3>


            <div class="admin-report-clinical-grid">


                <div>

                    <strong>
                        Alergias
                    </strong>

                    <p>

                        ${escaparHTML(
                            paciente.alergias
                        ) || "No registradas"}

                    </p>

                </div>


                <div>

                    <strong>
                        Antecedentes
                    </strong>

                    <p>

                        ${escaparHTML(
                            paciente.antecedentes
                        ) || "No registrados"}

                    </p>

                </div>


            </div>

        </div>


        <!-- ===============================================
             DIAGNÓSTICOS
        ================================================ -->

        <div class="admin-report-section">

            <h3>
                Diagnósticos
            </h3>

    `;


    // -----------------------------------------------------
    // DIAGNÓSTICOS VACÍOS
    // -----------------------------------------------------

    if (diagnosticos.length === 0) {

        contenido += `

            <div class="admin-report-empty small">

                <p>
                    No existen diagnósticos registrados.
                </p>

            </div>

        `;

    }


    // -----------------------------------------------------
    // DIAGNÓSTICOS
    // -----------------------------------------------------

    else {

        contenido += `

            <div class="admin-report-records">

        `;


        diagnosticos.forEach(
            function (diagnostico) {

                contenido += `

                    <div
                        class="admin-report-record"
                    >

                        <div>

                            <strong>
                                Diagnóstico
                            </strong>

                            <span>

                                ${escaparHTML(
                                    diagnostico.diagnostico
                                )}

                            </span>

                        </div>


                        <div>

                            <strong>
                                Fecha
                            </strong>

                            <span>

                                ${escaparHTML(
                                    diagnostico.fecha
                                )}

                            </span>

                        </div>


                        <div>

                            <strong>
                                Observaciones
                            </strong>

                            <span>

                                ${escaparHTML(
                                    diagnostico.observaciones
                                ) || "Sin observaciones"}

                            </span>

                        </div>

                    </div>

                `;

            }
        );


        contenido += `

            </div>

        `;

    }


    contenido += `

        </div>


        <!-- ===============================================
             ÓRDENES
        ================================================ -->

        <div class="admin-report-section">

            <h3>
                Órdenes
            </h3>

    `;


    // -----------------------------------------------------
    // ÓRDENES VACÍAS
    // -----------------------------------------------------

    if (ordenes.length === 0) {

        contenido += `

            <div class="admin-report-empty small">

                <p>
                    No existen órdenes registradas.
                </p>

            </div>

        `;

    }


    // -----------------------------------------------------
    // ÓRDENES
    // -----------------------------------------------------

    else {

        contenido += `

            <div class="admin-report-records">

        `;


        ordenes.forEach(
            function (orden) {

                let claseEstado = "other";


                if (
                    orden.estado &&
                    orden.estado.toLowerCase() ===
                    "pendiente"
                ) {

                    claseEstado = "pending";

                }


                if (
                    orden.estado &&
                    (
                        orden.estado.toLowerCase() ===
                        "completada" ||

                        orden.estado.toLowerCase() ===
                        "completado"
                    )
                ) {

                    claseEstado = "completed";

                }


                contenido += `

                    <div
                        class="admin-report-record"
                    >


                        <div>

                            <strong>
                                Tipo
                            </strong>

                            <span>

                                ${escaparHTML(
                                    orden.tipo
                                )}

                            </span>

                        </div>


                        <div>

                            <strong>
                                Descripción
                            </strong>

                            <span>

                                ${escaparHTML(
                                    orden.descripcion
                                )}

                            </span>

                        </div>


                        <div>

                            <strong>
                                Fecha
                            </strong>

                            <span>

                                ${escaparHTML(
                                    orden.fecha
                                )}

                            </span>

                        </div>


                        <div>

                            <strong>
                                Estado
                            </strong>

                            <span
                                class="
                                    clinical-order-status
                                    ${claseEstado}
                                "
                            >

                                ${escaparHTML(
                                    orden.estado
                                )}

                            </span>

                        </div>


                    </div>

                `;

            }
        );


        contenido += `

            </div>

        `;

    }


    contenido += `

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