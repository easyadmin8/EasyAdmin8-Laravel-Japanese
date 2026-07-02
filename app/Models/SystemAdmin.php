<?php

namespace App\Models;

class SystemAdmin extends BaseModel
{
    public array $notes = [
        'login_type' => [
            1 => 'パスワードログイン',
            2 => 'パスワード + Google認証コードログイン'
        ],
    ];

    public function getAuthIdsAttribute($value): array
    {
        if (!$value) return [];
        return explode(',', $value);
    }

    public function getAuthList(): array
    {
        $list = SystemAuth::where('status', 1)->select(['id', 'title'])->get()->toArray();
        return collect($list)->pluck('title', 'id')->toArray();
    }
}
