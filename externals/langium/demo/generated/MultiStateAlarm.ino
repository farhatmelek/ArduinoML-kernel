
//Wiring code generated from an ArduinoML model
// Application name: MultiStateAlarm

long debounce = 200;
enum STATE {buzzer_off, buzzer_on, led_on};

STATE currentState = buzzer_off;

bool buttonBounceGuard = false;
long buttonLastDebounceTime = 0;

            

	void setup(){
		pinMode(13, OUTPUT); // buzzer [Actuator]
		pinMode(12, OUTPUT); // red_led [Actuator]
		pinMode(8, INPUT); // button [Sensor]
	}
	void loop() {
			switch(currentState){

				case buzzer_off:
					digitalWrite(13,LOW);
					digitalWrite(12,LOW);
					const buttonBounceGuard = millis() - buttonLastDebounceTime > debounce;
					if ( digitalRead(8) == HIGH			 && buttonBounceGuard) {
						buttonLastDebounceTime = millis();
						currentState = buzzer_on;
					}

				break;
				case buzzer_on:
					digitalWrite(13,HIGH);
					digitalWrite(12,LOW);
					const buttonBounceGuard = millis() - buttonLastDebounceTime > debounce;
					if ( digitalRead(8) == HIGH			 && buttonBounceGuard) {
						buttonLastDebounceTime = millis();
						currentState = led_on;
					}

				break;
				case led_on:
					digitalWrite(13,LOW);
					digitalWrite(12,HIGH);
					const buttonBounceGuard = millis() - buttonLastDebounceTime > debounce;
					if ( digitalRead(8) == HIGH			 && buttonBounceGuard) {
						buttonLastDebounceTime = millis();
						currentState = buzzer_off;
					}

				break;
		}
	}
	
