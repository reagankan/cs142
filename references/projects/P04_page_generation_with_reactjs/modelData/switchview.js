'use strict';

/*
 * Load the model data of the problem 4 of cs142's project4.
 *
 * We hardcode a single property for each possible view:
 *     cs142models.view1: corresponds to problem 1 view.
 *     cs142models.view2: corresponds to problem 2 view.
 *
 * We load into the property cs142models.nextView a function that returns
 * the next view property given the current view property.
 *
 */

var cs142models;

if (cs142models === undefined) {
   cs142models = {};
}

cs142models.view1 = "Example";
cs142models.view2 = "States";

cs142models.nextView = function(view) {
      if (view === this.view1) {
            return this.view2;
      }
      return this.view1;
}