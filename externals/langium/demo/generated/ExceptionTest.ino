
//Wiring code generated from an ArduinoML model
// Application name: Exception

long debounce = 200;
enum STATE {porteOuverte, porteFermee, exceptionState};

STATE currentState = porteFermee;

bool button1BounceGuard = false;
long button1LastDebounceTime = 0;

            

bool button2BounceGuard = false;
long button2LastDebounceTime = 0;

            

bool compoundConditionBounceGuard = false; 
long compoundConditionLastDebounceTime = 0;
	
	void setup(){
	pinMode(10, INPUT); // button1 [Sensor]
	pinMode(11, INPUT); // button2 [Sensor]
	pinMode(12, OUTPUT); // red_red [Actuator]
	}
	void loop() {
		switch(currentState){

			case porteOuverte:
				digitalWrite(12,LOW);
				compoundConditionBounceGuard = millis() - compoundConditionLastDebounceTime > debounce;

				if ( 
				(digitalRead(10) == HIGH && digitalRead(11) == LOW) 
				 && compoundConditionBounceGuard) {
					compoundConditionLastDebounceTime = millis();
					currentState = porteFermee;
					}

				compoundConditionBounceGuard = millis() - compoundConditionLastDebounceTime > debounce;

				if ( 
				(digitalRead(10) == HIGH && digitalRead(11) == HIGH) 
				 && compoundConditionBounceGuard) {
					compoundConditionLastDebounceTime = millis();
					currentState = exceptionState;
					}

				break;
			case porteFermee:
				digitalWrite(12,LOW);
				compoundConditionBounceGuard = millis() - compoundConditionLastDebounceTime > debounce;

				if ( 
				(digitalRead(10) == LOW && digitalRead(11) == HIGH) 
				 && compoundConditionBounceGuard) {
					compoundConditionLastDebounceTime = millis();
					currentState = porteOuverte;
					}

				compoundConditionBounceGuard = millis() - compoundConditionLastDebounceTime > debounce;

				if ( 
				(digitalRead(10) == HIGH && digitalRead(11) == HIGH) 
				 && compoundConditionBounceGuard) {
					compoundConditionLastDebounceTime = millis();
					currentState = exceptionState;
					}

				break;
			case exceptionState:
				// Gestion de l'exception : red_red - Erreur 3
				for (int i = 0; i < 3; i++) {
					digitalWrite(12, HIGH);
					delay(500);
					digitalWrite(12, LOW);  
					delay(500);  
				}

				// Mettre en pause après les clignotements
				delay(1000); 
		
		
				compoundConditionBounceGuard = millis() - compoundConditionLastDebounceTime > debounce;

				if ( 
				(digitalRead(10) == LOW && digitalRead(11) == HIGH) 
				 && compoundConditionBounceGuard) {
					compoundConditionLastDebounceTime = millis();
					currentState = porteOuverte;
					}

				compoundConditionBounceGuard = millis() - compoundConditionLastDebounceTime > debounce;

				if ( 
				(digitalRead(10) == HIGH && digitalRead(11) == LOW || digitalRead(10) == LOW && digitalRead(11) == LOW) 
				 && compoundConditionBounceGuard) {
					compoundConditionLastDebounceTime = millis();
					currentState = porteFermee;
					}

				break;
		}
	}
	
