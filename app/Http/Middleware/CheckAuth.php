<?php

namespace App\Http\Middleware;

use App\Http\JumpTrait;
use App\Http\Services\annotation\MiddlewareAnnotation;
use App\Http\Services\AuthService;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckAuth
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
        $adminConfig = config('admin');
        $parameters  = request()->route()->parameters;
        $controller  = $parameters['controller'] ?? 'index';
        $adminId     = session('admin.id', 0);
        try {
            $currentAdminAction        = currentAdminAction();
            $currentAdminActionExplode = explode('@', $currentAdminAction);
            $reflectionClass           = new \ReflectionMethod($currentAdminActionExplode[0], $currentAdminActionExplode[1]);
            $checkIgnoreLogin          = $reflectionClass->getAttributes(MiddlewareAnnotation::class)[0]->newInstance()->ignore;
            // ログイン不要のページは権限チェックをスキップ
            if (strtolower($checkIgnoreLogin) == 'login') return $next($request);
        }catch (\Throwable) {
        }
        // 権限検証
        if ($adminId) {
            $authService = app(AuthService::class, ['adminId' => $adminId]);
            $currentNode = $authService->getCurrentNode();
            if (!in_array($controller, $adminConfig['no_auth_controller']) && !in_array($controller, $adminConfig['no_auth_node'])) {
                $check = $authService->checkNode($currentNode);
                if (!$check) return (request()->ajax() || request()->method() == 'POST') ? $this->error('アクセス権限がありません') : $this->responseView('アクセス権限がありません');
                // デモ環境かどうかを判断
                if (config('easyadmin.IS_DEMO', false) && \request()->method() == 'POST') {
                    if (!in_array($currentNode, [
                        'system/log/record',
                        'system/LogAnalyzer/analyze',
                        'mall/goods/aiOptimization',
                    ])) return (request()->ajax() || request()->method() == 'POST') ? $this->error('デモ環境では変更できません') : $this->responseView('アクセス権限がありません');
                }
            }
        }
        return $next($request);
    }
}
