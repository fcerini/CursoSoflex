<?php
$app->get('/pedido', function ($request, $response, $args) {

    $db = SQLSRV::connect();
    $stmt = sqlsrv_query($db,"SELECT pediId
                                    ,pediFecha
                                    ,pediClienId
                                    ,pediBorrado
                                    ,CONVERT(VARCHAR, pediFechaAlta, 126) pediFechaAlta
                                    ,clienNombre
                                    FROM dbo.Pedido
                                    LEFT OUTER JOIN dbo.Cliente ON pediClienId = clienId
                                    WHERE pediBorrado = 0");
    
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

$app->delete('/pedido/{id}', function ($request, $response, $args) {

    $id = $args['id'];

    $db = SQLSRV::connect();
    $stmt = sqlsrv_query($db,"UPDATE dbo.Pedido 
                                SET pediBorrado = 1
                                WHERE pediId = ?", [ $id ]);

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

$app->put('/pedido/{id}', function ($request, $response, $args) {

    $id = $args['id'];
    $data= json_decode($request->getParsedBody()['data'], true);

    $db = SQLSRV::connect();
    $stmt = sqlsrv_query($db,"UPDATE dbo.Pedido 
                                SET pediFecha = ?,
                                    pediClienId = ?,
                                    pediBorrado = ?
                                WHERE pediId = ?", [
                                    $data['pediFecha'],
                                    $data['pediClienId'],
                                    $data['pediBorrado'],
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

$app->post('/pedido', function ($request, $response, $args) {

    $data= json_decode($request->getParsedBody()['data'], true);

    $db = SQLSRV::connect();
    $stmt = sqlsrv_query($db,"INSERT INTO dbo.Pedido
                                (pediFecha
                                ,pediClienId
                                ,pediBorrado
                                ,pediFechaAlta) VALUES
                        (?, ?, 0, GETDATE());
                        
                            SELECT SCOPE_IDENTITY() pediId
                                ,CONVERT(VARCHAR, GETDATE(), 126) pediFechaAlta",
                        [
                            $data['pediFecha'],
                            $data['pediClienId']
                        ]);

    if($stmt === false) {
        SQLSRV::error(500, 'Error interno del servidor', $db);
    }

    $results= [];

    sqlsrv_fetch($stmt);
    sqlsrv_next_result($stmt); 
    $row = sqlsrv_fetch_array($stmt, SQLSRV_FETCH_ASSOC);
    
    $results= $data;
    $results["pediId"] = $row["pediId"];
    $results["pediFechaAlta"] = $row["pediFechaAlta"];

    sqlsrv_free_stmt($stmt);
    SQLSRV::close($db);

    $payload = json_encode($results);

    $response->getBody()->write($payload);
    return $response
              ->withHeader('Content-Type', 'application/json');

});

?>