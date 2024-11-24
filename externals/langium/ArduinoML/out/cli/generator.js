"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateInoFile = void 0;
const fs_1 = __importDefault(require("fs"));
const langium_1 = require("langium");
const path_1 = __importDefault(require("path"));
const cli_util_1 = require("./cli-util");
function generateInoFile(app, filePath, destination) {
    const data = (0, cli_util_1.extractDestinationAndName)(filePath, destination);
    const generatedFilePath = `${path_1.default.join(data.destination, data.name)}.ino`;
    const fileNode = new langium_1.CompositeGeneratorNode();
    compile(app, fileNode);
    if (!fs_1.default.existsSync(data.destination)) {
        fs_1.default.mkdirSync(data.destination, { recursive: true });
    }
    fs_1.default.writeFileSync(generatedFilePath, (0, langium_1.toString)(fileNode));
    return generatedFilePath;
}
exports.generateInoFile = generateInoFile;
function compile(app, fileNode) {
    var _a;
    fileNode.append(`
//Wiring code generated from an ArduinoML model
// Application name: ` + app.name + `

long debounce = 200;
enum STATE {` + app.states.map(s => s.name).join(', ') + `};

STATE currentState = ` + ((_a = app.initial.ref) === null || _a === void 0 ? void 0 : _a.name) + `;`, langium_1.NL);
    for (const brick of app.bricks) {
        if ("inputPin" in brick) {
            fileNode.append(`
bool ` + brick.name + `BounceGuard = false;
long ` + brick.name + `LastDebounceTime = 0;

            `, langium_1.NL);
        }
    }
    fileNode.append(`
	void setup(){`);
    for (const brick of app.bricks) {
        if ("inputPin" in brick) {
            compileSensor(brick, fileNode);
        }
        else {
            compileActuator(brick, fileNode);
        }
    }
    fileNode.append(`
	}
	void loop() {
			switch(currentState){`, langium_1.NL);
    for (const state of app.states) {
        compileState(state, fileNode);
    }
    fileNode.append(`
		}
	}
	`, langium_1.NL);
}
function compileActuator(actuator, fileNode) {
    fileNode.append(`
		pinMode(` + actuator.outputPin + `, OUTPUT); // ` + actuator.name + ` [Actuator]`);
}
function compileSensor(sensor, fileNode) {
    fileNode.append(`
		pinMode(` + sensor.inputPin + `, INPUT); // ` + sensor.name + ` [Sensor]`);
}
function compileState(state, fileNode) {
    fileNode.append(`
				case ` + state.name + `:`);
    for (const action of state.actions) {
        compileAction(action, fileNode);
    }
    if (state.transition !== null) {
        compileTransition(state.transition, fileNode);
    }
    fileNode.append(`
				break;`);
}
function compileAction(action, fileNode) {
    var _a;
    fileNode.append(`
					digitalWrite(` + ((_a = action.actuator.ref) === null || _a === void 0 ? void 0 : _a.outputPin) + `,` + action.value.value + `);`);
}
function compileTransition(transition, fileNode) {
    var _a;
    if (transition.conditions.length === 0) {
        throw new Error("Transition must have at least one condition.");
    }
    // Générer les conditions combinées
    const conditionStrings = transition.conditions.map((condition) => generateCondition(condition, fileNode));
    // Initialiser la chaîne de conditions combinées
    let combinedConditions = conditionStrings[0];
    // Traiter les opérateurs logiques pour combiner les conditions
    for (let i = 1; i < conditionStrings.length; i++) {
        const operator = transition.operator[i - 1]; // L'opérateur entre les conditions (AND, OR, etc.)
        const operatorString = getLogicalOperatorString(operator); // Convertir l'opérateur en chaîne de caractères
        combinedConditions += `\t\t\t\t${operatorString} ${conditionStrings[i]}`;
    }
    fileNode.append(`
					if (${combinedConditions}) {
						currentState = ${(_a = transition.next.ref) === null || _a === void 0 ? void 0 : _a.name};
					}
		`);
}
function getLogicalOperatorString(operator) {
    if (operator.AND) {
        return '&&';
    }
    else if (operator.OR) {
        return '||';
    }
    else if (operator.XOR) {
        return '^';
    }
    else {
        throw new Error(`Unsupported logical operator: ${operator}`);
    }
}
function generateCondition(condition, fileNode) {
    const sensor = condition.sensor.ref;
    const value = condition.value.value;
    if (!sensor || sensor.inputPin === undefined || value === undefined) {
        throw new Error("Invalid condition: missing sensor reference, input pin, or value.");
    }
    const sensorName = sensor.name;
    const inputPin = sensor.inputPin;
    return `
						(millis() - ${sensorName}LastDebounceTime > debounce &&
						digitalRead(${inputPin}) == ${value})
		`;
}
//# sourceMappingURL=generator.js.map