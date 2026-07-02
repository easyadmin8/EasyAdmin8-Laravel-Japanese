<?php

namespace App\Http;

use App\Http\Services\tool\CommonTool;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Validator;
use Illuminate\View\View;
use App\Http\Services\annotation\NodeAnnotation;
use App\Http\Services\annotation\ControllerAnnotation;

/**
 * 管理画面CURD再利用
 * Trait Curd
 * @package app\admin\traits
 */
trait Curd
{

    #[NodeAnnotation(title: '一覧', auth: true)]
    public function index(): View|JsonResponse
    {
        if (!request()->ajax()) return $this->fetch();
        if (request()->input('selectFields')) {
            return $this->selectList();
        }
        list($page, $limit, $where) = $this->buildTableParams();
        $count = $this->model->where($where)->count();
        $list  = $this->model->where($where)->orderBy($this->order, $this->orderDirection)->paginate($limit)->items();
        $data  = [
            'code'  => 0,
            'msg'   => '',
            'count' => $count,
            'data'  => $list,
        ];
        return json($data);
    }

    #[NodeAnnotation(title: '追加', auth: true)]
    public function add(): View|JsonResponse
    {
        if (request()->ajax()) {
            try {
                $save = insertFields($this->model);
            } catch (\Exception $e) {
                    return $this->error('保存失敗:' . $e->getMessage());
            }
            return $save ? $this->success('保存しました') : $this->error('保存失敗');
        }
        return $this->fetch();
    }

    #[NodeAnnotation(title: '編集', auth: true)]
    public function edit(): View|JsonResponse
    {
        $id  = (int)request()->input('id');
        $row = $this->model->find($id);
        if (empty($row)) return $this->error('データが存在しません');
        if (request()->ajax()) {
            try {
                $save = updateFields($this->model, $row);
            } catch (\PDOException|\Exception $e) {
                    return $this->error('保存失敗:' . $e->getMessage());
            }
            return $save ? $this->success('保存しました') : $this->error('保存失敗');
        }
        $this->assign(compact('row'));
        return $this->fetch();
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
        } catch (\PDOException|\Exception $e) {
            return $this->error('削除に失敗しました:' . $e->getMessage());
        }
            return $save ? $this->success('削除しました') : $this->error('削除に失敗しました');
    }

    #[NodeAnnotation(title: 'エクスポート', auth: true)]
    public function export(): View|bool
    {
        if (config('easyadmin.IS_DEMO', false)) {
            return $this->error('デモ環境では操作できません');
        }
        list($page, $limit, $where) = $this->buildTableParams();
        $tableName = $this->model->getTable();
        $tableName = CommonTool::humpToLine(lcfirst($tableName));
        $prefix    = config('database.connections.mysql.prefix');
        $dbList    = DB::select("show full columns from {$prefix}{$tableName}");
        $header    = [];
        foreach ($dbList as $vo) {
            $comment = !empty($vo->Comment) ? $vo->Comment : $vo->Field;
            if (!in_array($vo->Field, $this->noExportFields)) {
                $header[] = [$comment, $vo->Field];
            }
        }
        $list = $this->model->where($where)->limit(100000)->orderBy($this->order, $this->orderDirection)->get();
        if (empty($list)) return $this->error('データがありません');
        $list     = $list->toArray();
        $fileName = time();
        try {
            exportExcel($header, $list, $fileName);
        } catch (\Throwable $e) {
            return $this->error($e->getMessage());
        }
        return $this->success('エクスポートしました');
    }

    #[NodeAnnotation(title: '属性変更', auth: true)]
    public function modify(): JsonResponse
    {
        if (!request()->ajax()) return $this->error();
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
        try {
            foreach ($post as $key => $item) if ($key == 'field') $row->$item = $post['value'];
            $row->save();
        } catch (\PDOException|\Exception $e) {
            return $this->error("操作失敗:" . $e->getMessage());
        }
        return $this->success('保存しました');
    }

    #[NodeAnnotation(title: 'ゴミ箱', auth: true)]
    public function recycle(): View|JsonResponse
    {
        if (!request()->ajax()) {
            return $this->fetch();
        }
        $id   = request()->input('id', []);
        $type = request()->input('type');
        if (!is_array($id)) $id = (array)$id;
        $deleteTimeField = $this->model->getDeletedAtColumn(); // ソフトデリートフィールドを取得
        $defaultErrorMsg = 'ModelにソフトデリートdeleteTime対応フィールドが設定されていないか、データテーブルに該当フィールドが存在しません';
        if (!$deleteTimeField) return $this->success($defaultErrorMsg);
        switch ($type) {
            case 'restore':
                $update = [$deleteTimeField => null,];
                if (Schema::hasColumn($this->model->getTable(), 'update_time')) {
                    $update['update_time'] = time();
                }
                $this->model->onlyTrashed()->whereIn('id', $id)->update($update);
                return $this->success('success');
                break;
            case 'delete':
                $this->model->whereIn('id', $id)->forceDelete();
                return $this->success('success');
                break;
            default:
                list($page, $limit, $where) = $this->buildTableParams();
                try {
                    $count = $this->model->onlyTrashed()->where($where)->count();
                    $list  = $this->model->onlyTrashed()->where($where)->orderBy($this->order, $this->orderDirection)->paginate($limit)->items();
                    $data  = [
                        'code'  => 0,
                        'msg'   => '',
                        'count' => $count,
                        'data'  => $list,
                    ];
                } catch (\PDOException|\Exception $e) {
                    $error = $e->getMessage();
                    $error .= '<br>' . $defaultErrorMsg;
                    $data  = [
                        'code'  => -1,
                        'msg'   => $error,
                        'count' => 0,
                        'data'  => [],
                    ];
                }
                return json($data);

        }
    }


}
