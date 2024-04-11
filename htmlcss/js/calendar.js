document.addEventListener('DOMContentLoaded', function() {
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    let currentYear = new Date().getFullYear();
    let currentMonth = new Date().getMonth();

    const monthSelect = document.getElementById("monthSelect");
    const yearSelect = document.getElementById("yearSelect");
    const calendarBody = document.getElementById("calendar").getElementsByTagName("tbody")[0];

    months.forEach((month, index) => {
        let option = new Option(month, index);
        monthSelect.add(option);
    });

    for (let year = currentYear - 10; year <= currentYear + 10; year++) {
        let option = new Option(year, year);
        yearSelect.add(option);
    }

    monthSelect.value = currentMonth;
    yearSelect.value = currentYear;

    function generateCalendar(month, year) {
        currentMonth = month;
        currentYear = year;
        calendarBody.innerHTML = ''; 

        let firstDay = new Date(year, month).getDay();
        let daysInMonth = 32 - new Date(year, month, 32).getDate();

        let date = 1;
        for (let i = 0; i < 6; i++) {
            let row = document.createElement('tr');
            for (let j = 0; j < 7; j++) {
                if (i === 0 && j < firstDay) {
                    let cell = document.createElement('td');
                    let cellText = document.createTextNode('');
                    cell.appendChild(cellText);
                    row.appendChild(cell);
                } else if (date > daysInMonth) {
                    break;
                } else {
                    let cell = document.createElement('td');
                    let cellText = document.createTextNode(date);
                    cell.setAttribute('data-has-entries', 'false'); 
                    if (date === new Date().getDate() && year === new Date().getFullYear() && month === new Date().getMonth()) {
                        cell.classList.add('today');
                    }
                    cell.appendChild(cellText);
                    row.appendChild(cell);
                    date++;
                }
            }
            calendarBody.appendChild(row);
            if (date > daysInMonth) {
                break; 
            }
        }

        document.querySelectorAll('#calendar td').forEach(dayCell => {
            const day = dayCell.textContent;
            fetch(`/get_journal_entries/?date=${year}-${month + 1}-${day}`)
                .then(response => response.json())
                .then(data => {
                    if (data.entries.length > 0) {
                        dayCell.setAttribute('data-has-entries', 'true'); 
                        dayCell.classList.add('has-entries');
                    }
                })
                .catch(error => {
                    console.error('Error fetching journal entries:', error);
                });
            

            dayCell.addEventListener('click', function() {
                const selectedDay = this.textContent; 
                
                if (selectedDay) {
                    const dateString = `${selectedDay} ${months[month]} ${year}`;
                    const modalText = document.getElementById('modalText');
                    modalText.textContent = `Events happening on: ${dateString}`;
                    const paragraph = document.createElement('p');
                    paragraph.textContent = "\n 11 pm -Webinar to spread awareness about Sepsis.";
                    modalText.appendChild(paragraph);

                    
                    fetch(`/get_journal_entries/?date=${year}-${month + 1}-${selectedDay}`)
                    .then(response => response.json())
                    .then(data => {
                        let entriesHtml = '';
                        if (data.entries.length > 0) {
                            this.setAttribute('data-has-entries', 'true'); 
                        }
                        
                        data.entries.forEach(entry => {
                            if (!entry.deleted) {
                                entriesHtml += `
                                    <div class="journal-entry-box">
                                        <div class="journal-entry copy-div mt-4">
                                            <h3 class="mt-4">${entry.title}</h3>
                                            <p class="mt-4">${entry.text}</p>
                                            <p class="mt-4">Feeling: ${getMoodEmoji(entry.mood)}</p>
                                        </div>
                                    </div>
                                `;
                            }
                        });
                        document.getElementById('modalJournalEntries').innerHTML = entriesHtml;
                    })
                    .catch(error => {
                        console.error('Error fetching journal entries:', error);
                    });

                    document.getElementById('modal').style.display = 'block'; 
                }
            });
        });
        
       
        document.querySelector('.close').addEventListener('click', function() {
            document.getElementById('modal').style.display = 'none';
        });
    
        
        window.addEventListener('click', function(event) {
            if (event.target == document.getElementById('modal')) {
                document.getElementById('modal').style.display = 'none';
            }
        });
    }

    document.getElementById("prevMonth").addEventListener("click", function() {
        if (currentMonth === 0) {
            currentMonth = 11;
            currentYear--;
        } else {
            currentMonth--;
        }
        generateCalendar(currentMonth, currentYear);
        monthSelect.value = currentMonth;
        yearSelect.value = currentYear;
    });

    document.getElementById("nextMonth").addEventListener("click", function() {
        if (currentMonth === 11) {
            currentMonth = 0;
            currentYear++;
        } else {
            currentMonth++;
        }
        generateCalendar(currentMonth, currentYear);
        monthSelect.value = currentMonth;
        yearSelect.value = currentYear;
    });

    document.getElementById("goToDate").addEventListener("click", function() {
        currentMonth = parseInt(monthSelect.value);
        currentYear = parseInt(yearSelect.value);
        generateCalendar(currentMonth, currentYear);
    });

    generateCalendar(currentMonth, currentYear);
});



