<?php
    $app->post('/login', function ($request, $response, $args) {

        $input = file_get_contents("php://input");
        $data = json_decode($input, true);

        $res = [];
    
        if($data["user"] == "admin" && $data["pass"] == "admin"){
            $res["user"] = $data["user"];
            $res["id"] = 99;
            $res["token"] = G::CrearToken($data);
        }else{
            $res["user"] = "Error";
            $res["id"] = -1;
            $res["token"] = null;
        }

        $payload = json_encode($res);
        
        $response->getBody()->write($payload);
        return $response->withHeader('Content-Type', 'application/json');
    });
?>