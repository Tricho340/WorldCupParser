"use strict";

$(function() {
  var HALF_TIME_DURATION = 15;
  var FIRST_HALF_DURATION = 45;
  var SECOND_HALF_DURATION = 45;

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
      decorateMatchesDataWithHelperMethods(matchesData);
      renderMatchesByData(matchesData);
      initializeAppListeners();
    });
  }

  function decorateMatchesDataWithHelperMethods(matches) {
    matches.forEach(function(currentMatchData) {
      currentMatchData = decorateMatchDataWithHelperMethods(currentMatchData);
    });
  }

  function hasMatchStarted(matchData) {
    var now = getNow();
    var matchStart = getMatchStartTime(matchData);
    var isMatchBeforeCurrentMoment = (now > matchStart);
    return isMatchBeforeCurrentMoment;
  }

  function getFirstHalfEnd(matchData) {
    var matchStart = getMatchStartTime(matchData);
    var firstHalfEnd = matchStart + getMillisecondsByMinutes(FIRST_HALF_DURATION);

    return firstHalfEnd;
  }

  function getSecondHalfStart(matchData) {
    var matchStart = getMatchStartTime(matchData);
    var secondHalfStart = matchStart + getMillisecondsByMinutes(FIRST_HALF_DURATION) + getMillisecondsByMinutes(HALF_TIME_DURATION);
    return secondHalfStart;
  }

  function getMillisecondsByMinutes(minutes) {
    return minutes * 60 * 1000;
  }

  function isMatchInHalfTime(matchData) {
    var timePassed = getTimePassedSinceMatchStart(matchData);
    var firstHalfEnd = getFirstHalfEnd(matchData);
    var secondHalfStart = getSecondHalfStart(matchData);
    var isHalfTime = ((timePassed > firstHalfEnd) || (timePassed < secondHalfStart));

    return isHalfTime;
  }

  function isMatchFullTime() {
    var timePassed = getTimePassedSinceMatchStart(matchData);
    var matchE
    var firstHalfEnd = getFirstHalfEnd(matchData);
    var secondHalfStart = getSecondHalfStart(matchData);
    var isHalfTime = ((timePassed > firstHalfEnd) || (timePassed < secondHalfStart));

    return isHalfTime;
  }

  function getNow() {
    return new Date().getTime();
  }

  function getMatchEndTime(matchData) {
    var matchStartTime = getMatchStartTime(matchData);
    var matchEndTime = matchStartTime + HALF_TIME_DURATION + FIRST_HALF_DURATION + SECOND_HALF_DURATION;
    return matchEndTime;
  }

  function getMatchStartTime(matchData) {
    var matchStartTime = new Date(matchData.datetime).getTime();
    return matchStartTime;
  }

  function getTimePassedSinceMatchStart(matchData) {
    var now = getNow();
    var matchStartTime = getMatchStartTime(matchData);
    var timePassed = now - matchStartTime;
    return timePassed;
  }

  function isMatchOver(matchData) {

  }

  function decorateMatchDataWithHelperMethods(matchData) {
    matchData.isStarted = hasMatchStarted(matchData);
    matchData.isMatchInHalfTime =

    matchData.percentComplete = hasMatchStarted()
    return matchData;
  }

  function getMatchProgress(matchData) {
    var matchMinute = matchData
  }

  function getMinutesSinceMatchStart(matchData) {
    mat
  }

  function getMoreInformation() {
    $.getJSON('http://worldcup.sfg.io/teams/results', function(result) {
      resultsData = result;
      console.log(resultsData);
    });
  }

  function initializeAppListeners() {
    $('#matchesTodayContainer').on('mouseover', '.team-area', function() {
      console.log(this);
    });
    $('#matchesTodayContainer').on('mouseout', '.team-area', function() {
        console.log(this);
    });
  }

  getMatchesForTodayData();
});
