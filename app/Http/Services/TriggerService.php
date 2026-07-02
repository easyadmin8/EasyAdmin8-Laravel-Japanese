<?php

namespace App\Http\Services;

use Illuminate\Support\Facades\Cache;

class TriggerService
{

    /**
     * メニューキャッシュ更新
     * @param null $adminId
     * @return bool
     */
    public static function updateMenu($adminId = null): bool
    {
        if (empty($adminId)) {
            Cache::flush();
        } else {
            Cache::forget('initAdmin_' . $adminId);
        }
        return true;
    }

    /**
     * ノードキャッシュ更新
     * @param null $adminId
     * @return bool
     */
    public static function updateNode($adminId = null): bool
    {
        if (empty($adminId)) {
            Cache::flush();
        } else {
            Cache::forget('allAuthNode_' . $adminId);
        }
        return true;
    }

    /**
     * システム設定キャッシュ更新
     * @return bool
     */
    public static function updateSysConfig(): bool
    {
        Cache::flush();
        return true;
    }

}
