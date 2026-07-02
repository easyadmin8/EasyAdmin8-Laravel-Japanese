define(["jquery", "tableSelect", "switchSelect", "miniTheme", "xmSelect", "lazyload"], function ($, tableSelect, switchSelect, miniTheme, xmSelect, lazyload) {

    //昼夜モード切替
    window.onInitElemStyle = function () {
        try {
            miniTheme.renderElemStyle();
            $('iframe').each(function (index, iframe) {
                if (typeof iframe.contentWindow.onInitElemStyle == "function") {
                    iframe.contentWindow.onInitElemStyle();
                }
            });
            miniTheme.changeThemeMainColor();
        } catch (e) {
        }
    };
    window.onInitElemStyle();

    var form = layui.form,
        layer = layui.layer,
        table = layui.table,
        laydate = layui.laydate,
        upload = layui.upload,
        element = layui.element,
        laytpl = layui.laytpl,
        tableSelect = layui.tableSelect,
        switchSelect = layui.switchSelect,
        util = layui.util;

    layer.config({
        skin: 'layui-layer-easy'
    });

    var init = {
        table_elem: '#currentTable',
        table_render_id: 'currentTableRenderId',
        upload_url: 'ajax/upload',
        upload_exts: 'doc|gif|ico|icon|jpg|mp3|mp4|p12|pem|png|rar',
        csrf_token: window.CONFIG.CSRF_TOKEN,
        wait_submit: false,
        xmSelectList: {},
        xmSelectModel: {},
    };


    var admin = {
        config: {
            shade: [0.02, '#000'],
        },
        url: function (url) {
            return '/' + CONFIG.ADMIN + '/' + url;
        },
        headers: function () {
            return {'X-CSRF-TOKEN': init.csrf_token};
        },
        //js版empty、変数が空かどうかを判定
        empty: function (r) {
            var n, t, e, f = [void 0, null, !1, 0, "", "0"];
            for (t = 0, e = f.length; t < e; t++) if (r === f[t]) return !0;
            if ("object" == typeof r) {
                for (n in r) if (r.hasOwnProperty(n)) return !1;
                return !0
            }
            return !1
        },
        checkAuth: function (node, elem) {
            if (CONFIG.IS_SUPER_ADMIN) {
                return true;
            }
            if ($(elem).attr('data-auth-' + node) === '1') {
                return true;
            } else {
                return false;
            }
        },
        parame: function (param, defaultParam) {
            return param !== undefined ? param : defaultParam;
        },
        request: {
            post: function (option, ok, no, ex) {
                return admin.request.ajax('post', option, ok, no, ex);
            },
            get: function (option, ok, no, ex) {
                return admin.request.ajax('get', option, ok, no, ex);
            },
            ajax: function (type, option, ok, no, ex) {
                type = type || 'get';
                option.url = option.url || '';
                option.data = option.data || {};
                option.prefix = option.prefix || false;
                option.statusName = option.statusName || 'code';
                option.statusCode = option.statusCode || 1;
                ok = ok || function (res) {
                };
                no = no || function (res) {
                    var msg = res.msg == undefined ? 'データ形式に誤りがあります' : res.msg;
                    admin.msg.error(msg);
                    return false;
                };
                ex = ex || function (res) {
                };
                if (option.url == '') {
                    admin.msg.error('リクエストURLは必須です');
                    return false;
                }
                if (option.prefix == true) {
                    option.url = admin.url(option.url);
                }
                var index = admin.msg.loading('読み込み中');
                $.ajax({
                    url: option.url,
                    type: type,
                    contentType: "application/x-www-form-urlencoded; charset=UTF-8",
                    dataType: "json",
                    headers: admin.headers(),
                    data: option.data,
                    timeout: 60000,
                    success: function (res) {
                        admin.msg.close(index);
                        if (eval('res.' + option.statusName) == option.statusCode) {
                            return ok(res);
                        } else {
                            return no(res);
                        }
                    },
                    error: function (xhr, textstatus, thrown) {
                        admin.msg.error('Status:' + xhr.status + '、' + xhr.statusText + '、後ほど再試行してください！', function () {
                            ex(this);
                        });
                        return false;
                    },
                    complete: function (data) {
                        // @todo csrf-tokenの更新
                        let token = data.responseJSON ? data.responseJSON.__token__ : ''
                        init.csrf_token = token
                        init.wait_submit = false
                    }
                });
            }
        },
        common: {
            parseNodeStr: function (node) {
                var array = node.split('/');
                $.each(array, function (key, val) {
                    if (key === 0) {
                        val = val.split('.');
                        $.each(val, function (i, v) {
                            val[i] = admin.common.humpToLine(v.replace(v[0], v[0].toLowerCase()));
                        });
                        val = val.join(".");
                        array[key] = val;
                    }
                });
                node = array.join("/");
                return node;
            },
            lineToHump: function (name) {
                return name.replace(/\_(\w)/g, function (all, letter) {
                    return letter.toUpperCase();
                });
            },
            humpToLine: function (name) {
                return name.replace(/([A-Z])/g, "_$1").toLowerCase();
            },
        },
        msg: {
            // 成功メッセージ
            success: function (msg, callback) {
                if (callback === undefined) {
                    callback = function () {
                    }
                }
                var index = layer.msg(msg, {icon: 1, shade: admin.config.shade, scrollbar: false, time: 2000, shadeClose: true}, callback);
                return index;
            },
            // エラーメッセージ
            error: function (msg, callback) {
                if (callback === undefined) {
                    callback = function () {
                    }
                }
                var index = layer.msg(msg, {icon: 2, shade: admin.config.shade, scrollbar: false, time: 3000, shadeClose: true}, callback);
                return index;
            },
            // 警告メッセージボックス
            alert: function (msg, callback) {
                var index = layer.alert(msg, {end: callback, scrollbar: false});
                return index;
            },
            // ダイアログ
            confirm: function (msg, ok, no) {
                var index = layer.confirm(msg, {title: '操作確認', btn: ['確認', 'キャンセル']}, function () {
                    typeof ok === 'function' && ok.call(this);
                }, function () {
                    typeof no === 'function' && no.call(this);
                    self.close(index);
                });
                return index;
            },
            // メッセージ通知
            tips: function (msg, time, callback) {
                var index = layer.msg(msg, {time: (time || 3) * 1000, shade: this.shade, end: callback, shadeClose: true});
                return index;
            },
            // ローディング表示
            loading: function (msg, callback) {
                var index = msg ? layer.msg(msg, {icon: 16, scrollbar: false, shade: this.shade, time: 0, end: callback}) : layer.load(2, {time: 0, scrollbar: false, shade: this.shade, end: callback});
                return index;
            },
            // メッセージボックスを閉じる
            close: function (index) {
                return layer.close(index);
            }
        },
        table: {
            render: function (options) {
                options.init = options.init || init;
                options.modifyReload = admin.parame(options.modifyReload, true);
                options.elem = options.elem || options.init.table_elem;
                options.id = options.id || options.init.table_render_id;
                options.layFilter = options.id + '_LayFilter';
                options.url = options.url || admin.url(options.init.index_url);
                options.headers = admin.headers();
                options.page = admin.parame(options.page, true);
                options.search = admin.parame(options.search, true);
                options.skin = options.skin || 'line';
                options.limit = options.limit || 15;
                options.limits = options.limits || [10, 15, 20, 25, 50, 100];
                options.cols = options.cols || [];
                let searchBtn = options.search ? {
                    title: '検索',
                    layEvent: 'TABLE_SEARCH',
                    icon: 'layui-icon-search',
                    extend: 'data-table-id="' + options.id + '"'
                } : []
                options.defaultToolbar = options.defaultToolbar !== false ? (
                    (options.defaultToolbar === undefined ? ['filter', 'print', 'exports'].concat(searchBtn) : options.defaultToolbar.concat(searchBtn))
                ) : false;
                // モバイル端末かどうかを判定
                if (admin.checkMobile()) {
                    options.defaultToolbar = options.defaultToolbar !== false ? (
                        !options.search ? ['filter'] : ['filter', {
                            title: '検索',
                            layEvent: 'TABLE_SEARCH',
                            icon: 'layui-icon-search',
                            extend: 'data-table-id="' + options.id + '"'
                        }]) : false;
                }

                // 要素オブジェクトにネストがあるか判定
                options.cols = admin.table.formatCols(options.cols, options.init);

                // テーブルlay-filterの初期化
                $(options.elem).attr('lay-filter', options.layFilter);

                // テーブル検索の初期化
                if (options.search === true) {
                    admin.table.renderSearch(options.cols, options.elem, options.id);
                }

                // テーブル左上ツールバーの初期化
                options.toolbar = options.toolbar || ['refresh', 'add', 'delete', 'export', 'recycle'];
                options.toolbar = admin.table.renderToolbar(options.toolbar, options.elem, options.id, options.init);

                // 操作リスト権限があるか判定
                options.cols = admin.table.renderOperat(options.cols, options.elem);

                // 初期デフォルト検索条件があるか判定
                options.where = {}
                $.each(options.cols, function (_, colsV) {
                    let formatFilter = {}
                    let formatOp = {}
                    $.each(colsV, function (i, v) {
                        if (v.field) {
                            if (v.searchValue) {
                                formatFilter[v.field] = v.searchValue
                                formatOp[v.field] = v.searchOp || '='
                                options.where['filter'] = JSON.stringify(formatFilter);
                                options.where['op'] = JSON.stringify(formatOp);
                            }
                        }
                    })
                })

                // テーブル上部ページネーションの初期化
                if (options.pageTop !== false) {
                    let originDone = options.done;
                    options.done = function (res, curr, count) {
                        if (typeof originDone === 'function') {
                            originDone.call(this, res, curr, count);
                        }
                        admin.table.addTopPage(this);
                    };
                }

                // テーブル初期化
                var newTable = table.render(options);

                // テーブル検索表示切替の監視
                admin.table.listenToolbar(options.layFilter, options.id);

                // テーブルスイッチ切替の監視
                admin.table.renderSwitch(options.cols, options.init, options.id, options.modifyReload);

                // テーブルスイッチ切替の監視
                admin.table.listenEdit(options.init, options.layFilter, options.id, options.modifyReload);

                // テーブルソートの監視
                admin.table.listenSort(options);

                return newTable;
            },
            renderToolbar: function (data, elem, tableId, init) {
                data = data || [];
                if (typeof data == "object") {
                    var toolbarHtml = '';
                    $.each(data, function (i, v) {
                        if (v === 'refresh') {
                            toolbarHtml += ' <button class="layui-btn layui-btn-sm layuimini-btn-primary" data-table-refresh="' + tableId + '"><i class="fa fa-refresh"></i> </button>\n';
                        } else if (v === 'add') {
                            if (admin.checkAuth('add', elem)) {
                                toolbarHtml += '<button class="layui-btn layui-btn-normal layui-btn-sm" data-open="' + init.add_url + '" data-title="追加"><i class="fa fa-plus"></i> 追加</button>\n';
                            }
                        } else if (v === 'delete') {
                            if (admin.checkAuth('delete', elem)) {
                                toolbarHtml += '<button class="layui-btn layui-btn-sm layui-btn-danger" data-url="' + init.delete_url + '" data-table-delete="' + tableId + '"><i class="fa fa-trash"></i> 削除</button>\n';
                            }
                        } else if (v === 'export') {
                            if (admin.checkAuth('export', elem)) {
                                toolbarHtml += '<button class="layui-btn layui-btn-sm layui-btn-success easyadmin-export-btn" data-url="' + init.export_url + '" data-table-export="' + tableId + '"><i class="fa fa-file-excel"></i> エクスポート</button>\n';
                            }
                        } else if (v === 'recycle') {
                            if (init.recycle_url === undefined) {
                                console.warn('未定义回收站地址 init.recycle_url')
                                return false
                            }
                            if (admin.checkAuth('recycle', elem)) {
                                toolbarHtml += '<button class="layui-btn layui-btn-sm layui-bg-orange" data-open="' + init.recycle_url + '" data-title="ゴミ箱"><i class="fa fa-recycle"></i> ゴミ箱</button>\n';
                            }
                        } else if (typeof v === "object") {
                            $.each(v, function (ii, vv) {
                                vv.class = vv.class || '';
                                vv.icon = vv.icon || '';
                                vv.auth = vv.auth || '';
                                vv.url = vv.url || '';
                                vv.method = vv.method || 'open';
                                vv.title = vv.title || vv.text;
                                vv.text = vv.text || vv.title;
                                vv.extend = vv.extend || '';
                                vv.checkbox = vv.checkbox || false;
                                if (admin.checkAuth(vv.auth, elem)) {
                                    toolbarHtml += admin.table.buildToolbarHtml(vv, tableId);
                                }
                            });
                        }
                    });
                    return `<div><div class="layui-btn-group">${toolbarHtml}</div></div>`;
                }
                return data
            },
            renderSearch: function (cols, elem, tableId) {
                // TODO 最初のテーブル検索フィールドのみ初期化。複数ある場合は(稀な要件だが)自分で拡張すること
                cols = cols[0] || {};
                var newCols = [];
                var formHtml = '';
                $.each(cols, function (i, d) {
                    d.field = d.field || false;
                    d.fieldAlias = admin.parame(d.fieldAlias, d.field);
                    d.title = d.title || d.field || '';
                    d.selectList = d.selectList || {};
                    d.search = admin.parame(d.search, true);
                    d.searchTip = d.searchTip || '検索' + d.title || '';
                    d.searchValue = d.searchValue || '';
                    d.laySearch = d.laySearch || false;
                    d.searchOp = d.searchOp || '%*%';
                    d.timeType = d.timeType || 'datetime';
                    if (d.field !== false && d.search !== false) {
                        switch (d.search) {
                            case true:
                                formHtml += '\t<div class="layui-form-item layui-inline">\n' +
                                    '<label class="layui-form-label">' + d.title + '</label>\n' +
                                    '<div class="layui-input-inline">\n' +
                                    '<input id="c-' + d.fieldAlias + '" name="' + d.fieldAlias + '" data-search-op="' + d.searchOp + '" value="' + d.searchValue + '" placeholder="' + d.searchTip + '" class="layui-input">\n' +
                                    '</div>\n' +
                                    '</div>';
                                break;
                            case  'select':
                                d.searchOp = '=';
                                var selectHtml = '';
                                $.each(d.selectList, function (sI, sV) {
                                    var selected = '';
                                    if (sI == d.searchValue) {
                                        selected = 'selected=""';
                                    }
                                    selectHtml += '<option value="' + sI + '" ' + selected + '>' + sV + '</option>/n';
                                });
                                var laySearch = ''
                                if (true === d.laySearch) {
                                    laySearch = 'lay-search'
                                }
                                formHtml += '\t<div class="layui-form-item layui-inline">\n' +
                                    '<label class="layui-form-label">' + d.title + '</label>\n' +
                                    '<div class="layui-input-inline">\n' +
                                    '<select class="layui-select" id="c-' + d.fieldAlias + '" name="' + d.fieldAlias + '"  data-search-op="' + d.searchOp + '" ' + laySearch + ' lay-filter="' + d.fieldAlias + '">\n' + '<option value="">- 全て -</option> \n' +
                                    selectHtml +
                                    '</select>\n' +
                                    '</div>\n' +
                                    '</div>';
                                break;
                            case 'xmSelect':
                                formHtml += '\t<div class="layui-form-item layui-inline">\n' +
                                    '<label class="layui-form-label">' + d.title + '</label>\n' +
                                    '<div class="layui-input-inline">\n' +
                                    '<div id="c-' + d.fieldAlias + '" class="tableSearch-xmSelect xmSelect-' + d.fieldAlias + '" name="' + d.fieldAlias + '" data-search-op="' + d.searchOp + '" data-search-value="' + d.searchValue + '"></div>\n' +
                                    '</div>\n' +
                                    '</div>';
                                init.xmSelectList[d.fieldAlias] = d.selectList
                                break;
                            case 'range':
                                d.searchOp = 'range';
                                formHtml += '\t<div class="layui-form-item layui-inline">\n' +
                                    '<label class="layui-form-label">' + d.title + '</label>\n' +
                                    '<div class="layui-input-inline">\n' +
                                    '<input style="width: 275px;font-size: 0.82rem" id="c-' + d.fieldAlias + '" name="' + d.fieldAlias + '"  data-search-op="' + d.searchOp + '"  value="' + d.searchValue + '" placeholder="' + d.searchTip + '" class="layui-input">\n' +
                                    '</div>\n' +
                                    '</div>';
                                break;
                            case 'time':
                                d.searchOp = '=';
                                formHtml += '\t<div class="layui-form-item layui-inline">\n' +
                                    '<label class="layui-form-label">' + d.title + '</label>\n' +
                                    '<div class="layui-input-inline">\n' +
                                    '<input id="c-' + d.fieldAlias + '" name="' + d.fieldAlias + '"  data-search-op="' + d.searchOp + '"  value="' + d.searchValue + '" placeholder="' + d.searchTip + '" class="layui-input">\n' +
                                    '</div>\n' +
                                    '</div>';
                                break;
                            case 'date':
                                d.searchOp = '=';
                                formHtml += `<div class="layui-form-item layui-inline">
                                                <label class="layui-form-label">${d.title}</label>
                                                <div class="layui-input-inline">
                                                    <input data-date data-date-type="date" id="c-${d.fieldAlias}" name="${d.fieldAlias}" data-search-op="${d.searchOp}"  value="${d.searchValue}" placeholder="${d.searchTip}" class="layui-input">
                                                </div>
                                            </div>`
                                break;
                            case 'datetime':
                                // 日付形式：yyyy-MM-dd HH:mm:ss に適用
                                d.searchOp = 'datetime';
                                formHtml += '<div class="layui-form-item layui-inline">\n' +
                                    '<label class="layui-form-label">' + d.title + '</label>\n' +
                                    '<div class="layui-input-inline">\n' +
                                    '<input style="width: 275px;font-size: 0.82rem" id="c-' + d.fieldAlias + '" name="' + d.fieldAlias + '"  data-search-op="' + d.searchOp + '"  value="' + d.searchValue + '" placeholder="' + d.searchTip + '" class="layui-input">\n' +
                                    '</div>\n' +
                                    '</div>';
                                break;
                        }
                        newCols.push(d);
                    }
                });
                if (formHtml !== '') {

                    // デフォルトで検索フォームを表示
                    let searchTableShow = $(elem).attr('searchTableShow') || 'true'
                    // デフォルトで検索フォームのオートコンプリートを無効化
                    let searchTableAutocomplete = $(elem).attr('searchTableAutocomplete') || 'false'

                    let tableSearchClass = searchTableShow === 'false' ? 'table-search-fieldset layui-hide' : 'table-search-fieldset'
                    $(elem).before('<fieldset id="searchFieldset_' + tableId + '" class="' + tableSearchClass + '">\n' +
                        '<legend>検索条件</legend>\n' +
                        '<form class="layui-form layui-form-pane form-search">\n' +
                        formHtml +
                        '<div class="layui-form-item layui-inline" style="margin-left: 115px">\n' +
                        '<button type="submit" class="layui-btn layui-btn-normal" data-type="tableSearch" data-table="' + tableId + '" lay-submit lay-filter="' + tableId + '_filter"> 検 索</button>\n' +
                        '<button type="reset" class="layui-btn layui-btn-primary" data-table-reset="' + tableId + '"> リ セ ッ ト </button>\n' +
                        ' </div>' +
                        '</form>' +
                        '</fieldset>');

                    admin.table.listenTableSearch(tableId);

                    // フォーム初期化
                    form.set({
                        // inputのデフォルトオートコンプリートを無効にするか
                        autocomplete: searchTableAutocomplete == 'false' ? 'off' : 'on'
                    })
                    form.render();
                    $.each(newCols, function (ncI, ncV) {
                        if (ncV.search === 'range' || ncV.search === 'datetime') {
                            laydate.render({
                                range: true, type: ncV.timeType, elem: '[name="' + ncV.fieldAlias + '"]', rangeLinked: true,
                                shortcuts: getRangeShortcuts()
                            });
                        }
                        if (ncV.search === 'time') {
                            laydate.render({type: ncV.timeType, elem: '[name="' + ncV.fieldAlias + '"]'});
                        }
                    });
                }
            },
            renderSwitch: function (cols, tableInit, tableId, modifyReload) {
                tableInit.modify_url = tableInit.modify_url || false;
                cols = cols[0] || {};
                tableId = tableId || init.table_render_id;
                if (cols.length > 0) {
                    $.each(cols, function (i, v) {
                        v.filter = v.filter || false;
                        if (v.filter !== false && tableInit.modify_url !== false) {
                            admin.table.listenSwitch({filter: v.filter, url: tableInit.modify_url, tableId: tableId, modifyReload: modifyReload});
                        }
                    });
                }
            },
            renderOperat(data, elem) {
                for (dk in data) {
                    var col = data[dk];
                    var operat = col[col.length - 1].operat;
                    if (operat !== undefined) {
                        var check = false;
                        for (key in operat) {
                            var item = operat[key];
                            if (typeof item === 'string') {
                                if (admin.checkAuth(item, elem)) {
                                    check = true;
                                    break;
                                }
                            } else {
                                for (k in item) {
                                    var v = item[k];
                                    if (v.auth !== undefined && admin.checkAuth(v.auth, elem)) {
                                        check = true;
                                        break;
                                    }
                                }
                            }
                        }
                        if (!check) {
                            data[dk].pop()
                        }
                    }
                }
                return data;
            },
            buildToolbarHtml: function (toolbar, tableId) {
                var html = '';
                toolbar.class = toolbar.class || '';
                toolbar.icon = toolbar.icon || '';
                toolbar.auth = toolbar.auth || '';
                toolbar.url = toolbar.url || '';
                toolbar.extend = toolbar.extend || '';
                toolbar.method = toolbar.method || 'open';
                toolbar.field = toolbar.field || 'id';
                toolbar.title = toolbar.title || toolbar.text;
                toolbar.text = toolbar.text || toolbar.title;
                toolbar.checkbox = toolbar.checkbox || false;

                var formatToolbar = toolbar;
                formatToolbar.icon = formatToolbar.icon !== '' ? '<i class="' + formatToolbar.icon + '"></i> ' : '';
                formatToolbar.class = formatToolbar.class !== '' ? 'class="' + formatToolbar.class + '" ' : '';
                if (toolbar.method === 'open') {
                    formatToolbar.method = formatToolbar.method !== '' ? 'data-open="' + formatToolbar.url + '" data-title="' + formatToolbar.title + '" ' : '';
                } else if (toolbar.method === 'none') { // extendと組み合わせてカスタムボタン監視に使用
                    formatToolbar.method = '';
                } else {
                    formatToolbar.method = formatToolbar.method !== '' ? 'data-request="' + formatToolbar.url + '" data-title="' + formatToolbar.title + '" ' : '';
                }
                formatToolbar.checkbox = toolbar.checkbox ? ' data-checkbox="true" ' : '';
                formatToolbar.tableId = tableId !== undefined ? ' data-table="' + tableId + '" ' : '';
                html = '<button ' + formatToolbar.class + formatToolbar.method + formatToolbar.extend + formatToolbar.checkbox + formatToolbar.tableId + '>' + formatToolbar.icon + formatToolbar.text + '</button>';

                return html;
            },
            buildOperatHtml: function (operat, data) {
                var html = '';
                operat.class = operat.class || '';
                operat.icon = operat.icon || '';
                operat.auth = operat.auth || '';
                operat.url = operat.url || '';
                operat.extend = operat.extend || '';
                operat.method = operat.method || 'open';
                operat.field = operat.field || 'id';
                operat.title = operat.title || operat.text;
                operat.text = operat.text || operat.title;
                operat.visible = typeof operat.visible !== 'undefined' ? operat.visible : true;

                var formatOperat = operat;
                formatOperat.icon = formatOperat.icon !== '' ? '<i class="' + formatOperat.icon + '"></i> ' : '';
                formatOperat.class = formatOperat.class !== '' ? 'class="' + formatOperat.class + '" ' : '';
                if (operat.method === 'open') {
                    formatOperat.method = formatOperat.method !== '' ? 'data-open="' + formatOperat.url + '" data-title="' + formatOperat.title + '" ' : '';
                } else if (operat.method === 'none') { // extendと組み合わせてカスタムボタン監視に使用
                    formatOperat.method = '';
                } else {
                    formatOperat.method = formatOperat.method !== '' ? 'data-request="' + formatOperat.url + '" data-title="' + formatOperat.title + '" ' : '';
                }
                html = '<a ' + formatOperat.class + formatOperat.method + formatOperat.extend + '>' + formatOperat.icon + formatOperat.text + '</a>';

                if ('function' === typeof formatOperat.visible) {
                    let visible = formatOperat.visible(data);
                    if (typeof visible === 'boolean') {
                        if (!visible) html = ''
                    }
                } else {
                    if (typeof formatOperat.visible === 'boolean') {
                        if (!formatOperat.visible) html = ''
                    }
                }

                return html;
            },
            toolSpliceUrl(url, field, data) {
                url = url.indexOf("?") !== -1 ? url + '&' + field + '=' + data[field] : url + '?' + field + '=' + data[field];
                return url;
            },
            formatCols: function (cols, init) {
                for (i in cols) {
                    var col = cols[i];
                    for (index in col) {
                        var val = col[index];

                        // 初期化データを含むか判定
                        if (val.init === undefined) {
                            cols[i][index]['init'] = init;
                        }

                        // 列操作バーの書式設定
                        if (val.templet === admin.table.tool && val.operat === undefined) {
                            cols[i][index]['operat'] = ['edit', 'delete'];
                        }

                        // スイッチコンポーネントを含むか判定
                        if (val.templet === admin.table.switch && val.filter === undefined) {
                            cols[i][index]['filter'] = val.field;
                        }

                        // 検索ドロップダウンリストを含むか判定
                        if (val.selectList !== undefined && val.search === undefined) {
                            cols[i][index]['search'] = 'select';
                        }

                        // 初期配置方向を設定するか判定
                        if (val.align === undefined) {
                            cols[i][index]['align'] = 'center';
                        }

                        // 一部のフィールドでソートを有効化
                        var sortDefaultFields = ['id', 'sort'];
                        if (val.sort === undefined && sortDefaultFields.indexOf(val.field) >= 0) {
                            cols[i][index]['sort'] = true;
                        }

                        // 画像の高さを初期化
                        if (val.templet === admin.table.image && val.imageHeight === undefined) {
                            cols[i][index]['imageHeight'] = 40;
                        }

                        // 複数階層オブジェクトか判定
                        if (val.field !== undefined && val.field.split(".").length > 1) {
                            if (val.templet === undefined) {
                                cols[i][index]['templet'] = admin.table.value;
                            }
                        }

                        // リストデータ変換か判定
                        if (val.selectList !== undefined && val.templet === undefined) {
                            cols[i][index]['templet'] = admin.table.list;
                        }

                    }
                }
                return cols;
            },
            tool: function (data, option) {
                var option = data.LAY_COL || {};
                option.operat = option.operat || ['edit', 'delete'];
                var elem = option.init.table_elem || init.table_elem;
                var html = '';
                $.each(option.operat, function (i, item) {
                    if (typeof item === 'string') {
                        switch (item) {
                            case 'edit':
                                var operat = {
                                    class: 'layui-btn layui-btn-success layui-btn-xs',
                                    method: 'open',
                                    field: 'id',
                                    icon: '',
                                    text: '編集',
                                    title: '編集情報',
                                    auth: 'edit',
                                    url: option.init.edit_url,
                                    extend: ""
                                };
                                operat.url = admin.table.toolSpliceUrl(operat.url, operat.field, data);
                                if (admin.checkAuth(operat.auth, elem)) {
                                    html += admin.table.buildOperatHtml(operat, data);
                                }
                                break;
                            case 'delete':
                                var operat = {
                                    class: 'layui-btn layui-btn-danger layui-btn-xs',
                                    method: 'get',
                                    field: 'id',
                                    icon: '',
                                    text: '削除',
                                    title: '削除してもよろしいですか？',
                                    auth: 'delete',
                                    url: option.init.delete_url,
                                    extend: ""
                                };
                                operat.url = admin.table.toolSpliceUrl(operat.url, operat.field, data);
                                if (admin.checkAuth(operat.auth, elem)) {
                                    html += admin.table.buildOperatHtml(operat, data);
                                }
                                break;
                        }

                    } else if (typeof item === 'object') {

                        $.each(item, function (i, operat) {
                            if (typeof operat !== 'object') return

                            if ('function' === typeof operat.templet) {
                                html += operat.templet(data);
                                return true;
                            }

                            operat.class = operat.class || '';
                            operat.icon = operat.icon || '';
                            operat.auth = operat.auth || '';
                            operat.url = operat.url || '';
                            operat.method = operat.method || 'open';
                            operat.field = operat.field || 'id';
                            operat.title = operat.title || operat.text;
                            operat.text = operat.text || operat.title;
                            operat.extend = operat.extend || '';

                            // テーブル操作ボタンのポップアップタイトルスタイル。extraはテーブル内でタイトルに追加するフィールド
                            operat.extra = operat.extra || '';
                            if (data[operat.extra] !== undefined) {
                                operat.title = data[operat.extra] + ' - ' + operat.title;
                            }

                            operat.url = admin.table.toolSpliceUrl(operat.url, operat.field, data);
                            if (admin.checkAuth(operat.auth, elem)) {
                                html += admin.table.buildOperatHtml(operat, data);
                            }
                        });
                    }
                });
                return html;
            },
            list: function (data, option) {
                var option = data.LAY_COL || {};
                option.selectList = option.selectList || {};
                try {
                    var value = admin.table.defaultValue(data);
                } catch (e) {
                    var value = undefined;
                }
                if (option.selectList[value] === undefined || option.selectList[value] === '' || option.selectList[value] === null) {
                    return value;
                } else {
                    return option.selectList[value];
                }
            },
            image: function (data, option) {
                var option = data.LAY_COL || {};
                option.imageWidth = option.imageWidth || 200;
                option.imageHeight = option.imageHeight || 40;
                option.imageSplit = option.imageSplit || '|';
                option.imageJoin = option.imageJoin || '<br>';
                option.title = option.title || option.field;
                var field = option.field,
                    title = data[option.title];
                try {
                    var value = admin.table.defaultValue(data);
                } catch (e) {
                    var value = undefined;
                }
                if (value === undefined || value === null) {
                    return '<img style="max-width: ' + option.imageWidth + 'px; max-height: ' + option.imageHeight + 'px;" src="' + value + '" data-image="' + title + '">';
                } else {
                    var values = value.split(option.imageSplit),
                        valuesHtml = [];
                    values.forEach((value, index) => {
                        valuesHtml.push('<img style="max-width: ' + option.imageWidth + 'px; max-height: ' + option.imageHeight + 'px;" class="lazyload" src="/static/common/images/loading.gif" data-src="' + value + '" data-image="' + title + '">');
                    });
                    $(function () {
                        $("img.lazyload").lazyload({threshold: 1});
                    })
                    return valuesHtml.join(option.imageJoin);
                }
            },
            url: function (data, option) {
                var option = data.LAY_COL || {};
                try {
                    var value = admin.table.defaultValue(data);
                } catch (e) {
                    var value = undefined;
                }
                return '<a class="layuimini-table-url" href="' + value + '" target="_blank" class="label bg-green">' + value + '</a>';
            },
            switch: function (data, option) {
                var option = data.LAY_COL || {};
                option.filter = option.filter || option.field || null;
                option.checked = option.checked || 1;
                option.tips = option.tips || 'ON|OFF';
                try {
                    var value = admin.table.defaultValue(data);
                } catch (e) {
                    var value = undefined;
                }
                var checked = value === option.checked ? 'checked' : '';
                return laytpl('<input type="checkbox" name="' + option.field + '" value="' + data.id + '" lay-skin="switch" lay-text="' + option.tips + '" lay-filter="' + option.filter + '" ' + checked + ' >').render(data);
            },
            price: function (data, option) {
                var option = data.LAY_COL || {};
                try {
                    var value = admin.table.defaultValue(data);
                } catch (e) {
                    var value = undefined;
                }
                return '<span>¥' + value + '</span>';
            },
            percent: function (data, option) {
                var option = data.LAY_COL || {};
                try {
                    var value = admin.table.defaultValue(data);
                } catch (e) {
                    var value = undefined;
                }
                return '<span>' + value + '%</span>';
            },
            icon: function (data, option) {
                var option = data.LAY_COL || {};
                try {
                    var value = admin.table.defaultValue(data);
                } catch (e) {
                    var value = undefined;
                }
                return '<i class="' + value + '"></i>';
            },
            text: function (data, option) {
                var option = data.LAY_COL || {};
                try {
                    var value = admin.table.defaultValue(data);
                } catch (e) {
                    var value = undefined;
                }
                return '<span class="line-limit-length">' + value + '</span>';
            },
            value: function (data, option) {
                var option = data.LAY_COL || {};
                try {
                    var value = admin.table.defaultValue(data);
                } catch (e) {
                    var value = undefined;
                }
                return '<span>' + value + '</span>';
            },
            //タイムスタンプを日付に変換
            date: function (data, option) {
                var option = data.LAY_COL || {};
                var field = option.field, value = '';
                try {
                    value = eval("data." + field);
                } catch (e) {
                }
                if (!admin.empty(value)) {
                    value = util.toDateString(value * 1000, option.format || 'yyyy-MM-dd HH:mm:ss');
                }
                return '<span>' + value + '</span>';
            },
            // 統一列データ処理
            defaultValue(data, field, _value) {
                if (!data.LAY_COL) {
                    return '';
                }
                var option = data.LAY_COL || {};
                field = field || option.field;
                _value = _value || option.defaultValue;
                var valueParser = option.valueParser;
                var value = _value;
                try {
                    value = eval("data." + field);
                } catch (e) {
                    value = undefined;
                }

                if (_value != undefined && admin.empty(value)) {
                    value = defaultValue;
                }

                if (typeof valueParser == 'function') {
                    value = valueParser(value, data);
                }

                return value;
            },
            listenTableSearch: function (tableId) {
                if (Object.keys(init.xmSelectList).length > 0) {
                    $.each(init.xmSelectList, function (index, value) {
                        let xmSearchValue = $('#c-' + index).data('search-value') || [];
                        if (!Array.isArray(xmSearchValue)) xmSearchValue = (xmSearchValue.toString()).split(',')
                        const keysArray = Object.keys(value).map((key) => {
                            return {name: value[key], value: key, selected: xmSearchValue.indexOf(key) !== -1}
                        })
                        init.xmSelectModel[index] = xmSelect.render({
                            el: '.xmSelect-' + index, language: 'zn', data: keysArray, name: index,
                            filterable: true, paging: true, pageSize: 10, toolbar: {show: true},
                            theme: {color: getComputedStyle(document.documentElement).getPropertyValue('--ea8-theme-main-color') || '#16b777'}
                        })
                    })
                }
                form.on('submit(' + tableId + '_filter)', function (data) {
                    var dataField = data.field;
                    var formatFilter = {},
                        formatOp = {};
                    $.each(dataField, function (key, val) {
                        if (val !== '') {
                            formatFilter[key] = val;
                            const domEl = document.getElementById('c-' + key);
                            let op = $(domEl).attr('data-search-op');
                            op = op || '%*%';
                            formatOp[key] = op;
                        }
                    });
                    table.reload(tableId, {
                        page: {
                            curr: 1
                        }
                        , where: {
                            filter: JSON.stringify(formatFilter),
                            op: JSON.stringify(formatOp)
                        }
                    }, 'data');
                    return false;
                });
            },
            listenSwitch: function (option, ok) {
                option.filter = option.filter || '';
                option.url = option.url || '';
                option.field = option.field || option.filter || '';
                option.tableId = option.tableId || init.table_render_id;
                option.modifyReload = option.modifyReload || false;
                form.on('switch(' + option.filter + ')', function (obj) {
                    var checked = obj.elem.checked ? 1 : 0;
                    if (typeof ok === 'function') {
                        return ok({
                            id: obj.value,
                            checked: checked,
                        });
                    } else {
                        var data = {
                            id: obj.value,
                            field: option.field,
                            value: checked,
                        };
                        admin.request.post({
                            url: option.url,
                            prefix: true,
                            data: data,
                        }, function (res) {
                            if (option.modifyReload) {
                                table.reload(option.tableId);
                            }
                        }, function (res) {
                            admin.msg.error(res.msg, function () {
                                table.reload(option.tableId);
                            });
                        }, function () {
                            table.reload(option.tableId);
                        });
                    }
                });
            },
            listenToolbar: function (layFilter, tableId) {
                table.on('toolbar(' + layFilter + ')', function (obj) {

                    // 検索フォームの表示
                    switch (obj.event) {
                        case 'TABLE_SEARCH':
                            var searchFieldsetId = 'searchFieldset_' + tableId;
                            var _that = $("#" + searchFieldsetId);
                            if (_that.hasClass("layui-hide")) {
                                _that.removeClass('layui-hide');
                            } else {
                                _that.addClass('layui-hide');
                            }
                            break;
                    }
                });
            },
            listenEdit: function (tableInit, layFilter, tableId, modifyReload) {
                tableInit.modify_url = tableInit.modify_url || false;
                tableId = tableId || init.table_render_id;
                if (tableInit.modify_url !== false) {
                    table.on('edit(' + layFilter + ')', function (obj) {
                        var value = obj.value,
                            data = obj.data,
                            id = data.id,
                            field = obj.field;
                        var _data = {
                            id: id,
                            field: field,
                            value: value,
                        };
                        admin.request.post({
                            url: tableInit.modify_url,
                            prefix: true,
                            data: _data,
                        }, function (res) {
                            if (modifyReload) {
                                table.reload(tableId);
                            }
                        }, function (res) {
                            admin.msg.error(res.msg, function () {
                                table.reload(tableId);
                            });
                        }, function () {
                            table.reload(tableId);
                        });
                    });
                }
            },
            listenSort: function (options) {
                table.on('sort(' + options.layFilter + ')', function (obj) {
                    let defaultWhere = {}
                    $.each(options.cols, function (_, colsV) {
                        let formatFilter = {}
                        let formatOp = {}
                        $.each(colsV, function (i, v) {
                            if (v.field) {
                                if ($('#c-' + v.field).val()) {
                                    formatFilter[v.field] = $('#c-' + v.field).val()
                                    formatOp[v.field] = v.searchOp || '='
                                    defaultWhere['filter'] = JSON.stringify(formatFilter);
                                    defaultWhere['op'] = JSON.stringify(formatOp);
                                }
                            }
                        })
                    })
                    let sortWhere = {tableOrder: obj.field + ' ' + obj.type}
                    table.reload(options.id, {
                        where: {...defaultWhere, ...sortWhere}
                    });
                });
            },
            addTopPage: function (tableOptions) {
                try {
                    let $view = $(tableOptions.elem).next('.layui-table-view');
                    if (!$view.length) return;
                    let $bottomPage = $view.children('.layui-table-page').not('.layui-table-page-top');
                    if (!$bottomPage.length) return;
                    let $topPage = $view.children('.layui-table-page-top');
                    if ($topPage.length) return;
                    $topPage = $bottomPage.clone(false);
                    $topPage.addClass('layui-table-page-top');
                    $view.children('.layui-table-tool').after($topPage);
                    let bid = tableOptions.id;
                    $topPage.on('click', 'a, button', function (e) {
                        e.preventDefault();
                        let $t = $(this);
                        if ($t.hasClass('layui-disabled') || $t.hasClass('layui-btn-disabled')) return;
                        if ($t.hasClass('layui-laypage-btn')) {
                            let v = parseInt($topPage.find('input').val());
                            if (v > 0) layui.table.reload(bid, { page: { curr: v } });
                            return;
                        }
                        let page = $t.data('page');
                        if (page !== undefined) {
                            let pn = parseInt(page);
                            if (!isNaN(pn) && pn > 0) {
                                layui.table.reload(bid, { page: { curr: pn } });
                                return;
                            }
                        }
                        let $bottom = $view.children('.layui-table-page').not('.layui-table-page-top');
                        let tag = this.tagName;
                        let idx = $topPage.find(tag).index(this);
                        if (idx >= 0) {
                            let el = $bottom.find(tag).get(idx);
                            if (el) el.click();
                        }
                    });
                    $topPage.on('change', 'select', function () {
                        layui.table.reload(bid, { page: { limit: parseInt(this.value) } });
                    });
                    $topPage.on('keydown', 'input', function (e) {
                        if (e.keyCode === 13) {
                            let v = parseInt(this.value);
                            if (v > 0) layui.table.reload(bid, { page: { curr: v } });
                        }
                    });
                    let bottomEl = $bottomPage[0];
                    if (bottomEl) {
                        let obs = new MutationObserver(function () {
                            let $tp = $view.children('.layui-table-page-top');
                            let $bp = $view.children('.layui-table-page').not('.layui-table-page-top');
                            if ($tp.length && $bp.length) {
                                $tp.html($bp.html());
                                $tp.find('[id]').attr('id', function () {
                                    return $(this).attr('id') + '_top';
                                });
                            }
                        });
                        obs.observe(bottomEl, { childList: true, subtree: true, characterData: true, attributes: true });
                    }
                } catch (e) {
                }
            }
        },
        checkMobile: function () {
            var userAgentInfo = navigator.userAgent;
            var mobileAgents = ["Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod"];
            var mobile_flag = false;
            //userAgentからモバイルか判定
            for (var v = 0; v < mobileAgents.length; v++) {
                if (userAgentInfo.indexOf(mobileAgents[v]) > 0) {
                    mobile_flag = true;
                    break;
                }
            }
            var screen_width = window.screen.width;
            var screen_height = window.screen.height;
            //画面解像度からモバイルか判定
            if (screen_width < 600 && screen_height < 800) {
                mobile_flag = true;
            }
            return mobile_flag;
        },
        open: function (title, url, width, height, isResize, shadeClose = false) {
            isResize = isResize === undefined ? true : isResize;
            var index = layer.open({
                title: title,
                type: 2,
                area: [width, height],
                content: url,
                maxmin: true,
                anim: 0,
                moveOut: true,
                shade: 0.3,
                shadeClose: shadeClose,
                scrollbar: false,
                before: function () {
                },
                success: function (layero, index) {
                    if (window.CONFIG.IFRAME_OPEN_TOP == '1') {
                        let iframeUrl = ``
                        try {
                            let iframeId = $('iframe:eq(0)').attr('id')
                            let iframe = document.getElementById(iframeId)
                            iframeUrl = iframe.contentWindow.location.href
                        } catch (e) {
                            iframeUrl = location.href
                        }
                        let _winTopBtn = `
                            <span class="_winTopBtn layui-btn layui-btn-primary layui-btn-xs"
                             style="position: absolute;top: 14px;right: 120px;color: #fff;border-color: #fff;" onclick="window.open('${iframeUrl}')">
                            新しいタブで開く
                            </span>`
                        $('.layui-layer-iframe').append(_winTopBtn)
                    }
                },
                end: function () {
                    index = null
                }
            });
            if (admin.checkMobile()) {
                layer.full(index);
            }

            if (isResize) {
                $(window).on("resize", function () {
                    index && layer.full(index);
                })
            }
        },
        listen: function (preposeCallback, ok, no, ex) {

            // フォーム必須項目の監視
            admin.api.formRequired();

            // フォーム送信イベントの監視
            admin.api.formSubmit(preposeCallback, ok, no, ex);

            // 画像表示の初期化とアップロードイベントの監視
            admin.api.upload();

            // リッチテキストエディタ初期化の監視
            admin.api.editor();

            // ドロップダウン選択生成の監視
            admin.api.select();

            // 日付コントロール生成の監視
            admin.api.date();

            form.render();

            // テーブル編集
            $("body").on("mouseenter", ".table-edit-tips", function () {
                var openTips = layer.tips('行の内容をクリックすると編集できます', $(this), {tips: [2, '#e74c3c'], time: 4000});
            });

            // ポップアップレイヤーの監視
            $('body').on('click', '[data-open]', function () {

                var clientWidth = $(this).attr('data-width'),
                    clientHeight = $(this).attr('data-height'),
                    dataFull = $(this).attr('data-full'),
                    checkbox = $(this).attr('data-checkbox'),
                    url = $(this).attr('data-open'),
                    external = $(this).attr('data-external') || false,
                    tableId = $(this).attr('data-table');

                if (checkbox === 'true') {
                    tableId = tableId || init.table_render_id;
                    var checkStatus = table.checkStatus(tableId),
                        data = checkStatus.data;
                    if (data.length <= 0) {
                        admin.msg.error('操作するデータを選択してください');
                        return false;
                    }
                    var ids = [];
                    $.each(data, function (i, v) {
                        ids.push(v.id);
                    });
                    if (url.indexOf("?") === -1) {
                        url += '?id=' + ids.join(',');
                    } else {
                        url += '&id=' + ids.join(',');
                    }
                }

                clientWidth = clientWidth ?? '65%';
                clientHeight = clientHeight ?? '85%';

                if (dataFull === 'true') {
                    clientWidth = '100%';
                    clientHeight = '100%';
                }

                admin.open(
                    $(this).attr('data-title'),
                    external ? url : admin.url(url),
                    clientWidth,
                    clientHeight,
                );
            });

            // 画像拡大
            $('body').on('click', '[data-image]', function () {
                var title = $(this).attr('data-image'),
                    src = $(this).attr('src'),
                    alt = $(this).attr('alt');
                var photos = {
                    "title": title,
                    "id": Math.random(),
                    "data": [
                        {
                            "alt": alt,
                            "pid": Math.random(),
                            "src": src,
                            "thumb": src
                        }
                    ]
                };
                layer.photos({
                    photos: photos,
                    anim: 5
                });
                return false;
            });

            // 画像グループの拡大
            $('body').on('click', '[data-images]', function () {
                var title = $(this).attr('data-images'),
                    // 現在の要素から親方向にlayuimini-upload-showを探し、最初に見つかった時点で停止、その全ての子要素liを取得
                    doms = $(this).closest(".layuimini-upload-show").children("li"),
                    // クリックされた画像のURL
                    now_src = $(this).attr('src'),
                    alt = $(this).attr('alt'),
                    data = [];
                $.each(doms, function (key, value) {
                    var src = $(value).find('img').attr('src');
                    if (src != now_src) {
                        // 他の画像URLを追加
                        data.push({
                            "alt": alt,
                            "pid": Math.random(),
                            "src": src,
                            "thumb": src
                        });
                    } else {
                        // 現在の画像を先頭に挿入
                        data.unshift({
                            "alt": alt,
                            "pid": Math.random(),
                            "src": now_src,
                            "thumb": now_src
                        });
                    }
                });
                var photos = {
                    "title": title,
                    "id": Math.random(),
                    "data": data,
                };
                layer.photos({
                    photos: photos,
                    anim: 5
                });
                return false;
            });


            // 動的テーブルリフレッシュの監視
            $('body').on('click', '[data-table-refresh]', function () {
                var tableId = $(this).attr('data-table-refresh');
                if (tableId === undefined || tableId === '' || tableId == null) {
                    tableId = init.table_render_id;
                }
                table.reload(tableId);
            });

            // 検索テーブルリセットの監視
            $('body').on('click', '[data-table-reset]', function () {
                let tableId = $(this).attr('data-table-reset');
                if (tableId === undefined || tableId === '' || tableId == null) {
                    tableId = init.table_render_id;
                }
                let cols = table.getOptions(tableId)?.cols || {}
                let defaultWhere = {}
                let formatFilter = {}
                let formatOp = {}
                $.each(cols, function (_, colsV) {
                    $.each(colsV, function (i, v) {
                        if (v.field) {
                            if (v.searchValue) {
                                formatFilter[v.field] = v.searchValue
                                formatOp[v.field] = v.searchOp || '='
                                defaultWhere['filter'] = JSON.stringify(formatFilter);
                                defaultWhere['op'] = JSON.stringify(formatOp);
                            }
                        }
                    })
                })
                if (Object.keys(init.xmSelectModel).length > 0) {
                    $.each(init.xmSelectModel, function (index, value) {
                        init.xmSelectModel[index].setValue([formatFilter[index] || ''])
                    })
                }
                table.reload(tableId, {
                    page: {curr: 1}, where: {...defaultWhere}
                }, 'data');
            });

            // リクエストの監視
            $('body').on('click', '[data-request]', function () {
                var title = $(this).attr('data-title'),
                    url = $(this).attr('data-request'),
                    tableId = $(this).attr('data-table'),
                    addons = $(this).attr('data-addons'),
                    checkbox = $(this).attr('data-checkbox'),
                    direct = $(this).attr('data-direct'),
                    field = $(this).attr('data-field') || 'id';

                title = title || 'この操作を実行してもよろしいですか？';

                if (direct === 'true') {
                    admin.msg.confirm(title, function () {
                        window.location.href = url;
                    });
                    return false;
                }

                var postData = {};
                if (checkbox === 'true') {
                    tableId = tableId || init.table_render_id;
                    var checkStatus = table.checkStatus(tableId),
                        data = checkStatus.data;
                    if (data.length <= 0) {
                        admin.msg.error('操作するデータを選択してください');
                        return false;
                    }
                    var ids = [];
                    $.each(data, function (i, v) {
                        ids.push(v[field]);
                    });
                    postData[field] = ids;
                }

                if (addons !== true && addons !== 'true') {
                    url = admin.url(url);
                }
                tableId = tableId || init.table_render_id;
                admin.msg.confirm(title, function () {
                    admin.request.post({
                        url: url,
                        data: postData,
                    }, function (res) {
                        admin.msg.success(res.msg, function () {
                            table.reload(tableId);
                            $('[data-treetable-refresh]').trigger("click");
                        });
                    })
                });
                return false;
            });

            // Excelエクスポート
            $('body').on('click', '[data-table-export]', function () {
                var tableId = $(this).attr('data-table-export'),
                    url = $(this).attr('data-url');

                let par = $("#searchFieldset_" + tableId).find('form').serialize();
                let parArr = par.split('&')
                var formatFilter = {}, formatOp = {};
                [formatData] = parArr.map((arr) => {
                    [key, val] = arr.split('=');
                    if (val !== '') {
                        formatFilter[key] = val;
                        var op = $('#c-' + key).attr('data-search-op');
                        op = op || '%*%';
                        formatOp[key] = op;
                    }
                    return {formatFilter, formatOp};
                })
                let schPar = 'filter=' + JSON.stringify(formatData.formatFilter) + '&' + 'op=' + JSON.stringify(formatData.formatOp);
                url = (url.includes('?')) ? url + '&' + schPar : url + '?' + schPar;
                var index = admin.msg.confirm('検索条件に基づいてエクスポートします。実行しますか？', function () {
                    window.location = admin.url(url);
                    layer.close(index);
                });
            });

            // データテーブル一括削除
            $('body').on('click', '[data-table-delete]', function () {
                let tableId = $(this).attr('data-table-delete'),
                    url = $(this).attr('data-url');
                tableId = tableId || init.table_render_id;
                url = url !== undefined ? admin.url(url) : window.location.href;
                let checkStatus = table.checkStatus(tableId), data = checkStatus.data;
                if (data.length <= 0) {
                    admin.msg.error('削除するデータを選択してください');
                    return false;
                }
                let ids = [], _filed = 'id'
                if (data[0][_filed] || '') {
                    $.each(data, function (i, v) {
                        ids.push(v.id);
                    });
                } else {
                    let tableCols = table.getOptions(tableId).cols[0]
                    $.each(tableCols, function (i, v) {
                        let _i = i
                        if (v.type === 'checkbox') {
                            _i = i + 1
                            _filed = tableCols[_i]['field']
                        }
                    });
                    $.each(data, function (i, v) {
                        ids.push(v[_filed]);
                    });
                }
admin.msg.confirm('削除してもよろしいですか？', function () {
                    admin.request.post({
                        url: url,
                        data: {
                            [_filed]: ids
                        },
                    }, function (res) {
                        admin.msg.success(res.msg, function () {
                            table.reload(tableId);
                        });
                    });
                });
                return false;
            });

        },
        api: {
            form: function (url, data, ok, no, ex, refreshTable) {
                if (refreshTable === undefined) {
                    refreshTable = true;
                }
                ok = ok || function (res) {
                    res.msg = res.msg || '';
                    admin.msg.success(res.msg, function () {
                        admin.api.closeCurrentOpen({
                            refreshTable: refreshTable
                        });
                    });
                    return false;
                };
                admin.request.post({
                    url: url,
                    data: data,
                }, ok, no, ex);
                return false;
            },
            closeCurrentOpen: function (option) {
                option = option || {};
                option.refreshTable = option.refreshTable || false;
                option.refreshFrame = option.refreshFrame || false;
                if (option.refreshTable === true) {
                    option.refreshTable = init.table_render_id;
                }
                var index = parent.layer.getFrameIndex(window.name);
                parent.layer.close(index);
                if (option.refreshTable !== false) {
                    parent.layui.table.reload(option.refreshTable);
                }
                if (option.refreshFrame) {
                    parent.location.reload();
                }
                return false;
            },
            refreshFrame: function () {
                parent.location.reload();
                return false;
            },
            refreshTable: function (tableName) {
                tableName = tableName || 'currentTable';
                table.reload(tableName);
            },
            formRequired: function () {
                var verifyList = document.querySelectorAll("[lay-verify]");
                if (verifyList.length > 0) {
                    $.each(verifyList, function (i, v) {
                        var verify = $(this).attr('lay-verify');

                        // todo 必須項目処理
                        if (verify.includes('required')) {
                            var label = $(this).parent().prev();
                            if (label.is('label') && !label.hasClass('required')) {
                                label.addClass('required');
                            }
                            if ($(this).attr('lay-reqtext') === undefined && $(this).attr('placeholder') !== undefined) {
                                $(this).attr('lay-reqtext', $(this).attr('placeholder'));
                            }
                            if ($(this).attr('placeholder') === undefined && $(this).attr('lay-reqtext') !== undefined) {
                                $(this).attr('placeholder', $(this).attr('lay-reqtext'));
                            }
                        }

                    });
                }
            },
            formSubmit: function (preposeCallback, ok, no, ex) {
                var formList = document.querySelectorAll("[lay-submit]");

                // フォーム自動送信処理
                if (formList.length > 0) {
                    $.each(formList, function (i, v) {
                        var filter = $(this).attr('lay-filter'),
                            type = $(this).attr('data-type'),
                            refresh = $(this).attr('data-refresh'),
                            url = $(this).attr('lay-submit');
                        // テーブル検索は自動送信しない
                        if (type === 'tableSearch') {
                            return false;
                        }
                        // テーブルリフレッシュが必要か判定
                        if (refresh === 'false') {
                            refresh = false;
                        } else {
                            refresh = true;
                        }
                        // layuiイベントフィルタを自動追加
                        if (filter === undefined || filter === '') {
                            filter = 'save_form_' + (i + 1);
                            $(this).attr('lay-filter', filter)
                        }
                        if (url === undefined || url === '' || url === null) {
                            url = window.location.href;
                        } else {
                            url = admin.url(url);
                        }
                        form.on('submit(' + filter + ')', function (data) {
                            if (init.wait_submit) {
                                layer.msg('クリックが速すぎます', {icon: 16, shade: 0.3, shadeClose: false, time: 1000})
                                return false
                            }
                            var dataField = data.field;
                            var editorList = document.querySelectorAll(".editor");
                            // リッチテキストデータ処理
                            if (editorList.length > 0) {
                                $.each(editorList, function (i, v) {
                                    switch (window.CONFIG.EDITOR_TYPE) {
                                        case 'ckeditor':
                                            var name = $(this).attr("name");
                                            dataField[name] = CKEDITOR.instances[name].getData();
                                            break;
                                        case 'wangEditor':
                                            var name = $(this).attr("name");
                                            dataField[name] = (window["wangEditor_" + i]).getHtml()
                                            break;
                                        case 'EasyMDE':
                                            var name = $(this).attr("name");
                                            dataField[name] = (window["easyMDE" + i]).value()
                                            break;
                                        default:
                                            var name = $(this).attr("id");
                                            dataField[name] = UE.getEditor(name).getContent();
                                    }
                                });
                            }
                            if (typeof preposeCallback === 'function') {
                                dataField = preposeCallback(dataField);
                            }
                            init.wait_submit = true
                            admin.api.form(url, dataField, ok, no, ex, refresh);
                            return false;
                        });
                    });
                }

            },
            upload: function () {
                var uploadList = document.querySelectorAll("[data-upload]");
                var uploadSelectList = document.querySelectorAll("[data-upload-select]");

                if (uploadList.length > 0) {
                    $.each(uploadList, function (i, v) {
                        var uploadExts = $(this).attr('data-upload-exts') || init.upload_exts,
                            uploadName = $(this).attr('data-upload'),
                            uploadNumber = $(this).attr('data-upload-number') || 'one',
                            uploadSign = $(this).attr('data-upload-sign') || '|',
                            uploadAccept = $(this).attr('data-upload-accept') || 'file',
                            uploadAcceptMime = $(this).attr('data-upload-mimetype') || '',
                            elem = "input[name='" + uploadName + "']",
                            uploadElem = this;

                        // アップロードイベントの監視
                        upload.render({
                            elem: this,
                            url: admin.url(init.upload_url),
                            exts: uploadExts,
                            accept: uploadAccept,//アップロード時に検証するファイルタイプ
                            acceptMime: uploadAcceptMime,//ファイル選択ダイアログでフィルタするファイルタイプ
                            multiple: uploadNumber !== 'one',//複数ファイルアップロードか
                            headers: admin.headers(),
                            before: function () {
                                this.headers['X-CSRF-TOKEN'] = init.csrf_token
                            },
                            done: function (res) {
                                if (res.code === 1) {
                                    var url = res.data.url;
                                    if (uploadNumber !== 'one') {
                                        var oldUrl = $(elem).val();
                                        if (oldUrl !== '') {
                                            url = oldUrl + uploadSign + url;
                                        }
                                    }
                                    $(elem).val(url);
                                    $(elem).trigger("input");
                                    admin.msg.success(res.msg);
                                } else {
                                    admin.msg.error(res.msg);
                                }
                                let token = res ? res.__token__ : ''
                                init.csrf_token = token
                                return false;
                            }
                        });

                        // アップロードinput値の変更を監視
                        $(elem).bind("input propertychange", function (event) {
                            var urlString = $(this).val(),
                                urlArray = urlString.split(uploadSign),
                                uploadIcon = $(uploadElem).attr('data-upload-icon') || "file";

                            $('#bing-' + uploadName).remove();
                            if (urlString.length > 0) {
                                var parant = $(this).parent('div');
                                var liHtml = '';
                                $.each(urlArray, function (i, v) {
                                    liHtml += '<li><a><img src="' + v + '" data-image  onerror="this.src=\'' + BASE_URL + 'admin/images/upload-icons/' + uploadIcon + '.png\';this.onerror=null"></a><small class="uploads-delete-tip bg-red badge" data-upload-delete="' + uploadName + '" data-upload-url="' + v + '" data-upload-sign="' + uploadSign + '">×</small></li>\n';
                                });
                                parant.after('<ul id="bing-' + uploadName + '" class="layui-input-block layuimini-upload-show">\n' + liHtml + '</ul>');
                            }

                        });

                        // 空でない場合の画像表示初期化
                        if ($(elem).val() !== '') {
                            $(elem).trigger("input");
                        }
                    });

                    // アップロードファイル削除イベントの監視
                    $('body').on('click', '[data-upload-delete]', function () {
                        var uploadName = $(this).attr('data-upload-delete'),
                            deleteUrl = $(this).attr('data-upload-url'),
                            sign = $(this).attr('data-upload-sign');
                        var confirm = admin.msg.confirm('削除してもよろしいですか？', function () {
                            var elem = "input[name='" + uploadName + "']";
                            var currentUrl = $(elem).val();
                            var url = '';
                            if (currentUrl !== deleteUrl) {
                                url = currentUrl.search(deleteUrl) === 0 ? currentUrl.replace(deleteUrl + sign, '') : currentUrl.replace(sign + deleteUrl, '');
                                $(elem).val(url);
                                $(elem).trigger("input");
                            } else {
                                $(elem).val(url);
                                $('#bing-' + uploadName).remove();
                            }
                            admin.msg.close(confirm);
                        });
                        return false;
                    });
                }

                if (uploadSelectList.length > 0) {
                    $.each(uploadSelectList, function (i, v) {
                        var uploadName = $(this).attr('data-upload-select'),
                            uploadNumber = $(this).attr('data-upload-number') || 'one',
                            uploadSign = $(this).attr('data-upload-sign') || '|';

                        var selectCheck = uploadNumber === 'one' ? 'radio' : 'checkbox';
                        var elem = "input[name='" + uploadName + "']",
                            uploadElem = $(this).attr('id');

                        tableSelect.render({
                            elem: "#" + uploadElem,
                            checkedKey: 'id',
                            searchType: 'more',
                            searchList: [
                                {searchKey: 'title', searchPlaceholder: 'ファイル名を入力'},
                            ],
                            table: {
                                url: admin.url('ajax/getUploadFiles'),
                                cols: [[
                                    {type: selectCheck},
                                    {field: 'id', title: 'ID'},
                                    {field: 'url', minWidth: 80, search: false, title: '画像情報', imageHeight: 30, align: "center", templet: admin.table.image},
                                    {field: 'original_name', width: 150, title: '元のファイル名', align: "center"},
                                    {field: 'mime_type', width: 120, title: 'MIMEタイプ', align: "center"},
                                    {field: 'create_time', width: 200, title: '作成日時', align: "center", search: 'range'},
                                ]]
                            },
                            done: function (e, data) {
                                var urlArray = [];
                                $.each(data.data, function (index, val) {
                                    urlArray.push(val.url)
                                });
                                var url = urlArray.join(uploadSign);
                                admin.msg.success('選択完了', function () {
                                    $(elem).val(url);
                                    $(elem).trigger("input");
                                });
                            }
                        })
                    });
                }
            },
            editor: function () {
                let editorList = document.querySelectorAll(".editor");
                if (editorList.length > 0) {
                    let wangEditors = {}
                    $.each(editorList, function (i, v) {
                        switch (window.CONFIG.EDITOR_TYPE) {
                            case 'ckeditor':
                                CKEDITOR.tools.setCookie('ckCsrfToken', init.csrf_token);
                                CKEDITOR.replace($(this).attr("name"), {
                                    height: $(this).height(),
                                    filebrowserImageUploadUrl: admin.url('ajax/upload?type=editor'),
                                });
                                break;
                            case 'wangEditor':
                                var wangEditor = window.wangEditor;
                                var wangEditorName = "wangEditor_" + i
                                window[wangEditorName] = wangEditor.createEditor({
                                    selector: '#editor_' + $(this).attr('name'),
                                    html: $(this).text(),
                                    config: {
                                        MENU_CONF: {
                                            // 画像アップロード
                                            uploadImage: {
                                                server: window.CONFIG.ADMIN_UPLOAD_URL,
                                                fieldName: 'file',
                                                maxFileSize: window.CONFIG.MAX_FILE_SIZE,
                                                meta: {
                                                    editor: 'editor',
                                                },
                                                async customInsert(res, insertFn) {
                                                    let code = res.code || 0
                                                    if (code != '1') {
                                                         layer.msg(res.msg || 'アップロード失敗', {icon: 2});
                                                         return
                                                     }
                                                     let url = res.data?.url || ''
                                                     let alt = ''
                                                     let href = ''
                                                     insertFn(url, alt, href)
                                                 }
                                             },
                                             // 動画アップロード
                                            uploadVideo: {
                                                server: window.CONFIG.ADMIN_UPLOAD_URL,
                                                fieldName: 'file',
                                                meta: {editor: 'editor',},
                                                async customInsert(res, insertFn) {
                                                    let code = res.code || 0
                                                    if (code != '1') {
                                                        layer.msg(res.msg || 'アップロード失敗', {icon: 2});
                                                        return
                                                    }
                                                    let url = res.data?.url || ''
                                                    let alt = ''
                                                    let href = ''
                                                    insertFn(url, alt, href)
                                                }
                                            }
                                        },
                                    }
                                })
                                let editor = window[wangEditorName]
                                wangEditor.createToolbar({
                                    editor,
                                    selector: '#editor_toolbar_' + $(this).attr("name"),
                                    config: {}
                                })
                                break;
                            case 'EasyMDE':
                                const easyMDEName = "easyMDE" + i
                                window[easyMDEName] = new EasyMDE({
                                    element: document.getElementById($(this).attr("name")),
                                    initialValue: $(this).text(),
                                });
                                break;
                            default:
                                let name = $(this).attr("name");
                                let content = $(this).data('content')
                                let editorOption = {
                                    initialFrameWidth: '100%',
                                    initialFrameHeight: 420,
                                    initialContent: content,
                                    toolbars: [['fullscreen', 'source', '|', 'undo', 'redo', '|',
                                        'bold', 'italic', 'underline', 'fontborder', 'strikethrough', 'superscript', 'subscript', 'removeformat', 'formatmatch', 'autotypeset', 'blockquote', 'pasteplain', '|', 'forecolor', 'backcolor', 'insertorderedlist', 'insertunorderedlist', 'selectall', 'cleardoc', '|',
                                        'rowspacingtop', 'rowspacingbottom', 'lineheight', '|',
                                        'customstyle', 'paragraph', 'fontfamily', 'fontsize', '|',
                                        'directionalityltr', 'directionalityrtl', 'indent', '|',
                                        'justifyleft', 'justifycenter', 'justifyright', 'justifyjustify', '|', 'touppercase', 'tolowercase', '|',
                                        'link', 'unlink', 'anchor', '|', 'imagenone', 'imageleft', 'imageright', 'imagecenter', '|',
                                        'insertimage', 'emotion', 'scrawl', 'insertvideo', 'music', 'attachment', 'map', 'gmap', 'insertframe', 'insertcode', 'webapp', 'pagebreak', 'template', 'background', '|',
                                        'horizontal', 'date', 'time', 'spechars', 'snapscreen', 'wordimage', '|',
                                        'inserttable', 'deletetable', 'insertparagraphbeforetable', 'insertrow', 'deleterow', 'insertcol', 'deletecol', 'mergecells', 'mergeright', 'mergedown', 'splittocells', 'splittorows', 'splittocols', 'charts', '|',
                                        'print', 'preview', 'searchreplace', 'help', 'drafts']
                                    ],
                                }
                                setTimeout(function () {
                                    let _UEditor = new baidu.editor.ui.Editor(editorOption);
                                    _UEditor.render(name);
                                }, 100)
                                break;
                        }
                    });
                }
            },
            select: function () {
                var selectList = document.querySelectorAll("[data-select]");
                $.each(selectList, function (i, v) {
                    var url = $(this).attr('data-select'),
                        selectFields = $(this).attr('data-fields'),
                        value = $(this).attr('data-value'),
                        that = this,
                        html = '<option value=""></option>';
                    var fields = selectFields.replace(/\s/g, "").split(',');
                    if (fields.length !== 2) {
                        return admin.msg.error('ドロップダウン選択フィールドが不正です');
                    }
                    admin.request.get(
                        {
                            url: url,
                            data: {
                                selectFields: selectFields
                            },
                        }, function (res) {
                            var list = res.data;
                            list.forEach(val => {
                                var key = val[fields[0]];
                                if (value !== undefined && key.toString() === value) {
                                    html += '<option value="' + key + '" selected="">' + val[fields[1]] + '</option>';
                                } else {
                                    html += '<option value="' + key + '">' + val[fields[1]] + '</option>';
                                }
                            });
                            $(that).html(html);
                            form.render();
                        }
                    );
                });

                let switchSelectList = document.querySelectorAll("[data-show]");
                $.each(switchSelectList, function (i, v) {
                    let _show = $(this).attr('data-show');
                    if (_show === 'switchSelect') {
                        let _data = $(this).attr('data-list');
                        let _value = $(this).attr('data-value') || ''
                        let _target = $(this).attr('data-target') || ''
                        let _name = $(this).attr('data-name') || ''
                        try {
                            new switchSelect({
                                elem: $(this), data: JSON.parse(_data), default: _value, target: _target, name: _name, disabled: $(this).attr('disabled') === 'disabled'
                            });
                        } catch (e) {
                            console.error(e)
                        }
                    }
                });
            },
            date: function () {
                var dateList = document.querySelectorAll("[data-date]");
                if (dateList.length > 0) {
                    $.each(dateList, function (i, v) {
                        var format = $(this).attr('data-date'),
                            type = $(this).attr('data-date-type'),
                            range = $(this).attr('data-date-range');
                        if (type === undefined || type === '' || type === null) {
                            type = 'datetime';
                        }
                        var options = {
                            elem: this,
                            type: type,
                        };
                        if (format !== undefined && format !== '' && format !== null) {
                            options['format'] = format;
                        }
                        if (range !== undefined) {
                            if (range === null || range === '') {
                                range = '-';
                            }
                            options['range'] = range;
                        }
                        laydate.render(options);
                    });
                }
            },
        },
        ai: {
            chat: function (content, options, cancel) {
                let id = 'chat_' + (new Date()).getTime()
                layer.open({
                    'title': options?.title || 'AI提案',
                    type: 1,
                    area: options?.area || (admin.checkMobile() ? ['95%', '80%'] : ['70%', '80%']),
                    shade: options?.shade || 0,
                    shadeClose: options?.shadeClose || false,
                    scrollbar: options?.scrollbar || false,
                    maxmin: options?.maxmin || true,
                    anim: options?.anim || 0,
                    content: `<div id="${id}"></div>`,
                    success: function (layero, index) {
                        let elem = document.getElementById(id)
                        content = marked.parse(content)
                        elem.innerHTML = `<div class="markdown-body">${content}</div>`
                    },
                    cancel: function (index, layero) {
                        cancel()
                    }
                })
            },
        },
    };

    return admin;
});
