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
exports.compileModules = void 0;
const fs = require("fs");
const path = require("path");
function compileModules(client) {
    return __awaiter(this, void 0, void 0, function* () {
        const moduleDir = path.join(__dirname, 'modules');
        const moduleFiles = fs
            .readdirSync(moduleDir, { withFileTypes: true })
            .filter(dirent => dirent.isDirectory())
            .map(dirent => dirent.name);
        for (const moduleName of moduleFiles) {
            const modulePath = path.join(moduleDir, moduleName, `${moduleName}.js`);
            if (!fs.existsSync(modulePath)) {
                console.warn(`Skipping module '${moduleName}', module file not found.`);
                continue;
            }
            try {
                const module = yield Promise.resolve(`${modulePath}`).then(s => require(s));
                if (typeof module.default === 'function') {
                    module.default(client);
                    console.log(`Loaded module '${moduleName}'`);
                }
                else {
                    console.warn(`Skipping module '${moduleName}', module file does not export a default function.`);
                }
            }
            catch (error) {
                console.error(`Error loading module '${moduleName}':`, error);
            }
        }
    });
}
exports.compileModules = compileModules;
