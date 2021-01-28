## Saving generated data to DB and showing it on Frontend(As charts and tables)


Folders

1. Backend (Flask python)

2. Frontend (ReactJs)

### Backend
    ###### Python,Flask
    
    |-- application.py   (Flask server - DB creation, Schema, Data abstraction and API)
    |-- reading.db        (DB file for data storage)
    |-- repeated_timer.py (A thread for timely repetiton of tasks)
    |-- service.py        (Generate random data and store the to DB using POST method)

application.py is a flask server that handles DB with flask_sqlalchemy, Creates an data abstraction layer with marshmallow_jsonapi and api's(flask_rest_jsonapi) to handle DB data. This also handles a routine(repeated_timer.py) which calls service.py every 5 minutes

service.py generates data eg: {reading,time,sensorType} and makes an API POST request to store the data in reading.db.

install dependencies first and then run  application.py, server runs on port:4000

### Frontend
    ###### Reactjs, Material UI

    |-- Dashboard.js  (Parent component, includes Chart and data table sub components)
    |-- Chart.js      (Child component, A line chart)
    |--Orders.js      (Child component, Data table to show values from DB)

Dashboard.js contains a line chart and Table. A routine to get Data from an API end point and update the chart after every 2 minutes with new values. And a table with first 10 DB entries, on Clicking "See More" loads 10 more values from DB


To run first install dependencies "npm install" and then start the application "npm start"
