/* ==================================================
   SETTINGS
================================================== */

const TOTAL_DAYS = 30;


/* ==================================================
   CURRENTLY SELECTED CHALLENGE
================================================== */

let currentChallenge = "porn";


/* ==================================================
   TWO SEPARATE CHALLENGES
================================================== */

let challenges = {

    /* ----------------------------------------------
       READ DAILY
    ---------------------------------------------- */

    porn: {

        startDate:
            localStorage.getItem(
                "pornStartDate"
            ),

        completedDays:
            JSON.parse(
                localStorage.getItem(
                    "pornCompletedDays"
                )
            ) || []

    },


    /* ----------------------------------------------
       EXERCISE DAILY
    ---------------------------------------------- */

    masturbation: {

        startDate:
            localStorage.getItem(
                "masturbationStartDate"
            ),

        completedDays:
            JSON.parse(
                localStorage.getItem(
                    "masturbationCompletedDays"
                )
            ) || []

    }

};


/* ==================================================
   GET CURRENT CHALLENGE
================================================== */

function getChallenge() {

    return challenges[
        currentChallenge
    ];

}


/* ==================================================
   SWITCH BETWEEN CHALLENGES
================================================== */

function switchChallenge(
    challenge
) {

    currentChallenge =
        challenge;


    document
        .getElementById(
            "pornButton"
        )
        .classList
        .remove("active");


    document
        .getElementById(
            "masturbationButton"
        )
        .classList
        .remove("active");


    if (
        challenge === "porn"
    ) {

        document
            .getElementById(
                "pornButton"
            )
            .classList
            .add("active");

    } else {

        document
            .getElementById(
                "masturbationButton"
            )
            .classList
            .add("active");

    }


    render();

}


/* ==================================================
   START CHALLENGE
================================================== */

function startChallenge() {

    const challenge =
        getChallenge();


    if (
        challenge.startDate
    ) {

        return;

    }


    const today =
        new Date();


    challenge.startDate =
        formatDate(today);


    challenge.completedDays =
        [];


    saveChallenge();


    render();

}


/* ==================================================
   FORMAT DATE FOR STORAGE
================================================== */

function formatDate(
    date
) {

    const year =
        date.getFullYear();


    const month =
        String(
            date.getMonth() + 1
        ).padStart(
            2,
            "0"
        );


    const day =
        String(
            date.getDate()
        ).padStart(
            2,
            "0"
        );


    return (
        year +
        "-" +
        month +
        "-" +
        day
    );

}


/* ==================================================
   GET CHALLENGE DATE
================================================== */

function getChallengeDate(
    dayNumber
) {

    const challenge =
        getChallenge();


    const date =
        new Date(
            challenge.startDate +
            "T00:00:00"
        );


    date.setDate(
        date.getDate() +
        dayNumber -
        1
    );


    return date;

}


/* ==================================================
   GET TODAY'S CHALLENGE DAY
================================================== */

function getCurrentChallengeDay() {

    const challenge =
        getChallenge();


    if (
        !challenge.startDate
    ) {

        return 0;

    }


    const today =
        new Date();


    const start =
        new Date(
            challenge.startDate +
            "T00:00:00"
        );


    today.setHours(
        0,
        0,
        0,
        0
    );


    start.setHours(
        0,
        0,
        0,
        0
    );


    const difference =
        Math.floor(
            (
                today -
                start
            ) /
            (
                1000 *
                60 *
                60 *
                24
            )
        );


    return difference + 1;

}


/* ==================================================
   GET EFFECTIVE CURRENT DAY
================================================== */

function getEffectiveCurrentDay() {

    const currentDay =
        getCurrentChallengeDay();


    /*
       If challenge is older than 30 days,
       don't go above Day 30.
    */

    if (
        currentDay > TOTAL_DAYS
    ) {

        return TOTAL_DAYS;

    }


    return currentDay;

}


/* ==================================================
   FORMAT DISPLAY DATE
================================================== */

function displayDate(
    date
) {

    return date.toLocaleDateString(
        "en-US",
        {
            month: "short",
            day: "numeric"
        }
    );

}


