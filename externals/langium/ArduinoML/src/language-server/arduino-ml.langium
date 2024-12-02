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
    transition=Transition
    '}';

Action :
    actuator=[Actuator:ID] '<=' value=Signal;

Transition :
    conditions+=Condition
    (operator+=LogicalOperator conditions+=Condition)* 
    '=>' next=[State:ID];

Condition :
    sensor=[Sensor:ID] 'is' value=Signal;

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
