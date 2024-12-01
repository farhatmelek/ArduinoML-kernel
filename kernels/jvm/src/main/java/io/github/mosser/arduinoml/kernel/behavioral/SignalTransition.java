package io.github.mosser.arduinoml.kernel.behavioral;

import io.github.mosser.arduinoml.kernel.generator.Visitor;
import io.github.mosser.arduinoml.kernel.structural.SIGNAL;
import io.github.mosser.arduinoml.kernel.structural.Sensor;

public class SignalTransition extends Transition {
    private Condition condition;
    private Sensor sensor;
    private SIGNAL value;

    public Condition getCondition() {
        return condition;
    }
    public void setCondition(Condition condition) {
        this.condition = condition;
    }

    

    @Override
    public void accept(Visitor visitor) {
        visitor.visit(this);
        if (condition != null) {
            condition.accept(visitor);
        }
    }

}
