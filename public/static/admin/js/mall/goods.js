define(["jquery", "easy-admin"], function ($, ea) {

    var init = {
        table_elem: '#currentTable',
        table_render_id: 'currentTableRenderId',
        index_url: 'mall/goods/index',
        add_url: 'mall/goods/add',
        edit_url: 'mall/goods/edit',
        delete_url: 'mall/goods/delete',
        export_url: 'mall/goods/export',
        modify_url: 'mall/goods/modify',
        stock_url: 'mall/goods/stock',
        recycle_url: 'mall/goods/recycle',
    };

    return {

        index: function () {
            ea.table.render({
                init: init,
                toolbar: ['refresh',
                    [{
                        text: '追加',
                        url: init.add_url,
                        method: 'open',
                        auth: 'add',
                        class: 'layui-btn layui-btn-normal layui-btn-sm',
                        icon: 'fa fa-plus ',
                        extend: 'data-width="90%" data-height="95%"',
                    }],
                    'delete', 'export', 'recycle'],
                cols: [[
                    {type: "checkbox"},
                    {field: 'id', width: 80, title: 'ID', searchOp: '='},
                    {field: 'sort', width: 80, title: '並び順', edit: 'text'},
                    {field: 'cate_id', width: 100, title: '商品カテゴリ', search: 'select', selectList: cateSelects, laySearch: true},
                    {field: 'title', width: 100, title: '商品名'},
                    {field: 'logo', width: 100, title: 'カテゴリ画像', search: false, templet: ea.table.image},
                    {field: 'market_price', width: 100, title: '市場価格', templet: ea.table.price},
                    {field: 'discount_price', width: 100, title: '割引価格', templet: ea.table.price},
                    {field: 'total_stock', width: 100, title: '在庫集計'},
                    {field: 'stock', width: 100, title: '残り在庫'},
                    {field: 'virtual_sales', width: 100, title: '仮想販売数'},
                    {field: 'sales', width: 80, title: '販売数'},
                    {field: 'status', title: 'ステータス', width: 85, selectList: {0: '無効', 1: '有効'}, templet: ea.table.switch},
                    // 複数選択のデモ。実際のデータベースには status2 フィールドがないため、検索後にエラーになります
                    {
                        field: 'status2', title: '複数選択デモ', width: 105, search: 'xmSelect', selectList: {1: 'サンプル選択肢1', 2: 'サンプル選択肢2', 3: 'サンプル選択肢3', 4: 'サンプル選択肢4', 5: 'サンプル選択肢5'}, hide: true,
                        searchOp: 'in', templet: function (res) {
                            // 実際のプロジェクトに合わせて出力してください
                            return res?.status2 || 'サンプルデータ'
                        }
                    },
                    {field: 'province', minWidth: 80, title: '都道府県', toolbar: '#provinceDemo', search: 'select', hide: true},
                    {field: 'city', minWidth: 80, title: '市区町村', toolbar: '#cityDemo', search: 'select', hide: true},
                    {field: 'area', minWidth: 80, title: '地域', toolbar: '#areaDemo', search: 'select', hide: true},
                    {field: 'create_time', minWidth: 80, title: '作成日時', search: 'range'},
                    {
                        minWidth: 250,
                        title: '操作',
                        templet: ea.table.tool,
                        operat: [
                            [{
                                templet: function (d) {
                                    return `<button type="button" class="layui-btn layui-btn-xs">カスタム ${d.id}</button>`
                                }
                            }, {
                                text: '編集',
                                url: init.edit_url,
                                method: 'open',
                                auth: 'edit',
                                class: 'layui-btn layui-btn-xs layui-btn-success',
                                extend: 'data-width="90%" data-height="95%"',
                            }, {
                                text: '入库',
                                url: init.stock_url,
                                method: 'open',
                                auth: 'stock',
                                class: 'layui-btn layui-btn-xs layui-btn-normal',
                                visible: function (row) {
                                    return row.status === 1;
                                },
                            }],
                            'delete']
                    }
                ]],
                done: (res) => {
                    // ステータスが1の商品背景をハイライト表示する例。実際のプロジェクトに合わせてカスタマイズできます
                    $.each(res.data, function (idx, item) {
                        if (item.status === 1) {
                            $(`tr[data-index="${idx}"]`).css({
                                'background': 'linear-gradient(to left, #77eb7c, #bbffbe, #ffffff, transparent)',
                                'border': 'none',
                            })
                        }
                    })
                }
            });

            let form = layui.form
            let provinceHtml = ``, cityHtml = ``, areaHtml = ``
            let provinceCityData = [], cityAreaData = []
            // 初回表示時に都道府県・市区町村・地域をデフォルト描画
            areaData.forEach(item => {
                provinceHtml += `<option value="${item.value}">${item.label}</option>`
                provinceCityData[item.value] = item.children
            })
            $('#c-province').html(provinceHtml)
            $('#c-city').html(cityHtml)
            $('#c-area').html(areaHtml)
            form.render('select');

            // 都道府県選択を監視
            form.on('select(province)', function (data) {
                let value = data.value
                let cityHtml = ``
                let areaHtml = ``
                if (!value) {
                    cityHtml = areaHtml = ``
                } else {
                    provinceCityData[value].forEach(item => {
                        cityHtml += `<option value="${item.value}">${item.label}</option>`
                        cityAreaData[item.value] = item.children
                        item.children.forEach(item2 => {
                            areaHtml += `<option value="${item2.value}">${item2.label}</option>`
                        })
                    })
                }
                $('#c-city').html(cityHtml)
                $('#c-area').html(areaHtml)
                form.render('select')
            })

            // 市区町村選択を監視
            form.on('select(city)', function (data) {
                let value = data.value
                let areaHtml = ``
                if (value) {
                    cityAreaData[value].forEach(item => {
                        areaHtml += `<option value="${item.value}">${item.label}</option>`
                    })
                }
                $('#c-area').html(areaHtml)
                form.render('select')
            })

            ea.listen();
        },
        add: function () {
            layui.util.on({
                AiOptimization: function (data) {
                    let layOn = $(data).attr('lay-on')
                    $(data).attr('lay-on', layOn + 'Loading')
                    aiOptimization(data)
                },
            })

            var demo1 = xmSelect.render({
                el: '#demo1',
                name: 'xxx', // form表单提交的name
                theme: {color: getComputedStyle(document.documentElement).getPropertyValue('--ea8-theme-main-color') || '#16b777'},
                data: [
                    {name: 'Make', value: 1},
                    {name: 'PHP', value: 2},
                    {name: 'Great Again', value: 3},
                ]
            })

            ea.listen();
        },
        edit: function () {
            layui.util.on({
                AiOptimization: function (data) {
                    let layOn = $(data).attr('lay-on')
                    $(data).attr('lay-on', layOn + 'Loading')
                    aiOptimization(data)
                },
            })

            var demo1 = xmSelect.render({
                el: '#demo1',
                name: 'xxx', // form表单提交的name
                theme: {color: getComputedStyle(document.documentElement).getPropertyValue('--ea8-theme-main-color') || '#16b777'},
                data: [
                    {name: 'Make', value: 1},
                    {name: 'PHP', value: 2, selected: true,},
                    {name: 'Great Again', value: 3, selected: true,},
                ]
            })

            ea.listen();
        },
        stock: function () {
            ea.listen();
        },
        recycle: function () {
            init.index_url = init.recycle_url;
            ea.table.render({
                init: init,
                toolbar: ['refresh',
                    [{
                        class: 'layui-btn layui-btn-sm',
                        method: 'get',
                        field: 'id',
                        icon: 'fa fa-refresh',
                        text: 'すべて復元',
                        title: '復元してもよろしいですか？',
                        auth: 'recycle',
                        url: init.recycle_url + '?type=restore',
                        checkbox: true
                    }, {
                        class: 'layui-btn layui-btn-danger layui-btn-sm',
                        method: 'get',
                        field: 'id',
                        icon: 'fa fa-delete',
                        text: '完全削除',
                        title: '确定完全削除？',
                        auth: 'recycle',
                        url: init.recycle_url + '?type=delete',
                        checkbox: true
                    }], 'export',
                ],
                cols: [[
                    {type: "checkbox"},
                    {field: 'id', width: 80, title: 'ID', searchOp: '='},
                    {field: 'sort', width: 80, title: '並び順', edit: 'text'},
                    {field: 'cate_id', minWidth: 80, title: '商品カテゴリ', search: 'select', selectList: cateSelects, laySearch: true},
                    {field: 'title', minWidth: 80, title: '商品名'},
                    {field: 'logo', minWidth: 80, title: 'カテゴリ画像', search: false, templet: ea.table.image},
                    {field: 'status', title: 'ステータス', width: 85, selectList: {0: '無効', 1: '有効'}},
                    // 複数選択のデモ。実際のデータベースには status2 フィールドがないため、検索後にエラーになります
                    {
                        field: 'status2', title: '複数選択デモ', width: 105, search: 'xmSelect', selectList: {1: 'サンプル選択肢1', 2: 'サンプル選択肢2', 3: 'サンプル選択肢3', 4: 'サンプル選択肢4', 5: 'サンプル選択肢5'}, hide: true,
                        searchOp: 'in', templet: function (res) {
                            // 実際のプロジェクトに合わせて出力してください
                            return res?.status2 || 'サンプルデータ'
                        }
                    },
                    {field: 'create_time', minWidth: 80, title: '作成日時', search: 'range'},
                    {field: 'delete_time', minWidth: 80, title: '削除日時', search: 'range'},
                    {
                        width: 250,
                        title: '操作',
                        templet: ea.table.tool,
                        operat: [
                            [{
                                title: '復元してもよろしいですか？',
                                text: 'データを復元',
                                filed: 'id',
                                url: init.recycle_url + '?type=restore',
                                method: 'get',
                                auth: 'recycle',
                                class: 'layui-btn layui-btn-xs layui-btn-success',
                            }, {
                                title: '本当に実行しますか？',
                                text: '完全削除',
                                filed: 'id',
                                method: 'get',
                                url: init.recycle_url + '?type=delete',
                                auth: 'recycle',
                                class: 'layui-btn layui-btn-xs layui-btn-normal layui-bg-red',
                            }]]
                    }
                ]],
            });
            ea.listen();
        },
    };

    function aiOptimization(data) {
        let layOn = $(data).attr('lay-on')
        let title = $('input[name="title"]').val()

        // AI に実行してほしい内容を伝える
        let message = `このタイトルを最適化してください ${title}`
        if (title.trim() === '') {
            ea.msg.error('タイトルは空にできません', function () {
                $(data).attr('lay-on', layOn.split('Loading')[0])
            })
            return false
        }
        let url = ea.url('mall/goods/aiOptimization')
        ea.request.post({url: url, data: {message: message}}, function (res) {
            let content = res.data?.choices[0]?.message?.content
            // stream が true の場合、AI コンテンツは一文字ずつ出力されます
            let stream = true
            ea.ai.chat(content, {stream: stream}, function () {
                $(data).attr('lay-on', layOn.split('Loading')[0])
            })
        }, function (error) {
            ea.msg.error(error.msg, function () {
                $(data).attr('lay-on', layOn.split('Loading')[0])
            })
        })
    }
});
