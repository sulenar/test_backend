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
exports.readList = void 0;
const db_1 = require("../../db/db");
const schemes_1 = require("../../validation/schemes");
const readList = (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    const { listName, userName } = ctx.query;
    const { login } = ctx.state;
    const badData = (0, schemes_1.validObject)({ listName, userName });
    if (badData) {
        ctx.status = 406;
        ctx.body = badData;
        return;
    }
    yield db_1.db.lists
        .findFirst({
        where: {
            list_name: listName,
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
        if (!res) {
            ctx.status = 404;
            ctx.body = 'List not found';
            return;
        }
        ctx.body = res;
    }))
        .catch(() => __awaiter(void 0, void 0, void 0, function* () {
        yield db_1.db.$disconnect();
        ctx.status = 400;
        ctx.body = `list lookup failed`;
    }));
});
exports.readList = readList;
//# sourceMappingURL=readList.js.map