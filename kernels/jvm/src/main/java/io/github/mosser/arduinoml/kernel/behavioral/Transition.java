package io.github.mosser.arduinoml.kernel.behavioral;

import io.github.mosser.arduinoml.kernel.generator.Visitable;
import io.github.mosser.arduinoml.kernel.generator.Visitor;
import io.github.mosser.arduinoml.kernel.structural.*;

public  class Transition implements Visitable {

	protected State next;
	protected Condition condition;


	public State getNext() {
		return next;
	}

	public void setNext(State next) {
		this.next = next;
	}
	public void setCondition(Condition condition) {
		this.condition = condition;
	}

    @Override
    public void accept(Visitor visitor) {

    }
}
