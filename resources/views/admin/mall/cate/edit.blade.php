@include('admin.layout.head')
<div class="layuimini-container">
    <form id="app-form" class="layui-form layuimini-form">

        <div class="layui-form-item">
            <label class="layui-form-label">カテゴリ名</label>
            <div class="layui-input-block">
                <input type="text" name="title" class="layui-input" lay-verify="required" placeholder="カテゴリ名を入力してください" value="{{$row['title']}}">
            </div>
        </div>

        <div class="layui-form-item">
            <label class="layui-form-label required">カテゴリ画像</label>
            <div class="layui-input-block layuimini-upload">
                <input name="image" class="layui-input layui-col-xs6" lay-verify="required" lay-reqtext="カテゴリ画像をアップロードしてください" placeholder="カテゴリ画像をアップロードしてください" value="{{$row['image']}}">
                <div class="layuimini-upload-btn">
                    <span><a class="layui-btn" data-upload="image" data-upload-number="one" data-upload-exts="png|jpg|ico|jpeg" data-upload-icon="image"><i class="fa fa-upload"></i> アップロード</a></span>
                    <span><a class="layui-btn layui-btn-normal" id="select_image" data-upload-select="image" data-upload-number="one" data-upload-mimetype="image/*"><i class="fa fa-list"></i> 選択</a></span>
                </div>
            </div>
        </div>

        <div class="layui-form-item">
            <label class="layui-form-label">カテゴリ並び順</label>
            <div class="layui-input-block">
                <input type="number" name="sort" class="layui-input" placeholder="並び順を入力してください" value="{{$row['sort']}}">
            </div>
        </div>

        <div class="layui-form-item layui-form-text">
            <label class="layui-form-label">備考</label>
            <div class="layui-input-block">
                <textarea name="remark" class="layui-textarea" placeholder="備考を入力してください">{{$row['remark']}}</textarea>
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
