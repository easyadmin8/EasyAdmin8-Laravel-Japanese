<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\common\AdminController;
use App\Models\SystemAdmin;
use App\Models\SystemQuick;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Js;
use Illuminate\View\View;

class IndexController extends AdminController
{
    public function index(): View
    {
        return $this->fetch();
    }

    /**
     * 管理画面ホーム
     * @return View
     */
    public function welcome(): View
    {
        $laravelVersion = app()::VERSION;

        $dbType = config('database.default');
        Db::query('SELECT 1');
        $pdo            = DB::getPdo();
        $sqlVersion     = $pdo->getAttribute(\PDO::ATTR_SERVER_VERSION);
        $sqlVersion     = $dbType . "（{$sqlVersion}）";
        $phpVersion     = phpversion();
        $jitStatus      = function_exists('opcache_get_status') ? (opcache_get_status()['jit']['on'] ?? false) : false;
        $branch         = json_decode(file_get_contents(base_path() . '/composer.json'))->branch ?? 'main';
        $configIsCached = file_exists(base_path() . '/bootstrap/cache/config.php');
        $versions       = compact('laravelVersion', 'sqlVersion', 'phpVersion', 'jitStatus', 'branch', 'configIsCached');
        $quick_list     = SystemQuick::where('status', 1)->select('id', 'title', 'icon', 'href')->orderByDesc('sort')->limit(50)->get()->toArray();
        $quicks         = array_chunk($quick_list, 8);
        return $this->fetch('', compact('quicks', 'versions'));
    }

    /**
     * 個人情報の変更
     * @return View|JsonResponse
     */
    public function editAdmin(): View|JsonResponse
    {
        $id    = session('admin.id');
        $model = new SystemAdmin();
        $row   = $model->find($id);
        if (empty($row)) return $this->error('ユーザー情報が存在しません');
        if (request()->ajax()) {
            if ($this->isDemo) return $this->error('デモ環境では変更できません');
            try {
                $login_type = request()->post('login_type', 1);
                if ($login_type == 2) {
                    $ga_secret = (new SystemAdmin())->where('id', $id)->value('ga_secret');
                    if (empty($ga_secret)) return $this->error('先にGoogle認証をバインドしてください');
                }
                $save = updateFields($model, $row);
            }catch (\PDOException $e) {
                return $this->error('保存失敗:' . $e->getMessage());
            }
            return $save ? $this->success('保存しました') : $this->error('保存失敗');
        }
        $notes = (new SystemAdmin())->notes;
        $this->assign(compact('row', 'notes'));
        return $this->fetch();
    }

    public function editPassword(): View|JsonResponse
    {
        $id    = session('admin.id');
        $model = new SystemAdmin();
        $row   = $model->find($id);
        if (empty($row)) return $this->error('ユーザー情報が存在しません');
        if (request()->ajax()) {
            $post = request()->post();
            if ($this->isDemo) return $this->error('デモ環境では変更できません');
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
            $newPwd = password_hash($post['password'], PASSWORD_DEFAULT);
            if ($newPwd == $row->password) return $this->error('新しいパスワードは古いパスワードと同じにできません');
            try {
                $save = $model->where('id', $id)->update(['password' => $newPwd]);
            }catch (\Exception $e) {
                return $this->error('保存失敗');
            }
            if ($save) {
                return $this->success('保存しました');
            }else {
                return $this->error('保存失敗');
            }
        }
        $this->assign(compact('row'));
        return $this->fetch();
    }

    /**
     * Google認証コードの設定
     * @param Request $request
     */
    public function set2fa(Request $request): JsonResponse|View
    {
        $id  = session('admin.id');
        $row = (new SystemAdmin())->select(['id', 'ga_secret', 'login_type'])->find($id);
        if (!$row) return $this->error('ユーザー情報が存在しません');
        // You can see: https://gitee.com/wolf-code/authenticator
        $ga = new \Wolfcode\Authenticator\google\PHPGangstaGoogleAuthenticator();
        if (!$request->ajax()) {
            $old_secret = $row->ga_secret;
            $secret     = $ga->createSecret(32);
            $ga_title   = $this->isDemo ? 'EasyAdmin8-Laravelデモ環境' : '表示タイトルはカスタマイズ可能です';
            $dataUri    = $ga->getQRCode($ga_title, $secret);
            $this->assign(compact('row', 'dataUri', 'old_secret', 'secret'));
            return $this->fetch();
        }
        if ($this->isDemo) return $this->error('デモ環境では変更できません');
        $post      = $request->post();
        $ga_secret = $post['ga_secret'] ?? '';
        $ga_code   = $post['ga_code'] ?? '';
        if (empty($ga_code)) return $this->error('認証コードを入力してください');
        if (!$ga->verifyCode($ga_secret, $ga_code)) return $this->error('認証コードエラー');
        $row->ga_secret  = $ga_secret;
        $row->login_type = 2;
        $row->save();
        return $this->success('操作が完了しました');
    }

}
