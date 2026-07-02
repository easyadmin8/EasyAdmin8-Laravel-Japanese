<form id="app-form" class="layui-form layuimini-form">

    <div class="layui-form-item">
        <label class="layui-form-label">ロゴタイトル</label>
        <div class="layui-input-block">
            <input type="text" name="logo_title" class="layui-input" lay-verify="required" placeholder="ロゴタイトルを入力してください" value="{{sysconfig('site','logo_title')}}">
            <tip>サイト名を入力。</tip>
        </div>
    </div>

    <div class="layui-form-item">
        <label class="layui-form-label">ロゴアイコン</label>
        <div class="layui-input-block layuimini-upload">
            <input name="logo_image" class="layui-input layui-col-xs6" lay-verify="required" placeholder="ロゴアイコンをアップロードしてください" value="{{sysconfig('site','logo_image')}}">
            <div class="layuimini-upload-btn">
                <span><a class="layui-btn" data-upload="logo_image" data-upload-number="one" data-upload-exts="ico|png|jpg|jpeg"><i class="fa fa-upload"></i> アップロード</a></span>
                <span><a class="layui-btn layui-btn-normal" id="select_logo_image" data-upload-select="logo_image" data-upload-number="one"><i class="fa fa-list"></i> 選択</a></span>
            </div>
        </div>
    </div>

    <div class="hr-line"></div>
    <div class="layui-form-item text-center">
        <button type="submit" class="layui-btn layui-btn-normal layui-btn-sm" lay-submit="system/config/save" data-refresh="false">確認</button>
        <button type="reset" class="layui-btn layui-btn-primary layui-btn-sm">リセット</button>
    </div>

</form>
