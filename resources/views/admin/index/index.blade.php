@include('admin.layout.head')
<link rel="stylesheet" href="/static/plugs/lay-module/layuimini/layuimini.css?v={{$version}}" media="all">
<link rel="stylesheet" href="/static/plugs/lay-module/layuimini/themes/default.css?v={{$version}}" media="all">
<style id="layuimini-bg-color"></style>
<div class="layui-layout-body layuimini-all">
    <div class="layui-layout layui-layout-admin">

        <div class="layui-header header">
            <div class="layui-logo layuimini-logo"></div>

            <div class="layuimini-header-content">
                <a>
                    <div class="layuimini-tool"><i title="展開" class="fa fa-outdent" data-side-fold="1"></i></div>
                </a>

                <!--电脑端头部菜单-->
                <ul class="layui-nav layui-layout-left layuimini-header-menu layuimini-menu-header-pc layuimini-pc-show">
                </ul>

                <!-- モバイル端末ヘッダーメニュー -->
                <ul class="layui-nav layui-layout-left layuimini-header-menu layuimini-mobile-show">
                    <li class="layui-nav-item">
                        <a href="javascript:;"><i class="fa fa-list-ul"></i> モジュール選択</a>
                        <dl class="layui-nav-child layuimini-menu-header-mobile">
                        </dl>
                    </li>
                </ul>

                <ul class="layui-nav layui-layout-right">
                    <!--                    <li class="layui-nav-item" lay-unselect>-->
                    <!--                        <div class="layui-form ws-header-theme" lay-filter="header-theme">-->
                    <!--                            <input type="checkbox" name="theme-mode" id="ID-header-theme-mode" lay-filter="header-theme-mode" lay-skin="switch">-->
                    <!--                            <div lay-checkbox>-->
                    <!--                                <i class="layui-icon layui-icon-moon"></i> |-->
                    <!--                                <i class="layui-icon layui-icon-light"></i>-->
                    <!--                            </div>-->
                    <!--                        </div>-->
                    <!--                    </li>-->
                    <li class="layui-nav-item" lay-unselect>
                        <a href="http://easyadmin8.top" target="_blank"><i class="fa fa-home"></i></a>
                    </li>
                    <li class="layui-nav-item" lay-unselect>
                        <a href="javascript:;" data-refresh="更新"><i class="fa fa-refresh"></i></a>
                    </li>
                    <li class="layui-nav-item" lay-unselect>
                        <a href="javascript:;" data-clear="クリア" class="layuimini-clear"><i class="fa fa-trash"></i></a>
                    </li>
                    <li class="layui-nav-item mobile layui-hide-xs" lay-unselect>
                        <a href="javascript:;" data-check-screen="full"><i class="fa fa-arrows-alt"></i></a>
                    </li>
                    <li class="layui-nav-item mobile layui-hide-xs" lay-unselect>
                        <div class="layui-form ws-header-theme" lay-filter="header-theme">
                            <input type="checkbox" name="theme-mode" lay-filter="header-theme-mode" lay-skin="switch">
                            <div lay-checkbox>
                                <i class="layui-icon layui-icon-moon"></i> |
                                <i class="layui-icon layui-icon-light"></i>
                            </div>
                        </div>
                    </li>
                    <li class="layui-nav-item layuimini-setting">
                        <a href="javascript:;">
                            <img src="{{session('admin.head_img')}}" class="layui-nav-img" width="50" height="50">
                            <cite class="adminName">{{session('admin.username')}}</cite>
                            <span class="layui-nav-more"></span>
                        </a>
                        <dl class="layui-nav-child">
                            <dd>
                                <a href="javascript:;" layuimini-content-href="{{__url('index/editAdmin')}}" data-title="基本情報" data-icon="fa fa-gears">基本情報<span class="layui-badge-dot"></span></a>
                            </dd>
                            <dd>
                                <a href="javascript:;" layuimini-content-href="{{__url('index/editPassword')}}" data-title="パスワード変更" data-icon="fa fa-gears">パスワード変更</a>
                            </dd>
                            <dd>
                                <hr>
                            </dd>
                            <dd>
                                <a href="javascript:;" class="login-out">ログアウト</a>
                            </dd>
                        </dl>
                    </li>
                    <li class="layui-nav-item layuimini-select-bgcolor" lay-unselect>
                        <a href="javascript:;" data-bgcolor="カラースキーム"><i class="fa fa-ellipsis-v"></i></a>
                    </li>
                </ul>
            </div>
        </div>

        <!-- 無限階層左側メニュー -->
        <div class="layui-side layui-bg-black layuimini-menu-left">
        </div>

        <!-- 初期化ローディング層 -->
        <div class="layuimini-loader">
            <div class="layuimini-loader-inner"></div>
        </div>

        <!-- モバイル端末マスク層 -->
        <div class="layuimini-make"></div>

        <!-- モバイルナビゲーション -->
        <div class="layuimini-site-mobile"><i class="layui-icon"></i></div>

        <div class="layui-body">
            <div class="layuimini-tab layui-tabs-rollTool layui-tabs" lay-filter="layuiminiTab" id="layuiminiTab">
                <ul class="layui-tabs-header">
                    <li class="layui-this" id="layuiminiHomeTabId" lay-id=""></li>
                </ul>
                <div class="layui-tab-control">
                    <li class="layuimini-tab-roll-left layui-icon layui-icon-left"></li>
                    <li class="layuimini-tab-roll-right layui-icon layui-icon-right"></li>
                    <li class="layui-tab-tool layui-icon layui-icon-down">
                        <ul class="layui-nav close-box">
                            <li class="layui-nav-item">
                                <a href="javascript:;"><span class="layui-nav-more"></span></a>
                                <dl class="layui-nav-child">
                                    <dd><a href="javascript:;" layuimini-tab-close="current">現在を閉じる</a></dd>
                                    <dd><a href="javascript:;" layuimini-tab-close="other">他を閉じる</a></dd>
                                    <dd><a href="javascript:;" layuimini-tab-close="all">すべて閉じる</a></dd>
                                </dl>
                            </li>
                        </ul>
                    </li>
                </div>
                <div class="layui-tabs-body">
                    <div id="layuiminiHomeTabIframe" class="layui-tabs-item layui-show"></div>
                </div>
            </div>
        </div>
    </div>
</div>
@include('admin.layout.foot')
