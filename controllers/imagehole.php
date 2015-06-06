<?php
/**
 * Загрузка и сохранение изображения.
 * User: Mu57Di3
 * Date: 04.06.2015
 * Time: 0:35
 */

$app = \Slim\Slim::getInstance();

$query = $app->request()->post();

$message = array('status'=>'ok','data'=>array());

if (isset($query['newimage'])){
    $image = str_replace('data:image/jpeg;base64,','',$query['newimage']);
    $image = str_replace(' ','+',$image);

    $img_key = md5($image);

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
        $redis = new \Redisent\Redis('redis://192.168.0.98:6379');
        $redis->AUTH('jhw2bnUbln8HlEufM71k');
        $redis->SELECT('4');

        $edit_key = sha1($img_key.'aQ98nL47EeYy6$w))67d3MlHp5OKNG');

        $data = array( 'name'=>$img_key,'ts'=>time() );

        $redis->HSET( 'image:list',$edit_key,json_encode( $data ) );
        $redis->QUIT();

        $data['url'] = 'http://tz.mu57di3.org#edit='.$edit_key;

        /*$ch = curl_init();
        curl_setopt_array($ch, array(
            CURLOPT_RETURNTRANSFER  => true,
            CURLOPT_HEADER          => 0,
            CURLOPT_VERBOSE         => 0,
            CURLOPT_URL             => 'http://must.red/s?link='.urlencode($data['url'])
        ));
        $result = curl_exec($ch);
        curl_close($ch);

        $data['url_sh'] =  'http://must.red/s?link='.urlencode($data['url']);*/

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