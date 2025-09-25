<?php
header('Content-Type: application/json');
require 'conexion_bd.php';
$codigo = isset($_GET['codigo']) ? trim($_GET['codigo']) : '';
if ($codigo === '') {
  echo json_encode(['existe'=>false]);
  exit;
}
$stmt = $bd->prepare("SELECT COUNT(*) FROM productos WHERE codigo_producto = :codigo");
$stmt->execute([':codigo'=>$codigo]);
$existe = $stmt->fetchColumn() > 0;
echo json_encode(['existe'=>$existe]);
?>
