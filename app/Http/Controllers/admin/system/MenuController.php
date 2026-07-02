<?php

namespace App\Http\Controllers\admin\system;

use App\Http\Controllers\common\AdminController;
use App\Http\Services\TriggerService;
use App\Models\SystemMenu;
use App\Models\SystemNode;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;
use Illuminate\View\View;
use App\Http\Services\annotation\NodeAnnotation;
use App\Http\Services\annotation\ControllerAnnotation;

#[ControllerAnnotation(title: 'メニュー管理')]
class MenuController extends AdminController
{
    public function initialize()
    {
        parent::initialize();
        $this->model = new SystemMenu();
    }

    #[NodeAnnotation(title: '追加', auth: true)]
    public function add(): View|JsonResponse
    {
        $id     = request()->input('id');
        $homeId = $this->model->where(['pid' => HOME_PID,])->value('id');
        if ($id == $homeId) {
            return $this->error('ホームにサブメニューは追加できません');
        }
        if (request()->ajax()) {
            $post      = request()->post();
            $rules     = [
                'pid'    => 'required',
                'title'  => 'required',
                'icon'   => 'required',
                'target' => 'required',
            ];
            $validator = Validator::make($post, $rules, [
                'pid'    => '親メニューは必須です',
                'title'  => 'メニュー名は必須です',
                'icon'   => 'メニューアイコンは必須です',
                'target' => 'target属性は必須です',
            ]);
            if ($validator->fails()) {
                return $this->error($validator->errors()->first());
            }
            $params = [];
            if (empty($post['href'])) $params['href'] = '';
            try {
                $save = insertFields($this->model, $params);
            }catch (\Exception $e) {
                return $this->error('保存失敗');
            }
            if (!empty($save)) {
                TriggerService::updateMenu();
                return $this->success('保存しました');
            }else {
                return $this->error('保存失敗');
            }
        }
        $pidMenuList = $this->model->getPidMenuList();
        $this->assign(compact('id', 'pidMenuList'));
        return $this->fetch();
    }

    #[NodeAnnotation(title: '編集', auth: true)]
    public function edit(): View|JsonResponse
    {
        $id  = request()->input('id');
        $row = $this->model->find($id);
        if (empty($row)) return $this->error('データが存在しません');
        if (request()->ajax()) {
            $post      = request()->post();
            $rules     = [
                'pid'   => 'required',
                'title' => 'required',
                'icon'  => 'required',
            ];
            $validator = Validator::make($post, $rules, [
                'pid'   => '親メニューは必須です',
                'title' => 'メニュー名は必須です',
                'icon'  => 'メニューアイコンは必須です',
            ]);
            if ($validator->fails()) {
                return $this->error($validator->errors()->first());
            }
            $params = [];
            if ($row->pid == HOME_PID) $params['pid'] = HOME_PID;
            if (empty($post['href'])) $params['href'] = '';
            try {
                $save = updateFields($this->model, $row, $params);
            }catch (\Exception $e) {
                return $this->error('保存失敗');
            }
            if (!empty($save)) {
                TriggerService::updateMenu();
                return $this->success('保存しました');
            }else {
                return $this->error('保存失敗');
            }
        }
        $pidMenuList = $this->model->getPidMenuList();
        $this->assign(compact('id', 'row', 'pidMenuList'));
        return $this->fetch();
    }

    #[NodeAnnotation(title: '属性変更', auth: true)]
    public function modify(): JsonResponse
    {
        $post      = request()->post();
        $rules     = [
            'id'    => 'required',
            'field' => 'required',
            'value' => 'required',
        ];
        $validator = Validator::make($post, $rules, [
            'id'    => 'IDは必須です',
            'field' => 'フィールドは必須です',
            'value' => '値は必須です',
        ]);
        if ($validator->fails()) {
            return $this->error($validator->errors()->first());
        }
        $row = $this->model->find($post['id']);
        if (empty($row)) {
            return $this->error('データが存在しません');
        }
        $homeId = $this->model->where(['pid' => HOME_PID])->value('id');
        if ($post['id'] == $homeId && $post['field'] == 'status') {
            return $this->error('ホームステータスは無効にできません');
        }
        try {
            foreach ($post as $key => $item) if ($key == 'field') $row->$item = $post['value'];
            $row->save();
        }catch (\Exception $e) {
            return $this->error($e->getMessage());
        }
        TriggerService::updateMenu();
        return $this->success('保存しました');
    }

    #[NodeAnnotation(title: '削除', auth: true)]
    public function delete(): JsonResponse
    {
        if (!request()->ajax()) return $this->error();
        $id = request()->input('id');
        if (!is_array($id)) $id = (array)$id;
        $row = $this->model->whereIn('id', $id)->get()->toArray();
        if (empty($row)) return $this->error('データが存在しません');
        try {
            $save = $this->model->whereIn('id', $id)->delete();
        }catch (\PDOException|\Exception $e) {
            return $this->error('削除失敗:' . $e->getMessage());
        }
        if ($save) {
            TriggerService::updateMenu();
            return $this->success('削除しました');
        }else {
            return $this->error('削除失敗');
        }
    }

    #[NodeAnnotation(title: 'メニュー追加ヒント', auth: true)]
    public function getMenuTips(): JsonResponse
    {
        $node = request()->input('keywords');
        $list = SystemNode::where('node', 'Like', "%{$node}%")->limit(10)->select('node', 'title')->get()->toArray();
        return json([
            'code'    => 0,
            'content' => $list,
            'type'    => 'success',
        ]);
    }
}
