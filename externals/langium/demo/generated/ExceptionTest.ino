
//Wiring code generated from an ArduinoML model
// Application name: Exception

long debounce = 200;
enum STATE {porteOuverte, porteFermee, exceptionState};

STATE currentState = porteFermee;

bool button1BounceGuard = false;
long button1LastDebounceTime = 0;

            

bool button2BounceGuard = false;
long button2LastDebounceTime = 0;

            

	void setup(){
		pinMode(8, INPUT); // button1 [Sensor]
		pinMode(9, INPUT); // button2 [Sensor]
		pinMode(12, OUTPUT); // redLed [Actuator]
	}
	void loop() {
			switch(currentState){

				case porteOuverte:
					digitalWrite(12,LOW);
					const compoundConditionBounceGuard = millis() - compoundConditionLastDebounceTime > debounce;
					if ( 
					(digitalRead(8) == HIGH&& digitalRead(9) == LOW) 
					 && compoundConditionBounceGuard) {
						compoundConditionLastDebounceTime = millis();
						currentState = porteFermee;
					}

					const compoundConditionBounceGuard = millis() - compoundConditionLastDebounceTime > debounce;
					if ( 
					(digitalRead(8) == HIGH&& digitalRead(9) == HIGH) 
					 && compoundConditionBounceGuard) {
						compoundConditionLastDebounceTime = millis();
						currentState = exceptionState;
					}

					break;
				case porteFermee:
					digitalWrite(12,LOW);
					const compoundConditionBounceGuard = millis() - compoundConditionLastDebounceTime > debounce;
					if ( 
					(digitalRead(8) == LOW&& digitalRead(9) == HIGH) 
					 && compoundConditionBounceGuard) {
						compoundConditionLastDebounceTime = millis();
						currentState = porteOuverte;
					}

					const compoundConditionBounceGuard = millis() - compoundConditionLastDebounceTime > debounce;
					if ( 
					(digitalRead(8) == HIGH&& digitalRead(9) == HIGH) 
					 && compoundConditionBounceGuard) {
						compoundConditionLastDebounceTime = millis();
						currentState = exceptionState;
					}

					break;
				case exceptionState:
					// Gestion de l'exception : Actuator redLed - Erreur 3
					for (int i = 0; i < 3; i++) {
						digitalWrite(12, HIGH);
						delay(500);
						digitalWrite(12, LOW);  
						delay(500);  
					}

					// Mettre en pause après les clignotements
					delay(10); 
			
			
					const compoundConditionBounceGuard = millis() - compoundConditionLastDebounceTime > debounce;
					if ( 
					(digitalRead(8) == LOW&& digitalRead(9) == HIGH) 
					 && compoundConditionBounceGuard) {
						compoundConditionLastDebounceTime = millis();
						currentState = porteOuverte;
					}

					const compoundConditionBounceGuard = millis() - compoundConditionLastDebounceTime > debounce;
					if ( 
					(digitalRead(8) == HIGH&& digitalRead(9) == LOW) 
					 && compoundConditionBounceGuard) {
						compoundConditionLastDebounceTime = millis();
						currentState = porteFermee;
					}

					break;
		}
	}
	
