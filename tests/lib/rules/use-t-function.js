/**
 * @fileoverview use t function
 * @author wangkailang
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/use-t-function"),
  RuleTester = require("eslint").RuleTester;

const parserOptions = {
  ecmaVersion: 8,
  sourceType: 'module',
  ecmaFeatures: {
    experimentalObjectRestSpread: true,
    jsx: true
  }
};


//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({ parserOptions });
ruleTester.run("use-t-function", rule, {
  valid: [
    // give me some code that won't trigger a warning
    { code: '\'Not chinese string\'' },
    { code: 'const s = str => `string is ${str}`;' },
    { code: '<div>{t(Strings.hello)}</div>' }
  ],

  invalid: [
    {
      code: '你好',
      errors: [{
        message: "你好 是中文, 需要用 t 函数",
        type: "ExpressionStatement"
      }],
    },
    {
      code: '<div>{t()}</div>',
      errors: [{
        message: 't 函数参数不能为空'
      }]
    },
    {
      code: '<div>{t(string)}</div>',
      errors: [{
        message: 't 函数第一个参数必须从 Strings 对象中取值'
      }]
    },
    {
      code: '<div>你好</div>',
      errors: [{
        message: "你好 是中文, 需要用 t 函数",
        type: "JSXText"
      }],
    },
  ],
});
