define(["jquery", "easy-admin"], function ($, ea) {


    var init = {
        table_elem: '#currentTable',
        table_render_id: 'currentTableRenderId',
        index_url: 'system/log/index',
        export_url: 'system/log/export',
        deleteMonthLog_url: 'system/log/deleteMonthLog',
    };

    return {
        index: function () {
            var util = layui.util;
            ea.table.render({
                init: init,
                lineStyle: 'height: auto;',
                toolbar: ['refresh', 'export',
                    [{
                        text: 'フレームワークログ',
                        url: 'system/log/record',
                        method: 'open',
                        auth: 'record',
                        class: 'layui-btn layui-btn-sm',
                        icon: 'fa fa-book',
                        extend: 'data-width="95%" data-height="95%"'
                    }, {
                        text: 'ログの一部削除',
                        url: 'system/log/deleteMonthLog',
                        method: 'open',
                        auth: 'deleteMonthLog',
                        class: 'layui-btn layui-btn-sm layui-btn-danger',
                        icon: 'fa fa-remove',
                        extend: 'data-width="35%" data-height="42%"'
                    },
                    ]
                ],
                cols: [[
                    {field: 'id', width: 80, title: 'ID', search: false},
                    {field: 'month', width: 80, title: 'ログ月', hide: true, search: 'time', timeType: 'month', searchValue: util.toDateString(new Date(), 'yyyy-MM')},
                    {
                        field: 'admin.username', width: 100, title: '管理画面ユーザー', search: false, templet: function (res) {
                            let admin = res.admin
                            return admin ? admin.username : '-'
                        }
                    },
                    {field: 'method', width: 100, title: 'リクエストメソッド'},
                    {field: 'title', width: 180, title: 'リクエストタイトル'},
                    {field: 'ip', width: 150, title: 'IPアドレス'},
                    {field: 'url', minWidth: 150, title: 'ルートアドレス', align: "left"},
                    {
                        field: 'content', minWidth: 200, title: 'リクエストデータ', align: "left", templet: function (res) {
                            let html = '<div class="layui-colla-item">' +
                                '<div class="layui-colla-title">クリックしてプレビュー</div>' +
                                '<div class="layui-colla-content">' + prettyFormat(res.content) + '</div>' +
                                '</div>'
                            return '<div class="layui-collapse" lay-accordion>' + html + '</div>'
                        }
                    },
                    {
                        field: 'response', minWidth: 200, title: 'コールバックデータ', align: "left", templet: function (res) {
                            let html = '<div class="layui-colla-item">' +
                                '<div class="layui-colla-title">クリックしてプレビュー</div>' +
                                '<div class="layui-colla-content">' + prettyFormat(res.response) + '</div>' +
                                '</div>'
                            return '<div class="layui-collapse" lay-accordion>' + html + '</div>'
                        }
                    },
                    {field: 'create_time', minWidth: 100, title: '作成日時', search: 'range'},
                ]],
                done: function () {
                    layui.element.render('collapse')
                }
            });
            ea.listen();
        },
        deleteMonthLog: function () {
            layui.form.on('submit(submit)', function (data) {
                let field = data.field
                let options = {
                    url: ea.url(init.deleteMonthLog_url),
                    data: field,
                }
                ea.msg.confirm('操作を実行してもよろしいですか？重要なデータは事前にバックアップしてください！', function () {
                    ea.request.post(options, function (rs) {
                        let msg = rs.msg || '不明～'
                        layer.msg(msg.replace(/\n/g, '<br>'), {shade: 0.3, shadeClose: true, time: 2000})
                    })
                })
            })
        }
    };
});
