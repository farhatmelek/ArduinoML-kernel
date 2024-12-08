use ArduinoML

application "Dual-check alarm"

sensor button1: 9
sensor button2: 10
actuator led: 12


error_state :released, on_entry: :led ~> :low , number_of_repeat: 3,every: 3000
error_state :blink_3_times, on_entry: :led ~> :blink, number_of_repeat: 3,every: 3000
transition from: :released, to: :blink_3_times, when: is_high?(:button1) and is_high?(:button2)

finished! :show_me
