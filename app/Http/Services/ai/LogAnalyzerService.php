<?php

namespace App\Http\Services\ai;

use NeuronAI\Chat\Messages\UserMessage;

class LogAnalyzerService extends AgentService
{
    protected array $logContent = [];

    public function loadCustomLogs(string $content): self
    {
        $this->logContent = [['file' => 'custom', 'lines' => [$content], 'count' => 1]];
        return $this;
    }

    public function analyze(array $options = []): array
    {
        if (empty($this->logContent)) {
            return [
                'success' => false,
                'message' => '先にログ内容を読み込んでください',
            ];
        }

        $analysisType = $options['type'] ?? 'comprehensive';
        $systemPrompt = $this->getAnalysisSystemPrompt($analysisType);
        $logText      = $this->formatLogsForAnalysis();
        $userPrompt   = match ($analysisType) {
            'security'    => <<<EOF
ログ内容を参照してください：
{$logText}
詳細なセキュリティ分析を提供
EOF,
            'performance' => <<<EOF
ログ内容を参照してください：
{$logText}
詳細なパフォーマンス分析を提供
EOF,
            'error'       => <<<EOF
ログ内容を参照してください：
{$logText}
詳細なエラー分析を提供
EOF,
            'debug'       => <<<EOF
ログ内容を参照してください：
{$logText}
詳細なデバッグ分析を提供
EOF,
            default       => <<<EOF
以下のログ内容を分析：
{$logText}
詳細な分析レポートを提供してください：
. エラータイプと頻度
. パフォーマンス問題. セキュリティリスク
. 最適化提案
. 根本原因分析（該当する場合）
EOF,
        };
        $this->setInstructions($systemPrompt);
        try {
            $response = $this->chat(new UserMessage($userPrompt));
            $analysis = $response->getMessage()->getContent();
            return [
                'success'  => true,
                'message'  => '分析完了',
                'analysis' => $analysis,
                'metadata' => [
                    'type'           => $analysisType,
                    'files_analyzed' => count($this->logContent),
                    'total_lines'    => array_sum(array_column($this->logContent, 'count')),
                ],
            ];
        } catch (\Throwable $e) {
            return [
                'success' => false,
                'message' => $e->getMessage(),
            ];
        }
    }

    protected function formatLogsForAnalysis(): string
    {
        $formatted = [];

        foreach ($this->logContent as $logFile) {
                $formatted[] = "=== ファイル：{$logFile['file']} ===";
            $formatted[] = implode("\n", $logFile['lines']);
        }

        return implode("\n\n", $formatted);
    }

    protected function getAnalysisSystemPrompt(string $type): string
    {
        $prompts = [
            'comprehensive' => 'あなたは専門的なThinkPHPログ分析エキスパートです。提供されたログ内容を包括的に分析し、エラー、警告、パフォーマンス問題、セキュリティリスクなどを特定し、詳細な分析レポートと最適化提案を提供してください。日本語で回答してください。',

            'security' => 'あなたは専門的なThinkPHPセキュリティアナリストです。ログのセキュリティ問題に焦点を当て、潜在的なセキュリティ脅威、異常なアクセスパターン、SQLインジェクション、XSS攻撃などのセキュリティリスクを特定してください。日本語で回答してください。',

            'performance' => 'あなたは専門的なThinkPHPパフォーマンス最適化エキスパートです。ログ内のパフォーマンス関連の問題（スロークエリ、メモリリーク、CPU使用率の異常など）を分析してください。日本語で回答してください。',

            'error' => 'あなたは専門的なThinkPHP障害診断エンジニアです。ログ内のエラー情報を分析し、エラーの原因と解決策を特定してください。日本語で回答してください。',

            'debug' => 'あなたは専門的なThinkPHPデバッグエンジニアです。ログのデバッグ情報を分析し、コード内の問題を特定してください。日本語で回答してください。',
        ];

        return $prompts[$type] ?? $prompts['comprehensive'];
    }


    protected function formatSize(int $bytes): string
    {
        $units = ['B', 'KB', 'MB', 'GB'];
        $i     = 0;
        $size  = $bytes;

        while ($size >= 1024 && $i < count($units) - 1) {
            $size /= 1024;
            $i++;
        }

        return round($size, 2) . ' ' . $units[$i];
    }
}
