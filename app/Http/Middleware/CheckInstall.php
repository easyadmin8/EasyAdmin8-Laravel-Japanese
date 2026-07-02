<?php

namespace App\Http\Middleware;

use App\Http\JumpTrait;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckInstall
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
        // インストール済みかどうかを判断
        if (!is_file(config_path() . DIRECTORY_SEPARATOR . 'install' . DIRECTORY_SEPARATOR . 'lock' . DIRECTORY_SEPARATOR . 'install.lock')) {
            return response()->redirectTo('/install');
        }
        return $next($request);
    }
}
