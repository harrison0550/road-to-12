(function (root) {
  function parseDateKey(key) {
    const [year, month, day] = key.split("-").map(Number);
    return new Date(year, month - 1, day, 12);
  }

  function localDateKey(date) {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
  }

  function addCalendarDays(key, amount) {
    const date = parseDateKey(key);
    date.setDate(date.getDate() + amount);
    return localDateKey(date);
  }

  function isRestDate(key) {
    return parseDateKey(key).getDay() === 0;
  }

  function nextTrainingDates(fromKey, count) {
    const dates = [];
    for (let offset = 0; dates.length < count && offset < 400; offset++) {
      const key = addCalendarDays(fromKey, offset);
      if (!isRestDate(key)) dates.push(key);
    }
    return dates;
  }

  function recoverWorkoutToday(sessions, missedId, choice, today) {
    const missed = sessions.find((item) => item.id === missedId);
    if (!missed) return false;

    missed.scheduledDate = today;
    missed.status = "rescheduled";
    if (choice === "both") return true;

    const movable = sessions
      .filter(
        (item) =>
          item.id !== missed.id &&
          item.status !== "restDay" &&
          item.scheduledDate >= today &&
          item.status !== "completed",
      )
      .sort(
        (a, b) =>
          a.scheduledDate.localeCompare(b.scheduledDate) ||
          a.plannedDate.localeCompare(b.plannedDate),
      );
    const targets = nextTrainingDates(addCalendarDays(today, 1), movable.length);
    movable.forEach((item, index) => {
      item.scheduledDate = targets[index];
      item.status =
        item.scheduledDate === item.plannedDate ? "scheduled" : "rescheduled";
    });
    return true;
  }

  function moveWorkout(sessions, sessionId, targetDate, minimumDate) {
    const session = sessions.find((item) => item.id === sessionId);
    if (!session || !targetDate || targetDate < minimumDate) return false;
    session.scheduledDate = targetDate;
    session.status = "rescheduled";
    return true;
  }

  root.ROAD12_SCHEDULING = Object.freeze({
    addCalendarDays,
    isRestDate,
    moveWorkout,
    nextTrainingDates,
    recoverWorkoutToday,
  });
})(typeof self !== "undefined" ? self : window);
