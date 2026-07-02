@include('admin.layout.head')
<style>
    .table_fields .input_tag {
        margin-bottom: 5px;
        display: inline-flex;
    }
</style>
<div class="layuimini-container">
    <div class="layuimini-main" id="app">

        <div class="layui-tab layui-tab-brief" lay-filter="docDemoTabBrief">

            <form id="app-form" class="layui-form layuimini-form">

                <div class="layui-form-item">
                    <label class="layui-form-label">データベーステーブルプレフィックス</label>
                    <div class="layui-input-block">
                        <input type="text" name="tb_prefix" class="layui-input" placeholder="入力してください" value="{{config('database.connections.mysql.prefix','')}}">
                        <tip>空欄可、空の場合はプレフィックスなし</tip>
                    </div>
                </div>
                <div class="layui-form-item">
                    <label class="layui-form-label">データベーステーブル名</label>
                    <div class="layui-input-block">
                        <input type="text" name="tb_name" class="layui-input" lay-verify="required" placeholder="入力例: test_goods" value="">
                        <tip>データベーステーブル名（プレフィックス含まず）。</tip>
                    </div>
                </div>

                <div class="hr-line"></div>
                <div class="layui-form-item text-center">
                    <button type="button" class="layui-btn layui-btn-normal layui-btn-sm" lay-filter="search" lay-submit="system/CurdGenerate/save?type=search" data-refresh="false">検索</button>
                </div>

            </form>

        </div>

        <div class="tableShow layui-hide">
            <blockquote class="layui-elem-quote layui-quote-nm">
                データテーブル：<span class="table-text"></span>
            </blockquote>
            <div class="layui-card-body">
                <fieldset class="layui-elem-field">
                    <legend class="layui-font-16">無視フィールド設定</legend>
                    <div class="layui-field-box">
                        <div class="table_fields layui-form" data-name="ignore"></div>
                    </div>
                </fieldset>
                <fieldset class="layui-elem-field">
                    <legend class="layui-font-16">ドロップダウンフィールド設定</legend>
                    <div class="layui-field-box">
                        <div class="table_fields layui-form" data-name="select"></div>
                    </div>
                </fieldset>
                <fieldset class="layui-elem-field">
                    <legend class="layui-font-16">ラジオボタンフィールド設定</legend>
                    <div class="layui-field-box">
                        <div class="table_fields layui-form" data-name="radio"></div>
                    </div>
                </fieldset>
                <fieldset class="layui-elem-field">
                    <legend class="layui-font-16">チェックボックスフィールド設定</legend>
                    <div class="layui-field-box">
                        <div class="table_fields layui-form" data-name="checkbox"></div>
                    </div>
                </fieldset>
                <fieldset class="layui-elem-field">
                    <legend class="layui-font-16">単一画像フィールド設定</legend>
                    <div class="layui-field-box">
                        <div class="table_fields layui-form" data-name="image"></div>
                    </div>
                </fieldset>
                <fieldset class="layui-elem-field">
                    <legend class="layui-font-16">複数画像フィールド設定</legend>
                    <div class="layui-field-box">
                        <div class="table_fields layui-form" data-name="images"></div>
                    </div>
                </fieldset>
                <fieldset class="layui-elem-field">
                    <legend class="layui-font-16">日付（Y-m-d）フィールド設定</legend>
                    <div class="layui-field-box">
                        <div class="table_fields layui-form" data-name="date"></div>
                    </div>
                </fieldset>
                <fieldset class="layui-elem-field">
                    <legend class="layui-font-16">日時（Y-m-d H:i:s）フィールド設定</legend>
                    <div class="layui-field-box">
                        <div class="table_fields layui-form" data-name="datetime"></div>
                    </div>
                </fieldset>
                <fieldset class="layui-elem-field">
                    <legend class="layui-font-16">エディターフィールド設定</legend>
                    <div class="layui-field-box">
                        <div class="table_fields layui-form" data-name="editor"></div>
                    </div>
                </fieldset>
            </div>
            <div class="layui-btn-container">
                <form class="layui-form layuimini-form">
                    <button type="button" class="layui-btn layui-bg-cyan" lay-filter="add" lay-submit="system/CurdGenerate/save?type=add">CURD自動生成</button>
                    <button type="button" class="layui-btn layui-bg-red" lay-filter="delete" lay-submit="system/CurdGenerate/save?type=delete">CURDファイル削除</button>
                </form>
                <div class="file-list layui-elem-quote">まだファイルは生成されていません</div>
            </div>
            <table id="currentTable" class="layui-table" lay-filter="currentTable"></table>
        </div>
    </div>
</div>
@include('admin.layout.foot')
