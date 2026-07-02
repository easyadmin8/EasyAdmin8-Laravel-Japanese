layui.define(['layer', 'table'], function (exports) {
    var $ = layui.jquery;
    var layer = layui.layer;
    var table = layui.table;

    var treetable = {
        // ツリー状テーブルの描画
        render: function (param) {
            param.homdPid =  param.homdPid || -1;
        // パラメータの確認
            if (!treetable.checkParam(param)) {
                return;
            }
            // データの取得
            if (param.data) {
                treetable.init(param, param.data);
            } else {
                $.getJSON(param.url, param.where, function (res) {
                    treetable.init(param, res.data);
                });
            }
        },
        // テーブルを描画
        init: function (param, data) {
            var mData = [];
            var doneCallback = param.done;
            var tNodes = data;
            // idとpidフィールドの補完
            for (var i = 0; i < tNodes.length; i++) {
                var tt = tNodes[i];
                if (!tt.id) {
                    if (!param.treeIdName) {
                        layer.msg('パラメーターtreeIdNameは空にできません', {icon: 5});
                        return;
                    }
                    tt.id = tt[param.treeIdName];
                }
                if (!tt.pid) {
                    if (!param.treePidName) {
                        layer.msg('パラメーターtreePidNameは空にできません', {icon: 5});
                        return;
                    }
                    tt.pid = tt[param.treePidName];
                }
                if(tt.pid == param.homdPid){
                    mData.push(tt);
                }
            }

            // データのソート
            var sort = function (s_pid, data) {
                for (var i = 0; i < data.length; i++) {
                    if (data[i].pid == s_pid) {
                        var len = mData.length;
                        if (len > 0 && mData[len - 1].id == s_pid) {
                            mData[len - 1].isParent = true;
                        }
                        mData.push(data[i]);
                        sort(data[i].id, data);
                    }
                }
            };
            sort(param.treeSpid, tNodes);

            // パラメータの上書き
            param.url = undefined;
            param.data = mData;
            param.page = {
                count: param.data.length,
                limit: param.data.length
            };
            param.cols[0][param.treeColIndex].templet = function (d) {
                var mId = d.id;
                var mPid = d.pid;
                var isDir = d.isParent;
                var emptyNum = treetable.getEmptyNum(mPid, mData, param.indent);
                var iconHtml = '';
                for (var i = 0; i < emptyNum; i++) {
                    iconHtml += '<span class="treeTable-empty"></span>';
                }
                if (isDir) {
                    iconHtml += '<i class="layui-icon layui-icon-triangle-d"></i> <i class="layui-icon layui-icon-layer"></i>';
                } else {
                    iconHtml += '<i class="layui-icon layui-icon-file"></i>';
                }
                iconHtml += '&nbsp;&nbsp;';
                var ttype = isDir ? 'dir' : 'file';
                var vg = '<span class="treeTable-icon open" lay-tid="' + mId + '" lay-tpid="' + mPid + '" lay-ttype="' + ttype + '">';
                return vg + iconHtml + d[param.cols[0][param.treeColIndex].field] + '</span>'
            };

            param.done = function (res, curr, count) {
                $(param.elem).next().addClass('treeTable');
                $('.treeTable .layui-table-page').css('display', 'none');
                $(param.elem).next().attr('treeLinkage', param.treeLinkage);
                // イベントをbodyにバインド
                /*$('.treeTable .treeTable-icon').click(function () {
                    treetable.toggleRows($(this), param.treeLinkage);
                });*/
                if (param.treeDefaultClose) {
                    treetable.foldAll(param.elem);
                }
                if (doneCallback) {
                    doneCallback(res, curr, count);
                }
            };

        // テーブルの描画
            table.render(param);
        },
        // インデント数の計算
        getEmptyNum: function (pid, data, indent) {
            var num = 0;
            if (!pid) {
                return num;
            }
            var tPid;
            for (var i = 0; i < data.length; i++) {
                if (pid == data[i].id) {
                    num += indent || 1;
                    tPid = data[i].pid;
                    break;
                }
            }
            return num + treetable.getEmptyNum(tPid, data, indent);
        },
        // 行の展開/折りたたみ
        toggleRows: function ($dom, linkage) {
            var type = $dom.attr('lay-ttype');
            if ('file' == type) {
                return;
            }
            var mId = $dom.attr('lay-tid');
            var isOpen = $dom.hasClass('open');
            if (isOpen) {
                $dom.removeClass('open');
            } else {
                $dom.addClass('open');
            }
            $dom.closest('tbody').find('tr').each(function () {
                var $ti = $(this).find('.treeTable-icon');
                var pid = $ti.attr('lay-tpid');
                var ttype = $ti.attr('lay-ttype');
                var tOpen = $ti.hasClass('open');
                if (mId == pid) {
                    if (isOpen) {
                        $(this).hide();
                        if ('dir' == ttype && tOpen == isOpen) {
                            $ti.trigger('click');
                        }
                    } else {
                        $(this).show();
                        if (linkage && 'dir' == ttype && tOpen == isOpen) {
                            $ti.trigger('click');
                        }
                    }
                }
            });
        },
        // パラメータの確認
        checkParam: function (param) {
            if (!param.treeSpid && param.treeSpid != 0) {
                layer.msg('パラメーターtreeSpidは空にできません', {icon: 5});
                return false;
            }

            if (!param.treeColIndex && param.treeColIndex != 0) {
                layer.msg('パラメーターtreeColIndexは空にできません', {icon: 5});
                return false;
            }
            return true;
        },
        // 全て展開
        expandAll: function (dom) {
            $(dom).next('.treeTable').find('.layui-table-body tbody tr').each(function () {
                var $ti = $(this).find('.treeTable-icon');
                var ttype = $ti.attr('lay-ttype');
                var tOpen = $ti.hasClass('open');
                if ('dir' == ttype && !tOpen) {
                    $ti.trigger('click');
                }
            });
        },
        // 全て折りたたみ
        foldAll: function (dom) {
            $(dom).next('.treeTable').find('.layui-table-body tbody tr').each(function () {
                var $ti = $(this).find('.treeTable-icon');
                var ttype = $ti.attr('lay-ttype');
                var tOpen = $ti.hasClass('open');
                if ('dir' == ttype && tOpen) {
                    $ti.trigger('click');
                }
            });
        }
    };

    // layui.link(layui.cache.base + '/treetable-lay/treetable.css');

    // アイコン列にイベントをバインド
    $('body').on('click', '.treeTable .treeTable-icon', function () {
        var treeLinkage = $(this).parents('.treeTable').attr('treeLinkage');
        if ('true' == treeLinkage) {
            treetable.toggleRows($(this), true);
        } else {
            treetable.toggleRows($(this), false);
        }
    });

    exports('treetable', treetable);
});
