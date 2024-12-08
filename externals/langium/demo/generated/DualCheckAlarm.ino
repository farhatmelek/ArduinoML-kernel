
//Wiring code generated from an ArduinoML model
// Application name: DualCheckAlarmApp

long debounce = 200;
enum STATE {off, alarm};

STATE currentState = off;

bool button1BounceGuard = false;
long button1LastDebounceTime = 0;

            

bool button2BounceGuard = false;
long button2LastDebounceTime = 0;

            

bool compoundConditionBounceGuard = false; 
long compoundConditionLastDebounceTime = 0;
	
	void setup(){
	pinMode(11, OUTPUT); // buzzer [Actuator]
	pinMode(9, INPUT); // button1 [Sensor]
	pinMode(10, INPUT); // button2 [Sensor]
	}
	void loop() {
		switch(currentState){

			case off:
				digitalWrite(11,LOW);
				compoundConditionBounceGuard = millis() - compoundConditionLastDebounceTime > debounce;

				if ( 
				(digitalRead(9) == HIGH && digitalRead(10) == HIGH) 
				 && compoundConditionBounceGuard) {
					compoundConditionLastDebounceTime = millis();
					currentState = alarm;
					}

				break;
			case alarm:
				digitalWrite(11,HIGH);
				compoundConditionBounceGuard = millis() - compoundConditionLastDebounceTime > debounce;

				if ( 
				(digitalRead(9) == LOW || digitalRead(10) == LOW) 
				 && compoundConditionBounceGuard) {
					compoundConditionLastDebounceTime = millis();
					currentState = off;
					}

				break;
		}
	}
	
