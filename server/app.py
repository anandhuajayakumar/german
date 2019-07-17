from flask import Flask, request, Response
from flask_cors import CORS
from chart import Chart

app = Flask(__name__)
CORS(app)

chart = Chart()

@app.route("/")
def check():
    return "Flask app!"

@app.route("/getInitialChartValues", methods = ['POST'])
def calculateChart():
    js = chart.setChart()
    resp = Response(js, status=200, mimetype='application/json')
    return resp

@app.route("/predictValue", methods = ['POST'])
def calculateEligibility():
    js = chart.predict(pred_value = request.json)
    resp = Response(js, status=200, mimetype='application/json')
    return resp