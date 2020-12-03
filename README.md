# collector-microservice
Data gatherer and reporter for RoboDomo

** Note** This microservice needs work, so it's going to exit for now.

This nodejs program is both a RESTful API server, and data collector.  

It might also be an HTTP server for generating plain old HTML pages to view the data.

Data is collected by monitoring MQTT and storing observations in the mongodb database.

The kind of observations depends on the things being monitored.  For example, for a thermostat, we watch for hvac change
from off to cool, and time how long it runs (until hvac changes to off again).  We log the cooling event with timestamp
and duration to mongodb.  Then we can do queries to determine how long the A/C ran on a specific date, for the week, for
the month, compare to last month, compare to yesterday, compare to last year, and so on.

We'd also log (timestamp, value) other readings - like ambient temperature, home/away status, humidity, and whatever
other values make sense.  It ultimately might be interesting to correlate outside temperature with A/C usage.

Aside from thermostats, we want to observe and monitor:

1) TV so you can know how long the TV was on, and what channels you watched
2) Apple TV so you can know how long you spent watching YouTube (and maybe what shows)
3) Pool/Spa so you can know how the temperature changes over time, how much the spa is used, how much the heater is used
4) Weather data
5) AVR volume, etc.


