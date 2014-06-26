"use strict";

$(function() {
  function isItemInArray(item, arr) {
    return arr.some(function(currentValue) {
      return (currentValue === item);
    });
  }

  function getTypeValues(array) {
    return array.map(function(currentValue) {
      return currentValue.type;
    });
  }

  function getUniqueValuesFromArray(array) {
    var uniqueValues = [];
    array.forEach(function(currentValue) {
      if (!isItemInArray(currentValue, uniqueValues)) {
        uniqueValues.push(currentValue);
      }
    });

    return uniqueValues;
  }

  function getUniqueGroceryTypesArray(groceryObjects) {
    var allTypesInArray = getTypeValues(groceryObjects);
    var uniqueGroceryTypes = getUniqueValuesFromArray(allTypesInArray);
    return uniqueGroceryTypes;
  }

  function getProcessedTemplateHtml(templateId, data) { // unfortunately this approach will not work @ Node environment, because jQuery needs a window to run and we are using jQuery to load the lo-dash templates from the HTML
    var templateHtml = $("#" + templateId).html();
    var htmlWithValues = _.template(templateHtml, data); // very Lodash magic goes here. wow.

    return htmlWithValues;
  }

  function getTemplateHtml() {
    var groceryTypes = getUniqueGroceryTypesArray(groceries);
    var dataObject = {
      groceryTypes: groceryTypes,
      groceriesData: groceries
    };
    var templateHtml = getProcessedTemplateHtml('groceriesTemplate', dataObject);
    return templateHtml;
  }

  function renderStudents() {
    var studentsTemplateHtml = getTemplateHtml();
    $('#studentsTableContainer').html(studentsTemplateHtml);
  }

  var matchesData = [];
  function renderStudentsData(students) {

  }

  function getMatchesForTodayData() {
    $.get('http://worldcup.sfg.io/matches/today', function(result) {
      matchesData = result;
      renderStudentsData(studentsData);
    });
  }

  getStudentsData();
});
