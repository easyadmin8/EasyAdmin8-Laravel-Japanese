<?php

namespace App\Http\Services;

use App\Http\Services\annotation\NodeAnnotation;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Str;

/**
 * 権限検証サービス
 * Class AuthService
 * @package app\common\service
 */
class AuthService
{

    /**
     * ユーザーID
     * @var int
     */
    protected int $adminId = 0;

    /**
     * デフォルト設定
     * @var array
     */
    protected array $config = [
        'auth_on'          => true,              // 権限スイッチ
        'system_admin'     => 'system_admin',    // ユーザーテーブル
        'system_auth'      => 'system_auth',     // 権限テーブル
        'system_node'      => 'system_node',     // ノードテーブル
        'system_auth_node' => 'system_auth_node',// 権限-ノードテーブル
    ];

    /**
     * 管理者情報
     */
    protected array $adminInfo;

    /**
     * 全ノード情報
     * @var array
     */
    protected array $nodeList;

    /**
     * 管理者の全認可ノード
     * @var array
     */
    protected array $adminNode;

    /***
     * コンストラクタ
     * AuthService constructor.
     * @param null $adminId
     */
    public function __construct($adminId = null)
    {
        $this->adminId = (int)$adminId;
        $this->adminInfo = $this->getAdminInfo();
        $this->nodeList  = $this->getNodeList();
        $this->adminNode = $this->getAdminNode();
        return $this;
    }

    /**
     * 権限チェック
     * @param null $node
     * @return bool
     */
    public function checkNode($node = null): bool
    {
        // スーパー管理者かどうか判定
        if ($this->adminId == SUPER_ADMIN_ID) {
            return true;
        }
        // 権限検証スイッチを判定
        if ($this->config['auth_on'] == false) {
            return true;
        }
        // 現在のノードを取得する必要があるかどうか
        if (empty($node)) {
            $node = $this->getCurrentNode();
        }else {
            $node = $this->parseNodeStr($node);
        }
        // ノード制御に追加されているかどうか、キャッシュ情報を優先取得
        if (!isset($this->nodeList[$node])) {
            return false;
        }
        $nodeInfo = get_object_vars($this->nodeList[$node]);
        if ($nodeInfo['is_auth'] == 0) {
            return true;
        }
        // ユーザー検証、キャッシュ情報を優先取得
        if (empty($this->adminInfo) || $this->adminInfo['status'] != 1 || empty($this->adminInfo['auth_ids'])) {
            return false;
        }
        // 該当ノードへのアクセスが許可されているかどうか
        if (isset($this->adminNode[$node])) {
            return true;
        }
        if ($this->checkNodeAnnotationAttrAuth($node)) return true;
        return false;
    }

    protected function checkNodeAnnotationAttrAuth(string $node): bool
    {
        $bool = false;
        try {
            $currentAdminAction        = currentAdminAction();
            $currentAdminActionExplode = explode('@', $currentAdminAction);
            $nodeExplode               = explode('/', $node);
            $action                    = end($nodeExplode);
            $reflectionClass           = new \ReflectionMethod($currentAdminActionExplode[0], $action);
            $attributes                = $reflectionClass->getAttributes(NodeAnnotation::class);
            foreach ($attributes as $attribute) {
                $annotation = $attribute->newInstance();
                $bool       = $annotation->auth === false;
            }
        }catch (\Throwable) {
        }
        return $bool;
    }

    /**
     * 現在のノード取得
     * @return string
     */
    public function getCurrentNode(): string
    {
        $parameters = request()->route()->parameters ?? [];
        return ($parameters['secondary'] ?? '') . '/' . ($parameters['controller'] ?? '') . '/' . ($parameters['action'] ?? '');
    }

    /**
     * 現在の管理者の全ノード取得
     * @return array
     */
    public function getAdminNode(): array
    {
        $nodeList  = [];
        $adminInfo = DB::table($this->config['system_admin'])
            ->where([
                'id'     => $this->adminId,
                'status' => 1,
            ])->first();
        $adminInfo = get_object_vars($adminInfo);
        if (!empty($adminInfo) && !empty($adminInfo['auth_ids'])) {

            $nodeIds  = DB::table($this->config['system_auth_node'])
                ->whereIn('auth_id', explode(',', $adminInfo['auth_ids']))
                ->select('node_id')->get()->map(function($value) {
                    return (array)$value;
                })->toArray();
            $nodeList = DB::table($this->config['system_node'])
                ->whereIn('id', $nodeIds)->get()->keyBy('node')->map(function($value) {
                    return (array)$value;
                })->toArray();
        }
        return $nodeList;
    }

    public function getNodeList(): array
    {
        return DB::table($this->config['system_node'])->select('id', 'node', 'title', 'type', 'is_auth')->get()->keyBy('node')->toArray();
    }

    public function getAdminInfo()
    {
        $result = DB::table($this->config['system_admin'])
            ->where('id', $this->adminId)
            ->first();
        return get_object_vars($result);
    }

    /**
     * キャメルケース→スネークケース変換ルール
     * @param string $node
     * @return string
     */
    public function parseNodeStr(string $node): string
    {
        $array = explode('/', $node);
        foreach ($array as $key => $val) {
            if ($key == 0) {
                $val = explode('.', $val);
                foreach ($val as &$vo) {
                    $vo = Str::snake(lcfirst($vo));
                }
                $val         = implode('.', $val);
                $array[$key] = $val;
            }
        }
        $node = implode('/', $array);
        $node = Str::camel($node);
        return $node;
    }

}
