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
exports.deleteTask = void 0;
const db_1 = require("../../db/db");
const schemes_1 = require("../../validation/schemes");
const deleteTask = (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    const { id, userName, listName } = ctx.query;
    const { login } = ctx.state;
    const badData = (0, schemes_1.validObject)({ id, userName, listName });
    if (badData) {
        ctx.status = 406;
        ctx.body = badData;
        return;
    }
    yield db_1.db.tasks
        .deleteMany({
        where: {
            id: +id,
            lists: { users: { login: userName }, list_name: listName },
            OR: [
                { lists: { list_rule: { allowed_to_delete: true } } },
                { lists: { users: { login } } },
            ],
        },
    })
        .then(() => __awaiter(void 0, void 0, void 0, function* () {
        yield db_1.db.$disconnect();
        ctx.body = 'Task deleted';
    }))
        .catch(() => __awaiter(void 0, void 0, void 0, function* () {
        yield db_1.db.$disconnect();
        ctx.status = 400;
        ctx.body = `task update failed`;
    }));
});
exports.deleteTask = deleteTask;
//# sourceMappingURL=deleteTask.js.map