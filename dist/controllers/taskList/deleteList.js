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
exports.deleteList = void 0;
const db_1 = require("../../db/db");
const schemes_1 = require("../../validation/schemes");
const deleteList = (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    const { login } = ctx.state;
    const { listName } = ctx.params;
    const badValue = (0, schemes_1.validRequiredString)(listName, 'listName');
    if (badValue) {
        ctx.status = 406;
        ctx.body = badValue;
        return;
    }
    const deleteTasks = db_1.db.tasks.deleteMany({
        where: { lists: { list_name: listName, users: { login } } },
    });
    const deleteRules = db_1.db.rules.deleteMany({
        where: { lists: { list_name: listName, users: { login } } },
    });
    const deleteList = db_1.db.lists.deleteMany({
        where: { list_name: listName, users: { login } },
    });
    yield db_1.db
        .$transaction([deleteTasks, deleteRules, deleteList])
        .then((res) => __awaiter(void 0, void 0, void 0, function* () {
        yield db_1.db.$disconnect();
        ctx.body = res;
    }))
        .catch((e) => __awaiter(void 0, void 0, void 0, function* () {
        yield db_1.db.$disconnect();
        ctx.status = 400;
        ctx.body = `deleting failed`;
    }));
});
exports.deleteList = deleteList;
//# sourceMappingURL=deleteList.js.map