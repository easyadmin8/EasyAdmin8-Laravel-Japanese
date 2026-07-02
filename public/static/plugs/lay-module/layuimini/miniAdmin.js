/**
 * date:2020/02/27
 * author:Mr.Chung
 * version:2.0
 * description:layuimini メインフレームワーク拡張
 */


define(["jquery", "miniMenu", "miniTheme", "miniTab", "colorMode"], function ($, miniMenu, miniTheme, miniTab, colorMode) {

    var $ = layui.$,
        layer = layui.layer,
        element = layui.element;

    if (!/http(s*):\/\//.test(location.href)) {
        var tips = "まずプロジェクトをWebコンテナ（Apache/Tomcat/Nginx/IIS/等）にデプロイしてください。一部のデータが表示されない可能性があります";
        return layer.alert(tips);
    }


    var miniAdmin = {

        /**
         * 管理画面フレームワーク初期化
         * @param options.iniUrl   管理画面初期化APIアドレス
         * @param options.clearUrl   キャッシュクリアAPI
         * @param options.urlHashLocation URL地址hash定位
         * @param options.bgColorDefault 默认皮肤
         * @param options.multiModule マルチモジュール有効
         * @param options.menuChildOpen 子メニュー展開
         * @param options.loadingTime 読み込み時間
         * @param options.pageAnim iframeウィンドウアニメーション
         * @param options.maxTabNum 最大Tab数
         */
        render: function (options) {
            options.iniUrl = options.iniUrl || null;
            options.clearUrl = options.clearUrl || null;
            options.urlHashLocation = options.urlHashLocation || false;
            options.bgColorDefault = options.bgColorDefault || 0;
            options.multiModule = options.multiModule || false;
            options.menuChildOpen = options.menuChildOpen || false;
            options.loadingTime = options.loadingTime || 1;
            options.pageAnim = options.pageAnim || false;
            options.maxTabNum = options.maxTabNum || 20;
            $.getJSON(options.iniUrl, function (data) {
                if (data == null) {
                    miniAdmin.error('メニュー情報がありません')
                } else {
                    miniAdmin.renderLogo(data.logoInfo);
                    miniAdmin.renderClear(options.clearUrl);
                    miniAdmin.renderHome(data.homeInfo);
                    miniAdmin.renderAnim(options.pageAnim);
                    miniAdmin.listen();
                    miniMenu.render({
                        menuList: data.menuInfo,
                        multiModule: options.multiModule,
                        menuChildOpen: options.menuChildOpen
                    });
                    miniTab.render({
                        filter: 'layuiminiTab',
                        urlHashLocation: options.urlHashLocation,
                        multiModule: options.multiModule,
                        menuChildOpen: options.menuChildOpen,
                        maxTabNum: options.maxTabNum,
                        menuList: data.menuInfo,
                        homeInfo: data.homeInfo,
                        listenSwichCallback: function () {
                            miniAdmin.renderDevice();
                        }
                    });
                    miniTheme.render({
                        bgColorDefault: options.bgColorDefault,
                        listen: true,
                    });
                    miniAdmin.deleteLoader(options.loadingTime);
                }
            }).fail(function () {
                miniAdmin.error('メニューAPIにエラーがあります');
            });
        },

        /**
         * ロゴ初期化
         * @param data
         */
        renderLogo: function (data) {
            var html = '<a href="' + data.href + '"><img src="' + data.image + '" alt="logo"><h1>' + data.title + '</h1></a>';
            $('.layuimini-logo').html(html);
        },

        /**
         * ホーム初期化
         * @param data
         */
        renderHome: function (data) {
            sessionStorage.setItem('layuiminiHomeHref', data.href);
            $('#layuiminiHomeTabId').html('<span class="layuimini-tab-active"></span><span class="disable-close">' + data.title + '</span><i class="layui-icon layui-unselect layui-tab-close">ဆ</i>');
            $('#layuiminiHomeTabId').attr('lay-id', data.href);
            $('#layuiminiHomeTabIframe').html('<iframe width="100%" height="100%" frameborder="no" border="0" marginwidth="0" marginheight="0"  src="' + data.href + '"></iframe>');
        },

        /**
         * キャッシュアドレス初期化
         * @param clearUrl
         */
        renderClear: function (clearUrl) {
            $('.layuimini-clear').attr('data-href', clearUrl);
        },

        /**
         * iframeウィンドウアニメーション初期化
         * @param anim
         */
        renderAnim: function (anim) {
            if (anim) {
                $('#layuimini-bg-color').after('<style id="layuimini-page-anim">' +
                    '.layui-tab-item.layui-show {animation:moveTop 1s;-webkit-animation:moveTop 1s;animation-fill-mode:both;-webkit-animation-fill-mode:both;position:relative;height:100%;-webkit-overflow-scrolling:touch;}\n' +
                    '@keyframes moveTop {0% {opacity:0;-webkit-transform:translateY(30px);-ms-transform:translateY(30px);transform:translateY(30px);}\n' +
                    '    100% {opacity:1;-webkit-transform:translateY(0);-ms-transform:translateY(0);transform:translateY(0);}\n' +
                    '}\n' +
                    '@-o-keyframes moveTop {0% {opacity:0;-webkit-transform:translateY(30px);-ms-transform:translateY(30px);transform:translateY(30px);}\n' +
                    '    100% {opacity:1;-webkit-transform:translateY(0);-ms-transform:translateY(0);transform:translateY(0);}\n' +
                    '}\n' +
                    '@-moz-keyframes moveTop {0% {opacity:0;-webkit-transform:translateY(30px);-ms-transform:translateY(30px);transform:translateY(30px);}\n' +
                    '    100% {opacity:1;-webkit-transform:translateY(0);-ms-transform:translateY(0);transform:translateY(0);}\n' +
                    '}\n' +
                    '@-webkit-keyframes moveTop {0% {opacity:0;-webkit-transform:translateY(30px);-ms-transform:translateY(30px);transform:translateY(30px);}\n' +
                    '    100% {opacity:1;-webkit-transform:translateY(0);-ms-transform:translateY(0);transform:translateY(0);}\n' +
                    '}' +
                    '</style>');
            }
        },

        fullScreen: function () {
            var el = document.documentElement;
            var rfs = el.requestFullScreen || el.webkitRequestFullScreen;
            if (typeof rfs != "undefined" && rfs) {
                rfs.call(el);
            } else if (typeof window.ActiveXObject != "undefined") {
                var wscript = new ActiveXObject("WScript.Shell");
                if (wscript != null) {
                    wscript.SendKeys("{F11}");
                }
            } else if (el.msRequestFullscreen) {
                el.msRequestFullscreen();
            } else if (el.oRequestFullscreen) {
                el.oRequestFullscreen();
            } else if (el.webkitRequestFullscreen) {
                el.webkitRequestFullscreen();
            } else if (el.mozRequestFullScreen) {
                el.mozRequestFullScreen();
            } else {
                miniAdmin.error('ブラウザが全画面表示をサポートしていません！');
            }
        },

        /**
         * 全画面終了
         */
        exitFullScreen: function () {
            var el = document;
            var cfs = el.cancelFullScreen || el.webkitCancelFullScreen || el.exitFullScreen;
            if (typeof cfs != "undefined" && cfs) {
                cfs.call(el);
            } else if (typeof window.ActiveXObject != "undefined") {
                var wscript = new ActiveXObject("WScript.Shell");
                if (wscript != null) {
                    wscript.SendKeys("{F11}");
                }
            } else if (el.msExitFullscreen) {
                el.msExitFullscreen();
            } else if (el.oRequestFullscreen) {
                el.oCancelFullScreen();
            } else if (el.mozCancelFullScreen) {
                el.mozCancelFullScreen();
            } else if (el.webkitCancelFullScreen) {
                el.webkitCancelFullScreen();
            } else {
                miniAdmin.error('ブラウザが全画面表示をサポートしていません！');
            }
        },

        /**
         * 端末初期化
         */
        renderDevice: function () {
            if (miniAdmin.checkMobile()) {
                $('.layuimini-tool i').attr('data-side-fold', 1);
                $('.layuimini-tool i').attr('class', 'fa fa-outdent');
                $('.layui-layout-body').removeClass('layuimini-mini');
                $('.layui-layout-body').addClass('layuimini-all');
            }
        },


        /**
         * 読み込み時間初期化
         * @param loadingTime
         */
        deleteLoader: function (loadingTime) {
            $('.layuimini-loader').fadeOut();
        },

        /**
         * 成功
         * @param title
         * @returns {*}
         */
        success: function (title) {
            return layer.msg(title, {icon: 1, shade: this.shade, scrollbar: false, time: 2000, shadeClose: true});
        },

        /**
         * 失敗
         * @param title
         * @returns {*}
         */
        error: function (title) {
            return layer.msg(title, {icon: 2, shade: this.shade, scrollbar: false, time: 3000, shadeClose: true});
        },

        /**
         * スマートフォン判定
         * @returns {boolean}
         */
        checkMobile: function () {
            var ua = navigator.userAgent.toLocaleLowerCase();
            var pf = navigator.platform.toLocaleLowerCase();
            var isAndroid = (/android/i).test(ua) || ((/iPhone|iPod|iPad/i).test(ua) && (/linux/i).test(pf))
                || (/ucweb.*linux/i.test(ua));
            var isIOS = (/iPhone|iPod|iPad/i).test(ua) && !isAndroid;
            var isWinPhone = (/Windows Phone|ZuneWP7/i).test(ua);
            var clientWidth = document.documentElement.clientWidth;
            if (!isAndroid && !isIOS && !isWinPhone && clientWidth > 1024) {
                return false;
            } else {
                return true;
            }
        },

        /**
         * 監視
         */
        listen: function () {

            layui.form.on('switch(header-theme-mode)', function (data) {
                let checked = data.elem.checked;
                let mode = checked ? 'dark' : 'light';
                changeTheme(mode);
            });

            /**
             * ライト/ダークテーマ切替
             */
            const theme = colorMode.init({
                initialValue: 'light',
                storageKey: 'layuiminiElemStyleName',
                modes: {
                    auto: '',
                    light: 'normal',
                    dark: 'dark',
                },
                onChanged(mode, defaultHandler) {
                    const isAppearanceTransition =
                        document.startViewTransition && !window.matchMedia(`(prefers-reduced-motion: reduce)`).matches;
                    const isDark = mode === 'dark';
             //Windowsシステムのテーマ色に追従するが、選択した要素スタイルは保存できない
                    // var darkThemeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
                    // var preferredDark = darkThemeMediaQuery.matches;
                    // var currMode = preferredDark ? 'dark' : 'light';
                    // changeTheme(currMode);
                    $('#change-theme').attr('class', `layui-icon layui-icon-${isDark ? 'moon' : 'light'}`);

                    if (!isAppearanceTransition) {
                        defaultHandler();
                    } else {
                        rippleViewTransition(isDark, function () {
                            // アニメーション必要
                            document.documentElement.classList[isDark ? 'add' : 'remove']('dark');
                            defaultHandler();
                        });
                    }
                },
            });

            //エフェクト切替
            function rippleViewTransition(isDark, callback) {
                // https://github.com/vuejs/vitepress/pull/2347 より移植
                // Chrome 111+ 対応
                const x = event.clientX;
                const y = event.clientY;
                const endRadius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
                const transition = document.startViewTransition(function () {
                    callback && callback();
                });
                transition.ready.then(function () {
                    var clipPath = [`circle(0px at ${x}px ${y}px)`, `circle(${endRadius}px at ${x}px ${y}px)`];
                    document.documentElement.animate(
                        {
                            clipPath: isDark ? clipPath : [...clipPath].reverse(),
                        },
                        {
                            duration: 300,
                            easing: 'ease-in',
                            pseudoElement: isDark ? '::view-transition-new(root)' : '::view-transition-old(root)',
                        }
                    );
                });
            }

            //テーマ変更
            function changeTheme(mode) {
                switch (mode) {
                    case 'dark':
                        localStorage.setItem('layuiminiBgColorId', '1');
                        localStorage.setItem('layuiminiElemStyleName', 'dark');
                        changeBgColor(1);
                        break;
                    case 'light':
                        localStorage.setItem('layuiminiBgColorId', '0');
                        localStorage.setItem('layuiminiElemStyleName', 'normal');
                        changeBgColor(0);
                        break
                }
                window.onInitElemStyle()
            }

            //配色変更
            function changeBgColor(id) {
                $('.layuimini-color .color-content ul .layui-this').attr('class', '');
                $(this).attr('class', 'layui-this');
                localStorage.setItem('layuiminiBgColorId', id);
                miniTheme.render({
                    bgColorDefault: id,
                    listen: false,
                });
            }

            /**
             * クリア
             */
            $('body').on('click', '[data-clear]', function () {
                var loading = layer.load(0, {shade: false, time: 2 * 1000});
                sessionStorage.clear();

                // サーバー側クリアの要否判定
                var clearUrl = $(this).attr('data-href');
                if (clearUrl != undefined && clearUrl != '' && clearUrl != null) {
                    $.getJSON(clearUrl, function (data, status) {
                        layer.close(loading);
                        if (data.code != 1) {
                            return miniAdmin.error(data.msg);
                        } else {
                            return miniAdmin.success(data.msg);
                        }
                    }).fail(function () {
                        layer.close(loading);
                        return miniAdmin.error('キャッシュクリアAPIにエラーがあります');
                    });
                } else {
                    layer.close(loading);
                    return miniAdmin.success('キャッシュクリア完了');
                }
            });

            /**
             * リフレッシュ
             */
            $('body').on('click', '[data-refresh]', function () {
                $(".layui-tabs-item.layui-show").find("iframe")[0].contentWindow.location.reload();
                miniAdmin.success('リフレッシュ完了');
            });

            /**
             * ツールチップ監視
             */
            $("body").on("mouseenter", ".layui-nav-tree .menu-li", function () {
                if (miniAdmin.checkMobile()) {
                    return false;
                }
                var classInfo = $(this).attr('class'),
                    tips = $(this).prop("innerHTML"),
                    isShow = $('.layuimini-tool i').attr('data-side-fold');
                if (isShow == 0 && tips) {
                    tips = "<ul class='layuimini-menu-left-zoom layui-nav layui-nav-tree layui-this'><li class='layui-nav-item layui-nav-itemed'>" + tips + "</li></ul>";
                    window.openTips = layer.tips(tips, $(this), {
                        tips: [2, '#2f4056'],
                        time: 300000,
                        skin: "popup-tips",
                        success: function (el) {
                            var left = $(el).position().left - 10;
                            $(el).css({left: left});
                            element.render();
                        }
                    });
                }
            });

            $("body").on("mouseleave", ".popup-tips", function () {
                if (miniAdmin.checkMobile()) {
                    return false;
                }
                var isShow = $('.layuimini-tool i').attr('data-side-fold');
                if (isShow == 0) {
                    try {
                        layer.close(window.openTips);
                    } catch (e) {
                        console.log(e.message);
                    }
                }
            });


            /**
             * 全画面
             */
            $('body').on('click', '[data-check-screen]', function () {
                var check = $(this).attr('data-check-screen');
                if (check == 'full') {
                    miniAdmin.fullScreen();
                    $(this).attr('data-check-screen', 'exit');
                    $(this).html('<i class="fa fa-compress"></i>');
                } else {
                    miniAdmin.exitFullScreen();
                    $(this).attr('data-check-screen', 'full');
                    $(this).html('<i class="fa fa-arrows-alt"></i>');
                }
            });

            /**
             * マスクレイヤークリック
             */
            $('body').on('click', '.layuimini-make', function () {
                miniAdmin.renderDevice();
            });

        }
    };


    return miniAdmin;
});
