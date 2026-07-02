define(["jquery", "easy-admin"], function ($, ea) {

    var init = {
        table_elem: '#currentTable',
        table_render_id: 'currentTableRenderId',
        index_url: 'system/admin/index',
        add_url: 'system/admin/add',
        edit_url: 'system/admin/edit',
        delete_url: 'system/admin/delete',
        modify_url: 'system/admin/modify',
        export_url: 'system/admin/export',
        password_url: 'system/admin/password',
    };

    return {

        index: function () {

            let _table = ea.table.render({
                init: init,
                cols: [[
                    {type: "checkbox"},
                    {field: 'id', width: 80, title: 'ID', searchOp: '='},
                    {field: 'sort', width: 80, title: '並び順', edit: 'text'},
                    {field: 'username', minWidth: 80, title: 'ログインアカウント'},
                    {field: 'head_img', minWidth: 80, title: 'アバター', search: false, templet: ea.table.image},
                    {field: 'phone', minWidth: 80, title: '携帯電話'},
                    {field: 'login_num', minWidth: 80, title: 'ログイン回数'},
                    {
                        field: 'role', minWidth: 80, title: 'ロール権限', align: 'left', search: 'none', templet: function (d) {
                            let auth_ids = d.auth_ids || []
                            let html = ``
                            $.each(auth_ids, (idx, item) =>
                                html += `<span class="layui-badge">${auth_list[item] || '-'}</span> `
                            )
                            return html
                        }
                    },
                    {field: 'remark', minWidth: 80, title: '備考'},
                    {field: 'status', title: 'ステータス', width: 85, search: 'select', selectList: {0: '無効', 1: '有効'}, templet: ea.table.switch},
                    {field: 'create_time', minWidth: 80, title: '作成日時', search: 'range'},
                    {
                        width: 250,
                        title: '操作',
                        templet: ea.table.tool,
                        operat: [
                            'edit',
                            [{
                                text: 'パスワード設定',
                                url: init.password_url,
                                method: 'open',
                                auth: 'password',
                                class: 'layui-btn layui-btn-normal layui-btn-xs',
                            }],
                            'delete'
                        ]
                    }
                ]],
            });

            $('body').on('click', '[data-table-reset]', function () {
                $('.layui-menu li').removeClass('layui-menu-item-checked').animate(
                    {}, 0, () => $('.layui-menu li:eq(0)').addClass('layui-menu-item-checked')
                )
            })
            layui.util.on({
                authSearch: function (e) {
                    let auth_id = $(this).data('auth_id')
                    $('.layui-menu li').removeClass('layui-menu-item-checked').animate(
                        {}, 0, () => $(this).parents('li').addClass('layui-menu-item-checked')
                    )
                    let _where = auth_id ? {
                        filter: JSON.stringify({auth_ids: auth_id}),
                        op: JSON.stringify({auth_ids: 'find_in_set'})
                    } : {}
                    _table.reload({where: _where})
                },
            })
            ea.listen();
        },
        add: function () {
            ea.listen();
        },
        edit: function () {
            ea.listen();
        },
        password: function () {
            ea.listen();
        }
    };
});
