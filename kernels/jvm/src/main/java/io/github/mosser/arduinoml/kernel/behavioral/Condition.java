package io.github.mosser.arduinoml.kernel.behavioral;

import io.github.mosser.arduinoml.kernel.generator.Visitor;

public abstract class Condition {
    public abstract void accept(Visitor visitor);

    public abstract String toArduinoCode();
}
