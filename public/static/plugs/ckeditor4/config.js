CKEDITOR.editorConfig = function (config) {
    config.language = 'ja';
    config.image_previewText = ' ';
    config.height = 500;
    config.width = 'auto';
    config.toolbarGroups = [
        {name: 'document', groups: ['mode', 'document', 'doctools']},
        {name: 'styles', groups: ['Font', 'FontSize']},
        {name: 'colors'},
        {name: 'basicstyles', groups: ['basicstyles', 'cleanup']},
        {name: 'paragraph', groups: ['list', 'indent', 'blocks', 'align', 'bidi']},
        {name: 'insert'},
        {name: 'others'},
        {name: 'forms'},
        {name: 'links'},
        {name: 'clipboard', groups: ['clipboard', 'undo']},
        { name: 'insert', groups: [ 'EasyImageUpload' ] },
        {name: 'tools'},
    ];
    config.filebrowserImageUploadUrl = config.filebrowserImageUploadUrl || "/admin/ajax/uploadEditor";

    config.removeButtons = 'Underline,Subscript,Superscript';

    config.format_tags = 'p;h1;h2;h3;pre';

    config.removeDialogTabs = 'image:advanced;link:advanced';

    config.font_names = '游ゴシック/Yu Gothic;メイリオ/Meiryo;MS ゴシック/MS Gothic;MS 明朝/MS Mincho;' + config.font_names;
};
