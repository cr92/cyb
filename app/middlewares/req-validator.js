'use strict';
const Ajv = require('ajv');
const ajv = new Ajv()

function addItemReqValidator(req, res, next) {
    const addItemReqValidatorSchema = {
        "$schema": "http://json-schema.org/draft-07/schema#",
        "type": "object",
        "required": [
            "name",
            "price"
        ],
        "properties": {
            "name": {
                "type": "string",
            },
            "price": {
                "type": "integer",
            }
        },
        "additionalProperties": false
    };
    const valid = ajv.validate(addItemReqValidatorSchema, req.body);
    if (!valid) {
        throw new Error("Invalid Request Body");
    }
    next();
}

function createCartReqValidator(req, res, next) {
    const createCartReqValidatorSchema = {
        "$schema": "http://json-schema.org/draft-07/schema#",
        "type": "object",
        "required": [
            "itemId"
        ],
        "properties": {
            "itemId": {
                "type": "string",
            }
        },
        "additionalProperties": false
    };
    const valid = ajv.validate(createCartReqValidatorSchema, req.body);
    if (!valid) {
        throw new Error("Invalid Request Body");
    }
    next();
}

function addToCartReqValidator(req, res, next) {
    const addToCartReqValidatorSchema = {
        "$schema": "http://json-schema.org/draft-07/schema#",
        "type": "object",
        "required": [
            "itemId",
            "cartId"
        ],
        "properties": {
            "itemId": {
                "type": "string",
            },
            "cartId": {
                "type": "string",
            }
        },
        "additionalProperties": false
    };
    const valid = ajv.validate(addToCartReqValidatorSchema, req.body);
    if (!valid) {
        throw new Error("Invalid Request Body");
    }
    next();
}

module.exports = {
    addItemReqValidator,
    createCartReqValidator,
    addToCartReqValidator
}