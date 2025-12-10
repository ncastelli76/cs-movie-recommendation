To start model(s) after git clone or git checkout:

a: place real movies2.csv and regularFeatures.csv into cs-movie-recommendation/models/rac2. Current ones are limited in size per github 20M cut-off. These files can be extracted from models.tgz archive I have placed into shared one-drive

b: set environment variable to define full path to service data folder:
for bash: 
export REC_BASE_DIR='/Users/ali/Workspaces/WPI/cs-movie-recommendation/'

c: start service (could it be done via npm?)
AI-MBP-2:models ali$ python3 service.py 
 * Serving Flask app 'service'
 * Debug mode: on
WARNING: This is a development server. Do not use it in a production deployment. Use a production WSGI server instead.
 * Running on all addresses (0.0.0.0)
 * Running on http://127.0.0.1:8080
 * Running on http://192.168.82.101:8080
Press CTRL+C to quit
 * Restarting with stat
 * Debugger is active!
 * Debugger PIN: 828-834-825
