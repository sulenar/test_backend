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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userController = void 0;
const db_1 = require("../../db/db");
const md5_1 = __importDefault(require("crypto-js/md5"));
const schemes_1 = require("../../validation/schemes");
class User {
    registration(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            const { login, password } = ctx.request.body;
            const wrongData = (0, schemes_1.validObject)({ login, password });
            if (wrongData) {
                ctx.status = 406;
                ctx.body = wrongData;
                return;
            }
            yield db_1.db.users
                .create({
                data: {
                    login,
                    hashed_password: (0, md5_1.default)(password).toString(),
                },
            })
                .then(() => __awaiter(this, void 0, void 0, function* () {
                yield db_1.db.$disconnect();
                ctx.body = `user ${login} created`;
            }))
                .catch((e) => __awaiter(this, void 0, void 0, function* () {
                yield db_1.db.$disconnect();
                ctx.throw(400, `user ${login} already exists`);
            }));
        });
    }
    login(ctx, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { authorization } = ctx.request.header;
            let logAndPass = '';
            if (authorization && /Basic \w+/.test(authorization)) {
                const [, hash] = authorization.split(' ');
                const decryptedHash = Buffer.from(hash, 'base64').toString();
                if (/\w+:\w+/.test(decryptedHash))
                    logAndPass = decryptedHash;
            }
            if (!logAndPass)
                ctx.throw(401);
            const [login, password] = logAndPass.split(':');
            yield db_1.db.users
                .findFirst({
                where: {
                    AND: {
                        login: { equals: login },
                        hashed_password: (0, md5_1.default)(password).toString(),
                    },
                },
            })
                .then((user) => __awaiter(this, void 0, void 0, function* () {
                if (user) {
                    ctx.state.id = user.id;
                    ctx.state.login = user.login;
                    yield next();
                    return;
                }
                ctx.status = 401;
            }))
                .catch((e) => __awaiter(this, void 0, void 0, function* () {
                yield db_1.db.$disconnect();
                ctx.status = 400;
                ctx.body = 'Authorization failed';
            }));
        });
    }
}
exports.userController = new User();
//# sourceMappingURL=userController.js.map