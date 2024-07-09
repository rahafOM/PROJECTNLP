import axios from "axios";

//calling the isValidUrl function to use after sumission
const { isValidUrl } = require("./checkURL");

const input = document.getElementById("URI");
const btn = document.getElementById("submit");

//handle input change
document.addEventListener('DOMContentLoaded', function () {
    input.addEventListener("change", (e)=>{
        e.preventDefault()
        hide_error()
        show_results(false)
    });
btn.addEventListener('click', e => handleSubmit(e))
});


// handle the submit
async function handleSubmit(e) {
    e.preventDefault();

    const url = input.value;

    if (!isValidUrl(url)) {
        show_error();
        document.getElementById("error").innerHTML = "Please, enter a valid URL";
        input.value = "";
        return;
    }
    console.log(url);
    loading(true);
    
    try {
        const { data } = await axios.post(
            'http://localhost:5020/',
            { url },  // Send the URL in the request body
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );
        console.log(data);  // Log the response data
        display_results(data);
    } catch (error) {
        console.error("Error:", error);
        show_error();
        document.getElementById("error").innerHTML = "An error occurred while processing your request.";
        loading(false);
    }
}

//showing the data on the ui
const display_results = data => {

    loading(false)
    if (data.msg) {
        show_error()
        show_results(false)
        document.getElementById("error").innerHTML = `${data.msg}`;

        return;
    }
    hide_error()
    show_results(true);

    const { sample }=data;

    document.getElementById("agreement").innerHTML = `Agreement: ${sample.agreement}`;
    document.getElementById("subjectivity").innerHTML = `Subjectivity: ${sample.subjectivity}`;
    document.getElementById("confidence").innerHTML = `Confidence: ${sample.confidence}`;
    document.getElementById("irony").innerHTML = `Irony: ${sample.irony}`;
    document.getElementById("score_tag").innerHTML = `Score Tag: ${sample.score_tag}`;
}


const loading = (bool) => {
    // loader
    const loader = document.getElementById('loader');
    //
    if (bool) {
        // Show the loader
        loader.style.display = 'block';
        return;
    }
    //hide the loader
    loader.style.display = 'none';

}

const show_results = (bool) => {
    if (bool) {
        document.querySelectorAll("ul li").forEach(element => {
            element.style.display = "block"
        })
        return;
    }
    document.querySelectorAll("ul li").forEach(element => {
        element.style.display = "none"
    })
    return;
}

const show_error = () => document.getElementById("error").style.display = "block";
const hide_error = () => document.getElementById("error").style.display = "none";

export { handleSubmit }
