<?php

namespace App\Http\Services;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

/**
 * システムログテーブル
 * Class SystemLogService
 * @package app\admin\service
 */
class SystemLogService
{

    /**
     * 現在のインスタンス
     */
    protected static ?SystemLogService $_instance = null;

    /**
     * テーブルプレフィックス
     * @var string
     */
    protected string $tablePrefix;

    /**
     * テーブルサフィックス
     * @var string
     */
    protected string $tableSuffix;

    /**
     * テーブル名
     * @var string
     */
    protected string $tableName;

    /**
     * コンストラクタ
     * SystemLogService constructor.
     */
    protected function __construct()
    {
        $dbType            = config('database.default');
        $this->tablePrefix = config("database.connections.{$dbType}.prefix");
        $this->tableSuffix = date('Ym');
        $this->tableName   = "system_log_{$this->tableSuffix}";
        return $this;
    }

    /**
     * インスタンスオブジェクト取得
     */
    public static function instance(): ?SystemLogService
    {
        if (!static::$_instance) static::$_instance = new self();
        return static::$_instance;
    }


    /**
     * データ保存
     * @param $data
     * @return bool
     */
    public function save($data): bool
    {
        DB::beginTransaction();
        $this->detectTable();
        try {
            DB::table($this->tableName)->insert($data);
            Db::commit();
        }catch (\Exception $e) {
            Db::rollback();
            return false;
        }
        return true;
    }

    /**
     * データテーブル確認
     * @return bool
     */
    public function detectTable(): bool
    {
        // 手動でログテーブルを削除する際はキャッシュをクリアしてください
        $key   = md5("systemLog{$this->tableName}Table");
        $isset = Cache::get($key);
        if ($isset) return true;
        $dbType = config('database.default');
        $check  = match ($dbType) {
            'pgsql' => DB::select("SELECT tablename FROM pg_tables WHERE tablename LIKE '{$this->tableName}'"),
            default => Schema::hasTable($this->tableName),
        };
        if (empty($check)) {
            $sql = $this->getCreateSql();
            DB::statement($sql);
        }
        Cache::put($key, !empty($check));
        return true;
    }

    public function clearLogCache(): true
    {
        $_key = "system_log_{$this->tableName}_table";
        Cache::delete($_key);
        return true;
    }

    /**
     * サフィックスに応じてテーブル作成SQLを取得
     * @return string
     */

    protected function getCreateSql(): string
    {
        $dbType = config('database.default');
        return match ($dbType) {
            'pgsql' => <<<EOT
CREATE TABLE IF NOT EXISTS {$this->tablePrefix}{$this->tableName} (
    id SERIAL PRIMARY KEY,
    admin_id INTEGER DEFAULT 0,
    url VARCHAR(1500) NOT NULL DEFAULT '',
    method VARCHAR(50) NOT NULL,
    title VARCHAR(100) DEFAULT '',
    content JSON NOT NULL,
    response JSON,
    ip VARCHAR(50) NOT NULL DEFAULT '',
    useragent VARCHAR(255) DEFAULT '',
    create_time INTEGER
);
EOT,
            default => <<<EOT
CREATE TABLE `{$this->tablePrefix}{$this->tableName}` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `admin_id` int(10) unsigned DEFAULT '0' COMMENT '管理者ID',
  `url` varchar(1500) NOT NULL DEFAULT '' COMMENT '操作ページ',
  `method` varchar(50) NOT NULL COMMENT 'リクエストメソッド',
  `title` varchar(100) DEFAULT '' COMMENT 'ログタイトル',
  `content` json NOT NULL COMMENT 'リクエストデータ',
  `response` json DEFAULT NULL COMMENT 'コールバックデータ',
  `ip` varchar(50) NOT NULL DEFAULT '' COMMENT 'IP',
  `useragent` varchar(255) DEFAULT '' COMMENT 'User-Agent',
  `create_time` int(10) DEFAULT NULL COMMENT '操作時間',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci ROW_FORMAT=COMPACT COMMENT='管理画面操作ログテーブル - {$this->tableSuffix}';
EOT,
        };
    }

}
