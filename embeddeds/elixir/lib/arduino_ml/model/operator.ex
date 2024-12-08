defmodule ArduinoML.Operator do
  def enhanced(operator, _) when operator in [:and, :or], do: operator

end
