<?php

namespace App\Http\Controllers\common;

use App\Http\JumpTrait;
use App\Http\Services\SystemLogService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\DB;
use Illuminate\View\View;

class InstallController extends Controller
{
    use JumpTrait;

    public function index(Request $request): View|JsonResponse
    {
        $isInstall   = false;
        $installPath = config_path() . DIRECTORY_SEPARATOR . 'install' . DIRECTORY_SEPARATOR;
        $errorInfo   = null;
        if (is_file($installPath . DIRECTORY_SEPARATOR . 'lock' . DIRECTORY_SEPARATOR . 'install.lock')) {
            $isInstall = true;
            $errorInfo = 'システムは既にインストールされています。再インストールするには /config/install/lock/install.lock を削除するか、/install ルートを削除してください';
        }elseif (version_compare(phpversion(), '8.3.0', '<')) {
            $errorInfo = 'PHPバージョンは8.3.0以上必要です';
        }elseif (!extension_loaded("PDO")) {
            $errorInfo = 'PDOが有効になっていないため、インストールできません';
        }
        if (!$request->ajax()) {
            $isInstall   = false;
            $db_type     = config('database.default', 'mysql');
            $envInfo     = [
                'DB_TYPE'    => $isInstall ? '' : $db_type,
                'DB_HOST'    => $isInstall ? '' : config("database.connections.{$db_type}.host", '127.0.0.1'),
                'DB_NAME'    => $isInstall ? '' : config("database.connections.{$db_type}.database", 'easyadmin8_laravel'),
                'DB_USER'    => $isInstall ? '' : config("database.connections.{$db_type}.username", 'root'),
                'DB_PASS'    => $isInstall ? '' : config("database.connections.{$db_type}.password", 'root'),
                'DB_PORT'    => $isInstall ? '' : config("database.connections.{$db_type}.port", 3306),
                'DB_PREFIX'  => $isInstall ? '' : config("database.connections.{$db_type}.prefix", 'ea8_'),
                'DB_CHARSET' => $isInstall ? '' : config("database.connections.{$db_type}.charset", 'utf8mb4'),
            ];
            $currentHost = ($_SERVER['SERVER_PORT'] == 443 ? 'https://' : 'http://') . $_SERVER['HTTP_HOST'] . '/';
            $result      = compact('errorInfo', 'currentHost', 'isInstall', 'envInfo');
            return view('install', $result);
        }
        if ($errorInfo) return $this->error($errorInfo);
        $envFile = base_path() . DIRECTORY_SEPARATOR . '.env';
        if (!is_file($envFile)) return $this->error('.env設定ファイルが存在しません');
        $post       = $request->post();
        $db_type    = $post['db_type'];
        $charset    = $post['db_charset'];
        $cover      = $post['cover'] == 1;
        $database   = $post['database'];
        $hostname   = $post['hostname'];
        $hostport   = $post['hostport'];
        $dbUsername = $post['db_username'];
        $dbPassword = $post['db_password'];
        $prefix     = $post['prefix'];
        $adminUrl   = $post['admin_url'];
        $username   = $post['username'];
        $password   = $post['password'];
        // パラメーター検証
        $validateError = null;
        // 特殊文字の有無を判定
        $check = preg_match('/[0-9a-zA-Z]+$/', $adminUrl, $matches);
        if (!$check) {
            $validateError = '管理画面URLに特殊文字は使用できません。英数字のみ使用可能です。';
            return $this->error($validateError);
        }

        if (strlen($adminUrl) < 2) {
            $validateError = '管理画面URLは2桁以上必要です';
        }elseif (strlen($password) < 5) {
            $validateError = '管理者パスワードは5桁以上必要です';
        }elseif (strlen($username) < 4) {
            $validateError = '管理者アカウントは4桁以上必要です';
        }
        if (!empty($validateError)) return $this->error($validateError);
        $config = [
            "driver"   => $db_type,
            "host"     => $hostname,
            "database" => $database,
            "port"     => $hostport,
            "username" => $dbUsername,
            "password" => $dbPassword,
            "prefix"   => $prefix,
            "charset"  => $charset,
        ];
        try {
            Config::set("database.connections.$db_type", $config);
        }catch (\Throwable $exception) {
            return $this->error($exception->getMessage());
        }
        // データベース接続確認
        $this->checkConnect($config);
        // データベース存在確認
        if (!$cover && $this->checkDatabase($database, $config)) return $this->error('データベースは既に存在します。上書きインストールするか、データベース名を変更してください');
        // データベース作成
        $this->createDatabase($database, $config);

        // SQL文などをインポート
        $this->install($username, $password, array_merge($config, ['database' => $database]), $adminUrl);
        SystemLogService::instance()->clearLogCache();
        return $this->success('システムのインストールが完了しました。ログインページにリダイレクト中');
    }

