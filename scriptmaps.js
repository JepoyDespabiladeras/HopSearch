// Replace with your Geoapify API key
const apiKey = "cc50496e1b5d49538867accb9c51ad98";

// Initialize the map
const map = L.map('map').setView([14.5995, 120.9842], 13); 

// Add Geoapify tile layer
L.tileLayer(`https://maps.geoapify.com/v1/tile/carto/{z}/{x}/{y}.png?&apiKey=${apiKey}`, {
    maxZoom: 20,
    attribution: '© OpenStreetMap contributors © Geoapify'
}).addTo(map);

const locations = [
    //CaviteC
    {
        name: "Major Danilo Atienza Hospital",
        lat: 14.49441,
        lng: 120.90496
    },
    {
        name: "Cavite Naval Hospital",
        lat: 14.48336,
        lng: 120.91603
    },
    {
        name: "Dela Cruz Maternity Hospital",
        lat: 14.483539234732962,
        lng: 120.89480893595129
    },
    {
        name: "Dr. Olivia Salamanca Memorial District Hospital",
        lat: 14.481210707509472,
        lng: 120.91150215586815
    },
    {
        name: "Cavite City MedCare Hospital",
        lat: 14.481210707509472,
        lng: 120.91150215586815
    },
    {
        name: "Bautista Hospital Medical Arts Bldg.",
        lat: 14.477961970657574,
        lng: 120.89365575109491
    },
    {
        name: "Bautista Hospital",
        lat: 14.477299014328048,
        lng: 120.89202080697235
    },
    {
        name: "Cavite City Medcare Hospital Sea Breeze",
        lat: 14.470140954502439,
        lng: 120.89071291636074
    },
    {
        name: "Cavite Medical Center Hospital",
        lat: 14.46341316622773,
        lng: 120.88197738770188
    },
//Noveleta
    {
        name: "St. Martin Maternity & Pediatric Hospital",
        lat: 14.425734379769859,
        lng: 120.87430883243691

    },
    {
        name: "Noveleta Medcare Center Hospital",
        lat: 14.427124564732528,
        lng: 120.88145545644119

    },
//Kawit
    {
        name: "Kalayaan Hospital Main Bldg.",
        lat: 14.416927431052592,
        lng: 120.89805666599251

    },
    {
        name: "San Pedro Calungsod Medical Hospital",
        lat: 14.427867651918943, 
        lng: 120.89471327803926

    },
    {
        name: "Kawit Maternity and General Hospital",
        lat: 14.446641926019716, 
        lng: 120.90617512659847

    },
    {
        name: "Binakayan Hospital and Medical Center, Inc.",

        lat: 14.45178165442842, 
        lng: 120.92590769979778

    },
    {
        name: "Kawit Kalayaan Hospital",
        lat: 14.416843608208469,
        lng: 120.89863333283998

    },
//Bacoor
    {
        name: "Crisostomo General Hospital",
        lat: 14.44927529822617,
        lng: 120.93332624134113

    },
    {
        name: "Southern Tagalog Regional Hospital",
        lat: 14.441445820988376, 
        lng: 120.94731499794439

    },
    {
        name: "Bacoor Doctors Medical Hospital",
        lat: 14.419850227580692, 
        lng: 120.96777135202008

    },
    {
        name: "Molino Doctors Hospital",
        lat: 14.410572597995552, 
        lng: 120.97597786758959

    },
    {
        name: "Cavite East Asia Medical Center & Hospital Inc.",
        lat: 14.40593433157762,
        lng: 120.97677014364088

    },
//Imus
    {
        name: "Imus Family Hospital",
        lat: 14.432551221998265, 
        lng: 120.94630231545011

    },
    {
        name: "Our Lady of the Pillar Medical Center",
        lat: 14.41932056782192, 
        lng: 120.93917481794539

    },
    {
        name: "Medical Center Imus",
        lat: 14.426274790637232, 
        lng: 120.94613160021916

    },
    {
        name: "Paredes Medical Center and Hospital",
        lat: 14.412949875661061, 
        lng: 120.94063544937808

    },
    {
        name: "Imus Health Hospital",
        lat: 14.409790520443106, 
        lng: 120.93697790951838

    },
    {
        name: "South Imus Specialist Hospital",
        lat: 14.376643762208706, 
        lng: 120.93466559743005

    },
//Rosario
    {
        name: "Our Savior Hospital",
        lat: 14.414273977209003, 
        lng: 120.85643514356002

    },
    {
        name: "Costa Verde Diagnostics Hospital",
        lat: 14.410192480988776, 
        lng: 120.85697241996837

    },
    {
        name: "FirstCare Medical Services Hospital",
        lat: 14.410307713918554, 
        lng: 120.8574015820875

    },
//General Trias
    {
        name: "GT Hospital",
        lat: 14.396674246581368,
        lng: 120.86305207731097

    },
    {
        name: "Divine Grace Medical Center Hospital",
        lat: 14.397953254399457, 
        lng: 120.86817466192205

    },
    {
        name: "City of General Trias Medicare Hospital",
        lat: 14.373976010795168, 
        lng: 120.88201381834533

    },
    {
        name: "Gentri Medical Center And Hospital Inc.",
        lat: 14.289334005347087, 
        lng: 120.90709787972143

    },
    {
        name: "Gentridoctors",
        lat: 14.291054437365718, 
        lng: 120.90393769301673

    },  
//Tanza
    {
        name: "Tanza Specialists Medical Center Hospital",
        lat: 14.393826082597291,
        lng: 120.85337701629702

    },
    {
        name: "Tanza Family General Hospital & Pharmacy",
        lat: 14.390379438018334, 
        lng: 120.84908580710288

    },
    {
        name: "Tanza Doctors Hospital",
        lat: 14.366302037076792, 
        lng: 120.81731991326377

    },
//Naic
    {
        name: "Amisa Medical Mission Hospital",
        lat: 14.32933180859538, 
        lng: 120.7785418919154

    },
    {
        name: "Naic Medicare Hospital",
        lat: 14.327158905113757,
        lng: 120.77596346592765

    },
    {
        name: "Naic Doctors Hospital",
        lat: 14.314515722327958, 
        lng: 120.77101320357177

    },
//Maragondon
    {
        name: "Cavite Municipal Hospital Maragondon",
        lat: 14.277422410419897, 
        lng: 120.7338626061458

    },
//Trece
    {
        name: "M. V. Santiago Medical Center",
        lat: 14.294349270195104,
        lng: 120.86626967605036

    },
    {
        name: "DBB Municipal Hospital",
        lat: 14.280559456447225, 
        lng: 120.86731484633852

    },
    {
        name: "TRECEÑO MEDICAL HOSPITAL",
        lat: 14.276660343772722, 
        lng: 120.87005685109315

    },
    {
        name: "Gen. Emilio Aguinaldo Memorial Hospital",
        lat: 14.276146198337063,
        lng: 120.86957585182283

    },
    {
        name: "Korea-Philippines Friendship Hospital",
        lat: 14.275779359626604, 
        lng: 120.87062244277718

    },
//Indang
    {
        name: "Indang Main Hospital",
        lat:  14.200286154167618, 
        lng:  120.8733009055129, 

    },
//Dasmariñas
    {
        name: "Dasmariñas City Medical Center Hospital",
        lat:  14.353092208135983, 
        lng:  120.98142199961987

    },
    {
        name: "GMF Hospital",
        lat:  14.328560364228867,  
        lng:  120.93802041857793

    },
    {
        name: "De La Salle University Medical Center Hospital",
        lat:  14.32719308048344,
        lng:  120.94342853542491

    },
    {
        name: "Dasmariñas Doctors Hospital, Inc.",
        lat:  14.321987479212586, 
        lng:  120.94335022286917

    },
    {
        name: "Prime Dasmariñas Medical Center",
        lat:  14.320686599850937, 
        lng:  120.94188731366631 

    },
    {
        name: "Medcor Dasmariñas Hospital and Medical Center",
        lat:  14.272601321527791,
        lng:  120.96592895702014

    },
    {
        name: "Asia Medic Family Hospital & Medical Center",
        lat:  14.298915010850399, 
        lng:  120.95661669504427

    },
     {
        name: "M. V Santiago Medical Primary Hospital",
        lat:  14.291650838411401,  
        lng:  120.93228719628864

    },
     {
        name: "St. Paul Hospital Cavite",
        lat:  14.323367618586019, 
        lng:  120.96293985002218

    },
     {
        name: "Pagamutan ng Dasmariñas",
        lat:  14.32298934597502,  
        lng:  120.96161924696592,

    },






]

// Add marker
locations.forEach(location => {
    L.marker([location.lat, location.lng])
        .addTo(map)
        .bindPopup(location.name);
});
// Add popup
const bounds = locations.map(loc => [loc.lat, loc.lng]);
map.fitBounds(bounds);
