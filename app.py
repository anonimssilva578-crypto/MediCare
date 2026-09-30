from flask import (
    Flask,
    render_template,
    request,
    redirect,
    url_for,
    session,
    flash
)

from database.conexion import obtener_conexion

from database.consultas import (
    obtener_pacientes,
    obtener_resumen_admin,
    obtener_paciente_por_id,
    obtener_historia_clinica
)


# =========================================================
# CONFIGURACIÓN DE FLASK
# =========================================================

app = Flask(__name__)

app.secret_key = "medicare_clave_secreta_2026"


# =========================================================
# PÁGINA PRINCIPAL
# =========================================================

@app.route("/")
def inicio():
    return render_template("index.html")


# =========================================================
# PÁGINA NOSOTROS
# =========================================================

@app.route("/nosotros")
def nosotros():
    return render_template("nosotros.html")


# =========================================================
# LOGIN
# =========================================================

@app.route("/login", methods=["GET", "POST"])
def login():

    if request.method == "POST":

        usuario = request.form.get("usuario")
        password = request.form.get("password")

        if not usuario or not password:
            flash(
                "Debes ingresar usuario y contraseña.",
                "error"
            )

            return render_template("login.html")

        conexion = None
        cursor = None

        try:

            conexion = obtener_conexion()

            cursor = conexion.cursor(dictionary=True)

            cursor.execute(
                """
                SELECT
                    id_usuario,
                    nombre,
                    usuario,
                    password,
                    rol
                FROM usuarios
                WHERE usuario = %s
                """,
                (usuario,)
            )

            usuario_db = cursor.fetchone()

            if not usuario_db:

                flash(
                    "El usuario no existe.",
                    "error"
                )

                return render_template("login.html")

            if usuario_db["password"] != password:

                flash(
                    "La contraseña es incorrecta.",
                    "error"
                )

                return render_template("login.html")

            # -------------------------------------------------
            # GUARDAR DATOS DEL USUARIO EN LA SESIÓN
            # -------------------------------------------------

            session["id_usuario"] = usuario_db["id_usuario"]
            session["nombre"] = usuario_db["nombre"]
            session["usuario"] = usuario_db["usuario"]
            session["rol"] = usuario_db["rol"]

            # -------------------------------------------------
            # REDIRECCIÓN SEGÚN EL ROL
            # -------------------------------------------------

            if usuario_db["rol"] == "AUXILIAR":

                return redirect(
                    url_for("admin_dashboard")
                )

            elif usuario_db["rol"] == "PACIENTE":

                return redirect(
                    url_for("paciente_dashboard")
                )

            else:

                flash(
                    "El usuario tiene un rol no válido.",
                    "error"
                )

                session.clear()

                return render_template("login.html")

        except Exception as e:

            print(
                "ERROR EN LOGIN:",
                e
            )

            flash(
                "Ocurrió un error al iniciar sesión.",
                "error"
            )

            return render_template("login.html")

        finally:

            if cursor:
                cursor.close()

            if conexion:
                conexion.close()

    return render_template("login.html")


# =========================================================
# REGISTRO DE PACIENTES
# =========================================================

