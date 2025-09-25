
<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
header('Content-Type: application/json');
require 'conexion_bd.php';
$consulta = $bd->query("SELECT id, nombre FROM bodegas ORDER BY nombre");
$bodegas = $consulta->fetchAll(PDO::FETCH_ASSOC);
echo json_encode($bodegas);
?>
