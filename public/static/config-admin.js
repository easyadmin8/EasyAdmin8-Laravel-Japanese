var BASE_URL = document.scripts[document.scripts.length - 1].src.substring(0, document.scripts[document.scripts.length - 1].src.lastIndexOf("/") + 1);
window.BASE_URL = BASE_URL;
require.config({
    urlArgs: "v=" + CONFIG.VERSION,
    baseUrl: BASE_URL,
    paths: {
        "jquery": ["plugs/jquery-4.x/jquery-4.0.0.min"],
        "echarts": ["plugs/echarts/echarts.min"],
        "echarts-theme": ["plugs/echarts/echarts-theme"],
        "easy-admin": ["plugs/easy-admin/easy-admin"],
        "layui": ["plugs/layui-v2.x/layui"],
        "miniAdmin": ["plugs/lay-module/layuimini/miniAdmin"],
        "miniMenu": ["plugs/lay-module/layuimini/miniMenu"],
        "miniTab": ["plugs/lay-module/layuimini/miniTab"],
        "miniTheme": ["plugs/lay-module/layuimini/miniTheme"],
        "miniTongji": ["plugs/lay-module/layuimini/miniTongji"],
        "treetable": ["plugs/lay-module/treetable-lay/treetable"],
        "tableSelect": ["plugs/lay-module/tableSelect/tableSelect"],
        "switchSelect": ["plugs/lay-module/switchSelect/switchSelect"],
        "iconPickerFa": ["plugs/lay-module/iconPicker/iconPickerFa"],
        "autocomplete": ["plugs/lay-module/autocomplete/autocomplete"],
        "xmSelect": ["plugs/xmSelect/xm-select"],
        "vue": ["plugs/vue-2.6.10/vue.min"],
        "swiper": ["plugs/swiper/swiper-bundle.min"],
        "colorMode": ["plugs/colorMode/colorMode"],
        "lazyload": ["plugs/lazyload/lazyload.min"],
    }
});

// パス設定情報
var PATH_CONFIG = {
    iconLess: BASE_URL + "plugs/font-awesome-7.x/scss/_variables.scss",
};
window.PATH_CONFIG = PATH_CONFIG;

// コントローラー対応JSの自動読み込みを初期化
window.addEventListener('load', function () {
    if ("undefined" != typeof CONFIG.AUTOLOAD_JS && CONFIG.AUTOLOAD_JS) {
        require([BASE_URL + CONFIG.CONTROLLER_JS_PATH], function (Controller) {
            if (typeof Controller[CONFIG.ACTION] == "function") {
                Controller[CONFIG.ACTION]()
            } else {
                console.error(`\r\nコントローラー対応JS ${CONFIG.CONTROLLER_JS_PATH} の監視に異常があります\r\n現在のJSファイルに ${CONFIG.ACTION} メソッドのリスナーが存在しません`)
            }
        }, function (e) {
            console.error(e);
        });
    }
})

