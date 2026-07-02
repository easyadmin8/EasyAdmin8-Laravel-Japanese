<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\DB;

class BaseModel extends Model
{
    /**
     * ソフトデリート有効
     * 無効にする場合、この設定を削除可能
     */
    use SoftDeletes;

    /**
     * カスタムソフトデリートフィールド名
     * Laravelはデフォルトでdeleted_atフィールドをソフトデリートに使用
     * プロジェクトで別のフィールド名を使用する場合は、ここで変更可能
     * @var string
     */
    const DELETED_AT = 'delete_time';

    /**
     * カスタム保存タイムスタンプ形式、U は Unix タイムスタンプ (秒)
     * 日付形式が必要な場合は、この設定を削除可能
     * @var string
     */
    protected $dateFormat = 'U';

    /**
     * モデルに関連付けられたデータテーブル。
     *
     * @var string
     */
    protected $table = "";

    /**
     * モデルがタイムスタンプを自動管理するかどうか。
     *
     * @var bool
     */
    public $timestamps = false;

    protected $casts = [
        'create_time' => 'App\Casts\CarbonDate:Y-m-d H:i:s',
        'update_time' => 'App\Casts\CarbonDate:Y-m-d H:i:s',
        'delete_time' => 'App\Casts\CarbonDate:Y-m-d H:i:s',
    ];

    public function __construct(array $attributes = [])
    {
        parent::__construct($attributes);
        $calledClass = get_called_class();
        $className   = substr(strrchr($calledClass, '\\'), 1);
        $this->table = $this->getTableName($className);
    }

    /**
     * @param string $className
     * @return string
     */
    public function getTableName(string $className): string
    {
        return parse_name($className);
    }

    /**
     * @param array $data
     * @return bool
     */
    public function addAll(array $data = []): bool
    {
        return DB::table($this->getTable())->insert($data);
    }

}