@app.route("/registro", methods=["GET", "POST"])
def registro():

    if request.method == "POST":

        nombre = request.form.get("nombre")
        apellido = request.form.get("apellido")
        documento = request.form.get("documento")
        fecha_nacimiento = request.form.get(
            "fecha_nacimiento"
        )
        sexo = request.form.get("sexo")
        telefono = request.form.get("telefono")
        direccion = request.form.get("direccion")
        contacto_emergencia = request.form.get(
            "contacto_emergencia"
        )
        telefono_emergencia = request.form.get(
            "telefono_emergencia"
        )
        alergias = request.form.get("alergias")
        antecedentes = request.form.get("antecedentes")

        usuario = request.form.get("usuario")
        password = request.form.get("password")
        confirmar_password = request.form.get(
            "confirmar_password"
        )

        # -------------------------------------------------
        # VALIDACIONES
        # -------------------------------------------------

        if not nombre or not apellido:
            flash(
                "Debes ingresar nombre y apellido.",
                "error"
            )

            return render_template("registro.html")

        if not documento:
            flash(
                "Debes ingresar el documento.",
                "error"
            )

            return render_template("registro.html")

        if not usuario:
            flash(
                "Debes ingresar un usuario.",
                "error"
            )

            return render_template("registro.html")

        if not password:
            flash(
                "Debes ingresar una contraseña.",
                "error"
            )

            return render_template("registro.html")

        if password != confirmar_password:

            flash(
                "Las contraseñas no coinciden.",
                "error"
            )

            return render_template("registro.html")

        conexion = None
        cursor = None

        try:

            conexion = obtener_conexion()

            cursor = conexion.cursor()

            # -------------------------------------------------
            # COMPROBAR SI EL USUARIO YA EXISTE
            # -------------------------------------------------

            cursor.execute(
                """
                SELECT id_usuario
                FROM usuarios
                WHERE usuario = %s
                """,
                (usuario,)
            )

            usuario_existente = cursor.fetchone()

            if usuario_existente:

                flash(
                    "El nombre de usuario ya está registrado.",
                    "error"
                )

                return render_template(
                    "registro.html"
                )

            # -------------------------------------------------
            # COMPROBAR DOCUMENTO
            # -------------------------------------------------

            cursor.execute(
                """
                SELECT id_paciente
                FROM pacientes
                WHERE documento = %s
                """,
                (documento,)
            )

            paciente_existente = cursor.fetchone()

            if paciente_existente:

                flash(
                    "El documento ya está registrado.",
                    "error"
                )

                return render_template(
                    "registro.html"
                )

            # -------------------------------------------------
            # CREAR USUARIO
            # -------------------------------------------------

            cursor.execute(
                """
                INSERT INTO usuarios
                (
                    nombre,
                    usuario,
                    password,
                    rol
                )
                VALUES
                (
                    %s,
                    %s,
                    %s,
                    'PACIENTE'
                )
                """,
                (
                    f"{nombre} {apellido}",
                    usuario,
                    password
                )
            )

            id_usuario = cursor.lastrowid

            # -------------------------------------------------
            # CREAR PACIENTE
            # -------------------------------------------------

            cursor.execute(
                """
                INSERT INTO pacientes
                (
                    id_usuario,
                    nombre,
                    apellido,
                    documento,
                    fecha_nacimiento,
                    sexo,
                    telefono,
                    direccion,
                    contacto_emergencia,
                    telefono_emergencia,
                    alergias,
                    antecedentes
                )
                VALUES
                (
                    %s,
                    %s,
                    %s,
                    %s,
                    %s,
                    %s,
                    %s,
                    %s,
                    %s,
                    %s,
                    %s,
                    %s
                )
                """,
                (
                    id_usuario,
                    nombre,
                    apellido,
                    documento,
                    fecha_nacimiento,
                    sexo,
                    telefono,
                    direccion,
                    contacto_emergencia,
                    telefono_emergencia,
                    alergias,
                    antecedentes
                )
            )

            conexion.commit()

            flash(
                "Registro exitoso. Ya puedes iniciar sesión.",
                "success"
            )

            return redirect(
                url_for("login")
            )

        except Exception as e:

            if conexion:
                conexion.rollback()

            print(
                "ERROR EN REGISTRO:",
                e
            )

            flash(
                "Ocurrió un error durante el registro.",
                "error"
            )

            return render_template(
                "registro.html"
            )

        finally:

            if cursor:
                cursor.close()

            if conexion:
                conexion.close()

    return render_template("registro.html")


# =========================================================
# PANEL DEL AUXILIAR
# =========================================================

@app.route("/admin")
def admin_dashboard():

    # -------------------------------------------------
    # COMPROBAR SESIÓN
    # -------------------------------------------------

    if "id_usuario" not in session:

        return redirect(
            url_for("login")
        )

    # -------------------------------------------------
    # COMPROBAR ROL
    # -------------------------------------------------

    if session.get("rol") != "AUXILIAR":

        return redirect(
            url_for("login")
        )

    # -------------------------------------------------
    # OBTENER RESUMEN
    # -------------------------------------------------

    resumen = obtener_resumen_admin()

    return render_template(
        "admin/admin_dashboard.html",
        nombre=session.get("nombre"),
        resumen=resumen
    )


