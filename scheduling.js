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

  function calendarDayDelta(fromKey, toKey) {
    const from = parseDateKey(fromKey);
    const to = parseDateKey(toKey);
    return Math.round((to - from) / 86400000);
  }

  function mondayForDate(key) {
    const date = parseDateKey(key);
    const day = date.getDay();
    date.setDate(date.getDate() - (day === 0 ? 6 : day - 1));
    return localDateKey(date);
  }

  function nextMondayAfter(key) {
    return addCalendarDays(mondayForDate(key), 7);
  }

  function scheduleActivationDate(existingDate, today) {
    const yesterday = addCalendarDays(today, -1);
    return !existingDate || existingDate > yesterday ? yesterday : existingDate;
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

  function nextAvailableTrainingDates(fromKey, count, blockedDates) {
    const blocked = new Set(blockedDates || []);
    const dates = [];
    for (let offset = 0; dates.length < count && offset < 400; offset++) {
      const key = addCalendarDays(fromKey, offset);
      if (!isRestDate(key) && !blocked.has(key)) dates.push(key);
    }
    return dates;
  }

  function protectedDates(sessions) {
    return sessions
      .filter((item) => ["completed", "restDay", "displaced"].includes(item.status))
      .map((item) => item.scheduledDate);
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
          !["restDay", "displaced"].includes(item.status) &&
          item.scheduledDate >= today &&
          item.status !== "completed",
      )
      .sort(
        (a, b) =>
          a.scheduledDate.localeCompare(b.scheduledDate) ||
          a.plannedDate.localeCompare(b.plannedDate),
      );
    const targets = nextAvailableTrainingDates(
      addCalendarDays(today, 1),
      movable.length,
      protectedDates(sessions),
    );
    movable.forEach((item, index) => {
      item.scheduledDate = targets[index];
      item.status =
        item.scheduledDate === item.plannedDate ? "scheduled" : "rescheduled";
    });
    return true;
  }

  function completeRecoveredWorkout(sessions, missedId, today, decision) {
    const recovered = sessions.find((item) => item.id === missedId);
    if (!recovered) return false;

    recovered.status = "completed";
    recovered.actualCompletionDate = today;
    recovered.completedDate = today;
    if (decision !== "replace") return true;

    const movable = sessions
      .filter(
        (item) =>
          item.id !== recovered.id &&
          !["restDay", "displaced"].includes(item.status) &&
          item.status !== "completed" &&
          item.scheduledDate >= today,
      )
      .sort(
        (a, b) =>
          a.scheduledDate.localeCompare(b.scheduledDate) ||
          a.plannedDate.localeCompare(b.plannedDate),
      );
    const targets = nextAvailableTrainingDates(
      addCalendarDays(today, 1),
      movable.length,
      protectedDates(sessions),
    );
    movable.forEach((item, index) => {
      item.scheduledDate = targets[index];
      item.status =
        item.scheduledDate === item.plannedDate ? "scheduled" : "rescheduled";
    });
    return true;
  }

  function resolveCompletionOccurrence(sessions, completedSession) {
    const exactId = completedSession?.scheduleOccurrenceId || completedSession?.scheduleId;
    if (exactId) return sessions.find((item) => item.id === exactId) || null;

    const completedDate = completedSession?.completedDate || completedSession?.actualCompletionDate || completedSession?.dateKey;
    if (!completedDate) return null;
    const candidates = sessions
      .filter((item) => {
        if (["completed", "restDay", "displaced"].includes(item.status) || item.scheduledDate > completedDate) return false;
        if (completedSession.templateId) return item.templateId === completedSession.templateId;
        return !!completedSession.name && item.name === completedSession.name;
      })
      .sort((a, b) =>
        b.scheduledDate.localeCompare(a.scheduledDate) ||
        b.plannedDate.localeCompare(a.plannedDate),
      );
    return candidates[0] || null;
  }

  function completeScheduleOccurrence(sessions, occurrenceId, completedDate, options = {}) {
    const occurrence = sessions.find((item) => item.id === occurrenceId);
    if (!occurrence || !completedDate) return false;
    const priorScheduledDate = occurrence.scheduledDate;
    const delta = Math.max(0, calendarDayDelta(priorScheduledDate, completedDate));

    if (options.shiftSubsequent && delta > 0) {
      const nextMonday = nextMondayAfter(occurrence.plannedDate);
      const recoveryWeek = sessions.filter((item) =>
        item.id !== occurrence.id &&
        item.plannedDate > occurrence.plannedDate &&
        item.plannedDate < nextMonday &&
        item.scheduledDate < nextMonday &&
        item.status !== "completed",
      );
      const displacedRecovery = recoveryWeek.find((item) => item.status === "restDay");
      recoveryWeek
        .filter((item) => item.status !== "restDay")
        .forEach((item) => {
          const shiftedDate = addCalendarDays(item.scheduledDate, delta);
          if (shiftedDate >= nextMonday) {
            item.status = "displaced";
            item.displacedByOccurrenceId = occurrence.id;
            item.displacedReason = "weeklyRecoveryBoundary";
            return;
          }
          item.scheduledDate = shiftedDate;
          item.status = "rescheduled";
        });
      const sundayClaimed = recoveryWeek.some((item) =>
        item.status === "rescheduled" && parseDateKey(item.scheduledDate).getDay() === 0,
      );
      if (displacedRecovery && sundayClaimed) {
        displacedRecovery.status = "displaced";
        displacedRecovery.displacedByOccurrenceId = occurrence.id;
        displacedRecovery.displacedReason = "weeklyCatchUpBuffer";
      }
    }

    occurrence.scheduledDate = completedDate;
    occurrence.status = "completed";
    occurrence.completedDate = completedDate;
    occurrence.actualCompletionDate = completedDate;
    return true;
  }

  function associateCompletedSession(sessions, completedSession, options = {}) {
    const occurrence = resolveCompletionOccurrence(sessions, completedSession);
    if (!occurrence) return null;
    const completedDate = completedSession.completedDate || completedSession.actualCompletionDate || completedSession.dateKey;
    const shifted = completeScheduleOccurrence(sessions, occurrence.id, completedDate, {
      shiftSubsequent: options.shiftSubsequent !== false && occurrence.scheduledDate < completedDate,
    });
    if (!shifted) return null;
    completedSession.scheduleOccurrenceId = occurrence.id;
    completedSession.scheduleId = occurrence.id;
    return occurrence;
  }

  function repairOccurrenceAssociation(sessions, history, repair) {
    const completedSession = history.find((item) => item.id === repair?.sessionId);
    const intended = sessions.find((item) => item.id === repair?.intendedOccurrenceId);
    const incorrect = sessions.find((item) => item.id === repair?.incorrectOccurrenceId);
    if (!completedSession || !intended || !incorrect || intended.id === incorrect.id) return false;
    const linkedId = completedSession.scheduleOccurrenceId || completedSession.scheduleId;
    if (linkedId !== incorrect.id || incorrect.status !== "completed" || intended.status === "completed") return false;

    incorrect.status = incorrect.scheduledDate === incorrect.plannedDate ? "scheduled" : "rescheduled";
    delete incorrect.completedDate;
    delete incorrect.actualCompletionDate;
    completedSession.scheduleOccurrenceId = intended.id;
    completedSession.scheduleId = intended.id;
    return completeScheduleOccurrence(
      sessions,
      intended.id,
      completedSession.completedDate || completedSession.actualCompletionDate || completedSession.dateKey,
      { shiftSubsequent: true },
    );
  }

  function rescheduleWorkout(sessions, sessionId, targetDate, minimumDate) {
    const session = sessions.find((item) => item.id === sessionId);
    if (
      !session ||
      session.status === "completed" ||
      ["restDay", "displaced"].includes(session.status) ||
      !targetDate ||
      targetDate < minimumDate ||
      isRestDate(targetDate)
    ) {
      return false;
    }

    const blocked = protectedDates(sessions);
    if (blocked.includes(targetDate)) return false;

    const hasCollision = sessions.some(
      (item) =>
        item.id !== session.id &&
        !["restDay", "displaced"].includes(item.status) &&
        item.status !== "completed" &&
        item.scheduledDate === targetDate,
    );
    session.scheduledDate = targetDate;
    session.status = "rescheduled";
    if (!hasCollision) return true;

    const movable = sessions
      .filter(
        (item) =>
          item.id !== session.id &&
          !["restDay", "displaced"].includes(item.status) &&
          item.status !== "completed" &&
          item.scheduledDate >= targetDate,
      )
      .sort(
        (a, b) =>
          a.scheduledDate.localeCompare(b.scheduledDate) ||
          a.plannedDate.localeCompare(b.plannedDate),
      );
    const targets = nextAvailableTrainingDates(
      addCalendarDays(targetDate, 1),
      movable.length,
      blocked,
    );
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

  function programAdherence(sessions, today, baselineDate) {
    const relevant = (sessions || []).filter(
      (item) => {
        const plannedDate = item.plannedDate || item.scheduledDate;
        return (
          item.status !== "restDay" &&
          ["completed", "missed"].includes(item.status) &&
          plannedDate <= today &&
          (!baselineDate || plannedDate >= baselineDate)
        );
      },
    );
    const completed = relevant.filter((item) => item.status === "completed").length;
    return relevant.length ? Math.round((completed / relevant.length) * 100) : 100;
  }

  root.ROAD12_SCHEDULING = Object.freeze({
    addCalendarDays,
    associateCompletedSession,
    completeScheduleOccurrence,
    completeRecoveredWorkout,
    isRestDate,
    moveWorkout,
    nextAvailableTrainingDates,
    nextTrainingDates,
    nextMondayAfter,
    programAdherence,
    repairOccurrenceAssociation,
    recoverWorkoutToday,
    resolveCompletionOccurrence,
    rescheduleWorkout,
    scheduleActivationDate,
  });
})(typeof self !== "undefined" ? self : window);
