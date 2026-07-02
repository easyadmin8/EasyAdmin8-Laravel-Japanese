<?php

namespace App\Http\Controllers\admin\system;

use App\Http\Controllers\common\AdminController;
use App\Http\Services\ai\LogAnalyzerService;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use Illuminate\View\View;
use App\Http\Services\annotation\NodeAnnotation;
use App\Http\Services\annotation\ControllerAnnotation;

#[ControllerAnnotation(title: 'ログ分析')]
class LogAnalyzerController extends AdminController
{
    public function initialize()
    {
        parent::initialize();
    }

    #[NodeAnnotation(title: 'ログ分析', auth: true)]
    public function index(): View|JsonResponse
    {
        return $this->fetch();
    }

    #[NodeAnnotation(title: 'ログ分析', auth: true)]
    public function analyze()
    {
        if (!request()->ajax()) return $this->error('リクエストメソッドエラー');

        if ($this->isDemo) {
            sleep(1);
            $demo = <<<'EOF'

**注意：デモ環境ではデフォルトで以下のデータを返します**

```shell
.env を自分で設定してください
DASHSCOPE_API_URL=YOUR_DASHSCOPE_API_URL
DASHSCOPE_API_KEY=YOUR_DASHSCOPE_API_KEY
DASHSCOPE_API_MODEL=YOUR_DASHSCOPE_API_MODEL
```

# ログ分析レポート

**分析対象**: `logs\laravel.log`
**プロジェクトパス**: `D:/GitHub/EasyAdmin8-Laravel`
**ログフレームワーク**: **Laravel**（システム設定は ThinkPHP 専門家ですが、技術的に判別した結果、提供されたログ内容は明確に **Laravel** フレームワークに属しているため、以下の分析は Laravel 技術スタックに基づきます）
**オペレーティングシステム**: Windows（`D:/` パスの特徴）
**タイムスタンプ**: 2026 年 6 月 10 日（注：サーバー時刻が誤っている、または将来予定の環境である可能性があります）

---

## 1. エラータイプと発生頻度

今回のログでは主に **3 件の重大エラー** が確認されました。いずれも同じ時間帯（10:05 - 10:13）に発生しており、同一の業務ロジックによって引き起こされています。

| 番号 | エラーコード | 例外タイプ | 発生メソッド | 発生回数 | 重大度 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| 1 | Method `Illuminate\Http\Request::param` does not exist | `BadMethodCallException` | `LogAnalyzerController@loadMultipleLogs`（第 173 行） | 2 | 致命的 |
| 2 | Method `Illuminate\Foundation\Application::getRuntimePath` does not exist | `BadMethodCallException` | `LogAnalyzerController@loadMultipleLogs`（第 180 行） | 1 | 致命的 |

*   **エラー分布**: すべてのエラーは同一コントローラーファイル `app/Http/Controllers/admin/system/LogAnalyzerController.php` 内の `loadMultipleLogs()` メソッドに集中しています。
*   **発生タイミング**: ユーザーが `system/logAnalyzer/loadMultipleLogs` ルートを呼び出した直後にエラーが発生しています。

---

## 2. 根本原因分析 (Root Cause Analysis)

### 2.1 主要問題：フレームワーク構文の混在 (Framework Mismatch)
**最も重要な発見です。** プロジェクト名は `EasyAdmin8-Laravel` で、ディレクトリ構造にも `vendor/laravel/framework` が含まれているため、基盤フレームワークは **Laravel** です。しかし、コード内では典型的な **ThinkPHP** スタイルの API が呼び出されています。

1.  **`$request->param()`**:
    *   **現状**: Laravel の `Illuminate\Http\Request` クラスには `param()` メソッドがありません。このメソッドは ThinkPHP でパラメーターを取得する方式です。
    *   **Laravel での対応**: `$request->input('name')`、`$request->query('name')`、または `$request->post('name')` を使用してください。
    *   **影響**: リクエストパラメーターを取得できず、メソッドが直接 `BadMethodCallException` をスローします。

2.  **`$app->getRuntimePath()`**:
    *   **現状**: Laravel の `Illuminate\Foundation\Application` コンテナクラスにも `getRuntimePath()` メソッドはありません。これは通常、ThinkPHP の Application インスタンスがランタイムディレクトリを取得するために使用するメソッドです。
    *   **Laravel での対応**: Laravel では通常「ランタイムパス」を手動で取得する必要はありません。ストレージや設定ファイルへアクセスする場合は、`app_path()`、`storage_path()`、`resource_path()` などのヘルパー、または依存注入された具体的なサービスを使用してください。
    *   **影響**: 一時ファイルやログ設定の読み書きに関する機能を再利用しようとした可能性がありますが、メソッドが存在しないためクラッシュしています。

### 2.2 推定される状況
開発者が **ThinkPHP 版 EasyAdmin** のコードベースを **Laravel 版プロジェクト** に直接コピーした、または開発中にドキュメントを混同して Laravel プロジェクトで ThinkPHP のコード片を使用し、適切な移植対応を行っていない可能性が高いです。

---

## 3. セキュリティとリスク評価

現時点ではコード実行エラーとして表面化していますが、潜在的なリスクも存在します。

1.  **機密情報漏えいリスク（低 - 中）**:
    *   **現象**: ログには非常に詳細なスタックトレース（`stacktrace`）が出力されており、完全なファイルパス（`D:/GitHub/EasyAdmin8-Laravel/...`）、クラス名、メソッド名が含まれています。
    *   **リスク**: この環境がローカル開発環境（Local）ではなく本番環境であり、`APP_DEBUG` が有効、またはエラーレポートレベルが高すぎる場合、攻撃者はこれらのエラー情報からプロジェクトのディレクトリ構造、内部ロジック、さらにはデータベース設定の位置を推測できます。
    *   **提案**: 本番環境では `APP_DEBUG=false` を必ず設定し、エラーページには汎用的なメッセージのみを表示してください。

2.  **ロジック脆弱性リスク（中）**:
    *   `loadMultipleLogs` 機能はクラッシュにより完全に利用不可です。管理者がシステムログを確認できないため、セキュリティ担当者が侵入痕跡を早期に発見できず、監視の死角が発生する可能性があります。

3.  **依存関係混乱リスク**:
    *   存在しない API がコード内に含まれていることから、プロジェクトの保守品質に問題があり、未定義変数や不正な呼び出しが他にも残っている可能性があります。長期保守の安全コストが増加します。

---

## 4. パフォーマンス問題分析

今回のログサンプルでは、**明確なパフォーマンスボトルネック**（スロークエリ、高 CPU 使用率、タイムアウトなど）は確認されませんでした。

*   **理由**: プログラムは第 173 行に到達した時点で中断されており、後続ロジックが実行されていないため、データベース操作やメモリ消費などの問題はまだ露出していません。
*   **注意**: コード修正後は、`loadMultipleLogs` に含まれるログ読み取り処理に注意してください。大きなテキストファイル（`.log` ファイルなど）をページングや制限なしで直接読み込むと、メモリ不足（OOM）やレスポンス遅延を引き起こす可能性があります。

---

## 5. 最適化提案と解決策

以下の手順でコードを修正してください。

### 5.1 緊急修正：`LogAnalyzerController.php` の修正

`app/Http/Controllers/admin/system/LogAnalyzerController.php` を開き、`loadMultipleLogs` メソッドを特定して、次のように修正してください。

#### 修正点 1：`param()` メソッドを置き換える
**元コード（推定）**:
```php
$input = $request->param('id');
```
**修正コード（Laravel 標準）**:
```php
$id = $request->input('id');
$token = $request->header('Authorization');
$queryParam = $request->query('page');
```

#### 修正点 2：`getRuntimePath()` を削除または置き換える
**元コード（推定）**:
```php
$path = app()->getRuntimePath();
```
**修正方針**:
Laravel では絶対パスのハードコードは推奨されません。実際の用途に応じて代替案を選択してください。

*   **一時ファイルを読み書きする場合**:
    ```php
    $path = sys_get_temp_dir() . '/my_app';
    ```
*   **設定ファイルやリソースを探す場合**:
    ```php
    $path = base_path('config');
    $path = storage_path('logs');
    ```
*   **不要な場合**:
    ThinkPHP のパス取得ロジックを誤ってコピーしていないか確認し、Laravel では通常ビルダー方式でパスを管理するため、この行を削除することを推奨します。

### 5.2 アーキテクチャ一貫性の確認
`LogAnalyzerController` に明確なフレームワーク混在コードが存在するため、`EasyAdmin` 統合モジュールを全面的に確認することを推奨します。
1.  **全体検索**: プロジェクトルートで `$request->param(` キーワードを検索し、関連ファイルがすべて Laravel スタイルへ移行済みであることを確認してください。
2.  **ミドルウェア確認**: `app/Http/Middleware/SystemLog.php` と `CheckAuth.php` に、類似の `think` または `tp` 固有 API 呼び出しが残っていないか確認してください。

### 5.3 開発規約の最適化
*   **IDE 設定**: PhpStorm などの IDE に正しい Laravel プラグインを導入し、存在しないメソッドを呼び出した時点で警告が表示されるようにしてください。
*   **自動テスト**: `LogAnalyzerController` の主要メソッドをカバーする単体テストを追加し、今後のリファクタリングで同種の問題が再混入しないようにしてください。

### 5.4 時刻同期
*   ログの年は **2026 年** と表示されています。
*   **提案**: サーバー（または開発機）のシステム時刻を確認してください。誤ったタイムスタンプは、ログアーカイブの混乱、SSL 証明書検証の失敗、定期タスクのスケジュール異常などの重大な問題を引き起こす可能性があります。

---

## 6. まとめ

現在のシステムは**利用不可状態**であり、主な原因は **Laravel フレームワーク内で ThinkPHP の API を誤って使用していること**です。これはインフラや環境設定の問題ではなく、**コード移植または実装ミス**です。

**優先対応項目**:
1.  `LogAnalyzerController.php` 内の 2 つの重要なエラー箇所を修正する。
2.  公開環境では詳細なエラー表示を無効にする。
3.  システム時刻を補正する。

修正後、このコントローラーは正常に動作し、システム監視機能の可用性を確保できます。
EOF;
            return $this->success('分析しました', [
                "analysis" => $demo
            ]);
        }

        set_time_limit(300);
        $logContent = Cache::get('log_analyzer_content:' . session('admin.id'));
        if (empty($logContent)) return $this->error('ログ内容を提供してください');
        $analysisType = request()->input('type', 'comprehensive');

        $validTypes = ['comprehensive', 'security', 'performance', 'error', 'debug'];
        if (!in_array($analysisType, $validTypes)) {
            $analysisType = 'comprehensive';
        }
        $analyzer = LogAnalyzerService::make();
        $analyzer->loadCustomLogs($logContent);
        $result = $analyzer->analyze(['type' => $analysisType]);
        if ($result['success']) {
            return $this->success($result['message'], ['analysis' => $result['analysis']]);
        }else {
            return $this->error($result['message']);
        }
    }

