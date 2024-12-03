// Yacc grammar for ArduinoML in C
//
//           Author: Erick Gallesio [eg@unice.fr]
//    Creation date: 16-Nov-2017 17:54 (eg)
// Last file update: 30-Nov-2017 15:27 (eg)

%{
#define  YYERROR_VERBOSE 1      // produce verbose syntax error messages

#include <stdio.h>
#include <stdlib.h>
#include "arduino_syntax.h"
#include "arduino.h"

#define  YYERROR_VERBOSE 1      // produce verbose syntax error messages

//  Prototypes
int  yylex(void);
void yyerror(const char *s);
%}

%union {
    int                        value;
    char                       *name;
    char 		             *op;
    struct arduino_transition  *transition;
    struct arduino_action      *action;
    struct arduino_state       *state;
    struct arduino_brick       *brick;
    struct arduino_condition   *condition;
    struct arduino_temp_condition *temp_transition;
    int                        time;
};

%token KAPPL KSENSOR KACTUATOR KIS LEFT RIGHT INITSTATE
%token  <name>          IDENT KHIGH KLOW
%token  <value>         PORT_NUMBER
%token  <time>          SECONDS
%token KAND KOR KXOR

%type   <condition>     condition
%type   <op>            logical_op
%type   <name>          name
%type   <value>         signal port
%type   <transition>    transition transitions
%type   <action>        action actions
%type   <state>         state states
%type   <brick>         brick bricks
%type   <temp_transition> tempCondition
%type   <time>          time
%%

start:          KAPPL name '{' bricks  states '}'           { emit_code($2, $4, $5); }
     ;

bricks:         bricks brick ';'                            { $$ = add_brick($2, $1); }
      |         error ';'                                   { yyerrok; }
      |         /* empty */                                 { $$ = NULL; }
      ;

brick:          KACTUATOR name ':' port                     { $$ = make_brick($4, actuator, $2); }
     |          KSENSOR   name ':' port                     { $$ = make_brick($4, sensor, $2); }
     ;

states:         states state                                { $$ = add_state($1, $2); }
      |         /*empty */                                  { $$ = NULL; }
      ;

state:          name '{' actions  transitions '}'            { $$ = make_state($1, $3, $4, 0); }
      |         INITSTATE name '{' actions  transitions '}'  { $$ = make_state($2, $4, $5, 1); }
      ;


actions:        actions action ';'                          { $$ = add_action($1, $2); }
       |        action ';'                                  { $$ = $1; }
       |        error ';'                                   { yyerrok; }
       ;

action:          name LEFT signal                           { $$ = make_action($1, $3); }
      ;

transitions:     transitions transition ';'                  { $$ = add_transition($1, $2); }
           |     transition ';'                              { $$ = $1; }
	     |     error ';'                                   { yyerrok; }
	     ;

condition:      name KIS signal                                 { $$ = make_simple_condition($1 ,$3 ); }
         |      condition logical_op condition                  { $$ = make_condition($1, $2, $3); }
         ;

tempCondition: condition KAND time                             { $$ = make_temp_condition($1, $3); }
      ;


logical_op:     KAND                                        { $$ = "and"; }
      |         KOR                                         { $$ = "or"; }
      |         KXOR                                        { $$ = "xor"; }
      ;

transition:    condition RIGHT name                         { $$ = make_transition($1, $3); }
      | error ';'                                           {yyerrok;}
      ;

transition:    name KIS signal RIGHT name                   { $$ = make_transition_simple($1, $3, $5 ); }
      | error ';'                                           {yyerrok;}
      ;

transition: tempCondition RIGHT name                        {$$ = make_temp_transition($1, $3);}
      | error ';'                                           {yyerrok;}
      ;

signal:         KHIGH                                       { $$ = 1; }
      |         KLOW                                        { $$ = 0; }
      ;

name:           IDENT          ;
port:           PORT_NUMBER    ;
time:           SECONDS        ;


%%
void yyerror(const char *msg) { extern int yylineno; error_msg(yylineno, msg); }
