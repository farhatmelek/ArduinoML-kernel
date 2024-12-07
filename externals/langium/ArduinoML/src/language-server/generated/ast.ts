/******************************************************************************
 * This file was generated by langium-cli 1.0.0.
 * DO NOT EDIT MANUALLY!
 ******************************************************************************/

/* eslint-disable */
import { AstNode, AbstractAstReflection, Reference, ReferenceInfo, TypeMetaData } from 'langium';

export type Brick = Actuator | Sensor;

export const Brick = 'Brick';

export function isBrick(item: unknown): item is Brick {
    return reflection.isInstance(item, Brick);
}

export type Condition = MultipleCondition | SimpleCondition | TemporalCondition;

export const Condition = 'Condition';

export function isCondition(item: unknown): item is Condition {
    return reflection.isInstance(item, Condition);
}

export interface Action extends AstNode {
    readonly $container: State;
    readonly $type: 'Action' | 'Exception';
    actuator: Reference<Actuator>
    value: Signal
}

export const Action = 'Action';

export function isAction(item: unknown): item is Action {
    return reflection.isInstance(item, Action);
}

export interface Actuator extends AstNode {
    readonly $container: App;
    readonly $type: 'Actuator';
    name: string
    outputPin: number
}

export const Actuator = 'Actuator';

export function isActuator(item: unknown): item is Actuator {
    return reflection.isInstance(item, Actuator);
}

export interface App extends AstNode {
    readonly $type: 'App';
    bricks: Array<Brick>
    initial: Reference<State>
    name: string
    states: Array<State>
}

export const App = 'App';

export function isApp(item: unknown): item is App {
    return reflection.isInstance(item, App);
}

export interface LogicalOperator extends AstNode {
    readonly $container: MultipleCondition;
    readonly $type: 'LogicalOperator';
    AND?: 'AND'
    OR?: 'OR'
    XOR?: 'XOR'
}

export const LogicalOperator = 'LogicalOperator';

export function isLogicalOperator(item: unknown): item is LogicalOperator {
    return reflection.isInstance(item, LogicalOperator);
}

export interface MultipleCondition extends AstNode {
    readonly $container: MultipleCondition | TemporalCondition | Transition;
    readonly $type: 'MultipleCondition';
    conditions: Array<Condition>
    operator: LogicalOperator
}

export const MultipleCondition = 'MultipleCondition';

export function isMultipleCondition(item: unknown): item is MultipleCondition {
    return reflection.isInstance(item, MultipleCondition);
}

export interface Sensor extends AstNode {
    readonly $container: App;
    readonly $type: 'Sensor';
    inputPin: number
    name: string
}

export const Sensor = 'Sensor';

export function isSensor(item: unknown): item is Sensor {
    return reflection.isInstance(item, Sensor);
}

export interface Signal extends AstNode {
    readonly $container: Action | SimpleCondition;
    readonly $type: 'Signal';
    value: string
}

export const Signal = 'Signal';

export function isSignal(item: unknown): item is Signal {
    return reflection.isInstance(item, Signal);
}

export interface SimpleCondition extends AstNode {
    readonly $container: MultipleCondition | TemporalCondition | Transition;
    readonly $type: 'SimpleCondition';
    sensor: Reference<Sensor>
    value: Signal
}

export const SimpleCondition = 'SimpleCondition';

export function isSimpleCondition(item: unknown): item is SimpleCondition {
    return reflection.isInstance(item, SimpleCondition);
}

export interface State extends AstNode {
    readonly $container: App;
    readonly $type: 'State';
    actions: Array<Action>
    name: string
    transitions: Array<Transition>
}

export const State = 'State';

export function isState(item: unknown): item is State {
    return reflection.isInstance(item, State);
}

export interface TemporalCondition extends AstNode {
    readonly $container: MultipleCondition | TemporalCondition | Transition;
    readonly $type: 'TemporalCondition';
    condition: MultipleCondition | SimpleCondition
    duration: number
}

export const TemporalCondition = 'TemporalCondition';

export function isTemporalCondition(item: unknown): item is TemporalCondition {
    return reflection.isInstance(item, TemporalCondition);
}

export interface Transition extends AstNode {
    readonly $container: State;
    readonly $type: 'Transition';
    condition: Condition
    next: Reference<State>
}

export const Transition = 'Transition';

export function isTransition(item: unknown): item is Transition {
    return reflection.isInstance(item, Transition);
}

export interface Exception extends Action {
    readonly $container: State;
    readonly $type: 'Exception';
    actuator: Reference<Actuator>
    errorNumber: number
    pauseTime: number
}

export const Exception = 'Exception';

export function isException(item: unknown): item is Exception {
    return reflection.isInstance(item, Exception);
}

export interface ArduinoMlAstType {
    Action: Action
    Actuator: Actuator
    App: App
    Brick: Brick
    Condition: Condition
    Exception: Exception
    LogicalOperator: LogicalOperator
    MultipleCondition: MultipleCondition
    Sensor: Sensor
    Signal: Signal
    SimpleCondition: SimpleCondition
    State: State
    TemporalCondition: TemporalCondition
    Transition: Transition
}

export class ArduinoMlAstReflection extends AbstractAstReflection {

    getAllTypes(): string[] {
        return ['Action', 'Actuator', 'App', 'Brick', 'Condition', 'Exception', 'LogicalOperator', 'MultipleCondition', 'Sensor', 'Signal', 'SimpleCondition', 'State', 'TemporalCondition', 'Transition'];
    }

    protected override computeIsSubtype(subtype: string, supertype: string): boolean {
        switch (subtype) {
            case Actuator:
            case Sensor: {
                return this.isSubtype(Brick, supertype);
            }
            case MultipleCondition:
            case SimpleCondition:
            case TemporalCondition: {
                return this.isSubtype(Condition, supertype);
            }
            case Exception: {
                return this.isSubtype(Action, supertype);
            }
            default: {
                return false;
            }
        }
    }

    getReferenceType(refInfo: ReferenceInfo): string {
        const referenceId = `${refInfo.container.$type}:${refInfo.property}`;
        switch (referenceId) {
            case 'Action:actuator':
            case 'Exception:actuator':
            case 'Exception:actuator': {
                return Actuator;
            }
            case 'App:initial':
            case 'Transition:next': {
                return State;
            }
            case 'SimpleCondition:sensor': {
                return Sensor;
            }
            default: {
                throw new Error(`${referenceId} is not a valid reference id.`);
            }
        }
    }

    getTypeMetaData(type: string): TypeMetaData {
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
                        { name: 'conditions', type: 'array' }
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

export const reflection = new ArduinoMlAstReflection();