    protected function install($username, $password, $config): bool|string
    {
        $installPath = config_path() . DIRECTORY_SEPARATOR . 'install' . DIRECTORY_SEPARATOR;
        $driver      = $config['driver'];
        $sqlPath     = match ($driver) {
            'mysql' => file_get_contents($installPath . 'sql' . DIRECTORY_SEPARATOR . 'install.sql'),
            'pgsql' => file_get_contents($installPath . 'sql' . DIRECTORY_SEPARATOR . 'install_pgsql.sql'),
        };
        $sqlArray    = $this->parseSql($sqlPath, $config['prefix'], 'ea_');
        $dsn         = $this->pdoDsn($config, true);
        try {
            $pdo = new \PDO($dsn, $config['username'] ?? 'root', $config['password'] ?? '');
            foreach ($sqlArray as $sql) {
                $pdo->query($sql);
            }
            $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
            $tableName      = 'system_admin';
            $update         = [
                'username'    => $username,
                'head_img'    => '/static/admin/images/head.jpg',
                'password'    => $hashedPassword,
                'create_time' => time(),
                'update_time' => time()
            ];
            foreach ($update as $_k => $_up) {
                $pdo->query("UPDATE {$config['prefix']}{$tableName} SET {$_k} = '{$_up}' WHERE id = 1");
            }
            if ($driver == 'pgsql') {
                $pdo->exec('CREATE OR REPLACE FUNCTION pgsql_type(a_type varchar) RETURNS varchar AS $$ DECLARE v_type varchar; BEGIN IF a_type=\'int8\' THEN v_type:=\'bigint\'; ELSIF a_type=\'int4\' THEN v_type:=\'integer\'; ELSIF a_type=\'int2\' THEN v_type:=\'smallint\'; ELSIF a_type=\'bpchar\' THEN v_type:=\'char\'; ELSE v_type:=a_type; END IF; RETURN v_type; END; $$ LANGUAGE PLPGSQL; CREATE TYPE "public"."tablestruct" AS ("fields_key_name" varchar(100),"fields_name" VARCHAR(200),"fields_type" VARCHAR(20),"fields_length" BIGINT,"fields_not_null" VARCHAR(10),"fields_default" VARCHAR(500),"fields_comment" VARCHAR(1000)); CREATE OR REPLACE FUNCTION "public"."table_msg" (a_schema_name varchar, a_table_name varchar) RETURNS SETOF "public"."tablestruct" AS $$ DECLARE v_ret tablestruct; v_oid oid; v_sql varchar; v_rec RECORD; v_key varchar; BEGIN SELECT pg_class.oid INTO v_oid FROM pg_class INNER JOIN pg_namespace ON (pg_class.relnamespace = pg_namespace.oid AND lower(pg_namespace.nspname) = a_schema_name) WHERE pg_class.relname=a_table_name; IF NOT FOUND THEN RETURN; END IF; v_sql=\'SELECT pg_attribute.attname AS fields_name,pg_attribute.attnum AS fields_index,pgsql_type(pg_type.typname::varchar) AS fields_type,pg_attribute.atttypmod-4 as fields_length,CASE WHEN pg_attribute.attnotnull THEN \'\'not null\'\' ELSE \'\'\'\' END AS fields_not_null,pg_get_expr(pg_attrdef.adbin, pg_attrdef.adrelid) AS fields_default,pg_description.description AS fields_comment FROM pg_attribute INNER JOIN pg_class ON pg_attribute.attrelid = pg_class.oid INNER JOIN pg_type ON pg_attribute.atttypid = pg_type.oid LEFT OUTER JOIN pg_attrdef ON pg_attrdef.adrelid = pg_class.oid AND pg_attrdef.adnum = pg_attribute.attnum LEFT OUTER JOIN pg_description ON pg_description.objoid = pg_class.oid AND pg_description.objsubid = pg_attribute.attnum WHERE pg_attribute.attnum > 0 AND attisdropped <> \'\'t\'\' AND pg_class.oid = \' || v_oid || \' ORDER BY pg_attribute.attnum\'; FOR v_rec IN EXECUTE v_sql LOOP v_ret.fields_name=v_rec.fields_name; v_ret.fields_type=v_rec.fields_type; IF v_rec.fields_length > 0 THEN v_ret.fields_length:=v_rec.fields_length; ELSE v_ret.fields_length:=NULL; END IF; v_ret.fields_not_null=v_rec.fields_not_null; v_ret.fields_default=v_rec.fields_default; v_ret.fields_comment=v_rec.fields_comment; SELECT constraint_name INTO v_key FROM information_schema.key_column_usage WHERE table_schema=a_schema_name AND table_name=a_table_name AND column_name=v_rec.fields_name; IF FOUND THEN v_ret.fields_key_name=v_key; ELSE v_ret.fields_key_name=\'\'; END IF; RETURN NEXT v_ret; END LOOP; RETURN ; END; $$ LANGUAGE \'plpgsql\' VOLATILE CALLED ON NULL INPUT SECURITY INVOKER; COMMENT ON FUNCTION "public"."table_msg"(a_schema_name varchar, a_table_name varchar) IS \'获得表信息\'; CREATE OR REPLACE FUNCTION "public"."table_msg" (a_table_name varchar) RETURNS SETOF "public"."tablestruct" AS $$ DECLARE v_ret tablestruct; BEGIN FOR v_ret IN SELECT * FROM table_msg(\'public\',a_table_name) LOOP RETURN NEXT v_ret; END LOOP; RETURN; END; $$ LANGUAGE \'plpgsql\' VOLATILE CALLED ON NULL INPUT SECURITY INVOKER; COMMENT ON FUNCTION "public"."table_msg"(a_table_name varchar) IS \'获得表信息\';');
            }
            //  インストールファイルを処理
            !is_dir($installPath) && @mkdir($installPath);
            !is_dir($installPath . 'lock' . DIRECTORY_SEPARATOR) && @mkdir($installPath . 'lock' . DIRECTORY_SEPARATOR);
            @file_put_contents($installPath . 'lock' . DIRECTORY_SEPARATOR . 'install.lock', date('Y-m-d H:i:s'));
        }catch (\Exception $exception) {
            $data = [
                'code' => 0,
                'msg'  => "システムインストール失敗：" . $exception->getMessage(),
            ];
            die(json_encode($data, JSON_UNESCAPED_UNICODE | JSON_INVALID_UTF8_SUBSTITUTE));
        }
        return true;
    }

