<?php
$host = 'localhost';
$port = '5432';
$usuario = 'postgres';
$clave = '123456789';
$basedatos = 'productos_db';
$dsn = "pgsql:host=$host;port=$port;dbname=$basedatos;";

try {
    $bd = new PDO($dsn, $usuario, $clave, [PDO::ATTR_ERRMODE=>PDO::ERRMODE_EXCEPTION]);
} catch (Exception $e) {
    echo 'Error de conexión: ' . $e->getMessage();
    exit;
}
