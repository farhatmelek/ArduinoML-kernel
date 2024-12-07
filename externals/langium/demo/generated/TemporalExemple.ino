
//Wiring code generated from an ArduinoML model
// Application name: LedController

long debounce = 200;
enum STATE {off, on};

STATE currentState = off;

bool button1BounceGuard = false;
long button1LastDebounceTime = 0;

            

	void setup(){
	pinMode(8, INPUT); // button1 [Sensor]
	pinMode(9, OUTPUT); // LED1 [Actuator]
	}
	void loop() {
		switch(currentState){

			case off:
				digitalWrite(9,LOW);
				const button1BounceGuard = millis() - button1LastDebounceTime > debounce;

				if ( digitalRead(8) == HIGH			 && button1BounceGuard) {
					button1LastDebounceTime = millis();
					currentState = on;
					}

				break;
			case on:
				digitalWrite(9,HIGH);
			
				static unsigned long timer_vqoi9v7zvol = 0; 
				if (digitalRead(8) == LOW) {
					if (timer_vqoi9v7zvol == 0) {
						timer_vqoi9v7zvol = millis(); // Start timer
					}
					if (millis() - timer_vqoi9v7zvol >= 800) {
						timer_vqoi9v7zvol = 0; // Reset timer
						currentState = off;
						

					break;
					}
				}
		}
	}
	
