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
exports.createList = void 0;
const db_1 = require("../../db/db");
const schemes_1 = require("../../validation/schemes");
const createList = (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    const { listName } = ctx.request.body;
    const badValue = (0, schemes_1.validRequiredString)(listName, 'listName');
    if (badValue) {
        ctx.status = 406;
        ctx.body = badValue;
        return;
    }
    const alreadyExsists = yield db_1.db.lists
        .findFirst({
        where: {
            list_name: listName,
            user_id: ctx.state.id,
        },
    })
        .then((res) => res)
        .catch(() => __awaiter(void 0, void 0, void 0, function* () {
        return null;
    }));
    if (alreadyExsists) {
        yield db_1.db.$disconnect();
        ctx.status = 400;
        ctx.body = `list ${listName} already exists for this user`;
        return;
    }
    yield db_1.db.lists
        .create({
        data: {
            list_name: listName,
            user_id: ctx.state.id,
            list_rule: {
                create: {
                    allowed_to_create: false,
                    allowed_to_read: false,
                    allowed_to_update: false,
                    allowed_to_delete: false,
                },
            },
        },
    })
        .then(() => __awaiter(void 0, void 0, void 0, function* () {
        yield db_1.db.$disconnect();
        ctx.body = `taskList ${listName} created`;
    }))
        .catch((e) => __awaiter(void 0, void 0, void 0, function* () {
        yield db_1.db.$disconnect();
        ctx.status = 400;
        ctx.body = `creating list failed`;
    }));
});
exports.createList = createList;
//# sourceMappingURL=createList.js.map