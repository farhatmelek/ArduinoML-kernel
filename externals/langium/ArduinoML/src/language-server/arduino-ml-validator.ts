import { ValidationAcceptor, ValidationChecks } from 'langium';
import { ArduinoMlAstType, App, TemporalCondition } from './generated/ast';
import type { ArduinoMlServices } from './arduino-ml-module';

/**
 * Register custom validation checks.
 */
export function registerValidationChecks(services: ArduinoMlServices) {
    const registry = services.validation.ValidationRegistry;
    const validator = services.validation.ArduinoMlValidator;
    const checks: ValidationChecks<ArduinoMlAstType> = {
        App: [
            validator.checkNothing,
            validator.checkAppHasInitialState,
            validator.checkUniqueNames,
            validator.checkPinsUniqueness
        ],
        TemporalCondition: validator.checkTemporalCondition
    };
    registry.register(checks, validator);
}

/**
 * Implementation of custom validations.
 */
export class ArduinoMlValidator {

    checkNothing(app: App, accept: ValidationAcceptor): void {
        if (app.name) {
            const firstChar = app.name.substring(0, 1);
            if (firstChar.toUpperCase() !== firstChar) {
                accept('warning', 'App name should start with a capital.', { node: app, property: 'name' });
            }
        }
    }
    checkAppHasInitialState(app: App, accept: ValidationAcceptor): void {
        if (!app.initial) {
            accept('error', 'The application must have an initial state.', { node: app });
        } else if (!app.states.some(state => state.name === app.initial?.ref?.name)) {
            accept('error', 'The initial state must exist in the list of states.', { node: app, property: 'initial' });
        }
    }
    checkUniqueNames(app: App, accept: ValidationAcceptor): void {
        const names = new Set<string>();
        for (const brick of app.bricks) {
            if (names.has(brick.name)) {
                accept('error', `The name '${brick.name}' is already used.`, { node: brick, property: 'name' });
            } else {
                names.add(brick.name);
            }
        }
        for (const state of app.states) {
            if (names.has(state.name)) {
                accept('error', `The name '${state.name}' is already used.`, { node: state, property: 'name' });
            } else {
                names.add(state.name);
            }
        }
    }
    checkTemporalCondition(condition: TemporalCondition, accept: ValidationAcceptor): void {
        if (!condition.duration || condition.duration <= 0) {
            accept('error', 'Temporal conditions must have a positive duration.', { node: condition, property: 'duration' });
        }
    }

    checkPinsUniqueness(app: App, accept: ValidationAcceptor): void {
        const usedPins = new Map<number, string>(); 
    
        for (const brick of app.bricks) {
            const pin = 'inputPin' in brick ? brick.inputPin : brick.outputPin;
    
            if (usedPins.has(pin)) {
                const existingBrick = usedPins.get(pin);
                accept('error', 
                    `Pin ${pin} is already used by '${existingBrick}'. Please use a unique pin.`,
                    { node: brick } );
            } else {
                usedPins.set(pin, brick.name);
            }
        }


    }
    
    
    

}
