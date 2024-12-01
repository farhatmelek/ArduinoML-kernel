package io.github.mosser.arduinoml.kernel.structural;


public enum LogicalOperator {
    AND("&&"),
    OR("||");

    private final String operatorSymbol;

    LogicalOperator(String operatorSymbol) {
        this.operatorSymbol = operatorSymbol;
    }

    public String getOperatorSymbol() {
        return operatorSymbol;
    }
}
