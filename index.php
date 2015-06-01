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

$app->get('/app',function(){
    echo 'foo';
});

$app->run();