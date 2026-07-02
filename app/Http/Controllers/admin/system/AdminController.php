<?php

namespace App\Http\Controllers\admin\system;

use App\Http\Controllers\common\AdminController as Controller;
use App\Http\Services\annotation\NodeAnnotation;
use App\Http\Services\annotation\ControllerAnnotation;
use App\Http\Services\TriggerService;
use App\Models\SystemAdmin;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;
use Illuminate\View\View;

#[ControllerAnnotation(title: '管理者管理')]
class AdminController extends Controller
{
    public function initialize()
    {
        parent::initialize();
        $this->model = new SystemAdmin();
        $auth_list   = $this->model->getAuthList();
        $this->assign(compact('auth_list'));
    }

    #[NodeAnnotation(title: '追加', auth: true)]
    public function add(): View|JsonResponse
    {
        if (request()->ajax()) {
            $post               = request()->post();
            $authIds            = request()->post('auth_ids', []);
            $params['auth_ids'] = implode(',', array_keys($authIds));
            if (empty($post['password'])) $post['password'] = '123456';
            $params['password'] = password_hash($post['password'], PASSWORD_DEFAULT);
            try {
                $save = insertFields($this->model, $params);
            }catch (\Exception $e) {
                return $this->error('保存失敗:' . $e->getMessage());
            }
            return $save ? $this->success('保存しました') : $this->error('保存失敗');
        }
        return $this->fetch();
    }

    #[NodeAnnotation(title: '編集', auth: true)]
    public function edit(): View|JsonResponse
    {
        $id  = request()->input('id');
        $row = $this->model->find($id);
        if (empty($row)) return $this->error('データが存在しません');
        if (request()->ajax()) {
            $post               = request()->post();
            $authIds            = request()->post('auth_ids', []);
            $params['auth_ids'] = implode(',', array_keys($authIds));
            if (isset($row['password'])) unset($row['password']);
            try {
                $save = updateFields($this->model, $row, $params);
                TriggerService::updateMenu(session('admin.id'));
            }catch (\Exception $e) {
                return $this->error('保存失敗:' . $e->getMessage());
            }
            return $save ? $this->success('保存しました') : $this->error('保存失敗');
        }
        $this->assign(compact('row'));
        return $this->fetch();
    }

    #[NodeAnnotation(title: 'パスワード変更', auth: true)]
    public function password(): View|JsonResponse
    {
        $id  = request()->input('id');
        $row = $this->model->find($id);
        if (empty($row)) return $this->error('データが存在しません');
        if (request()->ajax()) {
            $post      = request()->post();
            $rules     = [
                'password'       => 'required',
                'password_again' => 'required',
            ];
            $validator = Validator::make($post, $rules, [
                'password'       => 'パスワードは必須、または形式が正しくありません',
                'password_again' => '確認パスワードは必須、または形式が正しくありません',
            ]);
            if ($validator->fails()) {
                return $this->error($validator->errors()->first());
            }
            if ($post['password'] != $post['password_again']) {
                return $this->error('パスワードが一致しません');
            }
            try {
                $save = $this->model->where('id', $id)->update(['password' => password_hash($post['password'], PASSWORD_DEFAULT)]);
            }catch (\Exception $e) {
                return $this->error('保存失敗');
            }
            return $save ? $this->success('保存しました') : $this->error('保存失敗');
        }
        $this->assign(compact('row'));
        return $this->fetch();
    }
}
