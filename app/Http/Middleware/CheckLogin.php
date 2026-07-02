<?php

namespace App\Http\Middleware;

use App\Http\Controllers\admin\ErrorPageController;
use App\Http\JumpTrait;
use App\Http\Services\annotation\MiddlewareAnnotation;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckLogin
{
    use JumpTrait;

    /**
     * Handle an incoming request.
     *
     * @param Request $request
     * @param Closure(Request): (Response) $next
     * @return Response
     */
    public function handle(Request $request, Closure $next): Response
    {
        $response    = $next($request);
        $adminConfig = config('admin');
        $parameters  = request()->route()->parameters;
        $controller  = $parameters['controller'] ?? 'index';
        $secondary   = '';
        if (!empty($parameters['secondary'])) $secondary = $parameters['secondary'];
        if (!in_array($controller, $adminConfig['no_login_controller'])) {
            $adminNamespace = config('admin.controller_namespace');
            $namespace      = $adminNamespace . ($secondary ? $secondary . '\\' : '');
            $className      = $namespace . ucfirst($controller . "Controller");
            try {
                $classObj   = new \ReflectionClass($className);
                $properties = $classObj->getDefaultProperties();
                // コントローラー全体がログインを無視するかどうか
                $ignoreLogin = $properties['ignoreLogin'] ?? false;
                if ($ignoreLogin) return $response;
                if (!empty($parameters['action'])) {
                    $reflectionMethod = new \ReflectionMethod($className, $parameters['action']);
                    $attributes       = $reflectionMethod->getAttributes(MiddlewareAnnotation::class);
                    foreach ($attributes as $attribute) {
                        $annotation = $attribute->newInstance();
                        $_ignore    = (array)$annotation->ignore;
                        // コントローラーの特定メソッドがログインを無視
                        if (in_array('LOGIN', $_ignore)) return $next($request);
                    }
                }
            }catch (\ReflectionException $e) {
            }

            $adminId    = session('admin.id', 0);
            $expireTime = session('admin.expire_time');
            if (empty($adminId)) {
                return $this->responseView('先に管理画面にログインしてください', [], __url("/login"));
            }
            // ログイン有効期限切れかどうかを判断
            if ($expireTime !== true && time() > $expireTime) {
                $request->session()->forget('admin');
                return $this->responseView('ログインの有効期限が切れています。再ログインしてください', [], __url("/login"));
            }
        }
        return $response;
    }
}
