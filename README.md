# markdown2html publisher
## 概要
mdファイルを編集する作業者がいるとする。この作業者がgithubに変更をpushすると、

* build(build処理用のライブラリの依存関係の解決とmdからHTMLへの変換)
* test(build処理に関するテスト)
* deploy（s3へデプロイ。このバケットは静的ホスティングされている)

といったCIを行う。この結果、作業者はファイルをリモートにpushすれば最新のhtmlをシームレスに確認できる。

## モチベーション
この一連の作業はサーバレスで行われる。これによりjenkinsサーバやcircle-ciなどのサービスを使わなくてもCIを実現できる。CI環境を使う際のセットアップの煩わしさ、また常にサービスを起動し続けなければならない、サプスクリプションを購入しなくてはならないことによるコストを抑えたかった。

また、markdownによるドキュメント管理を少しでも促進していきたいという思いがある。

## 技術的特徴
### [lambci](https://github.com/lambci/lambci/blob/master/README.md)

サーバレスアーキテクチャCI環境。OSS。今はベータ版で、リポジトリはgithubのみが対象。環境はcloud formation を使うことで数分で構築できる(個別の設定は、パラメータで指定する)。

アーキテクチャの内訳はこのような感じ
![lambci-architecture](https://camo.githubusercontent.com/6c1a3528e4927b7a77417ae7565ad1b9d364d455/68747470733a2f2f6c616d6263692e73332e616d617a6f6e6177732e636f6d2f6173736574732f617263682e706e67)

### markdown directory
一つのファイルをhtmlに変換するのは簡単だが、あるフォルダ内全ての・・となると工夫が要る。
作成したのは、対象のフォルダ内のファイルを再帰的に操作するためのプログラム。[cps](http://www.h4.dion.ne.jp/~unkai/js/js12.html)スタイルの標準ライブラリの機能をpromisifyしている。

[こちら](https://www.npmjs.com/package/marked-directory)を参考にした。


### s3 sync
aws-cli でいうところの`aws s3 sync from to`をnodeで実現する。

## AWS LambdaをCIに使うときの注意点
Lambdaの[一般的な制約](https://docs.aws.amazon.com/ja_jp/lambda/latest/dg/limits.html)として、buildに使える処理時間は5分・cloneできるファイルの上限は500MB（/tmpに格納できるファイル容量の最大値に依存)というものがある。

またLambdaにはgitバイナリが用意されていないので、必要ならば各言語のgit clientを探して使う必要がある。このことに最も苦労したが、lambciがその悩みを解決してくれた。

なお、AWSのリソースにアクセスするための手段として、lambda内ではawscliは使えないので各言語のSDKを使わなくてはならない。

## Demo
1. このリポジトリからcloneする
1. docs以下のファイルを編集または追加、削除する
1. 結果を`http://markdown-converter.s3-website-ap-northeast-1.amazonaws.com/artifacts/docs/{ファイル名(ディレクトリがあればそれも含める}.html` で確認する。

