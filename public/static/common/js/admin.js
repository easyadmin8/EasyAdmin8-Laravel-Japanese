// +----------------------------------------------------------------------
// | 管理画面共通JS
// +----------------------------------------------------------------------

/**
 * @desc    クイック時間範囲選択
 * @returns {[{text: string, value: *[]}, {text: string, value: *[]}, {text: string, value: *[]}, {text: string, value: *[]}, {text: string, value: *[]}, null, null]}
 */
function getRangeShortcuts() {
    return [
        {
            text: "今日",
            value: function () {
                let value = [];
                let date1 = new Date();
                date1.setDate(date1.getDate());
                date1.setHours(0, 0, 0, 0);
                value.push(date1);
                let date2 = new Date();
                date2.setHours(23, 59, 59, 59);
                value.push(new Date(date2));
                return value;
            }()
        },
        {
            text: "昨日",
            value: function () {
                let value = [];
                let date1 = new Date();
                date1.setDate(date1.getDate() - 1);
                date1.setHours(0, 0, 0, 0);
                value.push(date1);
                let date2 = new Date();
                date2.setDate(date2.getDate() - 1);
                date2.setHours(23, 59, 59, 59);
                value.push(new Date(date2));
                return value;
            }()
        },
        {
            text: "一昨日",
            value: function () {
                let value = [];
                let date1 = new Date();
                date1.setDate(date1.getDate() - 2);
                date1.setHours(0, 0, 0, 0);
                value.push(date1);
                let date2 = new Date();
                date2.setDate(date2.getDate() - 1);
                date2.setDate(date2.getDate() - 1);
                date2.setHours(23, 59, 59, 59);
                value.push(new Date(date2));
                return value;
            }()
        },
        {
            text: "7日以内",
            value: function () {
                let value = [];
                let date1 = new Date();
                // date1.setMonth(date1.getMonth() - 1);
                date1.setDate(date1.getDate() - 7);
                date1.setHours(0, 0, 0, 0);
                value.push(date1);
                let date2 = new Date();
                date2.setDate(date2.getDate());
                date2.setHours(23, 59, 59, 59);
                value.push(new Date(date2));
                return value;
            }()
        },
        {
            text: "今月",
            value: function () {
                let value = [];
                let date1 = new Date();
                // date1.setMonth(date1.getMonth() - 1);
                date1.setDate(1);
                date1.setHours(0, 0, 0, 0);
                value.push(date1);
                let date2 = new Date();
                date2.setDate(date2.getDate());
                date2.setHours(23, 59, 59, 59);
                value.push(new Date(date2));
                return value;
            }()
        },
        {
            text: "先月",
            value: function () {
                let value = [];
                let date1 = new Date();
                date1.setMonth(date1.getMonth() - 1);
                date1.setDate(1);
                date1.setHours(0, 0, 0, 0);
                value.push(date1);
                let date2 = new Date();
                date2.setDate(1);
                date2.setDate(date2.getDate() - 1);
                date2.setHours(23, 59, 59, 59);
                value.push(new Date(date2));
                return value;
            }()
        },
        {
            text: "今年",
            value: function () {
                let value = [];
                let date1 = new Date();
                date1.setMonth(0);
                date1.setDate(1);
                date1.setHours(0, 0, 0, 0);
                value.push(date1);
                let date2 = new Date();
                date2.setDate(date2.getDate());
                date2.setHours(23, 59, 59, 59);
                value.push(new Date(date2));
                return value;
            }()
        },
    ];
}

/**
 * @desc    JSONフォーマット
 * @param   str
 * @returns {string}
 */
function prettyFormat(str) {
    let result = ''
    try {
        // インデントを2スペースに設定
        str = JSON.stringify(JSON.parse(str), null, 2);
        str = str
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
        result += str.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
            let cls = 'number';
            if (/^"/.test(match)) {
                if (/:$/.test(match)) {
                    cls = 'key';
                } else {
                    cls = 'string';
                }
            } else if (/true|false/.test(match)) {
                cls = 'boolean';
            } else if (/null/.test(match)) {
                cls = 'null';
            }
            return '<span class="' + cls + '">' + match + '</span>';
        });
    } catch (e) {
        return ''
    }
    return "<pre>" + result + "</pre>"
}
