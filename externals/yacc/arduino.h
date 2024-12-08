/*
 * arduino.h     -- ArduinoML configuration and code generation
 *
 *           Author: Erick Gallesio [eg@unice.fr]
 *    Creation date: 17-Nov-2017 11:13
 * Last file update: 28-Nov-2017 11:47 (eg)
 */

#ifndef ARDUINO_H
#define ARDUINO_H

enum port_assignment {sensor, actuator };
extern char *input_path;      ///< Name of the input path or NULL if stdin

/// Display error message using the GNU conventions
void error_msg(int lineno, const char *format, ...);

//
// ========== BRICKS ==========
//
typedef struct arduino_brick Brick;

/// Declare a new brick on port `number`
Brick *make_brick(int number, enum port_assignment kind, char *name);
/// Add a brick to a list of bricks
Brick *add_brick(Brick *b, Brick *list);

//
// ========== BRICKS ==========
//
typedef struct arduino_transition Transition;


typedef struct arduino_condition {
    int lineno;
    char *var_name;
    int signal_value;
    int sig_value;
    struct arduino_condition *condition1;
    struct arduino_condition *condition2;
    char *operator;
} Condition;



typedef struct arduino_temp_condition {
    int lineno;
    char *var_name;
    int signal_value;
    int sig_value;
    struct arduino_condition *condition1;
    int duration;
} Temp_Condition;

/// Make a new transition (when `var` is `signal` goto `newstate`
Transition *make_transition(Condition *condition, char *newstate);

Transition *make_transition_simple(char *var, int signal, char *newstate);

Transition *add_transition(Transition *list, Transition *t);

Transition *make_temp_transition(Temp_Condition *temp_Condition , char *newstate);


//
// ========== ACTIONS ==========
//
typedef struct arduino_action Action;

// Make a new action (setting `var` to `signal`)
Action *make_action(char *var, int signal);
// Add an action to a list of actions
Action *add_action(Action *list, Action *a);


//
// ========== STATES ==========
//
typedef struct arduino_state State;

// Make a new state named `var` with a list of `actions` and a `transition`
// `initial` must be one if the state is the initial one
State *make_state(char *var, Action *actions, Transition *transition, int initial);
// Add a state to a list of states
State *add_state(State *list, State *a);


//
// ========== CONDITIONS ==========
//

// Make a new condition that combines two conditions using the given operator
Condition *make_condition(Condition *condition1, char *operator, Condition *condition2);

// Make a new condition based on a single variable and signal value
Condition *make_simple_condition(char *var_name, int signal_value);

Temp_Condition *make_temp_condition(Condition *condition ,int duration);

//
// ========== CODE PRODUCTION ==========
//

/// emit the code for the parsed configuration
void emit_code(char *appname, Brick *brick_list, State *state_list);

#endif // ARDUINO_H
