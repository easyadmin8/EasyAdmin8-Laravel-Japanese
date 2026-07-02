@include('admin.layout.head')
<div class="layuimini-container">
    <div class="layuimini-main">

        <form id="app-form" class="layui-form layuimini-form">

            <div class="layui-form-item">
                <label class="layui-form-label required">ユーザーアバター</label>
                <div class="layui-input-block layuimini-upload">
                    <input name="head_img" class="layui-input layui-col-xs6" lay-reqtext="ユーザーアバターをアップロードしてください" placeholder="ユーザーアバターをアップロードしてください" value="{{$row['head_img']}}">
                    <div class="layuimini-upload-btn">
                        <span><a class="layui-btn" data-upload="head_img" data-upload-number="one" data-upload-exts="png|jpg|ico|jpeg"><i class="fa fa-upload"></i> アップロード</a></span>
                        <span><a class="layui-btn layui-btn-normal" id="select_head_img" data-upload-select="head_img" data-upload-number="one"><i class="fa fa-list"></i> 選択</a></span>
                    </div>
                </div>
            </div>

            <div class="layui-form-item">
                <label class="layui-form-label required">ログインアカウント</label>
                <div class="layui-input-block">
                    <input type="text" name="username" class="layui-input" readonly value="{{$row['username']}}">
                    <tip>ログインアカウントを入力。</tip>
                </div>
            </div>

            <div class="layui-form-item">
                <label class="layui-form-label">携帯電話</label>
                <div class="layui-input-block">
                    <input type="text" name="phone" class="layui-input" lay-reqtext="携帯電話番号を入力してください" placeholder="携帯電話番号を入力してください" value="{{$row['phone']}}">
                    <tip>ユーザー携帯電話を入力。</tip>
                </div>
            </div>

            <div class="layui-form-item">
                <label class="layui-form-label">ログイン方式</label>
                <div class="layui-input-block">
                    @foreach($notes['login_type'] as $key=>$value)
                        <input type="radio" name="login_type" lay-skin="primary" title="{{$value}}" value="{{$key}}" lay-filter="loginType-filter" @if($key==$row['login_type']) checked @endif>
                    @endforeach
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
</div>
@include('admin.layout.foot')
