# Iron Log

A gym log app that aims to be flexible enough to be used in place of a physical notebook. Create and track your own collection of exercises tailored to your unique training goals.

Visit at https://iron-log.vercel.app/

<br />
<img width="320" alt="iron log middle" src="https://github.com/bstephen1/iron-log/assets/17125707/31033086-cda2-4107-b88d-d0422cefa07d">
<br />

## Features

See the [wiki](https://github.com/bstephen1/iron-log/wiki) for detailed information and screenshots.

- log sets with any combination of fields (weight, distance, time, reps, effort)
- use a set type to track history for each exercise
- view history graphs for exercise records
- define custom exercise modifiers and categories
- save equipment weight per-exercise and per-modifier
- use split weight to separately manage added weight and total weight (including bodyweight and equipment weight)
- track left/right sides for unilateral exercises separately or combined, for each set
- track bodyweight with official and unofficial weigh-ins
- store notes for any exercise, modifier, session, or set
- save custom units per-exercise if they do not match global default units
- track rest / session time
- sign on as a guest user to preview the app with sample data without needing to sign up

## Installation

To install and run a local copy:

download and run a local instance of mongodb

```
mongod
```

install packages and start the app

```
npm install
npm run dev
```

When run locally, a local dev user is available to sign in with, bypassing the normal OAuth sign in. Sample data can be generated for the dev user:

```
npm run db:dev
```
