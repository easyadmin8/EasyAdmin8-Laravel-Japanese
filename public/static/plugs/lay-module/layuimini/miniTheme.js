/**
 * date:2020/02/28
 * author:Mr.Chung
 * version:2.0
 * description:layuimini tabフレームワーク拡張
 */
define(["jquery"], function ($) {
    var $ = layui.$,
        layer = layui.layer;

    var miniTheme = {

        /**
         * テーマ設定項目
         * @param bgcolorId
         * @returns {{headerLogo, menuLeftHover, headerRight, menuLeft, headerRightThis, menuLeftThis}|*|*[]}
         */
        config: function (bgcolorId) {
            var bgColorConfig = [
                {
                    headerRightBg: '#ffffff', //ヘッダー右側背景色
                    headerRightBgThis: '#e4e4e4', //ヘッダー右側選択時背景色,
                    headerRightColor: 'rgba(107, 107, 107, 0.7)', //ヘッダー右側文字色,
                    headerRightChildColor: 'rgba(107, 107, 107, 0.7)', //ヘッダー右側ドロップダウン文字色,
                    headerRightColorThis: '#565656', //ヘッダー右側マウス選択時,
                    headerRightNavMore: 'rgba(160, 160, 160, 0.7)', //ヘッダー右側追加ドロップダウン色,
                    headerRightNavMoreBg: '#1E9FFF', //ヘッダー右側追加ドロップダウンリスト選択時背景色,
                    headerRightNavMoreColor: '#ffffff', //ヘッダー右側追加ドロップダウンリスト文字色,
                    headerRightToolColor: '#565656', //ヘッダー縮小ボタンスタイル,
                    headerLogoBg: '#192027', //ロゴ背景色,
                    headerLogoColor: 'rgb(191, 187, 187)', //ロゴ文字色,
                    leftMenuNavMore: 'rgb(191, 187, 187)', //左側メニュー追加ドロップダウンスタイル,
                    leftMenuBg: '#28333E', //左側メニュー背景,
                    leftMenuBgThis: '#1E9FFF', //左側メニュー選択時背景,
                    leftMenuChildBg: '#0c0f13', //左側メニューサブメニュー背景,
                    leftMenuColor: 'rgb(191, 187, 187)', //左側メニュー文字色,
                    leftMenuColorThis: '#ffffff', //左側メニュー選択時文字色,
                    tabActiveColor: '#1e9fff', //タブ選択色,
                },
                {
                    headerRightBg: '#23262e', //ヘッダー右側背景色
                    headerRightBgThis: '#0c0c0c', //ヘッダー右側選択時背景色,
                    headerRightColor: 'rgba(255,255,255,.7)', //ヘッダー右側文字色,
                    headerRightChildColor: 'var(--lay-color-text-1)', //ヘッダー右側ドロップダウン文字色,
                    headerRightColorThis: 'rgba(255,255,255,.7)', //ヘッダー右側マウス選択時,
                    headerRightNavMore: 'rgba(255,255,255,.7)', //ヘッダー右側追加ドロップダウン色,
                    headerRightNavMoreBg: '#1aa094', //ヘッダー右側追加ドロップダウンリスト選択時背景色,
                    headerRightNavMoreColor: 'rgba(255,255,255,.7)', //ヘッダー右側追加ドロップダウンリスト文字色,
                    headerRightToolColor: '#bbe3df', //ヘッダー縮小ボタンスタイル,
                    headerLogoBg: '#0c0c0c', //ロゴ背景色,
                    headerLogoColor: 'rgba(255,255,255,.7)', //ロゴ文字色,
                    leftMenuNavMore: 'rgb(191, 187, 187)', //左側メニュー追加ドロップダウンスタイル,
                    leftMenuBg: '#23262e', //左側メニュー背景,
                    leftMenuBgThis: '#484849', //左側メニュー選択時背景,
                    leftMenuChildBg: '#23262e', //左側メニューサブメニュー背景,
                    leftMenuColor: 'rgba(255,255,255,.9)', //左側メニュー文字色,
                    leftMenuColorThis: 'rgba(255,255,255,.7)', //左側メニュー選択時文字色,
                    tabActiveColor: '#23262e', //タブ選択色,
                },
                {
                    headerRightBg: '#ffa4d1', //ヘッダー右側背景色
                    headerRightBgThis: '#bf7b9d', //ヘッダー右側選択時背景色,
                    headerRightColor: 'rgba(255,255,255,.7)', //ヘッダー右側文字色,
                    headerRightChildColor: 'var(--lay-color-text-1)', //ヘッダー右側ドロップダウン文字色,
                    headerRightColorThis: '#ffffff', //ヘッダー右側マウス選択時,
                    headerRightNavMore: 'rgba(255,255,255,.7)', //ヘッダー右側追加ドロップダウン色,
                    headerRightNavMoreBg: '#ffa4d1', //ヘッダー右側追加ドロップダウンリスト選択時背景色,
                    headerRightNavMoreColor: '#ffffff', //ヘッダー右側追加ドロップダウンリスト文字色,
                    headerRightToolColor: '#bbe3df', //ヘッダー縮小ボタンスタイル,
                    headerLogoBg: '#e694bd', //ロゴ背景色,
                    headerLogoColor: '#ffffff', //ロゴ文字色,
                    leftMenuNavMore: 'rgb(191, 187, 187)', //左側メニュー追加ドロップダウンスタイル,
                    leftMenuBg: '#1f1f1f', //左側メニュー背景,
                    leftMenuBgThis: '#737373', //左側メニュー選択時背景,
                    leftMenuChildBg: 'rgba(0,0,0,.3)', //左側メニューサブメニュー背景,
                    leftMenuColor: 'rgb(191, 187, 187)', //左側メニュー文字色,
                    leftMenuColorThis: '#ffffff', //左側メニュー選択時文字色,
                    tabActiveColor: '#ffa4d1', //タブ選択色,
                },
                {
                    headerRightBg: '#1aa094', //ヘッダー右側背景色
                    headerRightBgThis: '#197971', //ヘッダー右側選択時背景色,
                    headerRightColor: 'rgba(255,255,255,.7)', //ヘッダー右側文字色,
                    headerRightChildColor: 'var(--lay-color-text-1)', //ヘッダー右側ドロップダウン文字色,
                    headerRightColorThis: '#ffffff', //ヘッダー右側マウス選択時,
                    headerRightNavMore: 'rgba(255,255,255,.7)', //ヘッダー右側追加ドロップダウン色,
                    headerRightNavMoreBg: '#1aa094', //ヘッダー右側追加ドロップダウンリスト選択時背景色,
                    headerRightNavMoreColor: '#ffffff', //ヘッダー右側追加ドロップダウンリスト文字色,
                    headerRightToolColor: '#bbe3df', //ヘッダー縮小ボタンスタイル,
                    headerLogoBg: '#0c0c0c', //ロゴ背景色,
                    headerLogoColor: '#ffffff', //ロゴ文字色,
                    leftMenuNavMore: 'rgb(191, 187, 187)', //左側メニュー追加ドロップダウンスタイル,
                    leftMenuBg: '#23262e', //左側メニュー背景,
                    leftMenuBgThis: '#1aa094', //左側メニュー選択時背景,
                    leftMenuChildBg: 'rgba(0,0,0,.3)', //左側メニューサブメニュー背景,
                    leftMenuColor: 'rgb(191, 187, 187)', //左側メニュー文字色,
                    leftMenuColorThis: '#ffffff', //左側メニュー選択時文字色,
                    tabActiveColor: '#1aa094', //タブ選択色,
                },
                {
                    headerRightBg: '#1e9fff', //ヘッダー右側背景色
                    headerRightBgThis: '#0069b7', //ヘッダー右側選択時背景色,
                    headerRightColor: 'rgba(255,255,255,.7)', //ヘッダー右側文字色,
                    headerRightChildColor: 'var(--lay-color-text-1)', //ヘッダー右側ドロップダウン文字色,
                    headerRightColorThis: '#ffffff', //ヘッダー右側マウス選択時,
                    headerRightNavMore: 'rgba(255,255,255,.7)', //ヘッダー右側追加ドロップダウン色,
                    headerRightNavMoreBg: '#1e9fff', //ヘッダー右側追加ドロップダウンリスト選択時背景色,
                    headerRightNavMoreColor: '#ffffff', //ヘッダー右側追加ドロップダウンリスト文字色,
                    headerRightToolColor: '#bbe3df', //ヘッダー縮小ボタンスタイル,
                    headerLogoBg: '#0c0c0c', //ロゴ背景色,
                    headerLogoColor: '#ffffff', //ロゴ文字色,
                    leftMenuNavMore: 'rgb(191, 187, 187)', //左側メニュー追加ドロップダウンスタイル,
                    leftMenuBg: '#1f1f1f', //左側メニュー背景,
                    leftMenuBgThis: '#1e9fff', //左側メニュー選択時背景,
                    leftMenuChildBg: 'rgba(0,0,0,.3)', //左側メニューサブメニュー背景,
                    leftMenuColor: 'rgb(191, 187, 187)', //左側メニュー文字色,
                    leftMenuColorThis: '#ffffff', //左側メニュー選択時文字色,
                    tabActiveColor: '#1e9fff', //タブ選択色,
                },
                {
                    headerRightBg: '#ffb800', //ヘッダー右側背景色
                    headerRightBgThis: '#d09600', //ヘッダー右側選択時背景色,
                    headerRightColor: 'rgba(255,255,255,.7)', //ヘッダー右側文字色,
                    headerRightChildColor: 'var(--lay-color-text-1)', //ヘッダー右側ドロップダウン文字色,
                    headerRightColorThis: '#ffffff', //ヘッダー右側マウス選択時,
                    headerRightNavMore: 'rgba(255,255,255,.7)', //ヘッダー右側追加ドロップダウン色,
                    headerRightNavMoreBg: '#d09600', //ヘッダー右側追加ドロップダウンリスト選択時背景色,
                    headerRightNavMoreColor: '#ffffff', //ヘッダー右側追加ドロップダウンリスト文字色,
                    headerRightToolColor: '#bbe3df', //ヘッダー縮小ボタンスタイル,
                    headerLogoBg: '#243346', //ロゴ背景色,
                    headerLogoColor: '#ffffff', //ロゴ文字色,
                    leftMenuNavMore: 'rgb(191, 187, 187)', //左側メニュー追加ドロップダウンスタイル,
                    leftMenuBg: '#2f4056', //左側メニュー背景,
                    leftMenuBgThis: '#8593a7', //左側メニュー選択時背景,
                    leftMenuChildBg: 'rgba(0,0,0,.3)', //左側メニューサブメニュー背景,
                    leftMenuColor: 'rgb(191, 187, 187)', //左側メニュー文字色,
                    leftMenuColorThis: '#ffffff', //左側メニュー選択時文字色,
                    tabActiveColor: '#ffb800', //タブ選択色,
                },
                {
                    headerRightBg: '#e82121', //ヘッダー右側背景色
                    headerRightBgThis: '#ae1919', //ヘッダー右側選択時背景色,
                    headerRightColor: 'rgba(255,255,255,.7)', //ヘッダー右側文字色,
                    headerRightChildColor: 'var(--lay-color-text-1)', //ヘッダー右側ドロップダウン文字色,
                    headerRightColorThis: '#ffffff', //ヘッダー右側マウス選択時,
                    headerRightNavMore: 'rgba(255,255,255,.7)', //ヘッダー右側追加ドロップダウン色,
                    headerRightNavMoreBg: '#ae1919', //ヘッダー右側追加ドロップダウンリスト選択時背景色,
                    headerRightNavMoreColor: '#ffffff', //ヘッダー右側追加ドロップダウンリスト文字色,
                    headerRightToolColor: '#bbe3df', //ヘッダー縮小ボタンスタイル,
                    headerLogoBg: '#0c0c0c', //ロゴ背景色,
                    headerLogoColor: '#ffffff', //ロゴ文字色,
                    leftMenuNavMore: 'rgb(191, 187, 187)', //左側メニュー追加ドロップダウンスタイル,
                    leftMenuBg: '#1f1f1f', //左側メニュー背景,
                    leftMenuBgThis: '#3b3f4b', //左側メニュー選択時背景,
                    leftMenuChildBg: 'rgba(0,0,0,.3)', //左側メニューサブメニュー背景,
                    leftMenuColor: 'rgb(191, 187, 187)', //左側メニュー文字色,
                    leftMenuColorThis: '#ffffff', //左側メニュー選択時文字色,
                    tabActiveColor: '#e82121', //タブ選択色,
                },
                {
                    headerRightBg: '#963885', //ヘッダー右側背景色
                    headerRightBgThis: '#772c6a', //ヘッダー右側選択時背景色,
                    headerRightColor: 'rgba(255,255,255,.7)', //ヘッダー右側文字色,
                    headerRightChildColor: 'var(--lay-color-text-1)', //ヘッダー右側ドロップダウン文字色,
                    headerRightColorThis: '#ffffff', //ヘッダー右側マウス選択時,
                    headerRightNavMore: 'rgba(255,255,255,.7)', //ヘッダー右側追加ドロップダウン色,
                    headerRightNavMoreBg: '#772c6a', //ヘッダー右側追加ドロップダウンリスト選択時背景色,
                    headerRightNavMoreColor: '#ffffff', //ヘッダー右側追加ドロップダウンリスト文字色,
                    headerRightToolColor: '#bbe3df', //ヘッダー縮小ボタンスタイル,
                    headerLogoBg: '#243346', //ロゴ背景色,
                    headerLogoColor: '#ffffff', //ロゴ文字色,
                    leftMenuNavMore: 'rgb(191, 187, 187)', //左側メニュー追加ドロップダウンスタイル,
                    leftMenuBg: '#2f4056', //左側メニュー背景,
                    leftMenuBgThis: '#586473', //左側メニュー選択時背景,
                    leftMenuChildBg: 'rgba(0,0,0,.3)', //左側メニューサブメニュー背景,
                    leftMenuColor: 'rgb(191, 187, 187)', //左側メニュー文字色,
                    leftMenuColorThis: '#ffffff', //左側メニュー選択時文字色,
                    tabActiveColor: '#963885', //タブ選択色,
                },
                {
                    headerRightBg: '#2D8CF0', //ヘッダー右側背景色
                    headerRightBgThis: '#0069b7', //ヘッダー右側選択時背景色,
                    headerRightColor: 'rgba(255,255,255,.7)', //ヘッダー右側文字色,
                    headerRightChildColor: 'var(--lay-color-text-1)', //ヘッダー右側ドロップダウン文字色,
                    headerRightColorThis: '#ffffff', //ヘッダー右側マウス選択時,
                    headerRightNavMore: 'rgba(255,255,255,.7)', //ヘッダー右側追加ドロップダウン色,
                    headerRightNavMoreBg: '#0069b7', //ヘッダー右側追加ドロップダウンリスト選択時背景色,
                    headerRightNavMoreColor: '#ffffff', //ヘッダー右側追加ドロップダウンリスト文字色,
                    headerRightToolColor: '#bbe3df', //ヘッダー縮小ボタンスタイル,
                    headerLogoBg: '#0069b7', //ロゴ背景色,
                    headerLogoColor: '#ffffff', //ロゴ文字色,
                    leftMenuNavMore: 'rgb(191, 187, 187)', //左側メニュー追加ドロップダウンスタイル,
                    leftMenuBg: '#1f1f1f', //左側メニュー背景,
                    leftMenuBgThis: '#2D8CF0', //左側メニュー選択時背景,
                    leftMenuChildBg: 'rgba(0,0,0,.3)', //左側メニューサブメニュー背景,
                    leftMenuColor: 'rgb(191, 187, 187)', //左側メニュー文字色,
                    leftMenuColorThis: '#ffffff', //左側メニュー選択時文字色,
                    tabActiveColor: '#2d8cf0', //タブ選択色,
                },
                {
                    headerRightBg: '#ffb800', //ヘッダー右側背景色
                    headerRightBgThis: '#d09600', //ヘッダー右側選択時背景色,
                    headerRightColor: 'rgba(255,255,255,.7)', //ヘッダー右側文字色,
                    headerRightChildColor: 'var(--lay-color-text-1)', //ヘッダー右側ドロップダウン文字色,
                    headerRightColorThis: '#ffffff', //ヘッダー右側マウス選択時,
                    headerRightNavMore: 'rgba(255,255,255,.7)', //ヘッダー右側追加ドロップダウン色,
                    headerRightNavMoreBg: '#d09600', //ヘッダー右側追加ドロップダウンリスト選択時背景色,
                    headerRightNavMoreColor: '#ffffff', //ヘッダー右側追加ドロップダウンリスト文字色,
                    headerRightToolColor: '#bbe3df', //ヘッダー縮小ボタンスタイル,
                    headerLogoBg: '#d09600', //ロゴ背景色,
                    headerLogoColor: '#ffffff', //ロゴ文字色,
                    leftMenuNavMore: 'rgb(191, 187, 187)', //左側メニュー追加ドロップダウンスタイル,
                    leftMenuBg: '#2f4056', //左側メニュー背景,
                    leftMenuBgThis: '#3b3f4b', //左側メニュー選択時背景,
                    leftMenuChildBg: 'rgba(0,0,0,.3)', //左側メニューサブメニュー背景,
                    leftMenuColor: 'rgb(191, 187, 187)', //左側メニュー文字色,
                    leftMenuColorThis: '#ffffff', //左側メニュー選択時文字色,
                    tabActiveColor: '#ffb800', //タブ選択色,
                },
                {
                    headerRightBg: '#e82121', //ヘッダー右側背景色
                    headerRightBgThis: '#ae1919', //ヘッダー右側選択時背景色,
                    headerRightColor: 'rgba(255,255,255,.7)', //ヘッダー右側文字色,
                    headerRightChildColor: 'var(--lay-color-text-1)', //ヘッダー右側ドロップダウン文字色,
                    headerRightColorThis: '#ffffff', //ヘッダー右側マウス選択時,
                    headerRightNavMore: 'rgba(255,255,255,.7)', //ヘッダー右側追加ドロップダウン色,
                    headerRightNavMoreBg: '#ae1919', //ヘッダー右側追加ドロップダウンリスト選択時背景色,
                    headerRightNavMoreColor: '#ffffff', //ヘッダー右側追加ドロップダウンリスト文字色,
                    headerRightToolColor: '#bbe3df', //ヘッダー縮小ボタンスタイル,
                    headerLogoBg: '#d91f1f', //ロゴ背景色,
                    headerLogoColor: '#ffffff', //ロゴ文字色,
                    leftMenuNavMore: 'rgb(191, 187, 187)', //左側メニュー追加ドロップダウンスタイル,
                    leftMenuBg: '#1f1f1f', //左側メニュー背景,
                    leftMenuBgThis: '#3b3f4b', //左側メニュー選択時背景,
                    leftMenuChildBg: 'rgba(0,0,0,.3)', //左側メニューサブメニュー背景,
                    leftMenuColor: 'rgb(191, 187, 187)', //左側メニュー文字色,
                    leftMenuColorThis: '#ffffff', //左側メニュー選択時文字色,
                    tabActiveColor: '#e82121', //タブ選択色,
                },
                {
                    headerRightBg: '#963885', //ヘッダー右側背景色
                    headerRightBgThis: '#772c6a', //ヘッダー右側選択時背景色,
                    headerRightColor: 'rgba(255,255,255,.7)', //ヘッダー右側文字色,
                    headerRightChildColor: 'var(--lay-color-text-1)', //ヘッダー右側ドロップダウン文字色,
                    headerRightColorThis: '#ffffff', //ヘッダー右側マウス選択時,
                    headerRightNavMore: 'rgba(255,255,255,.7)', //ヘッダー右側追加ドロップダウン色,
                    headerRightNavMoreBg: '#772c6a', //ヘッダー右側追加ドロップダウンリスト選択時背景色,
                    headerRightNavMoreColor: '#ffffff', //ヘッダー右側追加ドロップダウンリスト文字色,
                    headerRightToolColor: '#bbe3df', //ヘッダー縮小ボタンスタイル,
                    headerLogoBg: '#772c6a', //ロゴ背景色,
                    headerLogoColor: '#ffffff', //ロゴ文字色,
                    leftMenuNavMore: 'rgb(191, 187, 187)', //左側メニュー追加ドロップダウンスタイル,
                    leftMenuBg: '#2f4056', //左側メニュー背景,
                    leftMenuBgThis: '#626f7f', //左側メニュー選択時背景,
                    leftMenuChildBg: 'rgba(0,0,0,.3)', //左側メニューサブメニュー背景,
                    leftMenuColor: 'rgb(191, 187, 187)', //左側メニュー文字色,
                    leftMenuColorThis: '#ffffff', //左側メニュー選択時文字色,
                    tabActiveColor: '#963885', //タブ選択色,
                }
            ];
            if (bgcolorId === undefined) {
                return bgColorConfig;
            } else {
                return bgColorConfig[bgcolorId];
            }
        },

        /**
         * 初始化
         * @param options
         */
        render: function (options) {
            options.bgColorDefault = options.bgColorDefault || false;
            options.listen = options.listen || false;
            var bgcolorId = localStorage.getItem('layuiminiBgColorId');
            if (bgcolorId === null || bgcolorId === undefined || bgcolorId === '') {
                bgcolorId = options.bgColorDefault;
            }
            bgcolorId = bgcolorId || '0';
            miniTheme.buildThemeCss(bgcolorId);
            if (options.listen) miniTheme.listen(options);
        },

        renderElemStyle(elemStyleDefault) {
            elemStyleDefault = elemStyleDefault || 'normal';
            let elemStyleName = localStorage.getItem('layuiminiElemStyleName');
            if (!elemStyleName) elemStyleName = elemStyleDefault;
            let themeModeEle = $('input[name=theme-mode]')
            if (themeModeEle.length > 0) {
                if (elemStyleName === 'dark') {
                    themeModeEle.prop('checked', true);
                } else {
                    themeModeEle.prop('checked', false);
                }
                layui.form.render('checkbox', 'header-theme-mode');
            }
            miniTheme.buildBodyElemStyle(elemStyleName);
        },

        changeThemeMainColor() {
            let bgcolorId = localStorage.getItem('layuiminiBgColorId');
            if (bgcolorId === null || bgcolorId === undefined || bgcolorId === '') return false;
            let bgcolorData = miniTheme.config(bgcolorId);
            let mainColor = bgcolorData.headerRightBg
            if (bgcolorId == 0) mainColor = '#16b777';
            const bgColor = window.getComputedStyle(document.documentElement).getPropertyValue('--ea8-theme-main-color');
            document.documentElement.style.setProperty('--ea8-theme-main-color', mainColor);
            const iframes = document.getElementsByTagName('iframe');
            if (iframes.length === 0) return false;
            $.each(iframes, (i, iframe) => {
                if (iframe === '' || iframe === undefined) return false;
                const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
                iframeDocument.documentElement.style.setProperty('--ea8-theme-main-color', mainColor);
            })
        },

        /**
         * 构建主题样式
         * @param bgcolorId
         * @returns {boolean}
         */
        buildThemeCss: function (bgcolorId) {
            if (!bgcolorId) {
                return false;
            }
            var bgcolorData = miniTheme.config(bgcolorId);
            var styleHtml = '/*ヘッダー右側背景色 headerRightBg */\n' +
                '.layui-layout-admin .layui-header {\n' +
                '    background-color: ' + bgcolorData.headerRightBg + ' !important;\n' +
                '}\n' +
                '\n' +
                '/*ヘッダー右側選択時背景色 headerRightBgThis */\n' +
                '.layui-layout-admin .layui-header .layuimini-header-content > ul > .layui-nav-item.layui-this, .layuimini-tool i:hover {\n' +
                '    background-color: ' + bgcolorData.headerRightBgThis + ' !important;\n' +
                '}\n' +
                '\n' +
                '/*ヘッダー右側文字色 headerRightColor */\n' +
                '.layui-layout-admin .layui-header .layui-nav .layui-nav-item a {\n' +
                '    color:  ' + bgcolorData.headerRightColor + ';\n' +
                '}\n' +
                '/**ヘッダー右側ドロップダウン文字色 headerRightChildColor */\n' +
                '.layui-layout-admin .layui-header .layui-nav .layui-nav-item .layui-nav-child a {\n' +
                '    color:  ' + bgcolorData.headerRightChildColor + '!important;\n' +
                '}\n' +
                '\n' +
                '/*ヘッダー右側マウス選択時 headerRightColorThis */\n' +
                '.layui-header .layuimini-menu-header-pc.layui-nav .layui-nav-item a:hover, .layui-header .layuimini-header-menu.layuimini-pc-show.layui-nav .layui-this a {\n' +
                '    color: ' + bgcolorData.headerRightColorThis + ' !important;\n' +
                '}\n' +
                '\n' +
                '/*ヘッダー右側追加ドロップダウン色 headerRightNavMore */\n' +
                '.layui-header .layui-nav .layui-nav-more {\n' +
                '    border-top-color: ' + bgcolorData.headerRightNavMore + ' !important;\n' +
                '}\n' +
                '\n' +
                '/*ヘッダー右側追加ドロップダウン色 headerRightNavMore */\n' +
                '.layui-header .layui-nav .layui-nav-mored, .layui-header .layui-nav-itemed > a .layui-nav-more {\n' +
                '    border-color: transparent transparent ' + bgcolorData.headerRightNavMore + ' !important;\n' +
                '}\n' +
                '\n' +
                '/**头部右侧更多下拉配置色 headerRightNavMoreBg headerRightNavMoreColor */\n' +
                '.layui-header .layui-nav .layui-nav-child dd.layui-this a, .layui-header .layui-nav-child dd.layui-this, .layui-layout-admin .layui-header .layui-nav .layui-nav-item .layui-nav-child .layui-this a {\n' +
                '    background-color: ' + bgcolorData.headerRightNavMoreBg + ' !important;\n' +
                '    color:' + bgcolorData.headerRightNavMoreColor + ' !important;\n' +
                '}\n' +
                '\n' +
                '/*ヘッダー縮小ボタンスタイル headerRightToolColor */\n' +
                '.layui-layout-admin .layui-header .layuimini-tool i {\n' +
                '    color: ' + bgcolorData.headerRightToolColor + ';\n' +
                '}\n' +
                '\n' +
                '/*ロゴ背景色 headerLogoBg */\n' +
                '.layui-layout-admin .layuimini-logo {\n' +
                '    background-color: ' + bgcolorData.headerLogoBg + ' !important;\n' +
                '}\n' +
                '\n' +
                '/*ロゴ文字色 headerLogoColor */\n' +
                '.layui-layout-admin .layuimini-logo h1 {\n' +
                '    color: ' + bgcolorData.headerLogoColor + ';\n' +
                '}\n' +
                '\n' +
                '/*左側メニュー追加ドロップダウンスタイル leftMenuNavMore */\n' +
                '.layuimini-menu-left .layui-nav .layui-nav-more,.layuimini-menu-left-zoom.layui-nav .layui-nav-more {\n' +
                '    border-top-color: ' + bgcolorData.leftMenuNavMore + ';\n' +
                '}\n' +
                '\n' +
                '/*左側メニュー追加ドロップダウンスタイル leftMenuNavMore */\n' +
                '.layuimini-menu-left .layui-nav .layui-nav-mored, .layuimini-menu-left .layui-nav-itemed > a .layui-nav-more,   .layuimini-menu-left-zoom.layui-nav .layui-nav-mored, .layuimini-menu-left-zoom.layui-nav-itemed > a .layui-nav-more {\n' +
                '    border-color: transparent transparent  ' + bgcolorData.leftMenuNavMore + ' !important;\n' +
                '}\n' +
                '\n' +
                '/*左側メニュー背景 leftMenuBg */\n' +
                '.layui-side.layui-bg-black, .layui-side.layui-bg-black > .layuimini-menu-left > ul, .layuimini-menu-left-zoom > ul {\n' +
                '    background-color:  ' + bgcolorData.leftMenuBg + ' !important;\n' +
                '}\n' +
                '\n' +
                '/*左側メニュー選択時背景 leftMenuBgThis */\n' +
                '.layuimini-menu-left .layui-nav-tree .layui-this, .layuimini-menu-left .layui-nav-tree .layui-this > a, .layuimini-menu-left .layui-nav-tree .layui-nav-child dd.layui-this, .layuimini-menu-left .layui-nav-tree .layui-nav-child dd.layui-this a, .layuimini-menu-left-zoom.layui-nav-tree .layui-this, .layuimini-menu-left-zoom.layui-nav-tree .layui-this > a, .layuimini-menu-left-zoom.layui-nav-tree .layui-nav-child dd.layui-this, .layuimini-menu-left-zoom.layui-nav-tree .layui-nav-child dd.layui-this a {\n' +
                '    background-color: ' + bgcolorData.leftMenuBgThis + ' !important\n' +
                '}\n' +
                '\n' +
                '/*左側メニューサブメニュー背景 leftMenuChildBg */\n' +
                '.layuimini-menu-left .layui-nav-itemed > .layui-nav-child{\n' +
                '    background-color: ' + bgcolorData.leftMenuChildBg + ' !important;\n' +
                '}\n' +
                '\n' +
                '/*左側メニュー文字色 leftMenuColor */\n' +
                '.layuimini-menu-left .layui-nav .layui-nav-item a, .layuimini-menu-left-zoom.layui-nav .layui-nav-item a {\n' +
                '    color:  ' + bgcolorData.leftMenuColor + ' !important;\n' +
                '}\n' +
                '\n' +
                '/*左側メニュー選択時文字色 leftMenuColorThis */\n' +
                '.layuimini-menu-left .layui-nav .layui-nav-item a:hover, .layuimini-menu-left .layui-nav .layui-this a, .layuimini-menu-left-zoom.layui-nav .layui-nav-item a:hover, .layuimini-menu-left-zoom.layui-nav .layui-this a {\n' +
                '    color:' + bgcolorData.leftMenuColorThis + ' !important;\n' +
                '}\n' +
                '\n' +
                '/**タブ選択色 tabActiveColor */\n' +
                '.layuimini-tab .layui-tab-title .layui-this .layuimini-tab-active {\n' +
                '    background-color: ' + bgcolorData.tabActiveColor + ';\n' +
                '}\n';
            $('#layuimini-bg-color').html(styleHtml);
        },
        configElemStyle() {
            var listElemStyle = [
                {
                    title: '标准',
                    className: 'normal'
                },
                {
                    title: '原型',
                    className: 'demo',
                    defaultColorConfig: '12'
                },
                {
                    title: '科幻',
                    className: 'sicfi'
                },
                {
                    title: 'GTK',
                    className: 'gtk'
                },
                {
                    title: '像素',
                    className: 'nes',
                    defaultColorConfig: '12'
                },
                {
                    title: 'WIN7',
                    className: 'win7',
                    defaultColorConfig: '12'
                },
                {
                    title: '拟物',
                    className: 'neomorphic',

                },
                {
                    title: '暗黑',
                    className: 'dark',
                    defaultColorConfig: '1'

                },
            ]
            return listElemStyle;
        },
        buildBodyElemStyle(className) {
            let listElemStyle = miniTheme.configElemStyle()
            let htmlEle = $('html')
            $.each(listElemStyle, function (index, item) {
                let classNameReal = item.className;
                if (htmlEle.hasClass(classNameReal)) {
                    htmlEle.removeClass(classNameReal);
                }
            })
            htmlEle.addClass(className)
        },
        buildElemStyleHtml(options) {
            var elemStyleName = localStorage.getItem('layuiminiElemStyleName');
            if (!elemStyleName) elemStyleName = options.elemStyleDefault;
            var listElemStyle = miniTheme.configElemStyle()
            var html = '';
            $.each(listElemStyle, function (key, val) {

                if (typeof val.defaultColorConfig == 'undefined') {
                    val.defaultColorConfig = '0'
                }

                if (val.className === elemStyleName) {
                    html += '<li class="layui-this style-item" data-select-style="' + val.className + '" data-default-color-config="' + val.defaultColorConfig + '">\n';
                } else {
                    html += '<li id="' + val.className + '" class="style-item"  data-select-style="' + val.className + '" data-default-color-config="' + val.defaultColorConfig + '">\n';
                }
                html +=
                    val.title +

                    '</li>';
            });
            return html;
        },
        /**
         * 构建主题选择html
         * @param options
         * @returns {string}
         */
        buildBgColorHtml: function (options) {
            options.bgColorDefault = options.bgColorDefault || 0;
            var bgcolorId = parseInt(localStorage.getItem('layuiminiBgColorId'));
            if (isNaN(bgcolorId)) bgcolorId = options.bgColorDefault;
            var bgColorConfig = miniTheme.config();
            var html = '';
            $.each(bgColorConfig, function (key, val) {
                if (key === bgcolorId) {
                    html += '<li class="layui-this" data-select-bgcolor="' + key + '">\n';
                } else {
                    html += '<li  data-select-bgcolor="' + key + '">\n';
                }
                html += '<a href="javascript:;" data-skin="skin-blue" style="" class="clearfix full-opacity-hover">\n' +
                    '<div><span style="display:block; width: 20%; float: left; height: 12px; background: ' + val.headerLogoBg + ';"></span><span style="display:block; width: 80%; float: left; height: 12px; background: ' + val.headerRightBg + ';"></span></div>\n' +
                    '<div><span style="display:block; width: 20%; float: left; height: 40px; background: ' + val.leftMenuBg + ';"></span><span style="display:block; width: 80%; float: left; height: 40px; background: #ffffff;"></span></div>\n' +
                    '</a>\n' +
                    '</li>';
            });
            return html;
        },

        /**
         * 監視
         * @param options
         */
        listen: function (options) {
            $('body').on('click', '[data-bgcolor]', function () {
                var loading = layer.load(0, {shade: false, time: 2 * 1000});
                var clientHeight = (document.documentElement.clientHeight) - 60;
                var bgColorHtml = miniTheme.buildBgColorHtml(options);
                var html = '<div class="layuimini-color">\n' +
                    '<div class="color-title">\n' +
                    '<span>配色方案</span>\n' +
                    '</div>\n' +
                    '<div class="color-content">\n' +
                    '<ul>\n' + bgColorHtml + '</ul>\n' +
                    '</div>\n' +
                    '<div class="more-menu-list">\n' +
                    '<a class="more-menu-item" href="https://gitee.com/wolf18/easyAdmin8" target="_blank"><i class="layui-icon layui-icon-tabs" style="font-size: 16px;"></i> 开源地址</a>\n' +
                    '</div>' +
                    '</div>';
                layer.open({
                    type: 1,
                    title: false,
                    closeBtn: 0,
                    shade: 0.2,
                    anim: 2,
                    shadeClose: true,
                    id: 'layuiminiBgColor',
                    area: ['340px', clientHeight + 'px'],
                    offset: 'rb',
                    content: html,
                    success: function (index, layero) {
                    },
                    end: function () {
                        $('.layuimini-select-bgcolor').removeClass('layui-this');
                    }
                });
                layer.close(loading);
            });

            $('body').on('click', '[data-select-bgcolor]', function () {
                var bgcolorId = $(this).attr('data-select-bgcolor');
                $('.layuimini-color .color-content ul .layui-this').attr('class', '');
                $(this).attr('class', 'layui-this');
                localStorage.setItem('layuiminiBgColorId', bgcolorId);
                miniTheme.render({
                    bgColorDefault: bgcolorId,
                    listen: false,
                });
                miniTheme.changeThemeMainColor()
            });
            $('body').on('click', '[data-select-style]', function () {
                var elemStyleName = $(this).attr('data-select-style');

                $(this).attr('class', 'layui-this').siblings().removeClass('layui-this');

                var defaultColorConfig = $(this).attr('data-default-color-config');

                if (defaultColorConfig && defaultColorConfig.length > 0) {
                    localStorage.setItem('layuiminiBgColorId', defaultColorConfig);

                }

                localStorage.setItem('layuiminiElemStyleName', elemStyleName);
                miniTheme.render({
                    listen: false,
                });
            });
        }
    };

    return miniTheme;
})
;
