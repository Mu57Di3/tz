<?php
/**
 * Загрузка и сохранение изображения.
 * User: Mu57Di3
 * Date: 04.06.2015
 * Time: 0:35
 */


$app = \Slim\Slim::getInstance();

$query = $app->request()->post();

$message = array('status'=>'ok','data'=>array('url'=>'1111111111'));

if (isset($query['newimage'])){
    $image = str_replace('data:image/png;base64,','',$query['newimage']);
    $image = str_replace(' ','+',$image);
    $image = base64_decode($image);

    if (!file_exists(__DIR__.'/../img/full')){
        mkdir(__DIR__.'/../img');
        mkdir(__DIR__.'/../img/full');
    }

    if(file_put_contents(__DIR__.'/../img/full/test.jpg',$image)){

    } else {
        $message['status'] = 'error';
        $message['data'] = 'ACCESS_DENIED';
    }
} else {
    $message['status'] = 'error';
    $message['data'] = 'INPUT_DATA_EMPTY';
}

echo json_encode($message);