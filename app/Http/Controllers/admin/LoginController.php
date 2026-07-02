<?php

namespace App\Http\Controllers\admin;

use App\Helpers\Utils;
use App\Http\Controllers\common\AdminController;
use App\Models\SystemAdmin;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Validator;
use Illuminate\View\View;
use Webman\Captcha\CaptchaBuilder;
use Webman\Captcha\PhraseBuilder;
use Wolfcode\CloudflareTurnstile\Exception\ValidationException;
use Wolfcode\CloudflareTurnstile\Turnstile;
use Wolfcode\CloudflareTurnstile\Widget;
use Wolfcode\RateLimiting\Attributes\RateLimitingMiddleware;

class LoginController extends AdminController
{
    public function initialize()
    {
        parent::initialize();
        if (\request()->method() == 'GET' && !empty(session('admin')) && $this->action != 'out') {
            $adminModuleName = $this->adminConfig['admin_alias_name'];
            redirect(__url())->send();
        }
    }

    #[RateLimitingMiddleware(key: [Utils::class, 'getIp'], seconds: 1, limit: 1, message: '操作が頻繁すぎます。しばらくしてから再試行してください')]
    public function index(): View|JsonResponse
    {
        $captcha     = config('easyadmin.CAPTCHA', false);
        $cfTurnstile = config('easyadmin.CF_TURNSTILE_STATUS', false);
        if (!request()->ajax()) {
            if ($cfTurnstile) {
                $widget = (new Widget(siteKey: config('easyadmin.CF_TURNSTILE_SITE_KEY'), theme: 'light', size: 'flexible'));
                $this->assign(compact('widget'));
            }
            return view('admin.login', compact('captcha', 'cfTurnstile'));
        }
        if ($captcha) {
            if (strtolower(request()->post('captcha')) !== request()->session()->get('captcha')) {
                return $this->error('画像認証コードエラー');
            }
        }
        $post      = \request()->post();
        $rules     = [
            'username'   => 'required',
            'password'   => 'required',
            'keep_login' => 'required',
        ];
        $validator = Validator::make($post, $rules, [
            'username' => 'ユーザー名は必須です',
            'password' => 'パスワードは必須、または形式が正しくありません',
        ]);
        if ($validator->fails()) {
            return $this->error($validator->errors()->first());
        }
        $admin = SystemAdmin::where(['username' => $post['username']])->first();
        if (empty($admin) || !password_verify($post['password'], $admin->password)) {
            return $this->error('ユーザー名またはパスワードが間違っています');
        }
        if ($admin->status == 0) {
            return $this->error('アカウントは無効化されています');
        }
        if ($admin->login_type == 2) {
            if (empty($post['ga_code'])) return $this->error('Google認証コードを入力してください', ['is_ga_code' => true]);
            $ga = new \Wolfcode\Authenticator\google\PHPGangstaGoogleAuthenticator();
            if (!$ga->verifyCode($admin->ga_secret, $post['ga_code'])) return $this->error('Google認証コードエラー');;
        }
        if ($cfTurnstile) {
            try {
                $checkCfTurnstile = (new Turnstile(secretKey: config('easyadmin.CF_TURNSTILE_SECRET_KEY')))->isValid(request()->post('cf-turnstile-response', ''), request()->ip());
                if (!$checkCfTurnstile) $this->error('本人確認に失敗しました');
            }catch (ValidationException $exception) {
                return $this->error($exception->getMessage());
            }
        }
        $admin->login_num   += 1;
        $admin->update_time = time();
        $admin->save();
        $admin = $admin->toArray();
        unset($admin['password']);
        $admin['expire_time'] = $post['keep_login'] == 1 ? true : time() + 7200;
        session(compact('admin'));
        return $this->success('ログインしました', [], __url());
    }

    public function captcha(): Response
    {
        $length  = 4;
        $chars   = '0123456789';
        $phrase  = new PhraseBuilder($length, $chars);
        $builder = new CaptchaBuilder(null, $phrase);
        $builder->build();
        session()->put('captcha', strtolower($builder->getPhrase()));
        $img_content = $builder->get();
        return response($img_content, 200, ['Content-Type' => 'image/jpeg']);

    }

    public function out(): Response|JsonResponse
    {
        \request()->session()->forget('admin');
        return $this->success('ログアウトしました', [], __url('/login'));
    }
}
