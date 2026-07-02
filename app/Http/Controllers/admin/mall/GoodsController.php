<?php

namespace App\Http\Controllers\admin\mall;

use App\Http\Controllers\common\AdminController;
use App\Http\Services\ai\AgentService;
use App\Http\Services\annotation\MiddlewareAnnotation;
use App\Http\Services\annotation\NodeAnnotation;
use App\Http\Services\annotation\ControllerAnnotation;
use App\Models\MallCate;
use App\Models\MallGoods;
use Illuminate\Http\JsonResponse;
use Illuminate\View\View;
use NeuronAI\Chat\Messages\UserMessage;

#[ControllerAnnotation(title: 'ショップ商品管理')]
class GoodsController extends AdminController
{
    #[NodeAnnotation(ignore: ['export'])] // 生成不要な権限ノードをフィルタリング デフォルトのCURDで自動生成されるノードをここでフィルタリングできます
    protected array $ignoreNode;

    public function initialize()
    {
        parent::initialize();
        $this->model = new MallGoods();
        $cate        = (new MallCate())->pluck('title', 'id')->toArray();
        $this->assign(compact('cate'));
    }

    #[NodeAnnotation(title: '一覧', auth: true)]
    public function index(): View|JsonResponse
    {
        if (!request()->ajax()) return $this->fetch();
        list($page, $limit, $where) = $this->buildTableParams();
        $count = $this->model->where($where)->count();
        $list  = $this->model->where($where)->with(['cate'])->orderBy($this->order, $this->orderDirection)->paginate($limit)->items();
        $data  = [
            'code'  => 0,
            'msg'   => '',
            'count' => $count,
            'data'  => $list,
        ];
        return json($data);
    }

    #[NodeAnnotation(title: '入庫', auth: true)]
    public function stock(): View|JsonResponse
    {
        $id  = request()->input('id');
        $row = $this->model->find($id);
        if (empty($row)) return $this->error('データが存在しません');
        if (request()->ajax()) {
            $post = request()->post();
            try {
                $params['total_stock'] = $row->total_stock + $post['stock'];
                $params['stock']       = $row->stock + $post['stock'];
                $save                  = updateFields($this->model, $row, $params);
            }catch (\Exception $e) {
                return $this->error('保存失敗');
            }
            return $save ? $this->success('保存しました') : $this->error('保存失敗');
        }
        $this->assign(compact('row'));
        return $this->fetch();
    }

    #[MiddlewareAnnotation(ignore: MiddlewareAnnotation::IGNORE_LOGIN)]
    public function no_check_login(): string
    {
        return 'このメソッドはログイン認証を必要としません';
    }

    #[NodeAnnotation(title: 'AI最適化', auth: true)]
    public function aiOptimization(): View|JsonResponse
    {
        $message = request()->post('message');
        if (empty($message)) return $this->error('内容を入力してください');
        // デモ環境でデフォルトで返す内容
        if ($this->isDemo) {
            sleep(1);
            $content = <<<EOF
>デモ環境でデフォルトで返す内容
>
>タイトルを最適化し、より魅力的でEコマースプラットフォームの検索ロジックに合ったものにします：

「カピバラぬいぐるみ」を例に、海外EC向けタイトル最適化案。
**SEO検索順位**・**クリック率**・**ブランド価値**の3軸で再構築します。

### 一、コアタイトル最適化案

#### 1. Amazon/検索指向型 (Amazon Listing SEO)
> **公式：** [コアワード] + [コア属性/素材] + [対象者] + [使用シーン] + [差別化ポイント]
> **推奨タイトル：**
> **Giant Realistic Capybara Plush Toy – Super Soft Stuffed Animal Doll, Ultra-Friendly Huggable Cappy Bear for Kids Adults Bed Decoration, Perfect Birthday Christmas Gift**

#### 2. TikTok/ソーシャルメディア誘導型
> **公式：** [情緒的価値] + [トレンドワード] + [絵文字による視覚強化]
> **推奨タイトル：**
> **Meet Your New Chill Bestie! ☕️ The Viral Capybara Plushie – Maximum Cozy Vibes & Stress Relief 🧸**

#### 3. 自社サイト/ブランド訴求型
> **公式：** [ブランド理念] + [素材・製法] + [希少性/独自性]
> **推奨タイトル：**
> **The Calm Collection™: Premium Faux Fur Capybara Companion | Machine Washable Hypoallergenic Stuffing | Ethically Crafted Decor**

### 二、キーワードマップ
* **コアワード：** Capybara, Capybarra, Cappy Bear
* **カテゴリワード：** Plush Toy, Stuffed Animal, Doll, Teddy Bear
* **属性ワード：** Soft, Fluffy, Huge, Giant, Mini
* **シーンワード：** Bedroom Decor, Desk Accessory, Sleep Aid
* **対象ワード：** For Kids, For Women, For Men
* **感情/マーケティングワード：** Trending 2024, Viral, Gift, Cute, Kawaii
EOF;
            $choices = [['message' => [
                'role'    => 'assistant',
                'content' => $content,
            ]]];
            return $this->success('success', compact('choices'));
        }

        try {
            $response = AgentService::make()->setInstructions('あなたは経験豊富な海外ECプロダクトマネージャーです。要件に合った商品提案を直接提供してください。質問はしないでください')->chat(new UserMessage($message));
            $choices  = [['message' => [
                'role'    => 'assistant',
                'content' => $response->getMessage()->getContent(),
            ]]];
        }catch (\Throwable $exception) {
            $choices = [['message' => [
                'role'    => 'assistant',
                'content' => $exception->getMessage(),
            ]]];
        }
        return $this->success('success', compact('choices'));
    }

}
