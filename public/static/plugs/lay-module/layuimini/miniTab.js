/**
 * date:2020/02/27
 * author:Mr.Chung
 * version:2.0
 * description:layuimini tabフレームワーク拡張
 */
define(["jquery"], function ($) {
    var element = layui.element,
        tabs = layui.tabs,
        $ = layui.$;


    var miniTab = {

        /**
         * Tab初期化
         * @param options
         */
        render: function (options) {
            options.filter = options.filter || null;
            options.multiModule = options.multiModule || false;
            options.urlHashLocation = options.urlHashLocation || false;
            options.maxTabNum = options.maxTabNum || 20;
            options.menuList = options.menuList || [];  // todo 将来的にメニューはDOM操作ではなく初期化時に渡されたデータを直接操作する予定
            options.homeInfo = options.homeInfo || {};
            options.listenSwichCallback = options.listenSwichCallback || function () {
            };
            miniTab.listen(options);
            miniTab.listenRoll();
            miniTab.listenSwitch(options);
            miniTab.listenHash(options);
        },

        /**
         * 新規Tabウィンドウ
         * @param options.tabId
         * @param options.href
         * @param options.title
         * @param options.isIframe
         * @param options.maxTabNum
         */
        create: function (options) {
            options.tabId = options.tabId || null;
            options.href = options.href || null;
            options.title = options.title || null;
            options.isIframe = options.isIframe || false;
            options.maxTabNum = options.maxTabNum || 20;
            if ($(".layuimini-tab .layui-tabs-header li").length >= options.maxTabNum) {
                layer.msg('Tabウィンドウが上限に達しました。一部のTabを閉じてください');
                return false;
            }
            if (options.isIframe) tabs = parent.layui.tabs;
            tabs.add('layuiminiTab', {
                title: `<span class="layuimini-tab-active"></span><span>${options.title}</span><i class="layui-icon layui-unselect layui-tab-close">ဆ</i>`
                , content: `<iframe width="100%" height="100%" frameborder="no" border="0" src="${options.href}" style="width: 100%; height:100%;"></iframe>`
                , id: options.tabId
            });
            $('.layuimini-menu-left').attr('layuimini-tab-tag', 'add');
            sessionStorage.setItem('layuiminimenu_' + options.tabId, options.title);
        },


        /**
         * タブ切替
         * @param tabId
         */
        change: function (tabId) {
            tabs.change('layuiminiTab', tabId);
        },

        /**
         * Tabウィンドウ削除
         * @param tabId
         * @param isParent
         */
        delete: function (tabId, isParent) {
            if (isParent === true) {
                parent.layui.tabs.close('layuiminiTab', tabId);
            } else {
                tabs.close('layuiminiTab', tabId);
            }
        },

        /**
         * iframeレイヤーで新規Tabを開く
         */
        openNewTabByIframe: function (options) {
            options.href = options.href || null;
            options.title = options.title || null;
            var loading = parent.layer.load(0, {shade: false, time: 2 * 1000});
            if (options.href === null || options.href === undefined) options.href = new Date().getTime();
            var checkTab = miniTab.check(options.href, true);
            if (!checkTab) {
                miniTab.create({
                    tabId: options.href,
                    href: options.href,
                    title: options.title,
                    isIframe: true,
                });
            }
            parent.layui.tabs.change('layuiminiTab', options.href);
            parent.layer.close(loading);
        },

        /**
         * iframeレイヤーで現在のTabを閉じる
         */
        deleteCurrentByIframe: function () {
            var ele = $(".layuimini-tab .layui-tabs-header li.layui-this", parent.document);
            if (ele.length > 0) {
                var layId = $(ele[0]).attr('lay-id');
                miniTab.delete(layId, true);
            }
        },

        /**
         * Tabウィンドウ判定
         */
        check: function (tabId, isIframe) {
            // 判断选项卡上是否有
            var checkTab = false;
            if (isIframe === undefined || isIframe === false) {
                $(".layui-tabs-header li").each(function () {
                    var checkTabId = $(this).attr('lay-id');
                    if (checkTabId != null && checkTabId === tabId) {
                        checkTab = true;
                    }
                });
            } else {
                parent.layui.$(".layui-tabs-header li").each(function () {
                    var checkTabId = $(this).attr('lay-id');
                    if (checkTabId != null && checkTabId === tabId) {
                        checkTab = true;
                    }
                });
            }
            return checkTab;
        },

        /**
         * Tab右クリックメニューを開く
         * @param tabId
         * @param left
         */
        openTabRignMenu: function (tabId, left) {
            miniTab.closeTabRignMenu();
            var menuHtml = '<div class="layui-unselect layui-form-select layui-form-selected layuimini-tab-mousedown layui-show" data-tab-id="' + tabId + '" style="left: ' + left + 'px!important">\n' +
                '<dl>\n' +
                '<dd><a href="javascript:;" layuimini-tab-menu-close="current">現在を閉じる</a></dd>\n' +
                '<dd><a href="javascript:;" layuimini-tab-menu-close="other">他を閉じる</a></dd>\n' +
                '<dd><a href="javascript:;" layuimini-tab-menu-close="all">すべて閉じる</a></dd>\n' +
                '</dl>\n' +
                '</div>';
            var makeHtml = '<div class="layuimini-tab-make"></div>';
            $('.layuimini-tab .layui-tabs-header').after(menuHtml);
            $('.layuimini-tab .layui-tab-content').after(makeHtml);
        },

        /**
         * Tab右クリックメニューを閉じる
         */
        closeTabRignMenu: function () {
            $('.layuimini-tab-mousedown').remove();
            $('.layuimini-tab-make').remove();
        },

        /**
         * メニュー情報照会
         * @param href
         * @param menuList
         */
        searchMenu: function (href, menuList) {
            var menu;
            for (key in menuList) {
                var item = menuList[key];
                if (item.href === href) {
                    menu = item;
                    break;
                }
                if (item.child) {
                    newMenu = miniTab.searchMenu(href, item.child);
                    if (newMenu) {
                        menu = newMenu;
                        break;
                    }
                }
            }
            return menu;
        },

        /**
         * 監視
         * @param options
         */
        listen: function (options) {
            options = options || {};
            options.maxTabNum = options.maxTabNum || 20;

            /**
             * 新規ウィンドウを開く
             */
            $('body').on('click', '[layuimini-href]', function () {
                var loading = layer.load(0, {shade: false, time: 2 * 1000});
                var tabId = $(this).attr('layuimini-href'),
                    href = $(this).attr('layuimini-href'),
                    title = $(this).text(),
                    target = $(this).attr('target');

                var el = $("[layuimini-href='" + href + "']", ".layuimini-menu-left");
                layer.close(window.openTips);
                if (el.length) {
                    $(el).closest(".layui-nav-tree").find(".layui-this").removeClass("layui-this");
                    $(el).parent().addClass("layui-this");
                }

                if (target === '_blank') {
                    layer.close(loading);
                    window.open(href, "_blank");
                    return false;
                }

                if (tabId === null || tabId === undefined) tabId = new Date().getTime();
                var checkTab = miniTab.check(tabId);
                if (!checkTab) {
                    miniTab.create({
                        tabId: tabId,
                        href: href,
                        title: title,
                        isIframe: false,
                        maxTabNum: options.maxTabNum,
                    });
                }
                tabs.change('layuiminiTab', tabId);
                layer.close(loading);
            });

            /**
             * iframeサブメニューで新規ウィンドウを開く
             */
            $('body').on('click', '[layuimini-content-href]', function () {
                var loading = parent.layer.load(0, {shade: false, time: 2 * 1000});
                var tabId = $(this).attr('layuimini-content-href'),
                    href = $(this).attr('layuimini-content-href'),
                    title = $(this).attr('data-title'),
                    target = $(this).attr('target');
                if (target === '_blank') {
                    parent.layer.close(loading);
                    window.open(href, "_blank");
                    return false;
                }
                if (tabId === null || tabId === undefined) tabId = new Date().getTime();
                var checkTab = miniTab.check(tabId, true);
                if (!checkTab) {
                    miniTab.create({
                        tabId: tabId,
                        href: href,
                        title: title,
                        isIframe: true,
                        maxTabNum: options.maxTabNum,
                    });
                }
                parent.layui.tabs.change('layuiminiTab', tabId);
                parent.layer.close(loading);
            });

            /**
             * タブを閉じる
             **/
            $('body').on('click', '.layuimini-tab .layui-tabs-header .layui-tab-close', function () {
                var loading = layer.load(0, {shade: false, time: 2 * 1000});
                var $parent = $(this).parent();
                var tabId = $parent.attr('lay-id');
                if (tabId !== undefined || tabId !== null) {
                    miniTab.delete(tabId);
                }
                layer.close(loading);
            });

            /**
             * タブ操作
             */
            $('body').on('click', '[layuimini-tab-close]', function () {
                var loading = layer.load(0, {shade: false, time: 2 * 1000});
                var closeType = $(this).attr('layuimini-tab-close');
                $(".layuimini-tab .layui-tabs-header li").each(function () {
                    var tabId = $(this).attr('lay-id');
                    var id = $(this).attr('id');
                    var isCurrent = $(this).hasClass('layui-this');
                    if (id !== 'layuiminiHomeTabId') {
                        if (closeType === 'all') {
                            miniTab.delete(tabId);
                        } else {
                            if (closeType === 'current' && isCurrent) {
                                miniTab.delete(tabId);
                            } else if (closeType === 'other' && !isCurrent) {
                                miniTab.delete(tabId);
                            }
                        }
                    }
                });
                layer.close(loading);
            });

            /**
             * Webページの右クリック禁止
             */
            $(".layuimini-tab .layui-tabs-header").unbind("mousedown").bind("contextmenu", function (e) {
                e.preventDefault();
                return false;
            });

            /**
             * マウス右クリック登録
             */
            $('body').on('mousedown', '.layuimini-tab .layui-tabs-header li', function (e) {
                var left = e.pageX ,
                    tabId = $(this).attr('lay-id');
                if (e.which === 3) {
                    e.preventDefault();
                    miniTab.openTabRignMenu(tabId, left);
                }
            });

            /**
             * Tab右クリックメニューを閉じる
             */
            $('body').on('click', '.layui-body,.layui-header,.layuimini-menu-left,.layuimini-tab-make', function () {
                miniTab.closeTabRignMenu();
            });

            /**
             * Tab右クリックメニュー操作
             */
            $('body').on('click', '[layuimini-tab-menu-close]', function () {
                var loading = layer.load(0, {shade: false, time: 2 * 1000});
                var closeType = $(this).attr('layuimini-tab-menu-close'),
                    currentTabId = $('.layuimini-tab-mousedown').attr('data-tab-id');
                $(".layuimini-tab .layui-tabs-header li").each(function () {
                    var tabId = $(this).attr('lay-id');
                    var id = $(this).attr('id');
                    if (id !== 'layuiminiHomeTabId') {
                        if (closeType === 'all') {
                            miniTab.delete(tabId);
                        } else {
                            if (closeType === 'current' && currentTabId === tabId) {
                                miniTab.delete(tabId);
                            } else if (closeType === 'other' && currentTabId !== tabId) {
                                miniTab.delete(tabId);
                            }
                        }
                    }
                });
                miniTab.closeTabRignMenu();
                layer.close(loading);
            });
        },

        /**
         * 監視tab切换
         * @param options
         */
        listenSwitch: function (options) {
            options.filter = options.filter || null;
            options.multiModule = options.multiModule || false;
            options.urlHashLocation = options.urlHashLocation || false;
            options.listenSwichCallback = options.listenSwichCallback || function () {

            };
            tabs.on('afterChange(layuiminiTab)', function (data) {
                var tabId = $(this).attr('lay-id');
                if (options.urlHashLocation) {
                    location.hash = tabId;
                }
                if (typeof options.listenSwichCallback === 'function') {
                    options.listenSwichCallback();
                }
                // 新規ウィンドウか判定
                if ($('.layuimini-menu-left').attr('layuimini-tab-tag') === 'add') {
                    $('.layuimini-menu-left').attr('layuimini-tab-tag', 'no')
                } else {
                    $("[layuimini-href]").parent().removeClass('layui-this');
                    if (options.multiModule) {
                        miniTab.listenSwitchMultiModule(tabId);
                    } else {
                        miniTab.listenSwitchSingleModule(tabId);
                    }
                }
                miniTab.rollPosition();
            });
        },

        /**
         * hash変化監視
         * @param options
         * @returns {boolean}
         */
        listenHash: function (options) {
            options.urlHashLocation = options.urlHashLocation || false;
            options.maxTabNum = options.maxTabNum || 20;
            options.homeInfo = options.homeInfo || {};
            options.menuList = options.menuList || [];
            if (!options.urlHashLocation) return false;
            var tabId = location.hash.replace(/^#/, '');
            if (tabId === null || tabId === undefined || tabId === '') return false;

            // ホームか判定
            if (tabId === options.homeInfo.href) return false;

            // 右側メニューか判定
            var menu = miniTab.searchMenu(tabId, options.menuList);
            if (menu !== undefined) {
                miniTab.create({
                    tabId: tabId,
                    href: tabId,
                    title: menu.title,
                    isIframe: false,
                    maxTabNum: options.maxTabNum,
                });
                $('.layuimini-menu-left').attr('layuimini-tab-tag', 'no');
                tabs.change('layuiminiTab', tabId);
                return false;
            }

            // ショートカットメニューか判定
            var isSearchMenu = false;
            $("[layuimini-content-href]").each(function () {
                if ($(this).attr("layuimini-content-href") === tabId) {
                    var title = $(this).attr("data-title");
                    miniTab.create({
                        tabId: tabId,
                        href: tabId,
                        title: title,
                        isIframe: false,
                        maxTabNum: options.maxTabNum,
                    });
                    $('.layuimini-menu-left').attr('layuimini-tab-tag', 'no');
                    tabs.change('layuiminiTab', tabId);
                    isSearchMenu = true;
                    return false;
                }
            });
            if (isSearchMenu) return false;

            // 右側メニューでもショートカットメニューでもないので直接開く
            var title = sessionStorage.getItem('layuiminimenu_' + tabId) === null ? tabId : sessionStorage.getItem('layuiminimenu_' + tabId);
            miniTab.create({
                tabId: tabId,
                href: tabId,
                title: title,
                isIframe: false,
                maxTabNum: options.maxTabNum,
            });
            tabs.change('layuiminiTab', tabId);
            return false;
        },

        /**
         * スクロール監視
         */
        listenRoll: function () {
            $(".layuimini-tab-roll-left").click(function () {
                miniTab.rollClick("left");
            });
            $(".layuimini-tab-roll-right").click(function () {
                miniTab.rollClick("right");
            });
        },

        /**
         * シングルモジュール切替
         * @param tabId
         */
        listenSwitchSingleModule: function (tabId) {
            $("[layuimini-href]").each(function () {
                if ($(this).attr("layuimini-href") === tabId) {
                    // メニューバー自動展開
                    var addMenuClass = function ($element, type) {
                        if (type === 1) {
                            $element.addClass('layui-this');
                            if ($element.hasClass('layui-nav-item') && $element.hasClass('layui-this')) {
                                $(".layuimini-header-menu li").attr('class', 'layui-nav-item');
                            } else {
                                addMenuClass($element.parent().parent(), 2);
                            }
                        } else {
                            $element.addClass('layui-nav-itemed');
                            if ($element.hasClass('layui-nav-item') && $element.hasClass('layui-nav-itemed')) {
                                $(".layuimini-header-menu li").attr('class', 'layui-nav-item');
                            } else {
                                addMenuClass($element.parent().parent(), 2);
                            }
                        }
                    };
                    addMenuClass($(this).parent(), 1);
                    return false;
                }
            });
        },

        /**
         * マルチモジュール切替
         * @param tabId
         */
        listenSwitchMultiModule: function (tabId) {
            $("[layuimini-href]").each(function () {
                if ($(this).attr("layuimini-href") === tabId) {

                    // メニューバー自動展開
                    var addMenuClass = function ($element, type) {
                        if (type === 1) {
                            $element.addClass('layui-this');
                            if ($element.hasClass('layui-nav-item') && $element.hasClass('layui-this')) {
                                var moduleId = $element.parent().attr('id');
                                $(".layuimini-header-menu li").attr('class', 'layui-nav-item');
                                $("#" + moduleId + "HeaderId").addClass("layui-this");
                                $(".layuimini-menu-left .layui-nav.layui-nav-tree").attr('class', 'layui-nav layui-nav-tree layui-hide');
                                $("#" + moduleId).attr('class', 'layui-nav layui-nav-tree layui-this');
                            } else {
                                addMenuClass($element.parent().parent(), 2);
                            }
                        } else {
                            $element.addClass('layui-nav-itemed');
                            if ($element.hasClass('layui-nav-item') && $element.hasClass('layui-nav-itemed')) {
                                var moduleId = $element.parent().attr('id');
                                $(".layuimini-header-menu li").attr('class', 'layui-nav-item');
                                $("#" + moduleId + "HeaderId").addClass("layui-this");
                                $(".layuimini-menu-left .layui-nav.layui-nav-tree").attr('class', 'layui-nav layui-nav-tree layui-hide');
                                $("#" + moduleId).attr('class', 'layui-nav layui-nav-tree layui-this');
                            } else {
                                addMenuClass($element.parent().parent(), 2);
                            }
                        }
                    };
                    addMenuClass($(this).parent(), 1);
                    return false;
                }
            });
        },

        /**
         * 自動配置
         */
        rollPosition: function () {
            var $tabTitle = $('.layuimini-tab  .layui-tabs-header');
            var autoLeft = 0;
            $tabTitle.children("li").each(function () {
                if ($(this).hasClass('layui-this')) {
                    return false;
                } else {
                    autoLeft += $(this).outerWidth();
                }
            });
            $tabTitle.animate({
                scrollLeft: autoLeft - $tabTitle.width() / 3
            }, 200);
        },

        /**
         * クリックスクロール
         * @param direction
         */
        rollClick: function (direction) {
            var $tabTitle = $('.layuimini-tab  .layui-tabs-header');
            var left = $tabTitle.scrollLeft();
            if ('left' === direction) {
                $tabTitle.animate({
                    scrollLeft: left - 450
                }, 200);
            } else {
                $tabTitle.animate({
                    scrollLeft: left + 450
                }, 200);
            }
        }

    };

    return miniTab;
});
