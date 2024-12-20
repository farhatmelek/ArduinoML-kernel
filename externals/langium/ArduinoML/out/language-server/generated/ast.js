"use strict";
/******************************************************************************
 * This file was generated by langium-cli 1.0.0.
 * DO NOT EDIT MANUALLY!
 ******************************************************************************/
Object.defineProperty(exports, "__esModule", { value: true });
exports.reflection = exports.ArduinoMlAstReflection = exports.isException = exports.Exception = exports.isTransition = exports.Transition = exports.isTemporalCondition = exports.TemporalCondition = exports.isState = exports.State = exports.isSimpleCondition = exports.SimpleCondition = exports.isSignal = exports.Signal = exports.isSensor = exports.Sensor = exports.isMultipleCondition = exports.MultipleCondition = exports.isLogicalOperator = exports.LogicalOperator = exports.isApp = exports.App = exports.isActuator = exports.Actuator = exports.isAction = exports.Action = exports.isCondition = exports.Condition = exports.isBrick = exports.Brick = void 0;
/* eslint-disable */
const langium_1 = require("langium");
exports.Brick = 'Brick';
function isBrick(item) {
    return exports.reflection.isInstance(item, exports.Brick);
}
exports.isBrick = isBrick;
exports.Condition = 'Condition';
function isCondition(item) {
    return exports.reflection.isInstance(item, exports.Condition);
}
exports.isCondition = isCondition;
exports.Action = 'Action';
function isAction(item) {
    return exports.reflection.isInstance(item, exports.Action);
}
exports.isAction = isAction;
exports.Actuator = 'Actuator';
function isActuator(item) {
    return exports.reflection.isInstance(item, exports.Actuator);
}
exports.isActuator = isActuator;
exports.App = 'App';
function isApp(item) {
    return exports.reflection.isInstance(item, exports.App);
}
exports.isApp = isApp;
exports.LogicalOperator = 'LogicalOperator';
function isLogicalOperator(item) {
    return exports.reflection.isInstance(item, exports.LogicalOperator);
}
exports.isLogicalOperator = isLogicalOperator;
exports.MultipleCondition = 'MultipleCondition';
function isMultipleCondition(item) {
    return exports.reflection.isInstance(item, exports.MultipleCondition);
}
exports.isMultipleCondition = isMultipleCondition;
exports.Sensor = 'Sensor';
function isSensor(item) {
    return exports.reflection.isInstance(item, exports.Sensor);
}
exports.isSensor = isSensor;
exports.Signal = 'Signal';
function isSignal(item) {
    return exports.reflection.isInstance(item, exports.Signal);
}
exports.isSignal = isSignal;
exports.SimpleCondition = 'SimpleCondition';
function isSimpleCondition(item) {
    return exports.reflection.isInstance(item, exports.SimpleCondition);
}
exports.isSimpleCondition = isSimpleCondition;
exports.State = 'State';
function isState(item) {
    return exports.reflection.isInstance(item, exports.State);
}
exports.isState = isState;
exports.TemporalCondition = 'TemporalCondition';
function isTemporalCondition(item) {
    return exports.reflection.isInstance(item, exports.TemporalCondition);
}
exports.isTemporalCondition = isTemporalCondition;
exports.Transition = 'Transition';
function isTransition(item) {
    return exports.reflection.isInstance(item, exports.Transition);
}
exports.isTransition = isTransition;
exports.Exception = 'Exception';
function isException(item) {
    return exports.reflection.isInstance(item, exports.Exception);
}
exports.isException = isException;
class ArduinoMlAstReflection extends langium_1.AbstractAstReflection {
    getAllTypes() {
        return ['Action', 'Actuator', 'App', 'Brick', 'Condition', 'Exception', 'LogicalOperator', 'MultipleCondition', 'Sensor', 'Signal', 'SimpleCondition', 'State', 'TemporalCondition', 'Transition'];
    }
    computeIsSubtype(subtype, supertype) {
        switch (subtype) {
            case exports.Actuator:
            case exports.Sensor: {
                return this.isSubtype(exports.Brick, supertype);
            }
            case exports.MultipleCondition:
            case exports.SimpleCondition:
            case exports.TemporalCondition: {
                return this.isSubtype(exports.Condition, supertype);
            }
            case exports.Exception: {
                return this.isSubtype(exports.Action, supertype);
            }
            default: {
                return false;
            }
        }
    }
    getReferenceType(refInfo) {
        const referenceId = `${refInfo.container.$type}:${refInfo.property}`;
        switch (referenceId) {
            case 'Action:actuator':
            case 'Exception:actuator':
            case 'Exception:actuator': {
                return exports.Actuator;
            }
            case 'App:initial':
            case 'Transition:next': {
                return exports.State;
            }
            case 'SimpleCondition:sensor': {
                return exports.Sensor;
            }
            default: {
                throw new Error(`${referenceId} is not a valid reference id.`);
            }
        }
    }
    getTypeMetaData(type) {
        switch (type) {
            case 'App': {
                return {
                    name: 'App',
                    mandatory: [
                        { name: 'bricks', type: 'array' },
                        { name: 'states', type: 'array' }
                    ]
                };
            }
            case 'MultipleCondition': {
                return {
                    name: 'MultipleCondition',
                    mandatory: [
                        { name: 'conditions', type: 'array' },
                        { name: 'operator', type: 'array' }
                    ]
                };
            }
            case 'State': {
                return {
                    name: 'State',
                    mandatory: [
                        { name: 'actions', type: 'array' },
                        { name: 'transitions', type: 'array' }
                    ]
                };
            }
            default: {
                return {
                    name: type,
                    mandatory: []
                };
            }
        }
    }
}
exports.ArduinoMlAstReflection = ArduinoMlAstReflection;
exports.reflection = new ArduinoMlAstReflection();
//# sourceMappingURL=ast.js.map