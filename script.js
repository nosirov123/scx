const API_URL = 'https://6889aed84c55d5c7395318b4.mockapi.io/users';

// Kontaktlarni olish va ko'rsatish (GET)
async function fetchContacts() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('Kontaktlarni olishda xato');
        const contacts = await response.json();
        const contactList = document.getElementById('contactList');
        contactList.innerHTML = '';

        contacts.forEach(contact => {
            const contactDiv = document.createElement('div');
            contactDiv.className = 'contact-item';
            contactDiv.innerHTML = `
                <div>
                    <strong>${contact.name}</strong><br>
                    Raqam: ${contact.number}
                </div>
                <button class="edit-btn" data-id="${contact.id}"><i class="fa-solid fa-pen-to-square"></i></button>
                <button class="delete-btn" data-id="${contact.id}"><i class="fa-solid fa-trash"></i></button>
            `;
            contactList.appendChild(contactDiv);
        });

        // Delete va Edit tugmalariga hodisa tinglovchilarni qo'shish
        document.querySelectorAll('.delete-btn').forEach(button => {
            button.addEventListener('click', async (e) => {
                const contactId = e.currentTarget.dataset.id;
                await deleteContact(contactId);
            });
        });

        document.querySelectorAll('.edit-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const contactId = e.currentTarget.dataset.id;
                showEditForm(contactId);
            });
        });
    } catch (error) {
        console.error('Kontaktlarni olishda xato:', error);
    }
}

// Kontakt qo'shish (POST)
document.getElementById('contactForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value.trim();
    const number = document.getElementById('number').value.trim();

    if (!name || !number) return;

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, number })
        });

        if (response.ok) {
            document.getElementById('contactForm').reset();
            fetchContacts();
        } else {
            throw new Error('Kontakt qo\'shishda xato');
        }
    } catch (error) {
        console.error('Kontakt qo\'shishda xato:', error);
    }
});

// Kontaktni o'chirish (DELETE)
async function deleteContact(contactId) {
    try {
        const response = await fetch(`${API_URL}/${contactId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (response.ok) {
            fetchContacts();
        } else {
            throw new Error('Kontaktni o\'chirishda xato');
        }
    } catch (error) {
        console.error('Kontaktni o\'chirishda xato:', error);
    }
}

// Kontaktni tahrirlash formasini ko'rsatish
async function showEditForm(contactId) {
    try {
        const response = await fetch(`${API_URL}/${contactId}`);
        if (!response.ok) throw new Error('Kontakt ma\'lumotlarini olishda xato');
        const contact = await response.json();

        const contactList = document.getElementById('contactList');
        const existingEditForm = document.querySelector('.edit-form');
        if (existingEditForm) existingEditForm.remove();

        const editForm = document.createElement('div');
        editForm.className = 'edit-form';
        editForm.innerHTML = `
            <form id="editForm-${contactId}">
                <input type="text" id="editName" value="${contact.name}" required>
                <input type="text" id="editNumber" value="${contact.number}" required>
                <button type="submit">Saqlash</button>
                <button type="button" class="cancel-btn">Bekor qilish</button>
            </form>
        `;
        contactList.appendChild(editForm);

        // Saqlash
        document.getElementById(`editForm-${contactId}`).addEventListener('submit', async (e) => {
            e.preventDefault();
            const updatedName = document.getElementById('editName').value.trim();
            const updatedNumber = document.getElementById('editNumber').value.trim();

            if (!updatedName || !updatedNumber) return;

            try {
                const response = await fetch(`${API_URL}/${contactId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        name: updatedName,
                        number: updatedNumber
                    })
                });

                if (response.ok) {
                    contactList.removeChild(editForm);
                    fetchContacts();
                } else {
                    throw new Error('Kontaktni tahrirlashda xato');
                }
            } catch (error) {
                console.error('Kontaktni tahrirlashda xato:', error);
            }
        });

        // Bekor qilish
        document.querySelector('.cancel-btn').addEventListener('click', () => {
            contactList.removeChild(editForm);
        });
    } catch (error) {
        console.error('Kontaktni tahrirlash formasini olishda xato:', error);
    }
}

// Sahifa yuklanganda kontaktlarni olish
fetchContacts();