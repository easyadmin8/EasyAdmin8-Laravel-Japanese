<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>EasyAdmin8管理画面をインストール</title>
    <meta name="renderer" content="webkit">
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
    <link rel="stylesheet" href="static/plugs/layui-v2.x/css/layui.css" media="all">
    <link rel="stylesheet" href="static/common/css/install.css" media="all">
</head>
<body>
<h1><img src="/static/common/images/logo-1.png" alt="" style="width: 100px;height: 100px;"></h1>
<h2>EasyAdmin8管理システムをインストール</h2>
<div class="content">
    <form class="layui-form layui-form-pane" action="">
        <div class="layui-card">
            <blockquote class="layui-elem-quote layui-font-green" style="text-align: left;padding: 5px 10px;">
                <div class="layui-row">
                    <div class="layui-col-lg6 layui-col-xl6 layui-col-xs6 layui-col-sm6 layui-col-xs6">
                        公式チュートリアル：<a href="https://EasyAdmin8.top?spm=002.3e3c9d.29f459" target="_blank" class="layui-font-blue">EasyAdmin8.top</a>
                    </div>
                    <div class="layui-col-lg6 layui-col-xl6 layui-col-xs6 layui-col-sm6 layui-col-xs6">
                        よくある質問：<a href="https://EasyAdmin8.top/guide/question.html?spm=002.3e3c9d.29f460" target="_blank" class="layui-font-blue">Question</a>
                    </div>
                </div>
            </blockquote>
        </div>
        @if ($errorInfo)
            <div class="error">
                {{$errorInfo}}
            </div>
        @endif
        <div class="bg">
            <div class="layui-form-item">
                <label class="layui-form-label">データベースタイプ</label>
                <div class="layui-input-block">
                    <input class="layui-input layui-disabled" name="db_type" autocomplete="off" placeholder="データベースタイプを入力してください" value="{{$envInfo['DB_TYPE']}}" readonly>
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label">データベースアドレス</label>
                <div class="layui-input-block">
                    <input class="layui-input" name="hostname" autocomplete="off" lay-verify="required" lay-reqtext="データベースアドレスを入力してください" placeholder="データベースアドレスを入力してください" value="{{$envInfo['DB_HOST']}}">
                </div>
            </div>

            <div class="layui-form-item">
                <label class="layui-form-label">データベースポート</label>
                <div class="layui-input-block">
                    <input class="layui-input" name="hostport" autocomplete="off" lay-verify="required" lay-reqtext="データベースポートを入力してください" placeholder="データベースポートを入力してください" value="{{$envInfo['DB_PORT']}}">
                </div>
            </div>

            <div class="layui-form-item">
                <label class="layui-form-label">データベース名</label>
                <div class="layui-input-block">
                    <input class="layui-input" name="database" autocomplete="off" lay-verify="required" lay-reqtext="データベース名を入力してください" placeholder="データベース名を入力してください" value="{{$envInfo['DB_NAME']}}">
                </div>
            </div>

            <div class="layui-form-item">
                <label class="layui-form-label">テーブルプレフィックス</label>
                <div class="layui-input-block">
                    <input class="layui-input" name="prefix" autocomplete="off" lay-verify="required" lay-reqtext="テーブルプレフィックスを入力してください" placeholder="テーブルプレフィックスを入力してください" value="{{$envInfo['DB_PREFIX']}}">
                </div>
            </div>

            <div class="layui-form-item">
                <label class="layui-form-label">データベースユーザー</label>
                <div class="layui-input-block">
                    <input class="layui-input" name="db_username" autocomplete="off" lay-verify="required" lay-reqtext="データベースユーザーを入力してください" placeholder="データベースユーザーを入力してください" value="{{$envInfo['DB_USER']}}">
                </div>
            </div>

            <div class="layui-form-item">
                <label class="layui-form-label">データベースパスワード</label>
                <div class="layui-input-block">
                    <input type="password" class="layui-input" name="db_password" autocomplete="off" lay-verify="required" lay-reqtext="データベースパスワードを入力してください" placeholder="データベースパスワードを入力してください" value="{{$envInfo['DB_PASS']}}">
                </div>
            </div>

            <div class="layui-form-item layui-hide">
                <label class="layui-form-label">データベース文字セット</label>
                <div class="layui-input-block">
                    <input type="text" class="layui-input layui-disabled" name="db_charset" autocomplete="off" value="{{$envInfo['DB_CHARSET']}}" readonly>
                </div>
            </div>


            <div class="layui-form-item">
                <label class="layui-form-label">データベース上書き</label>
                <div class="layui-input-block" style="text-align: left">
                    <input type="radio" name="cover" value="1" title="上書き">
                    <input type="radio" name="cover" value="0" title="上書きしない" checked>
                </div>
            </div>
        </div>
        <div class="bg">
            <div class="layui-form-item">
                <label class="layui-form-label">管理画面URL</label>
                <div class="layui-input-block">
                    <input class="layui-input layui-disabled" id="admin_url" name="admin_url" autocomplete="off" lay-verify="required" lay-reqtext="管理画面URLを入力してください" placeholder="管理画面の安全性のため、admin以外のパスを推奨" value="admin" readonly>
                    <span class="tips">ログインURL。.envのEASYADMIN.ADMINで変更可</span>
                </div>
            </div>

            <div class="layui-form-item">
                <label class="layui-form-label">管理者アカウント</label>
                <div class="layui-input-block">
                    <input class="layui-input" name="username" autocomplete="off" lay-verify="required" lay-reqtext="管理者アカウントを入力してください" placeholder="管理者アカウントを入力してください" value="admin">
                </div>
            </div>

            <div class="layui-form-item">
                <label class="layui-form-label">管理者パスワード</label>
                <div class="layui-input-block">
                    <input type="password" class="layui-input" name="password" maxlength="20" autocomplete="off" lay-verify="required" lay-reqtext="管理者パスワードを入力してください" placeholder="管理者パスワードを入力してください">
                </div>
            </div>
        </div>
        @csrf
        <div class="layui-form-item">
            <button class="layui-btn layui-btn-normal {{$errorInfo ? 'layui-btn-disabled' : ''}}" lay-submit="" lay-filter="install">インストール実行
            </button>
        </div>
    </form>
