<?php

namespace App\Http;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response;
use Illuminate\View\View;

trait JumpTrait
{
    /**
     * 操作完了リダイレクトのショートカット
     * @access protected
     * @param string $msg メッセージ
     * @param array $data 返却データ
     * @param string|null $url リダイレクトURL
     * @param int $wait リダイレクト待機時間
     * @return Response|JsonResponse|View
     */
    protected function success(string $msg = '操作が完了しました', array $data = [], ?string $url = null, int $wait = 3): Response|JsonResponse|View
    {
        if (is_null($url) && isset($_SERVER["HTTP_REFERER"])) {
            $url = $_SERVER["HTTP_REFERER"];
        } elseif ($url) {
            $url = (strpos($url, '://') || str_starts_with($url, '/')) ? $url : app('route')->buildUrl($url)->__toString();
        }
        if (empty($url)) $url = __url();
        $result = [
            'code'      => 1,
            'msg'       => $msg,
            'data'      => $data,
            'url'       => $url,
            'wait'      => $wait,
            '__token__' => csrf_token(),
        ];
        if ($this->getResponseType() == "html") return view('admin.success', $result);
        return response()->json($result);
    }

    /**
     * @param string $msg
     * @param array $data
     * @param string|null $url
     * @param int $wait
     * @return Response|JsonResponse|View
     */
    public function error(string $msg = '操作失敗', array $data = [], ?string $url = null, int $wait = 3): Response|JsonResponse|View
    {
        if (is_null($url)) {
            $url = request()->ajax() ? '' : 'javascript:history.back(-1);';
        } elseif ($url) {
            $url = (strpos($url, '://') || str_starts_with($url, '/')) ? $url : "";
        }
        $result = [
            'code'      => 0,
            'msg'       => $msg,
            'data'      => $data,
            'url'       => $url,
            'wait'      => $wait,
            '__token__' => csrf_token(),
        ];
        if ($this->getResponseType() == "html") return view('admin.error', $result);
        return response()->json($result);
    }

    /**
     * @param string $msg
     * @param array $data
     * @param string|null $url
     * @param int $wait
     * @return Response|JsonResponse|View
     */
    public function responseView(string $msg = '操作失敗', array $data = [], ?string $url = null, int $wait = 3): Response|JsonResponse|View
    {
        if (is_null($url)) {
            $url = request()->ajax() ? '' : 'javascript:history.back(-1);';
        } elseif ($url) {
            $url = (strpos($url, '://') || str_starts_with($url, '/')) ? $url : "";
        }
        $result = [
            'code'      => 0,
            'msg'       => $msg,
            'data'      => $data,
            'url'       => $url,
            'wait'      => $wait,
            '__token__' => csrf_token(),
        ];
        if ($this->getResponseType() == "html") return response()->view('admin.error', $result);
        return response()->json($result);
    }

    /**
     * 現在のレスポンス出力タイプを取得
     * @access protected
     * @return string
     */
    protected function getResponseType(): string
    {
        return (request()->ajax() || request()->method() == 'POST') ? 'json' : 'html';
    }

}