/* ==================================================
   FORMAT LONG DATE
================================================== */

function displayLongDate(
    date
) {

    return date.toLocaleDateString(
        "en-US",
        {
            month: "long",
            day: "numeric",
            year: "numeric"
        }
    );

}


/* ==================================================
   CREATE CALENDAR
================================================== */

function createCalendar() {

    const calendar =
        document.getElementById(
            "calendarDays"
        );


    calendar.innerHTML = "";


    const challenge =
        getChallenge();


    if (
        !challenge.startDate
    ) {

        return;

    }


    /*
       Get Day 1 date.
    */

    const firstDate =
        getChallengeDate(1);


    /*
       Determine weekday.
    */

    const startingDay =
        firstDate.getDay();


    /*
       Add empty spaces.
    */

    for (
        let i = 0;
        i < startingDay;
        i++
    ) {

        const empty =
            document.createElement(
                "div"
            );


        empty.className =
            "empty";


        calendar.appendChild(
            empty
        );

    }


    /*
       Get today's challenge day.
    */

    const currentDay =
        getCurrentChallengeDay();


    /*
       Create 30 days.
    */

    for (
        let i = 1;
        i <= TOTAL_DAYS;
        i++
    ) {

        const date =
            getChallengeDate(i);


        const day =
            document.createElement(
                "div"
            );


        day.className =
            "day";


        /*
           Completed.
        */

        const isCompleted =
            challenge
                .completedDays
                .includes(i);


        if (
            isCompleted
        ) {

            day.classList.add(
                "completed"
            );

        }


        /*
           Today.
        */

        if (
            i === currentDay
        ) {

            day.classList.add(
                "today"
            );

        }


        /*
           Future.
        */

        if (
            i > currentDay
        ) {

            day.classList.add(
                "locked"
            );

        }


        /*
           Day number.
        */

        const dayNumber =
            document.createElement(
                "div"
            );


        dayNumber.className =
            "day-number";


        dayNumber.textContent =
            "Day " + i;


        /*
           Date.
        */

        const dayDate =
            document.createElement(
                "div"
            );


        dayDate.className =
            "day-date";


        dayDate.textContent =
            displayDate(date);


        day.appendChild(
            dayNumber
        );


        day.appendChild(
            dayDate
        );


        /*
           Completed checkmark.
        */

        if (
            isCompleted
        ) {

            const check =
                document.createElement(
                    "div"
                );


            check.className =
                "checkmark";


            check.textContent =
                "✓";


            day.appendChild(
                check
            );


            const status =
                document.createElement(
                    "div"
                );


            status.className =
                "day-status";


            status.textContent =
                "Completed";


            day.appendChild(
                status
            );

        }


        /*
           Today status.
        */

        else if (
            i === currentDay
        ) {

            const status =
                document.createElement(
                    "div"
                );


            status.className =
                "day-status";


            status.textContent =
                "Tap to complete";


            day.appendChild(
                status
            );

        }


        /*
           Future lock.
        */

        else if (
            i > currentDay
        ) {

            const lock =
                document.createElement(
                    "div"
                );


            lock.className =
                "lock-icon";


            lock.textContent =
                "🔒";


            day.appendChild(
                lock
            );

        }


        /*
           Click behavior.
        */

        day.addEventListener(
            "click",
            function() {

                toggleDay(i);

            }
        );


        calendar.appendChild(
            day
        );

    }

}


/* ==================================================
   TOGGLE TODAY
================================================== */

function toggleDay(
    dayNumber
) {

    const challenge =
        getChallenge();


    /*
       Challenge not started.
    */

    if (
        !challenge.startDate
    ) {

        return;

    }


    /*
       Get current challenge day.
    */

    const currentDay =
        getCurrentChallengeDay();


    /*
       Future day.
    */

    if (
        dayNumber >
        currentDay
    ) {

        alert(
            "🔒 This day is locked.\n\nYou can only check today's day."
        );


        return;

    }


    /*
       Previous day.
    */

    if (
        dayNumber <
        currentDay
    ) {

        alert(
            "Previous days cannot be changed."
        );


        return;

    }


    /*
       Already completed.
    */

    if (
        challenge
            .completedDays
            .includes(dayNumber)
    ) {

        alert(
            "Today's day is already completed! ✓"
        );


        return;

    }


    /*
       Complete today.
    */

    challenge
        .completedDays
        .push(
            dayNumber
        );


    challenge
        .completedDays
        .sort(
            (a, b) =>
                a - b
        );


    saveChallenge();


    render();

}


