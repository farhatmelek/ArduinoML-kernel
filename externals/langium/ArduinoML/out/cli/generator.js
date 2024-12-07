"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateInoFile = void 0;
const fs_1 = __importDefault(require("fs"));
const langium_1 = require("langium");
const path_1 = __importDefault(require("path"));
const ast_1 = require("../language-server/generated/ast");
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
bool compoundConditionBounceGuard = false; 
long compoundConditionLastDebounceTime = 0;
	`);
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
    for (const transition of state.transitions) {
        if (transition !== null) {
            compileTransition(transition, fileNode);
        }
    }
    fileNode.append(`
			\tbreak;`);
}
function compileAction(action, fileNode) {
    var _a;
    if ((0, ast_1.isException)(action)) {
        compileException(action, fileNode);
    }
    else {
        fileNode.append(`
			\tdigitalWrite(` + ((_a = action.actuator.ref) === null || _a === void 0 ? void 0 : _a.outputPin) + `,` + action.value.value + `);`);
    }
}
function compileException(exception, fileNode) {
    const actuator = exception.actuator.ref;
    const pauseTime = exception.pauseTime;
    const errorNumber = exception.errorNumber;
    if (actuator) {
        fileNode.append(`
				// Gestion de l'exception : ${actuator.name} - Erreur ${errorNumber}
				for (int i = 0; i < ${errorNumber}; i++) {
					digitalWrite(${actuator.outputPin}, HIGH);
					delay(500);
					digitalWrite(${actuator.outputPin}, LOW);  
					delay(500);  
				}

				// Mettre en pause après les clignotements
				delay(${pauseTime}); 
		
		`);
    }
    else {
        throw new Error("Actuator is undefined.");
    }
}
function compileTransition(transition, fileNode) {
    var _a, _b;
    if (!transition.condition) {
        throw new Error("Transition must have one condition.");
    }
    const sensorName = (0, ast_1.isSimpleCondition)(transition.condition)
        ? (_a = transition.condition.sensor.ref) === null || _a === void 0 ? void 0 : _a.name
        : "compoundCondition";
    fileNode.append(`\n\t\t\t\t${sensorName}BounceGuard = millis() - ${sensorName}LastDebounceTime > debounce;\n`);
    fileNode.append(`\n\t\t\t\tif ( `);
    compileCondition(transition.condition, fileNode);
    fileNode.append(`\t\t\t && ${sensorName}BounceGuard) {\n`);
    fileNode.append(`\t\t\t\t\t${sensorName}LastDebounceTime = millis();\n`);
    fileNode.append(`\t\t\t\t\tcurrentState = ${(_b = transition.next.ref) === null || _b === void 0 ? void 0 : _b.name};\n`);
    fileNode.append(`\t\t\t\t\t}\n`);
}
function compileCondition(condition, fileNode) {
    if ((0, ast_1.isSimpleCondition)(condition)) {
        compileSimpleCondition(condition, fileNode);
    }
    else if ((0, ast_1.isMultipleCondition)(condition)) {
        compileMultipleCondition(condition, fileNode);
    }
    else if ((0, ast_1.isTemporalCondition)(condition)) {
        compileTemporalCondition(condition, fileNode);
    }
    else {
        throw new Error("Invalid condition: missing simpleCondition or multipleCondition.");
    }
}
function compileSimpleCondition(condition, fileNode) {
    const sensor = condition.sensor.ref;
    const value = condition.value.value;
    if (!sensor || sensor.inputPin === undefined || value === undefined) {
        throw new Error("Invalid condition: missing sensor reference, input pin, or value.");
    }
    //const sensorName = sensor.name;
    const inputPin = sensor.inputPin;
    const conditionCode = `digitalRead(${inputPin}) == ${value}`;
    fileNode.append(conditionCode);
}
function compileMultipleCondition(condition, fileNode) {
    const conditionStrings = [];
    for (const cond of condition.conditions) {
        const conditionNode = new langium_1.CompositeGeneratorNode();
        compileCondition(cond, conditionNode);
        conditionStrings.push((0, langium_1.toString)(conditionNode));
    }
    let combinedConditions = conditionStrings[0];
    for (let i = 1; i < conditionStrings.length; i++) {
        const operator = condition.operator;
        const operatorString = getLogicalOperatorString(operator[i - 1]);
        combinedConditions += ` ${operatorString} ${conditionStrings[i]}`;
    }
    fileNode.append(`
				(${combinedConditions}) 
	`);
}
function compileTemporalCondition(condition, fileNode) {
    const innerConditionNode = new langium_1.CompositeGeneratorNode();
    compileCondition(condition.condition, innerConditionNode);
    const duration = condition.duration;
    const uniqueTimer = `timer_${Math.random().toString(36).substring(2)}`;
    fileNode.append(`
		static unsigned long ${uniqueTimer} = 0; // Timer for temporal condition
		if (${(0, langium_1.toString)(innerConditionNode)}) {
			if (${uniqueTimer} == 0) {
				${uniqueTimer} = millis(); // Start timer
			}
			if (millis() - ${uniqueTimer} >= ${duration}) {
				${uniqueTimer} = 0; // Reset timer
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
//# sourceMappingURL=generator.js.map