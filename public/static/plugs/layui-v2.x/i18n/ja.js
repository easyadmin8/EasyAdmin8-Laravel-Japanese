/**
 * Japanese (ja)
 */

export default {
    code: {
        copy: 'コードをコピー',
        copied: 'コピー完了',
        copyError: 'コピーに失敗しました',
        maximize: '最大化表示',
        restore: '元に戻す',
        preview: '新しいウィンドウでプレビュー'
    },
    colorpicker: {
        clear: 'クリア',
        confirm: '確定'
    },
    dropdown: {
        noData: 'データなし'
    },
    flow: {
        loadMore: 'もっと読み込む',
        noMore: 'これ以上ありません'
    },
    form: {
        input: {
            placeholder: '入力してください'
        },
        select: {
            noData: 'データなし',
            noMatch: '一致するデータがありません',
            placeholder: '選択してください'
        },
        validateMessages: {
            required: '必須項目です。空にできません',
            phone: '電話番号の形式が正しくありません',
            email: 'メールアドレスの形式が正しくありません',
            url: 'URL の形式が正しくありません',
            number: '数字のみ入力可能です',
            date: '日付の形式が正しくありません',
            identity: '身分証番号の形式が正しくありません'
        },
        verifyErrorPromptTitle: 'メッセージ'
    },
    laydate: {
        months: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
        weeks: ['日', '月', '火', '水', '木', '金', '土'],
        time: ['時', '分', '秒'],
        literal: {
            year: '年',
            month: '月',
            day: '日',
            hour: '時',
            minute: '分',
            second: '秒'
        },
        selectDate: '日付を選択',
        selectTime: '時間を選択',
        startTime: '開始時間',
        endTime: '終了時間',
        tools: {
            confirm: '確定',
            clear: 'クリア',
            now: '現在',
            reset: 'リセット'
        },
        rangeOrderPrompt: '終了時間は開始時間より前に設定できません\n再選択してください',
        invalidDatePrompt: '有効な日付・時間範囲外です',
        formatErrorPrompt: '日付形式が不正です\nフォーマットに従って入力してください：\n{format}',
        autoResetPrompt: '自動的にリセットされました',
        preview: '現在選択中の結果',
    },
    layer: {
        confirm: '確定',
        cancel: 'キャンセル',
        defaultTitle: '通知',
        prompt: {
            InputLengthPrompt: '最大{length}文字まで入力可能です'
        },
        photos: {
            noData: '画像がありません',
            tools: {
                rotate: '回転',
                scaleX: '左右反転',
                zoomIn: '拡大',
                zoomOut: '縮小',
                reset: 'リセット',
                close: '閉じる'
            },
            viewPicture: '元画像を表示',
            urlError: {
                prompt: '画像URLが異常です。\n次の画像を表示しますか？',
                confirm: '次へ',
                cancel: 'キャンセル'
            }
        }
    },
    laypage: {
        prev: '前のページ',
        next: '次のページ',
        first: '最初のページ',
        last: '最後のページ',
        total: '全{total}件',
        pagesize: '件/ページ',
        goto: 'ページへ移動：',
        page: 'ページ',
        confirm: '確定',
    },
    table: {
        sort: {
            asc: '昇順',
            desc: '降順'
        },
        noData: 'データなし',
        tools: {
            filter: {
                title: '列の表示切替'
            },
            export: {
                title: 'エクスポート',
                noDataPrompt: 'テーブルにデータが存在しません',
                compatPrompt: 'IEブラウザはエクスポートに対応していません。Chromeなどの最新ブラウザをご利用ください',
                csvText: 'CSVファイルを出力'
            },
            print: {
                title: '印刷',
                noDataPrompt: 'テーブルにデータが存在しません'
            }
        },
        dataFormatError: 'レスポンスデータの形式が不正です。正常時ステータスキーは「{statusName}」、値は{statusCode}となる必要があります',
        xhrError: 'リクエスト異常：{msg}'
    },
    transfer: {
        noData: 'データなし',
        noMatch: '一致するデータがありません',
        title: ['リスト1', 'リスト2'],
        searchPlaceholder: 'キーワードで検索'
    },
    tree: {
        defaultNodeName: '無名ノード',
        noData: 'データなし',
        deleteNodePrompt: '「{name}」ノードを削除してもよろしいですか？'
    },
    upload: {
        fileType: {
            file: 'ファイル',
            image: '画像',
            video: '動画',
            audio: '音声'
        },
        validateMessages: {
            fileExtensionError: '選択した{fileType}は対応していない形式を含んでいます',
            filesOverLengthLimit: '一度にアップロード可能なファイルは最大{length}個です',
            currentFilesLength: '現在{length}個のファイルを選択中です',
            fileOverSizeLimit: 'ファイルサイズは{size}を超過できません'
        },
        chooseText: '{length}個のファイル'
    },
    util: {
        timeAgo: {
            days: '{days}日前',
            hours: '{hours}時間前',
            minutes: '{minutes}分前',
            future: '未来',
            justNow: 'たった今'
        },
        toDateString: {
            meridiem: function (hours, minutes) {
                var hm = hours * 100 + minutes;
                if (hm < 500) {
                    return '未明';
                } else if (hm < 800) {
                    return '早朝';
                } else if (hm < 1200) {
                    return '午前';
                } else if (hm < 1300) {
                    return '昼';
                } else if (hm < 1900) {
                    return '午後';
                }
                return '夜';
            }
        }
    }
};