/* ==================================================
   SAVE CHALLENGE
================================================== */

function saveChallenge() {

    const challenge =
        getChallenge();


    if (
        currentChallenge ===
        "porn"
    ) {

        localStorage.setItem(
            "pornStartDate",
            challenge.startDate
        );


        localStorage.setItem(
            "pornCompletedDays",
            JSON.stringify(
                challenge.completedDays
            )
        );


    } else {

        localStorage.setItem(
            "masturbationStartDate",
            challenge.startDate
        );


        localStorage.setItem(
            "masturbationCompletedDays",
            JSON.stringify(
                challenge.completedDays
            )
        );

    }

}


/* ==================================================
   CURRENT STREAK
================================================== */

function calculateCurrentStreak() {

    const challenge =
        getChallenge();


    const completed =
        challenge.completedDays;


    if (
        completed.length === 0
    ) {

        return 0;

    }


    /*
       Find the most recently completed day.
    */

    let latest =
        completed[
            completed.length - 1
        ];


    let streak = 0;


    /*
       Count backwards from the
       latest completed day.
    */

    for (
        let day = latest;
        day >= 1;
        day--
    ) {

        if (
            completed.includes(day)
        ) {

            streak++;

        } else {

            break;

        }

    }


    return streak;

}


/* ==================================================
   BEST STREAK
================================================== */

function calculateBestStreak() {

    const challenge =
        getChallenge();


    let best = 0;


    let streak = 0;


    for (
        let i = 1;
        i <= TOTAL_DAYS;
        i++
    ) {

        if (
            challenge
                .completedDays
                .includes(i)
        ) {

            streak++;


            if (
                streak >
                best
            ) {

                best =
                    streak;

            }


        } else {

            streak = 0;

        }

    }


    return best;

}


/* ==================================================
   UPDATE STATS
================================================== */

function updateStats() {

    const challenge =
        getChallenge();


    const completed =
        challenge
            .completedDays
            .length;


    const percentage =
        Math.round(
            (
                completed /
                TOTAL_DAYS
            ) * 100
        );


    const currentStreak =
        calculateCurrentStreak();


    const bestStreak =
        calculateBestStreak();


    document.getElementById(
        "completedCount"
    ).textContent =
        completed;


    document.getElementById(
        "currentStreak"
    ).textContent =
        currentStreak;


    document.getElementById(
        "bestStreak"
    ).textContent =
        bestStreak;


    document.getElementById(
        "percentage"
    ).textContent =
        percentage + "%";


    document.getElementById(
        "progressFill"
    ).style.width =
        percentage + "%";


    /*
       Challenge completion.
    */

    const completion =
        document.getElementById(
            "completionMessage"
        );


    if (
        completed >= TOTAL_DAYS
    ) {

        completion.classList.add(
            "visible"
        );


    } else {

        completion.classList.remove(
            "visible"
        );

    }

}


/* ==================================================
   UPDATE CALENDAR TITLE
================================================== */

function updateCalendarTitle() {

    const title =
        document.getElementById(
            "calendarTitle"
        );


    if (
        currentChallenge ===
        "porn"
    ) {

        title.textContent =
            "📖 Read Daily";


    } else {

        title.textContent =
            "🏃 Exercise Daily";

    }

}


/* ==================================================
   UPDATE START BOX
================================================== */