# =========================================================
# LISTADO DE PACIENTES
# =========================================================

@app.route("/admin/pacientes")
def pacientes():

    if "id_usuario" not in session:

        return redirect(
            url_for("login")
        )

    if session.get("rol") != "AUXILIAR":

        return redirect(
            url_for("login")
        )

    pacientes_lista = obtener_pacientes()

    return render_template(
        "admin/pacientes.html",
        pacientes=pacientes_lista,
        nombre=session.get("nombre")
    )


# =========================================================
# DETALLE DE UN PACIENTE
# =========================================================

@app.route("/admin/pacientes/<int:id_paciente>")
def paciente_detalle(id_paciente):

    if "id_usuario" not in session:

        return redirect(
            url_for("login")
        )

    if session.get("rol") != "AUXILIAR":

        return redirect(
            url_for("login")
        )

    historia = obtener_historia_clinica(
        id_paciente
    )

    if not historia:

        flash(
            "Paciente no encontrado.",
            "error"
        )

        return redirect(
            url_for("pacientes")
        )

    return render_template(
        "admin/paciente_detalle.html",
        historia=historia,
        nombre=session.get("nombre")
    )


# =========================================================
# HISTORIA CLÍNICA DEL AUXILIAR
# =========================================================

@app.route("/admin/historia")
def historia_admin():

    if "id_usuario" not in session:

        return redirect(
            url_for("login")
        )

    if session.get("rol") != "AUXILIAR":

        return redirect(
            url_for("login")
        )

    pacientes_lista = obtener_pacientes()

    return render_template(
        "admin/historia.html",
        pacientes=pacientes_lista,
        nombre=session.get("nombre")
    )


# =========================================================
# REPORTES
# =========================================================

@app.route("/admin/reportes")
def reportes():

    if "id_usuario" not in session:

        return redirect(
            url_for("login")
        )

    if session.get("rol") != "AUXILIAR":

        return redirect(
            url_for("login")
        )

    pacientes_lista = obtener_pacientes()

    resumen = obtener_resumen_admin()

    return render_template(
        "admin/reportes.html",
        pacientes=pacientes_lista,
        resumen=resumen,
        nombre=session.get("nombre")
    )


# =========================================================
# API PARA CONSULTAR HISTORIA CLÍNICA
# =========================================================

@app.route(
    "/admin/reportes/historia/<int:id_paciente>"
)
def reporte_historia(id_paciente):

    if "id_usuario" not in session:

        return {
            "error": "No autorizado"
        }, 401

    if session.get("rol") != "AUXILIAR":

        return {
            "error": "No autorizado"
        }, 403

    historia = obtener_historia_clinica(
        id_paciente
    )

    if not historia:

        return {
            "error": "Paciente no encontrado"
        }, 404

    return historia

# =========================================================
# DASHBOARD DEL PACIENTE
# =========================================================

