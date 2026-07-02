<?php

namespace App\Http\Services;

use App\Models\SystemUploadfile;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use OSS\Core\OssException;
use OSS\Credentials\EnvironmentVariableCredentialsProvider;
use OSS\OssClient;
use Qcloud\Cos\Client;
use Exception;
use Qiniu\Storage\UploadManager;
use Qiniu\Auth;

class UploadService
{
    public static ?UploadService $_instance = null;
    protected array              $options   = [];
    private array                $saveData;

    public static function instance(): ?UploadService
    {
        if (!static::$_instance) static::$_instance = new static();
        return static::$_instance;
    }

    /**
     * @param array $options
     * @return $this
     */
    public function setConfig(array $options = []): UploadService
    {
        $this->options = $options;
        return $this;
    }

    /**
     * @return array
     */
    public function getConfig(): array
    {
        return $this->options;
    }

    /**
     * @param UploadedFile $file
     * @param string $base_path
     * @return string
     */
    protected function setFilePath(UploadedFile $file, string $base_path = ''): string
    {
        $path = date('Ymd') . '/' . Str::random(3) . time() . Str::random() . '.' . $file->extension();
        return $base_path . $path;
    }

    /**
     * @param UploadedFile $file
     * @return UploadService
     */
    protected function setSaveData(UploadedFile $file): static
    {
        $options        = $this->options;
        $data           = [
            'upload_type'   => $options['upload_type'],
            'original_name' => $file->getClientOriginalName(),
            'mime_type'     => $file->getMimeType(),
            'file_size'     => $file->getSize(),
            'file_ext'      => strtolower($file->extension()),
            'create_time'   => time(),
        ];
        $this->saveData = $data;
        return $this;
    }

    /**
     * ローカルストレージ
     *
     * @param UploadedFile $file
     * @return array
     */
    public function local(UploadedFile $file): array
    {
        if ($file->isValid()) {
            $base_path = '/storage/' . date('Ymd') . '/';
            // アップロードファイルのターゲットフォルダ
            $destinationPath = public_path() . $base_path;
            $this->setSaveData($file);
            // ファイルをターゲットフォルダに移動
            $move = $file->move($destinationPath, Str::random(3) . time() . Str::random() . session('admin.id') . '.' . $file->extension());
            $url  = $base_path . $move->getFilename();
            $data = ['url' => $url];
            $this->save($url);
            return ['code' => 1, 'data' => $data];
        }
        $data = 'アップロード失敗';
        return ['code' => 0, 'data' => $data];
    }

    /**
     * Alibaba Cloud OSS
     *
     * @param UploadedFile $file
     * @param string $type
     * @return array
     */
    public function oss(UploadedFile $file, string $type = ''): array
    {
        $config          = $this->getConfig();
        $accessKeyId     = $config['oss_access_key_id'];
        $accessKeySecret = $config['oss_access_key_secret'];
        $endpoint        = $config['oss_endpoint'];
        $bucket          = $config['oss_bucket'];
        // aliyuncs/oss-sdk-php を v2.7.2 以上にアップグレード, 署名 v4 バージョンを使用
        putenv('OSS_ACCESS_KEY_ID=' . $accessKeyId);
        putenv('OSS_ACCESS_KEY_SECRET=' . $accessKeySecret);
        $region   = str_replace(['http://oss-', 'https://oss-', 'oss-'], '', explode('.aliyuncs.com', $endpoint)[0] ?? '');
        $provider = new EnvironmentVariableCredentialsProvider();
        $args     = [
            "provider"         => $provider,
            "endpoint"         => $endpoint,
            "signatureVersion" => OssClient::OSS_SIGNATURE_VERSION_V4,
            "region"           => $region
        ];
        if ($file->isValid()) {
            $object = $this->setFilePath($file, config('easyadmin.OSS_STATIC_PREFIX', 'easyadmin8') . '/');
            try {
                $ossClient       = new OssClient($args);
                $_rs             = $ossClient->putObject($bucket, $object, file_get_contents($file->getRealPath()));
                $oss_request_url = $_rs['oss-request-url'] ?? '';
                if (empty($oss_request_url)) return ['code' => 0, 'data' => 'OSSへのアップロード失敗'];
                $oss_request_url = str_replace('http://', 'https://', $oss_request_url);
                $this->setSaveData($file);
            }catch (OssException $e) {
                return ['code' => 0, 'data' => $e->getMessage()];
            }
            $data = ['url' => $oss_request_url];
            $this->save($oss_request_url);
            return ['code' => 1, 'data' => $data];
        }
        $data = 'アップロード失敗';
        return ['code' => 0, 'data' => $data];
    }

