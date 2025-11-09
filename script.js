document.addEventListener('DOMContentLoaded', function() {

    const ADMIN_PASSWORD = "ADMINPass_2025";
    
    document.getElementById('messengerIcon').onclick = function(event) {
        event.stopPropagation();
        document.getElementById('invitePopup').classList.add('visible');
        loadResponses();
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
        const selectedDate = document.querySelector('input[name="dateOption"]:checked').value;

        if (!name) {
            alert('Please enter your name');
            return;
        }

        let responses = JSON.parse(localStorage.getItem('gradResponses') || '[]');

            if (responses.some(r => r.name.toLowerCase() === name.toLowerCase())) {
                alert('You have already submitted an RSVP!');
                return;
            }

            const response = {
                name: name,
                date: selectedDate,
                timestamp: Date.now()
            };

            responses.push(response);
            localStorage.setItem('gradResponses', JSON.stringify(responses));
        
        
        document.getElementById('successMessage').style.display = 'block';
        setTimeout(() => {
            document.getElementById('successMessage').style.display = 'none';
        }, 3000);

        document.getElementById('guestName').value = '';
        document.getElementById('dec18').checked = true;

        loadResponses();
        document.getElementById('responseSection').style.display = 'block';
    };

    // PASSWORD-PROTECTED VIEW RESPONSES - Keep only this one!
    document.getElementById('viewResponses').onclick = function(event) {
        event.stopPropagation();
        
        // Prompt for password
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
            responses.sort((a, b) => b.timestamp - a.timestamp);
            const recentResponses = responses.slice(0, 10);

            recentResponses.forEach(response => {
                const item = document.createElement('div');
                item.className = 'responseItem';
                item.innerHTML = `
                    <span class="responseName">${response.name}</span>
                    <span class="responseDate">${response.date === 'dec18' ? 'Dec 18' : 'Alt Date'}</span>
                `;
                responseList.appendChild(item);
            });
        }
    }
});


//Deployment ID
//AKfycbxkqUUPOA2djtaZTQR1HO2dP_DpOipQngxggYPovangh0F6HMd04Z3JDuMCOvO_W_wb
//Web app
//URL
//https://script.google.com/macros/s/AKfycbxkqUUPOA2djtaZTQR1HO2dP_DpOipQngxggYPovangh0F6HMd04Z3JDuMCOvO_W_wb/exec
