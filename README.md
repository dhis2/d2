d2
==

[![Build Status](https://travis-ci.org/dhis2/d2.svg?branch=v25)](https://travis-ci.org/dhis2/d2)
[![Test Coverage](https://codeclimate.com/github/dhis2/d2/badges/coverage.svg)](https://codeclimate.com/github/dhis2/d2/coverage)
[![Code Climate](https://codeclimate.com/github/dhis2/d2/badges/gpa.svg)](https://codeclimate.com/github/dhis2/d2)
[![npm version](https://badge.fury.io/js/d2.svg)](https://badge.fury.io/js/d2)

== 

#Documentation
The documentation is temporarily available on [http://d2.markionium.com](http://d2.markionium.com)

#D2

The d2 library is a javascript library that abstacts away the dhis2 api and lets you use javascript models to communicate with your dhis2 server.

The models are dynamically build using the /api/schemas resource that is available through the dhis2 web api.

#Models

##Basic concepts

###Model
Is an an instance of a model

###ModelDefinition
Is a descriptive object that describes the model and is used to create Models

The Model definition contains information like
    - What is the endpoint for the model
    - What are the properties that the model has