@app.route("/paciente")
def paciente_dashboard():

    # -------------------------------------------------
    # COMPROBAR SESIÓN
    # -------------------------------------------------

    if "id_usuario" not in session:

        return redirect(
            url_for("login")
        )

    # -------------------------------------------------
    # COMPROBAR ROL
    # -------------------------------------------------

    if session.get("rol") != "PACIENTE":

        return redirect(
            url_for("login")
        )

    conexion = None
    cursor = None

    try:

        conexion = obtener_conexion()

        cursor = conexion.cursor(
            dictionary=True
        )

        # -------------------------------------------------
        # BUSCAR PACIENTE RELACIONADO CON EL USUARIO
        # -------------------------------------------------

        cursor.execute(
            """
            SELECT *
            FROM pacientes
            WHERE id_usuario = %s
            """,
            (session["id_usuario"],)
        )

        paciente = cursor.fetchone()

        if not paciente:

            flash(
                "No se encontró información del paciente.",
                "error"
            )

            return render_template(
                "paciente/paciente_dashboard.html",
                paciente=None,
                diagnosticos=[],
                ordenes=[],
                nombre=session.get("nombre")
            )

        id_paciente = paciente["id_paciente"]

        # -------------------------------------------------
        # OBTENER DIAGNÓSTICOS
        # -------------------------------------------------

        cursor.execute(
            """
            SELECT
                id_diagnostico,
                fecha,
                diagnostico,
                observaciones
            FROM diagnosticos
            WHERE id_paciente = %s
            ORDER BY fecha DESC
            """,
            (id_paciente,)
        )

        diagnosticos = cursor.fetchall()

        # -------------------------------------------------
        # OBTENER ÓRDENES
        # -------------------------------------------------

        cursor.execute(
            """
            SELECT
                id_orden,
                fecha,
                tipo,
                descripcion,
                estado
            FROM ordenes
            WHERE id_paciente = %s
            ORDER BY fecha DESC
            """,
            (id_paciente,)
        )

        ordenes = cursor.fetchall()

        return render_template(
            "paciente/paciente_dashboard.html",
            paciente=paciente,
            diagnosticos=diagnosticos,
            ordenes=ordenes,
            nombre=session.get("nombre")
        )

    except Exception as e:

        print(
            "ERROR EN DASHBOARD PACIENTE:",
            e
        )

        flash(
            "Ocurrió un error al cargar la información.",
            "error"
        )

        return render_template(
            "paciente/paciente_dashboard.html",
            paciente=None,
            diagnosticos=[],
            ordenes=[],
            nombre=session.get("nombre")
        )

    finally:

        if cursor:
            cursor.close()

        if conexion:
            conexion.close()


# =========================================================
# HISTORIA CLÍNICA DEL PACIENTE
# =========================================================

@app.route("/paciente/historia")
def paciente_historia():

    if "id_usuario" not in session:

        return redirect(
            url_for("login")
        )

    if session.get("rol") != "PACIENTE":

        return redirect(
            url_for("login")
        )

    conexion = None
    cursor = None

    try:

        conexion = obtener_conexion()

        cursor = conexion.cursor(
            dictionary=True
        )

        # -------------------------------------------------
        # OBTENER PACIENTE
        # -------------------------------------------------

        cursor.execute(
            """
            SELECT *
            FROM pacientes
            WHERE id_usuario = %s
            """,
            (session["id_usuario"],)
        )

        paciente = cursor.fetchone()

        if not paciente:

            flash(
                "No se encontró la historia clínica.",
                "error"
            )

            return redirect(
                url_for("paciente_dashboard")
            )

        id_paciente = paciente["id_paciente"]

        # -------------------------------------------------
        # OBTENER DIAGNÓSTICOS
        # -------------------------------------------------

        cursor.execute(
            """
            SELECT
                id_diagnostico,
                fecha,
                diagnostico,
                observaciones
            FROM diagnosticos
            WHERE id_paciente = %s
            ORDER BY fecha DESC
            """,
            (id_paciente,)
        )

        diagnosticos = cursor.fetchall()

        # -------------------------------------------------
        # OBTENER ÓRDENES
        # -------------------------------------------------

        cursor.execute(
            """
            SELECT
                id_orden,
                fecha,
                tipo,
                descripcion,
                estado
            FROM ordenes
            WHERE id_paciente = %s
            ORDER BY fecha DESC
            """,
            (id_paciente,)
        )

        ordenes = cursor.fetchall()

        return render_template(
            "paciente/historia.html",
            paciente=paciente,
            diagnosticos=diagnosticos,
            ordenes=ordenes,
            nombre=session.get("nombre")
        )

    except Exception as e:

        print(
            "ERROR EN HISTORIA PACIENTE:",
            e
        )

        flash(
            "No se pudo cargar la historia clínica.",
            "error"
        )

        return redirect(
            url_for("paciente_dashboard")
        )

    finally:

        if cursor:
            cursor.close()

        if conexion:
            conexion.close()


