# cs-movie-recommendation

This is a movie recommendation app that recommends similar movies based on user ratings. Users can search for movies and rate them via our user interface. It contains a baseline page for casual viewers and two personalized recommendation carousels for logged-in users. 

-To start application-

Start service.py from models folder: python3 service.py

You should see something like this:
* Serving Flask app 'service'
* Debug mode: on WARNING: This is a development server. Do not use it in a production deployment. Use a production WSGI server instead.
* Running on all addresses (0.0.0.0)
* Running on http://127.0.0.1:8080
*Running on http://192.168.82.101:8080 Press CTRL+C to quit
Restarting with stat
Debugger is active!
Debugger PIN: 828-834-825

If service.py errors, try: 
  setting environment variable to define full path to service data folder:
  export REC_BASE_DIR='your-path/cs-movie-recommendation/'

People can call the service separately from browser too, as an example :
localhost:8080/api/rec3/getSimilar?id=120
or
localhost:8080/api/rec2/getSimilar?id=120

For the full model, rac3, called in first user carousel, need to install all these packages for it to work properly:
* pip3 install torch
* pip3 install transformers
* pip3 install surprise
* pip3 uninstall numpy
* pip3 install 'numpy<2'
* pip3 install sklearn
* pip3 uninstall scikit-learn
* pip3 install scikit-learn
* pip3 install datasets
* pip3 install evaluate

for hybrid model, make sure saved_transformers folder is in rac3. If not or it doesn't work, install
from this shared onedrive and place locally:

rac2 is lightweight recommender from second carousel, it should work as all dependencies are in github

Finally, start application by running npm run dev in movierecs-app. Make an account 
and rate at least 5 movies by finding them through the search bar or clicking on example movie searches in overhead display. 
