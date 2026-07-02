layui.define(['layer', 'carousel'], function (exports) {
    var $ = layui.jquery;
    var layer = layui.layer;
    var carousel = layui.carousel;

    // ステップバーDOMノード追加
    var renderDom = function (elem, stepItems, postion) {
        var stepDiv = '<div class="lay-step">';
        for (var i = 0; i < stepItems.length; i++) {
            stepDiv += '<div class="step-item">';
            // 線
            if (i < (stepItems.length - 1)) {
                if (i < postion) {
                    stepDiv += '<div class="step-item-tail"><i class="step-item-tail-done"></i></div>';
                } else {
                    stepDiv += '<div class="step-item-tail"><i class=""></i></div>';
                }
            }

            // 数字
            var number = stepItems[i].number;
            if (!number) {
                number = i + 1;
            }
            if (i == postion) {
                stepDiv += '<div class="step-item-head step-item-head-active"><i class="layui-icon">' + number + '</i></div>';
            } else if (i < postion) {
                stepDiv += '<div class="step-item-head"><i class="layui-icon layui-icon-ok"></i></div>';
            } else {
                stepDiv += '<div class="step-item-head "><i class="layui-icon">' + number + '</i></div>';
            }

            // タイトルと説明
            var title = stepItems[i].title;
            var desc = stepItems[i].desc;
            if (title || desc) {
                stepDiv += '<div class="step-item-main">';
                if (title) {
                    stepDiv += '<div class="step-item-main-title">' + title + '</div>';
                }
                if (desc) {
                    stepDiv += '<div class="step-item-main-desc">' + desc + '</div>';
                }
                stepDiv += '</div>';
            }
            stepDiv += '</div>';
        }
        stepDiv += '</div>';

        $(elem).prepend(stepDiv);

        // 各アイテムの幅を計算
        var bfb = 100 / stepItems.length;
        $('.step-item').css('width', bfb + '%');
    };

    var step = {
        // ステップバーのレンダリング
        render: function (param) {
            param.indicator = 'none';  // インジケーター非表示
            param.arrow = 'always';  // 常に矢印を表示
            param.autoplay = false;  // 自動再生を無効化
            if (!param.stepWidth) {
                param.stepWidth = '400px';
            }

            // カルーセルのレンダリング
            carousel.render(param);

            // ステップバーのレンダリング
            var stepItems = param.stepItems;
            renderDom(param.elem, stepItems, 0);
            $('.lay-step').css('width', param.stepWidth);

            // カルーセル切り替えイベントを監視
            carousel.on('change(' + param.filter + ')', function (obj) {
                $(param.elem).find('.lay-step').remove();
                renderDom(param.elem, stepItems, obj.index);
                $('.lay-step').css('width', param.stepWidth);
            });

            // 左右矢印ボタンを非表示
            $(param.elem).find('.layui-carousel-arrow').css('display', 'none');

            // カルーセルの背景色を除去
            $(param.elem).css('background-color', 'transparent');
        },
        // 次のステップ
        next: function (elem) {
            $(elem).find('.layui-carousel-arrow[lay-type=add]').trigger('click');
        },
        // 前のステップ
        pre: function (elem) {
            $(elem).find('.layui-carousel-arrow[lay-type=sub]').trigger('click');
        }
    };

    layui.link(layui.cache.base + 'step-lay/step.css');

    exports('step', step);
});
