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
exports.generateAction = void 0;
const chalk_1 = __importDefault(require("chalk"));
const commander_1 = require("commander");
const module_1 = require("../language-server/generated/module");
const arduino_ml_module_1 = require("../language-server/arduino-ml-module");
const cli_util_1 = require("./cli-util");
const generator_1 = require("./generator");
const node_1 = require("langium/node");
const generateAction = (fileName, opts) => __awaiter(void 0, void 0, void 0, function* () {
    const services = (0, arduino_ml_module_1.createArduinoMlServices)(node_1.NodeFileSystem).ArduinoMl;
    const app = yield (0, cli_util_1.extractAstNode)(fileName, services);
    const generatedFilePath = (0, generator_1.generateInoFile)(app, fileName, opts.destination);
    console.log(chalk_1.default.green(`Arduino code generated successfully: ${generatedFilePath}`));
});
exports.generateAction = generateAction;
function default_1() {
    const program = new commander_1.Command();
    program
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        .version(require('../../package.json').version);
    const fileExtensions = module_1.ArduinoMlLanguageMetaData.fileExtensions.join(', ');
    program
        .command('generate')
        .argument('<file>', `source file (possible file extensions: ${fileExtensions})`)
        .option('-d, --destination <dir>', 'destination directory of generating')
        .description('generates .ino code from ArduinoML model')
        .action(exports.generateAction);
    program.parse(process.argv);
}
exports.default = default_1;
//# sourceMappingURL=index.js.map