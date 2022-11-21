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
exports.readAllLists = void 0;
const db_1 = require("../../db/db");
const schemes_1 = require("../../validation/schemes");
const readAllLists = (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    const { login } = ctx.state;
    const { userName } = ctx.params;
    const badValue = (0, schemes_1.validRequiredString)(userName, 'userName');
    if (badValue) {
        ctx.status = 406;
        ctx.body = badValue;
        return;
    }
    yield db_1.db.lists
        .findMany({
        where: {
            users: { login: userName },
            OR: [
                {
                    OR: [
                        { list_rule: { allowed_to_read: true } },
                        { list_rule: { allowed_to_create: true } },
                        { list_rule: { allowed_to_update: true } },
                        { list_rule: { allowed_to_delete: true } },
                    ],
                },
                { users: { login } },
            ],
        },
    })
        .then((res) => __awaiter(void 0, void 0, void 0, function* () {
        yield db_1.db.$disconnect();
        if (!res.length)
            ctx.status = 404;
        ctx.body = res;
    }))
        .catch((e) => __awaiter(void 0, void 0, void 0, function* () {
        yield db_1.db.$disconnect();
        ctx.status = 400;
        ctx.body = `lists lookup failed`;
    }));
});
exports.readAllLists = readAllLists;
//# sourceMappingURL=readAllLists.js.map