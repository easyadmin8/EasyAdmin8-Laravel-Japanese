@include('admin.layout.head')
<link rel="stylesheet" href="/static/plugs/zTree/fontawesome.css">
<link rel="stylesheet" href="/static/plugs/zTree/zTreeStyle.css?v={{$version}}">
<link rel="stylesheet" href="/static/common/css/marked.css?v={{$version}}">
<script src='/static/plugs/jquery-3.4.1/jquery-3.4.1.min.js'></script>
<script src='/static/plugs/zTree/jquery.ztree.core.js'></script>
<script src='/static/plugs/zTree/jquery.ztree.excheck.js'></script>
<style>
    .loading-mask {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.7);
        border-radius: 5px;
        z-index: 999;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .loading-content {
        text-align: center;
    }

</style>
<div class="layuimini-container">
    <div class="layuimini-main">
        <div class="layui-row">
            <div class="layui-col-md5">
                <div class="layui-card" id="leftPanel">
                    <div class="layui-card-header">
                        <i class="layui-icon layui-icon-file"></i> ランタイムログファイル
                        <button class="layui-btn layui-btn-sm layui-btn-normal" id="refreshFiles" style="float: right;">
                            <i class="layui-icon layui-icon-refresh"></i> 更新
                        </button>
                    </div>
                    <div class="layui-card-body" style="height: 500px; overflow-y: auto;">
                        <ul id="logTree" class="ztree" style="margin-top: 10px;"></ul>
                    </div>
                    <div class="layui-card-footer" style="padding: 15px;">
                        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 15px;">
                            <span class="layui-badge layui-bg-gray">選択中 <span id="selectedCount">0</span> ファイル</span>
                            <div style="display: flex; align-items: center; gap: 10px;">
                                <span style="color: #666; font-size: 12px;">読込行数：</span>
                                <input type="number" id="maxLines" value="200" min="100" max="1000" step="100"
                                       style="width: 80px; padding: 4px 8px; border: 1px solid #ddd; border-radius: 4px; text-align: center;"/>
                            </div>
                        </div>
                        <div style="display: flex; align-items: center; gap: 10px;">
                            <select name="analysis_type" id="analysisType" class="layui-select" style="flex: 1;">
                                <option value="comprehensive">総合分析</option>
                                <option value="security">セキュリティ分析</option>
                                <option value="performance">パフォーマンス分析</option>
                                <option value="error">エラー分析</option>
                                <option value="debug">デバッグ分析</option>
                            </select>
                            <button class="layui-btn layui-btn-normal" id="analyzeBtn" style="flex: 1;">
                                <i class="layui-icon layui-icon-release"></i> 分析開始
                            </button>
                        </div>
                    </div>
                    <div id="loadingMask" class="loading-mask" style="display: none;">
                        <div class="loading-content">
                            <i class="layui-icon layui-icon-loading-1 layui-anim layui-anim-rotate layui-anim-loop" style="font-size: 36px; color: #fff;"></i>
                            <p style="margin-top: 15px; color: #fff;">分析中、お待ちください...</p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="layui-col-md7">
                <div class="layui-card">
                    <div class="layui-card-header">
                        <i class="layui-icon layui-icon-ai"></i> AI分析結果
                    </div>
                    <div class="layui-card-body">
                        <div id="analysisResult" style="min-height: 500px; padding: 15px; background: #f5f5f5; border-radius: 4px; overflow-y: auto;">
                            <div style="text-align: center; color: #999; padding-top: 150px;">
                                <i class="layui-icon layui-icon-face-surprise" style="font-size: 48px;"></i>
                                <p style="margin-top: 15px; font-size: 16px;">ログファイルを選択すると、AIが自動分析して結果を表示します</p>
                                <p style="margin-top: 10px; color: #ccc;">総合分析、セキュリティ分析、パフォーマンス分析、エラー分析などに対応</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
<div id="diagnoseModal" style="display: none; padding: 20px;">
    <form class="layui-form" lay-filter="diagnoseForm">
        <div class="layui-form-item">
            <label class="layui-form-label">問題説明：</label>
            <div class="layui-input-block">
                <textarea name="question" id="diagnoseQuestion" placeholder="質問を入力してください（例：システムが遅くなった原因は？注意すべきエラーは？）"
                          style="width: 100%; height: 120px; padding: 10px;"></textarea>
            </div>
        </div>
    </form>
</div>
<script src="/static/common/js/marked.js?v={{$version}}"></script>
@include('admin.layout.foot')
