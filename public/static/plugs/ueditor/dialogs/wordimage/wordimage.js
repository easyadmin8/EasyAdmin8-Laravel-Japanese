/**
 * Created by JetBrains PhpStorm.
 * User: taoqili
 * Date: 12-1-30
 * Time: 下午12:50
 * To change this template use File | Settings | File Templates.
 */
var wordImage = {};
var g = $G, flashObj, flashContainer;

wordImage.init = function (opt, callbacks) {
  showLocalPath("fileUrl");
  createCopyButton("copyButton", "fileUrl");
  addUploadButtonListener();
  addOkListener();
};

function addUploadButtonListener() {
  g('saveFile').addEventListener('change', function () {
    $('.image-tip').html('変換中です。しばらくお待ちください...');
    uploader.addFile(this.files);
    uploader.upload();
  });
}


function addOkListener() {
  dialog.onok = function () {
    //console.log('imageUrls',imageUrls);
    if (!imageUrls.length) return;
    var urlPrefix = editor.getOpt('imageUrlPrefix'),
      images = domUtils.getElementsByTagName(editor.document, "img");
    editor.fireEvent('saveScene');
    // console.log('images',images,imageUrls);
    for (var i = 0, img; img = images[i++];) {
      var src = img.getAttribute("data-word-image");
      if (!src) continue;
      for (var j = 0, url; url = imageUrls[j++];) {
        // console.log('url',src, url);
        if (src.indexOf(url.name.replace(" ", "")) != -1) {
          img.src = urlPrefix + url.url;
          img.setAttribute("_src", urlPrefix + url.url);  //"_src"属性も同時に変更
          img.setAttribute("title", url.title);
          domUtils.removeAttributes(img, ["data-word-image", "style", "width", "height"]);
          editor.fireEvent("selectionchange");
          break;
        }
      }
    }
    editor.fireEvent('saveScene');
    // hideFlash();
  };
  dialog.oncancel = function () {
    //hideFlash();
  };
}

function showLocalPath(id) {
  //単一画像編集
  var img = editor.selection.getRange().getClosedNode();
  var images = editor.execCommand('wordimage');
  if (images.length == 1 || img && img.tagName == 'IMG') {
    g(id).value = images[0];
    return;
  }
  var path = images[0];
  var leftSlashIndex = path.lastIndexOf("/") || 0,  //docやブラウザのバージョンによって記号が異なるため、両方を判定
    rightSlashIndex = path.lastIndexOf("\\") || 0,
    separater = leftSlashIndex > rightSlashIndex ? "/" : "\\";

  path = path.substring(0, path.lastIndexOf(separater) + 1);
  g(id).value = path;
  //選択するファイルをユーザーに促す
  var names = [];
  for (var i = 0, len = images.length; i < len; i++) {
    var img = images[i];
    names.push(img.substring(img.lastIndexOf(separater) + 1, img.length));
  }
  $('.image-tip').html('<span style="color:#ff0000;">選択してください:' + names.join("、") + " 全" + images.length + 'ファイル</span>');
}

function createCopyButton(id, dataFrom) {
  var url = g(dataFrom).value;
  if (url.startsWith("file:////")) {
    url = url.substring(8);
  }
  url = decodeURI( url );
  g(id).setAttribute("data-clipboard-text", url);
  var clipboard = new Clipboard('[data-clipboard-text]')
  clipboard.on('success', function (e) {
    g('copyButton').innerHTML = 'コピー完了';
  });
}
