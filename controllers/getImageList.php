<?php
/**
 * Возвращаем список изображений
 * User: Bender
 * Date: 06.06.2015
 * Time: 18:37
 */

$app = \Slim\Slim::getInstance();

$message = array('status'=>'ok','data'=>array());

$redis = new \Redisent\Redis('redis://192.168.0.98:6379');
$redis->AUTH('jhw2bnUbln8HlEufM71k');
$redis->SELECT('4');


$res = $redis->HVALS( 'image:list' );

if (is_array($res)){
    $message['data'] = array_map(function($item){
        return json_decode($item,true);
    },$res);
} else {
    $message['status'] = 'error';
    $message['data'] = 'GET_DATA_ERROR';
}

$redis->QUIT();

echo json_encode($message);