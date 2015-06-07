<?php
/**
 * Загрузка и сохранение изображения.
 * User: Mu57Di3
 * Date: 04.06.2015
 * Time: 0:35
 */

require __DIR__.'/../redisConfig.php';
use DB\Config\RedisConfig;

$app = \Slim\Slim::getInstance();

$query = $app->request()->post();

$message = array('status'=>'ok','data'=>array());

if (isset($query['newimage'])){
    $image = str_replace('data:image/jpeg;base64,','',$query['newimage']);
    $image = str_replace(' ','+',$image);

    if (isset($query['name']) && isset($query['edit_key'])){
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
    }

    $img_key = isset($query['name']) ? $query['name'] : md5($image);

    $image = base64_decode($image);


    $f_dir = substr($img_key,0,2);
    $s_dir = substr($img_key,2,2);

    if (!file_exists(__DIR__.'/../img/full/'.$f_dir.'/'.$s_dir)){
        @mkdir(__DIR__.'/../img');
        @mkdir(__DIR__.'/../img/full');
        @mkdir(__DIR__.'/../img/full/'.$f_dir);
        @mkdir(__DIR__.'/../img/full/'.$f_dir.'/'.$s_dir);
    }

    if(file_put_contents(sprintf('%s/../img/full/%s/%s/%s.jpg',__DIR__,$f_dir,$s_dir,$img_key),$image)){
        $redis = new \Redisent\Redis(RedisConfig::SRV);
        $redis->AUTH(RedisConfig::AUTH);
        $redis->SELECT('4');

        $edit_key =  isset($query['edit_key']) ? $query['edit_key']  : sha1($img_key.'aQ98nL47EeYy6$w))67d3MlHp5OKNG');

        $data = array( 'name'=>$img_key,'ts'=>time() );

        $redis->HSET( 'image:list',$edit_key,json_encode( $data ) );
        $redis->QUIT();

        $data['edit_key'] = $edit_key;

        $message['data'] = $data;
    } else {
        $message['status'] = 'error';
        $message['data'] = 'ACCESS_DENIED';
    }
} else {
    $message['status'] = 'error';
    $message['data'] = 'INPUT_DATA_EMPTY';
}

echo json_encode($message);