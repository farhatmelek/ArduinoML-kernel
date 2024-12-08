defmodule ArduinoML.Exception do
  defstruct pause_time: nil, error_number: nil ,signal: nil,actuator: nil
  def enhanced(%{actuator: actuator_label, signal: signal_label, pause_time: pause_time, error_number: error_number}, application) do
    IO.inspect(application.actuators, label: "Application actuators in ~>")
    actuatore = ArduinoML.Brick.enhanced(actuator_label, application.actuators)
    signal = ArduinoML.Signal.enhanced(signal_label, application)
    %ArduinoML.Exception{actuator: actuatore, signal: signal,pause_time: pause_time, error_number: error_number}
  end

end
