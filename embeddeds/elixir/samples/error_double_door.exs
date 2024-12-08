use ArduinoML

application "Error double door"

sensor button1: 10
sensor button2: 11
actuator led: 12

state :opened, on_entry: :led ~> :low
state :closed, on_entry: :led ~> :low
error_state :error_state, on_entry: :led ~> :blink, number_of_repeat: 3,every: 3000
transition from: :opened, to: :closed, when: is_high?(:button1) and is_low?(:button2)
transition from: :opened, to: :error_state, when: is_high?(:button1) and is_high?(:button2)
transition from: :closed, to: :opened, when: is_low?(:button1) and is_high?(:button2)
transition from: :closed, to: :error_state, when: is_high?(:button1) and is_high?(:button2)

finished! :show_me


