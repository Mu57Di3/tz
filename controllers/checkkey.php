<?php
/**
 * Проверка ключа
 * User: Bender
 * Date: 07.06.2015
 * Time: 23:37
 */


require __DIR__.'/../redisConfig.php';
use DB\Config\RedisConfig;

$app = \Slim\Slim::getInstance();

$query = $app->request()->get();

$message = array('status'=>'ok','data'=>array());

$redis = new \Redisent\Redis(RedisConfig::SRV);
$redis->AUTH(RedisConfig::AUTH);
$redis->SELECT('4');

if (isset($query['edit_key']) && isset($query['name'])){
    $image = $redis->HGET( 'image:list',$query['edit_key']);
    if ($image){
        $image = json_decode($image,true);
        if ($query['name'] !== $image['name']){
            $message['status'] = 'error';
            $message['data'] = 'WRONG_KEY';
        }
    } else {
        $message['status'] = 'error';
        $message['data'] = 'WRONG_KEY';
    }
} else {
    $message['status'] = 'error';
    $message['data'] = 'QUERY_ERROR';
}

$redis->QUIT();
echo json_encode($message);