
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
			if( 
				button1BounceGuard = millis() - button1LastDebounceTime > debounce;
				if( digitalRead(8) == HIGH && button1BounceGuard)
			 && 
				button2BounceGuard = millis() - button2LastDebounceTime > debounce;
				if( digitalRead(9) == HIGH && button2BounceGuard)
			 ) {
				alarmLastDebounceTime = millis();
				currentState = alarm;
			}
		
				break;
				case alarm:
					digitalWrite(3,HIGH);
			if( 
				button1BounceGuard = millis() - button1LastDebounceTime > debounce;
				if( digitalRead(8) == LOW && button1BounceGuard)
			 && 
				button2BounceGuard = millis() - button2LastDebounceTime > debounce;
				if( digitalRead(9) == LOW && button2BounceGuard)
			 ) {
				offLastDebounceTime = millis();
				currentState = off;
			}
		
				break;
		}
	}
	
