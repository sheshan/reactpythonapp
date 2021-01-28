# Generate data and store the data to db with post request depicting a reading from sensor
import random
import requests
import time;

def index():
    reading = random.randrange(0,100)
    # to display full time eg: Mon Jan 25 17:09:34 2021
    localtime = time.asctime( time.localtime(time.time()) )
    # make a post request to store the data in the db
    headers = {
        'Content-type': 'application/vnd.api+json',
        }

    data = '{"data":{"type":"reading", "attributes":{"reading":"'+str(reading)+'", "time":"'+str(localtime)+'", "sensor_type":"Temperature"}}}'
    x = requests.post('http://localhost:4000/readings', headers=headers, data=data)

    print(x)
