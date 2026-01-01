/**
 * パーサーとシリアライザで共有するテストケース
 */

/**
 * パース用テストケース
 * URL → オブジェクト
 */
export const parseTestCases = [
  // 基本
  { input: 'foo=bar', expected: { foo: 'bar' }, description: '単一パラメータ' },
  {
    input: 'foo=bar&baz=qux',
    expected: { foo: 'bar', baz: 'qux' },
    description: '複数パラメータ',
  },
  { input: '', expected: {}, description: '空文字列は空オブジェクト' },
  {
    input: '?foo=bar',
    expected: { foo: 'bar' },
    description: '?付きクエリ文字列',
  },

  // 数値・文字列
  {
    input: 'count=123',
    expected: { count: '123' },
    description: '数値は文字列になる',
  },
  {
    input: 'code=%22123%22',
    expected: { code: '"123"' },
    description: 'クォート付き文字列はそのまま保持',
  },

  // Boolean
  {
    input: 'active=true',
    expected: { active: true },
    description: 'true → boolean',
  },
  {
    input: 'active=false',
    expected: { active: false },
    description: 'false → boolean',
  },

  // 配列（カンマ区切り）
  {
    input: 'ids=1,2,3',
    expected: { ids: ['1', '2', '3'] },
    description: 'カンマ区切り配列',
  },
  {
    input: 'ids=1',
    expected: { ids: '1' },
    description: 'カンマなしは文字列のまま',
  },

  // 空文字列・空配列
  { input: 'foo=', expected: { foo: '' }, description: '空値は空文字列' },
  {
    input: 'childUserCodes=&facilityCodes=1,2,3',
    expected: { childUserCodes: '', facilityCodes: ['1', '2', '3'] },
    description: '空文字列とカンマ区切り配列の混在',
  },

  // JSON形式配列（カンマが含まれるので配列に分割される）
  {
    input: 'ids=%5B%221%22%2C%222%22%5D',
    expected: { ids: ['["1"', '"2"]'] },
    description: 'JSON形式配列はカンマで分割される',
  },

  // URLエンコード
  {
    input: 'name=%E5%A4%AA%E9%83%8E',
    expected: { name: '太郎' },
    description: '日本語デコード',
  },
  {
    input: 'query=a%26b%3Dc',
    expected: { query: 'a&b=c' },
    description: '特殊文字デコード',
  },
  {
    input: 'name=hello%20world',
    expected: { name: 'hello world' },
    description: 'スペースデコード（%20）',
  },
  {
    input: 'name=hello+world',
    expected: { name: 'hello world' },
    description: 'スペースデコード（+）',
  },

  // エッジケース
  { input: '?', expected: {}, description: '?のみは空オブジェクト' },
  { input: 'foo', expected: { foo: '' }, description: 'キーのみ（値なし）' },

  // 配列（PHP形式）
  {
    input: 'ids[]=1&ids[]=2&ids[]=3',
    expected: { ids: ['1', '2', '3'] },
    description: 'PHP形式配列',
  },
  {
    input: 'ids[]=',
    expected: { ids: [''] },
    description: 'PHP形式空値は空文字列を含む配列',
  },

  // 配列（重複キー）
  {
    input: 'id=1&id=2&id=3',
    expected: { id: ['1', '2', '3'] },
    description: '重複キー配列',
  },

  // ネストしたオブジェクト（Rails形式）
  {
    input: 'user[name]=john',
    expected: { user: { name: 'john' } },
    description: 'ネストしたオブジェクト',
  },
  {
    input: 'user[name]=john&user[age]=30',
    expected: { user: { name: 'john', age: '30' } },
    description: '複数プロパティのネスト',
  },
  {
    input: 'user[address][city]=tokyo',
    expected: { user: { address: { city: 'tokyo' } } },
    description: '深くネストしたオブジェクト',
  },
  {
    input: 'user[active]=true',
    expected: { user: { active: true } },
    description: 'ネスト内のboolean変換',
  },

  // 配列内オブジェクト
  {
    input: 'items[0][name]=apple',
    expected: { items: [{ name: 'apple' }] },
    description: '配列内オブジェクト',
  },
  {
    input: 'items[0][name]=apple&items[0][price]=100',
    expected: { items: [{ name: 'apple', price: '100' }] },
    description: '複数プロパティの配列内オブジェクト',
  },
  {
    input: 'items[0][name]=apple&items[1][name]=banana',
    expected: { items: [{ name: 'apple' }, { name: 'banana' }] },
    description: '複数オブジェクトの配列',
  },

  // 数値インデックス配列
  {
    input: 'items[0]=a',
    expected: { items: ['a'] },
    description: '数値インデックス配列（単一）',
  },
  {
    input: 'items[0]=a&items[1]=b&items[2]=c',
    expected: { items: ['a', 'b', 'c'] },
    description: '数値インデックス配列（連続）',
  },

  // ネストとフラットの混合
  {
    input: 'name=john&user[age]=30&active=true',
    expected: { name: 'john', user: { age: '30' }, active: true },
    description: 'ネストとフラットの混合',
  },

  // ネスト内の配列
  {
    input: 'user[tags][]=a&user[tags][]=b',
    expected: { user: { tags: ['a', 'b'] } },
    description: 'ネスト内のPHP形式配列',
  },

  // 複合ケース
  {
    input: 'name=john&active=true&tags=a,b&ids[]=1&ids[]=2',
    expected: { name: 'john', active: true, tags: ['a', 'b'], ids: ['1', '2'] },
    description: '複合ケース',
  },
] as const

