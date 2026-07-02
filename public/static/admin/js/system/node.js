define(["jquery", "easy-admin"], function ($, ea) {

    var init = {
        table_elem: '#currentTable',
        table_render_id: 'currentTableRenderId',
        index_url: 'system/node/index',
        add_url: 'system/node/add',
        edit_url: 'system/node/edit',
        delete_url: 'system/node/delete',
        modify_url: 'system/node/modify',
    };

    return {

        index: function () {
            ea.table.render({
                init: init,
                search: false,
                page: false,
                toolbar: ['refresh',
                    [{
                        text: 'ノード更新',
                        title: '新しいノードを更新してもよろしいですか？',
                        url: 'system/node/refreshNode?force=0',
                        method: 'request',
                        auth: 'refresh',
                        class: 'layui-btn layui-btn-success layui-btn-sm',
                        icon: 'fa fa-hourglass',
                        extend: 'data-table="' + init.table_render_id + '"',
                    }, {
                        text: '強制ノード更新',
                        title: 'この操作は既存のノード情報を上書きします。<br>強制更新してもよろしいですか？',
                        url: 'system/node/refreshNode?force=1',
                        method: 'request',
                        auth: 'refresh',
                        class: 'layui-btn layui-btn-sm layui-btn-normal',
                        icon: 'fa fa-hourglass',
                        extend: 'data-table="' + init.table_render_id + '"',
                    }, {

                        text: '無効なノードをクリア',
                        title: '無効なノードをクリアしてもよろしいですか？',
                        url: 'system/node/clearNode',
                        method: 'request',
                        auth: 'clear',
                        class: 'layui-btn layui-btn-sm layui-btn-danger',
                        icon: 'fa fa-trash-o',
                        extend: 'data-table="' + init.table_render_id + '"',
                    }
                    ]],
                cols: [[
                    {
                        field: 'node', minWidth: 200, align: 'left', title: 'システムノード', templet: function (d) {
                            return d.node
                        }
                    },
                    {field: 'title', minWidth: 80, title: 'ノード名 <i class="table-edit-tips color-red">*</i>', edit: 'text'},
                    {field: 'update_time', minWidth: 80, title: '更新日時', search: 'range'},
                    {field: 'is_auth', title: 'ノード制御', width: 85, search: 'select', selectList: {0: '無効', 1: '有効'}, templet: ea.table.switch},
                ]],
            });

            ea.listen();
        },
        add: function () {
            ea.listen();
        },
        edit: function () {
            ea.listen();
        }
    };
});
