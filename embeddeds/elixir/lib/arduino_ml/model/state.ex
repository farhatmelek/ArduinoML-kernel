defmodule ArduinoML.State do
  defstruct label: nil, actions: []
  def enhanced_action(action, application) do
    case action do
      %{pause_time: _, error_number: _, signal: _, actuator: _} ->
        ArduinoML.Exception.enhanced(action, application)

      %{actuator: _, signal: _} ->
        ArduinoML.Action.enhanced(action, application)

      _ ->
        raise ArgumentError, "Invalid action structure: #{inspect(action)}"
    end
  end
  def enhanced_action(%{pause_time: pause_time, error_number: error_number, signal: signal,actuator: actuator}= map, application)
      when is_map_key(map, :pause_time) and is_map_key(map, :error_number) do
    ArduinoML.Exception.enhanced(%{pause_time: pause_time, error_number: error_number, signal: signal, actuator: actuator}, application)


  end

  def enhanced_action(%{actuator: actuator_label, signal: signal_label}= map, application) when not is_map_key(map, :pause_time) and not is_map_key(map, :error_number) do
    ArduinoML.Action.enhanced(%{actuator: actuator_label, signal: signal_label}, application)

  end
  def enhanced(nil, _), do: nil
  def enhanced(%{label: label, actions: actions}, application) do
    state_label=label #enhanced(label, application)
    actions_en = Enum.map(actions, fn action ->
      enriched_action = enhanced_action(action, application)
      enriched_action
    end)
    %ArduinoML.State{label: state_label, actions: actions_en}

  end
  def enhanced(state_label, application) do
    enhanced(Enum.find(application.states, fn %{label: label} -> state_label == label end), application)
  end


end
