<?php

namespace App\Http\Services\annotation;

use Attribute;

/**
 * アクションノードアノテーションクラス
 */
#[Attribute(Attribute::IS_REPEATABLE | Attribute::TARGET_METHOD| Attribute::TARGET_PROPERTY)]
final class NodeAnnotation
{

    /** ノードフィルター */
    const IGNORE_NODE = 'NODE';

    /**
     * @param string $title
     * @param bool $auth 権限が必要かどうか
     * @param string|array $ignore
     */
    public function __construct(public string $title = '', public bool $auth = true, public string|array $ignore = '')
    {
    }
}
