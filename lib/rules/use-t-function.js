/**
 * @fileoverview use t function
 * @author wangkailang
 */
"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

const SYMBOL_REGEX = /[\u3002\uff1b\uff0c\uff1a\u201c\u201d\uff08\uff09\u3001\uff1f\u300a\u300b]/;
const WORD_REGEX = /[\u3400-\u9FBF]/;

module.exports = {
  meta: {
    type: null, // `problem`, `suggestion`, or `layout`
    docs: {
      description: "中文需要用 t 函数包裹",
      category: "Fill me in",
      recommended: false,
      url: null, // URL to the documentation page for this rule
    },
    fixable: null, // Or `code` or `whitespace`
    schema: [], // Add a schema if the rule has options
  },

  create(context) {
    // variables should be defined here

    //----------------------------------------------------------------------
    // Helpers
    //----------------------------------------------------------------------

    function containChinese(value) {
      return WORD_REGEX.test(value) || SYMBOL_REGEX.test(value);
    }

    // any helper functions should go here or else delete this section

    //----------------------------------------------------------------------
    // Public
    //----------------------------------------------------------------------

    return {
      // visitor functions for different types of nodes
      JSXText: node => {
        const { value } = node;
        if (containChinese(value)) {
          context.report({
            node,
            message: '{{ str }} 是中文, 需要用 t 函数',
            data: {
              str: node.value,
            },
          });
        }
      },
      ExpressionStatement: node => {
        const { name, type } = node.expression;
        if ((type === 'Identifier' && containChinese(name))) {
          context.report({
            node,
            message: '{{ str }} 是中文, 需要用 t 函数',
            data: {
              str: name,
            },
          });
        }
      },
      CallExpression: node => {
        const { name, type } = node.callee;
        if (type === 'Identifier' && name === 't') {
          if (!node.arguments.length) {
            context.report({
              node: node,
              message: 't 函数参数不能为空'
            });
          } else {
            const firstArg= node.arguments[0];
            if (
              !(firstArg.type === 'MemberExpression' &&
              firstArg.object &&
              firstArg.object.type === 'Identifier' &&
              firstArg.object.name === 'Strings')
            ) {
              context.report({
                node: node,
                message: 't 函数第一个参数必须从 Strings 对象中取值'
              });
            }
          }
        }
      }
    };
  },
};