# =========================================================
# DIAGNÓSTICOS DEL PACIENTE
# =========================================================

@app.route("/paciente/diagnosticos")
def diagnosticos_paciente():

    if "id_usuario" not in session:

        return redirect(
            url_for("login")
        )

    if session.get("rol") != "PACIENTE":

        return redirect(
            url_for("login")
        )

    conexion = None
    cursor = None

    try:

        conexion = obtener_conexion()

        cursor = conexion.cursor(
            dictionary=True
        )

        # -------------------------------------------------
        # OBTENER PACIENTE
        # -------------------------------------------------

        cursor.execute(
            """
            SELECT *
            FROM pacientes
            WHERE id_usuario = %s
            """,
            (session["id_usuario"],)
        )

        paciente = cursor.fetchone()

        if not paciente:

            flash(
                "No se encontró el paciente.",
                "error"
            )

            return redirect(
                url_for("paciente_dashboard")
            )

        # -------------------------------------------------
        # OBTENER DIAGNÓSTICOS
        # -------------------------------------------------

        cursor.execute(
            """
            SELECT
                id_diagnostico,
                fecha,
                diagnostico,
                observaciones
            FROM diagnosticos
            WHERE id_paciente = %s
            ORDER BY fecha DESC
            """,
            (paciente["id_paciente"],)
        )

        diagnosticos = cursor.fetchall()

        return render_template(
            "paciente/diagnosticos.html",
            paciente=paciente,
            diagnosticos=diagnosticos,
            nombre=session.get("nombre")
        )

    except Exception as e:

        print(
            "ERROR EN DIAGNÓSTICOS:",
            e
        )

        flash(
            "No se pudieron cargar los diagnósticos.",
            "error"
        )

        return redirect(
            url_for("paciente_dashboard")
        )

    finally:

        if cursor:
            cursor.close()

        if conexion:
            conexion.close()


# =========================================================
# ÓRDENES DEL PACIENTE
# =========================================================

@app.route("/paciente/ordenes")
def ordenes_paciente():

    if "id_usuario" not in session:

        return redirect(
            url_for("login")
        )

    if session.get("rol") != "PACIENTE":

        return redirect(
            url_for("login")
        )

    conexion = None
    cursor = None

    try:

        conexion = obtener_conexion()

        cursor = conexion.cursor(
            dictionary=True
        )

        # -------------------------------------------------
        # OBTENER PACIENTE
        # -------------------------------------------------

        cursor.execute(
            """
            SELECT *
            FROM pacientes
            WHERE id_usuario = %s
            """,
            (session["id_usuario"],)
        )

        paciente = cursor.fetchone()

        if not paciente:

            flash(
                "No se encontró el paciente.",
                "error"
            )

            return redirect(
                url_for("paciente_dashboard")
            )

        # -------------------------------------------------
        # OBTENER ÓRDENES
        # -------------------------------------------------

        cursor.execute(
            """
            SELECT
                id_orden,
                fecha,
                tipo,
                descripcion,
                estado
            FROM ordenes
            WHERE id_paciente = %s
            ORDER BY fecha DESC
            """,
            (paciente["id_paciente"],)
        )

        ordenes = cursor.fetchall()

        return render_template(
            "paciente/ordenes.html",
            paciente=paciente,
            ordenes=ordenes,
            nombre=session.get("nombre")
        )

    except Exception as e:

        print(
            "ERROR EN ÓRDENES:",
            e
        )

        flash(
            "No se pudieron cargar las órdenes.",
            "error"
        )

        return redirect(
            url_for("paciente_dashboard")
        )

    finally:

        if cursor:
            cursor.close()

        if conexion:
            conexion.close()


# =========================================================
# CERRAR SESIÓN
# =========================================================

@app.route("/logout")
def logout():

    session.clear()

    flash(
        "Has cerrado sesión correctamente.",
        "success"
    )

    return redirect(
        url_for("login")
    )


# =========================================================
# EJECUTAR APLICACIÓN
# =========================================================

if __name__ == "__main__":

    app.run(
        debug=True
    )