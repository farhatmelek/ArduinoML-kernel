
//Wiring code generated from an ArduinoML model
// Application name: SimpleAlarm

long debounce = 200;
enum STATE {off, on};

STATE currentState = off;

bool buttonBounceGuard = false;
long buttonLastDebounceTime = 0;

            

	void setup(){
	pinMode(12, OUTPUT); // red_led [Actuator]
	pinMode(11, OUTPUT); // buzzer [Actuator]
	pinMode(10, INPUT); // button [Sensor]
	}
	void loop() {
		switch(currentState){

			case off:
				digitalWrite(12,LOW);
				digitalWrite(11,LOW);
				buttonBounceGuard = millis() - buttonLastDebounceTime > debounce;

				if ( digitalRead(10) == HIGH			 && buttonBounceGuard) {
					buttonLastDebounceTime = millis();
					currentState = on;
					}

				break;
			case on:
				digitalWrite(12,HIGH);
				digitalWrite(11,HIGH);
				buttonBounceGuard = millis() - buttonLastDebounceTime > debounce;

				if ( digitalRead(10) == LOW			 && buttonBounceGuard) {
					buttonLastDebounceTime = millis();
					currentState = off;
					}

				break;
		}
	}
	
