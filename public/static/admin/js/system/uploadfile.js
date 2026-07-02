define(["jquery", "easy-admin"], function ($, ea) {

    var init = {
        table_elem: '#currentTable',
        table_render_id: 'currentTableRenderId',
        index_url: 'system/uploadfile/index',
        add_url: 'system/uploadfile/add',
        edit_url: 'system/uploadfile/edit',
        delete_url: 'system/uploadfile/delete',
        modify_url: 'system/uploadfile/modify',
        export_url: 'system/uploadfile/export',
    };

    return {

        index: function () {
            ea.table.render({
                init: init,
                cols: [[
                    {type: "checkbox"},
                    {field: 'id', width: 80, title: 'ID', searchOp: '='},
                    {field: 'upload_type', minWidth: 80, title: '保存場所', search: 'select', selectList: upload_types},
                    {field: 'url', minWidth: 80, search: false, title: '画像情報', templet: ea.table.image},
                    {field: 'url', minWidth: 120, title: '保存先', templet: ea.table.url},
                    {field: 'original_name', minWidth: 80, title: '元ファイル名'},
                    {field: 'mime_type', minWidth: 80, title: 'MIMEタイプ'},
                    {field: 'file_ext', minWidth: 80, title: 'ファイル拡張子'},
                    {field: 'create_time', minWidth: 80, title: '作成日時', search: 'range'},
                    {width: 250, title: '操作', templet: ea.table.tool, operat: ['delete']}
                ]],
            });

            ea.listen();
        },
        add: function () {
            ea.listen();
        },
        edit: function () {
            ea.listen();
        },
    };
});