    /**
     * Tencent Cloud COS
     *
     * @param UploadedFile $file
     * @param string $type
     * @return array
     */
    public function cos(UploadedFile $file, string $type = ''): array
    {
        $config    = $this->getConfig();
        $secretId  = $config['cos_secret_id'];              //ユーザーのsecretIdに置き換えてください。アクセス管理コンソールで確認・管理できます。https://console.cloud.tencent.com/cam/capi
        $secretKey = $config['cos_secret_key'];             //ユーザーのsecretKeyに置き換えてください。アクセス管理コンソールで確認・管理できます。https://console.cloud.tencent.com/cam/capi
        $region    = $config['cos_region'];                 //ユーザーのregionに置き換えてください。作成済みバケットのregionはコンソールで確認できます。https://console.cloud.tencent.com/cos5/bucket
        if ($file->isValid()) {
            $cosClient = new Client(
                [
                    'region'      => $region,
                    'schema'      => 'http',
                    'credentials' => ['secretId' => $secretId, 'secretKey' => $secretKey,
                    ],
                ]);
            try {
                $object   = $this->setFilePath($file, config('easyadmin.OSS_STATIC_PREFIX', 'easyadmin8') . '/');
                $result   = $cosClient->upload(
                    $config['cos_bucket'],         //ストレージバケット名。BucketName-Appid で構成。COSコンソールで確認可能 https://console.cloud.tencent.com/cos5/bucket
                    $object,                       //この key はオブジェクトキー
                    file_get_contents($file->getRealPath())
                );
                $location = $result['Location'] ?? '';
                if (empty($location)) return ['code' => 0, 'data' => 'COSへのアップロード失敗'];
                $location = 'https://' . $location;
                $this->setSaveData($file);
            }catch (\Exception $e) {
                return ['code' => 0, 'data' => $e->getMessage()];
            }
            $data = ['url' => $location];
            $this->save($location);
            return ['code' => 1, 'data' => $data];
        }
        $data = 'アップロード失敗';
        return ['code' => 0, 'data' => $data];
    }

    /**
     * Qiniu Cloud
     *
     * @param UploadedFile $file
     * @param string $type
     * @return array
     * @throws Exception
     */
    public function qnoss(UploadedFile $file, string $type = ''): array
    {
        if (!$file->isValid()) return ['code' => 1, 'data' => 'アップロード検証失敗'];
        $uploadMgr = new UploadManager();
        $config    = $this->getConfig();
        $accessKey = $config['qnoss_access_key'];
        $secretKey = $config['qnoss_secret_key'];
        $bucket    = $config['qnoss_bucket'];
        $domain    = $config['qnoss_domain'];
        $auth      = new Auth($accessKey, $secretKey);
        $token     = $auth->uploadToken($bucket);
        $object    = $this->setFilePath($file, config('easyadmin.OSS_STATIC_PREFIX', 'easyadmin8') . '/');
        list($ret, $error) = $uploadMgr->putFile($token, $object, $file->getRealPath());
        if (empty($ret)) return ['code' => 0, 'data' => $error->getResponse()->error ?? 'アップロード失敗、七牛クラウドの関連パラメータ設定を確認してください'];
        $url  = $domain . "/" . $ret['key'];
        $data = ['url' => $url];
        $this->setSaveData($file);
        $this->save($url);
        return ['code' => 1, 'data' => $data];
    }

    protected function save(string $url = ''): bool
    {
        $data        = $this->saveData;
        $data['url'] = $url;
        return DB::table((new SystemUploadfile())->getTable())->insert($data);
    }
}
