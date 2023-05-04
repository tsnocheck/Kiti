"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Command = void 0;
;
;
class Command {
    constructor(input) {
        this.command_data = input['command_data'];
        this.options_data = input['options_data'];
        this.run = input['run'];
        return this;
    }
    ;
}
exports.Command = Command;
