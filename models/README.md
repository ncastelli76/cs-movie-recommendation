To start model(s) after git clone or git checkout:



a: set environment variable to define full path to service data folder:
for bash: 
export REC_BASE_DIR='/Users/ali/Workspaces/WPI/cs-movie-recommendation/'
or
you-path/cs-movie-recommendation

added a function in db.ts that calls python service and recovers movie ids for similar movies from database

b: start service (could it be done via npm?)
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

 Contains a pipfile for dependencies, to use navigate to containing folder and pipenv run python3 service.py
