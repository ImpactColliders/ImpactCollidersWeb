<?php
require __DIR__.'/../../private/connection.php';
$body=json_decode(file_get_contents('php://input'),true);
$code=$body['code']??'';
if(!$code){http_response_code(400);echo json_encode(['ok'=>false,'error'=>'missing']);exit;}
$pdo->beginTransaction();
$stmt=$pdo->prepare('SELECT id,claimed_by FROM codes WHERE code=? FOR UPDATE');
$stmt->execute([$code]);
$row=$stmt->fetch();
if(!$row){$pdo->rollBack();echo json_encode(['ok'=>false,'error'=>'invalid']);exit;}
if($row['claimed_by']){$pdo->rollBack();echo json_encode(['ok'=>false,'error'=>'used']);exit;}
$uid=bin2hex(random_bytes(16));
$upd=$pdo->prepare('UPDATE codes SET claimed_by=?,claimed_at=NOW() WHERE id=?');
$upd->execute([$uid,$row['id']]);
$pdo->commit();
echo json_encode(['ok'=>true,'userId'=>$uid]);
