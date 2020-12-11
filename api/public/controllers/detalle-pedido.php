<?php
$app->get('/detalle-pedido', function ($request, $response, $args) {

    $db = SQLSRV::connect();
    $stmt = sqlsrv_query($db,"SELECT detaId
                                    ,detaPediId
                                    ,detaProdId
                                    ,detaCantidad
                                    ,detaPrecio
                                    ,detaBorrado
                                    ,CONVERT(VARCHAR, detaFechaAlta, 126) detaFechaAlta
                                    ,prodDescripcion
                                    FROM dbo.PedidoDetalle
                                    LEFT OUTER JOIN dbo.Producto ON detaProdId = prodId
                                    WHERE detaBorrado = 0");
    
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

$app->get('/detalle-pedido/{id}', function ($request, $response, $args) {

    $id = $args['id'];

    $db = SQLSRV::connect();
    $stmt = sqlsrv_query($db,"SELECT detaId
                                    ,detaPediId
                                    ,detaProdId
                                    ,detaCantidad
                                    ,detaPrecio
                                    ,detaBorrado
                                    ,CONVERT(VARCHAR, detaFechaAlta, 126) detaFechaAlta
                                    ,prodDescripcion
                                    FROM dbo.PedidoDetalle
                                    LEFT OUTER JOIN dbo.Producto ON detaProdId = prodId
                                    WHERE detaBorrado = 0 AND detaPediId = ?", [$id]);
    
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

$app->delete('/detalle-pedido/{id}', function ($request, $response, $args) {

    $id = $args['id'];

    $db = SQLSRV::connect();
    $stmt = sqlsrv_query($db,"UPDATE dbo.PedidoDetalle 
                                SET detaBorrado = 1
                                WHERE detaId = ?", [ $id ]);

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

$app->put('/detalle-pedido/{id}', function ($request, $response, $args) {

    $id = $args['id'];
    $data= json_decode($request->getParsedBody()['data'], true);

    $db = SQLSRV::connect();
    $stmt = sqlsrv_query($db,"UPDATE dbo.PedidoDetalle 
                                SET detaPediId = ?,
                                    detaProdId = ?,
                                    detaCantidad = ?,
                                    detaPrecio = ?,
                                    detaBorrado = ?
                                WHERE detaId = ?", [
                                    $data['detaPediId'],
                                    $data['detaProdId'],
                                    $data['detaCantidad'],
                                    $data['detaPrecio'],
                                    $data['detaBorrado'],
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

$app->post('/detalle-pedido', function ($request, $response, $args) {

    $data= json_decode($request->getParsedBody()['data'], true);

    $db = SQLSRV::connect();
    $stmt = sqlsrv_query($db,"INSERT INTO dbo.PedidoDetalle
                                (detaPediId
                                ,detaProdId
                                ,detaCantidad
                                ,detaPrecio
                                ,detaBorrado
                                ,detaFechaAlta) VALUES
                        (?, ?, ?, ?, 0, GETDATE());
                        
                            SELECT SCOPE_IDENTITY() detaId
                                ,CONVERT(VARCHAR, GETDATE(), 126) detaFechaAlta",
                        [
                            $data['detaPediId'],
                            $data['detaProdId'],
                            $data['detaCantidad'],
                            $data['detaPrecio']
                        ]);

    if($stmt === false) {
        SQLSRV::error(500, 'Error interno del servidor', $db);
    }

    $results= [];

    sqlsrv_fetch($stmt);
    sqlsrv_next_result($stmt); 
    $row = sqlsrv_fetch_array($stmt, SQLSRV_FETCH_ASSOC);
    
    $results= $data;
    $results["detaId"] = $row["detaId"];
    $results["detaFechaAlta"] = $row["detaFechaAlta"];

    sqlsrv_free_stmt($stmt);
    SQLSRV::close($db);

    $payload = json_encode($results);

    $response->getBody()->write($payload);
    return $response
              ->withHeader('Content-Type', 'application/json');

});

?>