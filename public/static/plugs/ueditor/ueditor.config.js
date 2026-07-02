/**
 * ueditor plus 完全設定項目
 * ここでエディター全体の機能を設定できます
 */
/**************************ヒント********************************
 * コメントアウトされている設定項目はすべて UEditor のデフォルト値です。
 * デフォルト設定を変更する前に、そのパラメーターの実際の用途を十分に確認してください。
 * 主な変更方法は2つあります。ここでコメントを解除して対応するパラメーターを変更する方法と、エディターをインスタンス化するときに対応するパラメーターを渡す方法です。
 * エディターをアップグレードする際は、旧版設定ファイルで新版設定ファイルを直接置き換えられます。旧版設定ファイルに新機能用パラメーターがなくても、スクリプトエラーを心配する必要はありません。
 **************************ヒント********************************/

(function () {
    // リソースファイルのルートパス。ページがルートディレクトリにない場合は、このパスを変更してください
    // 通常は静的リソース CDN のアドレスに設定できます
    window.UEDITOR_HOME_URL = "/static/plugs/ueditor/";
    var URL, CORS_URL;
    if (window.UEDITOR_HOME_URL) {
        URL = window.UEDITOR_HOME_URL;
    } else if (window.__msCDN) {
        URL = window.__msCDN + 'asset/vendor/ueditor/';
    } else if (window.__msRoot) {
        URL = window.__msRoot + 'asset/vendor/ueditor/';
    } else {
        URL = getUEBasePath();
    }
    // クロスオリジン可能な静的リソースリクエストが必要です。主にポップアップページなどの静的リソースに使用します
    // 通常は静的リソース CDN のアドレスに設定できます
    if (window.UEDITOR_CORS_URL) {
        CORS_URL = window.UEDITOR_CORS_URL;
    } else if (window.__msRoot) {
        CORS_URL = window.__msRoot + 'asset/vendor/ueditor/';
    } else if (window.UEDITOR_HOME_URL) {
        CORS_URL = window.UEDITOR_HOME_URL;
    } else {
        CORS_URL = getUEBasePath();
    }

    /**
     * 設定項目本体。ここでパスに関係する設定は URL 変数を忘れないでください。
     */
    window.UEDITOR_CONFIG = {

        // エディターインスタンスにパスを追加します。これはコメントアウトできません
        UEDITOR_HOME_URL: URL,
        // クロスオリジン可能な静的リソースリクエストが必要です。主にポップアップページなどの静的リソースに使用します
        UEDITOR_CORS_URL: CORS_URL,

        // Debugモードを有効にするか
        debug: false,

        // サーバー共通リクエストインターフェースパス
        serverUrl: "/" + (window.CONFIG.ADMIN || 'admin') + "/ajax/uploadUEditor",

        // サーバーから設定を取得
        loadConfigFromServer: true,

        // サーバー共通リクエストヘッダー情報。すべてのリクエストにこの情報が付与されます
        serverHeaders: {
            // 'Authorization': 'Bearer xxx'
            'X-Csrf-Token': window.CONFIG.CSRF_TOKEN
        },
        // サーバー戻り値の共通変換方法。ここで戻り値を一括処理できます
        serverResponsePrepare: function (res) {
            // console.log('serverResponsePrepare', res);
            return res;
        },

        //ツールバー上のすべての機能ボタンとドロップダウンは、エディターインスタンス作成時に必要に応じて再定義できます
        toolbars: [
            [
                "fullscreen",   // 全画面
                "source",       // ソースコード
                "|",
                "undo",         // 元に戻す
                "redo",         // やり直し
                "|",
                "bold",         // 太字
                "italic",       // 斜体
                "underline",    // 下線
                "fontborder",   // 文字枠
                "strikethrough",// 取り消し線
                "superscript",  // 上付き
                "subscript",    // 下付き
                "removeformat", // 書式クリア
                "formatmatch",  // 書式コピー
                "autotypeset",  // 自動組版
                "blockquote",   // 引用
                "pasteplain",   // プレーンテキスト貼り付けモード
                "|",
                "forecolor",    // 文字色
                "backcolor",    // 背景色
                "insertorderedlist",   // 順序付きリスト
                "insertunorderedlist", // 順序なしリスト
                "selectall",    // 全選択
                "cleardoc",     // ドキュメントを空にする
                "|",
                "rowspacingtop",// 段落前間隔
                "rowspacingbottom",    // 段落後間隔
                "lineheight",          // 行間
                "|",
                "customstyle",         // カスタムタイトル
                "paragraph",           // 段落形式
                "fontfamily",          // フォント
                "fontsize",            // フォントサイズ
                "|",
                "directionalityltr",   // 左から右へ入力
                "directionalityrtl",   // 右から左へ入力
                "indent",              // 先頭行インデント
                "|",
                "justifyleft",         // 左揃え
                "justifycenter",       // 中央揃え
                "justifyright",
                "justifyjustify",      // 両端揃え
                "|",
                "touppercase",         // 英字大文字
                "tolowercase",         // 英字小文字
                "|",
                "link",                // ハイパーリンク
                "unlink",              // リンク解除
                "anchor",              // アンカー
                "|",
                "imagenone",           // 画像デフォルト
                "imageleft",           // 画像左フロート
                "imagecenter",         // 画像中央
                "imageright",          // 画像右フロート
                "|",
                "simpleupload",        // 単一画像アップロード
                "insertimage",         // 複数画像アップロード
                "emotion",             // 絵文字
                "scrawl",              // 落書き
                "insertvideo",         // 動画
                "insertaudio",         // 音声
                "attachment",          // 添付ファイル
                "insertframe",         // Iframe挿入
                "insertcode",          // コード挿入
                "pagebreak",           // 改ページ
                "template",            // テンプレート
                "background",          // 背景
                "formula",             // 数式
                "|",
                "horizontal",          // 区切り線
                "date",                // 日付
                "time",                // 時刻
                "spechars",            // 特殊文字
                "wordimage",           // Word画像の保存
                "|",
                "inserttable",         // 表を挿入
                "deletetable",         // 表を削除
                "insertparagraphbeforetable",     // 表の前に行を挿入
                "insertrow",           // 前に行を挿入
                "deleterow",           // 行を削除
                "insertcol",           // 前に列を挿入
                "deletecol",           // 列を削除
                "mergecells",          // 複数セルを結合
                "mergeright",          // 右方向にセル結合
                "mergedown",           // 下方向にセル結合
                "splittocells",        // セルを完全分割
                "splittorows",         // 行に分割
                "splittocols",         // 列に分割
                "|",
                "print",               // 印刷
                "preview",             // プレビュー
                "searchreplace",       // 検索置換
                "|",
                "contentimport",
                "help",                // ヘルプ
            ]
        ]

        // カスタムツールバーボタンクリック。true を返すとクリック処理済みとなり、デフォルトイベントを阻止します
        , toolbarCallback: function (cmd, editor) {
            // console.log('toolbarCallback',cmd, editor);
            // switch(cmd){
            //   case 'insertimage':
            //     editor.execCommand('insertHtml', '<p><img src="xxxxx" /></p>');
            //     console.log('toolbarCallback',cmd, editor)
            //     return true;
            //   case 'insertvideo':
            //     editor.execCommand('insertHtml', '<p><iframe src="xxxxx" /></p>');
            //     console.log('toolbarCallback',cmd, editor)
            //     return true;
            //   case 'attachment':
            //     console.log('toolbarCallback',cmd, editor)
            //     editor.execCommand('insertHtml', '<p><a href="xxx.zip">ファイルをダウンロード</a></p>');
            //     return true;
            // }
        }

        // カスタムアップロード機能
        , uploadServiceEnable: false
        // カスタムアップロード関数。この関数内でカスタムアップロードロジックを実装してください
        // type アップロードタイプ。image 画像、video 動画、audio 音声、attachment 添付ファイル
        // file 文件对象
        // callback コールバック関数。アップロード完了後に callback.success、callback.error、callback.progress を呼び出してください
        // option アップロード設定。その他の将来拡張用設定
        , uploadServiceUpload: function (type, file, callback, option) {
            console.log('uploadServiceUpload', type, file, callback, option);
            // var i = 0;
            // var call = function(){
            //     i++;
            //     if(i > 3){
            //         callback.success({
            //             "state": "SUCCESS",
            //             "url": "https://ms-assets.modstart.com/demo/modstart.jpg",
            //         })
            //         return;
            //     }
            //     setTimeout(function(){
            //         callback.progress(0.3 * i);
            //         call();
            //     },500);
            // }
            // call();
        }

        // 画像挿入カスタム設定
        , imageConfig: {
            // ローカルアップロード禁止
            disableUpload: false,
            // オンライン管理禁止
            disableOnline: false,
            // カスタム選択ボタン
            selectCallback: null,
            // selectCallback: function(editor,cb){
            //     console.log('selectCallback',cb);
            //     setTimeout(function(){
            //       cb({
            //         path:'https://www.baidu.com/img/PCtm_d9c8750bed0b3c7d089fa7d55720d6cf.png',
            //         name:'テスト画像'
            //       });
            //     },1000);
            // }
        }

        // 動画挿入設定
        , videoConfig: {
            // ローカルアップロード禁止,
            disableUpload: false,
            // カスタム選択ボタン
            selectCallback: null,
            // selectCallback: function(editor,cb){
            //     console.log('selectCallback',cb);
            //     setTimeout(function(){
            //       cb({
            //         path:'https://www.bilibili.com/video/BV1y44y1g7NR?spm_id_from=333.1007.tianma.1-1-1.click',
            //         name:'テスト動画'
            //       });
            //     },1000);
            // }
        }

        // 音声挿入設定
        , audioConfig: {
            // ローカルアップロード禁止,
            disableUpload: false,
            // カスタム選択ボタン
            selectCallback: null,
            // selectCallback: function(editor,cb){
            //     console.log('selectCallback',cb);
            //     setTimeout(function(){
            //       cb({
            //         path:'https://example.com/test.mp3',
            //         name:'テスト音声'
            //       });
            //     },1000);
            // }
        }

        // 数式設定
        , formulaConfig: {
            // 数式渲染链接テンプレート
            imageUrlTemplate: 'https://r.latexeasy.com/image.svg?{}',
            // エディターモード plain live
            editorMode: 'live',
            // エディターアドレス
            editorLiveServer: 'https://latexeasy.com',
        }

        // 自動保存
        , autoSaveEnable: true
        // 浏览器初始化时自动恢复上一次的内容
        , autoSaveRestore: false
        // 自動保存Key，为空时根据网址自动计算
        , autoSaveKey: null

        //当鼠标放在工具栏上时显示的tooltipヒント,留空支持自动多语言配置，否则以配置值为准
        //,labelMap:{
        //    'anchor':'', 'undo':''
        //}

        //语言配置项,默认是zh-cn。有需要的话也可以使用如下这样的方式来自动多语言切换，当然，前提条件是lang文件夹下存在对应的语言文件：
        //lang值也可以通过自动获取 (navigator.language||navigator.browserLanguage ||navigator.userLanguage).toLowerCase()
        //,lang:"zh-cn"
        //,langPath:URL +"lang/"

        //主题配置项,默认是default。有需要的话也可以使用如下这样的方式来自动多主题切换，当然，前提条件是themes文件夹下存在对应的主题文件：
        //现有如下皮肤:default
        //,theme:'default'
        //,themePath:URL +"themes/"

        //,zIndex : 900     //编辑器层级的基数,默认是900

        //针对getAllHtml方法，会在对应的head标签中增加该编码设置。
        //,charset:"utf-8"

        //若实例化编辑器的页面手动修改的domain，此处需要设置为true
        //,customDomain:false

        // 默认显示编辑器
        //,isShow : true

        // 提交表单时，服务器获取编辑器提交内容的所用的参数，多实例时可以给容器name属性，会将name给定的值最为每个实例的键值，不用每次实例化的时候都设置这个值
        //,textarea:'editorValue'

        // 初始化编辑器的内容，也可以通过 textarea/script 给值
        , initialContent: ''

        //,autoClearinitialContent:true //エディター初期内容を自動クリアするか。focus属性がtrueでこれもtrueの場合、初期化直後にトリガーされ内容が見えなくなります

        // 初始化时，是否让编辑器获得焦点
        , focus: false

        // 編集エリアカスタムスタイル。カスタムする場合はpタグに行高を設定推奨。入力時の跳ねを防止
        , initialStyle: '' // p{line-height:1em}

        //,iframeJsUrl: '' //给编辑区域的iframe引入一个js文件
        //,iframeCssUrl: URL + '/themes/iframe.css' //给编辑区域的iframe引入一个css文件
        // 给编辑器引入更多样式文件
        //,iframeCssUrlsAddition: []

        // 先頭行インデント距离,默认是 2em
        , indentValue: '2em'

        // 初始化编辑器宽度,默认 1000
        // ,initialFrameWidth:1000
        // 初始化编辑器高度,默认 320
        // ,initialFrameHeight:320

        // 编辑器初始化结束后,编辑区域是否是只读的，默认是false
        , readonly: false

        // getContent时，是否删除空的inlineElement节点（包括嵌套的情况）
        , autoClearEmptyNode: true

        // 启用拖放上传
        //,enableDragUpload: true
        // 启用粘贴上传
        //,enablePasteUpload: true

        // 启用图片拉伸缩放
        //,imageScaleEnabled: true

        // 是否开启初始化时即全画面，默认关闭
        , fullscreen: false

        // 画像操作のフローティングレイヤー、デフォルトは有効
        //,imagePopup:true

        // 自动同步编辑器要提交的数据
        //,autoSyncData:true
        // 是否开启絵文字本地化，默认关闭。若要开启请确保emotion文件夹下包含官网提供的images絵文字文件夹
        //,emotionLocalization:false

        // 貼り付け時にタグのみ保持し、全属性を除去
        //,retainOnlyLabelPasted: false

        // デフォルトでプレーンテキスト貼り付けにするか。false=無効、true=有効
        //,pasteplain:false
        // プレーンテキスト貼り付けモード下的过滤规则
        //'filterTxtRules' : function(){
        //    function transP(node){
        //        node.tagName = 'p';
        //        node.setStyle();
        //    }
        //    return {
        //        //直接删除及其字节点内容
        //        '-' : 'script style object iframe embed input select',
        //        'p': {$:{}},
        //        'br':{$:{}},
        //        'div':{'$':{}},
        //        'li':{'$':{}},
        //        'caption':transP,
        //        'th':transP,
        //        'tr':transP,
        //        'h1':transP,'h2':transP,'h3':transP,'h4':transP,'h5':transP,'h6':transP,
        //        'td':function(node){
        //            //没有内容的td直接删掉
        //            var txt = !!node.innerText();
        //            if(txt){
        //                node.parentNode.insertAfter(UE.uNode.createText(' &nbsp; &nbsp;'),node);
        //            }
        //            node.parentNode.removeChild(node,node.innerText())
        //        }
        //    }
        //}()

        // 提交到后台的数据是否包含整个html字符串
        , allHtmlEnabled: false

        //順序付きリスト的下拉配置,值留空时支持多语言自动识别，若配置值，则以此值为准
        //,'insertorderedlist':{
        //     'decimal' : '' ,         //'1,2,3...'
        //     'lower-alpha' : '' ,    // 'a,b,c...'
        //     'lower-roman' : '' ,    //'i,ii,iii...'
        //     'upper-alpha' : '' , lang   //'A,B,C'
        //     'upper-roman' : ''      //'I,II,III...'
        //}

        //insertunorderedlist
        //順序なしリスト的下拉配置，值留空时支持多语言自动识别，若配置值，则以此值为准
        //,insertunorderedlist : { //自定的样式
        //    'circle' : '',  // '○ 小圆圈'
        //    'disc' : '',    // '● 小圆点'
        //    'square' : ''   //'■ 小方块'
        //}
        //,listDefaultPaddingLeft : '30'//默认的左边缩进的基数倍
        //,listiconpath : 'http://bs.baidu.com/listicon/'//自定义标号的路径
        //,maxListLevel : 3 //限制可以tab的级数, 设置-1为不限制

        //,autoTransWordToList:false  //禁止word中粘贴进来的列表自动变成列表标签

        // フォント设置 label 留空支持多语言自动切换，若配置，则以配置值为准
        //,'fontfamily':[
        //    { label:'',name:'songti',val:'宋体,SimSun'},
        //    { label:'',name:'kaiti',val:'楷体,楷体_GB2312, SimKai'},
        //    { label:'',name:'yahei',val:'微软雅黑,Microsoft YaHei'},
        //    { label:'',name:'heiti',val:'黑体, SimHei'},
        //    { label:'',name:'lishu',val:'隶书, SimLi'},
        //    { label:'',name:'andaleMono',val:'andale mono'},
        //    { label:'',name:'arial',val:'arial, helvetica,sans-serif'},
        //    { label:'',name:'arialBlack',val:'arial black,avant garde'},
        //    { label:'',name:'comicSansMs',val:'comic sans ms'},
        //    { label:'',name:'impact',val:'impact,chicago'},
        //    { label:'',name:'timesNewRoman',val:'times new roman'}
        //]

        // フォントサイズ
        //,'fontsize':[10, 11, 12, 14, 16, 18, 20, 24, 36]

        // 段落形式 值留空时支持多语言自动识别，若配置，则以配置值为准
        //,'paragraph':{'p':'', 'h1':'', 'h2':'', 'h3':'', 'h4':'', 'h5':'', 'h6':''}

        // 段间距 值和显示的名字相同
        //,'rowspacingtop':['5', '10', '15', '20', '25']

        // 段间距 值和显示的名字相同
        //,'rowspacingbottom':['5', '10', '15', '20', '25']

        //行内间距 值和显示的名字相同
        //,'lineheight':['1', '1.5','1.75','2', '3', '4', '5']

        // customstyle
        //カスタムスタイル。国際化非対応、ここに設定した値がそのまま表示
        //block的元素是依据设置段落的逻辑设置的，inline的元素依据BIU的逻辑设置
        //尽量使用一些常用的标签
        //参数说明
        //tag 使用的标签名字
        //label 显示的名字也是用来标识不同类型的标识符，注意这个值每个要不同，
        //style 添加的样式
        //每一个对象就是一个自定义的样式
        //,'customstyle':[
        //    {tag:'h1', name:'tc', label:'', style:'border-bottom:#ccc 2px solid;padding:0 4px 0 0;text-align:center;margin:0 0 20px 0;'},
        //    {tag:'h1', name:'tl',label:'', style:'border-bottom:#ccc 2px solid;padding:0 4px 0 0;margin:0 0 10px 0;'},
        //    {tag:'span',name:'im', label:'', style:'font-style:italic;font-weight:bold'},
        //    {tag:'span',name:'hi', label:'', style:'font-style:italic;font-weight:bold;color:rgb(51, 153, 204)'}
        //]

        // 打开右键菜单功能
        , enableContextMenu: true
        //右键菜单的内容，可以参考plugins/contextmenu.js里边的默认菜单的例子，label留空支持国际化，否则以此配置为准
        //,contextMenu:[
        //    {
        //        label:'',       //显示的名称
        //        cmdName:'selectall',//执行的command命令，当点击这个右键菜单时
        //        //exec可选，有了exec就会在点击时执行这个function，优先级高于cmdName
        //        exec:function () {
        //            //this是当前编辑器的实例
        //            //this.ui._dialogs['inserttableDialog'].open();
        //        }
        //    }
        //]

        //クイックメニュー
        , shortcutMenu: [
            // "fontfamily",   // フォント
            // "fontsize",     // フォントサイズ
            "bold",         // 太字
            "italic",       // 斜体
            "underline",    // 下線
            "strikethrough",// 取り消し線
            "fontborder",   // 文字枠
            "forecolor",    // 文字色
            // "shadowcolor", // フォント阴影
            "backcolor",   // 背景色
            "imagenone",
            "imageleft",
            "imagecenter",
            "imageright",
            "insertimage",
            "formula",
            // "justifyleft",    // 左揃え
            // "justifycenter",  // 中央揃え
            // "justifyright",   // 居右对齐
            // "justifyjustify", // 両端揃え
            // "textindent",  // 先頭行インデント
            // "rowspacingtop",     // 段落前間隔
            // "rowspacingbottom",  // 段落後間隔
            // "outpadding",        // 两侧距离
            // "lineheight",           // 行間
            // "letterspacing" ,    // 字间距
            // "insertorderedlist",    // 順序付きリスト
            // "insertunorderedlist",  // 順序なしリスト
            // "superscript",    // 上付き
            // "subscript",      // 下付き
            // "link",           // ハイパーリンク
            // "unlink",         // リンク解除
            // "touppercase",    // 英字大文字
            // "tolowercase"     // 英字小文字
        ]

        // 要素パスを有効にするか、デフォルトは表示
        , elementPathEnabled: true
        // 文字数カウントを有効にするか
        , wordCount: true
        // 允许的最大字符数
        , maximumWords: 10000
        //字数统计ヒント，{#count} 代表当前字数，{#leave}代表还可以输入多少字符数,留空支持多语言自动切换，否则按此配置显示
        //,wordCountMsg:''   //当前已输入 {#count} 个字符，您还可以输入{#leave} 个字符
        //超出字数限制ヒント  留空支持多语言自动切换，否则按此配置显示
        //,wordOverFlowMsg:''    //<span style="color:red;">你输入的字符个数已经超出最大允许值，服务器可能会拒绝保存！</span>

        // 点击tab键时移动的距离,tabSize倍数，tabNode什么字符做为单位
        //,tabSize:4
        //,tabNode:'&nbsp;'

        // 書式クリア时可以删除的标签
        //,removeFormatTags:'b,big,code,del,dfn,em,font,i,ins,kbd,q,samp,small,span,strike,strong,sub,sup,tt,u,var'
        // 書式クリア时可以删除的属性
        //,removeFormatAttributes:'class,style,lang,width,height,align,hspace,valign'

        // 可以最多元に戻す退回的次数，默认20
        , maxUndoCount: 20
        // 入力文字数がこの値を超えた時、状態を保存
        , maxInputCount: 1

        // 自動伸長するか、デフォルトtrue
        , autoHeightEnabled: true

        // 是否可以拉伸长高，默认true(当开启时，自动长高失效)
        //,scaleEnabled:false
        //,minFrameWidth:800    //エディター最小幅、デフォルト800

        // エディター最小高さ、デフォルト220
        , minFrameHeight: 220

        // ツールバー位置固定するか、デフォルトtrue
        , autoFloatEnabled: true
        // 浮动时工具栏距离浏览器顶部的高度，用于某些具有固定头部的页面
        , topOffset: 0
        // 编辑器底部距离工具栏高度(如果参数大于等于编辑器高度，则设置无效)
        , toolbarTopOffset: 0

        //设置远程图片是否抓取到本地保存
        , catchRemoteImageEnable: true //设置是否抓取远程图片

        //pageBreakTag
        //改ページ标识符,默认是_ueditor_page_break_tag_
        //,pageBreakTag:'_ueditor_page_break_tag_'

        // 自動組版参数
        , autotypeset: {
            // 合并空行
            mergeEmptyline: true,
            // 去掉冗余的class
            removeClass: true,
            // 去掉空行
            removeEmptyline: false,
            // 段落的排版方式，可以是 left,right,center,justify 去掉这个属性表示不执行排版
            textAlign: "left",
            // 图片的浮动方式，独占一行剧中,左右浮动，默认: center,left,right,none 去掉这个属性表示不执行排版
            imageBlockLine: "center",
            // 根据规则过滤没事粘贴进来的内容
            pasteFilter: false,
            // 去掉所有的内嵌フォントサイズ，使用编辑器默认的フォントサイズ
            clearFontSize: false,
            // 去掉所有的内嵌フォント，使用编辑器默认的フォント
            clearFontFamily: false,
            // 去掉空节点
            removeEmptyNode: false,
            // 可以去掉的标签
            removeTagNames: {div: 1},
            // 行首缩进
            indent: false,
            // 行首缩进的大小
            indentValue: "2em",
            // 全角转半角
            bdc2sb: false,
            // 半角转全角
            tobdc: false
        }

        //テーブルのドラッグ可否
        //,tableDragable: true

        //sourceEditor
        //源码的查看方式,codemirror 是代码高亮，textarea是文本框,默认是codemirror
        //注意默认codemirror只能在ie8+和非ie中使用
        //,sourceEditor:"codemirror"
        //如果sourceEditor是codemirror，还用配置一下两个参数
        //codeMirrorJsUrl js加载的路径，默认是 URL + "third-party/codemirror/codemirror.js"
        //,codeMirrorJsUrl:URL + "third-party/codemirror/codemirror.js"
        //codeMirrorCssUrl css加载的路径，默认是 URL + "third-party/codemirror/codemirror.css"
        //,codeMirrorCssUrl:URL + "third-party/codemirror/codemirror.css"
        //编辑器初始化完成后是否进入源码模式，默认为否。
        //,sourceEditorFirst:false

        //iframeUrlMap
        //dialog内容的路径 ～会被替换成URL,垓属性一旦打开，将覆盖所有的dialog的默认路径
        //,iframeUrlMap:{
        //    'anchor':'~/dialogs/anchor/anchor.html',
        //}

        //allowLinkProtocol 允许的链接地址，有这些前缀的链接地址不会自动添加http
        //, allowLinkProtocols: ['http:', 'https:', '#', '/', 'ftp:', 'mailto:', 'tel:', 'git:', 'svn:']

        //默认过滤规则相关配置项目
        //,disabledTableInTable:true  //禁止表格嵌套
        // 允许进入编辑器的 div 标签自动变成 p 标签
        , allowDivTransToP: true
        // 默认产出的数据中的color自动从rgb格式变成16进制格式
        , rgb2Hex: true,

        tipError: function (msg, param) {
            if (window && window.MS && window.MS.dialog) {
                window.MS.dialog.tipError(msg);
            } else {
                alert(msg);
            }
        }
    };

    function getUEBasePath(docUrl, confUrl) {
        return getBasePath(
            docUrl || self.document.URL || self.location.href,
            confUrl || getConfigFilePath()
        );
    }

    function getConfigFilePath() {
        var configPath = document.getElementsByTagName("script");

        return configPath[configPath.length - 1].src;
    }

    function getBasePath(docUrl, confUrl) {
        var basePath = confUrl;

        if (/^(\/|\\\\)/.test(confUrl)) {
            basePath =
                /^.+?\w(\/|\\\\)/.exec(docUrl)[0] + confUrl.replace(/^(\/|\\\\)/, "");
        } else if (!/^[a-z]+:/i.test(confUrl)) {
            docUrl = docUrl.split("#")[0].split("?")[0].replace(/[^\\\/]+$/, "");

            basePath = docUrl + "" + confUrl;
        }

        return optimizationPath(basePath);
    }

    function optimizationPath(path) {
        var protocol = /^[a-z]+:\/\//.exec(path)[0],
            tmp = null,
            res = [];

        path = path.replace(protocol, "").split("?")[0].split("#")[0];

        path = path.replace(/\\/g, "/").split(/\//);

        path[path.length - 1] = "";

        while (path.length) {
            if ((tmp = path.shift()) === "..") {
                res.pop();
            } else if (tmp !== ".") {
                res.push(tmp);
            }
        }

        return protocol + res.join("/");
    }

    window.UE = {
        getUEBasePath: getUEBasePath
    };
})();
