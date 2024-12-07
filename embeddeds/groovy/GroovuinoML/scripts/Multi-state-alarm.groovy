sensor "button" onPin 9
actuator "led"  pin 12
actuator "buzzer" pin 10

state "buzzing" means "buzzer" becomes "high"
state "lightening" means "buzzer" becomes "low" and "led" becomes "high"
state "off" means "led" becomes "low"

initial "off"

from "off" to "buzzing" when "button" becomes "high"
from "buzzing" to "lightening" when "button" becomes "high"
from "lightening" to "off" when "button" becomes "high"

export "Multi-state-alarm"
