<?php

namespace App\Http\Services\auth;

use Doctrine\Common\Annotations\AnnotationException;
use Doctrine\Common\Annotations\AnnotationReader;
use Doctrine\Common\Annotations\AnnotationRegistry;
use Doctrine\Common\Annotations\DocParser;
use App\Http\Services\annotation\ControllerAnnotation;
use App\Http\Services\annotation\NodeAnnotation;
use ReflectionException;

/**
 * ノード処理クラス
 * Class Node
 * @package EasyAdmin\auth
 */
class Node
{

    /**
     * @var string 現在のフォルダ
     */
    protected $basePath;

    /**
     * @var string 名前空間プレフィックス
     */
    protected       $baseNamespace;
    protected array $adminConfig;

    /**
     * コンストラクタ
     * Node constructor.
     * @param string $basePath 読み取るフォルダ
     * @param string $baseNamespace 読み取る名前空間プレフィックス
     */
    public function __construct(string $basePath, string $baseNamespace)
    {
        $this->basePath      = $basePath;
        $this->baseNamespace = $baseNamespace;
        $this->adminConfig   = config('admin');
        return $this;
    }

    /**
     * 全ノード取得
     * @return array
     * @throws AnnotationException
     * @throws ReflectionException
     */
    public function getNodeList(): array
    {
        list($nodeList, $controllerList) = [[], $this->getControllerList()];
        if (!empty($controllerList)) {
            AnnotationRegistry::loadAnnotationClass('class_exists');
            $parser = new DocParser();
            $parser->setIgnoreNotImportedAnnotations(true);
            $reader = new AnnotationReader($parser);

            foreach ($controllerList as $controllerFormat => $controller) {
                // クラスとメソッドのコメント情報取得
                $reflectionClass = new \ReflectionClass($controller);
                $methods         = $reflectionClass->getMethods();
                $actionList      = [];
                // 全メソッドのコメントパラメーター情報を走査
                foreach ($methods as $method) {

                    // 不要なノードを無視
                    $property           = $reflectionClass->getProperty('ignoreNode');
                    $propertyAttributes = $property->getAttributes(NodeAnnotation::class);
                    if (!empty($propertyAttributes[0])) {
                        $propertyAttribute = $propertyAttributes[0]->newInstance();
                        if (in_array($method->name, $propertyAttribute->ignore)) continue;
                    }

                    $attributes = $reflectionClass->getMethod($method->name)->getAttributes(NodeAnnotation::class);
                    foreach ($attributes as $attribute) {
                        $annotation = $attribute->newInstance();
                        if (!empty($annotation->ignore)) if (strtolower($annotation->ignore) == 'node') continue;
                        $actionList[] = [
                            'node'    => $controllerFormat . '/' . $method->name,
                            'title'   => $annotation->title ?? null,
                            'is_auth' => $annotation->auth ?? false,
                            'type'    => 2,
                        ];
                    }
                }
                // メソッドが空でない場合のみコントローラーアノテーションを読み取る
                if (!empty($actionList)) {
                    // Controllerのアノテーションを読み取る
                    $attributes = $reflectionClass->getAttributes(ControllerAnnotation::class);
                    foreach ($attributes as $attribute) {
                        $controllerAnnotation = $attribute->newInstance();
                        $nodeList[]           = [
                            'node'    => $controllerFormat,
                            'title'   => $controllerAnnotation->title ?? null,
                            'is_auth' => $controllerAnnotation->auth ?? false,
                            'type'    => 1,
                        ];
                    }
                    $nodeList = array_merge($nodeList, $actionList);
                }
            }
        }
        return $nodeList;
    }

    /**
     * 全コントローラー取得
     * @return array
     */
    public function getControllerList()
    {
        return $this->readControllerFiles($this->basePath);
    }

    /**
     * コントローラーファイルを走査
     * @param $path
     * @return array
     */
    protected function readControllerFiles($path): array
    {
        $explodePath = explode(DIRECTORY_SEPARATOR, $path);
        list($list, $temp_list, $dirExplode) = [[], scandir($path), end($explodePath)];
        if ($dirExplode == 'admin') $dirExplode = '';
        $middleDir = !empty($dirExplode) ? $dirExplode . "\\" : '';
        foreach ($temp_list as $file) {
            // ルートディレクトリとアノテーションが有効でないモジュールを除外
            if ($file == ".." || $file == ".") {
                continue;
            }
            if (is_dir($path . DIRECTORY_SEPARATOR . $file)) {
                // サブフォルダ、再帰処理
                $childFiles = $this->readControllerFiles($path . DIRECTORY_SEPARATOR . $file);
                $list       = array_merge($childFiles, $list);
            }else {
                // コントローラーかどうか判定
                $fileExplodeArray = explode('.', $file);
                if (count($fileExplodeArray) != 2 || end($fileExplodeArray) != 'php') {
                    continue;
                }
                if (in_array(strtolower(explode('Controller', $fileExplodeArray[0])[0] ?? ''), $this->adminConfig['no_auth_controller'])) {
                    continue;
                }
                // ルートディレクトリのファイル
                $className               = str_replace('.php', '', $file);
                $controllerFormat        = str_replace('\\', '/', $middleDir) . lcfirst($className);
                $controllerFormat        = str_replace('Controller', '', $controllerFormat);
                $list[$controllerFormat] = "{$this->baseNamespace}\\{$middleDir}" . $className;
            }
        }
        return $list;
    }

}
