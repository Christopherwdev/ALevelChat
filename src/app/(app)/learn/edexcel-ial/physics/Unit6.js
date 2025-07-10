export const PHYSICS_UNIT_6_CONTENT = `
# Unit 6: Practical Skills in Physics II  

## A. Investigating capacitor
### Method (Time Constant):
1. Record the value of the resistor, R using the multimeter, and the emf of the battery using the oscilloscope.
2. Set up the below circuit using 100µF capacitor and a 470kΩ resistor.
3. Switch the switch to the position shown in the diagram so that the capacitor charges up, and record the potential difference, V0V_0V0​.
4. Switch the switch to the opposite position and start the stop clock.
5. Use the lap function and record the time it takes for the voltage to drop by 0.5V until the capacitor has fully discharged.
### Calculations
- Plot a graph of voltage against time for the discharging of the capacitor, and use it to determine the time constant of the capacitor.
- The capacitance of the capacitor can then be worked out using:
- Capacitance = Time Constant / Resistance
- The resistance in this case is 470kΩ.

### Method (Changing Resistance):
1. Set the square wave supply to produce a 50Hz 3V wave and attach it to the oscilloscope - adjust the controls as necessary so the waveform is clear.
2. Leave the settings as they are, and disconnect the supply from the oscilloscope.
3. Connect the supply in series with a 5µF capacitor and 1.2kΩ resistor and then attach the oscilloscope across the resistor so it reads the potential difference.
4. Sketch the clock wave and time scales.
5. Switch the square wave supply and replace the resistor with a 470Ω - turn the supply back on and record the results.
6. Repeat this process with a 2.2kΩ resistor.
### Safety Precautions:
- Ensure you don’t use a supply voltage greater than the voltage rating of the capacitor.
- Disconnect the supply when not taking measurements to reduce the likelihood of the components overheating.
## B. Investigating thermistor
### Method (Changing Resistance):
1. Set up a circuit with the resistor and thermistor in series, and with the ohmmeter attached across the thermistor.
2. Pour boiling water into the beaker and carefully measure the temperature.
3. Record the initial temperature using a thermometer, and record the corresponding resistance.
4. Gradually add in small quantities of ice, stir, and then record the new temperature and resistance.
5. Ensure that the ice has been used up and the water is below room temperature.
### Calculations
- Plot a graph of resistance against temperature - this is known as a calibration curve.
- Sketch the circuit and determine the resistance at the desired switch on temperature.
- Construct a potential divider circuit, with the required second resistance to produce the desired output.
### Tips
- You can test how successful you have been by heating water up to the required switch on temperature and measuring the resistance over the thermistor at that temperature.
### Safety Precautions
- Take care when pouring boiling water.
- Don’t touch the beaker when the water temperature is high.
- Keep electrical connections away from water, and clean up any spillages immediately.

## C. Investigating specific latent heat
### Method
1. Place the funnel into the plastic container and pour the ice into the funnel.
2. Allow the ice to cool to 0°C - any ice that melts will be collected by the container.
3. Place the empty beaker onto the mass balance, and zero the reading so that it reads 0g whilst the beaker is in place.
4. Pour around 100ml of water into the beaker and record the mass of the water added, m.
5. At this stage, zero the balance so that it now reads 0g whilst the beaker with the water added is in place.
6. Use a thermometer to measure the initial temperature of the water and then add around 20g of the 0°C ice into the beaker.
7. Stir the mixture until the ice melts, and record the lowest temperature that is reached in the process. This should occur when the ice has completely melted. Record this temperature and the new reading on the mass of the water, M.
### Calculations
- The heat lost as the ice melts is equal to the heat gained by the melted ice and water:
(mice⋅c)=M⋅L(m_{ice} \cdot c) = M \cdot L(mice​⋅c)=M⋅L
- mmm = mass of water
- LLL = specific latent heat of water = 4.2 J/g°C
### Tips
- Take care when pouring boiling water.
- Don’t touch the beaker when the water temperature is high.
- Keep electrical connections away from water, and clean up any spillages immediately.
### Safety Precautions
- Ensure no water gets on the mass balance

## D. Investigating gases
### Method
1. Take the plunger out of the syringe. Measure the syringe's internal diameter using vernier calipers and record this value.
2. Place the plunger back into the syringe and draw in 5 cm³ of air.
3. Without moving the plunger at all, place the syringe over the nozzle of the syringe and pinch the nozzle shut. Make sure that the pinch clip is as close to the nozzle as possible.
4. Set up the clamp stand and attach the syringe to it so that the plunger is pointing downwards, leaving a bit of space below the syringe.
5. Attach the string to the end of the plunger and record the 100 g mass holder to this loop.
6. Record the volume recorded by the syringe.
7. Add a 100 g mass to the holder and record the new reading.
8. Repeat the above step until the total mass is 1000 g.
### Calculations
1. Calculate the cross-sectional area of the syringe in metres using the following equation:
- A=πd24A = \frac{\pi d^2}{4}A=4πd2​
2. Calculate the force exerted by each of the added masses by calculating their weight:
- F=mgF = mgF=mg
- Where mmm is the mass and ggg is the gravitational field strength, g=9.81 N/kgg = 9.81 \, \text{N/kg}g=9.81N/kg.
3. Calculate the pressure exerted at the plunger using the equation:
- P=FAP = \frac{F}{A}P=AF​
### Safety
- Be careful when handling masses - if dropped they may cause injury.
- If the clamp stand is unstable, a counterweight placed on the base of the clamp stand can be used to prevent it from falling over. Alternatively it can be clamped to the bench with a G-clamp.
Notes
- Your line of best fit should form a straight line through the origin showing that 1/V and the pressure of the air sample are directly proportional or, that V and the pressure of the air sample are inversely proportional.


## E. Investigating radiation
### Method
1. Clamp the Geiger-Muller tube in place, and connect it to the counter.
2. Before the gamma source is brought into the room, record the background count over a period of five minutes.
3. Without moving the plunger at all, measure the thickness of the lead.
4. Bring in the gamma source, and position it around 15cm from the Geiger-Muller tube, using long-handed tongs.
5. Repeat, taking the count over a period of five minutes, and record the count rate.
6. Clamp a lead sheet between the source and the Geiger-Muller tube, and record the new count rate.
7. Measure the count over a lead sheet each time, until the count rate drops to roughly half the original value.
### Calculations
- The rate of radiation absorption by the lead is exponential and so follows the equation:  
C = C₀ e-μx  
This can be rearranged into y=mx+c by taking logs  
ln (C) = -μx + ln (C₀)
- This means if you plot a graph of ln(C) against x, the gradient will be -μ (a constant).
- This thickness of lead that reduces the count rate by half is known as the half-thickness and can be calculated using:  
Half-thickness = (ln2)/-gradient  
The gradient value itself should be negative meaning the value obtained from the above equation should be positive.
### Safety Precautions
- Always display a warning sign when working with radioactive sources.
- Never touch the source directly - always use long-handled tongs and an extended arm to maximise the distance you are from the source.
- Only have the source out for the minimum time required to complete the experiment.

`;