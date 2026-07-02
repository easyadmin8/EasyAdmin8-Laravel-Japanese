<?php

namespace App\Http\Controllers\admin\system;

use App\Http\Controllers\common\AdminController;
use App\Models\SystemQuick;
use App\Http\Services\annotation\NodeAnnotation;
use App\Http\Services\annotation\ControllerAnnotation;

#[ControllerAnnotation(title: 'クイックアクセス管理')]
class QuickController extends AdminController
{

    public function initialize()
    {
        parent::initialize();
        $this->model = new SystemQuick();
    }

}
