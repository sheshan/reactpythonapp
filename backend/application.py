#Create DB,Schema , API to handle data

from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from marshmallow_jsonapi.flask import Schema
from marshmallow_jsonapi import fields
from flask_rest_jsonapi import Api, ResourceDetail, ResourceList
import time
import requests
import json
from repeated_timer import RepeatedTimer
from flask_cors import CORS
from service import index

# Create a new Flask application
app = Flask(__name__)
cors = CORS(app)
# Set up SQLAlchemy
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///reading.db'
db = SQLAlchemy(app)

# Define a class for the reading table
class Reading(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    reading = db.Column(db.Integer)
    time = db.Column(db.String)
    sensor_type = db.Column(db.String)

# Create the table
db.create_all()


# Call sensor data in timely manner
def getSensorData():
    #### data to DB can also be updated directly into DB
    # r = requests.get(url = "http://localhost:8000/")
    # # extracting data in json format 
    # data = r.json()

    #myobj = Reading(reading=data["reading"],time=data["time"],sensor_type=data["sensorType"])
    #db.session.add(myobj)
    #db.session.commit()
    db.drop_all() 
    index()  # call to service.py 

# thread set interval for 5 minutes
rt = RepeatedTimer(300, getSensorData) # it auto-starts, no need of rt.start()

# main code to execute
try:
    # Create data abstraction layer
    class ReadingSchema(Schema):
        class Meta:
            type_ = 'reading'
            self_view = 'reading_one'
            self_view_kwargs = {'id': '<id>'}
            self_view_many = 'reading_many'

        id = fields.Integer()
        reading = fields.Str(required=True)
        time = fields.Str()
        sensor_type = fields.Str()

    # Create resource managers and endpoints

    class ReadingMany(ResourceList):
        schema = ReadingSchema
        data_layer = {'session': db.session,
                    'model': Reading}

    class ReadingOne(ResourceDetail):
        schema = ReadingSchema
        data_layer = {'session': db.session,
                    'model': Reading}

    #api end points
    api = Api(app)
    api.route(ReadingMany, 'reading_many', '/readings')
    api.route(ReadingOne, 'reading_one', '/readings/<int:id>')
    # main loop to run app in debug mode
    if __name__ == '__main__':
        app.run(host="localhost", port=4000, debug=True)
finally:
    rt.stop() # better in a try/finally block to make sure the program ends!