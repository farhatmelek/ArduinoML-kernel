
//Wiring code generated from an ArduinoML model
// Application name: SimpleAlarm

long debounce = 200;
enum STATE {off, on};

STATE currentState = off;

bool buttonBounceGuard = false;
long buttonLastDebounceTime = 0;

            

	void setup(){
		pinMode(12, OUTPUT); // red_led [Actuator]
		pinMode(13, OUTPUT); // buzzer [Actuator]
		pinMode(8, INPUT); // button [Sensor]
	}
	void loop() {
			switch(currentState){

				case off:
					digitalWrite(12,LOW);
					digitalWrite(13,LOW);
					if (
						(millis() - buttonLastDebounceTime > debounce &&
						digitalRead(8) == HIGH)
					) {
						currentState = on;
					}
		
				break;
				case on:
					digitalWrite(12,HIGH);
					digitalWrite(13,HIGH);
					if (
						(millis() - buttonLastDebounceTime > debounce &&
						digitalRead(8) == LOW)
					) {
						currentState = off;
					}
		
				break;
		}
	}
	