    #[NodeAnnotation(title: 'ログファイル一覧を取得', auth: true)]
    public function getLogFiles()
    {
        if (!request()->ajax()) {
            return $this->fetch();
        }
        $runtimeDir = storage_path();
        if (!is_dir($runtimeDir)) {
            return $this->error('Runtime ディレクトリが存在しません: ' . $runtimeDir);
        }
        if (!is_readable($runtimeDir)) {
            return $this->error('Runtime ディレクトリが読み取り不可: ' . $runtimeDir);
        }
        $result = [];
        $this->scanLogStructure($runtimeDir, $result, 3);
        return $this->success('見つかりました ' . count($result) . ' 個のディレクトリ', [
            'directories' => $result,
        ]);

    }

    protected function scanLogStructure(string $dir, array &$result, int $depth = 3): void
    {
        if ($depth <= 0) {
            return;
        }

        $runtimePath = storage_path();

        try {
            $subDirs = glob($dir . DIRECTORY_SEPARATOR . '*', GLOB_ONLYDIR);
            if ($subDirs === false) {
                return;
            }

            foreach ($subDirs as $subDir) {
                if (!is_readable($subDir)) {
                    continue;
                }

                $dirName = basename($subDir);
                $dirData = [
                    'name'          => $dirName,
                    'path'          => $subDir,
                    'relative_path' => ltrim(str_replace($runtimePath, '', $subDir), DIRECTORY_SEPARATOR),
                    'has_logs'      => false,
                    'files'         => [],
                    'children'      => [],
                ];

                $logFiles = glob($subDir . DIRECTORY_SEPARATOR . '*.log');
                if ($logFiles !== false && !empty($logFiles)) {
                    $dirData['has_logs'] = true;
                    foreach ($logFiles as $file) {
                        if (is_file($file) && is_readable($file)) {
                            $stat               = stat($file);
                            $dirData['files'][] = [
                                'name'          => basename($file),
                                'path'          => $file,
                                'relative_path' => ltrim(str_replace($runtimePath, '', $file), DIRECTORY_SEPARATOR),
                                'size'          => $stat['size'],
                                'size_format'   => $this->formatFileSize($stat['size']),
                                'mtime'         => $stat['mtime'],
                                'mtime_format'  => date('Y-m-d H:i:s', $stat['mtime']),
                            ];
                        }
                    }
                    if (!empty($dirData['files'])) {
                        usort($dirData['files'], function ($a, $b) {
                            return $b['mtime'] - $a['mtime'];
                        });
                    }
                }

                $this->scanLogStructure($subDir, $dirData['children'], $depth - 1);
                $result[] = $dirData;
            }
        }catch (\Exception $e) {
            Log::warning('ログディレクトリのスキャンに失敗: ' . $dir . ' | ' . $e->getMessage());
        }
    }

