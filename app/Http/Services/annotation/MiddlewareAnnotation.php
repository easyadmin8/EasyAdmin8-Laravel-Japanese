<?php

namespace App\Http\Services\annotation;

use Attribute;

#[Attribute(Attribute::IS_REPEATABLE | Attribute::TARGET_METHOD)]
final class MiddlewareAnnotation
{
    /** ログフィルター */
    const IGNORE_LOG = 'LOG';

    /** ログイン不要 */
    const IGNORE_LOGIN = 'LOGIN';

    public function __construct(public string $type = '', public string|array $ignore = '')
    {
    }
}
