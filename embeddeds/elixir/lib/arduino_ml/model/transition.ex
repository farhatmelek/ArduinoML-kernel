defmodule ArduinoML.Transition do
  defstruct from: nil, to: nil, on: nil

  def enhanced(%{from: from_label, to: to_label, on: conditions}, application) do
    from = ArduinoML.State.enhanced(from_label, application)
    to = ArduinoML.State.enhanced(to_label, application)

    # Appel de `enhance_condition` pour chaque condition dans la liste
    enhanced_conditions = enhance_condition(conditions, application)

    %ArduinoML.Transition{from: from, to: to, on: enhanced_conditions}
  end

  # Cas où la condition est une assertion
  def enhance_condition(%ArduinoML.Assertion{} = assertion, application) do
    ArduinoML.Assertion.enhanced(assertion, application)
  end
  def enhance_condition(conditions,application) when is_list(conditions) do
       Enum.map(conditions, fn condition -> enhance_condition(condition,application) end)
      end
  # Cas où la condition est une MultipleCondition
  def enhance_condition(%{operator: operator, conditions: conditions}, application) do
    enhanced_conditions = Enum.map(conditions, fn condition -> enhance_condition(condition, application) end)
    %ArduinoML.MultipleCondition{operator: operator, conditions: enhanced_conditions}
  end

end
