<?php
/**
 * Удаление изображения
 * User: Bender
 * Date: 07.06.2015
 * Time: 22:19
 */
require __DIR__.'/../redisConfig.php';
use DB\Config\RedisConfig;

$app = \Slim\Slim::getInstance();

$query = $app->request()->get();

$message = array('status'=>'ok','data'=>array());

$redis = new \Redisent\Redis(RedisConfig::SRV);
$redis->AUTH(RedisConfig::AUTH);
$redis->SELECT('4');

if (isset($query['edit_key']) && isset($query['name']) && checkEditKey($query['edit_key'],$query['name']) ){
    $sizes = array(
        'full',
        '180x135',
        '320x240',
        '500x375',
        '640x480'
    );
    $f_dir = substr($query['name'],0,2);
    $s_dir = substr($query['name'],2,2);

    array_map(function ($size) use($query,$f_dir,$s_dir){
        $path = sprintf('%s/img/%s/%s/%s/%s.jpg',__DIR__.'/..',$size,$f_dir,$s_dir,$query['name']);
        if (file_exists($path)){
            @unlink($path);
        }
    },$sizes);

    $redis->HDEL('image:list',$query['edit_key']);
} else {
    $message['status'] = 'error';
    $message['data'] = 'QUERY_ERROR';
}

$redis->QUIT();
echo json_encode($message);

/**
 * Проверяем валидность ключа
 * @param $editKey
 * @param $name
 * @return bool
 */
function checkEditKey($editKey,$name){
    $redis = new \Redisent\Redis(RedisConfig::SRV);
    $redis->AUTH(RedisConfig::AUTH);
    $redis->SELECT('4');

    $image = $redis->HGET( 'image:list',$editKey);
    if ($image){
        $image = json_decode($image,true);
        if ($name === $image['name']){
            return true;
        } else {
            return false;
        }
    } else {
        return false;
    }
}