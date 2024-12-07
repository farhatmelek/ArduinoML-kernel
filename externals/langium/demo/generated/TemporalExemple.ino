
//Wiring code generated from an ArduinoML model
// Application name: LedController

long debounce = 200;
enum STATE {off, on};

STATE currentState = off;

bool button1BounceGuard = false;
long button1LastDebounceTime = 0;

            

bool compoundConditionBounceGuard = false; 
long compoundConditionLastDebounceTime = 0;
	
	void setup(){
	pinMode(10, INPUT); // button1 [Sensor]
	pinMode(12, OUTPUT); // LED1 [Actuator]
	}
	void loop() {
		switch(currentState){

			case off:
				digitalWrite(12,LOW);
				button1BounceGuard = millis() - button1LastDebounceTime > debounce;

				if ( digitalRead(10) == HIGH			 && button1BounceGuard) {
					button1LastDebounceTime = millis();
					currentState = on;
					}

				break;
			case on:
				digitalWrite(12,HIGH);
				compoundConditionBounceGuard = millis() - compoundConditionLastDebounceTime > debounce;

				if ( 
		static unsigned long timer_dmaoxbx2gxe = 0; // Timer for temporal condition
		if (digitalRead(10) == LOW) {
			if (timer_dmaoxbx2gxe == 0) {
				timer_dmaoxbx2gxe = millis(); // Start timer
			}
			if (millis() - timer_dmaoxbx2gxe >= 800) {
				timer_dmaoxbx2gxe = 0; // Reset timer
				 && compoundConditionBounceGuard) {
					compoundConditionLastDebounceTime = millis();
					currentState = off;
					}

				break;
		}
	}
	
