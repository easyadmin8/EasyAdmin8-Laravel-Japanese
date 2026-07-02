layui.define(['table', 'jquery', 'form'], function (exports) {
    "use strict";

    var MOD_NAME = 'tableSelect',
        $ = layui.jquery,
        table = layui.table,
        form = layui.form;
    var tableSelect = function () {
        this.v = '1.1.0';
    };

    /**
     * テーブル選択の初期化
     */
    tableSelect.prototype.render = function (opt) {
        var elem = $(opt.elem);
        var tableDone = opt.table.done || function () {
        };

        //デフォルト設定
        opt.searchKey = opt.searchKey || 'keyword';
        opt.searchPlaceholder = opt.searchPlaceholder || 'キーワード検索';
        opt.checkedKey = opt.checkedKey || '';
        opt.table.page = opt.table.page || true;
        opt.table.height = opt.height || 315;

        //最小幅
        opt.width = opt.width || '530';

        //複数検索条件
        opt.searchType = opt.searchType || 'one';
        opt.searchList = opt.searchList || [{key: opt.searchKey, placeholder: opt.searchPlaceholder}];

        elem.off('click').on('click', function (e) {
            e.stopPropagation();

            if ($('div.tableSelect').length >= 1) {
                return false;
            }

            var t = elem.offset().top + elem.outerHeight() + "px";
            var l = elem.offset().left + "px";
            var tableName = "tableSelect_table_" + new Date().getTime();
            let maxWidth = document.body.clientWidth * .5;
            let tableBox = `
                  <div class="tableSelect layui-anim layui-anim-upbit"
                       style="left:${l};top:${t};border: 1px solid #d2d2d2;background-color: #fff;box-shadow: 0 2px 4px rgba(0,0,0,.12);padding:10px 10px 0 10px;position: absolute;z-index:66666666;margin: 5px 0;border-radius: 2px;min-width:${opt.width}px;max-width:${maxWidth}px">
                  <div class="tableSelectBar" style="padding: 10px 0;">
                  <form class="layui-form" action="" style="display:inline-block;">
               `;

            //複数検索条件かどうか
            if (opt.searchType == 'more') {
                $.each(opt.searchList, function (index, item) {
                    tableBox += '<input style="display:inline-block;width:190px;height:30px;vertical-align:middle;margin-right:-1px;border: 1px solid #C9C9C9;" type="text" name="' + item.searchKey + '" placeholder="' + item.searchPlaceholder + '" autocomplete="off" class="layui-input">';
                });
            } else {
                tableBox += '<input style="display:inline-block;width:190px;height:30px;vertical-align:middle;margin-right:-1px;border: 1px solid #C9C9C9;" type="text" name="' + opt.searchKey + '" placeholder="' + opt.searchPlaceholder + '" autocomplete="off" class="layui-input">';
            }

            tableBox += '<button class="layui-btn layui-btn-sm layui-btn-primary tableSelect_btn_search" lay-submit lay-filter="tableSelect_btn_search"><i class="layui-icon layui-icon-search"></i></button>';
            tableBox += '</form>';
            tableBox += '<button style="float:right;" class="layui-btn layui-btn-sm tableSelect_btn_select">選択<span></span></button>';
            tableBox += '</div>';
            tableBox += '<table id="' + tableName + '" lay-filter="' + tableName + '"></table>';
            tableBox += '</div>';
            tableBox = $(tableBox);
            $('body').append(tableBox);

            //データキャッシュ
            var checkedData = [];

            //テーブル描画
            opt.table.elem = "#" + tableName;
            opt.table.id = tableName;
            opt.table.done = function (res, curr, count) {
                defaultChecked(res, curr, count);
                setChecked(res, curr, count);
                tableDone(res, curr, count);
            };
            var tableSelect_table = table.render(opt.table);

            //ページ選択データの保存
            table.on('radio(' + tableName + ')', function (obj) {
                if (opt.checkedKey) {
                    checkedData = table.checkStatus(tableName).data
                }
                updataButton(table.checkStatus(tableName).data.length)
            })
            table.on('checkbox(' + tableName + ')', function (obj) {
                if (opt.checkedKey) {
                    if (obj.checked) {
                        for (var i = 0; i < table.checkStatus(tableName).data.length; i++) {
                            checkedData.push(table.checkStatus(tableName).data[i])
                        }
                    } else {
                        if (obj.type == 'all') {
                            for (var j = 0; j < table.cache[tableName].length; j++) {
                                for (var i = 0; i < checkedData.length; i++) {
                                    if (checkedData[i][opt.checkedKey] == table.cache[tableName][j][opt.checkedKey]) {
                                        checkedData.splice(i, 1)
                                    }
                                }
                            }
                        } else {
                            // LAYUIの問題により、全選択状態変更時に取得したobjが空になるため、ここでは関数で未選択項目を取得します。
                            var nu = function () {
                                var noCheckedKey = '';
                                for (var i = 0; i < table.cache[tableName].length; i++) {
                                    if (!table.cache[tableName][i].LAY_CHECKED) {
                                        noCheckedKey = table.cache[tableName][i][opt.checkedKey];
                                    }
                                }
                                return noCheckedKey
                            };
                            var noCheckedKey = obj.data[opt.checkedKey] || nu();
                            for (var i = 0; i < checkedData.length; i++) {
                                if (checkedData[i][opt.checkedKey] == noCheckedKey) {
                                    checkedData.splice(i, 1);
                                }
                            }
                        }
                    }
                    checkedData = uniqueObjArray(checkedData, opt.checkedKey);
                    updataButton(checkedData.length)
                } else {
                    updataButton(table.checkStatus(tableName).data.length)
                }
            });

            //テーブル描画後の選択
            function setChecked(res, curr, count) {
                for (var i = 0; i < res.data.length; i++) {
                    for (var j = 0; j < checkedData.length; j++) {
                        if (res.data[i][opt.checkedKey] == checkedData[j][opt.checkedKey]) {
                            res.data[i].LAY_CHECKED = true;
                            var index = res.data[i]['LAY_INDEX'];
                            var checkbox = $('#' + tableName + '').next().find('tr[data-index=' + index + '] input[type="checkbox"]');
                            checkbox.prop('checked', true).next().addClass('layui-form-checked');
                            var radio = $('#' + tableName + '').next().find('tr[data-index=' + index + '] input[type="radio"]');
                            radio.prop('checked', true).next().addClass('layui-form-radioed').find("i").addClass('layui-icon-radio');
                        }
                    }
                }
                var checkStatus = table.checkStatus(tableName);
                if (checkStatus.isAll) {
                    $('#' + tableName + '').next().find('.layui-table-header th[data-field="0"] input[type="checkbox"]').prop('checked', true);
                    $('#' + tableName + '').next().find('.layui-table-header th[data-field="0"] input[type="checkbox"]').next().addClass('layui-form-checked');
                }
                updataButton(checkedData.length)
            }

            //デフォルト選択値の書き込み(checkedData)
            function defaultChecked(res, curr, count) {
                if (opt.checkedKey && elem.attr('ts-selected')) {
                    var selected = elem.attr('ts-selected').split(",");
                    for (var i = 0; i < res.data.length; i++) {
                        for (var j = 0; j < selected.length; j++) {
                            if (res.data[i][opt.checkedKey] == selected[j]) {
                                checkedData.push(res.data[i])
                            }
                        }
                    }
                    checkedData = uniqueObjArray(checkedData, opt.checkedKey);
                }
            }

            //選択数の更新
            function updataButton(n) {
                tableBox.find('.tableSelect_btn_select span').html(n == 0 ? '' : '(' + n + ')')
            }

            //配列の重複除去
            function uniqueObjArray(arr, type) {
                var newArr = [];
                var tArr = [];
                if (arr.length == 0) {
                    return arr;
                } else {
                    if (type) {
                        for (var i = 0; i < arr.length; i++) {
                            if (!tArr[arr[i][type]]) {
                                newArr.push(arr[i]);
                                tArr[arr[i][type]] = true;
                            }
                        }
                        return newArr;
                    } else {
                        for (var i = 0; i < arr.length; i++) {
                            if (!tArr[arr[i]]) {
                                newArr.push(arr[i]);
                                tArr[arr[i]] = true;
                            }
                        }
                        return newArr;
                    }
                }
            }

            //位置修正
            var overHeight = (elem.offset().top + elem.outerHeight() + tableBox.outerHeight() - $(window).scrollTop()) > $(window).height();
            var overWidth = (elem.offset().left + tableBox.outerWidth()) > $(window).width();
            overHeight && tableBox.css({'top': 'auto', 'bottom': '0px'});
            overWidth && tableBox.css({'left': 'auto', 'right': '5px'})

            //キーワード検索
            form.on('submit(tableSelect_btn_search)', function (data) {
                tableSelect_table.reload({
                    where: data.field,
                    page: {
                        curr: 1
                    }
                });
                return false;
            });

            //ダブルクリックで行選択
            table.on('rowDouble(' + tableName + ')', function (obj) {
                var checkStatus = {data: [obj.data]};
                selectDone(checkStatus);
            })

            //ボタンで選択
            tableBox.find('.tableSelect_btn_select').on('click', function () {
                var checkStatus = table.checkStatus(tableName);
                if (checkedData.length > 1) {
                    checkStatus.data = checkedData;
                }
                selectDone(checkStatus);
            })

            //値の書き込みとクローズ
            function selectDone(checkStatus) {
                if (opt.checkedKey) {
                    var selected = [];
                    for (var i = 0; i < checkStatus.data.length; i++) {
                        selected.push(checkStatus.data[i][opt.checkedKey])
                    }
                    elem.attr("ts-selected", selected.join(","));
                }
                opt.done(elem, checkStatus);
                tableBox.remove();
                delete table.cache[tableName];
                checkedData = [];
            }

            //他領域クリックで閉じる
            $(document).mouseup(function (e) {
                var userSet_con = $('' + opt.elem + ',.tableSelect');
                if (!userSet_con.is(e.target) && userSet_con.has(e.target).length === 0) {
                    tableBox.remove();
                    delete table.cache[tableName];
                    checkedData = [];
                }
            });
        })
    }

    /**
     * セレクタの非表示
     */
    tableSelect.prototype.hide = function (opt) {
        $('.tableSelect').remove();
    }

    //自動描画
    var tableSelect = new tableSelect();

    //スクロール時の位置ずれ修正
    if (window.top == window.self) {
        $(window).scroll(function () {
            tableSelect.hide();
        });
    }

    exports(MOD_NAME, tableSelect);
})
