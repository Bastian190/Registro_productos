<?php
header('Content-Type: application/json');
require 'conexion_bd.php';
$bodega_id = isset($_GET['bodega_id']) ? intval($_GET['bodega_id']) : 0;
if ($bodega_id <= 0) {
  echo json_encode([]);
  exit;
}
$stmt = $bd->prepare("SELECT id, nombre FROM sucursales WHERE bodega_id = :bodega_id ORDER BY nombre");
$stmt->execute([':bodega_id'=>$bodega_id]);
$sucursales = $stmt->fetchAll(PDO::FETCH_ASSOC);
echo json_encode($sucursales);
?>
