@include('admin.layout.head')
<div class="layuimini-container">
    <form id="app-form" class="layui-form layuimini-form" autocomplete="off">

        <div class="layui-form-item">
            <label class="layui-form-label required">ユーザーアバター</label>
            <div class="layui-input-block layuimini-upload">
                <input name="head_img" class="layui-input layui-col-xs6" lay-verify="required" lay-reqtext="ユーザーアバターをアップロードしてください" placeholder="ユーザーアバターをアップロードしてください" value="">
                <div class="layuimini-upload-btn">
                    <span><a class="layui-btn" data-upload="head_img" data-upload-number="one" data-upload-exts="png|jpg|ico|jpeg" data-upload-icon="image"><i class="fa fa-upload"></i> アップロード</a></span>
                    <span><a class="layui-btn layui-btn-normal" id="select_head_img" data-upload-select="head_img" data-upload-number="one" data-upload-mimetype="image/*"><i class="fa fa-list"></i> 選択</a></span>
                </div>
            </div>
        </div>

        <div class="layui-form-item">
            <label class="layui-form-label required">ログインアカウント</label>
            <div class="layui-input-block">
                <input type="text" name="username" class="layui-input" lay-verify="required" lay-reqtext="ログインアカウントを入力してください" placeholder="ログインアカウントを入力してください" value="" readonly onclick="this.removeAttribute('readonly');">
                <tip>ログインアカウントを入力。</tip>
            </div>
        </div>
        <div class="layui-form-item">
            <label class="layui-form-label ">ログインパスワード</label>
            <div class="layui-input-block">
                <input type="password" name="password" class="layui-input" placeholder="ログインパスワードを入力してください" value="" readonly onclick="this.removeAttribute('readonly');">
                <tip>空欄の場合はデフォルト 123456</tip>
            </div>
        </div>

        <div class="layui-form-item">
            <label class="layui-form-label">携帯電話</label>
            <div class="layui-input-block">
                <input type="text" name="phone" class="layui-input" lay-reqtext="携帯電話番号を入力してください" placeholder="携帯電話番号を入力してください" value="">
                <tip>携帯電話番号を入力。</tip>
            </div>
        </div>

        <div class="layui-form-item">
            <label class="layui-form-label">ロール権限</label>
            <div class="layui-input-block">
                @foreach($auth_list as $key=>$val)
                    <input type="checkbox" name="auth_ids[{{$key}}]" lay-skin="primary" title="{{$val}}">
                @endforeach
            </div>
        </div>

        <div class="layui-form-item layui-form-text">
            <label class="layui-form-label">備考</label>
            <div class="layui-input-block">
                <textarea name="remark" class="layui-textarea" placeholder="備考を入力してください"></textarea>
            </div>
        </div>

        <div class="hr-line"></div>
        <div class="layui-form-item text-center">
            <button type="submit" class="layui-btn layui-btn-normal layui-btn-sm" lay-submit>確認</button>
            <button type="reset" class="layui-btn layui-btn-primary layui-btn-sm">リセット</button>
        </div>

    </form>
</div>
@include('admin.layout.foot')
