@include('admin.layout.head')
<style>
    .layui-iconpicker-body.layui-iconpicker-body-page .hide {
        display: none;
    }
</style>
<link rel="stylesheet" href="/static/plugs/lay-module/autocomplete/autocomplete.css?v={{$version}}" media="all">
<div class="layuimini-container">
    <form id="app-form" class="layui-form layuimini-form">

        <div class="layui-form-item  layui-row layui-col-xs12">
            <label class="layui-form-label required">親メニュー</label>
            <div class="layui-input-block">
                <select name="pid">
                    @foreach($pidMenuList as $vo)
                        <option value="{{$vo['id']}}" @if($row['pid']==$vo['id']) selected @endif>{{html_entity_decode($vo['title'])}}</option>
                    @endforeach
                </select>
            </div>
        </div>

        <div class="layui-form-item">
            <label class="layui-form-label required">メニュー名</label>
            <div class="layui-input-block">
                <input type="text" name="title" class="layui-input" lay-verify="required" lay-reqtext="メニュー名を入力してください" placeholder="メニュー名を入力してください" value="{{$row['title']}}">
                <tip>メニュー名を入力。</tip>
            </div>
        </div>

        <div class="layui-form-item">
            <label class="layui-form-label">メニューリンク</label>
            <div class="layui-input-block">
                <input type="text" name="href" id="href" class="layui-input" lay-reqtext="メニューリンクを入力してください" placeholder="メニューリンクを入力してください" value="{{$row['href']}}">
                <tip>メニューリンクを入力。</tip>
            </div>
        </div>

        <div class="layui-form-item">
            <label class="layui-form-label">アイコン選択</label>
            <div class="layui-input-block">
                <input type="text" id="icon" name="icon" lay-filter="icon" class="hide" value="{{$row['icon']}}">
            </div>
        </div>

        <div class="layui-form-item">
            <label class="layui-form-label required">target属性</label>
            <div class="layui-input-block">
                @foreach(['_self','_blank','_parent','_top'] as $vo)
                    <input type="radio" name="target" value="{{$vo}}" title="{{$vo}}" @if($row['target']==$vo) checked @endif >
                @endforeach
            </div>
        </div>

        <div class="layui-form-item">
            <label class="layui-form-label">メニュー並び順</label>
            <div class="layui-input-block">
                <input type="number" name="sort" lay-reqtext="並び順を入力してください" placeholder="並び順を入力してください" value="{{$row['sort']}}" class="layui-input">
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
