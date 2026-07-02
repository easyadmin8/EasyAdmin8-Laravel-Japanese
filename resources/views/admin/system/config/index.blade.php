@include('admin.layout.head')
<div class="layuimini-container">
    <div class="layuimini-main" id="app">
        <div class="layui-tab layui-tab-brief" lay-filter="docDemoTabBrief">
            <ul class="layui-tab-title">
                <li class="layui-this" data-group="site">サイト設定</li>
                <li data-group="logo">ロゴ設定</li>
                <li data-group="upload">アップロード設定</li>
            </ul>
            <div class="layui-tab-content">
                <div class="layui-tab-item layui-show">
                    @include("admin.system/config/site")
                </div>
                <div class="layui-tab-item">
                    @include("admin.system/config/logo")
                </div>
                <div class="layui-tab-item">
                    @include("admin.system/config/upload")
                </div>
            </div>
        </div>
    </div>
</div>
@include('admin.layout.foot')
