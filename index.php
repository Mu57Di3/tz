<?php
/**
 * Индексный файл проэкта
 * User: Mu57Di3
 * Date: 01.06.2015
 * Time: 21:44
 */

require 'vendor/autoload.php';

$app = new \Slim\Slim();

$app->get('/',function(){
    echo file_get_contents(__DIR__.'/templates/index.html');
});

$app->get('/:route',function ($route) use ($app){
    $path = sprintf('%s/controllers/%s.php',__DIR__,$route);
    if (file_exists($path)) {
        include $path;
    } else {
        $app->notFound();
    }
});

$app->post('/:route',function ($route) use ($app){
    $path = sprintf('%s/controllers/%s.php',__DIR__,$route);
    if (file_exists($path)) {
        include $path;
    } else {
        echo json_encode(array('status'=>'error','data'=>'CONTROLLER_NOT_EXIST'));
    }
});

$app->run();