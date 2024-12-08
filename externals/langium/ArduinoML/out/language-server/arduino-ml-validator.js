"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArduinoMlValidator = exports.registerValidationChecks = void 0;
/**
 * Register custom validation checks.
 */
function registerValidationChecks(services) {
    const registry = services.validation.ValidationRegistry;
    const validator = services.validation.ArduinoMlValidator;
    const checks = {
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
exports.registerValidationChecks = registerValidationChecks;
/**
 * Implementation of custom validations.
 */
class ArduinoMlValidator {
    checkNothing(app, accept) {
        if (app.name) {
            const firstChar = app.name.substring(0, 1);
            if (firstChar.toUpperCase() !== firstChar) {
                accept('warning', 'App name should start with a capital.', { node: app, property: 'name' });
            }
        }
    }
    checkAppHasInitialState(app, accept) {
        if (!app.initial) {
            accept('error', 'The application must have an initial state.', { node: app });
        }
        else if (!app.states.some(state => { var _a, _b; return state.name === ((_b = (_a = app.initial) === null || _a === void 0 ? void 0 : _a.ref) === null || _b === void 0 ? void 0 : _b.name); })) {
            accept('error', 'The initial state must exist in the list of states.', { node: app, property: 'initial' });
        }
    }
    checkUniqueNames(app, accept) {
        const names = new Set();
        for (const brick of app.bricks) {
            if (names.has(brick.name)) {
                accept('error', `The name '${brick.name}' is already used.`, { node: brick, property: 'name' });
            }
            else {
                names.add(brick.name);
            }
        }
        for (const state of app.states) {
            if (names.has(state.name)) {
                accept('error', `The name '${state.name}' is already used.`, { node: state, property: 'name' });
            }
            else {
                names.add(state.name);
            }
        }
    }
    checkTemporalCondition(condition, accept) {
        if (!condition.duration || condition.duration <= 0) {
            accept('error', 'Temporal conditions must have a positive duration.', { node: condition, property: 'duration' });
        }
    }
    checkPinsUniqueness(app, accept) {
        const usedPins = new Map();
        for (const brick of app.bricks) {
            const pin = 'inputPin' in brick ? brick.inputPin : brick.outputPin;
            if (usedPins.has(pin)) {
                const existingBrick = usedPins.get(pin);
                //const property = 'inputPin' in brick ? 'inputPin' : 'outputPin' as 'inputPin' | 'outputPin';
                accept('error', `Pin ${pin} is already used by '${existingBrick}'. Please use a unique pin.`, { node: brick });
            }
            else {
                usedPins.set(pin, brick.name);
            }
        }
    }
}
exports.ArduinoMlValidator = ArduinoMlValidator;
//# sourceMappingURL=arduino-ml-validator.js.map