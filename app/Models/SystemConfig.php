<?php

namespace App\Models;

class SystemConfig extends BaseModel
{

    /**
     * ソフトデリートのグローバルスコープ適用を阻止（一部モデルではソフトデリート不要のため）
     * @return void
     */
    public static function bootSoftDeletes() {}

}
