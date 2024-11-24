import fs from 'fs';
import { CompositeGeneratorNode, NL, toString } from 'langium';
import path from 'path';
import { Action, Actuator, App, Condition, LogicalOperator, Sensor, State, Transition} from '../language-server/generated/ast';
import { extractDestinationAndName } from './cli-util';

export function generateInoFile(app: App, filePath: string, destination: string | undefined): string {
    const data = extractDestinationAndName(filePath, destination);
    const generatedFilePath = `${path.join(data.destination, data.name)}.ino`;

    const fileNode = new CompositeGeneratorNode();
    compile(app,fileNode)
    
    
    if (!fs.existsSync(data.destination)) {
        fs.mkdirSync(data.destination, { recursive: true });
    }
    fs.writeFileSync(generatedFilePath, toString(fileNode));
    return generatedFilePath;
}


function compile(app:App, fileNode:CompositeGeneratorNode){
    fileNode.append(
	`
//Wiring code generated from an ArduinoML model
// Application name: `+app.name+`

long debounce = 200;
enum STATE {`+app.states.map(s => s.name).join(', ')+`};

STATE currentState = `+app.initial.ref?.name+`;`
    ,NL);
	
    for(const brick of app.bricks){
        if ("inputPin" in brick){
            fileNode.append(`
bool `+brick.name+`BounceGuard = false;
long `+brick.name+`LastDebounceTime = 0;

            `,NL);
        }
    }
    fileNode.append(`
	void setup(){`);
    for(const brick of app.bricks){
        if ("inputPin" in brick){
       		compileSensor(brick,fileNode);
		}else{
            compileActuator(brick,fileNode);
        }
	}


    fileNode.append(`
	}
	void loop() {
			switch(currentState){`,NL)
			for(const state of app.states){
				compileState(state, fileNode)
            }
	fileNode.append(`
		}
	}
	`,NL);




    }

	function compileActuator(actuator: Actuator, fileNode: CompositeGeneratorNode) {
        fileNode.append(`
		pinMode(`+actuator.outputPin+`, OUTPUT); // `+actuator.name+` [Actuator]`)
    }

	function compileSensor(sensor:Sensor, fileNode: CompositeGeneratorNode) {
    	fileNode.append(`
		pinMode(`+sensor.inputPin+`, INPUT); // `+sensor.name+` [Sensor]`)
	}

    function compileState(state: State, fileNode: CompositeGeneratorNode) {
        fileNode.append(`
				case `+state.name+`:`)
		for(const action of state.actions){
			compileAction(action, fileNode)
		}
		if (state.transition !== null){
			compileTransition(state.transition, fileNode)
		}
		fileNode.append(`
				break;`)
    }
	

	function compileAction(action: Action, fileNode:CompositeGeneratorNode) {
		fileNode.append(`
					digitalWrite(`+action.actuator.ref?.outputPin+`,`+action.value.value+`);`)
	}

	function compileTransition(transition: Transition, fileNode: CompositeGeneratorNode) {
		if (transition.conditions.length === 0) {
			throw new Error("Transition must have at least one condition.");
		}
	
		const conditionStrings = transition.conditions.map((condition) => generateCondition(condition, fileNode));
	
		let combinedConditions = conditionStrings[0];
	
		for (let i = 1; i < conditionStrings.length; i++) {
			const operator = transition.operator[i - 1]; 
			const operatorString = getLogicalOperatorString(operator);
			combinedConditions += `\t\t\t\t${operatorString} ${conditionStrings[i]}`;
		}
	
		fileNode.append(`
					if (${combinedConditions}) {
						currentState = ${transition.next.ref?.name};
					}
		`);
	}
	
	
	function getLogicalOperatorString(operator: LogicalOperator): string {
		if (operator.AND) {
			return '&&'; 
		} else if (operator.OR) {
			return '||'; 
		} else if (operator.XOR) {
			return '^'; 
		} else {
			throw new Error(`Unsupported logical operator: ${operator}`);
		}
	}
	
	function generateCondition(condition: Condition, fileNode: CompositeGeneratorNode): string {
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
	