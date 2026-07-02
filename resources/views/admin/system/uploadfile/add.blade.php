@include('admin.layout.head')
<div class="layuimini-container">
    <form id="app-form" class="layui-form layuimini-form">

        <div class="layui-form-item">
            <label class="layui-form-label required">ファイル情報</label>
            <div class="layui-input-block layuimini-upload">
                <input name="head_img" class="layui-input layui-col-xs6" lay-verify="required" lay-reqtext="ファイルをアップロードしてください" placeholder="ファイルをアップロードしてください" value="">
                <div class="layuimini-upload-btn">
                    <span><a class="layui-btn" data-upload="head_img" data-upload-number="one" data-upload-exts="png|jpg|ico|jpeg"><i class="fa fa-upload"></i> ファイルアップロード</a></span>
                </div>
            </div>
        </div>

    </form>
</div>
@include('admin.layout.foot')
