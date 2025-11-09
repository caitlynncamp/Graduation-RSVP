document.addEventListener('DOMContentLoaded', function() {

    const ADMIN_PASSWORD = "ADMINPass_2025";
    
    document.getElementById('messengerIcon').onclick = function(event) {
        event.stopPropagation();
        document.getElementById('invitePopup').classList.add('visible');
    };

    document.getElementById('closePopup').onclick = function(event) {
        event.stopPropagation();
        document.getElementById('invitePopup').classList.remove('visible');
        document.getElementById('responseSection').style.display = 'none';
        document.getElementById('successMessage').style.display = 'none';
    };

    document.getElementById('submitRsvp').onclick = function(event) {
        event.stopPropagation();
        const name = document.getElementById('guestName').value.trim();
        const number = document.getElementById('guestNumber').value.trim();
        const email = document.getElementById('guestEmail').value.trim();
        const selectedDate = document.querySelector('input[name="dateOption"]:checked').value;

        if (!name) {
            alert('Please enter your name');
            return;
        }

        // Check for duplicate locally first
        let responses = JSON.parse(localStorage.getItem('gradResponses') || '[]');
        
        if (responses.some(r => r.name.toLowerCase() === name.toLowerCase())) {
            alert('You have already submitted an RSVP!');
            return;
        }

        const response = {
            name: name,
            number: number,
            email: email,
            date: selectedDate,
            timestamp: new Date().toISOString()
        };

        // Send to Google Sheets
        fetch('https://script.google.com/macros/s/AKfycbxkqUUPOA2djtaZTQR1HO2dP_DpOipQngxggYPovangh0F6HMd04Z3JDuMCOvO_W_wb/exec', {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(response)
        })
        .then(() => {
            // Save locally
            responses.push(response);
            localStorage.setItem('gradResponses', JSON.stringify(responses));
            
            // Show success message
            document.getElementById('successMessage').style.display = 'block';
            setTimeout(() => {
                document.getElementById('successMessage').style.display = 'none';
            }, 3000);

            // Clear form
            document.getElementById('guestName').value = '';
            document.getElementById('guestNumber').value = '';
            document.getElementById('guestEmail').value = '';
            document.getElementById('dec18').checked = true;
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error submitting RSVP. Please try again.');
        });
    };

    // PASSWORD-PROTECTED VIEW RESPONSES
    document.getElementById('viewResponses').onclick = function(event) {
        event.stopPropagation();
        
        const password = prompt('Enter admin password to view responses:');
        
        if (password === ADMIN_PASSWORD) {
            loadResponses();
            const responseSection = document.getElementById('responseSection');
            if (responseSection.style.display === 'none') {
                responseSection.style.display = 'block';
            } else {
                responseSection.style.display = 'none';
            }
        } else if (password !== null) {
            alert('Incorrect password!');
        }
    };

    function loadResponses() {
        const responses = JSON.parse(localStorage.getItem('gradResponses') || '[]');

        const dec18Count = responses.filter(r => r.date === 'dec18').length;
        const altDateCount = responses.filter(r => r.date === 'altDate').length;

        document.getElementById('dec18Count').textContent = dec18Count;
        document.getElementById('altDateCount').textContent = altDateCount;

        const responseList = document.getElementById('responseList');
        responseList.innerHTML = '';

        if (responses.length === 0) {
            responseList.innerHTML = '<p style="text-align: center; color: #666;">No responses yet</p>';
        } else {
            responses.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
            const recentResponses = responses.slice(0, 10);

            recentResponses.forEach(response => {
                const item = document.createElement('div');
                item.className = 'responseItem';
                item.innerHTML = `
                    <span class="responseName">${response.name}</span>
                    <span class="responseDate">${response.date === 'dec18' ? 'Dec 18' : 'Dec 14'}</span>
                `;
                responseList.appendChild(item);
            });
        }
    }
});