<?php
header('Content-Type: application/json');
require 'conexion_bd.php';
$datos = json_decode(file_get_contents('php://input'), true);
$codigo = isset($datos['codigo']) ? trim($datos['codigo']) : '';
$nombre = isset($datos['nombre']) ? trim($datos['nombre']) : '';
$bodega_id = isset($datos['bodega']) ? intval($datos['bodega']) : 0;
$sucursal_id = isset($datos['sucursal']) ? intval($datos['sucursal']) : 0;
$moneda_id = isset($datos['moneda']) ? intval($datos['moneda']) : 0;
$precio = isset($datos['precio']) ? trim($datos['precio']) : '';
$materiales = isset($datos['materiales']) ? $datos['materiales'] : [];
$descripcion = isset($datos['descripcion']) ? trim($datos['descripcion']) : '';

if ($codigo === '' || $nombre === '' || $precio === '' || count($materiales) < 2 || $bodega_id<=0 || $sucursal_id<=0 || $moneda_id<=0 || strlen($descripcion)<10) {
  http_response_code(400);
  echo json_encode(['error'=>'validacion_fallida']);
  exit;
}

$regex_codigo = '/^(?=.*[A-Za-z])(?=.*[0-9])[A-Za-z0-9]{5,15}$/';
if (!preg_match($regex_codigo, $codigo)) {
  http_response_code(400);
  echo json_encode(['error'=>'formato_codigo']);
  exit;
}

$regex_precio = '/^\d+(\.\d{1,2})?$/';
if (!preg_match($regex_precio, $precio)) {
  http_response_code(400);
  echo json_encode(['error'=>'formato_precio']);
  exit;
}

$stmt = $bd->prepare("SELECT COUNT(*) FROM productos WHERE codigo_producto = :codigo");
$stmt->execute([':codigo'=>$codigo]);
if ($stmt->fetchColumn() > 0) {
  http_response_code(409);
  echo json_encode(['error'=>'codigo_existe']);
  exit;
}

$bd->beginTransaction();
$stmt = $bd->prepare("INSERT INTO productos (codigo_producto,nombre_producto,bodega_id,sucursal_id,moneda_id,precio,descripcion) VALUES (:codigo,:nombre,:bodega,:sucursal,:moneda,:precio,:descripcion) RETURNING id");
$stmt->execute([
  ':codigo'=>$codigo,
  ':nombre'=>$nombre,
  ':bodega'=>$bodega_id,
  ':sucursal'=>$sucursal_id,
  ':moneda'=>$moneda_id,
  ':precio'=>$precio,
  ':descripcion'=>$descripcion
]);
$id_producto = $stmt->fetchColumn();
$insertar = $bd->prepare("INSERT INTO producto_materiales (producto_id, material_id) VALUES (:producto_id, :material_id)");
foreach ($materiales as $mat) {
  $insertar->execute([':producto_id'=>$id_producto, ':material_id'=> intval($mat)]);
}
$bd->commit();
echo json_encode(['ok'=>true]);
?>
