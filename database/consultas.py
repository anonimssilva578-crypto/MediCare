from database.conexion import obtener_conexion


# =========================================================
# OBTENER PACIENTES
# =========================================================

def obtener_pacientes():

    conexion = obtener_conexion()
    cursor = conexion.cursor(dictionary=True)

    cursor.execute("""
        SELECT *
        FROM pacientes
        ORDER BY id_paciente DESC
    """)

    pacientes = cursor.fetchall()

    cursor.close()
    conexion.close()

    return pacientes


# =========================================================
# RESUMEN DEL DASHBOARD DEL AUXILIAR
# =========================================================

def obtener_resumen_admin():

    conexion = obtener_conexion()
    cursor = conexion.cursor(dictionary=True)

    # -----------------------------------------------------
    # TOTAL DE PACIENTES
    # -----------------------------------------------------

    cursor.execute("""
        SELECT COUNT(*) AS total
        FROM pacientes
    """)

    total_pacientes = cursor.fetchone()["total"]

    # -----------------------------------------------------
    # TOTAL DE DIAGNÓSTICOS
    # -----------------------------------------------------

    cursor.execute("""
        SELECT COUNT(*) AS total
        FROM diagnosticos
    """)

    total_diagnosticos = cursor.fetchone()["total"]

    # -----------------------------------------------------
    # TOTAL DE ÓRDENES
    # -----------------------------------------------------

    cursor.execute("""
        SELECT COUNT(*) AS total
        FROM ordenes
    """)

    total_ordenes = cursor.fetchone()["total"]

    cursor.close()
    conexion.close()

    return {
        "pacientes": total_pacientes,
        "diagnosticos": total_diagnosticos,
        "ordenes": total_ordenes
    }


# =========================================================
# OBTENER UN PACIENTE POR ID
# =========================================================

def obtener_paciente_por_id(id_paciente):

    conexion = obtener_conexion()
    cursor = conexion.cursor(dictionary=True)

    cursor.execute("""
        SELECT *
        FROM pacientes
        WHERE id_paciente = %s
    """, (id_paciente,))

    paciente = cursor.fetchone()

    cursor.close()
    conexion.close()

    return paciente


# =========================================================
# OBTENER HISTORIA CLÍNICA COMPLETA
# =========================================================

def obtener_historia_clinica(id_paciente):

    conexion = obtener_conexion()
    cursor = conexion.cursor(dictionary=True)

    # -----------------------------------------------------
    # INFORMACIÓN DEL PACIENTE
    # -----------------------------------------------------

    cursor.execute("""
        SELECT
            id_paciente,
            id_usuario,
            nombre,
            apellido,
            documento,
            DATE_FORMAT(
                fecha_nacimiento,
                '%Y-%m-%d'
            ) AS fecha_nacimiento,
            sexo,
            telefono,
            direccion,
            contacto_emergencia,
            telefono_emergencia,
            alergias,
            antecedentes
        FROM pacientes
        WHERE id_paciente = %s
    """, (id_paciente,))

    paciente = cursor.fetchone()

    # Si el paciente no existe
    if not paciente:

        cursor.close()
        conexion.close()

        return None

    # -----------------------------------------------------
    # DIAGNÓSTICOS
    # -----------------------------------------------------

    cursor.execute("""
        SELECT
            id_diagnostico,
            DATE_FORMAT(
                fecha,
                '%Y-%m-%d %H:%i'
            ) AS fecha,
            diagnostico,
            observaciones
        FROM diagnosticos
        WHERE id_paciente = %s
        ORDER BY fecha DESC
    """, (id_paciente,))

    diagnosticos = cursor.fetchall()

    # -----------------------------------------------------
    # ÓRDENES
    # -----------------------------------------------------

    cursor.execute("""
        SELECT
            id_orden,
            DATE_FORMAT(
                fecha,
                '%Y-%m-%d %H:%i'
            ) AS fecha,
            tipo,
            descripcion,
            estado
        FROM ordenes
        WHERE id_paciente = %s
        ORDER BY fecha DESC
    """, (id_paciente,))

    ordenes = cursor.fetchall()

    cursor.close()
    conexion.close()

    # -----------------------------------------------------
    # RETORNAR HISTORIA COMPLETA
    # -----------------------------------------------------

    return {
        "paciente": paciente,
        "diagnosticos": diagnosticos,
        "ordenes": ordenes
    }