@include('admin.layout.head')
<link rel="stylesheet" href="/static/common/css/marked.css?v={{$version}}">
<div class="layuimini-container">
    <form id="app-form" class="layui-form layuimini-form layui-form-pane">

        <div class="layui-row">
            <div class="layui-col-xl5 layui-col-lg5 layui-col-md12 layui-col-sm12 layui-col-xs12">
                <!-- この方法を使用可能（推奨）-->
                <div class="layui-form-item">
                    <label class="layui-form-label">商品カテゴリ</label>
                    <div class="layui-input-block">
                        <select name="cate_id" lay-verify="required" data-select="{{__url('mall/cate/index')}}" data-fields="id,title">
                        </select>
                    </div>
                </div>

                <!--この方法も使用可能-->
                <div class="layui-form-item">
                    <label class="layui-form-label">商品カテゴリ2</label>
                    <div class="layui-input-block">
                        <select name="cate_id" lay-verify="required">
                            @foreach($cate as $key=>$vo)
                                <option value="{{$key}}">{{$vo}}</option>
                            @endforeach
                        </select>
                    </div>
                </div>

                <!-- 異なる表示形式の書き方-->
                <div class="layui-form-item">
                    <label class="layui-form-label">商品カテゴリ3</label>
                    <div data-show="switchSelect" data-list='{{json_encode($cate)}}' data-name="cate_id" data-value="" data-target="radio"></div>
                </div>

                <div class="layui-form-item">
                    <div class="layui-row">
                        <div class="layui-col-xs10">
                            <label class="layui-form-label required">商品タイトル</label>
                            <div class="layui-input-block layui-col-space5">
                                <div class="layui-input-wrap">
                                    <input type="text" name="title" class="layui-input" lay-verify="required" placeholder="商品タイトルを入力してください" value="">
                                </div>
                            </div>
                        </div>
                        <div class="layui-col-xs2">
                            <button class="layui-btn layui-bg-purple " type="button" lay-on="AiOptimization">AI最適化</button>
                        </div>
                    </div>
                </div>

                <div class="layui-form-item">
                    <label class="layui-form-label required">商品ロゴ</label>
                    <div class="layui-input-block layuimini-upload">
                        <input name="logo" class="layui-input layui-col-xs6" lay-verify="required" placeholder="商品画像をアップロードしてください" value="">
                        <div class="layuimini-upload-btn">
                            <span><a class="layui-btn" data-upload="logo" data-upload-number="one" data-upload-exts="png|jpg|ico|jpeg" data-upload-icon="image" data-upload-mimetype="image/*"><i class="fa fa-upload"></i> アップロード</a></span>
                            <span><a class="layui-btn layui-btn-normal" id="select_logo" data-upload-select="logo" data-upload-number="one"><i class="fa fa-list"></i> 選択</a></span>
                        </div>
                    </div>
                </div>

                <div class="layui-form-item">
                    <label class="layui-form-label required">商品画像</label>
                    <div class="layui-input-block layuimini-upload">
                        <input name="images" class="layui-input layui-col-xs6" lay-verify="required" placeholder="商品画像をアップロードしてください" value="">
                        <div class="layuimini-upload-btn">
                            <span><a class="layui-btn" data-upload="images" data-upload-number="more" data-upload-exts="png|jpg|ico|jpeg" data-upload-icon="image" data-upload-mimetype="image/*"><i class="fa fa-upload"></i> アップロード</a></span>
                            <span><a class="layui-btn layui-btn-normal" id="select_images" data-upload-select="images" data-upload-number="more"><i class="fa fa-list"></i> 選択</a></span>
                        </div>
                    </div>
                </div>

                <div class="layui-form-item">
                    <label class="layui-form-label">市場価格</label>
                    <div class="layui-input-block">
                        <input type="text" name="market_price" class="layui-input" lay-verify="required" placeholder="市場価格を入力してください" value="0">
                    </div>
                </div>

                <div class="layui-form-item">
                    <label class="layui-form-label">割引価格</label>
                    <div class="layui-input-block">
                        <input type="text" name="discount_price" class="layui-input" lay-verify="required" placeholder="割引価格を入力してください" value="0">
                    </div>
                </div>

                <div class="layui-form-item">
                    <label class="layui-form-label">仮想販売数</label>
                    <div class="layui-input-block">
                        <input type="text" name="virtual_sales" class="layui-input" lay-verify="required" placeholder="仮想販売数を入力してください" value="0">
                    </div>
                </div>

                <div class="layui-form-item">
                    <label class="layui-form-label">並び順</label>
                    <div class="layui-input-block">
                        <input type="number" name="sort" class="layui-input" lay-affix="number" placeholder="並び順を入力してください" value="0">
                    </div>
                </div>

                <!-- ドキュメント：https://xm-select.com/file/xm-select/v1.2.4/#/basic/use -->
                <div class="layui-form-item">
                    <label class="layui-form-label">複数選択</label>
                    <div class="layui-input-block">
                        <div id="demo1" class="xm-select-demo"></div>
                    </div>
                </div>

                <div class="layui-form-item layui-form-text">
                    <label class="layui-form-label">備考</label>
                    <div class="layui-input-block">
                        <textarea name="remark" class="layui-textarea" placeholder="備考を入力してください"></textarea>
                    </div>
                </div>
            </div>
            <div class="layui-col-xl7 layui-col-lg7 layui-col-md12 layui-col-sm12 layui-col-xs12">
                <div class="layui-form-item layui-form-text">
                    <label class="layui-form-label">商品説明</label>
                    <div class="layui-input-block">
                        {!!editor_textarea('','describe') !!}
                    </div>
                </div>
            </div>
        </div>

        <div class="hr-line"></div>
        <div class="layui-form-item text-center">
            <button type="submit" class="layui-btn layui-btn-normal layui-btn-sm" lay-submit>確認</button>
            <button type="reset" class="layui-btn layui-btn-primary layui-btn-sm">リセット</button>
        </div>

    </form>
</div>
<script src="/static/common/js/marked.js?v={{$version}}"></script>
@include('admin.layout.foot')
