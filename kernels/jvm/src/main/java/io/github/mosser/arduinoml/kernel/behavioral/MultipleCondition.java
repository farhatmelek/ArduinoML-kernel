package io.github.mosser.arduinoml.kernel.behavioral;
import io.github.mosser.arduinoml.kernel.generator.Visitor;
import io.github.mosser.arduinoml.kernel.structural.LogicalOperator;

import java.util.List;

public class MultipleCondition extends Condition {
    private final List<Condition> subConditions;
    private final LogicalOperator operator;

    public MultipleCondition(List<Condition> subConditions, LogicalOperator operator) {
        this.subConditions = subConditions;
        this.operator = operator;
    }

    @Override
    public void accept(Visitor visitor) {
        visitor.visit(this);

    }


    @Override
    public String toArduinoCode() {
        return subConditions.stream()
                .map(Condition::toArduinoCode)
                .reduce((c1, c2) -> {
                    return String.format("(%s) %s (%s)", c1, operator.getOperatorSymbol(), c2);
                })
                .orElse("");
    }
}
