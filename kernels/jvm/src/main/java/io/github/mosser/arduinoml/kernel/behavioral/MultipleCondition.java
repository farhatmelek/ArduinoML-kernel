package io.github.mosser.arduinoml.kernel.behavioral;

import io.github.mosser.arduinoml.kernel.generator.Visitor;
import io.github.mosser.arduinoml.kernel.structural.OPERATOR;

import java.util.List;

//Pattern Composite : composite

public class MultipleCondition extends Condition {
    private OPERATOR op;
    private List<Condition> conditions;


    // Getter et Setters
    public List<Condition> getConditions() {
        return conditions;
    }
    public void setConditions(List<Condition> conditions) {
        this.conditions = conditions;
    }
    public OPERATOR getOp() {
       return op;
    }
    public void setOp(OPERATOR op) {
        this.op = op;
    }

    @Override
    public void accept(Visitor visitor) {
        visitor.visit(this);
    }

}
