# New-Mat


<?php

if( !defined( 'DATALIFEENGINE' ) ) {
	header( "HTTP/1.1 403 Forbidden" );
	header ( 'Location: ../../' );
	die( "Hacking attempt!" );
}

define ("DBHOST", "localhost");

define ("DBNAME", "hesamho_DB");

define ("DBUSER", "hesamho_user");

define ("DBPASS", "hesamuser12345");

define ("PREFIX", "dle");

define ("USERPREFIX", "dle");

define ("COLLATE", "utf8mb4");

define('SECURE_AUTH_KEY', '~;:XevJ])>iH2d4R/a13VANp@~KS{(-tVd5J{C7kc0aM^*i:i.V8BgAg67|b5/Sh');

$db = new db;

?>