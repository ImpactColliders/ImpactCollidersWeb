<?php

$pdo=new PDO('mysql:host=localhost;dbname=site_db;charset=utf8mb4','site_user','STRONG_PASSWORD',[PDO::ATTR_ERRMODE=>PDO::ERRMODE_EXCEPTION,PDO::ATTR_DEFAULT_FETCH_MODE=>PDO::FETCH_ASSOC]);

$dbhost = "localhost";
$dbuser = "root";
$dbpass = "";
$dbname = "ehletsplay";

if(!$con = mysqli_connect($dbhost,$dbuser,$dbpass,$dbname))
{

	die("failed to connect!");
}
