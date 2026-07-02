<?php

return [
    'controller_namespace' => 'App\Http\Controllers\admin\\',

    // スーパー管理者ID
    'super_admin_id'       => 1,

    // 管理画面別名 デフォルト管理画面パス
    'admin_alias_name'     => config('easyadmin.ADMIN', env('EASYADMIN.ADMIN', 'admin')),

    // ログイン検証不要のコントローラー
    'no_login_controller'  => [
        'login',
    ],

    // ログイン検証不要のノード
    'no_login_node'        => [
        'login/index',
        'login/captcha',
        'login/out',
    ],

    // 権限検証不要のコントローラー
    'no_auth_controller'   => [
        'ajax',
        'login',
        'index',
    ],

    // 権限検証不要のノード
    'no_auth_node'         => [
        'login/index',
        'login/out',
    ],

    //アップロードタイプ
    'upload_types'         => [
        'local' => 'ローカルストレージ',
        'oss'   => 'Alibaba Cloud OSS',
        'cos'   => 'Tencent Cloud COS',
        'qnoss' => 'Qiniu Cloud'
    ],

    // デフォルトエディター
    'editor_types'         => [
        'ueditor'    => 'Baiduエディター（推奨しません）',
        'ckeditor'   => 'CKエディター',
        'wangEditor' => 'wangEditor（推奨）',
        'EasyMDE'    => 'EasyMDE（マークダウン）',
    ],
];
