/*
Navicat MySQL Data Transfer

Source Server         : localhost
Source Server Version : 50727
Source Host           : localhost:3306
Source Database       : easyadmin

Target Server Type    : MYSQL
Target Server Version : 50727
File Encoding         : 65001

Date: 2020-05-17 23:24:06
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for ea_mall_cate
-- ----------------------------
DROP TABLE IF EXISTS `ea_mall_cate`;
CREATE TABLE `ea_mall_cate`
(
    `id`          bigint(20) unsigned NOT NULL AUTO_INCREMENT,
    `title`       varchar(20) NOT NULL COMMENT 'カテゴリ名',
    `image`       varchar(500) DEFAULT NULL COMMENT 'カテゴリ画像',
    `sort`        int(11) DEFAULT '0' COMMENT '並び順',
    `status`      tinyint(1) unsigned DEFAULT '1' COMMENT 'ステータス(1:無効,2:有効)',
    `remark`      varchar(255) DEFAULT NULL COMMENT '備考',
    `create_time` int(11) DEFAULT NULL COMMENT '作成日時',
    `update_time` int(11) DEFAULT NULL COMMENT '更新日時',
    `delete_time` int(11) DEFAULT NULL COMMENT '削除日時',
    PRIMARY KEY (`id`),
    UNIQUE KEY `title` (`title`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci ROW_FORMAT=COMPACT COMMENT='商品カテゴリ';

-- ----------------------------
-- Records of ea_mall_cate
-- ----------------------------
INSERT INTO `ea_mall_cate`
VALUES ('1', '電化製品', '/static/common/images/logo-1.png', '0', '1', '', '1589440437', '1589440437', null);
INSERT INTO `ea_mall_cate`
VALUES ('2', '3C', '/static/common/images/logo-1.png', '0', '1', '', '1589440437', '1589440437', null);

-- ----------------------------
-- Table structure for ea_mall_goods
-- ----------------------------
DROP TABLE IF EXISTS `ea_mall_goods`;
CREATE TABLE `ea_mall_goods`
(
    `id`             bigint(20) unsigned NOT NULL AUTO_INCREMENT,
    `cate_id`        int(11) DEFAULT NULL COMMENT 'カテゴリID',
    `title`          varchar(20) NOT NULL COMMENT '商品名',
    `logo`           varchar(500)   DEFAULT NULL COMMENT '商品ロゴ',
    `images`         text COMMENT '商品画像 | で区切る',
    `describe`       text COMMENT '商品説明',
    `market_price`   decimal(10, 2) DEFAULT '0.00' COMMENT '市場価格',
    `discount_price` decimal(10, 2) DEFAULT '0.00' COMMENT '割引価格',
    `sales`          int(11) DEFAULT '0' COMMENT '販売数',
    `virtual_sales`  int(11) DEFAULT '0' COMMENT '仮想販売数',
    `stock`          int(11) DEFAULT '0' COMMENT '在庫',
    `total_stock`    int(11) DEFAULT '0' COMMENT '総在庫',
    `sort`           int(11) DEFAULT '0' COMMENT '並び順',
    `status`         tinyint(1) unsigned DEFAULT '1' COMMENT 'ステータス(1:無効,2:有効)',
    `remark`         varchar(255)   DEFAULT NULL COMMENT '備考',
    `create_time`    int(11) DEFAULT NULL COMMENT '作成日時',
    `update_time`    int(11) DEFAULT NULL COMMENT '更新日時',
    `delete_time`    int(11) DEFAULT NULL COMMENT '削除日時',
    PRIMARY KEY (`id`),
    KEY              `cate_id` (`cate_id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci ROW_FORMAT=COMPACT COMMENT='商品一覧';

-- ----------------------------
-- Records of ea_mall_goods
-- ----------------------------
INSERT INTO `ea_mall_goods`
VALUES ('1', '1', '据え置き扇風機', '/static/common/images/logo-1.png', '/static/common/images/logo-1.png|/static/common/images/logo-1.png|/static/common/images/logo-1.png|/static/common/images/logo-1.png',
        '<p>76654757</p>\n\n<p><img alt=\"\" src=\"/static/common/images/logo-1.png\" style=\"height:689px; width:790px\" /></p>\n\n<p><img alt=\"\" src=\"/static/common/images/logo-1.png\" style=\"height:877px; width:790px\" /></p>\n', '599.00', '368.00', '0', '594', '0', '0', '675', '1', '', '1589454309', '1589567016', null);
INSERT INTO `ea_mall_goods`
VALUES ('2', '2', 'パソコン', '/static/common/images/logo-1.png', '/static/common/images/logo-1.png', '<p>477</p>\n', '0.00', '0.00', '0', '0', '115', '320', '0', '1', '', '1589465215', '1589476345', null);

-- ----------------------------
-- Table structure for ea_system_admin
-- ----------------------------
DROP TABLE IF EXISTS `ea_system_admin`;
CREATE TABLE `ea_system_admin`
(
    `id`          bigint(20) unsigned NOT NULL AUTO_INCREMENT,
    `auth_ids`    varchar(255)         DEFAULT NULL COMMENT 'ロール権限ID',
    `head_img`    varchar(255)         DEFAULT NULL COMMENT 'アバター',
    `username`    varchar(50) NOT NULL DEFAULT '' COMMENT 'ユーザーログイン名',
    `password`    varchar(255)    NOT NULL DEFAULT '' COMMENT 'ユーザーログインパスワード',
    `phone`       varchar(16)          DEFAULT NULL COMMENT '連絡先電話番号',
    `remark`      varchar(255)         DEFAULT '' COMMENT '備考',
    `login_num`   bigint(20) unsigned DEFAULT '0' COMMENT 'ログイン回数',
    `sort`        int(11) DEFAULT '0' COMMENT '並び順',
    `status`      tinyint(1) unsigned NOT NULL DEFAULT '1' COMMENT 'ステータス(0:無効,1:有効)',
    `create_time` int(11) DEFAULT NULL COMMENT '作成日時',
    `update_time` int(11) DEFAULT NULL COMMENT '更新日時',
    `delete_time` int(11) DEFAULT NULL COMMENT '削除日時',
    `login_type` tinyint unsigned NOT NULL DEFAULT '1' COMMENT 'ログイン方式',
    `ga_secret` varchar(32) NOT NULL DEFAULT '' COMMENT 'Google認証コード秘密鍵',
    PRIMARY KEY (`id`),
    UNIQUE KEY `username` (`username`) USING BTREE,
    KEY           `phone` (`phone`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci ROW_FORMAT=COMPACT COMMENT='システムユーザーテーブル';

-- ----------------------------
-- Records of ea_system_admin
-- ----------------------------
INSERT INTO `ea_system_admin`
VALUES ('1', null, '/static/admin/images/head.jpg', 'admin', 'a33b679d5581a8692988ec9f92ad2d6a2259eaa7', 'admin', 'admin', '0', '0', '1', '1589454169', '1589476815', null,1,'');

-- ----------------------------
-- Table structure for ea_system_auth
-- ----------------------------
DROP TABLE IF EXISTS `ea_system_auth`;
CREATE TABLE `ea_system_auth`
(
    `id`          bigint(20) unsigned NOT NULL AUTO_INCREMENT,
    `title`       varchar(20) NOT NULL COMMENT '権限名',
    `sort`        int(11) DEFAULT '0' COMMENT '並び順',
    `status`      tinyint(1) unsigned DEFAULT '1' COMMENT 'ステータス(1:無効,2:有効)',
    `remark`      varchar(255) DEFAULT NULL COMMENT '備考',
    `create_time` int(11) DEFAULT NULL COMMENT '作成日時',
    `update_time` int(11) DEFAULT NULL COMMENT '更新日時',
    `delete_time` int(11) DEFAULT NULL COMMENT '削除日時',
    PRIMARY KEY (`id`),
    UNIQUE KEY `title` (`title`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci ROW_FORMAT=COMPACT COMMENT='システム権限テーブル';

-- ----------------------------
-- Records of ea_system_auth
-- ----------------------------
INSERT INTO `ea_system_auth`
VALUES ('1', '管理者', '1', '1', 'テスト管理者', '1588921753', '1589614331', null);
INSERT INTO `ea_system_auth`
VALUES ('2', 'ゲスト権限', '0', '1', '', '1588227513', '1589591751', '1589591751');

-- ----------------------------
-- Table structure for ea_system_auth_node
-- ----------------------------
DROP TABLE IF EXISTS `ea_system_auth_node`;
CREATE TABLE `ea_system_auth_node`
(
    `id`      bigint(20) unsigned NOT NULL AUTO_INCREMENT,
    `auth_id` bigint(20) unsigned DEFAULT NULL COMMENT 'ロールID',
    `node_id` bigint(20) DEFAULT NULL COMMENT 'ノードID',
    PRIMARY KEY (`id`),
    KEY       `index_system_auth_auth` (`auth_id`) USING BTREE,
    KEY       `index_system_auth_node` (`node_id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci ROW_FORMAT=COMPACT COMMENT='ロール・ノード関連テーブル';

-- ----------------------------
-- Records of ea_system_auth_node
-- ----------------------------
INSERT INTO `ea_system_auth_node`
VALUES ('1', '6', '1');
INSERT INTO `ea_system_auth_node`
VALUES ('2', '6', '2');
INSERT INTO `ea_system_auth_node`
VALUES ('3', '6', '9');
INSERT INTO `ea_system_auth_node`
VALUES ('4', '6', '12');
INSERT INTO `ea_system_auth_node`
VALUES ('5', '6', '18');
INSERT INTO `ea_system_auth_node`
VALUES ('6', '6', '19');
INSERT INTO `ea_system_auth_node`
VALUES ('7', '6', '21');
INSERT INTO `ea_system_auth_node`
VALUES ('8', '6', '22');
INSERT INTO `ea_system_auth_node`
VALUES ('9', '6', '29');
INSERT INTO `ea_system_auth_node`
VALUES ('10', '6', '30');
INSERT INTO `ea_system_auth_node`
VALUES ('11', '6', '38');
INSERT INTO `ea_system_auth_node`
VALUES ('12', '6', '39');
INSERT INTO `ea_system_auth_node`
VALUES ('13', '6', '45');
INSERT INTO `ea_system_auth_node`
VALUES ('14', '6', '46');
INSERT INTO `ea_system_auth_node`
VALUES ('15', '6', '52');
INSERT INTO `ea_system_auth_node`
VALUES ('16', '6', '53');

-- ----------------------------
-- Table structure for ea_system_config
-- ----------------------------
DROP TABLE IF EXISTS `ea_system_config`;
CREATE TABLE `ea_system_config`
(
    `id`          int(10) unsigned NOT NULL AUTO_INCREMENT,
    `name`        varchar(30) NOT NULL DEFAULT '' COMMENT '変数名',
    `group`       varchar(30) NOT NULL DEFAULT '' COMMENT 'グループ',
    `value`       text COMMENT '変数値',
    `remark`      varchar(100)         DEFAULT '' COMMENT '備考',
    `sort`        int(10) DEFAULT '0',
    `create_time` int(11) DEFAULT NULL COMMENT '作成日時',
    `update_time` int(11) DEFAULT NULL COMMENT '更新日時',
    PRIMARY KEY (`id`),
    UNIQUE KEY `name` (`name`),
    KEY           `group` (`group`)
) ENGINE=InnoDB AUTO_INCREMENT=88 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci ROW_FORMAT=COMPACT COMMENT='システム設定テーブル';

-- ----------------------------
-- Records of ea_system_config
-- ----------------------------
INSERT INTO `ea_system_config`
VALUES ('1', 'alisms_access_key_id', 'sms', 'あなたの', 'Alibaba Cloud SMS 公開鍵', '0', null, null);
INSERT INTO `ea_system_config`
VALUES ('2', 'alisms_access_key_secret', 'sms', 'あなたの', 'Alibaba Cloud SMS 秘密鍵', '0', null, null);
INSERT INTO `ea_system_config`
VALUES ('3', 'upload_type', 'upload', 'local', '現在のアップロード方式（local,oss,cos）', '0', null, null);
INSERT INTO `ea_system_config`
VALUES ('4', 'upload_allow_ext', 'upload', 'doc,gif,ico,icon,jpg,mp3,mp4,p12,pem,png,rar,jpeg', '許可するファイルタイプ', '0', null, null);
INSERT INTO `ea_system_config`
VALUES ('5', 'upload_allow_size', 'upload', '1024000', '許可するアップロードサイズ', '0', null, null);
INSERT INTO `ea_system_config`
VALUES ('6', 'upload_allow_mime', 'upload', 'image/gif,image/jpeg,video/x-msvideo,text/plain,image/png', '許可するファイルMIME', '0', null, null);
INSERT INTO `ea_system_config`
VALUES ('7', 'upload_allow_type', 'upload', 'local,oss,qnoss,cos', '利用可能なアップロード方式', '0', null, null);
INSERT INTO `ea_system_config`
VALUES ('8', 'oss_access_key_id', 'upload', 'あなたの', 'Alibaba Cloud OSS 公開鍵', '0', null, null);
INSERT INTO `ea_system_config`
VALUES ('9', 'oss_access_key_secret', 'upload', 'あなたの', 'Alibaba Cloud OSS 秘密鍵', '0', null, null);
INSERT INTO `ea_system_config`
VALUES ('10', 'oss_endpoint', 'upload', 'あなたの', 'Alibaba Cloud OSS データセンター', '0', null, null);
INSERT INTO `ea_system_config`
VALUES ('11', 'oss_bucket', 'upload', 'あなたの', 'Alibaba Cloud OSS バケット名', '0', null, null);
INSERT INTO `ea_system_config`
VALUES ('12', 'oss_domain', 'upload', 'あなたの', 'Alibaba Cloud OSS アクセスドメイン', '0', null, null);
INSERT INTO `ea_system_config`
VALUES ('13', 'logo_title', 'site', 'EasyAdmin', 'LOGOタイトル', '0', null, null);
INSERT INTO `ea_system_config`
VALUES ('14', 'logo_image', 'site', '/static/common/images/logo-1.png', 'ロゴ画像', '0', null, null);
INSERT INTO `ea_system_config`
VALUES ('15', 'site_name', 'site', 'EasyAdmin管理システム', 'サイト名', '0', null, null);
INSERT INTO `ea_system_config`
VALUES ('16', 'site_ico', 'site', '/favicon.ico', 'ブラウザアイコン', '0', null, null);
INSERT INTO `ea_system_config`
VALUES ('17', 'site_copyright', 'site', 'あなたの', '著作権情報', '0', null, null);
INSERT INTO `ea_system_config`
VALUES ('18', 'site_beian', 'site', 'あなたの', '備案情報', '0', null, null);
INSERT INTO `ea_system_config`
VALUES ('19', 'site_version', 'site', '2.0.0', 'バージョン情報', '0', null, null);
INSERT INTO `ea_system_config`
VALUES ('20', 'sms_type', 'sms', 'alisms', 'SMSタイプ', '0', null, null);
INSERT INTO `ea_system_config`
VALUES ('21', 'miniapp_appid', 'wechat', 'あなたの', 'ミニアプリ公開鍵', '0', null, null);
INSERT INTO `ea_system_config`
VALUES ('22', 'miniapp_appsecret', 'wechat', 'あなたの', 'ミニアプリ秘密鍵', '0', null, null);
INSERT INTO `ea_system_config`
VALUES ('23', 'web_appid', 'wechat', 'あなたの', '公式アカウント公開鍵', '0', null, null);
INSERT INTO `ea_system_config`
VALUES ('24', 'web_appsecret', 'wechat', 'あなたの', '公式アカウント秘密鍵', '0', null, null);
INSERT INTO `ea_system_config`
VALUES ('25', 'cos_secret_id', 'upload', 'あなたの', 'Tencent Cloud COS 秘密鍵', '0', null, null);
INSERT INTO `ea_system_config`
VALUES ('26', 'cos_secret_key', 'upload', 'あなたの', 'Tencent Cloud COS 秘密鍵', '0', null, null);
INSERT INTO `ea_system_config`
VALUES ('27', 'cos_region', 'upload', 'あなたの', 'ストレージバケットリージョン', '0', null, null);
INSERT INTO `ea_system_config`
VALUES ('28', 'cos_bucket', 'upload', 'あなたの', 'ストレージバケット名', '0', null, null);
INSERT INTO `ea_system_config`
VALUES ('29', 'qnoss_access_key', 'upload', 'あなたの', 'アクセスキー', '0', null, null);
INSERT INTO `ea_system_config`
VALUES ('30', 'qnoss_secret_key', 'upload', 'あなたの', 'セキュリティキー', '0', null, null);
INSERT INTO `ea_system_config`
VALUES ('31', 'qnoss_bucket', 'upload', 'あなたの', 'ストレージスペース', '0', null, null);
INSERT INTO `ea_system_config`
VALUES ('32', 'qnoss_domain', 'upload', 'あなたの', 'アクセスドメイン', '0', null, null);

-- ----------------------------
-- Table structure for ea_system_menu
-- ----------------------------
DROP TABLE IF EXISTS `ea_system_menu`;
CREATE TABLE `ea_system_menu`
(
    `id`          bigint(20) unsigned NOT NULL AUTO_INCREMENT,
    `pid`         bigint(20) unsigned NOT NULL DEFAULT '0' COMMENT '親ID',
    `title`       varchar(100) NOT NULL DEFAULT '' COMMENT '名称',
    `icon`        varchar(100) NOT NULL DEFAULT '' COMMENT 'メニューアイコン',
    `href`        varchar(100) NOT NULL DEFAULT '' COMMENT 'リンク',
    `params`      varchar(500)          DEFAULT '' COMMENT 'リンクパラメーター',
    `target`      varchar(20)  NOT NULL DEFAULT '_self' COMMENT 'リンク開き方',
    `sort`        int(11) DEFAULT '0' COMMENT 'メニュー並び順',
    `status`      tinyint(1) unsigned NOT NULL DEFAULT '1' COMMENT 'ステータス(0:無効,1:有効)',
    `remark`      varchar(255)          DEFAULT NULL,
    `create_time` int(11) DEFAULT NULL COMMENT '作成日時',
    `update_time` int(11) DEFAULT NULL COMMENT '更新日時',
    `delete_time` int(11) DEFAULT NULL COMMENT '削除日時',
    PRIMARY KEY (`id`),
    KEY           `title` (`title`),
    KEY           `href` (`href`)
) ENGINE=InnoDB AUTO_INCREMENT=253 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci ROW_FORMAT=COMPACT COMMENT='システムメニューテーブル';

-- ----------------------------
-- Records of ea_system_menu
-- ----------------------------
INSERT INTO `ea_system_menu`
VALUES ('1', '99999999', '管理画面ホーム', 'fa fa-home', 'index/welcome', '', '_self', '0', '1', null, null, '1573120497', null);
INSERT INTO `ea_system_menu`
VALUES ('2', '0', 'システム管理', 'fa fa-cog', '', '', '_self', '0', '1', '', null, '1588999529', null);
INSERT INTO `ea_system_menu`
VALUES ('3', '2', 'メニュー管理', 'fa fa-tree', 'system/menu/index', '', '_self', '10', '1', '', null, '1588228555', null);
INSERT INTO `ea_system_menu`
VALUES ('4', '2', '管理者管理', 'fa fa-user', 'system/admin/index', '', '_self', '12', '1', '', '1573185011', '1588228573', null);
INSERT INTO `ea_system_menu`
VALUES ('5', '2', 'ロール管理', 'fa fa-square-person-confined', 'system/auth/index', '', '_self', '11', '1', '', '1573435877', '1588228634', null);
INSERT INTO `ea_system_menu`
VALUES ('6', '2', 'ノード管理', 'fa fa-list', 'system/node/index', '', '_self', '9', '1', '', '1573435919', '1588228648', null);
INSERT INTO `ea_system_menu`
VALUES ('7', '2', '設定管理', 'fa fa-asterisk', 'system/config/index', '', '_self', '8', '1', '', '1573457448', '1588228566', null);
INSERT INTO `ea_system_menu`
VALUES ('8', '2', 'アップロード管理', 'fa fa-arrow-up', 'system/uploadfile/index', '', '_self', '0', '1', '', '1573542953', '1588228043', null);
INSERT INTO `ea_system_menu`
VALUES ('9', '0', 'ショップ管理', 'fa fa-list', '', '', '_self', '0', '1', '', '1589439884', '1589439884', null);
INSERT INTO `ea_system_menu`
VALUES ('10', '9', '商品カテゴリ', 'fa fa-calendar-check', 'mall/cate/index', '', '_self', '0', '1', '', '1589439910', '1589439966', null);
INSERT INTO `ea_system_menu`
VALUES ('11', '9', '商品管理', 'fa fa-store-alt', 'mall/goods/index', '', '_self', '0', '1', '', '1589439931', '1589439942', null);
INSERT INTO `ea_system_menu`
VALUES ('12', '2', 'クイックアクセス', 'fa fa-tachometer-alt-fast', 'system/quick/index', '', '_self', '0', '1', '', '1589623683', '1589623683', null);
INSERT INTO `ea_system_menu`
VALUES ('13', '2', 'ログ管理', 'fa fa-sticky-note', 'system/log/index', '', '_self', '0', '1', '', '1589623684', '1589623684', null);
INSERT INTO `ea_system_menu`
VALUES ('14', '2', 'CURD可視化', 'fa fa fa-shower', 'system/curdGenerate/index', '', '_self', '0', '1', '', '1589623684', '1589623684', null);
INSERT INTO `ea_system_menu`
VALUES ('15', '2', 'その他のページ', 'fa fa-square-share-nodes', '', '', '_self', '0', '1', '', '1589623684', '1589623684', null);
INSERT INTO `ea_system_menu`
VALUES ('16', '15', '公式サイト', 'fa fa-home', 'https://easyadmin8.top', '', '_self', '3', '1', '', '1589623684', '1589623684', null);
INSERT INTO `ea_system_menu`
VALUES ('17', '15', 'Q&Aコミュニティ', 'fa fa-comments', 'https://meta.easyadmin8.top', '', '_blank', '0', '1', '', '1589623684', '1589623684', null);
INSERT INTO `ea_system_menu`
VALUES ('18', '15', 'よくある質問', 'fa fa-circle-question', 'https://easyadmin8.top/guide/question.html', '', '_self', '2', '1', '', '1589623684', '1589623684', null);
INSERT INTO `ea_system_menu`
VALUES ('19', '2', 'ログ分析', 'fa fa-robot', 'system/LogAnalyzer/index', '', '_self', '1', '1', '', '1589623684', '1589623684', null);

-- ----------------------------
-- Table structure for ea_system_node
-- ----------------------------
DROP TABLE IF EXISTS `ea_system_node`;
CREATE TABLE `ea_system_node`
(
    `id`          int(11) unsigned NOT NULL AUTO_INCREMENT,
    `node`        varchar(100) DEFAULT NULL COMMENT 'ノードコード',
    `title`       varchar(500) DEFAULT NULL COMMENT 'ノードタイトル',
    `type`        tinyint(1) DEFAULT '3' COMMENT 'ノードタイプ（1：コントローラー，2：ノード）',
    `is_auth`     tinyint(1) unsigned DEFAULT '1' COMMENT 'RBAC権限制御を有効にするか',
    `create_time` int(10) DEFAULT NULL COMMENT '作成日時',
    `update_time` int(10) DEFAULT NULL COMMENT '更新日時',
    PRIMARY KEY (`id`),
    KEY           `node` (`node`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=67 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci ROW_FORMAT=COMPACT COMMENT='システムノードテーブル';

-- ----------------------------
-- Records of ea_system_node
-- ----------------------------
INSERT INTO `ea_system_node`
VALUES ('1', 'system/admin', '管理者管理', '1', '1', '1589580432', '1589580432');
INSERT INTO `ea_system_node`
VALUES ('2', 'system/admin/index', '一覧', '2', '1', '1589580432', '1589580432');
INSERT INTO `ea_system_node`
VALUES ('3', 'system/admin/add', '追加', '2', '1', '1589580432', '1589580432');
INSERT INTO `ea_system_node`
VALUES ('4', 'system/admin/edit', '編集', '2', '1', '1589580432', '1589580432');
INSERT INTO `ea_system_node`
VALUES ('5', 'system/admin/password', '編集', '2', '1', '1589580432', '1589580432');
INSERT INTO `ea_system_node`
VALUES ('6', 'system/admin/delete', '削除', '2', '1', '1589580432', '1589580432');
INSERT INTO `ea_system_node`
VALUES ('7', 'system/admin/modify', '属性変更', '2', '1', '1589580432', '1589580432');
INSERT INTO `ea_system_node`
VALUES ('8', 'system/admin/export', 'エクスポート', '2', '1', '1589580432', '1589580432');
INSERT INTO `ea_system_node`
VALUES ('9', 'system/auth', 'ロール権限管理', '1', '1', '1589580432', '1589580432');
INSERT INTO `ea_system_node`
VALUES ('10', 'system/auth/authorizes', '承認', '2', '1', '1589580432', '1589580432');
INSERT INTO `ea_system_node`
VALUES ('11', 'system/auth/saveAuthorize', '承認保存', '2', '1', '1589580432', '1589580432');
INSERT INTO `ea_system_node`
VALUES ('12', 'system/auth/index', '一覧', '2', '1', '1589580432', '1589580432');
INSERT INTO `ea_system_node`
VALUES ('13', 'system/auth/add', '追加', '2', '1', '1589580432', '1589580432');
INSERT INTO `ea_system_node`
VALUES ('14', 'system/auth/edit', '編集', '2', '1', '1589580432', '1589580432');
INSERT INTO `ea_system_node`
VALUES ('15', 'system/auth/delete', '削除', '2', '1', '1589580432', '1589580432');
INSERT INTO `ea_system_node`
VALUES ('16', 'system/auth/export', 'エクスポート', '2', '1', '1589580432', '1589580432');
INSERT INTO `ea_system_node`
VALUES ('17', 'system/auth/modify', '属性変更', '2', '1', '1589580432', '1589580432');
INSERT INTO `ea_system_node`
VALUES ('18', 'system/config', 'システム設定管理', '1', '1', '1589580432', '1589580432');
INSERT INTO `ea_system_node`
VALUES ('19', 'system/config/index', '一覧', '2', '1', '1589580432', '1589580432');
INSERT INTO `ea_system_node`
VALUES ('20', 'system/config/save', '保存', '2', '1', '1589580432', '1589580432');
INSERT INTO `ea_system_node`
VALUES ('21', 'system/menu', 'メニュー管理', '1', '1', '1589580432', '1589580432');
INSERT INTO `ea_system_node`
VALUES ('22', 'system/menu/index', '一覧', '2', '1', '1589580432', '1589580432');
INSERT INTO `ea_system_node`
VALUES ('23', 'system/menu/add', '追加', '2', '1', '1589580432', '1589580432');
INSERT INTO `ea_system_node`
VALUES ('24', 'system/menu/edit', '編集', '2', '1', '1589580432', '1589580432');
INSERT INTO `ea_system_node`
VALUES ('25', 'system/menu/delete', '削除', '2', '1', '1589580432', '1589580432');
INSERT INTO `ea_system_node`
VALUES ('26', 'system/menu/modify', '属性変更', '2', '1', '1589580432', '1589580432');
INSERT INTO `ea_system_node`
VALUES ('27', 'system/menu/getMenuTips', 'メニュー追加ヒント', '2', '1', '1589580432', '1589580432');
INSERT INTO `ea_system_node`
VALUES ('28', 'system/menu/export', 'エクスポート', '2', '1', '1589580432', '1589580432');
INSERT INTO `ea_system_node`
VALUES ('29', 'system/node', 'システムノード管理', '1', '1', '1589580432', '1589580432');
INSERT INTO `ea_system_node`
VALUES ('30', 'system/node/index', '一覧', '2', '1', '1589580432', '1589580432');
INSERT INTO `ea_system_node`
VALUES ('31', 'system/node/refreshNode', 'システムノード更新', '2', '1', '1589580432', '1589580432');
INSERT INTO `ea_system_node`
VALUES ('32', 'system/node/clearNode', '無効ノード削除', '2', '1', '1589580432', '1589580432');
INSERT INTO `ea_system_node`
VALUES ('33', 'system/node/add', '追加', '2', '1', '1589580432', '1589580432');
INSERT INTO `ea_system_node`
VALUES ('34', 'system/node/edit', '編集', '2', '1', '1589580432', '1589580432');
INSERT INTO `ea_system_node`
VALUES ('35', 'system/node/delete', '削除', '2', '1', '1589580432', '1589580432');
INSERT INTO `ea_system_node`
VALUES ('36', 'system/node/export', 'エクスポート', '2', '1', '1589580432', '1589580432');
INSERT INTO `ea_system_node`
VALUES ('37', 'system/node/modify', '属性変更', '2', '1', '1589580432', '1589580432');
INSERT INTO `ea_system_node`
VALUES ('38', 'system/uploadfile', 'アップロードファイル管理', '1', '1', '1589580432', '1589580432');
INSERT INTO `ea_system_node`
VALUES ('39', 'system/uploadfile/index', '一覧', '2', '1', '1589580432', '1589580432');
INSERT INTO `ea_system_node`
VALUES ('40', 'system/uploadfile/add', '追加', '2', '1', '1589580432', '1589580432');
INSERT INTO `ea_system_node`
VALUES ('41', 'system/uploadfile/edit', '編集', '2', '1', '1589580432', '1589580432');
INSERT INTO `ea_system_node`
VALUES ('42', 'system/uploadfile/delete', '削除', '2', '1', '1589580432', '1589580432');
INSERT INTO `ea_system_node`
VALUES ('43', 'system/uploadfile/export', 'エクスポート', '2', '1', '1589580432', '1589580432');
INSERT INTO `ea_system_node`
VALUES ('44', 'system/uploadfile/modify', '属性変更', '2', '1', '1589580432', '1589580432');
INSERT INTO `ea_system_node`
VALUES ('45', 'mall/cate', '商品カテゴリ管理', '1', '1', '1589580432', '1589580432');
INSERT INTO `ea_system_node`
VALUES ('46', 'mall/cate/index', '一覧', '2', '1', '1589580432', '1589580432');
INSERT INTO `ea_system_node`
VALUES ('47', 'mall/cate/add', '追加', '2', '1', '1589580432', '1589580432');
INSERT INTO `ea_system_node`
VALUES ('48', 'mall/cate/edit', '編集', '2', '1', '1589580432', '1589580432');
INSERT INTO `ea_system_node`
VALUES ('49', 'mall/cate/delete', '削除', '2', '1', '1589580432', '1589580432');
INSERT INTO `ea_system_node`
VALUES ('50', 'mall/cate/export', 'エクスポート', '2', '1', '1589580432', '1589580432');
INSERT INTO `ea_system_node`
VALUES ('51', 'mall/cate/modify', '属性変更', '2', '1', '1589580432', '1589580432');
INSERT INTO `ea_system_node`
VALUES ('52', 'mall/goods', 'ショップ商品管理', '1', '1', '1589580432', '1589580432');
INSERT INTO `ea_system_node`
VALUES ('53', 'mall/goods/index', '一覧', '2', '1', '1589580432', '1589580432');
INSERT INTO `ea_system_node`
VALUES ('54', 'mall/goods/stock', '入庫', '2', '1', '1589580432', '1589580432');
INSERT INTO `ea_system_node`
VALUES ('55', 'mall/goods/add', '追加', '2', '1', '1589580432', '1589580432');
INSERT INTO `ea_system_node`
VALUES ('56', 'mall/goods/edit', '編集', '2', '1', '1589580432', '1589580432');
INSERT INTO `ea_system_node`
VALUES ('57', 'mall/goods/delete', '削除', '2', '1', '1589580432', '1589580432');
INSERT INTO `ea_system_node`
VALUES ('58', 'mall/goods/export', 'エクスポート', '2', '1', '1589580432', '1589580432');
INSERT INTO `ea_system_node`
VALUES ('59', 'mall/goods/modify', '属性変更', '2', '1', '1589580432', '1589580432');
INSERT INTO `ea_system_node`
VALUES ('60', 'system/quick', 'クイックアクセス管理', '1', '1', '1589623188', '1589623188');
INSERT INTO `ea_system_node`
VALUES ('61', 'system/quick/index', '一覧', '2', '1', '1589623188', '1589623188');
INSERT INTO `ea_system_node`
VALUES ('62', 'system/quick/add', '追加', '2', '1', '1589623188', '1589623188');
INSERT INTO `ea_system_node`
VALUES ('63', 'system/quick/edit', '編集', '2', '1', '1589623188', '1589623188');
INSERT INTO `ea_system_node`
VALUES ('64', 'system/quick/delete', '削除', '2', '1', '1589623188', '1589623188');
INSERT INTO `ea_system_node`
VALUES ('65', 'system/quick/export', 'エクスポート', '2', '1', '1589623188', '1589623188');
INSERT INTO `ea_system_node`
VALUES ('66', 'system/quick/modify', '属性変更', '2', '1', '1589623188', '1589623188');
INSERT INTO `ea_system_node`
VALUES ('67', 'system/log', '操作ログ管理', '1', '1', '1589623188', '1589623188');
INSERT INTO `ea_system_node`
VALUES ('68', 'system/log/index', '一覧', '2', '1', '1589623188', '1589623188');
INSERT INTO `ea_system_node`
VALUES ('69', 'system/curdGenerate', 'CURD可視化管理', '1', '1', '1589623188', '1589623188');
INSERT INTO `ea_system_node`
VALUES ('70', 'system/curdGenerate/index', '一覧', '2', '1', '1589623188', '1589623188');
INSERT INTO `ea_system_node`
VALUES ('71', 'system/curdGenerate/save', '操作', '2', '1', '1589623188', '1589623188');

-- ----------------------------
-- Table structure for ea_system_quick
-- ----------------------------
DROP TABLE IF EXISTS `ea_system_quick`;
CREATE TABLE `ea_system_quick`
(
    `id`          bigint(20) unsigned NOT NULL AUTO_INCREMENT,
    `title`       varchar(20) NOT NULL COMMENT 'クイックアクセス名',
    `icon`        varchar(100) DEFAULT NULL COMMENT 'アイコン',
    `href`        varchar(255) DEFAULT NULL COMMENT 'クイックリンク',
    `sort`        int(11) DEFAULT '0' COMMENT '並び順',
    `status`      tinyint(1) unsigned DEFAULT '1' COMMENT 'ステータス(1:無効,2:有効)',
    `remark`      varchar(255) DEFAULT NULL COMMENT '備考',
    `create_time` int(11) DEFAULT NULL COMMENT '作成日時',
    `update_time` int(11) DEFAULT NULL COMMENT '更新日時',
    `delete_time` int(11) DEFAULT NULL COMMENT '削除日時',
    PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci ROW_FORMAT=COMPACT COMMENT='システムクイックアクセステーブル';

-- ----------------------------
-- Records of ea_system_quick
-- ----------------------------
INSERT INTO `ea_system_quick`
VALUES ('1', '管理者管理', 'fa fa-user', 'system/admin/index', '0', '1', '', '1589624097', '1589624792', null);
INSERT INTO `ea_system_quick`
VALUES ('2', 'ロール管理', 'fa fa-square-person-confined', 'system/auth/index', '0', '1', '', '1589624772', '1589624781', null);
INSERT INTO `ea_system_quick`
VALUES ('3', 'メニュー管理', 'fa fa-tree', 'system/menu/index', '0', '1', null, '1589624097', '1589624792', null);
INSERT INTO `ea_system_quick`
VALUES ('6', 'ノード管理', 'fa fa-list', 'system/node/index', '0', '1', null, '1589624772', '1589624781', null);
INSERT INTO `ea_system_quick`
VALUES ('7', '設定管理', 'fa fa-asterisk', 'system/config/index', '0', '1', null, '1589624097', '1589624792', null);
INSERT INTO `ea_system_quick`
VALUES ('8', 'アップロード管理', 'fa fa-arrow-up', 'system/uploadfile/index', '0', '1', null, '1589624772', '1589624781', null);
INSERT INTO `ea_system_quick`
VALUES ('10', '商品カテゴリ', 'fa fa-calendar-check', 'mall/cate/index', '0', '1', null, '1589624097', '1589624792', null);
INSERT INTO `ea_system_quick`
VALUES ('11', '商品管理', 'fa fa-store-alt', 'mall/goods/index', '0', '1', null, '1589624772', '1589624781', null);

-- ----------------------------
-- Table structure for ea_system_uploadfile
-- ----------------------------
DROP TABLE IF EXISTS `ea_system_uploadfile`;
CREATE TABLE `ea_system_uploadfile`
(
    `id`            int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT 'ID',
    `upload_type`   varchar(20)  NOT NULL DEFAULT 'local' COMMENT '保存場所',
    `original_name` varchar(255)          DEFAULT '' COMMENT '元のファイル名',
    `url`           varchar(255) NOT NULL DEFAULT '' COMMENT '物理パス',
    `image_width`   varchar(30)  NOT NULL DEFAULT '' COMMENT '幅',
    `image_height`  varchar(30)  NOT NULL DEFAULT '' COMMENT '高さ',
    `image_type`    varchar(30)  NOT NULL DEFAULT '' COMMENT '画像タイプ',
    `image_frames`  int(10) unsigned NOT NULL DEFAULT 0 COMMENT '画像フレーム数',
    `mime_type`     varchar(100) NOT NULL DEFAULT '' COMMENT 'MIMEタイプ',
    `file_size`     int(10) unsigned NOT NULL DEFAULT 0 COMMENT 'ファイルサイズ',
    `file_ext`      varchar(100)          DEFAULT '',
    `sha1`          varchar(40)  NOT NULL DEFAULT '' COMMENT 'ファイルSHA1ハッシュ',
    `create_time`   int(10) DEFAULT NULL COMMENT '作成日',
    `update_time`   int(10) DEFAULT NULL COMMENT '更新日時',
    `upload_time`   int(10) DEFAULT NULL COMMENT 'アップロード日時',
    PRIMARY KEY (`id`),
    KEY             `upload_type` (`upload_type`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci ROW_FORMAT=COMPACT COMMENT='アップロードファイルテーブル';

-- ----------------------------
-- Records of ea_system_uploadfile
-- ----------------------------
INSERT INTO `ea_system_uploadfile`
VALUES ('1', 'oss', 'image/jpeg', 'https://lxn-99php.oss-cn-shenzhen.aliyuncs.com/upload/20191111/0a6de1ac058ee134301501899b84ecb1.jpg', '', '', '', '0', 'image/jpeg', '0', 'jpg', '', 1573612437, null, null);
INSERT INTO `ea_system_uploadfile`
VALUES ('2', 'oss', 'image/jpeg', 'https://lxn-99php.oss-cn-shenzhen.aliyuncs.com/upload/20191111/46d7384f04a3bed331715e86a4095d15.jpg', '', '', '', '0', 'image/jpeg', '0', 'jpg', '', 1573612437, null, null);
INSERT INTO `ea_system_uploadfile`
VALUES ('3', 'oss', 'image/x-icon', 'https://lxn-99php.oss-cn-shenzhen.aliyuncs.com/upload/20191111/7d32671f4c1d1b01b0b28f45205763f9.ico', '', '', '', '0', 'image/x-icon', '0', 'ico', '', 1573612437, null, null);
INSERT INTO `ea_system_uploadfile`
VALUES ('4', 'oss', 'image/jpeg', 'https://lxn-99php.oss-cn-shenzhen.aliyuncs.com/upload/20191111/28cefa547f573a951bcdbbeb1396b06f.jpg', '', '', '', '0', 'image/jpeg', '0', 'jpg', '', 1573612437, null, null);
INSERT INTO `ea_system_uploadfile`
VALUES ('5', 'oss', 'image/jpeg', 'https://lxn-99php.oss-cn-shenzhen.aliyuncs.com/upload/20191111/2c412adf1b30c8be3a913e603c7b6e4a.jpg', '', '', '', '0', 'image/jpeg', '0', 'jpg', '', 1573612437, null, null);
INSERT INTO `ea_system_uploadfile`
VALUES ('6', 'cos', 'image/jpeg', 'https://easyadmin-1251997243.cos.ap-guangzhou.myqcloud.com/upload/20191114/2381eaf81208ac188fa994b6f2579953.jpg', '', '', '', '0', 'image/jpeg', '0', 'jpg', '', 1573612437, null, null);
