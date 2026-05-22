export interface HomepageAd {
  id: string;
  image: string;
  link: string;
  title: string;
  subtitle?: string;
  active: boolean;
  sort: number;
}

export const homepageAds: {
  gradeBanner:     HomepageAd[];
  featuredSlider:  HomepageAd[];
  newSlider:       HomepageAd[];
  appleSlider:     HomepageAd[];
  accessorySlider: HomepageAd[];
  blogSlider:      HomepageAd[];
} = {
  gradeBanner: [
    { id:"gb1", image:"", link:"/search", title:"期間限定セール中！全商品お得にゲット", subtitle:"数量限定・在庫限り", active:true, sort:1 },
  ],

  featuredSlider: [
    { id:"fs01", image:"", link:"/search",                           title:"注目商品特集",          subtitle:"今すぐチェック",          active:true, sort:1  },
    { id:"fs02", image:"", link:"/category/laptops-used-mac",        title:"MacBook 大特集",        subtitle:"M1/M2チップ搭載モデル",   active:true, sort:2  },
    { id:"fs03", image:"", link:"/category/smartphones-iphone-used", title:"iPhone 中古特集",       subtitle:"全モデル在庫あり",        active:true, sort:3  },
    { id:"fs04", image:"", link:"/wholesale",                        title:"法人向け一括販売",      subtitle:"お見積りお気軽に",        active:true, sort:4  },
    { id:"fs05", image:"", link:"/category/desktops-gaming",         title:"ゲーミングPC特集",      subtitle:"高スペック中古",          active:true, sort:5  },
    { id:"fs06", image:"", link:"/search?brand=microsoft",           title:"Surface Pro 特集",      subtitle:"軽量・高性能",            active:true, sort:6  },
    { id:"fs07", image:"", link:"/search?brand=lenovo",              title:"ThinkPad 特集",         subtitle:"ビジネス向け定番",        active:true, sort:7  },
    { id:"fs08", image:"", link:"/search?brand=samsung",             title:"Galaxy スマホ特集",     subtitle:"Android 中古",            active:true, sort:8  },
    { id:"fs09", image:"", link:"/category/tablets",                 title:"iPad 特集",             subtitle:"全サイズ揃っています",    active:true, sort:9  },
    { id:"fs10", image:"", link:"/search?brand=google",              title:"Chromebook 特集",       subtitle:"軽量・低価格",            active:true, sort:10 },
    { id:"fs11", image:"", link:"/category/desktops-used-business",  title:"デスクトップPC特集",    subtitle:"省スペースモデル多数",    active:true, sort:11 },
    { id:"fs12", image:"", link:"/buyback",                          title:"買取サービス",           subtitle:"高価買取実施中",          active:true, sort:12 },
  ],

  newSlider: [
    { id:"ns01", image:"", link:"/search",                              title:"新着商品 毎日更新中",      subtitle:"お見逃しなく",             active:true, sort:1  },
    { id:"ns02", image:"", link:"/category/desktops-gaming",            title:"ゲーミングPC 新着",         subtitle:"高スペック多数",           active:true, sort:2  },
    { id:"ns03", image:"", link:"/category/tablets",                    title:"タブレット 新着",           subtitle:"iPad・Surface・他",        active:true, sort:3  },
    { id:"ns04", image:"", link:"/category/smartphones-android-used",   title:"Android 新着",             subtitle:"最新モデル入荷",           active:true, sort:4  },
    { id:"ns05", image:"", link:"/category/laptops-used-mac",           title:"MacBook 新入荷",            subtitle:"M1チップモデルあり",       active:true, sort:5  },
    { id:"ns06", image:"", link:"/search?brand=microsoft",              title:"Surface 新着",              subtitle:"軽量ノートPCに最適",       active:true, sort:6  },
    { id:"ns07", image:"", link:"/category/desktops-used-business",     title:"デスクトップ 新着",         subtitle:"在庫随時補充中",           active:true, sort:7  },
    { id:"ns08", image:"", link:"/category/peripherals",                title:"モニター・周辺機器",        subtitle:"高解像度モデル多数",       active:true, sort:8  },
    { id:"ns09", image:"", link:"/search",                              title:"カメラ・撮影機材",          subtitle:"一眼レフ・ミラーレス",     active:true, sort:9  },
    { id:"ns10", image:"", link:"/search",                              title:"ゲーム機 新着",             subtitle:"Switch・PS5",              active:true, sort:10 },
    { id:"ns11", image:"", link:"/category/peripherals",                title:"オーディオ機器",           subtitle:"ヘッドセット・スピーカー", active:true, sort:11 },
    { id:"ns12", image:"", link:"/search",                              title:"ネットワーク機器",          subtitle:"Wi-Fi6対応ルーター",       active:true, sort:12 },
  ],

  appleSlider: [
    { id:"as01", image:"", link:"/search?brand=apple",                  title:"Apple製品 特集",            subtitle:"豊富に揃えています",       active:true, sort:1  },
    { id:"as02", image:"", link:"/category/smartphones-iphone-used",    title:"iPhone 中古",               subtitle:"全モデル対応",             active:true, sort:2  },
    { id:"as03", image:"", link:"/category/laptops-used-mac",           title:"MacBook 特集",              subtitle:"M1/M2搭載モデル",          active:true, sort:3  },
    { id:"as04", image:"", link:"/category/tablets",                    title:"iPad 特集",                 subtitle:"mini・Air・Pro",           active:true, sort:4  },
    { id:"as05", image:"", link:"/search",                              title:"Apple Watch",               subtitle:"Series 6〜9 在庫あり",     active:true, sort:5  },
    { id:"as06", image:"", link:"/search",                              title:"AirPods 特集",              subtitle:"Pro・Max・無印",           active:true, sort:6  },
    { id:"as07", image:"", link:"/search",                              title:"Apple TV",                  subtitle:"4K対応モデル",             active:true, sort:7  },
    { id:"as08", image:"", link:"/search",                              title:"Mac mini",                  subtitle:"M1チップ搭載モデル",       active:true, sort:8  },
    { id:"as09", image:"", link:"/search",                              title:"iMac 特集",                 subtitle:"24インチ・27インチ",       active:true, sort:9  },
    { id:"as10", image:"", link:"/search",                              title:"Apple純正アクセサリ",        subtitle:"ケーブル・充電器",         active:true, sort:10 },
    { id:"as11", image:"", link:"/search",                              title:"整備済製品特集",             subtitle:"保証付き・動作確認済",     active:true, sort:11 },
    { id:"as12", image:"", link:"/buyback",                             title:"Apple製品 買取",            subtitle:"高価買取実施中",           active:true, sort:12 },
  ],

  accessorySlider: [
    { id:"ac01", image:"", link:"/category/peripherals",             title:"周辺機器 大特集",          subtitle:"全種類揃っています",       active:true, sort:1  },
    { id:"ac02", image:"", link:"/category/storage-ssd-internal",    title:"SSD・ストレージ",          subtitle:"高速・大容量モデル",       active:true, sort:2  },
    { id:"ac03", image:"", link:"/search",                           title:"充電器・ケーブル",          subtitle:"GaN対応・急速充電",        active:true, sort:3  },
    { id:"ac04", image:"", link:"/category/peripherals",             title:"キーボード 特集",           subtitle:"メカニカル・薄型",         active:true, sort:4  },
    { id:"ac05", image:"", link:"/category/peripherals",             title:"マウス 特集",               subtitle:"ゲーミング・静音",         active:true, sort:5  },
    { id:"ac06", image:"", link:"/category/peripherals",             title:"モニター 特集",             subtitle:"4K・144Hz対応",            active:true, sort:6  },
    { id:"ac07", image:"", link:"/category/peripherals",             title:"ヘッドセット",              subtitle:"ゲーミング・会議用",       active:true, sort:7  },
    { id:"ac08", image:"", link:"/search",                           title:"Webカメラ 特集",            subtitle:"フルHD・4K対応",           active:true, sort:8  },
    { id:"ac09", image:"", link:"/search",                           title:"USBハブ 特集",              subtitle:"Type-C・Type-A対応",       active:true, sort:9  },
    { id:"ac10", image:"", link:"/category/peripherals",             title:"スピーカー 特集",           subtitle:"Bluetooth・有線",          active:true, sort:10 },
    { id:"ac11", image:"", link:"/search",                           title:"スマホケース",              subtitle:"全機種対応・耐衝撃",       active:true, sort:11 },
    { id:"ac12", image:"", link:"/search",                           title:"ゲームコントローラー",       subtitle:"PC・スマホ対応",           active:true, sort:12 },
  ],

  blogSlider: [
    { id:"bl01", image:"", link:"/blog",                             title:"お役立ち情報",               subtitle:"PCの選び方・活用術",       active:true, sort:1  },
    { id:"bl02", image:"", link:"/blog",                             title:"中古PCガイド",               subtitle:"初心者向け購入ガイド",     active:true, sort:2  },
    { id:"bl03", image:"", link:"/blog",                             title:"スマホ活用術",               subtitle:"便利な使い方を紹介",       active:true, sort:3  },
    { id:"bl04", image:"", link:"/blog",                             title:"最新ニュース",               subtitle:"IT業界の最新情報",         active:true, sort:4  },
    { id:"bl05", image:"", link:"/blog",                             title:"買取ガイド",                 subtitle:"高く売るコツを解説",       active:true, sort:5  },
    { id:"bl06", image:"", link:"/blog",                             title:"セキュリティ情報",           subtitle:"安全に使うための知識",     active:true, sort:6  },
    { id:"bl07", image:"", link:"/blog",                             title:"メンテナンス術",             subtitle:"長く使うための手入れ方法", active:true, sort:7  },
    { id:"bl08", image:"", link:"/blog",                             title:"おすすめ周辺機器",           subtitle:"快適環境を作る",           active:true, sort:8  },
    { id:"bl09", image:"", link:"/blog",                             title:"法人向け情報",               subtitle:"業務効率化のヒント",       active:true, sort:9  },
    { id:"bl10", image:"", link:"/blog",                             title:"修理・サポート",             subtitle:"困ったときの対処法",       active:true, sort:10 },
    { id:"bl11", image:"", link:"/blog",                             title:"環境・リサイクル",           subtitle:"SDGsへの取り組み",         active:true, sort:11 },
    { id:"bl12", image:"", link:"/blog",                             title:"キャンペーン情報",           subtitle:"お得な情報をお届け",       active:true, sort:12 },
  ],
};