</div>
<script src="static/plugs/layui-v2.x/layui.js?v={{time()}}" charset="utf-8"></script>
<script>
    let isInstall = {{$isInstall?:0}}
    layui.use(['form', 'layer'], function () {
        var $ = layui.jquery,
            form = layui.form,
            layer = layui.layer;
        if (!!isInstall) {
            layer.msg("システムは既にインストールされています。再インストールする場合はファイルを削除してください：/config/install/lock/install.lock、または /install ルートを削除<br>ページをリダイレクトします", {
                icon: 5, shade: 0.6, time: 300000,
                success: function () {
                    setTimeout(function () {
                        location.href = '/'
                    }, 3000)
                }
            })
        }
        $("#admin_url").bind("input propertychange", function () {
            var val = $(this).val();
            $("#admin_name").text(val);
        });

        form.on('submit(install)', function (data) {
            if ($(this).hasClass('layui-btn-disabled')) {
                return false;
            }
            var _data = data.field;
            var loading = layer.msg('インストール中...', {
                icon: 16,
                shade: 0.2,
                time: false
            });
            $.ajax({
                url: window.location.href,
                type: 'post',
                contentType: "application/x-www-form-urlencoded; charset=UTF-8",
                dataType: "json",
                data: _data,
                timeout: 60000,
                success: function (data) {
                    layer.close(loading);
                    if (data.code === 1) {
                        layer.msg(data.msg, {icon: 1}, function () {
                            window.location.href = '/admin';
                        });
                    } else {
                        layer.msg(data.msg, {icon: 2});
                    }
                },
                error: function (xhr, textstatus, thrown) {
                    layer.close(loading);
                    layer.msg('Status:' + xhr.status + '，' + xhr.statusText + '、しばらくしてから再試行してください！', {icon: 2});
                    return false;
                }
            });
            return false;
        });
    });
</script>
</body>
</html>
