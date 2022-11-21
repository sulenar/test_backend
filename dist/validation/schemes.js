"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validBodyRule = exports.validRequiredString = exports.validObject = void 0;
const joi_1 = __importDefault(require("joi"));
const validObject = (data) => {
    const objForSchema = Object.fromEntries(Object.entries(data).map(([key, value]) => {
        return key === 'id'
            ? [key, joi_1.default.number().required()]
            : [key, joi_1.default.string().required()];
    }));
    const schema = joi_1.default.object(objForSchema);
    const validation = schema.validate(data);
    const { error } = validation;
    if (error)
        return error.message;
    return;
};
exports.validObject = validObject;
const validRequiredString = (str, name) => {
    const validation = joi_1.default.string().required().validate(str);
    const { error } = validation;
    if (error)
        return error.message.replace('value', name);
    return;
};
exports.validRequiredString = validRequiredString;
const validBodyRule = (data) => {
    const schema = joi_1.default.object({
        listName: joi_1.default.string().required(),
        rule: {
            name: joi_1.default.string().required(),
            value: joi_1.default.boolean().required(),
        },
    });
    const validation = schema.validate(data);
    const { error } = validation;
    if (error)
        return error.message;
    return;
};
exports.validBodyRule = validBodyRule;
//# sourceMappingURL=schemes.js.map