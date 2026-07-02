<?php

use App\Http\Middleware\CheckAuth;
use App\Http\Middleware\CheckInstall;
use App\Http\Middleware\CheckLogin;
use App\Http\Middleware\RateLimiting;
use App\Http\Middleware\SystemLog;
use Illuminate\Container\Container;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Str;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

// システムホーム
Route::get('/', function() {
    return redirect('/' . config('easyadmin.ADMIN'));
})->middleware([CheckInstall::class]);

// 初回インストール管理
Route::controller(\App\Http\Controllers\common\InstallController::class)->group(function() {
    Route::match(['get', 'post'], '/install', 'index');
});

// 管理画面全ルート
$admin = config('admin.admin_alias_name');

Route::middleware([CheckInstall::class, RateLimiting::class, CheckLogin::class, SystemLog::class, CheckAuth::class])->group(function() use ($admin) {
    Route::prefix($admin)->group(function() {

        // 管理画面ホーム
        Route::get('/', [\App\Http\Controllers\admin\IndexController::class, 'index']);

        $adminNamespace = config('admin.controller_namespace');
        // 動的ルート（secondary/controller/action にマッチ）
        Route::match(['get', 'post'], '/{secondary}/{controller}/{action}', function($secondary, $controller, $action) use ($adminNamespace) {

            $namespace = $adminNamespace . $secondary . '\\';
            $className = $namespace . ucfirst($controller . "Controller");
            $className = Str::studly($className);
            return webRouteExtracted($className, $action);
        });

        // 動的ルート（controller にマッチ）
        Route::match(['get', 'post'], '/{controller}/', function($controller) use ($adminNamespace) {
            $namespace = $adminNamespace;
            $className = $namespace . ucfirst($controller . "Controller");
            $action    = 'index';
            return webRouteExtracted($className, $action);
        });

        // 動的ルート（controller/action にマッチ）
        Route::match(['get', 'post'], '/{controller}/{action}', function($controller, $action) use ($adminNamespace) {
            $namespace = $adminNamespace;
            $className = $namespace . ucfirst($controller . "Controller");
            return webRouteExtracted($className, $action);
        });

    });
});


if (!function_exists('webRouteExtracted')) {

    function webRouteExtracted(string $className, string $action)
    {
        if (class_exists($className)) {
            $obj = new $className();
            if (method_exists($obj, $action)) {
                $reflectionClass = new ReflectionClass($className);
                $actionMethod    = $reflectionClass->getMethod($action);
                $args            = [];
                foreach ($actionMethod->getParameters() as $items) {
                    try {
                        if ($items->hasType()) {
                            $type   = $items->getType()->getName();
                            $args[] = str_contains($type, 'App\\') ? new $type() : Container::getInstance()->make($type);
                        } else {
                            $args[] = request($items->getName(), '');
                        }
                    } catch (Throwable $exception) {
                    }
                }
                return call_user_func([$obj, $action], ...$args);
            }
        }
        abort(404);
    }
}
