from flask import Flask, request, Response
from flask_cors import CORS
from chart import Chart

app = Flask(__name__)
CORS(app)

chart = Chart()

@app.route("/")
def check():
    return "Flask app!"

@app.route("/getChartValues", methods = ['POST'])
def calculateChart():
    js = chart.chart(pred_value = request.json)
    resp = Response(js, status=200, mimetype='application/json')
    return resp