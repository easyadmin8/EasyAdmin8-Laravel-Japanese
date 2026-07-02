@include('admin.layout.head')
<link rel="stylesheet" href="/static/admin/css/welcome.css?v={{$version}}" media="all">
<div class="announcement-bar">
    <span class="star-icon">🌟</span>
    If you like <strong>EasyAdmin8-Laravel-Japanese</strong>, give it a
    <span style="color:#eb8d01;font-weight:700;">Star</span>
    on
    <a target="_blank" href="https://github.com/EasyAdmin8/EasyAdmin8-Laravel-Japanese">GitHub</a>
    <span class="star-icon">🌟</span>
</div>

<div class="layui-layout layui-padding-2">
    <div class="layui-layout-admin">

        <div class="layui-row layui-col-space16">

            <div class="layui-col-md8">

                <div class="layui-row layui-col-space16 ">

                    <div class="layui-col-md6">
                        <div class="layui-card">
                            <div class="layui-card-header">
                                <span class="card-header-icon header-icon-green"><i class="fa fa-bar-chart"></i></span>
                                データ統計
                            </div>
                            <div class="layui-card-body" style="padding:12px 16px 16px;">
                                <div class="welcome-module">
                                    <div class="layui-row layui-col-space10">
                                        <div class="layui-col-xs6">
                                            <div class="stat-card bg-flat-cyan" style="box-shadow:0 4px 16px rgba(46,196,182,.3);">
                                                <div class="stat-label">ユーザー統計</div>
                                                <div class="stat-value">1,234</div>
                                                <div class="stat-footer">
                                                    <span class="stat-badge">リアルタイム</span>
                                                    <span class="stat-trend up"><i class="fa fa-arrow-up"></i> 12%</span>
                                                </div>
                                                <i class="fa fa-users stat-icon"></i>
                                            </div>
                                        </div>
                                        <div class="layui-col-xs6">
                                            <div class="stat-card bg-flat-purple" style="box-shadow:0 4px 16px rgba(160,118,204,.3);">
                                                <div class="stat-label">商品統計</div>
                                                <div class="stat-value">1,234</div>
                                                <div class="stat-footer">
                                                    <span class="stat-badge">リアルタイム</span>
                                                    <span class="stat-trend up"><i class="fa fa-arrow-up"></i> 8%</span>
                                                </div>
                                                <i class="fa fa-shopping-cart stat-icon"></i>
                                            </div>
                                        </div>
                                        <div class="layui-col-xs6">
                                            <div class="stat-card bg-flat-orange" style="box-shadow:0 4px 16px rgba(255,107,107,.3);">
                                                <div class="stat-label">閲覧統計</div>
                                                <div class="stat-value">1,234</div>
                                                <div class="stat-footer">
                                                    <span class="stat-badge">リアルタイム</span>
                                                    <span class="stat-trend down"><i class="fa fa-arrow-down"></i> 3%</span>
                                                </div>
                                                <i class="fa fa-eye stat-icon"></i>
                                            </div>
                                        </div>
                                        <div class="layui-col-xs6">
                                            <div class="stat-card bg-flat-yellow" style="box-shadow:0 4px 16px rgba(246,185,59,.3);">
                                                <div class="stat-label">注文統計</div>
                                                <div class="stat-value">1,234</div>
                                                <div class="stat-footer">
                                                    <span class="stat-badge">リアルタイム</span>
                                                    <span class="stat-trend up"><i class="fa fa-arrow-up"></i> 5%</span>
                                                </div>
                                                <i class="fa fa-file-text-o stat-icon"></i>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="layui-col-md6">
                        <div class="layui-card">
                            <div class="layui-card-header">
                                <span class="card-header-icon header-icon-blue"><i class="fa fa-rocket"></i></span>
                                クイックアクセス
                            </div>
                            <div class="layui-card-body">
                                <div class="welcome-module">
                                    <div class="quick-panel">
                                        <div class="swiper mySwiper">
                                            <div class="swiper-wrapper">
                                                @foreach($quicks as $value)

                                                    <div class="swiper-slide">
                                                        <div class="layui-row layui-col-space8">
                                                            @foreach($value as $vo)

                                                                <div class="layui-col-xs3 layuimini-qiuck-module">
                                                                    <a layuimini-content-href="{{__url($vo['href'])}}" data-title="{{$vo['title']}}">
                                                                        <i class="{{$vo['icon']}}"></i>
                                                                        <cite>{{$vo['title']}}</cite>
                                                                    </a>
                                                                </div>
                                                            @endforeach

                                                        </div>
                                                    </div>
                                                @endforeach

                                            </div>
                                        </div>
                                        <div class="swiper-pagination" style="position:relative;margin-top:4px;"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="layui-col-md12">
                        <div class="layui-card">
                            <div class="layui-card-header">
                                <span class="card-header-icon header-icon-orange"><i class="fa fa-line-chart"></i></span>
                                レポート統計
                            </div>
                            <div class="layui-card-body">
                                <div id="echarts-records" style="width:100%;min-height:602px;"></div>
                            </div>
                        </div>
                    </div>

                </div>

            </div>

            <div class="layui-col-md4">

                <div class="layui-card">
                    <div class="layui-card-header">
                        <span class="card-header-icon header-icon-purple"><i class="fa fa-fire"></i></span>
                        バージョン情報
                    </div>
                    <div class="layui-card-body layui-text" style="padding:8px 12px;">
                        <table class="layui-table version-table" style="margin:0;">
                            <colgroup>
                                <col width="130">
                                <col>
                            </colgroup>
                            <tbody>
                            <tr>
                                <td>フレームワーク名</td>
                                <td><span class="layui-badge layui-bg-blue layui-border-radius" style="padding:3px 10px;">EasyAdmin8-Laravel-Japanese</span></td>
                            </tr>
                            <tr>
                                <td>ブランチバージョン</td>
                                <td>
                                    <button type="button" class="layui-btn layui-btn-xs layui-btn-primary">{{$versions['branch']??"main"}}</button>
                                </td>
                            </tr>
                            <tr>
                                <td>Laravelバージョン</td>
                                <td>
                                    <button type="button" class="layui-btn layui-btn-xs layui-btn-primary">{{$versions['laravelVersion']??''}}</button>
                                </td>
                            </tr>
                            <tr>
                                <td>Config設定キャッシュ</td>
                                <td>
                                    <button type="button" class="layui-btn layui-btn-xs layui-btn-primary">{{$versions['configIsCached']?'有効':'無効'}}</button>
                                </td>
                            </tr>
                            <tr>
                                <td>PHPバージョン</td>
                                <td><span class="layui-badge layui-bg-green layui-border-radius">{{$versions['phpVersion']}}</span></td>
                            </tr>
                            <tr>
                                <td>SQLバージョン</td>
                                <td><span class="layui-text">{{$versions['sqlVersion']}}</span></td>
                            </tr>
                            <tr>
                                <td>Layuiバージョン</td>
                                <td>
                                    <button type="button" class="layui-btn layui-btn-xs layui-btn-primary" id="layui-version">-</button>
                                </td>
                            </tr>
                            <tr>
                                <td>DEBUGモード</td>
                                <td>
                                    <span class="layui-badge {!! config('APP_DEBUG')?'layui-bg-cyan':'layui-bg-gray' !!} layui-border-radius">{!!config('APP_DEBUG')?'有効中':'無効'!!}</span>
                                </td>
                            </tr>
                            <tr>
                                <td>JITステータス</td>
                                <td>
                                    <span class="layui-badge {!!$versions['jitStatus']?'layui-bg-cyan':'layui-bg-gray'!!} layui-border-radius">{!!$versions['jitStatus']?'有効':'無効'!!}</span>
                                    <a href="https://easyadmin8.top/guide/question.html#%E5%A6%82%E4%BD%95%E5%BC%80%E5%90%AF-jit" target="_blank" style="margin-left:4px;">
                                        <span class="layui-badge layui-bg-gray" style="font-size:11px;">説明</span>
                                    </a>
                                </td>
                            </tr>
                            <tr>
                                <td>composer</td>
                                <td><span class="layui-badge layui-bg-cyan layui-border-radius" style="cursor:pointer;" lay-on="showComposerInfo">クリックして表示</span></td>
                            </tr>
                            <tr>
                                <td>特徴</td>
                                <td>
                                    <span class="layui-badge layui-bg-gray layui-border-radius">簡単セットアップ</span>
                                    <span class="layui-badge layui-bg-gray layui-border-radius">レスポンシブ</span>
                                    <span class="layui-badge layui-bg-gray layui-border-radius">クリーン</span>
                                    <span class="layui-badge layui-bg-gray layui-border-radius">ミニマル</span>
                                </td>
                            </tr>
                            <tr>
                                <td>Git</td>
                                <td>
                                    <div class="layui-row layui-col-space8">
                                        <div class="layui-col-xs6">
                                            <a href='https://github.com/EasyAdmin8/EasyAdmin8-Laravel-Japanese' target="_blank">
                                                <img src='https://img.shields.io/github/stars/easyadmin8/EasyAdmin8-Laravel-Japanese' alt='star' style="max-width:100%;">
                                            </a>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td>公式</td>
                                <td>
                                    <a class="layui-btn layui-btn-xs layui-bg-blue layui-border-radius" href="https://easyadmin8.top" target="_blank">公式サイト</a>
                                    <a class="layui-btn layui-btn-xs layui-bg-purple layui-border-radius" href="https://meta.easyadmin8.top" target="_blank">コミュニティ</a>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <div class="layui-card">
                    <div class="layui-card-header">
                        <span class="card-header-icon header-icon-green"><i class="fa fa-edit"></i></span>
                        作者メッセージ
                    </div>
                    <div class="layui-card-body">
                        <div class="author-card" style="margin-bottom:12px;">
                            <div>
                                Layui 2.x + Font Awesome 7.x をベースに構築。
                                <a class="layui-btn layui-btn-xs layui-btn-danger layui-border-radius" target="_blank" href="http://layui.dev/docs">Layuiドキュメント</a>
                            </div>
                        </div>
                        <div class="layui-font-red" style="font-size:12px;padding:8px 12px;background:#fff5f5;border-radius:8px;margin-bottom:12px;">
                            <i class="fa fa-exclamation-triangle"></i>
                            注：この管理画面フレームワークは永久オープンソースですが、販売や素材サイトへのアップロードはしないでください。
                        </div>
                    </div>
                </div>

            </div>
        </div>

    </div>
</div>
@include('admin.layout.foot')
