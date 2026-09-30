-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 30-09-2026 a las 02:50:07
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `medicare`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `atenciones`
--

CREATE TABLE `atenciones` (
  `id_atencion` int(11) NOT NULL,
  `id_paciente` int(11) NOT NULL,
  `fecha` datetime DEFAULT current_timestamp(),
  `motivo` text DEFAULT NULL,
  `presion_arterial` varchar(20) DEFAULT NULL,
  `temperatura` decimal(4,1) DEFAULT NULL,
  `frecuencia_cardiaca` int(11) DEFAULT NULL,
  `frecuencia_respiratoria` int(11) DEFAULT NULL,
  `observaciones` text DEFAULT NULL,
  `procedimiento` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `atenciones`
--

INSERT INTO `atenciones` (`id_atencion`, `id_paciente`, `fecha`, `motivo`, `presion_arterial`, `temperatura`, `frecuencia_cardiaca`, `frecuencia_respiratoria`, `observaciones`, `procedimiento`) VALUES
(1, 1, '2026-09-28 21:14:43', 'Control general', '120/80', 36.5, 75, 16, 'Paciente estable. Sin novedades durante la valoración.', 'Control de signos vitales.'),
(2, 2, '2026-09-28 21:14:43', 'Control de rutina', '125/82', 36.7, 78, 17, 'Paciente en condiciones estables.', 'Control de signos vitales.');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `diagnosticos`
--

CREATE TABLE `diagnosticos` (
  `id_diagnostico` int(11) NOT NULL,
  `id_paciente` int(11) NOT NULL,
  `fecha` datetime DEFAULT current_timestamp(),
  `diagnostico` text NOT NULL,
  `observaciones` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `diagnosticos`
--

INSERT INTO `diagnosticos` (`id_diagnostico`, `id_paciente`, `fecha`, `diagnostico`, `observaciones`) VALUES
(1, 1, '2026-09-29 19:49:06', 'Hipertensión arterial', 'Paciente con antecedente de hipertensión. Se recomienda seguimiento periódico.'),
(2, 2, '2026-09-29 19:49:06', 'Diabetes mellitus tipo 2', 'Paciente con antecedente de diabetes tipo 2. Requiere control periódico.');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `ordenes`
--

CREATE TABLE `ordenes` (
  `id_orden` int(11) NOT NULL,
  `id_paciente` int(11) NOT NULL,
  `fecha` datetime DEFAULT current_timestamp(),
  `tipo` varchar(100) NOT NULL,
  `descripcion` text NOT NULL,
  `estado` varchar(30) NOT NULL DEFAULT 'Pendiente'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `ordenes`
--

INSERT INTO `ordenes` (`id_orden`, `id_paciente`, `fecha`, `tipo`, `descripcion`, `estado`) VALUES
(1, 1, '2026-09-29 19:49:06', 'Control', 'Realizar control de presión arterial periódicamente.', 'Pendiente'),
(2, 2, '2026-09-29 19:49:06', 'Laboratorio', 'Realizar control de glucemia según indicación.', 'Pendiente');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pacientes`
--

CREATE TABLE `pacientes` (
  `id_paciente` int(11) NOT NULL,
  `id_usuario` int(11) DEFAULT NULL,
  `nombre` varchar(100) NOT NULL,
  `apellido` varchar(100) NOT NULL,
  `documento` varchar(30) NOT NULL,
  `fecha_nacimiento` date NOT NULL,
  `sexo` varchar(20) NOT NULL,
  `telefono` varchar(30) DEFAULT NULL,
  `direccion` varchar(150) DEFAULT NULL,
  `contacto_emergencia` varchar(100) DEFAULT NULL,
  `telefono_emergencia` varchar(30) DEFAULT NULL,
  `alergias` text DEFAULT NULL,
  `antecedentes` text DEFAULT NULL,
  `fecha_registro` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `pacientes`
--

INSERT INTO `pacientes` (`id_paciente`, `id_usuario`, `nombre`, `apellido`, `documento`, `fecha_nacimiento`, `sexo`, `telefono`, `direccion`, `contacto_emergencia`, `telefono_emergencia`, `alergias`, `antecedentes`, `fecha_registro`) VALUES
(1, 2, 'Juan', 'Pérez', '1001001001', '1981-05-12', 'Masculino', '3001234567', 'Calle 10 # 20-30', 'Carlos Pérez', '3101234567', 'Ninguna conocida', 'Hipertensión', '2026-09-29 02:14:14'),
(2, 3, 'María', 'Gómez', '1001001002', '1964-08-20', 'Femenino', '3019876543', 'Carrera 15 # 40-25', 'Laura Gómez', '3159876543', 'Penicilina', 'Diabetes tipo 2', '2026-09-29 02:14:14');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id_usuario` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `usuario` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `rol` varchar(20) NOT NULL DEFAULT 'PACIENTE'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id_usuario`, `nombre`, `usuario`, `password`, `rol`) VALUES
(1, 'Auxiliar de Enfermería', 'admin', '123456', 'AUXILIAR'),
(2, 'Juan Pérez', 'juan', '123456', 'PACIENTE'),
(3, 'María Gómez', 'maria', '123456', 'PACIENTE');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `atenciones`
--
ALTER TABLE `atenciones`
  ADD PRIMARY KEY (`id_atencion`),
  ADD KEY `id_paciente` (`id_paciente`);

--
-- Indices de la tabla `diagnosticos`
--
ALTER TABLE `diagnosticos`
  ADD PRIMARY KEY (`id_diagnostico`),
  ADD KEY `id_paciente` (`id_paciente`);

--
-- Indices de la tabla `ordenes`
--
ALTER TABLE `ordenes`
  ADD PRIMARY KEY (`id_orden`),
  ADD KEY `id_paciente` (`id_paciente`);

--
-- Indices de la tabla `pacientes`
--
ALTER TABLE `pacientes`
  ADD PRIMARY KEY (`id_paciente`),
  ADD UNIQUE KEY `documento` (`documento`),
  ADD UNIQUE KEY `unique_id_usuario` (`id_usuario`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id_usuario`),
  ADD UNIQUE KEY `usuario` (`usuario`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `atenciones`
--
ALTER TABLE `atenciones`
  MODIFY `id_atencion` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `diagnosticos`
--
ALTER TABLE `diagnosticos`
  MODIFY `id_diagnostico` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `ordenes`
--
ALTER TABLE `ordenes`
  MODIFY `id_orden` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `pacientes`
--
ALTER TABLE `pacientes`
  MODIFY `id_paciente` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id_usuario` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `atenciones`
--
ALTER TABLE `atenciones`
  ADD CONSTRAINT `atenciones_ibfk_1` FOREIGN KEY (`id_paciente`) REFERENCES `pacientes` (`id_paciente`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `diagnosticos`
--
ALTER TABLE `diagnosticos`
  ADD CONSTRAINT `diagnosticos_ibfk_1` FOREIGN KEY (`id_paciente`) REFERENCES `pacientes` (`id_paciente`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `ordenes`
--
ALTER TABLE `ordenes`
  ADD CONSTRAINT `ordenes_ibfk_1` FOREIGN KEY (`id_paciente`) REFERENCES `pacientes` (`id_paciente`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `pacientes`
--
ALTER TABLE `pacientes`
  ADD CONSTRAINT `pacientes_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`) ON DELETE SET NULL ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
