package io.github.mosser.arduinoml.kernel.behavioral;

import io.github.mosser.arduinoml.kernel.generator.Visitor;
import io.github.mosser.arduinoml.kernel.structural.SIGNAL;
import io.github.mosser.arduinoml.kernel.structural.Sensor;

public class SimpleCondition extends Condition {
    private Sensor sensor;
    private SIGNAL value;


    public SimpleCondition(Sensor sensor, SIGNAL value) {
        this.sensor = sensor;
        this.value = value;
    }

    public SimpleCondition() {
    }

    public Sensor getSensor() {
        return sensor;
    }

    public void setSensor(Sensor sensor) {
        this.sensor = sensor;
    }

    public SIGNAL getValue() {
        return value;
    }

    public void setValue(SIGNAL value) {
        this.value = value;
    }


    @Override
    public void accept(Visitor visitor) {
        visitor.visit(this);

    }

    @Override
    public String toArduinoCode() {
        return String.format("digitalRead(%s) == %s", sensor.getPin(), value);
    }
}