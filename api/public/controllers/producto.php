<?php
$app->get('/producto', function ($request, $response, $args) {

    $db = SQLSRV::connect();
    $stmt = sqlsrv_query($db,"SELECT prodId
                                    ,prodDescripcion
                                    ,prodPrecio
                                    ,prodBorrado
                                    ,CONVERT(VARCHAR, prodFechaAlta, 126) prodFechaAlta
                                    FROM dbo.Producto
                                    WHERE prodBorrado = 0");
    
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

$app->delete('/producto/{id}', function ($request, $response, $args) {

    $id = $args['id'];

    $db = SQLSRV::connect();
    $stmt = sqlsrv_query($db,"UPDATE dbo.Producto 
                                SET prodBorrado = 1
                                WHERE prodId = ?", [ $id ]);

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

$app->put('/producto/{id}', function ($request, $response, $args) {

    $id = $args['id'];
    $data= json_decode($request->getParsedBody()['data'], true);

    $db = SQLSRV::connect();
    $stmt = sqlsrv_query($db,"UPDATE dbo.Producto 
                                SET prodDescripcion = ?,
                                    prodPrecio = ?,
                                    prodBorrado = ?
                                WHERE prodId = ?", [
                                    $data['prodDescripcion'],
                                    $data['prodPrecio'],
                                    $data['prodBorrado'],
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

$app->post('/producto', function ($request, $response, $args) {

    $data= json_decode($request->getParsedBody()['data'], true);

    $db = SQLSRV::connect();
    $stmt = sqlsrv_query($db,"INSERT INTO dbo.Producto
                                (prodDescripcion
                                ,prodPrecio
                                ,prodBorrado
                                ,prodFechaAlta) VALUES
                        (?, ?, 0, GETDATE());
                        
                            SELECT SCOPE_IDENTITY() prodId
                                ,CONVERT(VARCHAR, GETDATE(), 126) prodFechaAlta",
                        [
                            $data['prodDescripcion'],
                            $data['prodPrecio']
                        ]);

    if($stmt === false) {
        SQLSRV::error(500, 'Error interno del servidor', $db);
    }

    $results= [];

    sqlsrv_fetch($stmt);
    sqlsrv_next_result($stmt); 
    $row = sqlsrv_fetch_array($stmt, SQLSRV_FETCH_ASSOC);
    
    $results= $data;
    $results["prodId"] = $row["prodId"];
    $results["prodFechaAlta"] = $row["prodFechaAlta"];

    sqlsrv_free_stmt($stmt);
    SQLSRV::close($db);

    $payload = json_encode($results);

    $response->getBody()->write($payload);
    return $response
              ->withHeader('Content-Type', 'application/json');

});

?>