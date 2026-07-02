define(["jquery", "easy-admin", "echarts", "echarts-theme", "miniAdmin", "miniTheme", "miniTab", "swiper"], function ($, ea, echarts, undefined, miniAdmin, miniTheme, miniTab) {

    return {
        index: function () {
            var options = {
                iniUrl: ea.url('ajax/initAdmin'),    // 初期化API
                clearUrl: ea.url("ajax/clearCache"), // キャッシュクリアAPI
                urlHashLocation: true,      // hash位置特定を有効にするか
                bgColorDefault: false,      // テーマデフォルト設定
                multiModule: true,          // マルチモジュールを有効にするか
                menuChildOpen: false,       // メニューをデフォルトで展開するか
                loadingTime: 0,             // 初期化ロード時間
                pageAnim: true,             // iframeウィンドウアニメーション
                maxTabNum: 20,              // 最大タブ開閉数
            };
            miniAdmin.render(options);

            $('.login-out').on("click", function () {
                ea.request.get({
                    url: 'login/out',
                    prefix: true,
                }, function (res) {
                    ea.msg.success(res.msg, function () {
                        window.location = ea.url('login/index');
                    })
                });
            });
        },
        welcome: function () {
            miniTab.listen();

            new Swiper('.mySwiper', {
                pagination: {
                    el: '.swiper-pagination',
                    clickable: true,
                },
            })

            /**
             * 告知情報を見る
             **/
            $('body').on('click', '.layuimini-notice', function () {
                var title = $(this).children('.layuimini-notice-title').text(),
                    noticeTime = $(this).children('.layuimini-notice-extra').text(),
                    content = $(this).children('.layuimini-notice-content').html();
                var html = '<div style="padding:15px 20px; text-align:justify; line-height: 22px;border-bottom:1px solid #e2e2e2;background-color: #2f4056;color: #ffffff">\n' +
                    '<div style="text-align: center;margin-bottom: 20px;font-weight: bold;border-bottom:1px solid #718fb5;padding-bottom: 5px"><h4 class="text-danger">' + title + '</h4></div>\n' +
                    '<div style="font-size: 12px">' + content + '</div>\n' +
                    '</div>\n';
                layer.open({
                    type: 1,
                    title: 'システム告知' + '<span style="float: right;right: 1px;font-size: 12px;color: #b1b3b9;margin-top: 1px">' + noticeTime + '</span>',
                    area: '300px;',
                    shade: 0.8,
                    id: 'layuimini-notice',
                    btn: ['表示', 'キャンセル'],
                    btnAlign: 'c',
                    moveType: 1,
                    content: html,
                    success: function (layero) {
                        var btn = layero.find('.layui-layer-btn');
                        btn.find('.layui-layer-btn0').attr({
                            href: 'https://gitee.com/zhongshaofa/layuimini',
                            target: '_blank'
                        });
                    }
                });
            });

            /**
             * レポート機能
             */
            $(function () {
                $('#layui-version').text('v' + layui.v);
                let echartsRecords = echarts.init(document.getElementById('echarts-records'), 'walden');
                let optionRecords = {
                    title: {
                        text: ''
                    },
                    tooltip: {
                        trigger: 'axis'
                    },
                    legend: {
                        data: ['メールマーケティング', 'アフィリエイト広告', '動画広告', '直接アクセス', '検索エンジン']
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    },
                    toolbox: {
                        feature: {
                            saveAsImage: {}
                        }
                    },
                    xAxis: {
                        type: 'category',
                        boundaryGap: false,
                        data: ['月曜日', '火曜日', '水曜日', '木曜日', '金曜日', '土曜日', '日曜日']
                    },
                    yAxis: {
                        type: 'value'
                    },
                    series: [
                        {
                            name: 'メールマーケティング',
                            type: 'line',
                            stack: '总量',
                            data: [120, 132, 101, 134, 90, 230, 210]
                        },
                        {
                            name: 'アフィリエイト広告',
                            type: 'line',
                            stack: '总量',
                            data: [220, 182, 191, 234, 290, 330, 310]
                        },
                        {
                            name: '動画広告',
                            type: 'line',
                            stack: '总量',
                            data: [150, 232, 201, 154, 190, 330, 410]
                        },
                        {
                            name: '直接アクセス',
                            type: 'line',
                            stack: '总量',
                            data: [320, 332, 301, 334, 390, 330, 320]
                        },
                        {
                            name: '検索エンジン',
                            type: 'line',
                            stack: '总量',
                            data: [820, 932, 901, 934, 1290, 1330, 1320]
                        }
                    ]
                };
                setTimeout(function () {
                    echartsRecords.setOption(optionRecords);
                    window.addEventListener("resize", function () {
                        echartsRecords.resize();
                    });
                }, 100)
            })

            let util = layui.util;
            util.on({
                showComposerInfo: function () {
                    // <div style="padding: 25px;">12313</div>
                    let html = ``
                    ea.request.get({
                        url: ea.url('ajax/composerInfo'),
                    }, function (success) {
                        let data = success.data
                        data.forEach(function (item) {
                            html += `${item.name}  ${item.version}\r\n`
                        })
                        html = `<pre class="layui-code code-demo">${html}</pre>`
                        layer.open({
                            type: 1,
                            title: 'composer情報',
                            area: ea.checkMobile() ? ['95%', '90%'] : ['50%', '90%'],
                            shade: 0.8,
                            shadeClose: true,
                            scrollbar: false,
                            content: html,
                            success: function () {
                                layui.code({elem: '.code-demo', theme: 'dark', lang: 'php'});
                            }
                        })
                    }, function (error) {
                        console.error(error)
                        return false;
                    })

                }
            })
        },
        editAdmin: function () {
            let form = layui.form
            form.on('radio(loginType-filter)', function (data) {
                let elem = data.elem
                let value = elem.value
                if (value === '2') {
                    let width = screen.width < 768 ? '85%' : '60%'
                    ea.open('Google認証コードをバインド', ea.url('index/set2fa'), width, '75%')
                }
            });
            ea.listen();
        },
        editPassword: function () {
            ea.listen();
        },
        set2fa: function () {
            ea.listen();
        },
    };
});
