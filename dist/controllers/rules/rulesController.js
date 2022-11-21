"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.changeRule = void 0;
const db_1 = require("../../db/db");
const schemes_1 = require("../../validation/schemes");
const changeRule = (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    const { login } = ctx.state;
    const { listName, rule: { name, value }, } = ctx.request.body;
    const badData = (0, schemes_1.validBodyRule)(ctx.request.body);
    if (badData) {
        ctx.status = 406;
        ctx.body = badData;
        return;
    }
    const rule = {
        [name]: value,
    };
    yield db_1.db.rules
        .updateMany({
        where: { lists: { list_name: listName, users: { login } } },
        data: rule,
    })
        .then((res) => __awaiter(void 0, void 0, void 0, function* () {
        yield db_1.db.$disconnect();
        if (res.count) {
            ctx.body = 'Rules updated successfully';
            return;
        }
        ctx.status = 403;
        ctx.body =
            'You cannot change the rules of this list or list does not exist';
    }))
        .catch((e) => __awaiter(void 0, void 0, void 0, function* () {
        yield db_1.db.$disconnect();
        ctx.status = 400;
        ctx.body = `rule change failed`;
    }));
});
exports.changeRule = changeRule;
//# sourceMappingURL=rulesController.js.map