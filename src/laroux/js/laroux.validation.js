/*jslint node: true */
'use strict';

import helpers from './laroux.helpers.js';

let validation = {
    // TODO: email, date, equalTo
    rules: {
        required: {
            keys: ['message'],
            callback: function (dictionary, name, rule) {
                return (name in dictionary);
            }
        },

        minlength: {
            keys: ['length', 'message'],
            callback: function (dictionary, name, rule) {
                return (dictionary[name].length >= rule.length);
            }
        },

        maxlength: {
            keys: ['length', 'message'],
            callback: function (dictionary, name, rule) {
                return (dictionary[name].length <= rule.length);
            }
        },

        min: {
            keys: ['value', 'message'],
            callback: function (dictionary, name, rule) {
                let floatValue = parseFloat(dictionary[name]);
                return (floatValue >= rule.value);
            }
        },

        max: {
            keys: ['value', 'message'],
            callback: function (dictionary, name, rule) {
                let floatValue = parseFloat(dictionary[name]);
                return (floatValue <= rule.value);
            }
        }
    },

    // {rule: 'required', message: 'isrequired'}
    // 'required'

    // {
    //    'name': 'required',
    //    'age': [
    //        'required|The field is required.',
    //        { rule: 'range', min: 10, max: 18 },
    //    ]
    // }

    validate: function (fields, rules) {
        let rulesKeys = Object.keys(rules),
            result = {
                success: true,
                details: {}
            };

        for (let i = 0, length = rulesKeys.length; i < length; i++) {
            let key = rulesKeys[i],
                rule = rules[key];

            let fieldRules = helpers.getAsArray(rule);
            for (let j = 0, length2 = fieldRules.length; j < length2; j++) {
                let fieldRule = fieldRules[j];

                if (fieldRule.constructor !== Object) {
                    let fieldRuleSplitted = fieldRule.split('|'),
                        fieldRuleName = fieldRuleSplitted[0];

                    fieldRule = helpers.assign(fieldRuleSplitted, ['name'].concat(validation.rules[fieldRuleName].keys));
                }

                if (!validation.rules[fieldRule.name].callback(fields, key, fieldRule)) {
                    result.success = false;

                    if (!(key in result.details)) {
                        result.details[key] = [];
                    }

                    result.details[key].push(fieldRule);
                }
            }
        }

        return result;
    }
};

export default validation;
