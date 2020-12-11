<?php

defined ( 'PROVINCIA' ) ? null : define ( 'PROVINCIA', 1);


$ambiente = "dev";

if($ambiente == "dev"){
    defined ('DB_HOST') ? null : define('DB_HOST','192.168.1.5\sisepdev');
    defined ('DB_DATABASE') ? null : define('DB_DATABASE', "Curso");
    defined ('DB_USERNAME') ? null : define('DB_USERNAME', "sa");
    defined ('DB_PASSWORD') ? null : define('DB_PASSWORD', "Digital23");
  
    defined ( 'TOKEN_KEY' ) ? null : define ( 'TOKEN_KEY', '#SoflexasAG#ASX#TS!232323#' );
    defined ( 'REMOTE_STORAGE' ) ? null : define ( 'REMOTE_STORAGE', 'http://192.168.1.17/sisep_same/apps/administrador_archivos/api/index.php/' );
    // defined ( 'REMOTE_STORAGE' ) ? null : define ( 'REMOTE_STORAGE', 'http://localhost:8080/administrador_archivos_api/index.php/' );
} 
else if ($ambiente == "test")
{
    
}
else if ($ambiente == "prod")
{

}

?>