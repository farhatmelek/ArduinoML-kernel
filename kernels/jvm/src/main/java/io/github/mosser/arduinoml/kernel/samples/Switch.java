package io.github.mosser.arduinoml.kernel.samples;

import io.github.mosser.arduinoml.kernel.App;
import io.github.mosser.arduinoml.kernel.behavioral.*;
import io.github.mosser.arduinoml.kernel.generator.ToWiring;
import io.github.mosser.arduinoml.kernel.generator.Visitor;
import io.github.mosser.arduinoml.kernel.structural.*;

import java.util.Arrays;

public class Switch {

	public static void main(String[] args) {

		// Declaring elementary bricks
		Sensor button = new Sensor();
		button.setName("button");
		button.setPin(9);

		Sensor secondButton = new Sensor();
		secondButton.setName("secondButton");
		secondButton.setPin(10);

		Actuator led = new Actuator();
		led.setName("LED");
		led.setPin(12);

		// Declaring states
		State on = new State();
		on.setName("on");

		State off = new State();
		off.setName("off");

		// Creating actions
		Action switchTheLightOn = new Action();
		switchTheLightOn.setActuator(led);
		switchTheLightOn.setValue(SIGNAL.HIGH);

		Action switchTheLightOff = new Action();
		switchTheLightOff.setActuator(led);
		switchTheLightOff.setValue(SIGNAL.LOW);

		// Binding actions to states
		on.setActions(Arrays.asList(switchTheLightOn));
		off.setActions(Arrays.asList(switchTheLightOff));

		// Creating conditions
		SimpleCondition buttonPressed = new SimpleCondition();
		buttonPressed.setSensor(button);
		buttonPressed.setValue(SIGNAL.HIGH);

		SimpleCondition secondButtonPressed = new SimpleCondition();
		secondButtonPressed.setSensor(secondButton);
		secondButtonPressed.setValue(SIGNAL.HIGH);

		MultipleCondition multipleCondition = new MultipleCondition(
				Arrays.asList(buttonPressed, secondButtonPressed),
				LogicalOperator.AND
		);

		SignalTransition on2off = new SignalTransition();
		on2off.setNext(off);
		on2off.setCondition(multipleCondition);

		SignalTransition off2on = new SignalTransition();
		off2on.setNext(on);
		off2on.setCondition(multipleCondition);

		// Binding transitions to states
		on.setTransition(on2off);
		off.setTransition(off2on);

		// Building the App
		App theSwitch = new App();
		theSwitch.setName("Switch!");
		theSwitch.setBricks(Arrays.asList(button, secondButton, led));
		theSwitch.setStates(Arrays.asList(on, off));
		theSwitch.setInitial(off);

		// Generating Code
		Visitor codeGenerator = new ToWiring();
		theSwitch.accept(codeGenerator);

		// Printing the generated code on the console
		System.out.println(codeGenerator.getResult());
	}
}