function updateStartBox() {

    const challenge =
        getChallenge();


    const message =
        document.getElementById(
            "startMessage"
        );


    const button =
        document.getElementById(
            "startButton"
        );


    const info =
        document.getElementById(
            "challengeInfo"
        );


    /*
       Challenge started.
    */

    if (
        challenge.startDate
    ) {

        const startDate =
            new Date(
                challenge.startDate +
                "T00:00:00"
            );


        const endDate =
            new Date(startDate);


        endDate.setDate(
            endDate.getDate() +
            TOTAL_DAYS -
            1
        );


        message.textContent =
            "Your challenge is in progress.";


        button.style.display =
            "none";


        info.classList.add(
            "visible"
        );


        document.getElementById(
            "startDateDisplay"
        ).textContent =
            displayLongDate(
                startDate
            );


        document.getElementById(
            "endDateDisplay"
        ).textContent =
            displayLongDate(
                endDate
            );


        document.getElementById(
            "challengeName"
        ).textContent =
            currentChallenge === "porn"
                ? "📖 Read Daily"
                : "🏃 Exercise Daily";


        const currentDay =
            getCurrentChallengeDay();


        const effectiveDay =
            Math.min(
                Math.max(
                    currentDay,
                    1
                ),
                TOTAL_DAYS
            );


        if (
            currentDay > TOTAL_DAYS
        ) {

            document.getElementById(
                "challengeDay"
            ).textContent =
                "30 Days Finished";


        } else {

            document.getElementById(
                "challengeDay"
            ).textContent =
                "Day " +
                effectiveDay +
                " of " +
                TOTAL_DAYS;

        }


    }


    /*
       Challenge not started.
    */

    else {

        if (
            currentChallenge ===
            "porn"
        ) {

            message.textContent =
                "Your Read Daily challenge hasn't started yet.";


        } else {

            message.textContent =
                "Your Exercise Daily challenge hasn't started yet.";

        }


        button.style.display =
            "inline-block";


        info.classList.remove(
            "visible"
        );

    }

}


/* ==================================================
   GO TO TODAY
================================================== */

function goToToday() {

    const challenge =
        getChallenge();


    if (
        !challenge.startDate
    ) {

        alert(
            "Start your challenge first."
        );


        return;

    }


    const currentDay =
        getCurrentChallengeDay();


    if (
        currentDay < 1
    ) {

        return;

    }


    /*
       Find today's calendar element.
    */

    const days =
        document.querySelectorAll(
            ".day"
        );


    days.forEach(
        function(day) {

            day.style.outline =
                "";

        }
    );


    /*
       Calendar contains empty boxes
       before Day 1, so find by
       the Day number.
    */

    days.forEach(
        function(day) {

            const number =
                day.querySelector(
                    ".day-number"
                );


            if (
                number &&
                number.textContent ===
                "Day " +
                Math.min(
                    currentDay,
                    TOTAL_DAYS
                )
            ) {

                day.scrollIntoView({
                    behavior: "smooth",
                    block: "center"
                });


                day.style.outline =
                    "3px solid #71717a";


                setTimeout(
                    function() {

                        day.style.outline =
                            "";

                    },
                    1200
                );

            }

        }
    );

}


/* ==================================================
   RESET CHALLENGE
================================================== */

function resetChallenge() {

    const challenge =
        getChallenge();


    const challengeName =
        currentChallenge ===
        "porn"
            ? "Read Daily"
            : "Exercise Daily";


    const answer =
        confirm(
            "Reset your " +
            challengeName +
            " challenge?\n\n" +
            "All progress for this challenge will be deleted."
        );


    if (
        !answer
    ) {

        return;

    }


    /*
       Clear current challenge.
    */

    challenge.startDate =
        null;


    challenge.completedDays =
        [];


    /*
       Remove localStorage.
    */

    if (
        currentChallenge ===
        "porn"
    ) {

        localStorage.removeItem(
            "pornStartDate"
        );


        localStorage.removeItem(
            "pornCompletedDays"
        );


    } else {

        localStorage.removeItem(
            "masturbationStartDate"
        );


        localStorage.removeItem(
            "masturbationCompletedDays"
        );

    }


    render();

}


/* ==================================================
   RENDER EVERYTHING
================================================== */

function render() {

    updateCalendarTitle();


    updateStartBox();


    createCalendar();


    updateStats();

}


/* ==================================================
   START
================================================== */

render();