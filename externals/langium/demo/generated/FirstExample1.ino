
//Wiring code generated from an ArduinoML model
// Application name: DualCheckAlarmApp

long debounce = 200;
enum STATE {off, alarm};

STATE currentState = off;

bool button1BounceGuard = false;
long button1LastDebounceTime = 0;

            

bool button2BounceGuard = false;
long button2LastDebounceTime = 0;

            

	void setup(){
		pinMode(3, OUTPUT); // buzzer [Actuator]
		pinMode(8, INPUT); // button1 [Sensor]
		pinMode(9, INPUT); // button2 [Sensor]
	}
	void loop() {
			switch(currentState){

				case off:
					digitalWrite(3,LOW);
					if (
						(millis() - button1LastDebounceTime > debounce &&
						digitalRead(8) == HIGH)
						&& 
						(millis() - button2LastDebounceTime > debounce &&
						digitalRead(9) == HIGH)
		) {
						currentState = alarm;
					}
		
				break;
				case alarm:
					digitalWrite(3,HIGH);
					if (
						(millis() - button1LastDebounceTime > debounce &&
						digitalRead(8) == LOW)
						|| 
						(millis() - button2LastDebounceTime > debounce &&
						digitalRead(9) == LOW)
		) {
						currentState = off;
					}
		
				break;
		}
	}
	
