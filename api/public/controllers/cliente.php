<?php
$app->get('/cliente', function ($request, $response, $args) {

    $db = SQLSRV::connect();
    $stmt = sqlsrv_query($db,"SELECT clienId
                                    ,clienNombre
                                    ,clienDireccion
                                    ,clienBorrado
                                    ,CONVERT(VARCHAR, clienFechaAlta, 126) clienFechaAlta
                                    FROM dbo.Cliente
                                    WHERE clienBorrado = 0");
    
    if($stmt === false) {
        SQLSRV::error(500, 'Error interno del servidor', $db);
    }

    $results = array();
    while ($row = sqlsrv_fetch_array($stmt, SQLSRV_FETCH_ASSOC)) {
        $results[] = $row;
    }

    sqlsrv_free_stmt($stmt);
    SQLSRV::close($db);

    $payload = json_encode($results);

    $response->getBody()->write($payload);
    return $response
              ->withHeader('Content-Type', 'application/json');
});

$app->delete('/cliente/{id}', function ($request, $response, $args) {

    $id = $args['id'];

    $db = SQLSRV::connect();
    $stmt = sqlsrv_query($db,"UPDATE dbo.Cliente 
                                SET clienBorrado = 1
                                WHERE clienId = ?", [ $id ]);

    if($stmt === false) {
        SQLSRV::error(500, 'Error interno del servidor', $db);
    }

    $results = array();
    while ($row = sqlsrv_fetch_array($stmt, SQLSRV_FETCH_ASSOC)) {
        $results[] = $row;
    }

    sqlsrv_free_stmt($stmt);
    SQLSRV::close($db);

    $payload = json_encode($results);

    $response->getBody()->write($payload);
    return $response
            ->withHeader('Content-Type', 'application/json');
});

$app->put('/cliente/{id}', function ($request, $response, $args) {

    $id = $args['id'];
    $data= json_decode($request->getParsedBody()['data'], true);

    $db = SQLSRV::connect();
    $stmt = sqlsrv_query($db,"UPDATE dbo.Cliente 
                                SET clienNombre = ?,
                                    clienDireccion = ?,
                                    clienBorrado = ?
                                WHERE clienId = ?", [
                                    $data['clienNombre'],
                                    $data['clienDireccion'],
                                    $data['clienBorrado'],
                                    $id ]); 

    if($stmt === false) {
        SQLSRV::error(500, 'Error interno del servidor', $db);
    }

    $results= [];

    $row = sqlsrv_fetch_array($stmt, SQLSRV_FETCH_ASSOC);
    if (isset($row)){
        $results= $data;
    }

    sqlsrv_free_stmt($stmt);
    SQLSRV::close($db);

    $payload = json_encode($results);

    $response->getBody()->write($payload);
    return $response
              ->withHeader('Content-Type', 'application/json');

});

$app->post('/cliente', function ($request, $response, $args) {

    $data= json_decode($request->getParsedBody()['data'], true);

    $db = SQLSRV::connect();
    $stmt = sqlsrv_query($db,"INSERT INTO dbo.Cliente
                                (clienNombre
                                ,clienDireccion
                                ,clienBorrado
                                ,clienFechaAlta) VALUES
                        (?, ?, 0, GETDATE());
                        
                            SELECT SCOPE_IDENTITY() clienId
                                ,CONVERT(VARCHAR, GETDATE(), 126) clienFechaAlta",
                        [
                            $data['clienNombre'],
                            $data['clienDireccion']
                        ]);

    if($stmt === false) {
        SQLSRV::error(500, 'Error interno del servidor', $db);
    }

    $results= [];

    sqlsrv_fetch($stmt);
    sqlsrv_next_result($stmt); 
    $row = sqlsrv_fetch_array($stmt, SQLSRV_FETCH_ASSOC);
    
    $results= $data;
    $results["clienId"] = $row["clienId"];
    $results["clienFechaAlta"] = $row["clienFechaAlta"];

    sqlsrv_free_stmt($stmt);
    SQLSRV::close($db);

    $payload = json_encode($results);

    $response->getBody()->write($payload);
    return $response
              ->withHeader('Content-Type', 'application/json');

});

?>