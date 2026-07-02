<form id="app-form" class="layui-form layuimini-form">

    <div class="layui-form-item">
        <label class="layui-form-label required">保存方法</label>
        <div class="layui-input-block">
            @foreach($upload_types as $key=>$val)
                <input type="radio" v-model="upload_type" name="upload_type" lay-filter="upload_type" value="{{$key}}" title="{{$val}}" @if($key==sysconfig('upload','upload_type')) checked="" @endif>
            @endforeach
        </div>
    </div>

    <div class="layui-form-item">
        <label class="layui-form-label required">許可する拡張子</label>
        <div class="layui-input-block">
            <input type="text" name="upload_allow_ext" class="layui-input" lay-verify="required" lay-reqtext="許可する拡張子を入力してください" placeholder="許可する拡張子を入力してください" value="{{sysconfig('upload','upload_allow_ext')}}">
            <tip>カンマ区切りで入力。</tip>
        </div>
    </div>

    <div class="layui-form-item">
        <label class="layui-form-label required">最大サイズ</label>
        <div class="layui-input-block">
            <input type="text" name="upload_allow_size" class="layui-input" lay-verify="required" lay-reqtext="最大アップロードサイズを入力してください" placeholder="最大アップロードサイズを入力してください" value="{{sysconfig('upload','upload_allow_size')}}">
            <tip>最大アップロードサイズを設定。</tip>
        </div>
    </div>

    <div class="layui-form-item oss layui-hide upload_type">
        <label class="layui-form-label required">公開鍵</label>
        <div class="layui-input-block">
            <input type="text" name="oss_access_key_id" class="layui-input" lay-verify="required" lay-reqtext="公開鍵を入力してください" placeholder="公開鍵を入力してください" value="{{sysconfig('upload','oss_access_key_id')}}">
            <tip>例子：FSGGshu64642THSk</tip>
        </div>
    </div>

    <div class="layui-form-item oss layui-hide upload_type">
        <label class="layui-form-label required">秘密鍵</label>
        <div class="layui-input-block">
            <input type="text" name="oss_access_key_secret" class="layui-input" lay-verify="required" lay-reqtext="秘密鍵を入力してください" placeholder="秘密鍵を入力してください" value="{{sysconfig('upload','oss_access_key_secret')}}">
            <tip>例子：5fsfPReYKkFSGGshu64642THSkmTInaIm</tip>
        </div>
    </div>

    <div class="layui-form-item oss layui-hide upload_type">
        <label class="layui-form-label required">データセンター</label>
        <div class="layui-input-block">
            <input type="text" name="oss_endpoint" class="layui-input" lay-verify="required" lay-reqtext="データセンターを入力してください" placeholder="データセンターを入力してください" value="{{sysconfig('upload','oss_endpoint')}}">
            <tip>例子：https://oss-cn-shenzhen.aliyuncs.com</tip>
        </div>
    </div>

    <div class="layui-form-item oss layui-hide upload_type">
        <label class="layui-form-label required">バケット名</label>
        <div class="layui-input-block">
            <input type="text" name="oss_bucket" class="layui-input" lay-verify="required" lay-reqtext="バケット名を入力してください" placeholder="バケット名を入力してください" value="{{sysconfig('upload','oss_bucket')}}">
            <tip>例子：easy-admin</tip>
        </div>
    </div>

    <div class="layui-form-item oss layui-hide upload_type">
        <label class="layui-form-label required">アクセスドメイン</label>
        <div class="layui-input-block">
            <input type="text" name="oss_domain" class="layui-input" lay-verify="required" lay-reqtext="アクセスドメインを入力してください" placeholder="アクセスドメインを入力してください" value="{{sysconfig('upload','oss_domain')}}">
            <tip>例子：easy-admin.oss-cn-shenzhen.aliyuncs.com</tip>
        </div>
    </div>

    <div class="layui-form-item cos layui-hide upload_type">
        <label class="layui-form-label required">公開鍵</label>
        <div class="layui-input-block">
            <input type="text" name="cos_secret_id" class="layui-input" lay-verify="required" lay-reqtext="公開鍵を入力してください" placeholder="公開鍵を入力してください" value="{{sysconfig('upload','cos_secret_id')}}">
            <tip>例子：AKIDta6OQCbALQGrCI6ngKwQffR3dfsfrwrfs</tip>
        </div>
    </div>

    <div class="layui-form-item cos layui-hide upload_type">
        <label class="layui-form-label required">秘密鍵</label>
        <div class="layui-input-block">
            <input type="text" name="cos_secret_key" class="layui-input" lay-verify="required" lay-reqtext="秘密鍵を入力してください" placeholder="秘密鍵を入力してください" value="{{sysconfig('upload','cos_secret_key')}}">
            <tip>例子：VllEWYKtClAbpqfFdTqysXxGQM6dsfs</tip>
        </div>
    </div>

    <div class="layui-form-item cos layui-hide upload_type">
        <label class="layui-form-label required">ストレージリージョン</label>
        <div class="layui-input-block">
            <input type="text" name="cos_region" class="layui-input" lay-verify="required" lay-reqtext="ストレージリージョンを入力してください" placeholder="ストレージリージョンを入力してください" value="{{sysconfig('upload','cos_region')}}">
            <tip>例子：ap-guangzhou</tip>
        </div>
    </div>

    <div class="layui-form-item cos layui-hide upload_type">
        <label class="layui-form-label required">バケット名</label>
        <div class="layui-input-block">
            <input type="text" name="cos_bucket" class="layui-input" lay-verify="required" lay-reqtext="バケット名を入力してください" placeholder="バケット名を入力してください" value="{{sysconfig('upload','cos_bucket')}}">
            <tip>例子：easyadmin-1251997243</tip>
        </div>
    </div>

    <div class="layui-form-item qnoss layui-hide upload_type">
        <label class="layui-form-label required">公開鍵</label>
        <div class="layui-input-block">
            <input type="text" name="qnoss_access_key" class="layui-input" lay-verify="required" lay-reqtext="公開鍵を入力してください" placeholder="公開鍵を入力してください" value="{{sysconfig('upload','qnoss_access_key')}}">
            <tip>例子：v-lV3tXev7yyfsfa1jRc6_8rFOhFYGQvvjsAQxdrB</tip>
        </div>
    </div>

    <div class="layui-form-item qnoss layui-hide upload_type">
        <label class="layui-form-label required">秘密鍵</label>
        <div class="layui-input-block">
            <input type="text" name="qnoss_secret_key" class="layui-input" lay-verify="required" lay-reqtext="秘密鍵を入力してください" placeholder="秘密鍵を入力してください" value="{{sysconfig('upload','qnoss_secret_key')}}">
            <tip>例子：XOhYRR9JNqxsWVEO-mHWB4193vfsfsQADuORaXzr</tip>
        </div>
    </div>

    <div class="layui-form-item qnoss layui-hide upload_type">
        <label class="layui-form-label required">ストレージスペース</label>
        <div class="layui-input-block">
            <input type="text" name="qnoss_bucket" class="layui-input" lay-verify="required" lay-reqtext="ストレージリージョンを入力してください" placeholder="ストレージリージョンを入力してください" value="{{sysconfig('upload','qnoss_bucket')}}">
            <tip>例子：easyadmin</tip>
        </div>
    </div>

    <div class="layui-form-item qnoss layui-hide upload_type">
        <label class="layui-form-label required">アクセスドメイン</label>
        <div class="layui-input-block">
            <input type="text" name="qnoss_domain" class="layui-input" lay-verify="required" lay-reqtext="アクセスドメインを入力してください" placeholder="アクセスドメインを入力してください" value="{{sysconfig('upload','qnoss_domain')}}">
            <tip>例子：http://q0xqzappp.bkt.cloudcdn.com</tip>
        </div>
    </div>

    <div class="hr-line"></div>
    <div class="layui-form-item text-center">
        <button type="submit" class="layui-btn layui-btn-normal layui-btn-sm" lay-submit="system/config/save" data-refresh="false">確認</button>
        <button type="reset" class="layui-btn layui-btn-primary layui-btn-sm">リセット</button>
    </div>

</form>
<script>
    var upload_type = "{{sysconfig('upload','upload_type')}}";
</script>
