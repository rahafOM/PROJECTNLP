const axios = require("axios");
const meaningCloud = "https://api.meaningcloud.com/sentiment-2.1";


// Function to analyze a given URL using the MeaningCloud API
const analyze = async (url, key) => {
    console.log("Analyzing URL with key:", url, key); // Debug log
    try {
        const response = await axios.get(`${meaningCloud}?key=${key}&url=${url}&lang=en`);
        const { code } = response.data.status;

        // Handle errors based on status code
        if (code == 100) {
            return handleError(code, "Please enter a valid URL");
        } else if (code == 212) {
            return handleError(code, response.data.status.msg);
        }

        // Return success response
        return successResponse(response.data, code);
    } catch (error) {
        // Handle any other errors (e.g., network issues)
        return handleError(500, "Internal Server Error");
    }
};

// Function to handle errors
const handleError = (code, msg) => {
    return {
        code: code,
        msg: msg
    };
};

// Function to prepare a successful response
const successResponse = (data, code) => {
    const { score_tag, agreement, subjectivity, confidence, irony } = data;
    const sample = {
        score_tag: score_tag,
        agreement: agreement,
        subjectivity: subjectivity,
        confidence: confidence,
        irony: irony
    };
    return { sample, code };
};

module.exports = {
    analyze
};
