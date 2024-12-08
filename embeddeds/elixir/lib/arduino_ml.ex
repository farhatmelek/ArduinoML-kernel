defmodule ArduinoML do
  @moduledoc """
  Contains the definition of the DSL API.
  """

  use Agent

  alias ArduinoML.Application, as: Application
  alias ArduinoML.Brick, as: Brick
  alias ArduinoML.Action, as: Action
  alias ArduinoML.Assertion, as: Assertion
  alias ArduinoML.State, as: State
  alias ArduinoML.Transition, as: Transition
  alias ArduinoML.CodeProducer, as: CodeProducer
  alias ArduinoML.MultipleCondition, as: MultipleCondition

  import Kernel, except: [and: 2, <: 2, >: 2,or: 2]

  defmacro __using__(_opts) do
    quote do
      import ArduinoML

      import Kernel, except: [and: 2, <: 2, >: 2, or: 2]
    end
  end

  @doc """
  Initializes the application and names it.
  """
  def application(name) do
    Agent.start_link(fn -> %Application{name: name} end, name: __MODULE__)

    :ok
  end

  @doc """
  Adds a sensor to the application.
  """
  def sensor([{label, pin}]) do
    sensor([{label, pin}, type: :digital])
  end

  def sensor([{label, pin}, type: type]) when type in [:digital, :analogic] do
    sensor = %Brick{label: label, pin: pin, type: type}

    Agent.update(__MODULE__, fn app -> Application.with_sensor(app, sensor) end)

    :ok
  end
  
  @doc """
  Adds an actuator to the application.
  """
  def actuator([{label, pin}]) do
    actuator([{label, pin}, type: :digital])
  end

  def actuator([{label, pin}, type: type]) when type in [:digital, :analogic] do
    actuator = %Brick{label: label, pin: pin, type: type}

    Agent.update(__MODULE__, fn app -> Application.with_actuator(app, actuator) end)

    :ok
  end
  @doc """
  Adds a state to the state machine inside the application.
  This version adds a state with multiple "on entry" actions.
  """
  def error_state(label,on_entry: action= %ArduinoML.Action{}, number_of_repeat: number_of_repeat,every: every) do
    exception_transformed=%ArduinoML.Exception{pause_time: every, error_number: number_of_repeat,actuator: action.actuator,signal: action.signal}
    state = %State{label: label, actions: [exception_transformed]}

    Agent.update(__MODULE__, fn app -> Application.with_state(app, state) end)

    :ok
  end
  @doc """
  Adds a state to the state machien inside the application.
  This version adds a state without "on entry" action.
  """
  def state(label) do
    state(label, on_entry: [])
  end

  @doc """
  Adds a state to the state machine inside the application.
  This version adds a state with only one "on entry" action.
  """
  def state(label, on_entry: action = %Action{}) do
    state(label, on_entry: [action])
  end


  def state(label, on_entry: actions) when is_list(actions) do
    state = %State{label: label, actions: actions}

    Agent.update(__MODULE__, fn app -> Application.with_state(app, state) end)

    :ok
  end

  @doc """
  Set up the initial state of the inner state machine of the application.
  If this is not used, the initial state is the first declared state.
  """
  def initial(label) do
    Agent.update(__MODULE__, fn app -> Application.with_initial(app, label) end)

    :ok
  end

  @doc """
  Builds an action "set the actuator to the given signal".
  """
  def actuator ~> signal do
    %Action{actuator: actuator, signal: signal}
  end

  @doc """
  Builds an action "set the actuator to the value of the given sensor".
  """
  def actuator <~ sensor do
    %Action{actuator: actuator, signal: sensor}
  end
  

  @doc """
  Builds an assertion "is the sensor at the given signal?".
  """
  def sensor <~> signal do
    %Assertion{sensor: sensor, signal: signal, comparison: :equals}
  end

  @doc """
  Builds an assertion "is the sensor at lower signal than".
  """
  def sensor < signal do
    %Assertion{sensor: sensor, signal: signal, comparison: :lower_than}
  end

  @doc """
  Builds an assertion "is the sensor at greater signal than".
  """
  def sensor > signal do
    %Assertion{sensor: sensor, signal: signal, comparison: :greater_than}
  end
  
  @doc """
  Builds an array of assertions from two assertions with and.
  """
  def (assertion = %Assertion{}) and (another_one = %Assertion{}) do
    %MultipleCondition{operator: :and, conditions: [assertion, another_one]}
  end


  def conditions and (assertion = %Assertion{}) when is_list(conditions) do
    %MultipleCondition{operator: :and,conditions: conditions ++ [assertion]}
  end

  def (assertion = %Assertion{}) or (another_one = %Assertion{}) do
    %MultipleCondition{operator: :or, conditions: [assertion, another_one]}
  end

  @doc """
  Add an assertion to an existing array for or condition.
  """
  def conditions or (assertion = %Assertion{}) when is_list(conditions) do
    %MultipleCondition{operator: :or,conditions: conditions ++ [assertion]}
  end

  defp handle_multiple_condition(%MultipleCondition{operator: op, conditions: conditions}) do
    %{operator: op, conditions: conditions}
  end

  @doc """
  Adds a transition to the state machine inside the application.
  This version adds a transition which is the combination of 2 or severals .
  """
  def transition(from: from, to: to, when: condition = %MultipleCondition{}) do
    transformed_condition=handle_multiple_condition(condition)
    transition=%Transition{from: from, to: to, on: transformed_condition}
    Agent.update(__MODULE__, fn app -> Application.with_transition(app, transition) end)

    :ok
  end


  def transition(from: from, to: to, when: condition = %Assertion{}) do
    transition = %Transition{from: from, to: to, on: condition}

    Agent.update(__MODULE__, fn app -> Application.with_transition(app, transition) end)

    :ok
  end


  @doc """
  Builds an assertion "is the sensor at HIGH signal?".
  """
  def is_high?(label), do: label <~> :high

  @doc """
  Builds an assertion "is the sensor at LOW signal?".
  """
  def is_low?(label), do: label <~> :low



  @doc """
  Validates the described application. Will raise errors if it is not valid.
  """
  def validate! do
    application!()
    |> validate_application
  end

  @doc """
  Translates the described application into C Arduino code.
  """
  def to_code! do

    validate!()

    application!()
    |> CodeProducer.to_code
  end

  @doc """
  Translates and displays the described application.
  """
  def finished!(), do: finished!(:show_me)
  def finished!(:show_me) do
    to_code!()
    |> IO.puts
  end

  @doc """
  Translates and saves into the specified file.
  """
  def finished!(save_into: path) do
    {:ok, file} = File.open(path, [:write])

    IO.binwrite(file, to_code!())

    File.close(file)
  end
  
  def application! do
    Agent.get(__MODULE__, &(&1))
  end

  defp validate_application(app) do
    ArduinoML.ModelValidator.validate(app)
  end
  
end
