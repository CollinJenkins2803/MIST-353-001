﻿'use strict';

/**
 * navbar toggle
 */

const navToggleBtn = document.querySelector("[data-nav-toggle-btn]");
const header = document.querySelector("[data-header]");

navToggleBtn.addEventListener("click", function () {
    this.classList.toggle("active");
    header.classList.toggle("active");
});



function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}

function showPosition(position) {
    document.getElementById('latTxt').value = position.coords.latitude;
    document.getElementById('longTxt').value = position.coords.longitude;
    getAddress(position.coords.latitude, position.coords.longitude);
}

async function getCoordinates(address) {
    const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${address}`);
    const data = await response.json();
    if (data.length > 0) {
        const coords = { lat: data[0].lat, lon: data[0].lon };
        displayCoordinates(coords);
    } else {
        displayCoordinates("No results found.");
    }
}

async function getAddress(lat, lon) {
    const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`);
    const data = await response.json();
    if (data.address) {
        const address = data.address;
        displayAddress(address);
    } else {
        displayAddress("No results found.");
    }
}

function displayAddress(address) {
    if (address['city']) {
        document.getElementById('locInp').value = address['city'] + ', ' + address['state'];
    } else if (address['town']) {
        document.getElementById('locInp').value = address['town'] + ', ' + address['state'];
    } else if (address['village']) {
        document.getElementById('locInp').value = address['village'] + ', ' + address['state'];
    }
}

function displayCoordinates(coords) {
    document.getElementById('results').innerHTML = `You searched for ` + JSON.stringify(coords);
    document.getElementById('latTxt').value = coords.lat;
    document.getElementById('longTxt').value = coords.lon;
}

function showResults() {
    const urlParams = new URLSearchParams(window.location.search);
    const location = urlParams.get('location');
    const latitude = urlParams.get('latitude');
    const longitude = urlParams.get('longitude');
    const results = document.getElementById('results');

    if (latitude && longitude) {
        results.innerHTML = `You searched for ${latitude}, ${longitude}.`;
        var map = L.map('map').setView([latitude, longitude], 13);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 18
        }).addTo(map);
    } else if (location) {
        getCoordinates(location);
    } else {
        results.innerHTML = 'You did not search for anything.';
    }
}

function addLocationFormListener() {
    document.getElementById('locationForm').addEventListener('submit', function (e) {
        e.preventDefault();
        var userInput = document.getElementById('locInp').value;
        var latitude = document.getElementById('latTxt').value;
        var longitude = document.getElementById('longTxt').value;

        if (latitude && longitude) {
            this.submit();
        } else {
            getCoordinates(userInput);
        }
    });
}

// Call the function to add the event listener to the form.
addLocationFormListener();