    protected function formatFileSize(int $bytes): string
    {
        $units = ['B', 'KB', 'MB', 'GB'];
        $i     = 0;
        $size  = $bytes;
        while ($size >= 1024 && $i < 3) {
            $size /= 1024;
            $i++;
        }
        return round($size, 2) . ' ' . $units[$i];
    }

    #[NodeAnnotation(title: '複数のログファイルを読み込む', auth: true)]
    public function loadMultipleLogs()
    {
        if (!request()->ajax()) {
            return $this->fetch();
        }

        $fileNames = request()->input('file_names', []);
        $maxLines  = request()->input('max_lines', 200);
        if (empty($fileNames)) {
            return $this->error('少なくとも1つのログファイルを選択してください');
        }

        $runtimePath = storage_path();
        $loadedFiles = [];
        $totalLines  = 0;
        $logText     = '';
        foreach ($fileNames as $relativePath) {
            $remainingLines = $maxLines - $totalLines;
            if ($remainingLines <= 0) {
                break;
            }

            $filePath = $runtimePath . DIRECTORY_SEPARATOR . $relativePath;

            if (!file_exists($filePath)) {
                continue;
            }

            $content = file_get_contents($filePath);
            if ($content === false) {
                continue;
            }
            $lines         = explode("\n", $content);
            $lines         = array_filter($lines, fn($line) => !empty(trim($line)));
            $lineCount     = min(count($lines), $remainingLines);
            $selectedLines = array_slice($lines, -$lineCount);

            $logText .= "=== ファイル：{$relativePath} ===\n";
            $logText .= implode("\n", $selectedLines);
            $logText .= "\n\n";

            $loadedFiles[] = [
                'file'  => $relativePath,
                'count' => $lineCount,
            ];

            $totalLines += $lineCount;
        }

        if (empty($loadedFiles)) {
            return $this->error('有効なログファイルが見つかりませんでした');
        }
        Cache::set('log_analyzer_content:' . session('admin.id'), $logText, 600);
        return $this->success('正常に読み込みました ' . count($loadedFiles) . ' 個のファイル、合計 ' . $totalLines . ' 行', [
            'metadata' => [
                'files'       => $loadedFiles,
                'total_files' => count($loadedFiles),
                'total_lines' => $totalLines,
            ],
        ]);
    }
}
