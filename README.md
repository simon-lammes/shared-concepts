# Shared Concepts

[![Build Status](https://travis-ci.org/simon-lammes/shared-concepts.svg?branch=master)](https://travis-ci.org/simon-lammes/shared-concepts)

This project is intended to be an adaptive learning tool with the main goal of teaching through exercises. These exercises are integrated in the structure of concepts that build on top of each other. For example, you have to know the basic structure of a neuron before you can understand how signals travel through neurological networks. After understanding neurological networks, you have the foundation for understanding how they can be manipulated through the use of medication or technically induced electrical voltage. This app should take these relationships into consideration while serving exactly those exercises that are needed to reach your goals.

## Modeling Of Reality

Reality | How it is Modeled
--- | --- 
Concept | Every concept can be the foundation of multiple other concepts. For example integrals are important for many different mathmetical and physical concepts.
Exercise | Every concept could potentially contain multiple exercises. Every exercise should only be related to its most specific concept. For example, an exercise about _integration by substitution_ is only directed to the concept of _integration by substitution_ and not to the concepts _integration_ (in general) or _math._ Top level concepts like biology, physics and computer science should not have any exercises directly associated to them because each exercise should be related to a more specific concept.
User | Every user can choose exactly one concept to study at a time.
Experience | Every experience models how well a user has done on a specific exercise. The `correctStreak` tells how many times the user had success with the related exercise. `lastTimeSeen` is the date the user has seen the corresponding exercise.

## Significant Technologies Used

Functionality | Technology
------------- |-------------
Frontend | Ionic with Angular     
Authentication | AngularFireAuthModule, firebaseui
Database | Firestore
Continuous Integration | Travis CI   