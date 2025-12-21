document.getElementById('registrationForm').addEventListener('submit', function(event) {
    const errorDisplay = document.getElementById('error-display');
    errorDisplay.style.display = 'none';
    errorDisplay.innerHTML = '';

    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const eircode = document.getElementById('eircode').value.toUpperCase();

    let errors = [];

    // First/Second Name: Alphanumeric and max 20 characters.
    if (!/^[a-zA-Z0-9]{1,20}$/.test(firstName)) {
        errors.push("First Name must be alphanumeric and between 1 and 20 characters.");
    }
    if (!/^[a-zA-Z0-9]{1,20}$/.test(lastName)) {
        errors.push("Last Name must be alphanumeric and between 1 and 20 characters.");
    }

    // Email: Valid format.
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        errors.push("Please enter a valid Email address.");
    }

    // Phone: Exactly 10 digits, numbers only.
    if (!/^[0-9]{10}$/.test(phone)) {
        errors.push("Phone number must be exactly 10 digits.");
    }

    // Eircode: Exactly 6 characters, alphanumeric, must start with a number.
    if (!/^[0-9][A-Z0-9]{5}$/.test(eircode)) {
        errors.push("Eircode must be 6 alphanumeric characters and start with a number (e.g., 123ABC).");
    }

    if (errors.length > 0) {
        event.preventDefault(); // Stop form submission
        errorDisplay.style.display = 'block';
        errorDisplay.innerHTML = errors.join('<br>');
    }
});

