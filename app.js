"use strict";

$(function() {
  var HALF_TIME_DURATION = 15;
  var FIRST_HALF_DURATION = 45;
  var SECOND_HALF_DURATION = 45;
  var MINUTE_CHARACTER = '\'';

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

  function isMatchInProgress(matchData) {
    var now = getNow();
    var matchStart = getMatchStartTime(matchData);
    var matchEnd = getMatchEndTime(matchData);
    var isMatchBeforeCurrentMoment = (now > matchStart && now < matchEnd);
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

  function getMatchDuration() {
    return FIRST_HALF_DURATION + HALF_TIME_DURATION + SECOND_HALF_DURATION;
  }

  function isMatchFullTime(matchData) {
    var now = getNow();
    var matchEndTime = getMatchEndTime(matchData);

    return (now > matchEndTime);
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

  function decorateMatchDataWithHelperMethods(matchData) {
    matchData.isInProgress = isMatchInProgress(matchData);
    matchData.isMatchInHalfTime = isMatchInHalfTime(matchData);
    matchData.isMatchFullTime = isMatchFullTime(matchData);
    matchData.percentComplete = getMatchProgressInPercents(matchData);
    matchData.minutesPlayed = getMinuteFromGame(matchData);
    console.log(matchData);
    return matchData;
  }

  function getPlayingTime() {
    return (FIRST_HALF_DURATION + SECOND_HALF_DURATION);
  }

  function getMinuteFromGame(matchData) {
    var now = getNow();
    var matchStart = getMatchStartTime(matchData);
    if (isMatchInHalfTime(matchData)) {
      return '45\'';
    }
    if (isMatchFullTime(matchData)) {
      return 'FT';
    }
    var secondHalfStart = getSecondHalfStart(matchData);
    if (isGameInSecondHalf(matchData)) {
      return getMinutesFromMilliseconds(now - secondHalfStart) + FIRST_HALF_DURATION + MINUTE_CHARACTER;
    }

    return getMinutesFromMilliseconds(now - matchStart) + MINUTE_CHARACTER;
  }

  function isGameInSecondHalf(matchData) {
    var secondHalfStart = getSecondHalfStart(matchData);
    var now = getNow();
    var gameEndTime = getMatchEndTime(matchData);
    return (now > secondHalfStart && now < gameEndTime);
  }

  function getMatchProgressInPercents(matchData) {
    var minutesPassed = getMinutesSinceMatchStart(matchData);
    var matchDuration = getMatchDuration();
    if (isMatchInHalfTime(matchData)) { // when the match is at half-time we should be at 50 percent
      return 50;
    }

    return parseInt((minutesPassed / getPlayingTime()) * 100, 100);
  }

  function getMinutesSinceMatchStart(matchData) {
    var matchStart = getMatchStartTime(matchData);
    var now = getNow();
    var timePassed = now - matchStart;
    var minutesPassed = getMinutesFromMilliseconds(timePassed);
    return minutesPassed;
  }

  function getMinutesFromMilliseconds(milliseconds) {
    var seconds = (milliseconds / 1000);
    var minutes = Math.round(seconds / 60);
    return minutes;
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
