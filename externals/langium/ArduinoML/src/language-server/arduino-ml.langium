grammar ArduinoMl

entry App:
    'app' name=ID 'initial' 'state' initial=[State:ID]
    '{'
        'bricks'
        bricks+=Brick
        (bricks+=Brick)* 
        
        'states'
        states+=State
        (states+=State)*         
    '}';

Brick :
    (Actuator | Sensor);

Actuator:
    {infer Actuator}
    'Actuator' name=ID ':' outputPin=INT;

Sensor :
    {infer Sensor}
    'Sensor'  name=ID ':' inputPin=INT;

State :
    name=ID '{'
    actions+=Action
    (actions+=Action)* 
    (transitions+=Transition)*
    '}';

Action :
    actuator=[Actuator:ID] '<=' value=Signal
    | Exception;

Exception:
    'exception' '{'
        actuator=[Actuator:ID]
        'pauseTime' pauseTime=INT
        'errorNumber' errorNumber=INT
    '}';

Transition :
    condition=Condition '=>' next=[State:ID];

Condition:
    SimpleCondition | MultipleCondition | TemporalCondition;

SimpleCondition:
    sensor=[Sensor:ID] 'is' value=Signal;

MultipleCondition:
    '(' conditions+=Condition
    (operator+=LogicalOperator conditions+=Condition)+ ')';

TemporalCondition:
    condition = (SimpleCondition | MultipleCondition) 'AND' duration=INT 'ms';

Signal:
    value=(HIGH | LOW);

LogicalOperator:
    AND='AND' | OR='OR' | XOR='XOR';  

terminal HIGH : 'HIGH';
terminal LOW : 'LOW';

hidden terminal WS: /\s+/;
terminal ID: /[_a-zA-Z][\w_]*/;
terminal INT returns number: /[0-9]+/;
terminal STRING: /"[^"]*"|'[^']*'/;

hidden terminal ML_COMMENT: /\/\*[\s\S]*?\*\//;
hidden terminal SL_COMMENT: /\/\/[^\n\r]*/;
