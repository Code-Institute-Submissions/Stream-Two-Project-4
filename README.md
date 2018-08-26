# Stream-Two-Project

This is my final project for Code Institute Stream Two. The Example page can be found here: https://jttf.herokuapp.com

Please note this is merely a course project, and then the information on the side is used for that purpose alone. I only use publicly available data for this purpose.

## Summary
This project is used to demonstrate data visualization using DC.JS, crossfilter, and D3.JS. As well as my use of the flask framework. Not to mention the use of the MongoDB database to supply the data through flask the front end.

This app shows collected data and information of past terrorist attacks. Data can be filtered by city, state and year.
There's a line chart showing the amount of attacks over the years, a state comparison pie chart, and a data table with all the information.


## Installation 

please note that Mongo DB is required.
The data used by this app can be is in the data.json file in the root of the project for your convenience.

```bash
$ git clone https://github.com/andreweliyah/Stream-Two-Project.git

$ cd Stream-Two-Project

$ pip install -r requirements.txt 
```
Now add the data.json to mongodb
```bash
$  mongoimport -d  <YOUR DBS_NAME> -c <YOUR COLLECTION_NAME> --jsonArray data.json
```
I used "terror" for DBS_NAME and "events" for COLLECTION_NAME, but you can user what ever you want. Just remember to add your mongodb credentials into the app.py for:

* MONGO_URI  (mongodb://127.0.0.1:27017 for example)
* DBS_NAME (terror)
* COLLECTION_NAME (events)

Then just run the app

```bash
$ python app.py
```
Thank for your consideration and enjoy.
