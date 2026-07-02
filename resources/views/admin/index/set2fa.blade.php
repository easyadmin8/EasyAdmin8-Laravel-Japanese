@include('admin.layout.head')
<div class="layuimini-container">
    <form id="app-form" class="layui-form layuimini-form" autocomplete="off">
        @if($old_secret)
            <div class="layui-card">
                <div class="layui-card-header">ヒント</div>
                <div class="layui-card-body">
                    現在のアカウントはGoogle認証コードを既にバインドしています。再保存すると置き換えられます
                </div>
            </div>
        @endif
        <div class="layui-form-item">
            <label class="layui-form-label required">認証シークレットキー</label>
            <div class="layui-input-block">
                <input type="text" name="ga_secret" class="layui-input" value="{{$secret}}" readonly disabled>
            </div>
        </div>

        <div class="layui-form-item">
            <label class="layui-form-label required">QRコード</label>
            <div class="layui-input-block">
                <img src="{{$dataUri}}" alt="QRコード" style="width: 200px;height: 200px">
                <div class="layui-text layui-font-cyan layui-font-12">
                    <a href="https://2fas.com" target="_blank"><span class="layui-text layui-font-blue">2FAS</span></a>
                    &nbsp;または&nbsp;
                    <a href="https://cn.bing.com/search?q=Google+Authenticator" target="_blank"><span class="layui-text layui-font-blue">Google Authenticator</span></a>
                    &nbsp;APPでQRコードをスキャンし、認証コードを入力してバインド
                </div>
            </div>
        </div>
        <div class="layui-form-item">
            <label class="layui-form-label required">Google認証コード</label>
            <div class="layui-input-block">
                <input type="text" name="ga_code" class="layui-input" maxlength="6" lay-verify="required" placeholder="QRコードをスキャンして認証コードを入力" value="">
            </div>
        </div>
        <div class=" hr-line">
        </div>
        <div class="layui-form-item text-center">
            <button type="submit" class="layui-btn layui-btn-normal layui-btn-sm" lay-submit>確認</button>
            <button type="reset" class="layui-btn layui-btn-primary layui-btn-sm">リセット</button>
        </div>

    </form>
</div>
@include('admin.layout.foot')