    protected function parseSql($sql = '', $to = '', $from = ''): array
    {
        list($pure_sql, $comment) = [[], false];
        $sql = explode("\n", trim(str_replace(["\r\n", "\r"], "\n", $sql)));
        foreach ($sql as $key => $line) {
            if ($line == '') {
                continue;
            }
            if (preg_match("/^(#|--)/", $line)) {
                continue;
            }
            if (preg_match("/^\/\*(.*?)\*\//", $line)) {
                continue;
            }
            if (str_starts_with($line, '/*')) {
                $comment = true;
                continue;
            }
            if (str_ends_with($line, '*/')) {
                $comment = false;
                continue;
            }
            if ($comment) {
                continue;
            }
            if ($from != '') {
                $line = str_replace('`' . $from, '`' . $to, $line);
                $line = str_replace('"' . $from, '"' . $to, $line);
            }
            if ($line == 'BEGIN;' || $line == 'COMMIT;') {
                continue;
            }
            $pure_sql[] = $line;
        }
        //$pure_sql = implode($pure_sql, "\n");
        $pure_sql = implode("\n", $pure_sql);
        return explode(";\n", $pure_sql);
    }

    protected function createDatabase($database, $config): bool
    {
        $dsn = $this->pdoDsn($config);
        try {
            $pdo        = new \PDO($dsn, $config['username'] ?? 'root', $config['password'] ?? '');
            $create_sql = match ($config['driver'] ?? 'mysql') {
                'mysql' => <<<SQL
CREATE DATABASE IF NOT EXISTS `{$database}` DEFAULT CHARACTER SET {$config['charset']} COLLATE=utf8mb4_general_ci;
SQL,
                'pgsql' => <<<SQL
CREATE DATABASE {$database} ENCODING {$config['charset']}
SQL,
            };
            $pdo->query($create_sql);
        }catch (\PDOException $exception) {
            return false;
        }
        return true;
    }

