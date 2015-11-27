
# React based hierarchical table view

## Installation

NOTE: installation requires io.js version of Node due to jsdom requirements, if you want to run tests

 * clone the repository
 * cd rematrix (or what is the repository directory)
 * copy your PC Axis data files into directory named data
 * ```npm install```
 * ```npm start```
 * cd server/statserver (on separate console, check below for data server installation)
 * ```python manage.py runserver```
 * set browser to http://localhost:8080/

## Data server installation

Server for table data is written in Django and currently only supports PC Axis files from the file system's data directory. Installation goes like this, if you have Python environment in working order:

    cd server/statserver 
    pip install -r requirements.txt

Python virtual environment or Anaconda distribution will probably make things much easier. There is currently dependency on Pandas, which might not install easy in some environments.

Copy your PX files to data directory.

## For production (not recommended!)

    npm build

## Run tests

    node_modules/mocha/bin/mocha  test/*.jsx --require babel/register

Or just mocha depending on your $PATH settings.

## Code Coverage

Install Istanbul using Babel support wrapper to global NPM:

    npm install -g babel-core babel-istanbul

### Run test coverage

    babel-istanbul cover _mocha --  test/*.jsx --require babel/register

### Generate HTML report

Report will go to coverage folder.

    babel-istanbul report -v html

