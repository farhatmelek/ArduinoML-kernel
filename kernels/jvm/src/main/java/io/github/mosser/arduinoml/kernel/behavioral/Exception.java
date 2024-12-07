package io.github.mosser.arduinoml.kernel.behavioral;

public class Exception extends Action{
    private int pauseTime;
    private int errorNumber;

    //Getters et Setters
    public int getPauseTime(){
        return pauseTime;
    }
    public int getErrorNumber(){
        return errorNumber;
    }
    public void setPauseTime(int pauseTime){
        this.pauseTime = pauseTime;
    }
    public void setErrorNumber(int errorNumber){
        this.errorNumber = errorNumber;
    }

}
