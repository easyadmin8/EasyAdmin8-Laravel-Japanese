<?php

namespace App\Http\Services\annotation;

use Attribute;

/**
 * コントローラーノードアノテーションクラス
 */
#[Attribute]
final class ControllerAnnotation
{
    /**
     * @param string $title
     * @param bool $auth 権限が必要かどうか
     * @param string|array $ignore
     */
    public function __construct(public string $title = '', public bool $auth = true, public string|array $ignore = '')
    {
    }

}
