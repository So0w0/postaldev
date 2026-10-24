# 郵便番号検索システム (yubin_dev)

Node.js、Express、SQLite3、EJSで構築された郵便番号検索Webアプリケーションです。CSV形式の郵便番号データをSQLite3データベースに取り込み、Web API経由で住所（都道府県・市区町村・町域）を検索・取得します。

---

## 概要

本システムは、郵便番号を入力して対応する住所情報を検索・表示するサービスです。簡易的なユーザー認証（ログイン機能）およびセッション管理を備えています。

## 機能一覧

- **トップページ (`GET /`)**: アプリケーションのメイン画面を表示
- **ログイン機能 (`GET /login`, `POST /login`)**: 簡易認証とセッション保持
- **郵便番号検索 API (`POST /search`)**: 郵便番号に基づく住所情報の非同期/JSON検索
- **DB初期化スクリプト (`init_db.js`)**: CSVデータ（`postal.csv`）からSQLiteデータベース（`postal.db`）を構築

---

## 技術スタック

- **ランタイム**: Node.js
- **フレームワーク**: Express (v5.2.1)
- **データベース**: SQLite3 (v6.0.1)
- **テンプレートエンジン**: EJS (v6.0.1)
- **主要ミドルウェア**:
  - `express-session`: セッション管理
  - `cookie-parser`: クッキー解析
  - `body-parser`: リクエストボディ（JSON / URL-encoded）のパース

---

## プロジェクト構成

```
.
├── index.js          # アプリケーションのメインエントリー（Expressサーバー・ルーティング）
├── init_db.js        # CSVからSQLite3 DBを生成・初期化するスクリプト
├── package.json      # プロジェクト設定および依存パッケージ定義
├── package-lock.json # パッケージの依存関係ロックファイル
├── postal.csv        # 郵便番号ソースデータ
├── postal.db         # 生成されるSQLite3データベース（init_db.js 実行時に作成）
├── views/            # EJSテンプレートファイル（index, login, search等）
└── public/           # 静的コンテンツ（CSS, クライアントJS, 画像等）
```

---

## セットアップ & 起動手順

### 1. 依存パッケージのインストール

```bash
npm install
```

### 2. データベースの初期化

`postal.csv` を読み込んで SQLite3 データベース (`postal.db`) を作成します。

```bash
node init_db.js
```

### 3. サーバーの起動

```bash
node index.js
```

起動後、ブラウザで [http://localhost:3000](http://localhost:3000) にアクセスしてください。

---

## 利用方法・ログイン情報

1. ブラウザで [http://localhost:3000/login](http://localhost:3000/login) にアクセスします。
2. 以下のログインアカウント情報を使用してログインを行ってください。
   - **ユーザー名 (User)**: `user`
   - **パスワード (Password)**: `password`
3. ログイン完了後、検索画面にて郵便番号（ハイフンなし）を入力して住所検索を実行します。

---

## データベース & API仕様

### データベース構造 (`postalcode` テーブル)

| カラム名     | 型   | 説明                       |
| :----------- | :--- | :------------------------- |
| `code`       | TEXT | 郵便番号（ハイフンなし等） |
| `prefecture` | TEXT | 都道府県名                 |
| `city`       | TEXT | 市区町村名                 |
| `address`    | TEXT | 町域・詳細住所             |

### 検索エンドポイント (`POST /search`)

- **Request Header**: `Content-Type: application/json` または `application/x-www-form-urlencoded`
- **Request Body**:
  ```json
  {
    "postalcode": "1000001"
  }
  ```
- **Response (成功時 - 200 OK)**:
  ```json
  {
    "prefecture": "東京都",
    "city": "千代田区",
    "address": "千代田"
  }
  ```
- **Response (該当データなし時 - 200 OK)**:
  ```json
  {
    "error": "入力した郵便番号は見つかりませんでした。正しい番号を入力して下さい。"
  }
  ```
