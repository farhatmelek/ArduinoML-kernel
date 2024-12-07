import fs from 'fs';
import { CompositeGeneratorNode, NL, toString } from 'langium';
import path from 'path';
import { Action, Actuator, App, Condition,SimpleCondition,MultipleCondition, LogicalOperator, Sensor, State, Transition, isSimpleCondition, isMultipleCondition, isException, Exception} from '../language-server/generated/ast';
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
		for(const transition of state.transitions){
			if (transition!== null){
				compileTransition(transition, fileNode)
			}
		}
		
		fileNode.append(`
				\tbreak;`)
    }
	

	function compileAction(action: Action, fileNode:CompositeGeneratorNode) {
		if (isException(action)){
			compileException(action, fileNode)

		}
		else{
			fileNode.append(`
				\tdigitalWrite(`+action.actuator.ref?.outputPin+`,`+action.value.value+`);`)
		}
		
	}

	function compileException(exception: Exception, fileNode:CompositeGeneratorNode) {
		const actuator = exception.actuator.ref;
		const pauseTime = exception.pauseTime
		const errorNumber = exception.errorNumber;
		if (actuator) {
			fileNode.append(`
					// Gestion de l'exception : Actuator ${actuator.name} - Erreur ${errorNumber}
					for (int i = 0; i < ${errorNumber}; i++) {
						digitalWrite(${actuator.outputPin}, HIGH);
						delay(500);
						digitalWrite(${actuator.outputPin}, LOW);  
						delay(500);  
					}

					// Mettre en pause après les clignotements
					delay(${pauseTime}); 
			
			`);
		} else {
			throw new Error("Actuator is undefined.");
		}		
	}

	function compileTransition(transition: Transition, fileNode: CompositeGeneratorNode) {
		if (!transition.condition) {
			throw new Error("Transition must have one condition.");
		}
		const sensorName = isSimpleCondition(transition.condition)
		? (transition.condition as SimpleCondition).sensor.ref?.name
		: "compoundCondition";

		
		fileNode.append(`\n\t\t\t\t\tconst ${sensorName}BounceGuard = millis() - ${sensorName}LastDebounceTime > debounce;\n`);
		fileNode.append(`\t\t\t\t\tif ( `);
		compileCondition(transition.condition, fileNode);
		fileNode.append(`\t\t\t && ${sensorName}BounceGuard) {\n`);
		fileNode.append(`\t\t\t\t\t\t${sensorName}LastDebounceTime = millis();\n`);
		fileNode.append(`\t\t\t\t\t\tcurrentState = ${transition.next.ref?.name};\n`);
		fileNode.append(`\t\t\t\t\t}\n`)

	
	}

	function compileCondition(condition: Condition, fileNode: CompositeGeneratorNode) {
		if (isSimpleCondition(condition)) {
			compileSimpleCondition(condition, fileNode);
		} else if (isMultipleCondition(condition)) {
			compileMultipleCondition(condition, fileNode);
		} else {
			throw new Error("Invalid condition: missing simpleCondition or multipleCondition.");
		}

	}

	function compileSimpleCondition(condition: SimpleCondition, fileNode: CompositeGeneratorNode) {
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

	function compileMultipleCondition(condition: MultipleCondition, fileNode: CompositeGeneratorNode) {
		const conditionStrings: string[] = [];
		for (const cond of condition.conditions) {
			const conditionNode = new CompositeGeneratorNode();
			compileCondition(cond, conditionNode);
			conditionStrings.push(toString(conditionNode));
		}
	
		let combinedConditions = conditionStrings[0];
	
		for (let i = 1; i < conditionStrings.length; i++) {
			const operator = condition.operator; 
			const operatorString = getLogicalOperatorString(operator);
			combinedConditions += `${operatorString} ${conditionStrings[i]}`;
		}
	
		fileNode.append(`
					(${combinedConditions}) 
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
	
	/*function generateCondition(condition: Condition, fileNode: CompositeGeneratorNode): string {
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
	}*/
	