/**
 * シリアライズ用テストケース
 * オブジェクト → URL
 */
export const stringifyTestCases = [
  // 基本
  {
    input: { foo: 'bar' },
    expected: '?foo=bar',
    description: '単一パラメータ',
  },
  {
    input: { foo: 'bar', baz: 'qux' },
    expected: '?foo=bar&baz=qux',
    description: '複数パラメータ',
  },
  { input: {}, expected: '', description: '空オブジェクトは空文字列' },

  // 数値・文字列
  { input: { count: 123 }, expected: '?count=123', description: '数値' },
  {
    input: { code: '123' },
    expected: '?code=123',
    description: '文字列（クォートなし）',
  },

  // Boolean
  { input: { active: true }, expected: '?active=true', description: 'true' },
  { input: { active: false }, expected: '?active=false', description: 'false' },

  // 配列
  {
    input: { ids: ['1', '2', '3'] },
    expected: '?ids=1%2C2%2C3',
    description: '配列はカンマ区切り',
  },
  {
    input: { ids: ['1'] },
    expected: '?ids=1',
    description: '要素1つの配列',
  },
  { input: { ids: [] }, expected: '?ids=', description: '空配列は空値' },

  // undefined/null
  {
    input: { foo: 'bar', baz: undefined },
    expected: '?foo=bar',
    description: 'undefined除外',
  },
  {
    input: { foo: 'bar', baz: null },
    expected: '?foo=bar',
    description: 'null除外',
  },
  {
    input: { foo: undefined, bar: null },
    expected: '',
    description: '全てundefined/nullは空文字列',
  },

  // URLエンコード
  {
    input: { name: '太郎' },
    expected: '?name=%E5%A4%AA%E9%83%8E',
    description: '日本語エンコード',
  },
  {
    input: { query: 'a&b=c' },
    expected: '?query=a%26b%3Dc',
    description: '特殊文字エンコード',
  },
  {
    input: { name: 'hello world' },
    expected: '?name=hello+world',
    description: 'スペースエンコード',
  },

  // ネストしたオブジェクト
  {
    input: { user: { name: 'john' } },
    expected: '?user%5Bname%5D=john',
    description: 'ネストしたオブジェクト（Rails形式）',
  },
  {
    input: { user: { address: { city: 'tokyo' } } },
    expected: '?user%5Baddress%5D%5Bcity%5D=tokyo',
    description: '深いネスト',
  },

  // 配列内オブジェクト
  {
    input: { items: [{ name: 'apple' }] },
    expectedContains: ['items%5B0%5D%5Bname%5D=apple'],
    description: '配列内オブジェクト',
  },
  {
    input: { items: [{ name: 'apple' }, { name: 'banana' }] },
    expectedContains: [
      'items%5B0%5D%5Bname%5D=apple',
      'items%5B1%5D%5Bname%5D=banana',
    ],
    description: '複数オブジェクトの配列',
  },
  {
    input: { items: [{ name: 'apple', price: '100' }] },
    expectedContains: [
      'items%5B0%5D%5Bname%5D=apple',
      'items%5B0%5D%5Bprice%5D=100',
    ],
    description: '複数プロパティの配列内オブジェクト',
  },
] as const

/**
 * ラウンドトリップ用テストケース
 * stringify → parse で同じ結果になることを確認
 */
export const roundTripTestCases = [
  { data: { foo: 'bar' }, description: '基本的な文字列' },
  { data: { active: true }, description: 'boolean true' },
  { data: { active: false }, description: 'boolean false' },
  { data: { ids: ['1', '2', '3'] }, description: '配列' },
  { data: { user: { name: 'john' } }, description: 'ネストしたオブジェクト' },
  { data: { name: '太郎' }, description: '日本語' },
  {
    data: { foo: 'bar', active: true, ids: ['1', '2'] },
    description: '複合ケース',
  },
] as const
