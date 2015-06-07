<?php
/**
 * Индексный файл проэкта
 * User: Mu57Di3
 * Date: 01.06.2015
 * Time: 21:44
 *
 * Для правильной работы кода надо добавить в корень файл redisConfig.php с следующим содержанием
 *
 *   namespace DB\Config;
 *   class RedisConfig
 *   {
 *      const SRV = 'redis://192.168.0.98:6379'; // mysql4-a.letitbit.net
 *
 *      const AUTH = 'jhw2bnUbln8HlEufM71k';
 *   }
 *
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