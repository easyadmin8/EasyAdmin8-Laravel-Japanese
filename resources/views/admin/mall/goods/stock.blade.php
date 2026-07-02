@include('admin.layout.head')
<div class="layuimini-container">
    <form id="app-form" class="layui-form layuimini-form">

        <div class="layui-form-item">
            <label class="layui-form-label">商品タイトル</label>
            <div class="layui-input-block">
                <input type="text" class="layui-input layui-disabled" disabled value="{{$row['title']}}" readonly>
            </div>
        </div>

        <div class="layui-form-item">
            <label class="layui-form-label">在庫統計</label>
            <div class="layui-input-block">
                <input type="text" class="layui-input layui-disabled" disabled value="{{$row['total_stock']}}" readonly>
            </div>
        </div>

        <div class="layui-form-item">
            <label class="layui-form-label">残り在庫</label>
            <div class="layui-input-block">
                <input type="text" class="layui-input layui-disabled" disabled value="{{$row['stock']}}" readonly>
            </div>
        </div>

        <div class="layui-form-item">
            <label class="layui-form-label">入庫数</label>
            <div class="layui-input-block">
                <input type="number" name="stock" class="layui-input" lay-verify="required" placeholder="入庫数を入力してください" value="0">
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
