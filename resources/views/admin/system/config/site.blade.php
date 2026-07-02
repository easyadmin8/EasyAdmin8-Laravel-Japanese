<form id="app-form" class="layui-form layuimini-form">

    <div class="layui-form-item">
        <label class="layui-form-label">サイト名</label>
        <div class="layui-input-block">
            <input type="text" name="site_name" class="layui-input" lay-verify="required" placeholder="サイト名を入力してください" value="{{sysconfig('site','site_name')}}">
            <tip>サイト名を入力。</tip>
        </div>
    </div>

    <div class="layui-form-item">
        <label class="layui-form-label">ブラウザアイコン</label>
        <div class="layui-input-block layuimini-upload">
            <input name="site_ico" class="layui-input layui-col-xs6" lay-verify="required" placeholder="ブラウザアイコン（ico形式）をアップロードしてください" value="{{sysconfig('site','site_ico')}}">
            <div class="layuimini-upload-btn">
                <span><a class="layui-btn" data-upload="site_ico" data-upload-number="one" data-upload-exts="ico"><i class="fa fa-upload"></i> アップロード</a></span>
                <span><a class="layui-btn layui-btn-normal" id="select_site_ico" data-upload-select="site_ico" data-upload-number="one"><i class="fa fa-list"></i> 選択</a></span>
            </div>
        </div>
    </div>

    <div class="layui-form-item">
        <label class="layui-form-label">管理画面背景画像</label>
        <div class="layui-input-block layuimini-upload">
            <input name="admin_background" class="layui-input layui-col-xs6" placeholder="未入力の場合はデフォルト#333333" value="{{sysconfig('site','admin_background')}}">
            <div class="layuimini-upload-btn">
                <span><a class="layui-btn" data-upload="admin_background" data-upload-number="one" data-upload-exts="png|jpg|jpeg"><i class="fa fa-upload"></i> アップロード</a></span>
                <span><a class="layui-btn layui-btn-normal" id="select_admin_background" data-upload-select="admin_background" data-upload-number="one"><i class="fa fa-list"></i> 選択</a></span>
            </div>
        </div>
    </div>

    <div class="layui-form-item">
        <label class="layui-form-label">バージョン情報</label>
        <div class="layui-input-block">
            <input type="text" name="site_version" class="layui-input" lay-verify="required" placeholder="バージョン情報を入力してください" value="{{sysconfig('site','site_version')}}">
            <tip>バージョン情報を入力。</tip>
        </div>
    </div>

    <div class="layui-form-item">
        <label class="layui-form-label">ICP届出情報</label>
        <div class="layui-input-block">
            <input type="text" name="site_beian" class="layui-input" lay-verify="required" placeholder="ICP届出情報を入力してください" value="{{sysconfig('site','site_beian')}}">
            <tip>ICP届出情報を入力。</tip>
        </div>
    </div>

    <div class="layui-form-item">
        <label class="layui-form-label">著作権情報</label>
        <div class="layui-input-block">
            <input type="text" name="site_copyright" class="layui-input" lay-verify="required" placeholder="著作権情報を入力してください" value="{{sysconfig('site','site_copyright')}}">
            <tip>著作権情報を入力。</tip>
        </div>
    </div>
    <div class="layui-form-item">
        <label class="layui-form-label">新しいタブで開く</label>
        <div class="layui-input-block">
            <input type="radio" name="iframe_open_top" value="0" title="許可しない" @if(1!=sysconfig('site','iframe_open_top')) checked @endif>
            <input type="radio" name="iframe_open_top" value="1" title="許可する" @if(1==sysconfig('site','iframe_open_top')) checked @endif>
            <br>
            <tip>モーダルを新しいタブで開くことを許可します。</tip>
        </div>
    </div>
    <div class="layui-form-item">
        <label class="layui-form-label">デフォルトエディター</label>
        <div class="layui-input-block">
            @foreach($editor_types as $key=>$val)
                <input type="radio" name="editor_type" lay-filter="editor_type" value="{{$key}}" title="{{$val}}" @if($key==sysconfig('site','editor_type')) checked="" @endif>
            @endforeach
            <br>
            <tip>デフォルトで推奨されるエディター。</tip>
        </div>
    </div>

    <div class="hr-line"></div>
    <div class="layui-form-item text-center">
        <button type="submit" class="layui-btn layui-btn-normal layui-btn-sm" lay-submit="system/config/save" data-refresh="false">確認</button>
        <button type="reset" class="layui-btn layui-btn-primary layui-btn-sm">リセット</button>
    </div>

</form>
