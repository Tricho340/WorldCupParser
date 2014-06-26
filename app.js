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

  function getProcessedTemplateHtml(templateId, data) {
    var templateHtml = $("#" + templateId).html();
    var templateFunction = Handlebars.compile(templateHtml);

    return templateFunction(data);
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

  function getHtmlForMatch(matchData) {
    return getProcessedTemplateHtml('single-match', matchData);
  }

  var matchesData = [];

  function renderMatchesByData(matchesData) {
    var matchesHtml = getMatchesTodayHtml(matchesData);
    $('#matchesTodayContainer').html(matchesHtml);
  }

  function getMatchesTodayHtml(matches) {
    var matchesTodayHtml = "";
    matches.forEach(function(currentMatchData) {
      matchesTodayHtml += getHtmlForMatch(currentMatchData);
    });

    return matchesTodayHtml;
  }

  function getMatchesForTodayData() {
    $.getJSON('http://worldcup.sfg.io/matches/today', function(result) {
      matchesData = result;
      console.log(matchesData);
      renderMatchesByData(matchesData);
    });
  }

  function getMoreInformation() {
    $.getJSON('http://worldcup.sfg.io/teams/results', function(result) {
      resultsData = result;
      console.log(resultsData);
    });
  }

  getMatchesForTodayData();
});
