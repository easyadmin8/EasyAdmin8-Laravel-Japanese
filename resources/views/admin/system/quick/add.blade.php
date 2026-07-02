@include('admin.layout.head')
<style>
    .layui-iconpicker-body.layui-iconpicker-body-page .hide {
        display: none;
    }
</style>
<link rel="stylesheet" href="/static/plugs/lay-module/autocomplete/autocomplete.css?v={{$version}}" media="all">
<div class="layuimini-container">
    <form id="app-form" class="layui-form layuimini-form">

        <div class="layui-form-item">
            <label class="layui-form-label">クイック名</label>
            <div class="layui-input-block">
                <input type="text" name="title" class="layui-input" lay-verify="required" lay-reqtext="クイック名を入力してください" placeholder="クイック名を入力してください" value="">
            </div>
        </div>

        <div class="layui-form-item">
            <label class="layui-form-label">クイックリンク</label>
            <div class="layui-input-block">
                <input type="text" id="href" name="href" class="layui-input" lay-verify="required" placeholder="クイックリンクを入力してください" value="">
            </div>
        </div>

        <div class="layui-form-item">
            <label class="layui-form-label">アイコン選択</label>
            <div class="layui-input-block">
                <input type="text" id="icon" name="icon" lay-filter="icon" class="hide" value="fa fa-list">
            </div>
        </div>

        <div class="layui-form-item">
            <label class="layui-form-label">並び順</label>
            <div class="layui-input-block">
                <input type="number" name="sort" lay-reqtext="並び順を入力してください" placeholder="並び順を入力してください" value="0" class="layui-input">
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