    protected function checkDatabase($database, $config): bool
    {
        try {
            switch ($config['driver'] ?? 'mysql') {
                case 'mysql':
                    $sql   = <<<SQL
SELECT * FROM information_schema.schemata WHERE schema_name='{$database}'
SQL;
                    $check = DB::select($sql);
                    break;
                case 'pgsql':
                    $sql = <<<SQL
SELECT 1 FROM pg_database WHERE datname='{$database}'
SQL;

                    $pdo    = new \PDO($this->pdoDsn($config), $config['username'] ?? 'root', $config['password'] ?? '');
                    $result = $pdo->query($sql);
                    $check  = $result->fetch();
                    break;
            }
        }catch (\Throwable $exception) {
            $check = false;
        }
        if (empty($check)) {
            return false;
        }else {
            return true;
        }
    }

    protected function checkConnect(array $config): bool
    {
        $dsn = $this->pdoDsn($config);
        try {
            $pdo = new \PDO($dsn, $config['username'] ?? 'root', $config['password'] ?? '');
            switch ($config['driver'] ?? 'mysql') {
                case 'mysql':
                    $res      = $pdo->query('select VERSION()');
                    $_version = $res->fetch()[0] ?? 0;
                    if (version_compare($_version, '5.7.0', '<')) {
                        $this->error('MySQL最低バージョン要件 5.7.x');
                    }
                    break;
                case 'pgsql':
                    $_version = $pdo->getAttribute(\PDO::ATTR_SERVER_VERSION);
                    if (version_compare($_version, '12.0', '<')) {
                        $this->error('pgsql最低バージョン要件 12.x');
                    }
                    break;
            }
        }catch (\Throwable $exception) {
            $data = [
                'code' => 0,
                'msg'  => $exception->getMessage()
            ];
            die(json_encode($data, JSON_UNESCAPED_UNICODE | JSON_INVALID_UTF8_SUBSTITUTE));
        }
        return true;
    }

    /**
     * @param array $config
     * @param bool $needDatabase
     * @return string
     */
    protected function pdoDsn(array $config, bool $needDatabase = false): string
    {
        $host     = $config['host'] ?? '127.0.0.1';
        $database = $config['database'] ?? '';
        $port     = $config['port'] ?? '3306';
        $charset  = $config['charset'] ?? 'utf8mb4';
        $driver   = $config['driver'] ?? 'mysql';
        $dsn      = "{$config['driver']}:host=$host;port=$port;";
        if ($needDatabase) $dsn = $dsn . "dbname=$database;";
        if ($driver == 'mysql') $dsn = $dsn . "charset=$charset;";
        return $dsn;
    }

}
